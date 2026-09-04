# 나만 알고 싶은 대만 맛집 · My Secret Taiwan Eats

대만 여행을 계획 중인 2030 여성을 타겟으로 한 "Golden Hour Taipei" 톤의 프리미엄 대만 맛집 지도 웹앱.
한국인 여행자/거주자가 직접 찾고 검증하는 31개 카테고리 맛집 지도입니다.

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

## SEO / 지역 페이지 정적화

- `region-*.html`(지역별 9개)과 홈 화면 지역 카드는 `scripts/generate-region-pages.js`가 `js/data.js` + `js/region-content.js` 내용을 바탕으로 미리 구워낸 정적 HTML입니다.
- **지역 소개/하이라이트 텍스트를 바꿨다면 반드시 재실행**하세요: `node scripts/generate-region-pages.js` → 변경된 `region-*.html`, `index.html`을 함께 커밋.
- 실행하지 않으면 화면에는 새 내용이 보여도(클라이언트 JS가 다시 렌더링하므로), 자바스크립트를 거의 실행하지 않는 네이버 등 일부 크롤러에는 예전 내용이 그대로 노출됩니다.

## 남은 작업

- [ ] 다국어(영/중/일) 실제 번역 텍스트 연결 — 현재 언어 전환 버튼은 UI만 구현됨
- [x] 이미지 압축/최적화 — 전체 WebP 전환 완료 (`assets/images` 36MB → 4.6MB), 소셜 공유용 OG 이미지는 호환성을 위해 별도 JPG(`*-og.jpg`)로 유지
- [x] 실제 호스팅 배포 — Cloudflare Workers, `taiwanbite.com`
- [ ] 리더보드 어뷰징 방지 — 현재는 클라이언트에서 카운트를 직접 올리는 MVP 방식이라, 필요 시 Supabase Edge Function/RPC로 서버 측 검증 이전 권장
- [ ] 지역 상세 페이지의 "여행자들이 등록한 진짜 맛집" 목록도 정적화 검토 — 현재는 Supabase에서 클라이언트가 직접 불러오므로 크롤러에는 보이지 않음
