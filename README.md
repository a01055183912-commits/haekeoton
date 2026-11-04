# AI 창업 아이디어 발굴 스튜디오

**프롬프트 5개로 완성하는 나의 창업 아이디어 카드.**
학생이 생성형 AI(ChatGPT · Gemini · Claude)로 개인 창업 아이디어 초안을 만드는 실습용 웹앱입니다.
"고객의 문제, AI 해결 방법, 사업모델을 설명할 수 있으면 초안 완성!"

- 1단계 문제 찾기: 프롬프트 1 페르소나 → 2 고객 여정 → 3 문제 정의
- 2단계 해결 아이디어 만들기: 4 AI 아이디어 5개 비교 후 하나 선택
- 3단계 사업으로 연결하기: 5 가치 제안 · 운영 방식 · 수익 모델 정리
- 최종 카드: 문제 · 해결 아이디어 · 사업모델 · 기대 변화 네 줄 + 오후에 확인할 가설. 확인하지 않은 내용은 (가정) · (미확인)으로 표시, 이미지는 선택
- ★ 검증해보기: 사실 · 가정 · 확인할 것을 나눠 초기 창업 가설을 점검

- 구조: `public/`(화면) + `server.js`(의존성 없는 Node 정적 서버, `PORT` 사용, `/health` 제공)
- 로컬 실행: `npm start` → http://localhost:3000
- Railway 배포: 저장소를 New Project → Deploy from GitHub repo로 연결하면 끝. 환경변수 불필요. Settings → Networking → Generate Domain으로 주소 발급.
- ChatGPT·Claude는 프롬프트가 자동 입력되고, Gemini는 복사 후 붙여넣기(Ctrl+V)가 필요합니다.
- 입력값은 브라우저(localStorage)에만 저장됩니다.
- 프롬프트 수정은 `public/app.js`의 `P` 배열(`template`)에서 합니다.
