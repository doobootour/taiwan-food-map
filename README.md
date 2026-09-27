# 나만 알고 싶은 대만 맛집 · My Secret Taiwan Eats

대만 여행을 계획 중인 2030 여성을 타겟으로 한 "Golden Hour Taipei" 톤의 프리미엄 대만 맛집 지도 웹앱.
한국인을 비롯한 전 세계 여행자들이 직접 찾고 검증하는 31개 카테고리 맛집 지도입니다.

빌드 도구 없이 정적 HTML/CSS/JS + Supabase로 동작합니다.

## 페이지 구성

- `index.html` — 홈: 히어로, "무엇을 먹어볼까요?"(카테고리 필터 + 임베디드 지도, Supabase 실연동), 지역별 탐험
- `map.html` — Leaflet 지도, 카테고리 필터, 맛집 등록, 추천/비추천 투표 (Supabase 실연동)
- `profile.html` — 마이페이지: 내 활동 통계, 등급 진행도, 이달의 기여자 리더보드 (Supabase 실연동)

## 디자인 시스템

- 컬러/타이포/여백 토큰: `css/styles.css` 상단 `:root` 참고 (테라코타·크림·골드 팔레트)
- 디스플레이 폰트: Fraunces (세리프), 본문: Pretendard
- 카테고리 이미지 프롬프트 원본: `design/image-prompts.md`

## Supabase

- 프로젝트: `taiwan-food-map` (조직 `doobootour`, 리전 ap-northeast-1)
- 접속 정보는 `js/supabase-config.js`에 이미 설정되어 있습니다 (anon key는 공개해도 안전한 키이며, RLS 정책으로 접근을 제어합니다).
- 테이블: `eats`(맛집 스팟), `eats_confirmations`(추천/비추천 투표 로그) — 스키마는 Supabase 대시보드의 SQL Editor 또는 Table Editor에서 확인 가능합니다.
- 등급/리더보드는 별도 로그인 없이 브라우저에 저장되는 익명 ID(`tfm_uid`) 기준으로 집계됩니다.

## 로컬 실행

```bash
python -m http.server 5500
```

이후 `http://localhost:5500` 접속. (Node 환경이면 `npx serve .`도 가능)

## 배포

