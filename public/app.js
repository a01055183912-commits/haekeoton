/* AI 아이디어 발굴 프롬프트 스튜디오 — 정적 웹앱 (빌드 불필요) */
(function () {
  'use strict';

  /* ---------- 단계 ---------- */
  var STAGES = {
    1: { name: '1단계 문제 정의' },
    2: { name: '2단계 아이디어 도출' },
    3: { name: '3단계 비즈니스 모델' },
    4: { name: '보너스 발표 준비' }
  };

  /* ---------- 공통 빈칸 ---------- */
  var F = {
    theme: { label: '해커톤 주제', type: 'select', options: [['1', '일상 속 불편을 창업 아이디어로'], ['2', '스토리텔링 기반의 콘텐츠 창업 아이디어']] },
    who:   { label: '나는 누구', hint: '예) 대학생, 취준생, 직장 2년 차', ph: '대학생' },
    field: { label: '관심 분야', hint: '예) 자취 생활, 자기소개와 취업, 반려동물', ph: '자취 생활' },
    persona: { label: '인터뷰할 가상 고객', hint: '나이·역할을 구체적으로', ph: '반찬 솜씨 좋은 55세 동네 주부' },
    topic: { label: '인터뷰 주제', hint: '그 사람이 하는 일/겪는 일', ph: '반찬을 만들어 파는 일' },
    memo:  { label: '실제 인터뷰 메모', hint: '진짜 사람에게 들은 말을 그대로', type: 'area', ph: '예) 반찬 나눠 준 적은 많은데 팔아 본 적은 없다. 주문 받고 돈 받는 게 제일 걸린다.' },
    pain:  { label: '내가 고른 불편', hint: '프롬프트 1 결과에서 번호 1~3개를 묶어서', type: 'area', ph: '예) ①⑤⑭를 묶은 \'평일 저녁 끼니\'' },
    problem: { label: '고른 문제 정의 문장', hint: '프롬프트 3에서 1위 문장', type: 'area', ph: '예) 자취생은 알바 끝난 평일 저녁 끼니를 챙기려 할 때 시간이 없고 1인분 배달은 비싸 거르거나 편의점으로 때운다.' },
    idea:  { label: '선택한 아이디어', hint: '프롬프트 5에서 1위(또는 숨은 후보)', type: 'area', ph: '예) 9번 동네 반찬 요리인 ↔ 자취생 주간 구독' }
  };

  /* ---------- 프롬프트 9개 + 보너스 ---------- */
  var P = [
    {
      id: 1, stage: 1, title: '되묻기와 불편 15개',
      lead: 'AI가 먼저 <b>나에게 되묻고</b>, 내 상황에 맞는 일상 속 불편을 <b>5가지 감정</b>으로 나눠 15개 이상 찾아줍니다.',
      fields: ['theme', 'who', 'field'],
      tip: '<b>첫 프롬프트만 새 대화창</b>에서 시작하세요. 이후 2~9번은 같은 대화창에 이어서 붙여넣어야 AI가 앞 내용을 기억합니다.',
      template:
        '나는 {{who}}이고, 관심 있는 분야는 {{field}}야.\n{{theme_line}}\n\n' +
        '일상에서 겪는 불편을 찾도록 도와줘. 아래 순서로 진행해.\n\n' +
        '1) 먼저 나에 대해 꼭 필요한 질문을 딱 2개만 해줘. 내가 답할 때까지 기다려.\n' +
        '2) 내 답을 들은 뒤, 아래 5가지 감정으로 나눠 불편을 모두 15개 이상 찾아줘.\n' +
        '   - 귀찮다 / 아깝다 / 불안하다 / 막막하다\n' +
        '   - 세대가 함께 ★ (서로 다른 세대가 같은 문제를 겪거나 서로를 도울 수 있는 불편)\n' +
        '3) 각 불편은 "언제, 누가, 무엇 때문에 힘든지"가 보이게 한 문장으로 써줘.\n' +
        '4) 표로 정리해줘. 열은 "감정 | 불편(번호 포함)"으로 해줘.\n' +
        '5) 마지막에 가장 흥미로운 불편 3개를 추천하고 이유를 한 줄씩 써줘.',
      banner: '불편 번호를 1~3개 골라 <em>하나의 주제로 묶으세요</em> — 다음 프롬프트가 거기서 시작합니다',
      example: {
        src: '트랙 A · 대학생 / 자취 생활',
        html: '<p>AI가 먼저 되물음: “① 자취한 지 얼마나 됐고 어디 사세요? ② 하루 중 가장 바쁜 시간대는?” → 참가자: “대학가 원룸 1년, 평일 저녁 6~9시 수업과 알바.”</p>' +
          '<div class="tblwrap"><table><tr><th>감정</th><th>AI가 찾은 불편 (일부)</th></tr>' +
          '<tr><td>귀찮다</td><td>① 알바 끝나고 밥 차리는 게 귀찮아 라면·편의점으로 때운다</td></tr>' +
          '<tr><td>아깝다</td><td>⑤ 1인분 배달은 배달비·최소주문 때문에 2인분을 시켜 남긴다</td></tr>' +
          '<tr><td>세대가 함께 ★</td><td>⑭ 자취생은 집밥 반찬이 그립고, 동네 중장년은 반찬 솜씨가 있지만 나눌 데가 없다</td></tr></table></div>' +
          '<p>고른 불편: ①⑤⑭를 묶은 <b>‘평일 저녁 끼니’</b></p>'
      }
    },
    {
      id: 2, stage: 1, title: '가상 고객 인터뷰',
      lead: 'AI가 <b>가상 고객 역할</b>을 맡고, 내가 인터뷰어가 됩니다. 인터뷰가 끝나면 AI가 <b>핵심 답·지어낸 숫자·다시 물어볼 질문</b>을 정리합니다.',
      fields: ['persona', 'topic'],
      tip: '<b>질문 예시</b><ul><li>최근에 ○○를 해 본 적 있으세요?</li><li>하려는데 뭐가 걸리세요?</li><li>지금은 어떻게 해결하고 계세요?</li></ul>끝낼 땐 <b>“인터뷰 끝”</b>이라고 입력하세요.',
      template:
        '지금부터 너는 {{persona}}야. 내가 {{topic}}에 대해 인터뷰할게.\n\n' +
        '규칙:\n' +
        '- 실제 사람처럼 구어체로, 한 번에 2~4문장으로만 답해.\n' +
        '- 내가 묻지 않은 것을 먼저 설명하지 마. 한 번에 한 질문에만 답해.\n' +
        '- 귀찮은 점, 걱정되는 점, 돈 이야기도 솔직하게 말해.\n' +
        '- 내가 "인터뷰 끝"이라고 하면 역할에서 빠져나와 아래를 정리해줘.\n' +
        '  ① 인터뷰에서 드러난 핵심 불편 3가지\n' +
        '  ② 네가 지어낸 숫자나 사실 (가설이라고 표시)\n' +
        '  ③ 진짜 사람에게 꼭 다시 물어봐야 할 질문 3개\n\n' +
        '준비되면 "네, 시작하세요"라고만 답해줘.',
      banner: 'AI 고객이 말한 숫자는 <em>가설</em> — 진짜 숫자는 <em>테이블의 사람</em>에게서 얻으세요',
      example: {
        src: '트랙 A · 반찬 솜씨 좋은 55세 동네 주부',
        html: '<div class="tblwrap"><table><tr><th>참가자 질문</th><th>AI(주부 역할) 답</th></tr>' +
          '<tr><td>팔아 보실 생각은요? 뭐가 걸리세요?</td><td>어디다 내놓아야 하는지 모르겠고, 위생 신고니 뭐니 복잡하다 그러고. 가격도, 몇 개 만들어야 할지도 모르겠어. 남으면 다 버리는 거잖아.</td></tr>' +
          '<tr><td>하루에 얼마나 만드실 수 있어요?</td><td>오전에 서너 시간이면 반찬 네댓 가지, 열 명분은 하지.</td></tr></table></div>' +
          '<p class="src">※ “서너 시간, 열 명분”은 AI가 지어낸 숫자입니다.</p>'
      }
    },
    {
      id: 3, stage: 1, title: '문제 정의 문장 3개',
      lead: '진짜 인터뷰에서 들은 말을 넣어 <b>문제를 한 문장</b>으로 정의하고, 3가지 기준으로 <b>점수</b>를 매겨 가장 센 문장을 고릅니다.',
      fields: ['pain', 'memo'],
      tip: '인터뷰 메모는 <b>옆 사람에게 직접 들은 말</b>을 그대로 적으세요. 그래야 AI가 지어내지 않고 사실을 바탕으로 문장을 만듭니다.',
      template:
        '이제 문제를 한 문장으로 정의하자.\n\n' +
        '[내가 고른 불편]\n{{pain}}\n\n' +
        '[실제 인터뷰 메모]\n{{memo}}\n\n' +
        '위 내용을 바탕으로 문제 정의 문장을 3개 만들어줘.\n' +
        '형식: "[누구]는 [무엇을 하려 할 때] [어떤 이유로] 어렵다. 지금은 [현재 대안]으로 버티지만 [그 대안의 한계]가 있다."\n\n' +
        '각 문장을 아래 기준으로 1~5점으로 채점해 표로 보여줘.\n' +
        '- 많은가: 그런 사람이 많은가\n' +
        '- 자주·크게: 자주 겪거나 크게 아픈가\n' +
        '- 돈·시간: 이미 돈이나 시간을 쓰고 있는가\n\n' +
        '합계가 가장 높은 문장을 골라 이유를 한 줄로 말해줘.\n' +
        '인터뷰 메모에 없는 내용은 지어내지 말고 "(가정)"이라고 표시해줘.',
      banner: '점수가 낮아도 괜찮아요 — <em>가장 높은 문장 1개</em>를 복사해 두세요',
      example: {
        src: '트랙 A · 문제 정의 문장',
        html: '<div class="tblwrap"><table><tr><th>문제 정의 문장</th><th>많은가</th><th>자주·크게</th><th>돈·시간</th><th>합계</th></tr>' +
          '<tr><td>① 자취생은 알바 끝난 평일 저녁 끼니를 챙기려 할 때 시간이 없고 1인분 배달은 비싸 거르거나 편의점으로 때운다.</td><td>5</td><td>5</td><td>4</td><td><b>14</b></td></tr>' +
          '<tr><td>② 동네 중장년은 반찬을 팔고 싶을 때 주문 받을 곳과 가격·수량 정하는 법을 몰라 시작하지 못한다.</td><td>3</td><td>4</td><td>2</td><td>9</td></tr>' +
          '<tr><td>③ 자취생 부모는 멀리 있어 자녀 끼니를 챙기고 싶어도 용돈을 보내는 것 말고는 방법이 없다.</td><td>4</td><td>3</td><td>5</td><td>12</td></tr></table></div>'
      }
    },
    {
      id: 4, stage: 2, title: '아이디어 20개',
      lead: '정의한 문제를 풀 아이디어를 <b>다섯 방향</b>에서 4개씩, 서로 다른 <b>20개</b>로 뽑아냅니다.',
      fields: ['problem'],
      tip: '방향을 정해 주면 비슷한 아이디어 20개가 아니라 <b>서로 다른 20개</b>가 나옵니다. 마음에 안 들면 “③번 방향만 5개 더”처럼 이어서 요청하세요.',
      template:
        '내가 고른 문제 정의 문장은 이거야.\n{{problem}}\n\n' +
        '이 문제를 푸는 아이디어를 다섯 방향에서 4개씩, 모두 20개 내줘. 서로 비슷한 아이디어는 안 돼.\n\n' +
        '① AI가 대신 해줘\n② AI가 가르쳐줘\n③ 사람과 사람을 이어줘\n' +
        '④ 다른 업종에서 빌려와 (구독, 마감 할인, 1:1 코칭, 무인 판매 등)\n⑤ 정반대로 뒤집어\n\n' +
        '번호는 1~20으로 매기고, 아이디어마다 "누가 어떻게 쓰는지"가 보이게 한 줄로 써줘. 방향별로 나눈 표로 정리해줘.',
      banner: '<em>다섯 방향</em> 덕분에 서로 다른 아이디어 20개가 나옵니다',
      example: {
        src: '트랙 A · 아이디어 20개 (일부)',
        html: '<div class="tblwrap"><table><tr><th>방향</th><th>아이디어</th></tr>' +
          '<tr><td>① AI가 대신</td><td>1 예산·입맛 맞춤 주간 식단과 장보기 목록 · 2 냉장고 사진으로 오늘 저녁 요리</td></tr>' +
          '<tr><td>③ 사람과 사람</td><td>9 동네 반찬 요리인 ↔ 자취생 주간 구독 · 11 “엄마 밥 한 끼” 가정 식탁 초대</td></tr>' +
          '<tr><td>④ 다른 업종</td><td>13 꽃 구독처럼 반찬 정기 배송 · 16 원룸 1층 무인 반찬 냉장고</td></tr>' +
          '<tr><td>⑤ 정반대로</td><td>18 학생이 요리인이 되어 중장년에게 판다</td></tr></table></div>'
      }
    },
    {
      id: 5, stage: 2, title: '다섯 개로 좁히기',
      lead: '20개 중 가장 유망한 <b>5개</b>를 <b>4가지 기준</b>으로 채점해 1위와 <b>숨은 후보</b>를 고릅니다.',
      fields: [],
      tip: '1위가 AI 없이도 되는 아이디어라면 AI에게 <b>“AI를 어디에 넣을까?”</b>를 물어보세요. 심사에서 AI 활용도는 늘 질문받습니다.',
      template:
        '위 20개 중에서 가장 유망한 5개를 골라, 아래 4가지 기준으로 각각 1~5점으로 채점하고 표로 비교해줘.\n\n' +
        '- 문제 해결: 우리가 정의한 문제를 정말 푸는가\n' +
        '- 6개월 안: 학생 팀이 6개월 안에 시작해 볼 수 있는가\n' +
        '- AI 필요: AI가 없으면 안 되는 핵심이 있는가\n' +
        '- 다른 점: 이미 있는 서비스와 뚜렷하게 다른가\n\n' +
        '그리고 다음도 알려줘.\n' +
        '1) 합계 순위와 1위를 고른 이유\n' +
        '2) 점수는 낮지만 이야기가 강하고 고객이 잊지 못할 "숨은 후보" 1개\n' +
        '3) 1위가 AI 없이도 가능하다면, AI를 어디에 넣으면 좋을지 제안',
      banner: '1위와 <em>숨은 후보</em> 중 우리 팀이 끌리는 쪽을 고르세요',
      example: {
        src: '트랙 A · 다섯 개 비교',
        html: '<div class="tblwrap"><table><tr><th>아이디어</th><th>문제 해결</th><th>6개월 안</th><th>AI 필요</th><th>다른 점</th><th>합계</th></tr>' +
          '<tr><td>9 동네 반찬 요리인 구독</td><td>5</td><td>4</td><td>4</td><td>4</td><td><b>17</b></td></tr>' +
          '<tr><td>3 배달 주문 자동 묶기</td><td>3</td><td>5</td><td>4</td><td>3</td><td>15</td></tr>' +
          '<tr><td>11 가정 식탁 초대</td><td>3</td><td>4</td><td>2</td><td>5</td><td>14</td></tr></table></div>' +
          '<p>AI 한마디: “9번은 단순 매칭으로 끝나면 AI가 필요 없다. 식단 추천과 주문량 예측이 들어가야 한다.”</p>'
      }
    },
    {
      id: 6, stage: 2, title: '한 줄 소개와 사용 장면',
      lead: '아이디어를 <b>한 문장</b>으로 말하고, 고객이 쓰는 <b>5단계 장면</b>과 <b>이름 후보 5개</b>를 만듭니다.',
      fields: ['idea'],
      tip: '이 한 줄 소개가 <b>발표의 첫 문장</b>이 됩니다. 소리 내어 읽어 보고 어색하면 “더 쉬운 말로 다시”를 요청하세요.',
      template:
        '우리 팀이 선택한 아이디어는 이거야.\n{{idea}}\n\n' +
        '아래 3가지를 만들어줘.\n\n' +
        '1) 한 줄 소개 (한 문장):\n   "[고객]을 위한 \'[서비스]\'로, AI가 [무엇을 해서] [어떤 문제]를 해결한다."\n' +
        '2) 사용 장면: 고객이 처음 쓰는 순간부터 다시 쓰는 순간까지 5단계 흐름 (한 단계에 한 줄)\n' +
        '3) 이름 후보 5개: 짧고 부르기 쉽게, 각각 이유 한 줄',
      banner: '한 줄 소개가 <em>내일 발표의 첫 문장</em>이 됩니다',
      example: {
        src: '트랙 A · 한 줄 소개',
        html: '<p>자취 대학생을 위한 ‘동네 밥상 구독’으로, AI가 예산과 입맛에 맞춰 주간 반찬을 추천하고 동네 중장년 요리인과 이어 주어 평일 저녁 끼니 문제를 해결한다.</p>' +
          '<p>장면: 가입(예산·입맛·알레르기) → 일요일 AI 반찬 3종 추천 → 요리인 조리 → 화·금 저녁 픽업 → 남긴 양 기록으로 추천이 정확해짐</p>' +
          '<p>이름: 밥상잇기 · 동네밥상 · 반찬이음 · 엄마손구독 · 한끼동네</p>'
      }
    },
    {
      id: 7, stage: 3, title: '린 캔버스 초안',
      lead: '사업 모델을 <b>9칸 린 캔버스</b>로 정리합니다. 모르는 칸은 지어내지 않고 <b>(가정)</b>으로 표시해 멘토 질문으로 남깁니다.',
      fields: ['idea'],
      tip: '(가정)이 붙은 칸이 바로 <b>오후 멘토링에서 물어볼 질문</b>입니다. 많을수록 좋은 거예요.',
      template:
        '우리 팀 아이디어는 이거야.\n{{idea}}\n\n' +
        '지금까지의 대화를 바탕으로 린 캔버스를 9칸으로 정리해줘.\n' +
        '칸: 문제 / 고객 / 고유한 가치 / 해결 방법 / 고객을 만나는 길 / 수익 / 비용 / 핵심 숫자 / 강점\n\n' +
        '규칙:\n' +
        '- 내가 알려준 내용과 인터뷰에서 나온 것만 확정으로 써.\n' +
        '- 모르는 것은 절대 숫자를 지어내지 말고 "(가정)" 또는 "조사 필요"로 표시해.\n' +
        '- 마지막에 (가정)이 붙은 칸을 목록으로 만들고, 각각 누구에게 어떻게 확인하면 좋을지 알려줘.',
      banner: '(가정) 표시된 칸이 <em>멘토에게 물어볼 질문</em>입니다',
      example: {
        src: '트랙 A · 린 캔버스 (일부)',
        html: '<div class="tblwrap"><table><tr><th>칸</th><th>내용</th></tr>' +
          '<tr><td>문제</td><td>자취생은 평일 저녁 끼니를 거르고, 동네 요리인은 반찬을 팔 곳이 없다</td></tr>' +
          '<tr><td>고객</td><td>대학가 자취생. 먼저는 기숙사 밖 1~2학년 (가정)</td></tr>' +
          '<tr><td>수익</td><td>학생 주간 구독, 부모의 ‘자녀 밥상 선물’, 요리인 판매 수수료. 가격은 조사 필요</td></tr></table></div>'
      }
    },
    {
      id: 8, stage: 3, title: '돈의 흐름 세 가지',
      lead: '돈 버는 방법 <b>3가지</b>를 비교해 가장 현실적인 것 하나를 고르고, <b>2주짜리 작은 실험</b>까지 설계합니다.',
      fields: [],
      tip: '좋은 실험은 <b>앱 없이 손으로</b> 할 수 있고, 끝날 때 “다음에도 할래?”와 “얼마면 낼래?”를 묻습니다.',
      template:
        '이 사업이 돈을 버는 방법을 3가지 제안해줘. 표로 정리하고 열은 아래처럼 해줘.\n' +
        '방법 | 누가 | 무엇에 | 어떻게 결제 | 첫 고객 10명을 만날 방법\n\n' +
        '그중 가장 현실적인 한 가지를 골라 이유를 말해줘.\n\n' +
        '그다음, 그 한 가지가 맞는지 검증할 "2주짜리 작은 실험"을 설계해줘.\n' +
        '- 앱을 만들지 않고 손으로 운영할 수 있어야 해.\n' +
        '- 몇 명을 대상으로 무엇을 하는지 구체적으로.\n' +
        '- 끝날 때 꼭 물어볼 질문 2개: "다음에도 할래?", "얼마면 낼래?"',
      banner: '앱보다 먼저 <em>10명이 돈을 낼지</em> 확인하세요',
      example: {
        src: '트랙 A · 돈의 흐름',
        html: '<div class="tblwrap"><table><tr><th>방법</th><th>누가</th><th>무엇에</th><th>첫 고객 10명</th></tr>' +
          '<tr><td>1 학생 주간 구독</td><td>자취생</td><td>주 2회 반찬 3종</td><td>학과 단체 대화방 공지</td></tr>' +
          '<tr><td>2 부모 선물 구독</td><td>자취생 부모</td><td>한 달 밥상 선물권</td><td>학부모 모임</td></tr>' +
          '<tr><td>3 수수료·제휴</td><td>요리인, 기숙사·생협</td><td>건당 수수료</td><td>복지관·주민센터</td></tr></table></div>' +
          '<p>작은 실험: 단체방에서 10명 모집 → 요리인 1명과 2주간 카톡 주문으로 수동 운영 → “다음 주도 할래?” “얼마면 낼래?”</p>'
      }
    },
    {
      id: 9, stage: 3, title: '심사위원 약점 점검',
      lead: 'AI가 <b>까다로운 심사위원</b>이 되어 약점 5가지와 날카로운 질문 5개를 던집니다. 발표 전에 먼저 맞아 보세요.',
      fields: [],
      tip: '답하기 어려운 질문은 <b>멘토에게 물어볼 질문</b>으로 바꿔서 가져가세요. 모르는 것을 아는 것도 실력입니다.',
      template:
        '지금부터 너는 까다로운 창업 해커톤 심사위원이야. 지금까지 정리한 우리 팀 사업을 냉정하게 점검해줘.\n\n' +
        '1) 약점 5가지 (법규·품질·비용·시장·경쟁 관점)\n' +
        '2) 심사위원이 실제로 물을 날카로운 질문 5개\n' +
        '3) 가장 치명적인 약점 1개와 보완 방법\n' +
        '4) 보완이 실제로 가능한지, 비용이 얼마인지는 네가 모르면 모른다고 말하고, 멘토에게 물어볼 질문으로 정리해줘.',
      banner: '가장 치명적인 약점을 <em>먼저 말하는 팀</em>이 신뢰를 얻습니다',
      example: {
        src: '트랙 A · 약점과 질문',
        html: '<p>약점: 집에서 만든 반찬 판매는 식품 위생 신고 대상 · 요리인마다 맛 편차 · 소량 포장 운영비 · 방학 수요 하락 · 기존 반찬 가게와 경쟁</p>' +
          '<p>질문: 한 끼 얼마에 팔 거고 학생이 낼까? 위생 사고는 누가 책임지나? 방학 두 달은 어떻게 버티나?</p>' +
          '<p>가장 치명적: <b>위생·법규</b> → 신고된 공유주방 활용 또는 기존 반찬 가게와 제휴 (비용은 멘토에게 질문)</p>'
      }
    },
    {
      id: 10, stage: 4, bonus: true, title: '5분 발표 구성',
      lead: '지금까지 만든 내용을 <b>PT 5분 + 질의응답 5분</b>에 맞는 발표 흐름으로 정리합니다.',
      fields: [],
      tip: '발표는 팀당 <b>PT 5분, 질의응답 5분</b> 총 10분입니다. 생성된 대본을 소리 내어 읽으며 시간을 재 보세요.',
      template:
        '지금까지 우리가 정리한 내용(문제 정의, 아이디어, 한 줄 소개, 린 캔버스, 돈의 흐름, 약점)을 바탕으로 해커톤 발표자료 구성을 만들어줘.\n\n' +
        '조건:\n' +
        '- PT 5분 + 질의응답 5분\n' +
        '- 슬라이드 6장 이내: 장마다 제목, 핵심 문장 1개, 화면에 넣을 것\n' +
        '- 1장은 한 줄 소개로 시작\n' +
        '- 장마다 말하는 시간 배분 (합계 5분)\n' +
        '- 예상 질문 3개와 답변 한 줄씩',
      banner: '발표는 <em>문제 → 해결 → 돈 → 다음 한 걸음</em> 순서로 말하세요',
      example: null
    }
  ];

  /* ---------- 상태 ---------- */
  var KEY = 'aiIdeaStudio.v1';
  var state = { v: { theme: '1' }, done: {}, last: 0 };
  try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v) state = s; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---------- 유틸 ---------- */
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function val(k) { return (state.v[k] || '').trim(); }
  var toastT;
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 3200);
  }

  /* 템플릿 → 토큰 배열 */
  function themeLine() {
    return state.v.theme === '2'
      ? '주제는 "스토리텔링 기반의 콘텐츠 창업 아이디어"야. 사람들이 자기 이야기를 전하거나 이야기로 알리고 싶은데 어려워하는 불편을 중심으로 찾아줘.'
      : '주제는 "일상 속 불편을 창업 아이디어로"야.';
  }
  function parts(p) {
    var out = [], re = /\{\{(\w+)\}\}/g, last = 0, m, tpl = p.template;
    while ((m = re.exec(tpl))) {
      if (m.index > last) out.push({ t: tpl.slice(last, m.index) });
      var k = m[1];
      if (k === 'theme_line') out.push({ t: themeLine() });
      else out.push({ k: k, v: val(k) });
      last = re.lastIndex;
    }
    if (last < tpl.length) out.push({ t: tpl.slice(last) });
    return out;
  }
  function plain(p) {
    return parts(p).map(function (x) { return x.k ? (x.v || '[' + F[x.k].label + ']') : x.t; }).join('');
  }
  function html(p) {
    return parts(p).map(function (x) {
      if (!x.k) return esc(x.t);
      return x.v ? '<mark>' + esc(x.v) + '</mark>' : '<mark class="blank">[' + esc(F[x.k].label) + ']</mark>';
    }).join('');
  }
  function blanks(p) { return parts(p).filter(function (x) { return x.k && !x.v; }).length; }

  /* ---------- 라우팅 ---------- */
  var cur = 0; // 0 = 표지
  function go(n) { location.hash = n ? '#/' + n : '#/'; }
  function route() {
    var m = /^#\/(\d+)/.exec(location.hash);
    var n = m ? Math.min(+m[1], P.length) : 0;
    cur = n;
    $('cover').hidden = n !== 0;
    $('studio').hidden = n === 0;
    if (n) { state.last = n; save(); render(); window.scrollTo(0, 0); $('slide').focus({ preventScroll: true }); }
    else { $('resumeBtn').hidden = !(state.last > 0); window.scrollTo(0, 0); }
  }

  /* ---------- 렌더 ---------- */
  function render() {
    var p = P[cur - 1];
    renderCrumbs(p); renderStepper(); renderSlide(p); renderPager();
    document.title = 'P' + p.id + ' ' + p.title + ' · AI 아이디어 발굴 프롬프트 스튜디오';
  }
  function renderCrumbs(p) {
    var h = '<button data-go="0">시작</button>';
    [1, 2, 3].forEach(function (s) {
      h += '<span class="sep">›</span>' + (p.stage === s ? '<span class="on">' + STAGES[s].name + '</span>' : '<button data-go="' + firstOf(s) + '">' + STAGES[s].name + '</button>');
    });
    $('crumbs').innerHTML = h;
  }
  function firstOf(s) { for (var i = 0; i < P.length; i++) if (P[i].stage === s) return P[i].id; return 1; }
  function renderStepper() {
    $('stepper').innerHTML = P.map(function (p) {
      var cls = 'chip' + (p.id === cur ? ' on' : '') + (state.done[p.id] ? ' done' : '') + (p.bonus ? ' bonus gap' : '');
      return '<button class="' + cls + '" data-go="' + p.id + '" role="tab" aria-selected="' + (p.id === cur) + '" aria-label="프롬프트 ' + p.id + ' ' + esc(p.title) + '">' + (p.bonus ? '+' : p.id) + '<small>' + esc(p.title) + '</small></button>';
    }).join('');
    var on = $('stepper').querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  }
  function fieldHtml(k) {
    var f = F[k], v = state.v[k] || '', id = 'f_' + k, lab = '<label for="' + id + '">' + esc(f.label) + (f.hint ? '<i>' + esc(f.hint) + '</i>' : '') + '</label>';
    var inp;
    if (f.type === 'select') inp = '<select id="' + id + '" data-k="' + k + '">' + f.options.map(function (o) { return '<option value="' + o[0] + '"' + (String(v || '1') === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select>';
    else if (f.type === 'area') inp = '<textarea id="' + id + '" data-k="' + k + '" placeholder="' + esc(f.ph || '') + '">' + esc(v) + '</textarea>';
    else inp = '<input id="' + id + '" data-k="' + k + '" type="text" value="' + esc(v) + '" placeholder="' + esc(f.ph || '') + '" autocomplete="off">';
    return '<div class="field' + (v ? ' filled' : '') + '">' + lab + inp + '</div>';
  }
  function renderSlide(p) {
    var st = STAGES[p.stage], n = blanks(p);
    var left = p.fields.length
      ? '<h3 class="block-title">① 빈칸 채우기</h3><div class="fields">' + p.fields.map(fieldHtml).join('') + '</div>'
      : '<h3 class="block-title">① 빈칸 채우기</h3><div class="nofields">이 프롬프트는 <b>빈칸이 없습니다.</b> 앞 단계에서 이어진 같은 대화창에 그대로 붙여넣으세요.</div>';
    left += '<div class="tip">' + p.tip + '</div>';
    var right =
      '<h3 class="block-title">② 프롬프트 확인</h3>' +
      '<div class="pbox"><div class="pbox-head"><span>프롬프트 ' + (p.bonus ? '보너스' : p.id) + '</span><span class="cnt' + (n ? '' : ' ok') + '" id="cnt">' + cntText(n) + '</span></div>' +
      '<pre class="pre" id="pre">' + html(p) + '</pre></div>' +
      '<div class="send"><h3 class="block-title" style="margin-top:16px">③ 복사하고 AI로 보내기</h3><div class="send-row">' +
      '<button class="sbtn copy" data-act="copy">📋 복사하기</button>' +
      '<button class="sbtn" data-act="chatgpt"><span class="dot d-gpt"></span>ChatGPT</button>' +
      '<button class="sbtn" data-act="gemini"><span class="dot d-gem"></span>Gemini</button>' +
      '<button class="sbtn" data-act="claude"><span class="dot d-cla"></span>Claude</button></div>' +
      '<p class="sendnote">' + (p.id === 1
        ? '<b>새 대화창</b>이 열립니다. ChatGPT·Claude는 프롬프트가 자동 입력되고, <b>Gemini는 붙여넣기(Ctrl+V)</b>가 필요해요. 어떤 버튼이든 먼저 자동 복사됩니다.'
        : '<b>같은 대화창에 이어서</b> 붙여넣으세요(Ctrl+V). 새 창을 열면 앞 내용을 AI가 기억하지 못합니다.') + '</p></div>';
    var ex = p.example ? '<details class="ex"><summary>시뮬레이션 예시 보기 — ' + esc(p.example.src) + '</summary><div class="ex-body">' + p.example.html + '</div></details>' : '';
    $('slide').innerHTML =
      '<p class="stage-label">' + st.name + '</p><h2>프롬프트 ' + (p.bonus ? '보너스' : p.id) + ' · ' + esc(p.title) + '</h2><p class="lead">' + p.lead + '</p>' +
      '<div class="grid"><section>' + left + '</section><section>' + right + '</section></div>' + ex +
      '<div class="banner">' + p.banner + '</div>';
  }
  function cntText(n) { return n ? '빈칸 ' + n + '개 남음' : '✓ 모두 채워짐'; }
  function renderPager() {
    var a = P[cur - 2], b = P[cur];
    $('prevBtn').disabled = !a; $('nextBtn').disabled = !b;
    $('prevBtn').dataset.go = a ? a.id : '';
    $('nextBtn').dataset.go = b ? b.id : '';
    $('prevBtn').innerHTML = a ? '‹ <b>이전</b> · 프롬프트 ' + (a.bonus ? '보너스' : a.id) + ' ' + esc(a.title) : '';
    $('nextBtn').innerHTML = b ? '<b>다음</b> › 프롬프트 ' + (b.bonus ? '보너스' : b.id) + ' · ' + esc(b.title) : '';
  }

  /* ---------- 복사 · 보내기 ---------- */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); });
    }
    return fallbackCopy(text);
  }
  function fallbackCopy(text) {
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); ok ? res() : rej();
    });
  }
  var URLS = {
    chatgpt: function (t) { return 'https://chatgpt.com/?q=' + encodeURIComponent(t); },
    claude: function (t) { return 'https://claude.ai/new?q=' + encodeURIComponent(t); },
    gemini: function () { return 'https://gemini.google.com/app'; }
  };
  var NAMES = { chatgpt: 'ChatGPT', claude: 'Claude', gemini: 'Gemini' };
  function act(kind) {
    var p = P[cur - 1], text = plain(p), n = blanks(p);
    var copied = copyText(text);
    var done = function (msg) { state.done[p.id] = true; save(); renderStepper(); toast(msg); };
    if (kind === 'copy') {
      copied.then(function () { done(n ? '복사했어요 (빈칸 ' + n + '개는 [대괄호]로 남아 있어요)' : '복사 완료! AI 대화창에 붙여넣기(Ctrl+V)'); },
                  function () { toast('복사에 실패했어요. 프롬프트 상자를 직접 선택해 복사해 주세요.'); });
      return;
    }
    var url = URLS[kind](text), auto = kind !== 'gemini' && url.length < 7000;
    if (kind !== 'gemini' && !auto) url = kind === 'chatgpt' ? 'https://chatgpt.com/' : 'https://claude.ai/new';
    window.open(url, '_blank', 'noopener');
    copied.then(function () {
      done(auto ? NAMES[kind] + ' 새 창에 자동 입력됩니다. 안 보이면 붙여넣기(Ctrl+V)' : '복사됨 → ' + NAMES[kind] + '에서 붙여넣기(Ctrl+V)');
    }, function () { toast('복사에 실패했어요. 프롬프트 상자를 직접 복사해 주세요.'); });
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (g && g.dataset.go !== '' && !g.disabled) { go(+g.dataset.go); return; }
    var a = e.target.closest('[data-act]'); if (a) act(a.dataset.act);
  });
  document.addEventListener('input', function (e) {
    var k = e.target.dataset && e.target.dataset.k; if (!k) return;
    state.v[k] = e.target.value; save();
    var p = P[cur - 1];
    $('pre').innerHTML = html(p);
    var n = blanks(p), c = $('cnt'); c.textContent = cntText(n); c.className = 'cnt' + (n ? '' : ' ok');
    var f = e.target.closest('.field'); if (f) f.classList.toggle('filled', !!e.target.value.trim());
  });
  document.addEventListener('keydown', function (e) {
    if (!cur || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight' && P[cur]) go(P[cur].id);
    if (e.key === 'ArrowLeft' && cur > 1) go(P[cur - 2].id);
  });
  $('startBtn').onclick = function () { go(1); };
  $('resumeBtn').onclick = function () { go(state.last || 1); };
  $('homeBtn').onclick = function () { go(0); };
  $('resetBtn').onclick = function () {
    if (!confirm('입력한 내용과 진행 표시를 모두 지울까요?')) return;
    state = { v: { theme: '1' }, done: {}, last: cur }; save(); render(); toast('초기화했어요');
  };
  window.addEventListener('hashchange', route);
  route();
})();
