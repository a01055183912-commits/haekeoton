# AI 아이디어 발굴 프롬프트 스튜디오

생성형 AI 도구 활용을 통한 아이디어 발굴법(AI Build-up 창업 캠프 · 강의 PPT 기준) 실습용 웹앱.
**프롬프트 5개 + ★ 약점 점검**을 한 대화창에서 이어서 돌립니다. 타자는 1번의 노란 칸 두 개뿐.

1단계 문제 정의: 1 페르소나 → 2 고객 여정 지도 → 3 문제 정의 / 2단계 아이디어: 4 AI 창업 아이디어 5개 / 3단계 비즈니스 모델: 5 3대 질문 + 30초 소개
각 화면에 PPT의 "이 줄을 넣는 이유", 샘플 답(골목 라디오), 카테고리별 예시, 체크리스트가 들어 있습니다.

- 구조: `public/`(화면) + `server.js`(의존성 없는 Node 정적 서버, `PORT` 사용, `/health` 제공)
- 로컬 실행: `npm start` → http://localhost:3000
- Railway 배포: 저장소를 New Project → Deploy from GitHub repo로 연결하면 끝. 환경변수 불필요. Settings → Networking → Generate Domain으로 주소 발급.
- ChatGPT·Claude는 프롬프트가 자동 입력되고, Gemini는 복사 후 붙여넣기(Ctrl+V)가 필요합니다.
- 입력값은 브라우저(localStorage)에만 저장됩니다.
- 프롬프트 수정은 `public/app.js`의 `P` 배열(`template`)에서 합니다.
