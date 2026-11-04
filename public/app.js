/* AI 아이디어 발굴 프롬프트 스튜디오 v2
 * 원칙: ① 먼저 내가 생각해서 쓴다 → ② 내 답이 들어간 프롬프트로 AI 코치에게 묻는다 → ③ AI의 질문에 답하며 내 손으로 정리한다
 * 90분: 오리엔테이션 5 + 불편 찾기 15 + 문제 정의 20 + 아이디어 20 + 돈과 첫 고객 20 + 정리 10
 */
(function () {
  'use strict';

  var STAGES = { 1: '1단계 문제 정의', 2: '2단계 아이디어 도출', 3: '3단계 비즈니스 모델' };

  /* ---------- 질문/빈칸 정의 ---------- */
  // q: 화면에 보이는 질문, label: 프롬프트에 비었을 때 표시되는 이름, ph: 막막할 때 보는 예시
  // theme 별 질문은 {1:[q,ph],2:[q,ph]}
  var F = {
    theme: { label: '해커톤 주제', type: 'select', options: [['1', '일상 속 불편을 창업 아이디어로'], ['2', '스토리텔링 기반의 콘텐츠 창업 아이디어']] },
    who: { label: '나는 누구', q: '나는 누구인가요?', hint: '한 단어로', type: 'text', ph: '예) 대학생, 취준생, 직장 2년 차' },

    a1: { label: '귀찮았던 일', by: { 1: ['이번 주 나를 가장 귀찮게 하거나 짜증나게 한 일은 무엇이었나요?', '예) 알바 끝나고 집에 오면 밥 차리는 게 귀찮아서 편의점으로 때웠다'], 2: ['내 이야기를 남에게 전해야 하는데 입이 안 떨어졌던 순간은 언제였나요?', '예) 면접에서 자기소개를 하려는데 자랑 같아서 말이 막혔다'] } },
    a2: { label: '아까웠던 순간', by: { 1: ['돈이나 시간이 아깝다고 느낀 순간은 언제였나요?', '예) 1인분 배달인데 배달비가 음식값만큼 나왔다'], 2: ['"이 이야기는 꼭 알려야 하는데" 싶었던 사람·가게·장소가 있나요?', '예) 30년 된 동네 국밥집인데 아무도 이야기를 모른다'] } },
    a3: { label: '주변의 불평', by: { 1: ['주변 사람(가족·친구·동네 어른)이 자주 불평하는 것은 무엇인가요?', '예) 엄마가 "반찬을 해도 먹을 사람이 없다"고 하신다'], 2: ['광고나 영상을 보며 "왜 이렇게 재미없지?" 느낀 적이 있나요?', '예) 지역 축제 홍보 영상이 다 똑같아서 기억에 안 남는다'] } },
    pain: { label: '내가 고른 불편', q: '내가 풀고 싶은 불편 한 가지를 골라 보세요.', hint: 'AI가 질문하면 번호 하나 + 이유 한 줄로 답하고, 그 결과를 여기에 쓰세요', type: 'area', ph: '예) 알바 끝난 평일 저녁, 혼자 끼니를 챙기는 일' },

    memo: { label: '인터뷰 메모', q: '옆 사람(또는 가족·친구)에게 물어보고 들은 말을 그대로 적어 보세요.', hint: '① 최근에 그런 일 겪은 적 있어요? ② 그때 어떻게 해결했어요? ③ 그 방법의 제일 불편한 점은요?', type: 'area', ph: '예) "반찬 나눠 준 적은 많은데 팔아 본 적은 없어. 주문 받고 돈 받는 게 제일 걸려."' },
    p_who: { label: '누가', q: '누가 힘든가요?', type: 'text', ph: '예) 알바하는 자취 대학생' },
    p_when: { label: '언제', q: '언제, 어떤 상황에서 힘든가요?', type: 'text', ph: '예) 알바가 끝나고 밤 9시에 집에 왔을 때' },
    p_why: { label: '무엇 때문에', q: '무엇 때문에 힘든가요?', type: 'text', ph: '예) 시간이 없고, 1인분 배달은 비싸서' },
    p_now: { label: '지금은 어떻게', q: '지금은 어떻게 버티고 있나요?', type: 'text', ph: '예) 편의점 도시락이나 라면으로 때운다' },
    problem: { label: '나의 문제 한 문장', q: 'AI의 질문을 받고 더 선명해진, 나의 문제를 한 문장으로 써 보세요.', hint: '"누가 / 언제 / 무엇 때문에 / 지금은 어떻게"가 다 들어가면 좋아요', type: 'area', ph: '예) 알바하는 자취생은 늦은 밤 끼니를 챙기려 할 때 시간이 없고 1인분 배달이 비싸 편의점으로 때운다.' },

    i1: { label: '내 아이디어 1', q: 'AI 없이 내 힘으로, 이 문제를 풀 방법 3개를 먼저 적어 보세요. (1)', type: 'text', ph: '예) 같은 동네 사람끼리 반찬을 나눠 먹는 모임' },
    i2: { label: '내 아이디어 2', q: '(2)', type: 'text', ph: '예) 남은 식재료로 10분 요리를 알려주는 앱' },
    i3: { label: '내 아이디어 3', q: '(3)', type: 'text', ph: '예) 원룸 건물 1층 무인 반찬 냉장고' },
    d1: { label: '다른 업종에서', q: '다른 업종의 방식을 빌려온다면? (구독, 마감 할인, 1:1 코칭, 무인 판매…)', hint: '막히면 건너뛰어도 돼요', type: 'text', opt: true, ph: '예) 꽃 구독처럼 반찬을 매주 정기 배송' },
    d2: { label: '정반대로', q: '정반대로 뒤집으면 어떨까요? (고객과 공급자를 바꾸기, 문제를 아예 없애기…)', hint: '막히면 건너뛰어도 돼요', type: 'text', opt: true, ph: '예) 학생이 요리사가 되어 중장년에게 판다' },
    d3: { label: '사람과 사람', q: '사람과 사람을 이어준다면 누구와 누구를 잇고 싶나요?', hint: '막히면 건너뛰어도 돼요', type: 'text', opt: true, ph: '예) 반찬 솜씨 좋은 동네 어른 ↔ 자취생' },
    idea: { label: '선택한 아이디어', q: '우리 팀에 가져갈 아이디어 하나를 골라 써 보세요.', hint: '내 아이디어든, AI가 낸 것이든 "내가 끌리는 것"으로', type: 'area', ph: '예) 동네 반찬 요리인과 자취생을 잇는 주간 반찬 구독' },
    idea_diff: { label: '다른 점', q: '이미 있는 서비스와 무엇이 다른가요?', type: 'text', ph: '예) 배달앱은 음식점, 우리는 동네 집밥 요리인' },

    m1: { label: '돈 내는 사람', q: '누가 돈을 내나요? (쓰는 사람과 다를 수 있어요)', type: 'text', ph: '예) 학생 본인 또는 걱정하는 부모님' },
    m2: { label: '지금 쓰는 돈·시간', q: '그 사람은 지금 이 문제에 돈과 시간을 얼마나 쓰고 있나요?', type: 'text', ph: '예) 한 끼 7천 원 도시락을 주 5회 (정확하지 않으면 "모름")' },
    m3: { label: '낼 금액', q: '얼마면 낼 것 같나요? 왜 그렇게 생각하나요?', type: 'text', ph: '예) 한 끼 5천 원 정도. 편의점 도시락보다 싸야 하니까 (가정)' },
    m4: { label: '첫 고객 10명', q: '첫 고객 10명은 어디에서 만날 수 있나요?', type: 'text', ph: '예) 우리 학과 단체 대화방' },
    weak: { label: '약점과 보완', q: '가장 아픈 약점 한 가지와, 내가 생각한 보완 방법을 써 보세요.', hint: '모르면 "멘토에게 물어볼 질문"으로 적어도 좋아요', type: 'area', ph: '예) 집에서 만든 음식은 위생 신고가 필요하다 → 신고된 공유주방 이용 가능한지 멘토에게 질문' },

    o_who: { label: '고객', q: '누구를 위한 서비스인가요?', type: 'text', ph: '예) 알바하는 자취 대학생' },
    o_name: { label: '서비스 이름', q: '서비스 이름(임시)은 무엇인가요?', type: 'text', ph: '예) 동네밥상' },
    o_ai: { label: 'AI가 하는 일', q: 'AI가 무엇을 해 주나요?', type: 'text', ph: '예) 예산과 입맛에 맞춰 주간 반찬을 추천' },
    oneliner: { label: '최종 한 줄 소개', q: '내 손으로 다듬은 최종 한 줄 소개를 써 보세요.', hint: '이 문장이 내일 발표의 첫 문장이 됩니다', type: 'area', ph: '예) 자취 대학생을 위한 \'동네밥상\'으로, AI가 예산과 입맛에 맞춰 반찬을 추천해 평일 저녁 끼니 문제를 해결한다.' }
  };

  /* ---------- AI 코치 공통 규칙: 질문이 쉬워야 답이 나온다 ---------- */
  var COACH =
    '\n\n[질문 규칙 — 꼭 지켜줘]\n' +
    '- 질문은 한 번에 딱 1개만 하고, 내가 답하면 다음 질문을 해줘.\n' +
    '- 질문은 한 문장, 쉬운 말로. 두 가지를 한꺼번에 묻지 마.\n' +
    '- 가능하면 ①②③ 중에서 고르게 하고, 이유는 한 줄만 쓰게 해줘.\n' +
    '- "얼마까지 낼 의향이 있나요?" 같은 가정 질문 대신, "최근에 실제로 어땠는지"처럼 지난 경험을 물어줘.\n' +
    '- 내가 막히면 예시 답 2개를 보여주고 고르게 해줘.\n' +
    '- 전체 답변은 짧게. 항목은 한 줄(40자 이내)로 써줘.';

  /* 막혔을 때 AI에게 보낼 한마디 (클릭하면 복사) */
  var RESCUE = ['더 쉬운 말로 다시 물어봐줘', '예시 답 2개만 보여줘', '①②③ 중에서 고르게 해줘', '모르겠어. 힌트를 줘', '더 짧게 줄여줘'];

  /* ---------- 단계 ---------- */
  var P = [
    {
      id: 1, stage: 1, min: 15, title: '내 일상에서 불편 찾기',
      lead: '아이디어는 <b>내 일상</b>에서 나옵니다. AI에게 묻기 전에, 먼저 <b>내 머릿속</b>을 꺼내 봅시다.',
      before: ['who', 'a1', 'a2', 'a3'], theme: true,
      aiTitle: 'AI 코치에게 묻기',
      aiHelp: 'AI는 정답을 주는 사람이 아니라 <b>내 생각을 넓혀 주는 코치</b>입니다. 답은 내가 씁니다.',
      template:
        '나는 {{who}}이고, 일상 속 불편을 찾아 창업 아이디어를 만들려고 해. {{theme_line}}\n\n' +
        '아래는 내가 직접 떠올린 거야.\n' +
        '1) {{a1_q}}\n   → {{a1}}\n' +
        '2) {{a2_q}}\n   → {{a2}}\n' +
        '3) {{a3_q}}\n   → {{a3}}\n\n' +
        '너는 정답을 대신 정해 주는 사람이 아니라, 질문으로 내 생각을 이끄는 코치야. 아래 순서로 해줘.\n' +
        '① 내가 쓴 세 가지의 공통점을 딱 한 줄로 알려줘.\n' +
        '② 내가 놓쳤을 만한 불편을 5개만 더 알려줘. 감정별로 하나씩(귀찮다 / 아깝다 / 불안하다 / 막막하다 / 세대가 함께 ★), 각각 한 줄로.\n' +
        '③ 그다음 질문 딱 1개만 해줘. "이 중 나(또는 내 주변)가 가장 자주 겪는 건 몇 번이에요? 번호 하나와 이유 한 줄만 써 주세요."처럼 번호로 고르게 해줘. 답은 내가 쓸 거니까 네가 대신 답하지 마.' + COACH,
      after: ['pain'],
      tip: '<b>막막하면</b> 칸 안의 회색 예시를 참고하세요. 한 줄만 써도 충분합니다. 첫 프롬프트만 <b>새 대화창</b>에서 시작하고, 이후는 같은 대화창에 이어서 붙여넣으세요.',
      banner: '불편은 <em>내가 직접 겪었거나 본 것</em>일 때 가장 생생합니다',
    },
    {
      id: 2, stage: 1, min: 20, title: '진짜 사람에게 듣고 문제 정의하기',
      lead: '진짜 문제는 <b>책상 위가 아니라 사람</b>에게 있습니다. 옆 사람에게 3분만 물어보고, 문제를 <b>내 문장</b>으로 정의해 봅시다.',
      before: ['memo', 'p_who', 'p_when', 'p_why', 'p_now'],
      aiTitle: 'AI 코치에게 점검받기',
      aiHelp: 'AI가 문장을 대신 써 주지 않고, <b>내 문장의 빈틈</b>을 질문으로 짚어 줍니다.',
      template:
        '좋아, 이어서 2단계로 문제를 정의해 볼게. 방금 네가 정리해 준 불편 중에서 내가 고른 건 이거야.\n{{pain}}\n\n' +
        '[진짜 사람에게 직접 들은 말]\n{{memo}}\n\n' +
        '[내가 쓴 문제 정의 초안]\n' +
        '- 누가: {{p_who}}\n- 언제: {{p_when}}\n- 무엇 때문에: {{p_why}}\n- 지금은 어떻게 버티나: {{p_now}}\n\n' +
        '너는 코치야. 문장을 대신 고쳐 쓰지 말고 아래 순서로 해줘.\n' +
        '① 내 초안을 3가지 기준으로 1~5점 채점해 작은 표로 보여줘. (많은가 / 자주·크게 겪는가 / 이미 돈·시간을 쓰는가) 이유는 각각 한 줄.\n' +
        '② 가장 약한 부분 하나만 짚어줘.\n' +
        '③ 그 약한 부분을 선명하게 하는 질문을 1개만 해줘. 반드시 "최근에 실제로 있었던 일"을 묻는 질문이어야 해. (예: "그런 일이 마지막으로 있었던 게 언제예요? ①오늘 ②이번 주 ③이번 달 ④기억 안 남")\n' +
        '인터뷰 메모에 없는 내용은 지어내지 말고 "(가정)"이라고 표시해줘.' + COACH,
      after: ['problem'],
      tip: '<b>인터뷰 3가지 질문</b><ul><li>최근에 그런 일을 겪은 적 있어요? 언제요?</li><li>그때 어떻게 해결했어요?</li><li>그 방법에서 제일 불편한 점은요?</li></ul>옆 사람이 없다면 AI에게 “너는 ○○인 사람이야, 인터뷰할게”라고 시켜도 됩니다. 단, <b>AI가 말한 숫자는 가설</b>입니다.',
      banner: '문제를 <em>한 문장</em>으로 쓸 수 있으면 반은 온 겁니다',
    },
    {
      id: 3, stage: 2, min: 20, title: '내 아이디어 먼저, 그다음 확장',
      lead: 'AI 아이디어는 누구나 받습니다. <b>내 아이디어를 먼저</b> 적고, AI로는 <b>내 생각을 넓혀</b> 보세요.',
      before: ['i1', 'i2', 'i3', 'd1', 'd2', 'd3'],
      aiTitle: 'AI 코치와 아이디어 키우기',
      aiHelp: 'AI가 내 아이디어를 <b>한 단계 더 구체화</b>하고, 내가 못 본 방향도 보여 줍니다.',
      template:
        '이어서 아이디어를 찾아보자. 방금 우리가 다듬은 내 문제 정의는 이거야.\n{{problem}}\n\n' +
        '[내가 먼저 떠올린 아이디어]\n- {{i1}}\n- {{i2}}\n- {{i3}}\n\n' +
        '[내가 해 본 생각 놀이]\n- 다른 업종에서 빌려오면: {{d1}}\n- 정반대로 뒤집으면: {{d2}}\n- 사람과 사람을 이으면: {{d3}}\n\n' +
        '너는 코치야. 내 아이디어를 대신 버리거나 정하지 말고 아래 순서로 해줘.\n' +
        '① 내가 떠올리지 못한 방향의 새 아이디어를 5개만 더 알려줘. (AI가 대신 / AI가 가르쳐 / 사람과 사람 / 다른 업종 / 정반대에서 하나씩, 각각 한 줄)\n' +
        '② 내 것과 새 것 중 유망한 5개를 4가지 기준으로 1~5점 채점해 표로 보여줘. (문제 해결 / 6개월 안 시작 가능 / AI가 꼭 필요한가 / 다른 서비스와 다른 점)\n' +
        '③ 그다음 질문 딱 1개만 해줘. "이 중 가장 끌리는 건 몇 번이에요? 번호 하나와 이유 한 줄만 써 주세요."처럼 번호로 고르게 해줘. 선택은 내가 해.' + COACH,
      after: ['idea', 'idea_diff'],
      tip: '<b>3개가 어려우면 1개만</b> 써도 됩니다. 이상해 보여도 괜찮아요. <b>점수는 낮지만 이야기가 강한 아이디어</b>가 심사에서 기억에 남기도 합니다.',
      banner: '“내가 끌리는 것”을 고르는 힘이 <em>창의력</em>입니다',
    },
    {
      id: 4, stage: 3, min: 20, title: '누가 돈을 낼까? 첫 고객은?',
      lead: '심사위원은 <b>"그래서 누가 돈을 내죠?"</b>를 묻습니다. 답을 먼저 적고, AI 심사위원에게 <b>한 질문씩</b> 받아 보세요.',
      before: ['m1', 'm2', 'm3', 'm4'],
      aiTitle: 'AI 심사위원에게 받아 보기',
      aiHelp: 'AI가 <b>한 번에 질문 하나씩</b> 던지고, 내가 답하면 다음 질문으로 넘어갑니다.',
      template:
        '이어서 돈 이야기를 해보자. 방금 내가 고른 아이디어는 이거야.\n{{idea}}\n(다른 점: {{idea_diff}})\n\n' +
        '[내가 생각한 돈 이야기]\n' +
        '- 돈 내는 사람: {{m1}}\n- 지금 쓰는 돈·시간: {{m2}}\n- 낼 금액과 이유: {{m3}}\n- 첫 고객 10명: {{m4}}\n\n' +
        '지금부터 너는 까다로운 창업 해커톤 심사위원이야. 아래 규칙으로 진행해줘.\n' +
        '- 질문은 한 번에 하나씩만 해. 내가 답하면 그 답의 빈틈을 파고드는 다음 질문을 해.\n' +
        '- 총 5개 질문을 한 뒤, 가장 치명적인 약점 1개와 보완 방향을 알려줘. (법규·품질·비용·시장·경쟁 관점)\n' +
        '- 내가 모르는 것은 억지로 답하지 않게 하고, 멘토에게 물어볼 질문으로 정리해줘.\n' +
        '- 네가 대신 답을 만들어 주지 마.' + COACH + '\n\n준비되면 첫 질문을 해줘.',
      after: ['weak'],
      tip: '<b>정확한 숫자를 몰라도 됩니다.</b> “모름”이나 “(가정)”으로 적는 게 지어내는 것보다 낫습니다. 그 칸이 <b>오후 멘토링 질문</b>이 됩니다.',
      banner: '앱을 만들기 전에 <em>10명이 돈을 낼지</em> 먼저 확인하세요',
    },
    {
      id: 5, stage: 3, min: 10, title: '한 줄 소개로 정리하기',
      lead: '지금까지의 내 답을 <b>한 문장</b>으로 모읍니다. 이 문장이 <b>발표의 첫 문장</b>이 됩니다.',
      before: ['o_who', 'o_name', 'o_ai'],
      aiTitle: 'AI 코치와 다듬기',
      aiHelp: 'AI가 후보를 보여 주면 <b>내가 고르고 고칩니다.</b>',
      template:
        '마지막으로 지금까지 정리한 걸 한 줄로 모아 보자.\n- 문제: {{problem}}\n- 아이디어: {{idea}}\n- 고객: {{o_who}}\n- 서비스 이름(임시): {{o_name}}\n- AI가 하는 일: {{o_ai}}\n\n' +
        '아래 형식으로 한 줄 소개 후보 3개를 만들어줘.\n"[고객]을 위한 \'[서비스]\'로, AI가 [무엇을 해서] [어떤 문제]를 해결한다."\n\n' +
        '그리고 다음도 해줘.\n' +
        '① 서비스 이름 후보 5개 (짧고 부르기 쉽게, 이유 한 줄)\n' +
        '② 발표 첫 30초에 말할 오프닝 멘트 3가지 (질문형 / 장면형 / 숫자형)\n' +
        '정하는 건 내가 할 거니까 후보만 줘. 마지막에 질문 1개만 해줘: "한 줄 소개 후보 중 가장 마음에 드는 건 몇 번이에요? 이유는 한 줄만."' + COACH,
      after: ['oneliner'],
      tip: '소리 내어 읽어 보고 <b>어색하면 더 쉬운 말로</b> 고치세요. 다 끝나면 오른쪽 위 <b>“내 아이디어 카드”</b>로 정리해 오후 팀 워크숍에 가져갑니다.',
      banner: '한 줄 소개가 <em>내일 발표의 첫 문장</em>이 됩니다',
    },
    {
      id: 6, stage: 3, min: 0, card: true, title: '내 아이디어 카드',
      lead: '오늘 내 손으로 쓴 것을 <b>한 장</b>으로 모았습니다. 복사하거나 인쇄해서 <b>오후 팀 워크숍</b>에 가져가세요.',
      before: [],
      aiTitle: '(선택) 5분 발표 구성 받기',
      aiHelp: '카드 내용으로 <b>PT 5분 + 질의응답 5분</b> 발표 구성을 만듭니다.',
      template:
        '아래는 우리 팀(또는 내) 아이디어 카드야.\n\n{{card}}\n\n' +
        '이 내용으로 해커톤 발표 구성을 짜 줘.\n' +
        '- PT 5분 + 질의응답 5분\n- 슬라이드 6장 이내: 장마다 제목, 핵심 문장 1개, 화면에 넣을 것\n' +
        '- 1장은 한 줄 소개로 시작\n- 장마다 말하는 시간 배분 (합계 5분)\n- 예상 질문 3개는 질문만 주고, 답은 내가 준비할 수 있게 힌트 한 줄만 줘.',
      after: [],
      tip: '카드의 빈 줄은 <b>아직 안 정한 것</b>입니다. 오후 팀 워크숍과 멘토링에서 채워 가면 됩니다.',
      banner: '오늘 만든 건 <em>답이 아니라 출발점</em>입니다 — 오후에 팀과 키워 보세요',
    }
  ];


  /* ---------- 앞 단계에서 이어 오는 항목 ---------- */
  var CARRY = {
    2: [['pain', '1단계에서 고른 불편', 1]],
    3: [['problem', '2단계에서 다듬은 내 문제', 2]],
    4: [['idea', '3단계에서 고른 아이디어', 3], ['idea_diff', '다른 점', 3]],
    5: [['problem', '내 문제', 2], ['idea', '내 아이디어', 3]]
  };
  var CHAIN = [[1, 'pain', '불편'], [2, 'problem', '문제'], [3, 'idea', '아이디어'], [4, 'weak', '돈·약점'], [5, 'oneliner', '한 줄 소개']];

  /* ---------- 예시 체험: 동네 밥상 잇기 (1→5단계가 어떻게 이어지는지) ---------- */
  var DEMO = {
    v: {
      theme: '1', who: '대학생 (자취 1년 차)',
      a1: '알바 끝나고 집에 오면 밥 차리는 게 귀찮아서 편의점 도시락이나 라면으로 때웠다',
      a2: '1인분 배달인데 배달비가 음식값만큼 나왔다',
      a3: '엄마가 "반찬을 해도 먹을 사람이 없어 남는다"고 하신다',
      pain: '⑤ 집밥 반찬이 그리운 자취생과, 반찬을 나눌 데 없는 동네 어른 (이유: 나는 집밥 반찬이 그립고, 동네 어른은 반찬이 남아서)',
      memo: '(옆 사람 인터뷰) "반찬 나눠 준 적은 많은데 팔아 본 적은 없어요. 주문 받고 돈 받는 게 제일 걸려요."',
      p_who: '알바하는 자취 대학생', p_when: '알바가 끝나고 밤 9시에 집에 왔을 때', p_why: '시간이 없고 1인분 배달은 비싸서', p_now: '편의점 도시락이나 라면으로 때운다',
      problem: '알바하는 자취생은 늦은 밤 끼니를 챙기려 할 때 시간이 없고 1인분 배달이 비싸서, 이번 주에만 편의점 도시락(약 5천 원)을 5번 사 먹었다.',
      i1: '동네 어른과 자취생이 반찬을 나눠 먹는 모임', i2: '남은 재료로 10분 요리를 알려주는 앱', i3: '원룸 건물 1층 무인 반찬 냉장고',
      d1: '꽃 구독처럼 반찬을 매주 정기 배송', d2: '학생이 요리사가 되어 중장년에게 판다', d3: '반찬 솜씨 좋은 동네 어른 ↔ 자취생',
      idea: '동네 반찬 요리인과 자취생을 잇는 주간 반찬 구독 (AI가 예산·입맛에 맞춰 반찬을 추천)',
      idea_diff: '배달앱은 음식점이 만든 음식, 우리는 동네 집밥 요리인이 만든 반찬',
      m1: '학생 본인 (결제는 부모님이 대신 할 수도 있음)', m2: '편의점 도시락 한 끼 약 5천 원, 일주일에 5번 정도', m3: '한 끼 4천~5천 원. 편의점보다 싸야 갈아탈 것 같다 (가정)', m4: '우리 학과 단체 대화방, 기숙사 게시판',
      weak: '집에서 만든 반찬 판매는 식품 위생 신고가 필요하다 → 신고된 공유주방을 쓰거나 기존 반찬 가게와 제휴할 수 있는지 멘토에게 질문',
      o_who: '알바하는 자취 대학생', o_name: '동네밥상', o_ai: '예산과 입맛에 맞춰 주간 반찬을 추천',
      oneliner: '알바하는 자취 대학생을 위한 \'동네밥상\'으로, AI가 예산과 입맛에 맞춰 주간 반찬을 추천하고 동네 요리인과 이어 주어 늦은 밤 끼니 문제를 해결한다.'
    },
    ai: {
      1: '<p><b>① 공통점</b> 한 끼를 해결하는 노력과 돈이 “혼자 사는 1인 기준”에 맞지 않는다.</p>' +
        '<p><b>② 놓쳤을 불편 5개</b></p><div class="tblwrap"><table><tr><th>감정</th><th>불편</th></tr>' +
        '<tr><td>귀찮다</td><td>① 배달 용기를 씻어 분리수거하는 일</td></tr><tr><td>아깝다</td><td>② 대파·양파를 한 단씩 사서 절반을 버린다</td></tr>' +
        '<tr><td>불안하다</td><td>③ 편의점 음식만 먹다 건강이 나빠질까 걱정된다</td></tr><tr><td>막막하다</td><td>④ 아플 때 챙겨 줄 사람이 없다</td></tr>' +
        '<tr><td>세대가 함께 ★</td><td>⑤ 자취생은 집밥 반찬이 그립고, 동네 어른은 반찬을 나눌 데가 없다</td></tr></table></div>' +
        '<p class="aiq"><b>③ AI의 마지막 질문</b> “이 중 나(또는 내 주변)가 가장 자주 겪는 건 몇 번이에요? 번호 하나와 이유 한 줄만 써 주세요.”</p>',
      2: '<div class="tblwrap"><table><tr><th>기준</th><th>점수</th><th>이유</th></tr><tr><td>많은가</td><td>5</td><td>자취생·동네 어른 모두 해당</td></tr>' +
        '<tr><td>자주·크게</td><td>5</td><td>매일 저녁 반복</td></tr><tr><td>돈·시간</td><td>3</td><td>얼마를 쓰는지가 아직 안 보임</td></tr></table></div>' +
        '<p><b>가장 약한 부분</b> “이미 돈·시간을 쓰는가” — 실제 지출이 문장에 없어요.</p>' +
        '<p class="aiq"><b>AI의 마지막 질문</b> “편의점 도시락을 마지막으로 산 게 언제예요? ① 오늘 ② 이번 주 ③ 이번 달 ④ 기억 안 남”</p>',
      3: '<p><b>① 새 아이디어 5개</b> AI가 대신: 예산·입맛 맞춤 주간 식단 · AI가 가르쳐: 장보기 예산 코치 · 사람과 사람: 같은 원룸 건물 공동 밥상 · 다른 업종: 식당 마감 반찬 떨이 · 정반대: 아침을 공략하는 반찬</p>' +
        '<div class="tblwrap"><table><tr><th>아이디어</th><th>문제 해결</th><th>6개월 안</th><th>AI 필요</th><th>다른 점</th><th>합계</th></tr>' +
        '<tr><td>동네 반찬 요리인 ↔ 자취생 구독 (내 것)</td><td>5</td><td>4</td><td>4</td><td>4</td><td><b>17</b></td></tr>' +
        '<tr><td>식당 마감 반찬 떨이</td><td>4</td><td>5</td><td>3</td><td>3</td><td>15</td></tr>' +
        '<tr><td>예산·입맛 맞춤 주간 식단</td><td>3</td><td>5</td><td>5</td><td>2</td><td>15</td></tr>' +
        '<tr><td>원룸 1층 무인 반찬 냉장고 (내 것)</td><td>4</td><td>3</td><td>3</td><td>4</td><td>14</td></tr></table></div>' +
        '<p class="aiq"><b>AI의 마지막 질문</b> “이 중 가장 끌리는 건 몇 번이에요? 번호 하나와 이유 한 줄만 써 주세요.”</p>',
      4: '<div class="tblwrap"><table><tr><th>AI 심사위원의 질문 (한 번에 하나)</th><th>내 답</th></tr>' +
        '<tr><td>① 최근 한 달 편의점 도시락에 쓴 돈은? ㉠5만 원 미만 ㉡5~10만 원 ㉢10만 원 이상</td><td>㉢ 10만 원 이상</td></tr>' +
        '<tr><td>② 반찬 요리인은 어디서 모을 건가요? ㉠주민센터 ㉡동네 카페 ㉢아직 모름</td><td>㉢ 아직 모름 → 멘토에게 질문</td></tr>' +
        '<tr><td>③ 학생이 주 2회 픽업하러 갈 수 있나요? ㉠네 ㉡어려워요</td><td>㉠ 네, 원룸 근처라면</td></tr>' +
        '<tr><td>④ 방학 두 달은 어떻게 버틸 건가요?</td><td>아직 모름 → 멘토에게 질문</td></tr></table></div>' +
        '<p class="aiq"><b>가장 치명적인 약점 1개</b> 집에서 만든 반찬 판매는 식품 위생 신고 대상이라 사고 책임이 팀에 옵니다. 보완: 신고된 공유주방 사용, 또는 기존 반찬 가게와 제휴. <br><b>멘토에게 물어볼 질문</b> 공유주방 비용은 얼마인가요? 제휴가 현실적인가요?</p>',
      5: '<p><b>한 줄 소개 후보</b></p><ol><li>알바하는 자취 대학생을 위한 \'동네밥상\'으로, AI가 예산과 입맛에 맞춰 주간 반찬을 추천해 늦은 밤 끼니 문제를 해결한다.</li>' +
        '<li>집밥이 그리운 자취생과 반찬이 남는 동네 어른을 잇는 \'반찬이음\'.</li><li>편의점 도시락 대신 동네 집밥, \'한끼동네\'.</li></ol>' +
        '<p><b>이름 후보</b> 동네밥상 · 반찬이음 · 한끼동네 · 엄마손구독 · 밥상잇기</p><p><b>오프닝 멘트</b> (질문형) “오늘 저녁, 뭐 드셨어요?” · (장면형) “밤 9시, 편의점 불빛 아래서…” · (숫자형) “이번 주 편의점 도시락 5번.”</p>' +
        '<p class="aiq"><b>AI의 마지막 질문</b> “한 줄 소개 후보 중 가장 마음에 드는 건 몇 번이에요? 이유는 한 줄만.”</p>',
      6: '<ol><li>문제: 밤 9시, 편의점 도시락 5번</li><li>사람: 알바하는 자취생 인터뷰</li><li>해결: 동네밥상 구독 (한 줄 소개)</li><li>돈: 한 끼 4~5천 원, 첫 고객 10명</li><li>약점과 보완: 위생 신고 → 공유주방</li><li>다음 한 걸음: 2주 수동 실험</li></ol>' +
        '<p>시간 배분 2분 · 40초 · 1분 · 40초 · 30초 · 10초 = 5분 / 예상 질문: 위생 사고는 누가 책임지나요? 방학엔 어떻게 버티나요?</p>'
    },
    pick: {
      1: '⑤번이요. 나는 집밥 반찬이 그립고, 동네 어른들은 반찬이 남아서요.',
      2: '② 이번 주예요. 이번 주에만 5번 샀어요. → (이 답을 넣어 문제 문장을 다시 썼어요)',
      3: '동네 반찬 요리인 구독이요. 내 아이디어(사람과 사람)에 AI 추천을 더하면 가장 현실적이에요.',
      4: '약점은 위생 신고. 공유주방이 가능한지 멘토에게 물어볼게요.',
      5: '① 번이요. 누가 쓰고 AI가 뭘 하는지 한 번에 보여서요.',
      6: ''
    }
  };
  function startDemo() { demoState = { v: JSON.parse(JSON.stringify(DEMO.v)), done: {}, last: 0 }; S = demoState; demo = true; }

  /* ---------- 상태 ---------- */
  var KEY = 'aiIdeaStudio.v2';
  var state = { v: { theme: '1' }, done: {}, last: 0 };
  try { var s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v) state = s; } catch (e) {}
  var S = state, demo = false, demoState = null;
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  /* ---------- 유틸 ---------- */
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function val(k) { return (S.v[k] || '').trim(); }
  var toastT;
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 3200); }
  function theme() { return S.v.theme === '2' ? '2' : '1'; }
  function qinfo(k) { var f = F[k]; if (f.by) return { q: f.by[theme()][0], ph: f.by[theme()][1] }; return { q: f.q, ph: f.ph }; }
  function themeLine() {
    return theme() === '2'
      ? '주제는 "스토리텔링 기반의 콘텐츠 창업 아이디어"야. 사람들이 자기 이야기를 전하거나 이야기로 알리고 싶은데 어려워하는 불편에 주목해.'
      : '주제는 "일상 속 불편을 창업 아이디어로"야.';
  }
  function cardText() {
    function L(label, k) { return label + ': ' + (val(k) || '(아직 없음)'); }
    return [
      '■ 내가 고른 불편\n' + (val('pain') || '(아직 없음)'),
      '■ 문제 정의\n' + (val('problem') || '(아직 없음)') + '\n(누가: ' + (val('p_who') || '-') + ' / 언제: ' + (val('p_when') || '-') + ' / 이유: ' + (val('p_why') || '-') + ' / 지금은: ' + (val('p_now') || '-') + ')',
      '■ 진짜 사람에게 들은 말\n' + (val('memo') || '(아직 없음)'),
      '■ 선택한 아이디어\n' + (val('idea') || '(아직 없음)') + '\n' + L('다른 점', 'idea_diff'),
      '■ 돈과 첫 고객\n' + [L('돈 내는 사람', 'm1'), L('지금 쓰는 돈·시간', 'm2'), L('낼 금액', 'm3'), L('첫 고객 10명', 'm4')].join('\n'),
      '■ 가장 아픈 약점과 보완\n' + (val('weak') || '(아직 없음)'),
      '■ 한 줄 소개\n' + (val('oneliner') || '(아직 없음)')
    ].join('\n\n');
  }

  /* 템플릿 → 조각 */
  function parts(p) {
    var out = [], re = /\{\{(\w+)\}\}/g, last = 0, m, tpl = p.template;
    while ((m = re.exec(tpl))) {
      if (m.index > last) out.push({ t: tpl.slice(last, m.index) });
      var k = m[1];
      if (k === 'theme_line') out.push({ t: themeLine() });
      else if (k === 'card') out.push({ t: cardText() });
      else if (/_q$/.test(k)) out.push({ t: qinfo(k.slice(0, -2)).q });
      else out.push({ k: k, v: val(k) });
      last = re.lastIndex;
    }
    if (last < tpl.length) out.push({ t: tpl.slice(last) });
    return out;
  }
  function fill(x) { return x.v || (F[x.k].opt ? '(아직 없음)' : '[' + F[x.k].label + ']'); }
  function plain(p) { return parts(p).map(function (x) { return x.k ? fill(x) : x.t; }).join(''); }
  function html(p) {
    return parts(p).map(function (x) {
      if (!x.k) return esc(x.t);
      if (x.v) return '<mark>' + esc(x.v) + '</mark>';
      return F[x.k].opt ? '<span class="optv">(아직 없음)</span>' : '<mark class="blank">[' + esc(F[x.k].label) + ']</mark>';
    }).join('');
  }
  function blanks(p) { return parts(p).filter(function (x) { return x.k && !x.v && !F[x.k].opt; }).length; }

  /* ---------- 라우팅 ---------- */
  var cur = 0;
  function go(n) { location.hash = n ? '#/' + (demo ? 'd/' : '') + n : '#/'; }
  function route() {
    var m = /^#\/(d\/)?(\d+)/.exec(location.hash);
    var n = m ? Math.min(+m[2], P.length) : 0;
    if (m && m[1]) { if (!demo || !demoState) startDemo(); } else { demo = false; S = state; }
    stopTimer(); cur = n;
    $('cover').hidden = n !== 0; $('studio').hidden = n === 0;
    if (n) { if (!demo) { state.last = n; save(); } render(); window.scrollTo(0, 0); $('slide').focus({ preventScroll: true }); }
    else { $('resumeBtn').hidden = !(state.last > 0); window.scrollTo(0, 0); }
  }

  /* ---------- 타이머 ---------- */
  var tm = { id: null, left: 0 };
  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return (m < 10 ? '0' : '') + m + ':' + (r < 10 ? '0' : '') + r; }
  function stopTimer() { if (tm.id) { clearInterval(tm.id); tm.id = null; } }
  function toggleTimer() {
    var p = P[cur - 1], b = $('timerBtn'); if (!p.min || !b) return;
    if (tm.id) { stopTimer(); b.textContent = '⏱ 다시 시작 ' + fmt(tm.left); return; }
    if (!tm.left || tm.left <= 0 || tm.stepId !== p.id) { tm.left = p.min * 60; tm.stepId = p.id; }
    b.textContent = '⏸ ' + fmt(tm.left);
    tm.id = setInterval(function () {
      tm.left--; var bb = $('timerBtn'); if (bb) bb.textContent = '⏸ ' + fmt(Math.max(tm.left, 0));
      if (tm.left <= 0) { stopTimer(); if (bb) bb.textContent = '⏱ 시간 끝!'; toast('시간 끝! 쓴 데까지만 다음 단계로 넘어가요'); }
    }, 1000);
  }

  /* ---------- 렌더 ---------- */
  function render() {
    var p = P[cur - 1];
    $('crumbs').innerHTML = crumbs(p); renderDemoBar(); renderChain(p); renderStepper(); renderSlide(p); renderPager();
    document.title = p.title + ' · AI 아이디어 발굴 프롬프트 스튜디오';
  }
  function firstOf(s) { for (var i = 0; i < P.length; i++) if (P[i].stage === s) return P[i].id; return 1; }
  function crumbs(p) {
    var h = '<button data-go="0">시작</button>';
    [1, 2, 3].forEach(function (s) { h += '<span class="sep">›</span>' + (p.stage === s ? '<span class="on">' + STAGES[s] + '</span>' : '<button data-go="' + firstOf(s) + '">' + STAGES[s] + '</button>'); });
    return h;
  }
  function renderStepper() {
    $('stepper').innerHTML = P.map(function (p) {
      var cls = 'chip' + (p.id === cur ? ' on' : '') + (S.done[p.id] ? ' done' : '') + (p.card ? ' bonus' : '');
      return '<button class="' + cls + '" data-go="' + p.id + '" role="tab" aria-selected="' + (p.id === cur) + '">' + (p.card ? '카드' : p.id) + '<small>' + esc(p.title) + (p.min ? ' · ' + p.min + '분' : '') + '</small></button>';
    }).join('');
    var on = $('stepper').querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  }
  function qcard(k, i, num) {
    var f = F[k], v = S.v[k] || '', id = 'f_' + k;
    if (f.type === 'select') {
      return '<div class="field"><label for="' + id + '">' + esc(f.label) + '</label><select id="' + id + '" data-k="' + k + '">' + f.options.map(function (o) { return '<option value="' + o[0] + '"' + (theme() === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></div>';
    }
    var qi = qinfo(k);
    var ctl = f.type === 'area'
      ? '<textarea id="' + id + '" data-k="' + k + '" rows="3" placeholder="' + esc(qi.ph || '') + '">' + esc(v) + '</textarea>'
      : '<input id="' + id + '" data-k="' + k + '" type="text" value="' + esc(v) + '" placeholder="' + esc(qi.ph || '') + '" autocomplete="off">';
    return '<div class="field q' + (v ? ' filled' : '') + '"><label for="' + id + '"><span class="qn">' + num + '</span><span>' + esc(qi.q) + (f.opt ? ' <i>선택</i>' : '') + (f.hint ? '<em>' + esc(f.hint) + '</em>' : '') + '</span></label>' + ctl + '</div>';
  }
  function fieldList(keys, start) { var n = start || 1; return keys.map(function (k) { var h = qcard(k, 0, F[k].type === 'select' ? '' : n); if (F[k].type !== 'select') n++; return h; }).join(''); }
  function cardHtml() {
    var rows = [['내가 고른 불편', 'pain'], ['문제 정의', 'problem'], ['진짜 사람에게 들은 말', 'memo'], ['선택한 아이디어', 'idea'], ['다른 점', 'idea_diff'], ['돈 내는 사람', 'm1'], ['지금 쓰는 돈·시간', 'm2'], ['낼 금액', 'm3'], ['첫 고객 10명', 'm4'], ['약점과 보완', 'weak']];
    return '<div class="idcard"><div class="idcard-h"><span>내 아이디어 카드</span><small>AI Build-up 창업 캠프</small></div>' +
      '<div class="idcard-one">' + (val('oneliner') ? esc(val('oneliner')) : '<span class="optv">한 줄 소개를 5단계에서 완성하면 여기에 나타나요</span>') + '</div>' +
      '<dl>' + rows.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + (val(r[1]) ? esc(val(r[1])) : '<span class="optv">아직 없음</span>') + '</dd></div>'; }).join('') + '</dl></div>';
  }

  function renderDemoBar() {
    var b = $('demobar'); b.hidden = !demo;
    if (demo) b.innerHTML = '<span><b>🎬 예시 체험 중</b> — ‘동네 밥상 잇기’ 사례로 1단계 → 5단계가 어떻게 이어지는지 보세요. 입력해도 저장되지 않아요.</span><button class="btn-sm" data-act="exitdemo">내 아이디어로 시작 ›</button>';
  }
  function short(v, n) { v = (v || '').replace(/\s+/g, ' ').trim(); return v.length > n ? v.slice(0, n) + '…' : v; }
  function renderChain(p) {
    $('chain').innerHTML = '<div class="chain-in">' + CHAIN.map(function (c, i) {
      var v = val(c[1]), on = p.id === c[0];
      return (i ? '<span class="arrow" aria-hidden="true">→</span>' : '') +
        '<button class="node' + (v ? ' got' : '') + (on ? ' on' : '') + '" data-go="' + c[0] + '"><small>' + c[0] + '단계 · ' + c[2] + '</small><span>' + (v ? esc(short(v, 26)) : '아직 안 정했어요') + '</span></button>';
    }).join('') + '</div>';
  }
  function carryHtml(p) {
    var list = CARRY[p.id]; if (!list) return '';
    var rows = list.map(function (c) {
      var v = val(c[0]);
      return '<div class="carry-row"><small>' + esc(c[1]) + '</small>' + (v ? '<mark>' + esc(v) + '</mark>' : '<span class="optv">아직 안 썼어요 — <button class="link" data-go="' + c[2] + '">' + c[2] + '단계에서 정리하기</button></span>') + '</div>';
    }).join('');
    return '<div class="carry"><h3 class="block-title">앞 단계에서 이어 온 내용 <span class="rule">자동으로 프롬프트에 들어가요</span></h3>' + rows + '</div>';
  }
  function aiHtml(p) {
    var pick = DEMO.pick[p.id];
    return '<details class="aiex"' + (demo ? ' open' : '') + '><summary>④ AI는 이렇게 답해요 (예시) — ' + (demo ? '이 답으로 다음 단계가 이어져요' : '막막할 때 열어 보세요') + '</summary><div class="aiex-body">' +
      '<div class="bub ai"><b>AI 코치</b>' + DEMO.ai[p.id] + '</div>' +
      (pick ? '<div class="bub me"><b>나</b><p>' + esc(pick) + '</p></div>' : '') +
      (P[p.id] ? '<div class="flowto"><span>↓ 이 답이 ③ 칸에 정리되고, 다음 단계 프롬프트에 그대로 들어갑니다</span>' + (demo ? '<button class="btn-sm" data-go="' + P[p.id].id + '">' + esc(P[p.id].title) + ' 보기 ›</button>' : '') + '</div>' : '') +
      '</div></details>';
  }
  function renderSlide(p) {
    var n = blanks(p), st = STAGES[p.stage];
    var beforeKeys = (p.theme ? ['theme'] : []).concat(p.before);
    var left = '';
    if (p.card) {
      left = '<h3 class="block-title">① 오늘 내가 만든 것</h3>' + cardHtml() +
        '<div class="card-actions"><button class="sbtn copy" data-act="copycard">📋 카드 복사</button><button class="sbtn" data-act="print">🖨 인쇄 / PDF</button></div>';
    } else {
      left = '<h3 class="block-title">① 먼저 내 생각 쓰기 <span class="rule">AI 없이 먼저!</span></h3><div class="fields">' + fieldList(beforeKeys) + '</div>';
    }
    left = carryHtml(p) + left;
    left += '<div class="tip">' + p.tip + '</div>';
    var right =
      '<h3 class="block-title">② ' + esc(p.aiTitle) + '</h3><p class="aihelp">' + p.aiHelp + '</p>' +
      '<div class="pbox"><div class="pbox-head"><span>프롬프트 · 내 답이 자동으로 들어가요</span><span class="cnt' + (n ? '' : ' ok') + '" id="cnt">' + cntText(n) + '</span></div>' +
      '<pre class="pre" id="pre">' + html(p) + '</pre></div>' +
      '<div class="send"><div class="send-row">' +
      '<button class="sbtn copy" data-act="copy">📋 복사하기</button>' +
      '<button class="sbtn" data-act="chatgpt"><span class="dot d-gpt"></span>ChatGPT</button>' +
      '<button class="sbtn" data-act="gemini"><span class="dot d-gem"></span>Gemini</button>' +
      '<button class="sbtn" data-act="claude"><span class="dot d-cla"></span>Claude</button></div>' +
      '<div class="rescue"><b>AI 질문이 어려우면 이렇게 말하세요 (누르면 복사)</b>' + RESCUE.map(function (r) { return '<button class="rchip" data-copy="' + esc(r) + '">' + esc(r) + '</button>'; }).join('') + '</div>' +
      '<p class="sendnote">' + (p.id === 1
        ? '<b>새 대화창</b>이 열립니다. ChatGPT·Claude는 자동 입력, <b>Gemini는 붙여넣기(Ctrl+V)</b>가 필요해요. 어떤 버튼이든 먼저 자동 복사됩니다.'
        : '<b>같은 대화창에 이어서</b> 붙여넣으세요(Ctrl+V). 새 창을 열면 앞 내용을 AI가 기억하지 못합니다.') + '</p></div>';
    var after = p.after.length
      ? '<section class="after"><h3 class="block-title navy">③ AI의 마지막 질문에 내가 한 답 <span class="rule">→ 다음 단계에 이어져요</span></h3><div class="fields">' + fieldList(p.after, 1) + '</div></section>' : '';
    var ex = aiHtml(p);
    $('slide').innerHTML =
      '<div class="slide-head"><div><p class="stage-label">' + st + '</p><h2>' + (p.card ? '' : p.id + '. ') + esc(p.title) + '</h2></div>' +
      (p.min ? '<button class="timer" id="timerBtn" data-act="timer">⏱ ' + p.min + '분 타이머</button>' : '') + '</div>' +
      '<p class="lead">' + p.lead + '</p>' +
      '<div class="grid"><section>' + left + '</section><section>' + right + '</section></div>' + after + ex +
      '<div class="banner">' + p.banner + '</div>';
  }
  function cntText(n) { return n ? '빈칸 ' + n + '개 남음' : '✓ 모두 채워짐'; }
  function renderPager() {
    var a = P[cur - 2], b = P[cur];
    $('prevBtn').disabled = !a; $('nextBtn').disabled = !b;
    $('prevBtn').dataset.go = a ? a.id : ''; $('nextBtn').dataset.go = b ? b.id : '';
    $('prevBtn').innerHTML = a ? '‹ <b>이전</b> · ' + esc(a.title) : '';
    $('nextBtn').innerHTML = b ? '<b>다음</b> › ' + esc(b.title) + (b.id < 6 ? ' <em>(내 답이 이어져요)</em>' : '') : '';
  }

  /* ---------- 복사 · 보내기 ---------- */
  function fallbackCopy(text) {
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); ok ? res() : rej();
    });
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text).catch(function () { return fallbackCopy(text); });
    return fallbackCopy(text);
  }
  var URLS = {
    chatgpt: function (t) { return 'https://chatgpt.com/?q=' + encodeURIComponent(t); },
    claude: function (t) { return 'https://claude.ai/new?q=' + encodeURIComponent(t); },
    gemini: function () { return 'https://gemini.google.com/app'; }
  };
  var NAMES = { chatgpt: 'ChatGPT', claude: 'Claude', gemini: 'Gemini' };
  function act(kind) {
    var p = P[cur - 1];
    if (kind === 'timer') return toggleTimer();
    if (kind === 'exitdemo') { demo = false; S = state; go(1); return; }
    if (kind === 'print') return window.print();
    if (kind === 'copycard') return copyText(cardText()).then(function () { toast('카드를 복사했어요'); }, function () { toast('복사에 실패했어요'); });
    var text = plain(p), n = blanks(p), copied = copyText(text);
    var done = function (msg) { S.done[p.id] = true; if (!demo) save(); renderStepper(); toast(msg); };
    if (kind === 'copy') {
      copied.then(function () { done(n ? '복사했어요 (빈칸 ' + n + '개는 [대괄호]로 남아 있어요)' : '복사 완료! AI 대화창에 붙여넣기(Ctrl+V)'); }, function () { toast('복사에 실패했어요. 프롬프트 상자를 직접 복사해 주세요.'); });
      return;
    }
    var url = URLS[kind](text), auto = kind !== 'gemini' && url.length < 7000;
    if (kind !== 'gemini' && !auto) url = kind === 'chatgpt' ? 'https://chatgpt.com/' : 'https://claude.ai/new';
    window.open(url, '_blank', 'noopener');
    copied.then(function () { done(auto ? NAMES[kind] + ' 새 창에 자동 입력됩니다. 안 보이면 붙여넣기(Ctrl+V)' : '복사됨 → ' + NAMES[kind] + '에서 붙여넣기(Ctrl+V)'); }, function () { toast('복사에 실패했어요. 프롬프트 상자를 직접 복사해 주세요.'); });
  }

  /* ---------- 이벤트 ---------- */
  document.addEventListener('click', function (e) {
    var g = e.target.closest('[data-go]');
    if (g && g.dataset.go !== '' && !g.disabled) { go(+g.dataset.go); return; }
    var rc = e.target.closest('[data-copy]'); if (rc) { copyText(rc.dataset.copy).then(function () { toast('복사했어요 → AI 대화창에 붙여넣기'); }); return; }
    var a = e.target.closest('[data-act]'); if (a) act(a.dataset.act);
  });
  document.addEventListener('input', function (e) { onInput(e); });
  document.addEventListener('change', function (e) { if (e.target.tagName === 'SELECT') onInput(e); });
  function onInput(e) {
    var k = e.target.dataset && e.target.dataset.k; if (!k) return;
    S.v[k] = e.target.value; if (!demo) save();
    var p = P[cur - 1];
    if (k === 'theme') { render(); return; } // 주제가 바뀌면 질문 문구도 바뀜
    $('pre').innerHTML = html(p);
    var n = blanks(p), c = $('cnt'); c.textContent = cntText(n); c.className = 'cnt' + (n ? '' : ' ok');
    var f = e.target.closest('.field'); if (f) f.classList.toggle('filled', !!e.target.value.trim());
    renderChain(p);
    if (p.card) { var ic = document.querySelector('.idcard'); if (ic) ic.outerHTML = cardHtml(); }
  }
  document.addEventListener('keydown', function (e) {
    if (!cur || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    if (e.key === 'ArrowRight' && P[cur]) go(P[cur].id);
    if (e.key === 'ArrowLeft' && cur > 1) go(P[cur - 2].id);
  });
  $('startBtn').onclick = function () { demo = false; S = state; go(1); };
  $('demoBtn').onclick = function () { startDemo(); go(1); };
  $('resumeBtn').onclick = function () { demo = false; S = state; go(state.last || 1); };
  $('homeBtn').onclick = function () { go(0); };
  $('resetBtn').onclick = function () {
    if (!confirm('입력한 내용과 진행 표시를 모두 지울까요?')) return;
    if (demo) { startDemo(); render(); toast('예시를 처음 상태로 되돌렸어요'); return; }
    state = { v: { theme: '1' }, done: {}, last: cur }; S = state; save(); render(); toast('초기화했어요');
  };
  window.addEventListener('hashchange', route);
  route();
})();
