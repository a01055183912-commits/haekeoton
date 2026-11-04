/* AI 활용 교육 — 생성형 AI 도구 활용을 통한 아이디어 발굴법
 * 프롬프트 스튜디오 v3 (강의 PPT 내용 그대로)
 * 프롬프트 1 페르소나 → 2 고객 여정 지도 → 3 문제 정의 → 4 AI 창업 아이디어 → 5 비즈니스 모델 → ★ 약점 점검
 * 타자는 1번의 노란 칸 두 개뿐. 2번부터는 한 대화창에서 앞의 답을 이어 받는다.
 */
(function () {
  'use strict';

  /* ---------- 입력칸(노란 칸) ---------- */
  var THEME_DIR = {
    '1': '주제 1 · 생활 속 문제를 푸는 AI 해결 방안',
    '2': '주제 2 · 장소의 진짜 이야기를 AI 콘텐츠·경험·상품으로 만드는 것'
  };
  var CATS = {
    '1': ['먹거리', '자취와 주거', '통학과 이동', '알바와 돈', '건강과 돌봄', '가게 운영', '스마트폰과 앱'],
    '2': ['여수 오래된 골목의 이야기를 알리는 일', '전통시장', '바닷가 마을', '고향 동네', '우리 가게', '대학가']
  };
  var PEOPLE = ['대학생', '중장년', '여행 온 대학생', '가게 사장님', '자취생'];

  var F = {
    p1_who: { label: '사람', ph: '대학생', hint: '페르소나가 될 사람' },
    p1_cat: { label: '카테고리', ph: '여수 오래된 골목 구경', hint: '주제 1은 생활 분야, 주제 2는 이야기가 있는 장소' },
    p3_pick: { label: '방금 고른 불편', def: '방금 고른 불편', ph: '3번 불편', hint: '다른 불편으로 가고 싶을 때만 "3번 불편"처럼' },
    p4_dir: { label: '방향', hint: '주제 2는 그대로, 주제 1이면 아래 문구' }
  };

  /* ---------- 프롬프트 원문 (PPT 부록 · 프롬프트 모음) ---------- */
  var T = {
    p1:
      '나는 {{p1_who}}이고, {{p1_cat}}에 관심이 있어.\n' +
      '이 카테고리의 고객 페르소나 한 명을 아래 예시 형식으로 만들어 줘. 모자란 건 네가 가정해서 채우고, 되묻지 말고 바로 써 줘.\n' +
      '예시) 이름 김하늘 / 나이 22 / 상황 광주에 사는 대학생, 친구와 1박 2일 여수 여행 중 / 요즘 가장 부족한 것 골목 가게들의 진짜 이야기',
    p2:
      '이 페르소나의 고객 여정 지도를 전·중·후 5단계 표로 만들어 줘.\n' +
      '칸: 단계 / 하는 일 / 생각·감정 / 불편한 점. 불편한 점은 단계마다 하나씩 아래 예시처럼 모두 5개를 쓰고, 순서대로 ①~⑤ 번호를 붙여 줘.\n' +
      '예시) 골목 도착 / 가게들 앞을 걸어 지나감 / "어디가 유명하지?" 막막 / ② 어느 가게가 왜 유명한지 몰라서 그냥 지나친다\n' +
      '표 아래에 5개 중 가장 자주·크게 겪는 불편 하나를 골라 "고른 불편: " 한 줄로 써 줘.',
    p3:
      '{{p3_pick}}으로 갈게. 아래 형식으로 문제 정의 문장 3개를 쓰고, 각각 "겪는 사람이 많은가 / 자주·크게 겪는가 / 지금 돈이나 시간을 쓰는가"를 1~5점으로 매겨 표로 보여 준 뒤, 합계 1위를 맨 아래에 "문제 한 문장: "으로 다시 써 줘.\n' +
      '형식) [누가]는 [어떤 상황에서] [무엇 때문에] [무엇을 못 한다]\n' +
      '예시) 문제 한 문장: 여수에 여행 온 대학생은 오래된 골목에서 가게 이야기를 알 길이 없어서 들어가 보지 못하고 그냥 지나친다',
    p4:
      '위의 [문제 한 문장]으로 갈게. 그 문장을 먼저 다시 쓰고, 이 문제를 푸는 AI 창업 아이디어 5개를 아래 예시처럼 표로 써 줘.\n' +
      '방향: [{{p4_dir}}]\n' +
      '칸: 번호 / 이름 / 한 줄 설명 / AI가 하는 일 / 돈을 낼 사람.\n' +
      '예시) 1 / 골목 라디오 / 가게 앞 QR을 찍으면 사장님 목소리로 30초 가게 이야기가 나온다 / 인터뷰 질문·대본·음성 생성 / 상인회·지자체\n' +
      '표 아래에 문제를 가장 잘 푸는 하나를 골라 "아이디어 한 문장: 그래서 [이름]은 [누구]에게 [AI로 무엇을 해서] [무엇을 하게 해 준다]"로 써 줘.\n' +
      '예시) 아이디어 한 문장: 그래서 골목 라디오는 여행 온 대학생에게 AI가 만든 사장님 목소리 30초 이야기를 가게 앞 QR로 들려주어, 그냥 지나치던 가게에 들어가게 해 준다',
    p5:
      '위의 [아이디어 한 문장]으로 갈게. 그 문장을 먼저 다시 쓰고, 비즈니스 모델 3대 질문에 아래 예시처럼 답해 줘.\n' +
      '① 가치 제안 — 누구에게 무엇을 줄 것인가: 한 문장\n' +
      '② 운영 방식 — 어떻게 만들어서 전달할 것인가: AI가 하는 일 / 사람이 하는 일 / 고객에게 닿는 길(파트너·채널), 한 줄씩\n' +
      '③ 수익 모델 — 돈은 어떻게 벌 것인가: 구독·건당·단체·광고 중 하나 골라 누가 얼마씩, 그리고 첫 고객 10명을 어디서 찾나\n' +
      '④ 심사위원이 물어볼 질문 2개\n' +
      '⑤ 아이디어 발굴 카드: 앞의 세 문장을 그대로 이어서 아래 네 줄로 써 줘. 숫자는 (가정)이라고 표시.\n' +
      '문제: "문제 한 문장"\n' +
      '그래서 아이디어: "아이디어 한 문장"\n' +
      '비즈니스 모델: "비즈니스 모델 한 문장([이름]은 [누구]에게 [무엇]을 주고, [어떻게 만들어] 전달하며, [누가 얼마]로 돈을 번다)"\n' +
      '결말: 이 서비스를 쓴 뒤 고객과 돈 내는 사람이 어떻게 달라지는지 한 줄\n' +
      '예시) ① 여행 온 대학생에게 가게 앞 QR로 사장님 목소리 30초 이야기를 주어, 몰라서 지나치는 문제를 푼다 ② AI: 인터뷰 질문·대본·음성 생성 / 사람: 대학생 팀이 가게 인터뷰 / 닿는 길: 상인회·관광안내소가 QR 배포 ③ 상인회·지자체 단체 구독, 골목당 300만 원 (가정) · 첫 고객: 상인회 회의 시연 후 가게 10곳 무료 시범 ⑤ 문제: 여수에 여행 온 대학생은 오래된 골목에서 가게 이야기를 알 길이 없어서 들어가 보지 못하고 그냥 지나친다 / 그래서 아이디어: 그래서 골목 라디오는 여행 온 대학생에게 AI가 만든 사장님 목소리 30초 이야기를 가게 앞 QR로 들려주어, 그냥 지나치던 가게에 들어가게 해 준다 / 비즈니스 모델: 골목 라디오는 여행자에게 30초 가게 이야기를 주고, AI 대본·음성과 대학생 인터뷰로 만들어 상인회가 QR로 전달하며, 상인회 단체 구독 골목당 300만 원 (가정)으로 돈을 번다 / 결말: 하늘은 가게에 들어가 이야기를 듣고, 사장님은 손님이 는다',
    pcard:
      '위의 [아이디어 발굴 카드]에 들어갈 그림 한 장을 그려 줘.\n' +
      '장면: 페르소나가 이 서비스를 처음 쓰는 순간. 카드의 "결말"이 느껴지는 장면.\n' +
      '스타일: 따뜻한 일러스트, 가로 16:9, 그림 안에 글자는 넣지 않기.\n' +
      '그림을 못 그리는 AI라면, 그림 생성용 문장을 영어 한 단락으로 써 줘.',
    pstar:
      '아래 심사위원 입장에서 이 아이디어의 약점 3개와 물어볼 질문 3개를 써 줘. 앞에서 만든 심사위원 질문 2개도 포함해서.\n' +
      '심사위원: 투자사 대표, 창업 연구소장, IT 기업 매니저, ESG 협회 대표, 지역 진흥원 연구원.\n' +
      '가장 치명적인 약점 하나와 보완 방법도 써 줘. 보완 방법에 확인이 필요한 것은 (확인 필요)라고 표시.'
  };

  /* ---------- 샘플 답 (PPT · 골목 라디오) ---------- */
  var S = {
    p1: '<table><tr><th>이름</th><td>김하늘</td></tr><tr><th>나이</th><td>22</td></tr><tr><th>상황</th><td>광주에 사는 대학생, 친구와 1박 2일 여수 여행 중</td></tr><tr><th>요즘 가장 부족한 것</th><td>골목 가게들의 진짜 이야기 — 뭘 먹고 어디 들어가야 할지 모른다</td></tr></table>',
    p2: '<table><tr><th>단계</th><th>하는 일</th><th>생각·감정</th><th>불편한 점 (①~⑤)</th></tr>' +
      '<tr><td>출발 전</td><td>인스타·블로그로 골목 검색</td><td>"다 광고 같은데…" 의심</td><td>① 후기가 다 광고 같아서 믿을 가게를 못 고른다</td></tr>' +
      '<tr class="star"><td>골목 도착</td><td>가게들 앞을 걸어 지나감</td><td>"어디가 유명하지?" 막막</td><td>② 어느 가게가 왜 유명한지 몰라서 그냥 지나친다 ★</td></tr>' +
      '<tr><td>가게 앞</td><td>들어갈까 망설임</td><td>"들어가도 되나?" 눈치</td><td>③ 가게 앞에 설명이 없어서 못 들어간다</td></tr>' +
      '<tr><td>가게 안</td><td>사진만 찍고 나옴</td><td>"물어보고 싶은데…" 어색</td><td>④ 사장님께 말 걸기 어려워서 이야기를 못 듣는다</td></tr>' +
      '<tr><td>돌아와서</td><td>사진 정리</td><td>"남는 게 없네" 허전</td><td>⑤ 장소의 사연을 몰라서 남는 게 없다</td></tr></table>' +
      '<p class="hl">고른 불편: ② 어느 가게가 왜 유명한지 몰라서 그냥 지나친다</p>',
    p3: '<table><tr><th>번호</th><th>문제 정의 문장</th><th>많은가</th><th>자주·크게</th><th>돈·시간</th><th>합계</th></tr>' +
      '<tr class="star"><td>1</td><td>여수에 여행 온 대학생은 오래된 골목에서 가게 이야기를 알 길이 없어서 들어가 보지 못하고 그냥 지나친다</td><td>5</td><td>4</td><td>4</td><td><b>13 ★</b></td></tr>' +
      '<tr><td>2</td><td>여행 온 대학생은 블로그 후기가 광고 같아서 믿을 가게를 고르느라 시간을 쓴다</td><td>4</td><td>4</td><td>3</td><td>11</td></tr>' +
      '<tr><td>3</td><td>여행 온 대학생은 가게 안에서 사장님께 말을 못 걸어 사진만 찍고 나온다</td><td>3</td><td>3</td><td>2</td><td>8</td></tr></table>' +
      '<p>AI 추천 1번. 겪는 사람이 가장 많고, 여행 때마다 겪으며, 검색에 시간을 쓰고 있다.</p>' +
      '<p class="hl">문제 한 문장: 여수에 여행 온 대학생은 오래된 골목에서 가게 이야기를 알 길이 없어서 들어가 보지 못하고 그냥 지나친다</p>',
    p3b: '<table><tr><th>번호</th><th>문제 정의 문장</th><th>겪는 사람이 많은가</th><th>자주·크게 겪는가</th><th>돈·시간을 쓰는가</th></tr>' +
      '<tr><td>1</td><td>여수에 여행 온 대학생은 오래된 골목에서 가게 이야기를 알 길이 없어서 들어가 보지 못하고 그냥 지나친다</td><td>여수 관광객 대부분</td><td>여행 때마다, 가게마다</td><td>검색에 시간을 쓴다</td></tr>' +
      '<tr><td>2</td><td>여행 온 대학생은 블로그 후기가 광고 같아서 믿을 가게를 고르느라 시간을 쓴다</td><td>검색하는 사람은 다</td><td>출발 전 한 번</td><td>검색에 시간을 쓴다</td></tr>' +
      '<tr><td>3</td><td>여행 온 대학생은 가게 안에서 사장님께 말을 못 걸어 사진만 찍고 나온다</td><td>말 걸고 싶은 사람만</td><td>들어간 가게에서만</td><td>돈도 시간도 안 쓴다</td></tr></table>',
    p4: '<table><tr><th>번호</th><th>이름</th><th>한 줄 설명</th><th>AI가 하는 일</th><th>돈을 낼 사람</th></tr>' +
      '<tr class="star"><td>1</td><td>골목 라디오</td><td>가게 앞 QR을 찍으면 사장님 목소리로 30초 가게 이야기가 나온다</td><td>인터뷰 질문·대본·음성 생성</td><td>상인회·지자체, 사장님 ★</td></tr>' +
      '<tr><td>2</td><td>골목 한 줄 지도</td><td>가게마다 한 줄 사연이 붙은 손그림 지도</td><td>사연 요약·지도 문구 생성</td><td>지자체·관광안내소</td></tr>' +
      '<tr><td>3</td><td>말 걸기 카드</td><td>가게별로 사장님께 물을 질문 3개를 주는 여행자 카드</td><td>가게 정보로 질문 생성</td><td>여행자 (앱 구독)</td></tr>' +
      '<tr><td>4</td><td>후기 거르기</td><td>광고 후기를 걸러 진짜 단골 이야기만 보여 준다</td><td>후기 분류·요약</td><td>여행자, 지도 앱</td></tr>' +
      '<tr><td>5</td><td>골목 미션</td><td>가게 퀴즈를 풀면 쿠폰을 주는 골목 투어</td><td>퀴즈·쿠폰 문구 생성</td><td>상인회</td></tr></table>' +
      '<p class="hl">아이디어 한 문장: 그래서 골목 라디오는 여행 온 대학생에게 AI가 만든 사장님 목소리 30초 이야기를 가게 앞 QR로 들려주어, 그냥 지나치던 가게에 들어가게 해 준다</p>',
    p5: '<dl class="dl"><dt>① 가치 제안</dt><dd>여행 온 대학생에게 가게 앞 QR로 사장님 목소리 30초 이야기를 주어, 어느 가게가 왜 유명한지 몰라서 지나치는 문제를 푼다</dd>' +
      '<dt>② 운영 방식</dt><dd>AI: 인터뷰 질문·대본·사장님 목소리 음성 생성 / 사람: 대학생 팀이 가게 5분 인터뷰, 사장님 확인 / 닿는 길: 상인회·관광안내소가 가게 앞 QR 배포, 인스타 지도</dd>' +
      '<dt>③ 수익 모델</dt><dd>상인회·지자체 단체 구독, 골목당 300만 원 (가정) + 사장님 월 9,900원 (가정) · 첫 고객 10명: 여수 골목 상인회 회의에서 시연 → 가게 10곳 무료 시범 → 쿠폰 사용 수를 보고 유료 전환</dd>' +
      '<dt>④ 심사위원 질문</dt><dd>① 사장님들이 인터뷰에 응할까요? ② 네이버 지도·블로그와 무엇이 다른가요?</dd>' +
      '<dt>⑤ 아이디어 발굴 카드</dt><dd><b>문제</b> 여수에 여행 온 대학생은 오래된 골목에서 가게 이야기를 알 길이 없어서 들어가 보지 못하고 그냥 지나친다.<br><b>그래서 아이디어</b> 그래서 골목 라디오는 여행 온 대학생에게 AI가 만든 사장님 목소리 30초 이야기를 가게 앞 QR로 들려주어, 그냥 지나치던 가게에 들어가게 해 준다.<br><b>비즈니스 모델</b> 골목 라디오는 여행자에게 30초 가게 이야기를 주고, AI 대본·음성과 대학생 인터뷰로 만들어 상인회가 QR로 전달하며, 상인회·지자체 단체 구독 골목당 300만 원 (가정)으로 돈을 번다.<br><b>결말</b> 하늘은 가게에 들어가 이야기를 듣고, 사장님은 손님이 는다.</dd></dl>',
    pcard: '<p>장면 예: 여수 골목 가게 안, 사장님이 옛 가게 사진을 보여 주며 이야기하고 여행 온 대학생 둘이 웃으며 듣는다. 벽에는 QR 안내판이 걸려 있다.</p><p class="hl">그림 속 장면이 카드의 결말 한 줄과 이어집니다 — 하늘은 가게에 들어가 이야기를 듣고, 사장님은 손님이 는다</p>'
  };

  /* ---------- 단계(페이지) ---------- */
  var PAGES = [
    { id: 'start', label: '시작', crumb: 'AI 기본', title: '시작 전에' },
    { id: 'case', label: '사례', crumb: '사례', title: '오늘의 사례 · 골목 라디오' },
    {
      id: 'p1', label: '1', crumb: '문제 정의', stage: '1단계 · 문제 정의', title: '프롬프트 1 · 페르소나', no: '1',
      result: ['결과물', '"[누가]는 [어떤 상황에서] [무엇 때문에] [무엇을 못 한다]" 한 문장', '프롬프트 1 페르소나 → 2 고객 여정 지도 → 3 문제 정의'],
      lead: '고객이 될 <b>사람 한 명</b>부터 만듭니다. <b>노란 칸 두 개</b>(사람 · 카테고리)만 내 말로 바꿔 넣으세요.',
      fields: ['p1_who', 'p1_cat'],
      why: [['카테고리와 사람 두 칸', '주제 1은 생활 분야, 주제 2는 장소. 안 넣으면 아무나의 페르소나가 나옵니다'], ['예시 형식', '이름 / 나이 / 상황 / 부족한 것. AI가 이 모양대로 답합니다'], ['요즘 가장 부족한 것', '불편은 여기서 시작됩니다. 여정 지도의 씨앗입니다'], ['되묻지 말고 바로 써 줘', '모자란 건 AI가 가정해서 채우니, 되묻느라 시간을 끌지 않습니다']],
      rescue: ['다른 페르소나 하나 더', '되묻지 말고 바로 써 줘', '더 쉽게'],
      check: ['프롬프트 1 보내기 — 노란 칸 두 개(사람 · 카테고리)만 내 말로', '페르소나가 내 카테고리의 사람인가 확인', '마음에 안 들면 "다른 페르소나 하나 더", AI가 되물으면 "되묻지 말고 바로 써 줘"'],
      handoff: '이 페르소나를 프롬프트 2가 그대로 이어 받습니다. 새 대화를 열면 AI가 페르소나를 잊습니다.',
      banner: '카테고리와 페르소나가 들어가야 <em>그 사람, 그 분야의 불편</em>이 나옵니다', sample: 'p1', sampleTitle: '샘플 답 · 페르소나 (프롬프트 1 → 페르소나)'
    },
    {
      id: 'p2', label: '2', crumb: '문제 정의', stage: '1단계 · 문제 정의', title: '프롬프트 2 · 고객 여정 지도', no: '2',
      lead: '그 사람의 하루를 <b>전·중·후 5단계</b>로 펼쳐 <b>불편 5개</b>를 찾습니다. 이 프롬프트는 <b>그대로</b> 보내세요.',
      fields: [],
      why: [['전·중·후 5단계', '마케팅의 고객 여정 지도. 불편은 하루 안에 있습니다'], ['불편한 점 5개, ①~⑤', '단계마다 하나씩 예시처럼. 번호는 순번이고, 점수는 프롬프트 3에서 매깁니다'], ['예시 한 줄', '칸마다 어떤 말이 들어가야 하는지 AI가 압니다'], ['"고른 불편" 한 줄', 'AI가 가장 큰 불편 하나를 추천합니다. 다른 게 끌리면 "3번으로 바꿔 줘"']],
      rescue: ['3번으로 바꿔 줘', '되묻지 말고 바로 써 줘', '더 쉽게'],
      check: ['앞의 페르소나 답이 온 같은 대화창에 그대로 붙여넣기', '답이 오면 불편 5개와 "고른 불편" 한 줄이 오는지 확인', '고른 불편이 마음에 안 들면 "3번으로 바꿔 줘"'],
      handoff: '"고른 불편"은 프롬프트 3의 첫 줄 — [방금 고른 불편]으로 이어집니다.',
      banner: 'AI가 페르소나와 지도를 그리고 불편 하나를 추천합니다. 받아들이거나 <em>"3번으로 바꿔 줘"</em> — 정하는 건 사람', sample: 'p2', sampleTitle: '샘플 답 · 고객 여정 지도 (불편 5개)'
    },
    {
      id: 'p3', label: '3', crumb: '문제 정의', stage: '1단계 · 문제 정의', title: '프롬프트 3 · 문제 정의', no: '3',
      lead: '고른 불편을 <b>문제 한 문장</b>으로 만듭니다. 3개를 <b>1~5점</b>으로 비교해 1위를 고릅니다.',
      fields: ['p3_pick'],
      why: [['[방금 고른 불편]으로', '앞 답을 이어 받습니다. 바꾸려면 노란 칸에 "3번 불편"'], ['형식과 예시', '누가 · 상황 · 이유 · 못 하는 것, 네 칸이 다 찬 문장이 나옵니다'], ['세 가지 기준 1~5점', '심사위원이 묻는 "시장이 있나, 절실한가, 돈이 되나"와 같습니다'], ['"문제 한 문장"', '1위를 한 줄로 다시 씁니다. 이 문장이 2단계 프롬프트의 첫 줄입니다']],
      rescue: ['빠진 칸 채워서 다시', '3번으로 바꿔 줘', '더 쉽게'],
      check: ['고른 불편이 마음에 들면 프롬프트 3 그대로, 아니면 노란 칸에 "3번 불편"', '맨 아래 "문제 한 문장"의 네 칸(누가 · 상황 · 이유 · 못 하는 것)이 다 찼으면 1단계 끝', '빠지면 "빠진 칸 채워서 다시"'],
      handoff: '"문제 한 문장"이 2단계 프롬프트 4의 첫 줄 — [문제 한 문장]으로 이어집니다.',
      banner: '네 칸이 다 찼는지 확인. 빠지면 <em>"빠진 칸 채워서 다시"</em>. 이 한 문장이 2단계의 첫 줄입니다', sample: 'p3', sampleTitle: '샘플 답 · 문제 정의 문장 3개와 점수', sample2: 'p3b', sample2Title: '샘플 답 · 세 기준 비교(판단 글)'
    },
    {
      id: 'p4', label: '4', crumb: '아이디어 도출', stage: '2단계 · 아이디어', title: '프롬프트 4 · AI 창업 아이디어 5개', no: '4',
      result: ['결과물', '"그래서 [이름]은 [누구]에게 [AI로 무엇을 해서] [무엇을 하게 해 준다]" 아이디어 한 문장', '프롬프트 4 · 타자는 방향 칸 하나. 문제 한 문장을 이어 받습니다'],
      lead: '문제를 푸는 <b>AI 창업 아이디어 5개</b>를 표로 받고, 하나를 골라 <b>"그래서 …"</b> 한 문장으로 씁니다.',
      fields: ['p4_dir'], theme: true,
      why: [['위의 [문제 한 문장]으로', '1단계의 마지막 줄을 먼저 다시 쓰게 합니다. 사슬이 보입니다'], ['방향 칸', '주제 2는 그대로. 주제 1이면 "주제 1 · 생활 속 문제를 푸는 AI 해결 방안"'], ['표의 다섯 칸', '이름 · 한 줄 · AI가 하는 일 · 돈을 낼 사람 — 해커톤이 보는 네 가지'], ['"아이디어 한 문장"', '"그래서 [이름]은 …" 문제 문장에 그래서로 이어집니다. 3단계의 첫 줄']],
      rescue: ['1번 이름 5개 더 지어 줘', '다른 아이디어 5개 더', '3번으로 바꿔서 다시'],
      check: ['프롬프트 4 보내기 — 방향 칸만 내 주제로 (주제 2는 그대로)', 'AI가 "문제 한 문장"을 먼저 다시 썼는지, 표 5줄에 "AI가 하는 일"과 "돈을 낼 사람"이 분명한지 확인', '"아이디어 한 문장"이 마음에 들면 2단계 끝, 아니면 "3번으로 바꿔서 다시"', '이름이 별로면 "○번 이름 5개 더". 다 별로면 "다른 아이디어 5개 더" 한 번만'],
      handoff: '"아이디어 한 문장"이 3단계 프롬프트 5의 첫 줄 — [아이디어 한 문장]으로 이어집니다.',
      banner: 'AI가 돌려준 답을 줄인 예시입니다. 이름이 별로면 <em>"1번 이름 5개 더 지어 줘"</em>', sample: 'p4', sampleTitle: '샘플 답 · AI 창업 아이디어 5개'
    },
    {
      id: 'p5', label: '5', crumb: '비즈니스 모델', stage: '3단계 · 비즈니스 모델', title: '프롬프트 5 · 비즈니스 모델 3대 질문', no: '5',
      result: ['결과물', '3대 질문의 답 + 비즈니스 모델 한 문장', '"[이름]은 [누구]에게 [무엇]을 주고, [어떻게 만들어] 전달하며, [누가 얼마]로 돈을 번다"'],
      lead: '아이디어를 <b>3대 질문</b>으로 사업 모양으로 만들고, <b>아이디어 발굴 카드</b>까지 한 번에 받습니다. 이 프롬프트도 <b>그대로</b>.',
      fields: [], qcards: true,
      why: [['위의 [아이디어 한 문장]으로', '2단계의 마지막 줄을 먼저 다시 쓰게 합니다'], ['①②③ 3대 질문', '가치 제안 · 운영 방식(AI 칸이 비면 AI 창업이 아닙니다) · 수익 모델'], ['"비즈니스 모델 한 문장"', '누구에게 무엇을, 어떻게 만들어, 누가 얼마 — 세 답을 한 줄로'], ['⑤ 아이디어 발굴 카드', '문제 → 그래서 아이디어 → 비즈니스 모델 → 결말, 네 줄을 그대로 이어 붙이면 카드입니다']],
      rescue: ['빠진 칸 채워서 다시', '더 쉽게', '숫자는 (가정)으로 표시해 줘'],
      check: ['운영 방식에 AI가 하는 일이 있는가 확인', '⑤ 카드 네 줄(문제 · 그래서 아이디어 · 비즈니스 모델 · 결말)이 "그래서"로 이어지는가 확인 — 빠진 줄은 그 번호 프롬프트만 다시', '숫자는 전부 (가정)'],
      handoff: '카드 네 줄이 오후에 들고 갈 아이디어 발굴 카드입니다. 그림은 다음 장에서 만듭니다.',
      banner: '세 질문에 답이 있으면 비즈니스 모델입니다. <em>쓰는 사람과 돈 내는 사람은 다를 수 있습니다</em>', sample: 'p5', sampleTitle: '샘플 답 · 3대 질문과 아이디어 발굴 카드'
    },
    {
      id: 'pcard', label: '카드', crumb: '마무리', stage: '마무리 · 아이디어 발굴 카드', title: '프롬프트 카드 · 카드 그림 (선택)', no: '카드',
      lead: '프롬프트 5가 만든 <b>아이디어 발굴 카드</b>에 어울리는 <b>그림 한 장</b>을 받습니다. 그림이 나오는 AI에서 <b>그대로</b> 보내세요.',
      fields: [],
      why: [['위의 [아이디어 발굴 카드]에', '카드의 네 줄을 먼저 읽고 장면을 만듭니다'], ['처음 쓰는 순간', '고객이 서비스를 만나는 한 장면이 그림이 됩니다'], ['"결말"이 느껴지는 장면', '카드의 마지막 줄이 그림의 마음입니다'], ['글자는 넣지 않기', 'AI 그림 속 글자는 깨지기 쉽습니다. 글은 카드에 있습니다']],
      rescue: ['더 따뜻하게 다시', '장면을 하나 더', '더 쉽게'],
      check: ['그림이 나오지 않는 AI라면 "그림 생성용 문장" 영어 한 단락을 받아 그림이 되는 AI에 붙여넣기', '나온 그림을 저장해 마무리 화면의 카드에 넣기'],
      handoff: '',
      banner: '글은 카드에, <em>장면은 그림에</em> — 마무리 화면에서 한 장으로 모읍니다', sample: 'pcard', sampleTitle: '샘플 · 그림 장면 (골목 라디오)'
    },
    {
      id: 'pstar', label: '★', crumb: '마무리', stage: '마무리', title: '프롬프트 ★ · 심사위원 입장 약점 점검', no: '★',
      lead: '심사위원이 되어 <b>약점 3개와 질문 3개</b>를 던지게 합니다. 이 프롬프트도 <b>그대로</b> 보내세요.',
      fields: [],
      why: [['실제 심사위원 구성', '역할로 넣으면 질문이 현실에 가까워집니다'], ['앞의 질문 2개 포함', '프롬프트 5가 낸 질문을 이어서 깊게 묻습니다'], ['치명적인 약점과 보완', '(확인 필요) 표시가 곧 오후 멘토에게 물을 질문입니다']],
      rescue: ['다른 걸로 3개 더', '더 쉽게'],
      check: ['(확인 필요)가 붙은 줄을 오후 멘토링 질문으로 메모'],
      handoff: '',
      banner: '(확인 필요) 표시가 곧 <em>오후 멘토에게 물을 질문</em>입니다'
    },
    { id: 'end', label: '마무리', crumb: '마무리', title: '한 바퀴 완성' }
  ];
  var IDX = {}; PAGES.forEach(function (p, i) { IDX[p.id] = i; });
  var PROMPT_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'pcard', 'pstar'];
  var CRUMBS = [['start', 'AI 기본'], ['case', '사례'], ['p1', '문제 정의'], ['p4', '아이디어 도출'], ['p5', '비즈니스 모델'], ['pstar', '마무리']];
  var CRUMB_OF = { start: 0, case: 1, p1: 2, p2: 2, p3: 2, p4: 3, p5: 4, pcard: 5, pstar: 5, end: 5 };
  var NODES = [['p1', '1 페르소나', '이름 · 나이 · 상황 · 부족한 것'], ['p2', '2 고객 여정 지도', '불편 ①~⑤ · 고른 불편'], ['p3', '3 문제 정의', '문제 한 문장'], ['p4', '4 AI 창업 아이디어', '아이디어 한 문장'], ['p5', '5 비즈니스 모델', '3대 질문 · 발굴 카드 네 줄'], ['pcard', '카드 그림', '장면 한 장 (선택)'], ['pstar', '★ 약점 점검', '(확인 필요)']];
  var RESCUE_ALL = ['되묻지 말고 바로 써 줘', '더 쉽게', '다른 걸로 5개 더'];

  /* ---------- 상태 ---------- */
  var KEY = 'aiIdeaStudio.v3';
  var state = { theme: '2', v: {}, checks: {}, done: {}, last: 'start' };
  try { var s0 = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s0 && s0.v) state = s0; } catch (e) {}
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function val(k) { return (state.v[k] || '').trim(); }
  var toastT;
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 3200); }
  function def(k) { return k === 'p4_dir' ? THEME_DIR[state.theme] : (F[k].def || ''); }
  function eff(k) { return val(k) || def(k); }

  /* ---------- 프롬프트 조립 ---------- */
  function parts(id) {
    var tpl = T[id], out = [], re = /\{\{(\w+)\}\}/g, last = 0, m;
    while ((m = re.exec(tpl))) { if (m.index > last) out.push({ t: tpl.slice(last, m.index) }); out.push({ k: m[1] }); last = re.lastIndex; }
    if (last < tpl.length) out.push({ t: tpl.slice(last) });
    return out;
  }
  function plain(id) { return parts(id).map(function (x) { return x.k ? (eff(x.k) || '[' + F[x.k].label + ']') : x.t; }).join(''); }
  function html(id) {
    return parts(id).map(function (x) {
      if (!x.k) return esc(x.t);
      var v = eff(x.k);
      return v ? '<mark>' + esc(v) + '</mark>' : '<mark class="blank">[' + esc(F[x.k].label) + ']</mark>';
    }).join('');
  }
  function blanks(id) { return parts(id).filter(function (x) { return x.k && !eff(x.k); }).length; }
  function cntText(n) { return n ? '노란 칸 ' + n + '개 비었어요' : '✓ 바로 복사해도 돼요'; }

  /* ---------- 라우팅 ---------- */
  var cur = null;
  function go(id) { location.hash = id ? '#/' + id : '#/'; }
  function route() {
    var m = /^#\/(\w+)/.exec(location.hash), id = m && IDX[m[1]] !== undefined ? m[1] : null;
    cur = id;
    $('cover').hidden = !!id; $('studio').hidden = !id;
    if (id) { state.last = id; save(); render(); window.scrollTo(0, 0); $('slide').focus({ preventScroll: true }); }
    else { $('resumeBtn').hidden = !(state.last && state.last !== 'start'); window.scrollTo(0, 0); }
  }

  /* ---------- 렌더 ---------- */
  function page() { return PAGES[IDX[cur]]; }
  function render() {
    var p = page();
    $('crumbs').innerHTML = CRUMBS.map(function (c, i) { var on = CRUMB_OF[cur] === i; return (i ? '<span class="sep">›</span>' : '') + (on ? '<span class="on">' + c[1] + '</span>' : '<button data-go="' + c[0] + '">' + c[1] + '</button>'); }).join('');
    renderStepper(); renderFlow();
    $('slide').innerHTML = p.id === 'start' ? startHtml() : p.id === 'case' ? caseHtml() : p.id === 'end' ? endHtml() : promptHtml(p);
    renderPager();
    document.title = p.title + ' · AI 아이디어 발굴 프롬프트 스튜디오';
  }
  function renderStepper() {
    $('stepper').innerHTML = PAGES.map(function (p) {
      var cls = 'chip' + (p.id === cur ? ' on' : '') + (state.done[p.id] ? ' done' : '') + (p.id === 'pcard' || p.id === 'pstar' || p.id === 'start' || p.id === 'case' || p.id === 'end' ? ' bonus' : '');
      return '<button class="' + cls + '" data-go="' + p.id + '" role="tab" aria-selected="' + (p.id === cur) + '">' + esc(p.label) + '<small>' + esc(p.title.replace(/^프롬프트 [\d★] · /, '')) + '</small></button>';
    }).join('');
    var on = $('stepper').querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  }
  function renderFlow() {
    var show = PROMPT_IDS.indexOf(cur) >= 0;
    $('chain').hidden = !show; if (!show) return;
    $('chain').innerHTML = '<div class="chain-in">' + NODES.map(function (n, i) {
      return (i ? '<span class="arrow" aria-hidden="true">→</span>' : '') + '<button class="node' + (n[0] === cur ? ' on' : '') + (state.done[n[0]] ? ' got' : '') + '" data-go="' + n[0] + '"><small>' + esc(n[1]) + '</small><span>' + esc(n[2]) + '</span></button>';
    }).join('') + '</div>';
  }
  function renderPager() {
    var i = IDX[cur], a = PAGES[i - 1], b = PAGES[i + 1];
    $('prevBtn').disabled = !a; $('nextBtn').disabled = !b;
    $('prevBtn').dataset.go = a ? a.id : ''; $('nextBtn').dataset.go = b ? b.id : '';
    $('prevBtn').innerHTML = a ? '‹ <b>이전</b> · ' + esc(a.title) : '';
    $('nextBtn').innerHTML = b ? '<b>다음</b> › ' + esc(b.title) : '';
  }

  /* 공통 조각 */
  function resultBox(p) { return p.result ? '<div class="formula"><b>' + p.result[0] + '</b><p>' + esc(p.result[1]) + '</p><small>' + esc(p.result[2]) + '</small></div>' : ''; }
  function seg() {
    return '<div class="seg" role="group" aria-label="해커톤 주제"><span>내 주제</span>' +
      '<button data-theme="1" class="' + (state.theme === '1' ? 'on' : '') + '">주제 1 · 일상 속 불편을 창업 아이디어로</button>' +
      '<button data-theme="2" class="' + (state.theme === '2' ? 'on' : '') + '">주제 2 · 스토리텔링 기반 콘텐츠 창업</button></div>';
  }
  function chips(k, list) { return '<div class="cchips">' + list.map(function (x) { return '<button type="button" class="rchip" data-fill="' + k + '" data-v="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div>'; }
  function fieldsHtml(p) {
    if (!p.fields.length) return '<div class="nofields">이 프롬프트는 <b>노란 칸이 없습니다.</b> 같은 대화창에 <b>그대로</b> 붙여넣으세요.</div>';
    var h = '';
    p.fields.forEach(function (k, i) {
      var f = F[k], v = state.v[k] || '', ph = k === 'p4_dir' ? THEME_DIR[state.theme] : (def(k) || f.ph);
      h += '<div class="field y' + (v ? ' filled' : '') + '"><label for="f_' + k + '"><span class="yb">노란 칸</span> ' + esc(f.label) + (f.hint ? '<em>' + esc(f.hint) + '</em>' : '') + '</label>' +
        (k === 'p4_dir' ? '<textarea id="f_' + k + '" data-k="' + k + '" rows="2" placeholder="' + esc(ph) + '">' + esc(v) + '</textarea>' : '<input id="f_' + k + '" data-k="' + k + '" type="text" value="' + esc(v) + '" placeholder="' + (k === 'p3_pick' ? '비워 두면 "' + esc(def(k)) + '"' : '예) ' + esc(ph)) + '" autocomplete="off">');
      if (k === 'p1_who') h += chips(k, PEOPLE);
      if (k === 'p1_cat') h += chips(k, CATS[state.theme]);
      if (k === 'p3_pick') h += chips(k, ['1번 불편', '2번 불편', '3번 불편', '4번 불편', '5번 불편']);
      if (k === 'p4_dir') h += chips(k, [THEME_DIR['1'], THEME_DIR['2']]);
      h += '</div>';
    });
    return h;
  }
  function qcards() {
    var q = [['① 가치 제안', '누구에게 무엇을 줄 것인가', '고객이 겪는 문제를 내 서비스가 어떻게 해결해 주는지 한 문장'], ['② 운영 방식', '어떻게 만들어서 전달할 것인가', 'AI가 하는 일 · 사람이 하는 일 · 고객에게 닿는 길 (기술, 파트너, 채널)'], ['③ 수익 모델', '그래서 돈은 어떻게 벌 것인가', '구독 · 건당 · 단체 · 광고 중 하나, 누가 얼마씩. 그리고 첫 고객 10명']];
    return '<div class="qcards">' + q.map(function (c) { return '<div class="qc"><b>' + c[0] + '</b><strong>' + c[1] + '</strong><small>' + c[2] + '</small></div>'; }).join('') + '</div>';
  }
  function checkHtml(p) {
    return '<div class="todo"><h3 class="block-title navy">지금 해 보세요</h3><ul>' + p.check.map(function (t, i) {
      var key = p.id + i;
      return '<li><label><input type="checkbox" data-chk="' + key + '"' + (state.checks[key] ? ' checked' : '') + '><span>' + esc(t) + '</span></label></li>';
    }).join('') + '</ul></div>';
  }
  function whyHtml(p) {
    return '<div class="why"><h3 class="block-title navy">이 줄을 넣는 이유</h3><dl>' + p.why.map(function (w) { return '<div><dt>' + esc(w[0]) + '</dt><dd>' + esc(w[1]) + '</dd></div>'; }).join('') + '</dl></div>';
  }
  function sendHtml(p) {
    var first = p.id === 'p1';
    var rescue = (p.rescue || RESCUE_ALL).map(function (r) { return '<button class="rchip" data-copy="' + esc(r) + '">' + esc(r) + '</button>'; }).join('');
    return '<div class="send">' +
      (first
        ? '<div class="send-row"><button class="sbtn copy" data-act="copy">📋 복사하기</button><button class="sbtn" data-act="chatgpt"><span class="dot d-gpt"></span>ChatGPT</button><button class="sbtn" data-act="gemini"><span class="dot d-gem"></span>Gemini</button><button class="sbtn" data-act="claude"><span class="dot d-cla"></span>Claude</button></div>' +
          '<p class="sendnote"><b>새 대화창</b>이 열립니다. ChatGPT·Claude는 자동 입력, <b>Gemini는 붙여넣기(Ctrl+V)</b>가 필요해요. 어떤 버튼이든 먼저 자동 복사됩니다.</p>'
        : '<div class="send-one"><button class="sbtn copy" data-act="copy">📋 복사하기</button></div>' +
          '<p class="sendnote"><b>같은 대화창</b>으로 돌아가 붙여넣으세요(Ctrl+V). 새 대화를 열면 AI가 앞의 답을 잊습니다.<br>대화창을 닫았다면: <a href="#" data-act="chatgpt">ChatGPT</a> · <a href="#" data-act="gemini">Gemini</a> · <a href="#" data-act="claude">Claude</a> 열기</p>') +
      '<div class="rescue"><b>마음에 안 들면 한마디 (누르면 복사)</b>' + rescue + '</div></div>';
  }
  function sampleHtml(p) {
    var h = '';
    [['sample', 'sampleTitle'], ['sample2', 'sample2Title']].forEach(function (k) {
      if (p[k[0]]) h += '<details class="aiex sample"><summary>' + esc(p[k[1]]) + '</summary><div class="aiex-body"><div class="bub ai">' + S[p[k[0]]] + '</div></div></details>';
    });
    return h;
  }
  function promptHtml(p) {
    var n = blanks(p.id), left = '';
    if (p.theme || p.id === 'p1') left += seg();
    left += '<h3 class="block-title">① ' + (p.fields.length ? '노란 칸만 내 말로' : '그대로 보내기') + ' <span class="rule">' + (p.id === 'p1' ? '타자는 여기 두 칸뿐' : p.fields.length ? '필요할 때만' : '타자 없음') + '</span></h3><div class="fields">' + fieldsHtml(p) + '</div>';
    if (p.id === 'p5') left += '<h3 class="block-title" style="margin-top:18px">비즈니스 모델 3대 질문</h3>' + qcards();
    left += checkHtml(p);
    var right = '<h3 class="block-title">② 프롬프트 확인</h3>' +
      '<div class="pbox"><div class="pbox-head"><span>프롬프트 ' + p.no + '</span><span class="cnt' + (n ? '' : ' ok') + '" id="cnt">' + cntText(n) + '</span></div><pre class="pre" id="pre">' + html(p.id) + '</pre></div>' +
      '<h3 class="block-title" style="margin-top:16px">③ 복사하고 AI로 보내기</h3>' + sendHtml(p) +
      (p.handoff ? '<div class="handoff">↳ ' + esc(p.handoff) + '</div>' : '');
    return '<div class="slide-head"><div><p class="stage-label">' + esc(p.stage) + '</p><h2>' + esc(p.title) + '</h2></div></div>' + resultBox(p) +
      '<p class="lead">' + p.lead + '</p>' +
      '<div class="grid"><section>' + left + '</section><section>' + right + '</section></div>' +
      whyHtml(p) + (p.id === 'p1' ? catTable() : '') + sampleHtml(p) +
      '<div class="banner">' + p.banner + '</div>';
  }
  function catTable() {
    var rows = [['주제 1 · 먹거리', '자취 2년차 민수(21) · 저녁 수업 뒤 편의점', '저녁에 시간이 없어서 집밥을 못 먹는다', '동네 밥상 잇기 — AI가 입맛·예산에 맞춰 동네 요리인 반찬을 추천·배달'],
      ['주제 1 · 자취와 주거', '첫 자취 지현(20) · 원룸', '전등·수도가 고장 나도 누굴 불러야 할지 모른다', '동네 수리 도우미 — 사진을 찍으면 AI가 고장 진단·견적, 동네 기술자 연결'],
      ['주제 1 · 가게 운영', '반찬가게 30년 영자 사장님(63)', '홍보 영상을 만들 줄 몰라 손님이 줄어든다', '사진 두 장 홍보 — AI가 사진으로 자막·홍보 영상을 자동 생성'],
      ['주제 1 · 스마트폰과 앱', '은퇴한 성호(68) · 앱 가입이 두려움', '앱 가입·인증에서 막혀 포기한다', '말로 하는 앱 도우미 — AI가 화면을 읽고 다음 버튼을 음성으로 안내'],
      ['주제 2 · 여수 오래된 골목', '여행 온 하늘(22) · 1박 2일', '가게가 왜 유명한지 몰라 그냥 지나친다', '골목 라디오 — QR로 사장님 목소리 30초 이야기 (AI 대본·음성)'],
      ['주제 2 · 전통시장', '시장 20년 상인 미숙(58)', '젊은 손님이 안 와서 이야기를 들려줄 데가 없다', '시장 이야기 지도 — AI가 상인 인터뷰를 한 줄 사연 지도와 숏폼으로'],
      ['주제 2 · 고향 동네', '귀향한 청년 도윤(27)', '어르신들의 이야기가 기록 없이 사라진다', '동네 이야기 책 — AI가 어르신 구술을 그림책·오디오북 상품으로']];
    return '<details class="aiex sample"><summary>카테고리별 예시 — 프롬프트 1에 넣으면 이런 사람과 아이디어가 나옵니다</summary><div class="aiex-body"><div class="bub ai"><table><tr><th>카테고리 (둘째 칸)</th><th>페르소나 예 (AI가 만듦)</th><th>가장 큰 불편 예</th><th>AI 창업 아이디어 예</th></tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c) { return '<td>' + esc(c) + '</td>'; }).join('') + '</tr>'; }).join('') +
      '</table><p>같은 프롬프트 다섯 개에 둘째 칸(카테고리)만 바꿔 넣으면 됩니다. 첫 칸(사람)을 옆 세대로 바꾸면 또 다른 페르소나와 불편이 나옵니다.</p></div></div></details>';
  }

  /* ---------- 시작 / 사례 / 마무리 ---------- */
  function startHtml() {
    return '<div class="slide-head"><div><p class="stage-label">AI 기본</p><h2>시작 전에</h2></div></div>' +
      '<p class="lead">오늘은 AI에게 <b>잘 묻는 법</b>을 배웁니다. 프롬프트 <b>다섯 개</b>를 한 대화창에서 1번부터 5번까지 이어 돌립니다.</p>' +
      '<h3 class="block-title">오늘의 흐름 · 프롬프트 다섯 개</h3><div class="stages">' +
      '<div class="stg"><b>1단계 문제 정의</b><p>1 페르소나 → 2 고객 여정 지도 → 3 문제 정의</p><small>불편한 점 5개 → 문제 한 문장</small></div>' +
      '<div class="stg"><b>2단계 아이디어</b><p>4 AI 창업 아이디어 5개</p><small>→ "그래서 …" 아이디어 한 문장</small></div>' +
      '<div class="stg"><b>3단계 비즈니스 모델</b><p>5 가치 제안 · 운영 방식 · 수익 모델</p><small>→ 비즈니스 모델 한 문장</small></div></div>' +
      '<p class="tipline">한 대화창에서 1번부터 5번까지. 세 문장에 결말 한 줄을 더하면 <b>아이디어 발굴 카드</b>가 됩니다.</p>' +
      '<h3 class="block-title" style="margin-top:26px">시작 전에 세 가지</h3><ol class="three">' +
      '<li><b>휴대폰 데이터 켜고 AI 앱 하나 열기</b><span>챗GPT, 제미나이, 클로드 중 평소 쓰는 것</span></li>' +
      '<li><b>QR로 프롬프트 스튜디오 열기</b><span>프롬프트 1번부터 5번까지 있습니다. 복사만 하고, 타자는 1번의 노란 칸 두 개뿐</span></li>' +
      '<li><b>한 대화창에서 1번부터 5번까지</b><span>2번부터는 앞의 답을 이어 받습니다. 새 대화를 열면 AI가 페르소나를 잊습니다</span></li></ol>' +
      '<p class="tipline">자판 대신 마이크(음성 입력)로 말해도 됩니다. 바꾸고 싶으면 <b>"3번으로 바꿔 줘"</b> 한마디면 됩니다.</p>' +
      '<h3 class="block-title" style="margin-top:26px">질문이 답을 정한다</h3>' +
      '<div class="vs"><div class="vs-a"><small>흐릿한 질문</small><b>흐릿한 답</b></div><div class="vs-b"><small>내 상황과 예시가 든 질문</small><b>내 상황에 맞는 답</b></div></div>' +
      '<p class="tipline">생성형 AI는 질문에 맞춰 가장 그럴듯한 다음 말을 이어 쓰는 도구입니다. 그래서 오늘은 AI에게 <b>\'잘 묻는 법\'</b>을 배웁니다.</p>' +
      '<div class="two"><div class="can"><h4>AI가 잘하는 것</h4><ul><li><b>많이 펼치기</b> 여정 5단계, 아이디어 5개를 1분 안에</li><li><b>역할 연기</b> 페르소나, 심사위원이 되어 답한다</li><li><b>정리하기</b> 표, 점수, 30초 세 문장</li></ul></div>' +
      '<div class="cant"><h4>AI가 못하는 것</h4><ul><li><b>사실 보증</b> 그럴듯하게 지어낼 수 있다</li><li><b>숫자</b> 가격·시장 규모는 (가정)으로 받아 둔다</li><li><b>진짜 고객의 마음</b> 오후 멘토링과 시범 고객에게 확인한다</li></ul></div></div>' +
      '<p class="tipline">실명, 연락처, 고객 명단 같은 개인정보는 넣지 않습니다.</p>' +
      '<h3 class="block-title" style="margin-top:26px">나쁜 질문, 좋은 질문</h3><div class="two"><div class="bad"><h4>나쁜 질문</h4><p class="q">창업 아이디어 추천해 줘.</p><small>→ 누구나 아는 뻔한 목록</small></div>' +
      '<div class="good"><h4>좋은 질문 · 프롬프트 1</h4><dl><dt>내 상황</dt><dd>나는 대학생이고, 여수 오래된 골목 구경에 관심이 있어.</dd><dt>할 일</dt><dd>이 카테고리의 고객 페르소나 한 명을 만들어 줘.</dd><dt>예시</dt><dd>이름 김하늘 / 나이 22 / 상황 여수 여행 중 / 부족한 것 골목 가게들의 진짜 이야기</dd><dt>한마디</dt><dd>모자란 건 네가 가정해서 채우고, 되묻지 말고 바로 써 줘.</dd></dl><small>→ 예시와 같은 모양으로, 내 카테고리의 페르소나가 나옵니다.</small></div></div>' +
      '<div class="banner">그래서 오늘은 AI에게 <em>\'잘 묻는 법\'</em>을 배웁니다</div>';
  }
  function caseHtml() {
    var cells = [['페르소나·불편', '김하늘(22, 여수 여행 중)의 여정에서 가장 큰 불편: 오래된 가게가 왜 유명한지 몰라 그냥 지나친다'], ['문제 정의', '여수에 여행 온 대학생은 오래된 골목에서 가게 이야기를 알 길이 없어서 들어가 보지 못하고 그냥 지나친다'], ['AI 창업 아이디어', '골목 라디오: 가게 앞 QR을 찍으면 사장님 목소리로 30초 가게 이야기. AI가 인터뷰 질문·대본·음성을 만든다'], ['비즈니스 모델', '가치 제안: 여행자에게 30초 가게 이야기 · 운영: AI가 대본·음성, 학생이 인터뷰, 상인회가 QR 배포 · 수익: 상인회 단체 구독 골목당 300만 원 (가정)']];
    var rows = [['1 페르소나', '사람 = 생활자 (대학생 · 중장년 · 사장님)<br>카테고리 = 생활 분야 (먹거리 · 주거 · 이동 · 가게 운영)', '사람 = 장소를 찾는 사람 또는 장소의 주인<br>카테고리 = 이야기가 있는 장소 (골목 · 시장 · 고향)', '고객이 누구인가?'],
      ['2 고객 여정 지도', '하루의 전·중·후에서 불편 5개', '방문·장사의 전·중·후에서 이야기가 끊기는 불편 5개', '불편이 진짜인가?'],
      ['3 문제 한 문장', '생활 속 문제', '장소의 이야기가 전해지지 않는 문제', '문제 정의'],
      ['4 아이디어 한 문장', '방향 칸: 생활 속 문제를 푸는 AI 해결 방안 (서비스 · 앱 · 도우미)', '방향 칸: 장소의 이야기를 AI 콘텐츠·경험·상품으로 (오디오 · 지도 · 투어 · 굿즈)', 'AI 기반 해결 방안 / AI 콘텐츠·경험·상품'],
      ['5 비즈니스 모델', '쓰는 사람과 돈 내는 사람, 첫 고객 10명', '콘텐츠·경험·상품을 누가 사나 (여행자 · 상인회 · 지자체)', '사업 가능성']];
    return '<div class="slide-head"><div><p class="stage-label">오늘의 사례</p><h2>골목 라디오</h2></div></div>' +
      '<p class="lead">프롬프트 다섯 개를 돌리면 <b>이 네 칸</b>이 나옵니다. 주제 1로 보면 여행자의 불편, 주제 2로 보면 골목 가게 이야기의 AI 콘텐츠.</p>' +
      '<div class="cells">' + cells.map(function (c, i) { return '<div class="cell"><small>' + c[0] + '</small><p>' + esc(c[1]) + '</p></div>' + (i < 3 ? '<span class="darr">↓</span>' : ''); }).join('') + '</div>' +
      '<h3 class="block-title" style="margin-top:28px">주제별로 달라지는 것 · 프롬프트 다섯 개</h3><div class="tblwrap"><table class="ptable"><tr><th>프롬프트</th><th>주제 1 · 일상 속 불편을 창업 아이디어로</th><th>주제 2 · 스토리텔링 기반 콘텐츠 창업</th><th>해커톤이 보는 것</th></tr>' +
      rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return '<td' + (i === 0 ? ' class="k"' : '') + '>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>' +
      '<h3 class="block-title" style="margin-top:28px">오늘의 세 칸 · 한 문장으로 잇기</h3><div class="stages">' +
      '<div class="stg"><b>1단계 문제 정의</b><p>결과물 문제 한 문장</p><small>"[누가]는 [어떤 상황에서] [무엇 때문에] [무엇을 못 한다]"<br>프롬프트 1 · 2 · 3</small></div>' +
      '<div class="stg"><b>2단계 아이디어</b><p>결과물 아이디어 한 문장</p><small>"그래서 [이름]은 [누구]에게 [AI로 무엇을 해서] [무엇을 하게 해 준다]"<br>프롬프트 4</small></div>' +
      '<div class="stg"><b>3단계 비즈니스 모델</b><p>결과물 비즈니스 모델 한 문장</p><small>"[이름]은 [누구]에게 [무엇]을 주고, [어떻게 만들어] 전달하며, [누가 얼마]로 돈을 번다"<br>프롬프트 5</small></div></div>' +
      '<div class="banner">카테고리와 페르소나가 들어가야 <em>그 사람, 그 분야의 불편</em>이 나옵니다</div>';
  }
  var cardImg = ''; try { cardImg = localStorage.getItem(KEY + '.img') || ''; } catch (e) {}
  function cardLines() {
    return [['문제', val('s1'), '프롬프트 3 맨 아래 "문제 한 문장"'], ['그래서 아이디어', val('s2'), '프롬프트 4 "아이디어 한 문장"'], ['비즈니스 모델', val('s3'), '프롬프트 5 "비즈니스 모델 한 문장"']];
  }
  function ideaCard() {
    var L = cardLines(), end = val('s4');
    return '<div class="icard" id="cardWrap"><h4 class="icard-t">아이디어 발굴 카드</h4><div class="icard-b">' +
      '<figure class="icard-img">' + (cardImg ? '<img src="' + cardImg + '" alt="카드 그림">' : '<div class="icard-ph">프롬프트 카드로 받은 그림을<br>아래 "그림 넣기"로 넣으세요</div>') +
      '<figcaption>' + (end ? '결말 — ' + esc(end) : '<span class="optv">결말 한 줄이 여기에 들어가요</span>') + '</figcaption></figure>' +
      '<div class="icard-txt">' + L.map(function (l) { return '<p><b>' + l[0] + '</b>' + (l[1] ? esc(l[1]) : '<span class="optv">' + l[2] + '을 붙여넣으세요</span>') + '</p>'; }).join('') + '</div></div></div>';
  }
  function cardText() {
    var L = cardLines(), t = ['[아이디어 발굴 카드]'];
    L.forEach(function (l) { t.push(l[0] + ': ' + (l[1] || '(아직 없음)')); });
    t.push('결말: ' + (val('s4') || '(아직 없음)')); return t.join('\n');
  }
  function endHtml() {
    var rows = [['1 페르소나', '이름 · 나이 · 상황 · 부족한 것', '내 카테고리의 사람인가'], ['2 고객 여정 지도', '5단계 표, 불편 ①~⑤ + "고른 불편" 한 줄', '감정이 보이는가'], ['3 문제 한 문장', '"[누가]는 [상황에서] [무엇 때문에] [무엇을 못 한다]"', '네 칸이 다 찼는가'], ['4 아이디어 한 문장', '표 5줄 + "그래서 [이름]은 …"', 'AI가 하는 일이 분명한가'], ['5 비즈니스 모델', '3대 질문 답 · 심사위원 질문 · 아이디어 발굴 카드(문제 → 그래서 아이디어 → 비즈니스 모델 → 결말)', '운영 방식에 AI가 하는 일이 있는가']];
    var frame = '나는 [누구]이고, [카테고리]에 관심이 있어.\n[해 줄 일]을 해 줘.\n[5개 / 표로 / 칸: ___ / 세 문장]으로.\n예시) [원하는 답의 모양 한 줄]\n되묻지 말고 바로 써 줘.';
    return '<div class="slide-head"><div><p class="stage-label">마무리</p><h2>한 바퀴 완성</h2></div></div>' +
      '<div class="formula"><b>결과물</b><p>오후에 들고 갈 아이디어 발굴 카드</p><small>문제 한 문장 · 그래서 아이디어 한 문장 · 비즈니스 모델 한 문장 + 결말 한 줄 + 그림 한 장</small></div>' +
      '<h3 class="block-title" style="margin-top:22px">다섯 줄이 다 찼나요</h3><div class="tblwrap"><table class="ptable chk"><tr><th>프롬프트</th><th>내 대화창에 남은 것</th><th>확인</th></tr>' +
      rows.map(function (r, i) { return '<tr><td class="k">' + r[0] + '</td><td>' + r[1] + '</td><td><label class="cb"><input type="checkbox" data-chk="end' + i + '"' + (state.checks['end' + i] ? ' checked' : '') + '><span>' + r[2] + '</span></label></td></tr>'; }).join('') + '</table></div>' +
      '<p class="tipline">카드의 세 문장이 <b>"그래서"</b>로 이어지면 완성. 빠진 줄은 그 번호 프롬프트만 다시.</p>' +
      '<div class="grid" style="margin-top:22px"><section><h3 class="block-title">내 아이디어 발굴 카드 만들기 <span class="rule">프롬프트 5의 ⑤에서 복사</span></h3><div class="fields">' +
      [['s1', '문제', '카드의 "문제:" 줄'], ['s2', '그래서 아이디어', '카드의 "그래서 아이디어:" 줄'], ['s3', '비즈니스 모델', '카드의 "비즈니스 모델:" 줄'], ['s4', '결말 (한 줄)', '카드의 "결말:" 줄']].map(function (f) {
        return '<div class="field' + (val(f[0]) ? ' filled' : '') + '"><label for="f_' + f[0] + '">' + f[1] + '<em>' + f[2] + '을 복사해 붙여넣기</em></label><textarea id="f_' + f[0] + '" data-k="' + f[0] + '" rows="' + (f[0] === 's4' ? 2 : 3) + '"' + '>' + esc(state.v[f[0]] || '') + '</textarea></div>';
      }).join('') + '</div></section><section><h3 class="block-title">오후에 들고 갈 카드</h3><div id="threeCard">' + ideaCard() + '</div>' +
      '<div class="imgpick"><label class="btn-sm" for="cardFile">🖼 그림 넣기</label><input id="cardFile" type="file" accept="image/*" hidden>' + '<button class="link" data-act="rmimg">그림 빼기</button></div>' +
      '<div class="card-actions"><button class="sbtn copy" data-act="copy3">📋 카드 글 복사</button><button class="sbtn" data-act="print">🖨 인쇄 / PDF</button></div></section></div>' +
      '<div class="why" style="margin-top:26px"><h3 class="block-title navy">카드를 더 단단하게</h3><p style="margin:0 0 10px;font-size:14.5px">그림이 필요하면 <b>카드 그림</b>, 약점이 궁금하면 <b>프롬프트 ★</b>를 돌려 보세요.</p><button class="btn-sm" data-go="pcard">카드 그림 ›</button> <button class="btn-sm" data-go="pstar">프롬프트 ★ 약점 점검 ›</button></div>' +
      '<h3 class="block-title" style="margin-top:28px">AI 답을 믿기 전에</h3><ol class="three"><li><b>AI 답은 \'가설\'이다</b><span>진짜인지는 시범 고객과 멘토링에서 확인한다</span></li><li><b>숫자는 출처를 찾는다</b><span>출처가 없으면 (가정)으로 두고 멘토에게 묻는다</span></li><li><b>한 번에 끝내지 않는다</b><span>다시 시키고, 여러 개 받아 고르고, 심사위원이 되어 공격하게 한다</span></li></ol>' +
      '<p class="tipline"><b>AI는 펼치고, 고르는 건 사람입니다.</b></p>' +
      '<h3 class="block-title" style="margin-top:26px">어떤 질문이든 이 틀로</h3><div class="pbox"><div class="pbox-head"><span>내 질문 틀 · 다섯 줄</span><button class="btn-sm yel" data-copy-text="frame">📋 틀 복사</button></div><pre class="pre" style="max-height:none">' + esc(frame) + '</pre></div>' +
      '<p class="tipline">마음에 안 들면: "다른 걸로 5개 더", "더 쉽게". 숫자는 (가정). 오늘 쓴 프롬프트 다섯 개도 모두 이 다섯 줄로 만들었습니다. 특히 <b>예시 한 줄이 답의 모양</b>을 정합니다.</p>' +
      '<div class="banner">AI는 답을 주는 기계가 아니라, <em>좋은 질문을 할수록 똑똑해지는 동료</em>입니다 · 오후 워크숍에서 팀과 함께 한 바퀴 더, 카드를 키워 보세요</div>';
  }
  var FRAME_TEXT = '나는 [누구]이고, [카테고리]에 관심이 있어.\n[해 줄 일]을 해 줘.\n[5개 / 표로 / 칸: ___ / 세 문장]으로.\n예시) [원하는 답의 모양 한 줄]\n되묻지 말고 바로 써 줘.';

  /* ---------- 복사 · 보내기 ---------- */
  function fallbackCopy(text) {
    return new Promise(function (res, rej) {
      var ta = document.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
      document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta); ok ? res() : rej();
    });
  }
  function copyText(t) { if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(t).catch(function () { return fallbackCopy(t); }); return fallbackCopy(t); }
  var NAMES = { chatgpt: 'ChatGPT', claude: 'Claude', gemini: 'Gemini' };
  function act(kind) {
    var id = cur;
    if (kind === 'print') return window.print();
    if (kind === 'rmimg') { cardImg = ''; try { localStorage.removeItem(KEY + '.img'); } catch (e) {} var tc0 = $('threeCard'); if (tc0) tc0.innerHTML = ideaCard(); return; }
    if (kind === 'copy3') return copyText(cardText()).then(function () { toast('아이디어 발굴 카드를 복사했어요'); }, function () { toast('복사에 실패했어요'); });
    var text = plain(id), n = blanks(id), first = id === 'p1';
    var copied = copyText(text);
    var done = function (msg) { state.done[id] = true; save(); renderStepper(); renderFlow(); toast(msg); };
    if (kind === 'copy') { copied.then(function () { done(n ? '복사했어요 (노란 칸 ' + n + '개가 [대괄호]로 남았어요)' : first ? '복사 완료! AI 대화창에 붙여넣기(Ctrl+V)' : '복사 완료! 같은 대화창에 붙여넣기(Ctrl+V)'); }, function () { toast('복사에 실패했어요. 프롬프트 상자를 직접 선택해 복사해 주세요.'); }); return; }
    var url = kind === 'gemini' ? 'https://gemini.google.com/app' : kind === 'chatgpt' ? 'https://chatgpt.com/' : 'https://claude.ai/new', auto = false;
    if (first && kind !== 'gemini') { var full = (kind === 'chatgpt' ? 'https://chatgpt.com/?q=' : 'https://claude.ai/new?q=') + encodeURIComponent(text); if (full.length < 7000) { url = full; auto = true; } }
    window.open(url, '_blank', 'noopener');
    copied.then(function () { done(auto ? NAMES[kind] + ' 새 창에 자동 입력됩니다. 안 보이면 붙여넣기(Ctrl+V)' : '복사됨 → ' + NAMES[kind] + '에서 붙여넣기(Ctrl+V)'); }, function () { toast('복사에 실패했어요. 프롬프트 상자를 직접 복사해 주세요.'); });
  }

  /* ---------- 이벤트 ---------- */
  function refreshPrompt() {
    if (PROMPT_IDS.indexOf(cur) < 0) return;
    $('pre').innerHTML = html(cur);
    var n = blanks(cur), c = $('cnt'); c.textContent = cntText(n); c.className = 'cnt' + (n ? '' : ' ok');
  }
  document.addEventListener('click', function (e) {
    var t = e.target;
    var fl = t.closest('[data-fill]'); if (fl) { state.v[fl.dataset.fill] = fl.dataset.v; save(); var inp = $('f_' + fl.dataset.fill); if (inp) { inp.value = fl.dataset.v; inp.closest('.field').classList.add('filled'); } refreshPrompt(); return; }
    var th = t.closest('[data-theme]'); if (th) { state.theme = th.dataset.theme; save(); render(); return; }
    var g = t.closest('[data-go]'); if (g && g.dataset.go && !g.disabled) { e.preventDefault(); go(g.dataset.go); return; }
    var rc = t.closest('[data-copy]'); if (rc) { copyText(rc.dataset.copy).then(function () { toast('복사했어요 → AI 대화창에 붙여넣기'); }); return; }
    var ct = t.closest('[data-copy-text]'); if (ct) { copyText(FRAME_TEXT).then(function () { toast('질문 틀을 복사했어요'); }); return; }
    var a = t.closest('[data-act]'); if (a) { e.preventDefault(); act(a.dataset.act); }
  });
  document.addEventListener('input', function (e) {
    var k = e.target.dataset && e.target.dataset.k; if (!k) return;
    state.v[k] = e.target.value; save();
    var f = e.target.closest('.field'); if (f) f.classList.toggle('filled', !!e.target.value.trim());
    if (cur === 'end') { var tc = $('threeCard'); if (tc) tc.innerHTML = ideaCard(); } else refreshPrompt();
  });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'cardFile' && e.target.files[0]) {
      var rd = new FileReader();
      rd.onload = function () { cardImg = rd.result; try { localStorage.setItem(KEY + '.img', cardImg); } catch (er) { toast('그림이 커서 이 화면에서만 보여요(저장은 안 돼요)'); } var tc = $('threeCard'); if (tc) tc.innerHTML = ideaCard(); };
      rd.readAsDataURL(e.target.files[0]); return;
    } var c = e.target.dataset && e.target.dataset.chk; if (c) { state.checks[c] = e.target.checked; save(); } });
  document.addEventListener('keydown', function (e) {
    if (!cur || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    var i = IDX[cur];
    if (e.key === 'ArrowRight' && PAGES[i + 1]) go(PAGES[i + 1].id);
    if (e.key === 'ArrowLeft' && PAGES[i - 1]) go(PAGES[i - 1].id);
  });
  $('startBtn').onclick = function () { go('start'); };
  $('caseBtn').onclick = function () { go('case'); };
  $('resumeBtn').onclick = function () { go(state.last || 'start'); };
  $('homeBtn').onclick = function () { go(''); };
  $('resetBtn').onclick = function () {
    if (!confirm('입력한 내용과 체크 표시를 모두 지울까요?')) return;
    state = { theme: state.theme, v: {}, checks: {}, done: {}, last: cur }; save(); render(); toast('초기화했어요');
  };
  window.addEventListener('hashchange', route);
  route();
})();
