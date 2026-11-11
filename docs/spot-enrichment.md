# 맛집 상세 페이지 보강 (scripts/enrich-spots.js)

맛집 상세 페이지(`<region>-<category>-...-<id>.html`)에 아래 칸을 채우는 데이터는 `scripts/data/spot-enrichment.json`에 있고,
`scripts/generate-spot-pages.js`가 이 파일을 읽어 정적 페이지에 굽는다.

| 칸 | 출처 |
|---|---|
| 주소(중문·영문), 영업시간, 휴무일 | 저장된 정확한 구글맵 업체 링크(place id)의 구글 지도 업체 정보 |
| 가까운 MRT역 | `scripts/data/mrt-stations.json`(Wikidata 대만 지하철역 좌표)과의 직선거리, 1.2km 이내만 |
| 대표 메뉴 | 구글 리뷰에서 많이 언급된 메뉴(zh-TW, 언급 5회 이상, 최대 3개). 없으면 가게 이름 속 메뉴, 그것도 없으면 비움. 메뉴별 가격은 넣지 않음 |
| 1인 가격대 | 구글 리뷰 작성자의 1인 가격 보고가 2건 이상 같은 구간일 때만 |
| 정보형 소개 | 위 사실로만 만든 문장(위치·역·휴무·리뷰 언급 메뉴). 후기·평가 표현 없음 |

보강하지 않고 건너뛰는 경우: 정확한 업체 링크가 없음, 업체 정보를 못 읽음, 구글 좌표가 등록 좌표와 1.5km 넘게 다름, 폐업·휴업 표시.
`method: "manual"`(타이베이 인기 50곳)과 `method: "polished"`(지역별로 소개·메뉴를 손으로 다듬은 항목) 항목은 `--force`로도, 매일 자동 실행으로도 바뀌지 않는다.
다듬은 메뉴의 한국어 이름은 `KO_DISH` 사전에 추가해 이후 자동 보강에도 쓰인다(확실하지 않은 메뉴는 한자만 둔다).

## 자동 실행
`.github/workflows/regenerate-seo-pages.yml`이 매일 03:00(대만) 페이지 재생성 전에
`node scripts/enrich-spots.js --limit 30`을 돌려 아직 보강 안 된 새 맛집을 최대 30곳 채우고, 바뀐 JSON을 페이지와 함께 커밋한다.
새로 등록된 맛집(ID 큰 순)부터 처리한다. 건너뛴 맛집은 JSON의 `skipped`에 사유·날짜를 남기고 7일 동안 다시 시도하지 않는다(`--retry-skipped` 또는 `--ids`로 강제 시도). 구글 응답을 못 읽어도 페이지 재생성은 계속 진행된다.

건너뛴 맛집을 고치려면: 업체 정보 못 읽음 → DB `link`를 place id가 있는 정확한 업체 링크(maps.app.goo.gl 공유 링크 등)로 교체, 좌표 차이 → DB `lat/lng`를 실제 업체 위치로 수정. 그다음 `node scripts/enrich-spots.js --ids <id>`.

## 수동 실행
```bash
node scripts/enrich-spots.js                         # 보강 안 된 맛집 전부
node scripts/enrich-spots.js --regions taipei,yilan  # 지역만
node scripts/enrich-spots.js --ids 1031,1032         # 특정 ID만
node scripts/enrich-spots.js --ids 1031 --force      # 다시 조회해서 덮어쓰기(manual·polished 제외)
node scripts/enrich-spots.js --dry-run --report /tmp/r.json   # 파일은 안 바꾸고 결과만 보기
# 기타: --limit N, --delay-ms 1500, --cache-dir /tmp/gcache(구글 응답 캐시), --data <다른 json 경로>
node scripts/generate-spot-pages.js && node scripts/generate-sitemap.js   # 페이지에 반영
```
