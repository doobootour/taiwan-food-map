# 예약게시판 (/reservation-board)

- 신청: `/reservation` 폼 → edge function `taiwanbite-reservation` (Supabase 프로젝트 arjwkdbwzcxbffahopvs, 두부골프와 공용).
  숫자 4자리 비밀번호 필수. 서버가 한 번 검증하고, DB RPC `taiwanbite_submit_reservation`이 다시 검증해 bcrypt 해시로 저장한다. 해시 없는 INSERT는 트리거가 거부한다.
- 목록/열기/추가문의: edge function `taiwanbite-board` (서비스 롤). 목록은 요약(날짜·식당명·인원·상태·이름 마스킹)만. 본문·답변은 `{id, 비밀번호}`로만. 테이블은 anon에 권한이 없다.
- 담당자 답변: edge function `taiwanbite-admin` (x-staff-token) — 도구는 /workspace/taiwanbite-board/tools/post_reply.py.
- 비밀번호 없는 예전 신청은 요약 카드만 보이고 열 수 없다(답변은 이메일).
- 롤백/백업: /workspace/taiwanbite-board/ (backup/, migrations/rollback_*.sql). DB 백업 테이블 `taiwanbite_reservation_requests_backup_20261125`.
