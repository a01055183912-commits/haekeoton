# AI 아이디어 발굴 프롬프트 스튜디오

생성형 AI 도구 활용을 통한 아이디어 발굴법(AI Build-up 창업 캠프, 90분) 실습용 웹앱.
**먼저 내가 생각해서 쓰고 → 내 답이 들어간 프롬프트로 AI 코치에게 묻고 → 내 손으로 정리**하는 5단계입니다.
(오리엔테이션 5분 + 15 · 20 · 20 · 20 · 10분, 마지막에 오후 팀 워크숍용 "내 아이디어 카드")

- 구조: `public/`(화면) + `server.js`(의존성 없는 Node 정적 서버, `PORT` 사용, `/health` 제공)
- 로컬 실행: `npm start` → http://localhost:3000
- Railway 배포: 저장소를 New Project → Deploy from GitHub repo로 연결하면 끝. 환경변수 불필요. Settings → Networking → Generate Domain으로 주소 발급.
- ChatGPT·Claude는 프롬프트가 자동 입력되고, Gemini는 복사 후 붙여넣기(Ctrl+V)가 필요합니다.
- 입력값은 브라우저(localStorage)에만 저장됩니다.
- 프롬프트 수정은 `public/app.js`의 `P` 배열(`template`)에서 합니다.