- 호스팅: Cloudflare Workers (정적 자산) — [taiwanbite.com](https://taiwanbite.com), GitHub(`doobootour/taiwan-food-map`) 연동으로 `main` 브랜치 push 시 자동 배포
- `wrangler.jsonc` / `.assetsignore` 참고 — `.git`, `.claude`, `scripts` 등은 배포 자산에서 제외됨
- 수동 배포가 필요하면 `npx wrangler deploy`

## SEO / 정적화 빌드 스크립트

이 사이트는 브라우저 클라이언트 JS로 화면을 그리지만(예: `js/blog.js`, `js/region.js`), 자바스크립트를 거의 실행하지 않는 크롤러(특히 네이버)는 raw HTML만 보기 때문에 아래 스크립트들이 **빌드 시점에 동일한 마크업을 미리 구워서 HTML에 심어둡니다.** 데이터 파일을 바꾼 뒤에는 해당 스크립트를 재실행하고, 결과로 바뀐 정적 HTML/`sitemap.xml`을 함께 커밋하세요.

- `node scripts/generate-region-pages.js` — `region-*.html`(9개), 홈 화면의 지역 카드(`#regionGrid`)와 카테고리 링크(`#categoryLinkRow`, 31개)를 `js/data.js` + `js/region-content.js` 기준으로 정적화. Supabase에서 지역별 등록 맛집(`eats` 테이블)도 함께 불러와 `#regionSpotsList`를 굽습니다.
- `node scripts/generate-category-pages.js` — `category-*.html`(31개)을 `js/data.js` + `js/category-content.js` 기준으로 정적화. 카테고리별 등록 맛집도 Supabase에서 불러와 함께 굽습니다.
- `node scripts/generate-blog-pages.js` — `blog-<slug>.html`(10개)의 본문(`#blogArticle`)을 `js/blog-content.js` 기준으로 정적화. **이 스크립트를 실행하지 않으면 블로그 글 본문이 raw HTML에는 비어 있고 JS 실행 후에만 보입니다.**
- `node scripts/generate-spot-pages.js` — Supabase `eats` 테이블에 등록된 맛집 하나하나에 대해 개별 상세 페이지(`<region>-<category>-<가게이름 slug>-<id>.html`)를, 그리고 "지역 × 메뉴" 조합마다(예: `taipei-beef_noodle.html`, 등록 3곳 이상인 조합만) 롱테일 랜딩 페이지를 생성합니다. 가게 이름이 한자/한글이라 라틴 문자로 못 바뀌면 이름 부분 없이 `<region>-<category>-<id>`로 대체됩니다. **맛집이 새로 등록될 때마다 재실행 필요**(781개 기준 실행됨 — 재실행 시 새 스팟만큼 페이지 수가 늘어남).
- `node scripts/generate-sitemap.js` — `sitemap.xml`을 지역/카테고리/조합/블로그 글/스팟 상세 페이지 전체 + `<lastmod>`(실행일 기준)로 재생성.

새로 등록되는 맛집이나 데이터 변경을 크롤러에도 반영하려면 위 스크립트를 주기적으로 재실행 + 재배포해야 합니다 — 신규 등록 빈도가 늘면 배포 파이프라인에 주기 실행(예: Cloudflare Cron Trigger나 GitHub Actions 스케줄)을 추가하는 것을 고려하세요.

### 스팟 상세 페이지 관련 참고

- `scripts/lib/spot-slug.js`가 슬러그 생성 로직의 단일 소스입니다 — `generate-region-pages.js`/`generate-category-pages.js`/`generate-spot-pages.js`/`generate-sitemap.js`가 모두 이 파일을 통해 슬러그를 만듭니다. 브라우저에서 직접 링크를 그리는 `js/region.js`/`js/category.js`는 모듈 공유가 안 되어 동일 로직을 중복 구현하고 있으니, 슬러그 규칙을 바꾸면 이 파일들도 함께 고쳐야 합니다.
- 등록된 맛집 중 리뷰 텍스트(`review`)나 주소(`address`)가 있는 비중이 낮아(각각 약 18%, 1%), 대부분의 스팟 페이지는 이름·좌표·구글맵 링크·지역/카테고리 소개 문단·근처 다른 맛집 링크로 구성됩니다 — 콘텐츠가 얇은 페이지가 많다는 뜻이므로, 실제 검색 유입 효과를 지켜보며 필요 시 리뷰/주소 입력을 유도하는 것을 고려하세요.

## 남은 작업

- [ ] 다국어(영/중/일) 실제 번역 텍스트 연결 — 현재 언어 전환 버튼은 UI만 구현됨
- [x] 이미지 압축/최적화 — 전체 WebP 전환 완료 (`assets/images` 36MB → 4.6MB), 소셜 공유용 OG 이미지는 호환성을 위해 별도 JPG(`*-og.jpg`)로 유지
- [x] 실제 호스팅 배포 — Cloudflare Workers, `taiwanbite.com`
- [x] GA4 트래킹 설치 (`G-R4BQHKRWZE`), JSON-LD 구조화 데이터(Organization/WebSite, BreadcrumbList, TouristDestination), 소개 페이지(`about.html`)
- [x] 지역 상세 페이지의 "여행자들이 등록한 진짜 맛집" 목록 정적화 — `scripts/generate-region-pages.js`가 빌드 시점에 Supabase에서 실제 데이터를 가져와 반영 (위 항목 참고)
- [ ] 네이버 서치어드바이저 사이트 등록 — 이 저장소 작업 환경에서는 `searchadvisor.naver.com` 접근이 브라우저 정책으로 차단되어 있어 직접 진행 필요
- [ ] 리더보드 어뷰징 방지 — 현재는 클라이언트에서 카운트를 직접 올리는 MVP 방식이라, 필요 시 Supabase Edge Function/RPC로 서버 측 검증 이전 권장
