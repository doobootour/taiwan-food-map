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

## 남은 작업

- [ ] 다국어(영/중/일) 실제 번역 텍스트 연결 — 현재 언어 전환 버튼은 UI만 구현됨
- [ ] 이미지 압축/최적화 (현재 `assets/images/categories`는 1024×1024 원본, 배포 전 WebP 변환 + 리사이즈 권장)
- [ ] 실제 호스팅 배포 (Vercel/Netlify/Cloudflare Pages 등 정적 호스팅이면 바로 배포 가능)
- [ ] 리더보드 어뷰징 방지 — 현재는 클라이언트에서 카운트를 직접 올리는 MVP 방식이라, 필요 시 Supabase Edge Function/RPC로 서버 측 검증 이전 권장
