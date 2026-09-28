// Move the Naver Analytics snippet out of <head> so wcslog.js does not block
// first paint. The inline wcs_do() call stays immediately after the library
// tag, now just before </body>, so tracking still runs after the script loads.
// Idempotent: pages that already load it after </head> are left alone.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");

const BLOCK_RE = /<!-- Naver Analytics -->\r?\n<script type="text\/javascript" src="\/\/wcs\.pstatic\.net\/wcslog\.js"><\/script>\r?\n<script type="text\/javascript">\r?\nif\(!wcs_add\) var wcs_add = \{\};\r?\nwcs_add\["wa"\] = "1c1c692e90a9a80";\r?\nif\(window\.wcs\) \{\r?\n {2}wcs_do\(\);\r?\n\}\r?\n<\/script>\r?\n/;

function relocate(html) {
  const match = html.match(BLOCK_RE);
  if (!match) return { html, status: "missing" };
  const block = match[0];
  const headEnd = html.indexOf("</head>");
  const blockAt = html.indexOf(block);
  if (headEnd !== -1 && blockAt > headEnd) return { html, status: "already" };
  const without = html.replace(block, "");
  if (!without.includes("</body>")) return { html, status: "no-body" };
  return { html: without.replace("</body>", block + "</body>"), status: "moved" };
}

const files = fs.readdirSync(root).filter(name => name.endsWith(".html"));
const counts = { moved: 0, already: 0, missing: 0, "no-body": 0 };
const problems = [];

for (const name of files) {
  const filePath = path.join(root, name);
  const before = fs.readFileSync(filePath, "utf8");
  const result = relocate(before);
  counts[result.status] = (counts[result.status] || 0) + 1;
  if (result.status === "missing" || result.status === "no-body") problems.push(`${result.status}: ${name}`);
  if (result.html !== before) fs.writeFileSync(filePath, result.html);
}

console.log(`naver analytics: moved ${counts.moved}, already outside head ${counts.already}, missing ${counts.missing}, no </body> ${counts["no-body"]}`);
if (problems.length) {
  console.warn(problems.join("\n"));
  process.exitCode = 1;
}
