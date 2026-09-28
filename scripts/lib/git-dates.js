// Per-file dates from git history.
//
// Sitemap <lastmod> and blog Article dates must follow a page's real content
// change. A commit that only rewrites the asset cache-buster (?v=), moves the
// Naver analytics snippet, or injects Article/RSS metadata is not a content
// change — counting it would stamp every URL with the same day and make the
// next generator run rewrite those dates forever.
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "..");

const NAVER_LINES = new Set([
  "<!-- Naver Analytics -->",
  '<script type="text/javascript" src="//wcs.pstatic.net/wcslog.js"></script>',
  "<script type=\"text/javascript\">",
  "if(!wcs_add) var wcs_add = {};",
  'wcs_add["wa"] = "1c1c692e90a9a80";',
  "if(window.wcs) {",
  "  wcs_do();",
  "}",
  "</script>",
]);

function git(args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
}

function todayTaipei() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function formatTaipeiDot(iso) {
  const ymd = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
  return ymd.replaceAll("-", ".");
}

function loadFileHistory() {
  let out = "";
  try {
    out = git(["log", "--name-only", "--format=COMMIT%x09%H%x09%an%x09%cI%x09%cs%x09%s"]);
  } catch (err) {
    console.warn("git log unavailable, dates fall back to today:", err.message);
    return new Map();
  }

  const history = new Map();
  let current = null;
  for (const line of out.split("\n")) {
    if (!line) continue;
    if (line.startsWith("COMMIT\t")) {
      const parts = line.split("\t");
      current = {
        hash: parts[1],
        author: parts[2],
        iso: parts[3],
        day: parts[4],
        subject: parts.slice(5).join("\t"),
      };
      continue;
    }
    if (!current) continue;
    let file = line.trim();
    // Rare rename rendering: "old => new"
    const arrow = file.split(" => ");
    if (arrow.length === 2) file = arrow[1].replace(/[{}]/g, "");
    if (!file) continue;
    let commits = history.get(file);
    if (!commits) {
      commits = [];
      history.set(file, commits);
    }
    commits.push(current);
  }
  return history;
}

function scrubArticleJsonLd(line) {
  const match = line.match(/^(.*<script type="application\/ld\+json"[^>]*>)([\s\S]*)(<\/script>.*)$/);
  if (!match) return line;
  try {
    const data = JSON.parse(match[2]);
    const nodes = Array.isArray(data["@graph"]) ? data["@graph"] : [data];
    for (const node of nodes) {
      if (!node || node["@type"] !== "Article") continue;
      delete node.datePublished;
      delete node.dateModified;
      delete node.author;
      delete node.mainEntityOfPage;
      delete node.inLanguage;
    }
    return match[1] + JSON.stringify(data) + match[3];
  } catch {
    return line;
  }
}

function isSeoChromeLine(line) {
  const trimmed = line.trim();
  if (NAVER_LINES.has(trimmed) || NAVER_LINES.has(line)) return true;
  if (/^<meta property="article:(published|modified)_time" content="[^"]*" \/>$/.test(trimmed)) return true;
  if (/^<p class="blog-post-date">[\s\S]*<\/p>$/.test(trimmed)) return true;
  if (/^<p class="blog-post-author"[\s\S]*<\/p>$/.test(trimmed)) return true;
  if (/^<link rel="alternate" type="application\/rss\+xml"[^>]*>$/.test(trimmed)) return true;
  return false;
}

function diffIsMeaningful(diffText) {
  if (!diffText || !diffText.trim()) return false;
  if (diffText.includes("Binary files")) return true;

  const removed = [];
  const added = [];
  for (const line of diffText.split("\n")) {
    if (!line || line.startsWith("diff ") || line.startsWith("index ") || line.startsWith("---") || line.startsWith("+++") || line.startsWith("@@") || line.startsWith("\\ No newline")) {
      continue;
    }
    if (!line.startsWith("+") && !line.startsWith("-")) continue;
    let body = line.slice(1);
    if (isSeoChromeLine(body)) continue;
    body = body.replace(/\?v=\d+/g, "?v=X");
    body = scrubArticleJsonLd(body);
    if (line.startsWith("+")) added.push(body);
    else removed.push(body);
  }

  if (added.length !== removed.length) return true;
  added.sort();
  removed.sort();
  return added.some((line, i) => line !== removed[i]);
}

const meaningfulCache = new Map();

function commitIsMeaningful(hash, file) {
  const key = `${hash}\0${file}`;
  if (meaningfulCache.has(key)) return meaningfulCache.get(key);

  let hasParent = true;
  try {
    git(["rev-parse", "--verify", "--quiet", `${hash}^`]);
  } catch {
    hasParent = false;
  }

  let meaningful = true;
  if (hasParent) {
    let diff = "";
    try {
      diff = git(["diff", "-U0", `${hash}^`, hash, "--", file]);
    } catch {
      diff = "";
    }
    meaningful = diffIsMeaningful(diff);
  }
  meaningfulCache.set(key, meaningful);
  return meaningful;
}

function lastContentCommit(file, history) {
  const commits = history.get(file) || [];
  for (const commit of commits) {
    if (commitIsMeaningful(commit.hash, file)) return commit;
  }
  return commits[0] || null;
}

function firstCommit(file, history) {
  const commits = history.get(file) || [];
  return commits.length ? commits[commits.length - 1] : null;
}

function worktreeDiffMeaningful(file) {
  if (!fs.existsSync(path.join(root, file))) return true;
  let diff = "";
  try {
    diff = git(["diff", "-U0", "HEAD", "--", file]);
  } catch {
    return true;
  }
  // Untracked files have no HEAD diff; treat them as new content.
  let untracked = false;
  try {
    const status = git(["status", "--porcelain", "--", file]);
    untracked = status.startsWith("??");
  } catch {
    untracked = false;
  }
  if (untracked) return true;
  if (!diff.trim()) return false;
  return diffIsMeaningful(diff);
}

function dirtyContentFiles() {
  let out = "";
  try {
    out = git(["status", "--porcelain"]);
  } catch {
    return new Set();
  }
  const dirty = new Set();
  for (const line of out.split("\n")) {
    if (!line.trim()) continue;
    let file = line.slice(3);
    const arrow = file.indexOf(" -> ");
    if (arrow !== -1) file = file.slice(arrow + 4);
    if (file.startsWith('"') && file.endsWith('"')) file = file.slice(1, -1);
    if (worktreeDiffMeaningful(file)) dirty.add(file);
  }
  return dirty;
}

function lastmodDay(file, history, dirty) {
  if (dirty && dirty.has(file)) return todayTaipei();
  const commit = lastContentCommit(file, history);
  return commit ? commit.day : todayTaipei();
}

function blogDates(file, history) {
  const published = firstCommit(file, history);
  const modified = lastContentCommit(file, history);
  const fallback = new Date().toISOString();
  return {
    published: published ? published.iso : fallback,
    modified: modified ? modified.iso : fallback,
  };
}

module.exports = {
  root,
  todayTaipei,
  formatTaipeiDot,
  loadFileHistory,
  dirtyContentFiles,
  lastmodDay,
  blogDates,
  diffIsMeaningful,
};
