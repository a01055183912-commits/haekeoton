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
    p1_who: { label: '사람', q: '그 분야에서 내 고객이 될 사람은 누구인가요?', ph: '대학생', hint: '페르소나가 될 사람' },
    p1_cat: { label: '카테고리', q: '어떤 분야(카테고리)의 이야기인가요?', ph: '여수 오래된 골목 구경', hint: '주제 1은 생활 분야, 주제 2는 이야기가 있는 장소' },
    ps_name: { label: '이름·나이', q: '그 사람에게 이름과 나이를 붙여 보세요.', ph: '김하늘 · 22' },
    ps_situ: { label: '상황', q: '지금 어떤 상황에 있나요?', ph: '광주에 사는 대학생, 친구와 1박 2일 여수 여행 중' },
    ps_lack: { label: '부족한 것', q: '요즘 가장 부족하거나 바라는 것은 무엇인가요?', ph: '골목 가게들의 진짜 이야기' },
    j_hint: { label: '먼저 떠올린 불편', opt: true, q: '이 사람이 하루 중 가장 힘들 것 같은 순간이 있다면? (선택)', ph: '가게 앞을 그냥 지나칠 때' },
    p3_pick: { label: '방금 고른 불편', def: '방금 고른 불편', ph: '3번 불편', hint: '다른 불편으로 가고 싶을 때만 "3번 불편"처럼' },
    p4_dir: { label: '방향', hint: '주제 2는 그대로, 주제 1이면 아래 문구' }
  };

  /* ---------- 프롬프트 원문 (PPT 부록 · 프롬프트 모음) ---------- */
  var T = {
    p1:
      '나는 {{p1_who}}이고, {{p1_cat}}에 관심이 있어.\n' +
      '이 카테고리의 고객 페르소나 한 명을 아래 예시 형식으로 만들어 줘. 모자란 건 네가 가정해서 채우고, 되묻지 말고 바로 써 줘.\n' +
      '예시) 이름 김하늘 / 나이 22 / 상황 광주에 사는 대학생, 친구와 1박 2일 여수 여행 중 / 요즘 가장 부족한 것 골목 가게들의 진짜 이야기',
    p1m:
      '내가 만들려는 창업 아이디어의 고객과 분야야.\n고객: {{p1_who}}\n분야: {{p1_cat}}\n' +
      '아래는 내가 직접 만든 이 고객의 페르소나야.\n' +
      '이름·나이: {{ps_name}}\n상황: {{ps_situ}}\n요즘 가장 부족한 것: {{ps_lack}}\n' +
      '이 페르소나를 아래 예시 형식 그대로 정리해 줘. 빠지거나 어색한 곳은 네가 가정해서 고치고, 무엇을 고쳤는지 한 줄로 알려 줘. 되묻지 말고 바로 써 줘.\n' +
      '예시) 이름 김하늘 / 나이 22 / 상황 광주에 사는 대학생, 친구와 1박 2일 여수 여행 중 / 요즘 가장 부족한 것 골목 가게들의 진짜 이야기',
    p2m:
      '이 페르소나의 고객 여정 지도를 전·중·후 5단계 표로 만들어 줘.\n' +
      '페르소나) 이름·나이 {{ps_name}} / 상황 {{ps_situ}} / 요즘 가장 부족한 것 {{ps_lack}}\n' +
      '내가 먼저 떠올린 불편(참고만 해): {{j_hint}}\n' +
      '칸: 단계 / 하는 일 / 생각·감정 / 불편한 점. 불편한 점은 단계마다 하나씩 아래 예시처럼 모두 5개를 쓰고, 순서대로 ①~⑤ 번호를 붙여 줘.\n' +
      '예시) 골목 도착 / 가게들 앞을 걸어 지나감 / "어디가 유명하지?" 막막 / ② 어느 가게가 왜 유명한지 몰라서 그냥 지나친다\n' +
      '표 아래에 5개 중 가장 자주·크게 겪는 불편 하나를 골라 "고른 불편: " 한 줄로 써 줘.',
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
  /* ★ 약점 점검 샘플 (골목 라디오) */
  S.pstar = '<p><b>약점 3개</b> ① 사장님이 인터뷰에 응하지 않을 수 있다 ② 네이버 지도·블로그와 차별성이 약해 보인다 ③ 골목당 300만 원은 근거가 없는 (가정)이다</p>' +
    '<p><b>물어볼 질문 3개</b> ① 사장님들이 인터뷰에 응할까요? ② 네이버 지도·블로그와 무엇이 다른가요? ③ 골목당 300만 원을 낼 상인회가 있나요?</p>' +
    '<p class="hl">가장 치명적인 약점: ③ 가격 근거 → 보완: 가게 10곳 무료 시범 후 쿠폰 사용 수로 가격을 정한다 (확인 필요: 상인회 예산·결제 방식)</p>';

  /* ---------- 단계 (카드 1장이 나오기까지: 1~5 → 카드 → ★) ---------- */
  var PAGES = [
    { id: 'p1', label: '1', short: '페르소나', stage: '1단계 · 문제 정의', title: '프롬프트 1 · 페르소나', no: '1',
      lead: '고객이 될 사람 한 명을 만듭니다. <b>노란 칸 두 개</b>만 바꾸세요.', fields: ['p1_who', 'p1_cat'], theme: true,
      rescue: ['다른 페르소나 하나 더', '되묻지 말고 바로 써 줘'], sample: 'p1', sampleTitle: 'AI는 이렇게 답해요', banner: '카테고리와 페르소나가 들어가야 <em>그 사람, 그 분야의 불편</em>이 나옵니다' },
    { id: 'p2', label: '2', short: '여정 지도', stage: '1단계 · 문제 정의', title: '프롬프트 2 · 고객 여정 지도', no: '2',
      lead: '그 사람의 하루에서 <b>불편 5개</b>를 찾습니다. <b>그대로</b> 보내세요.', fields: [],
      rescue: ['3번으로 바꿔 줘', '되묻지 말고 바로 써 줘'], sample: 'p2', sampleTitle: 'AI는 이렇게 답해요', banner: 'AI가 불편 하나를 추천합니다. 받아들이거나 <em>"3번으로 바꿔 줘"</em> — 정하는 건 사람' },
    { id: 'p3', label: '3', short: '문제 정의', stage: '1단계 · 문제 정의', title: '프롬프트 3 · 문제 정의', no: '3',
      lead: '고른 불편을 <b>문제 한 문장</b>으로 만듭니다. 다른 불편으로 가려면 노란 칸에 "3번 불편".', fields: ['p3_pick'],
      rescue: ['빠진 칸 채워서 다시', '3번으로 바꿔 줘'], sample: 'p3', sampleTitle: 'AI는 이렇게 답해요', banner: '네 칸(누가 · 상황 · 이유 · 못 하는 것)이 다 찼는지 확인 — 빠지면 <em>"빠진 칸 채워서 다시"</em>' },
    { id: 'p4', label: '4', short: '아이디어', stage: '2단계 · 아이디어', title: '프롬프트 4 · AI 창업 아이디어 5개', no: '4',
      lead: '문제를 푸는 <b>AI 아이디어 5개</b>를 받고 "그래서 …" 한 문장으로 씁니다.', fields: ['p4_dir'], theme: true,
      rescue: ['1번 이름 5개 더 지어 줘', '다른 아이디어 5개 더', '3번으로 바꿔서 다시'], sample: 'p4', sampleTitle: 'AI는 이렇게 답해요', banner: '이름이 별로면 <em>"1번 이름 5개 더 지어 줘"</em>' },
    { id: 'p5', label: '5', short: '비즈니스 모델', stage: '3단계 · 비즈니스 모델', title: '프롬프트 5 · 비즈니스 모델', no: '5',
      lead: '3대 질문(가치 제안 · 운영 방식 · 수익 모델)과 <b>카드 네 줄</b>을 한 번에 받습니다. <b>그대로</b> 보내세요.', fields: [],
      rescue: ['빠진 칸 채워서 다시', '숫자는 (가정)으로 표시해 줘'], sample: 'p5', sampleTitle: 'AI는 이렇게 답해요', banner: '쓰는 사람과 돈 내는 사람은 <em>다를 수 있습니다</em>' },
    { id: 'pcard', label: '카드', short: '아이디어 발굴 카드', stage: '아이디어 발굴 카드', title: '아이디어 발굴 카드', no: '카드', card: true,
      lead: '프롬프트 5의 카드 네 줄을 붙여넣고, 그림을 받아 <b>카드 1장</b>으로 모읍니다.', fields: [],
      rescue: ['더 따뜻하게 다시', '장면을 하나 더'], sample: 'pcard', sampleTitle: '그림 장면 예', banner: '글은 카드에, <em>장면은 그림에</em>' },
    { id: 'pstar', label: '★', short: '약점 점검', stage: '심사위원 입장', title: '프롬프트 ★ · 약점 점검', no: '★',
      lead: '심사위원이 되어 <b>약점 3개와 질문 3개</b>를 던지게 합니다. <b>그대로</b> 보내세요.', fields: [],
      rescue: ['다른 걸로 3개 더', '더 쉽게'], sample: 'pstar', sampleTitle: 'AI는 이렇게 답해요', banner: '(확인 필요) 표시가 곧 <em>오후 멘토에게 물을 질문</em>입니다' }
  ];
  var IDX = {}; PAGES.forEach(function (p, i) { IDX[p.id] = i; });
  var CRUMBS = [['p1', '1단계 문제 정의'], ['p4', '2단계 아이디어'], ['p5', '3단계 비즈니스 모델'], ['pcard', '카드 · 점검']];
  var CRUMB_OF = { p1: 0, p2: 0, p3: 0, p4: 1, p5: 2, pcard: 3, pstar: 3 };

  /* 예시로 따라가기에 미리 채워지는 값 (골목 라디오) */
  var EXV = {
    p1_who: '대학생', p1_cat: '여수 오래된 골목 구경',
    ps_name: '김하늘 · 22', ps_situ: '광주에 사는 대학생, 친구와 1박 2일 여수 여행 중', ps_lack: '골목 가게들의 진짜 이야기', j_hint: '가게 앞을 그냥 지나칠 때',
    s1: '여수에 여행 온 대학생은 오래된 골목에서 가게 이야기를 알 길이 없어서 들어가 보지 못하고 그냥 지나친다.',
    s2: '그래서 골목 라디오는 여행 온 대학생에게 AI가 만든 사장님 목소리 30초 이야기를 가게 앞 QR로 들려주어, 그냥 지나치던 가게에 들어가게 해 준다.',
    s3: '골목 라디오는 여행자에게 30초 가게 이야기를 주고, AI 대본·음성과 대학생 인터뷰로 만들어 상인회가 QR로 전달하며, 상인회·지자체 단체 구독 골목당 300만 원 (가정)으로 돈을 번다.',
    s4: '하늘은 가게에 들어가 이야기를 듣고, 사장님은 손님이 는다'
  };

  /* ---------- 상태 ---------- */
  var KEY = 'aiIdeaStudio.v4';
  var state = { theme: '2', pmode: 'mine', v: {}, done: {}, last: 'p1' };
  try { var s0 = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s0 && s0.v) state = s0; } catch (e) {}
  function save() { if (!demo) try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  var demo = false, demoV = {}, demoDone = {};
  function V() { return demo ? demoV : state.v; }
  function D() { return demo ? demoDone : state.done; }

  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function val(k) { return (V()[k] || '').trim(); }
  var toastT;
  function toast(msg) { var t = $('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 3200); }
  function def(k) { return k === 'p4_dir' ? THEME_DIR[state.theme] : (F[k].def || ''); }
  function eff(k) { return val(k) || def(k); }
  function startDemo() { demo = true; demoV = JSON.parse(JSON.stringify(EXV)); demoDone = {}; }

  /* ---------- 프롬프트 조립 ---------- */
  function mode() { return state.pmode === 'ai' ? 'ai' : 'mine'; }
  function tid(id) { return mode() === 'mine' && (id === 'p1' || id === 'p2') ? id + 'm' : id; }
  function fieldsOf(p) {
    if (p.id === 'p1') return mode() === 'mine' ? ['p1_cat', 'p1_who', 'ps_name', 'ps_situ', 'ps_lack'] : ['p1_who', 'p1_cat'];
    if (p.id === 'p2') return mode() === 'mine' ? ['j_hint'] : [];
    return p.fields;
  }
  function parts(id) {
    id = tid(id);
    var tpl = T[id], out = [], re = /\{\{(\w+)\}\}/g, last = 0, m;
    while ((m = re.exec(tpl))) { if (m.index > last) out.push({ t: tpl.slice(last, m.index) }); out.push({ k: m[1] }); last = re.lastIndex; }
    if (last < tpl.length) out.push({ t: tpl.slice(last) });
    return out;
  }
  function plain(id) { return parts(id).map(function (x) { return x.k ? (eff(x.k) || (F[x.k].opt ? '(없음)' : '[' + F[x.k].label + ']')) : x.t; }).join(''); }
  function html(id) {
    return parts(id).map(function (x) {
      if (!x.k) return esc(x.t);
      var v = eff(x.k);
      return v ? '<mark>' + esc(v) + '</mark>' : F[x.k].opt ? '<span class="optv">(없음)</span>' : '<mark class="blank">[' + esc(F[x.k].label) + ']</mark>';
    }).join('');
  }
  function blanks(id) { return parts(id).filter(function (x) { return x.k && !eff(x.k) && !F[x.k].opt; }).length; }
  function cntText(n) { return n ? '비어 있는 칸 ' + n + '개' : '✓ 바로 복사해도 돼요'; }

  /* ---------- 라우팅 ---------- */
  var cur = null;
  function go(id) { location.hash = id ? '#/' + (demo ? 'd/' : '') + id : '#/'; }
  function route() {
    var m = /^#\/(d\/)?(\w+)/.exec(location.hash), id = m && IDX[m[2]] !== undefined ? m[2] : null;
    if (m && m[1]) { if (!demo) startDemo(); } else demo = false;
    cur = id;
    $('cover').hidden = !!id; $('studio').hidden = !id;
    if (id) { if (!demo) { state.last = id; save(); } render(); window.scrollTo(0, 0); $('slide').focus({ preventScroll: true }); }
    else { demo = false; $('resumeBtn').hidden = !(state.last && state.last !== 'p1'); window.scrollTo(0, 0); }
  }

  /* ---------- 렌더 ---------- */
  function render() {
    var p = PAGES[IDX[cur]];
    $('crumbs').innerHTML = CRUMBS.map(function (c, i) { var on = CRUMB_OF[cur] === i; return (i ? '<span class="sep">›</span>' : '') + (on ? '<span class="on">' + c[1] + '</span>' : '<button data-go="' + c[0] + '">' + c[1] + '</button>'); }).join('');
    var db = $('demobar'); db.hidden = !demo;
    if (demo) db.innerHTML = '<span><b>🎬 예시 따라가는 중</b> — 골목 라디오 사례예요. 칸이 미리 채워져 있고, 저장되지 않아요.</span><button class="btn-sm" data-act="exitdemo">내 아이디어로 시작 ›</button>';
    $('stepper').innerHTML = PAGES.map(function (q) {
      return '<button class="chip' + (q.id === cur ? ' on' : '') + (D()[q.id] ? ' done' : '') + (q.card || q.id === 'pstar' ? ' bonus' : '') + '" data-go="' + q.id + '" role="tab" aria-selected="' + (q.id === cur) + '">' + esc(q.label) + '<small>' + esc(q.short) + '</small></button>';
    }).join('');
    var on = $('stepper').querySelector('.on'); if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' });
    $('slide').innerHTML = pageHtml(p);
    var i = IDX[cur], a = PAGES[i - 1], b = PAGES[i + 1];
    $('prevBtn').disabled = !a; $('nextBtn').disabled = !b;
    $('prevBtn').dataset.go = a ? a.id : ''; $('nextBtn').dataset.go = b ? b.id : '';
    $('prevBtn').innerHTML = a ? '‹ <b>이전</b> · ' + esc(a.short) : '';
    $('nextBtn').innerHTML = b ? '<b>다음</b> › ' + esc(b.short) : '';
    document.title = p.title + ' · AI 아이디어 발굴 프롬프트';
  }

  function seg() {
    return '<div class="seg" role="group" aria-label="해커톤 주제"><span>내 주제</span>' +
      '<button data-theme="1" class="' + (state.theme === '1' ? 'on' : '') + '">주제 1 · 일상 속 불편</button>' +
      '<button data-theme="2" class="' + (state.theme === '2' ? 'on' : '') + '">주제 2 · 스토리텔링 콘텐츠</button></div>';
  }
  function chips(k, list) { return '<div class="cchips">' + list.map(function (x) { return '<button type="button" class="rchip" data-fill="' + k + '" data-v="' + esc(x) + '">' + esc(x) + '</button>'; }).join('') + '</div>'; }
  function personaCard() {
    function row(l, k) { return '<tr><th>' + l + '</th><td>' + (val(k) ? esc(val(k)) : '<span class="optv">아직 안 썼어요</span>') + '</td></tr>'; }
    return '<div class="pcard-live" id="pLive"><b>내 페르소나</b><table>' + row('이름·나이', 'ps_name') + row('상황', 'ps_situ') + row('요즘 가장 부족한 것', 'ps_lack') + '</table></div>';
  }
  function qField(k, num) {
    var f = F[k], v = V()[k] || '';
    var h = '<div class="field q' + (v ? ' filled' : '') + '"><label for="f_' + k + '"><span class="qn">' + num + '</span><span>' + esc(f.q) + (f.hint && k.indexOf('p1_') === 0 ? '<em>' + esc(f.hint) + '</em>' : '') + '</span></label>' +
      '<input id="f_' + k + '" data-k="' + k + '" type="text" value="' + esc(v) + '" placeholder="예) ' + esc(f.ph) + '" autocomplete="off">';
    if (k === 'p1_who') h += chips(k, PEOPLE);
    if (k === 'p1_cat') h += chips(k, CATS[state.theme]);
    return h + '</div>';
  }
  function modeSeg() {
    return '<div class="seg" role="group" aria-label="페르소나 만드는 방법"><span>페르소나</span>' +
      '<button data-pmode="mine" class="' + (mode() === 'mine' ? 'on' : '') + '">내가 직접 만들기</button>' +
      '<button data-pmode="ai" class="' + (mode() === 'ai' ? 'on' : '') + '">AI가 만들어 주기</button></div>';
  }
  function fieldsHtml(p) {
    var fl = fieldsOf(p);
    if (mode() === 'mine' && p.id === 'p1') return fl.map(function (k, i) { return qField(k, i + 1); }).join('') + personaCard();
    if (mode() === 'mine' && p.id === 'p2') return personaCard() + qField('j_hint', '+');
    if (!fl.length) return '<div class="nofields">노란 칸 없음 — <b>그대로</b> 같은 대화창에 붙여넣으세요.</div>';
    return fl.map(function (k) {
      var f = F[k], v = V()[k] || '', ph = k === 'p4_dir' ? THEME_DIR[state.theme] : (def(k) || f.ph);
      var h = '<div class="field y' + (v ? ' filled' : '') + '"><label for="f_' + k + '"><span class="yb">노란 칸</span> ' + esc(f.label) + (f.hint ? '<em>' + esc(f.hint) + '</em>' : '') + '</label>' +
        (k === 'p4_dir' ? '<textarea id="f_' + k + '" data-k="' + k + '" rows="2" placeholder="' + esc(ph) + '">' + esc(v) + '</textarea>' : '<input id="f_' + k + '" data-k="' + k + '" type="text" value="' + esc(v) + '" placeholder="' + (k === 'p3_pick' ? '비워 두면 "' + esc(def(k)) + '"' : '예) ' + esc(ph)) + '" autocomplete="off">');
      if (k === 'p1_who') h += chips(k, PEOPLE);
      if (k === 'p1_cat') h += chips(k, CATS[state.theme]);
      if (k === 'p3_pick') h += chips(k, ['1번 불편', '2번 불편', '3번 불편', '4번 불편', '5번 불편']);
      if (k === 'p4_dir') h += chips(k, [THEME_DIR['1'], THEME_DIR['2']]);
      return h + '</div>';
    }).join('');
  }
  function sendHtml(p) {
    var first = p.id === 'p1';
    var rescue = p.rescue.map(function (r) { return '<button class="rchip" data-copy="' + esc(r) + '">' + esc(r) + '</button>'; }).join('');
    return '<div class="send">' +
      (first
        ? '<div class="send-row"><button class="sbtn copy" data-act="copy">📋 복사하기</button><button class="sbtn" data-act="chatgpt"><span class="dot d-gpt"></span>ChatGPT</button><button class="sbtn" data-act="gemini"><span class="dot d-gem"></span>Gemini</button><button class="sbtn" data-act="claude"><span class="dot d-cla"></span>Claude</button></div>' +
          '<p class="sendnote">버튼을 누르면 <b>자동 복사</b>되고 새 대화창이 열립니다. Gemini는 붙여넣기(Ctrl+V)가 필요해요.</p>'
        : '<div class="send-one"><button class="sbtn copy" data-act="copy">📋 복사하기</button></div>' +
          '<p class="sendnote"><b>같은 대화창</b>에 붙여넣으세요(Ctrl+V). 새 대화를 열면 AI가 앞의 답을 잊습니다.<br>대화창을 닫았다면: <a href="#" data-act="chatgpt">ChatGPT</a> · <a href="#" data-act="gemini">Gemini</a> · <a href="#" data-act="claude">Claude</a></p>') +
      '<div class="rescue"><b>마음에 안 들면 (누르면 복사)</b>' + rescue + '</div></div>';
  }
  function sampleHtml(p) {
    return '<details class="aiex sample"' + (demo ? ' open' : '') + '><summary>' + esc(p.sampleTitle) + ' — 예시 보기</summary><div class="aiex-body"><div class="bub ai">' + S[p.sample] + '</div></div></details>';
  }

  /* 카드 */
  var cardImg = ''; try { cardImg = localStorage.getItem(KEY + '.img') || ''; } catch (e) {}
  function cardLines() { return [['문제', val('s1'), '프롬프트 5 카드의 "문제:" 줄'], ['그래서 아이디어', val('s2'), '"그래서 아이디어:" 줄'], ['비즈니스 모델', val('s3'), '"비즈니스 모델:" 줄']]; }
  function ideaCard() {
    var L = cardLines(), end = val('s4');
    return '<div class="icard" id="cardWrap"><h4 class="icard-t">아이디어 발굴 카드</h4><div class="icard-b">' +
      '<figure class="icard-img">' + (cardImg ? '<img src="' + cardImg + '" alt="카드 그림">' : '<div class="icard-ph">AI가 그려 준 그림을<br>"그림 넣기"로 넣으세요</div>') +
      '<figcaption>' + (end ? '결말 — ' + esc(end) : '<span class="optv">결말 한 줄</span>') + '</figcaption></figure>' +
      '<div class="icard-txt">' + L.map(function (l) { return '<p><b>' + l[0] + '</b>' + (l[1] ? esc(l[1]) : '<span class="optv">' + l[2] + '</span>') + '</p>'; }).join('') + '</div></div></div>';
  }
  function cardText() {
    var t = ['[아이디어 발굴 카드]']; cardLines().forEach(function (l) { t.push(l[0] + ': ' + (l[1] || '(아직 없음)')); });
    t.push('결말: ' + (val('s4') || '(아직 없음)')); return t.join('\n');
  }
  function assembler() {
    var f = [['s1', '문제'], ['s2', '그래서 아이디어'], ['s3', '비즈니스 모델'], ['s4', '결말 (한 줄)']];
    return '<div class="after"><h3 class="block-title navy">카드 만들기 <span class="rule">프롬프트 5의 네 줄을 복사해 붙여넣기</span></h3><div class="grid"><section><div class="fields">' +
      f.map(function (x) { return '<div class="field' + (val(x[0]) ? ' filled' : '') + '"><label for="f_' + x[0] + '">' + x[1] + '</label><textarea id="f_' + x[0] + '" data-k="' + x[0] + '" rows="' + (x[0] === 's4' ? 2 : 3) + '">' + esc(V()[x[0]] || '') + '</textarea></div>'; }).join('') +
      '</div></section><section><div id="threeCard">' + ideaCard() + '</div>' +
      '<div class="imgpick"><label class="btn-sm" for="cardFile">🖼 그림 넣기</label><input id="cardFile" type="file" accept="image/*" hidden><button class="link" data-act="rmimg">그림 빼기</button></div>' +
      '<div class="card-actions"><button class="sbtn copy" data-act="copy3">📋 카드 글 복사</button><button class="sbtn" data-act="print">🖨 인쇄 / PDF</button></div></section></div></div>';
  }

  function leadOf(p) {
    if (mode() === 'mine' && p.id === 'p1') return '질문 5개에 답하면 <b>내 페르소나</b>가 만들어집니다. AI는 그 사람을 다듬어 줍니다.';
    if (mode() === 'mine' && p.id === 'p2') return '내가 만든 페르소나로 <b>고객 여정 지도</b>를 만들어 <b>불편 5개</b>를 찾습니다. 프롬프트는 <b>그대로</b> 보내세요.';
    return p.lead;
  }
  function pageHtml(p) {
    var n = blanks(p.id), left = '';
    if (p.theme) left += seg();
    if (p.id === 'p1') left += modeSeg();
    var fl0 = fieldsOf(p), mineP = mode() === 'mine' && (p.id === 'p1' || p.id === 'p2');
    if (fl0.length) left += '<h3 class="block-title">' + (p.id === 'p1' && mineP ? '① 질문에 답하며 내 페르소나 만들기' : p.id === 'p2' && mineP ? '① 앞에서 만든 내 페르소나' : '① 노란 칸만 내 말로') + '</h3>';
    left += '<div class="fields">' + fieldsHtml(p) + '</div>';
    var right = '<h3 class="block-title">' + (fl0.length ? '②' : '①') + ' 프롬프트</h3>' +
      '<div class="pbox"><div class="pbox-head"><span>프롬프트 ' + p.no + '</span><span class="cnt' + (n ? '' : ' ok') + '" id="cnt">' + cntText(n) + '</span></div><pre class="pre" id="pre">' + html(p.id) + '</pre></div>' + sendHtml(p);
    return '<div class="slide-head"><div><p class="stage-label">' + esc(p.stage) + '</p><h2>' + esc(p.title) + '</h2></div></div>' +
      '<p class="lead">' + leadOf(p) + '</p>' +
      (p.card ? '<div class="grid one"><section>' + right + '</section></div>' : '<div class="grid"><section>' + left + '</section><section>' + right + '</section></div>') +
      sampleHtml(p) + (p.card ? assembler() : '') +
      '<div class="banner">' + p.banner + '</div>';
  }

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
    if (kind === 'exitdemo') { demo = false; go('p1'); return; }
    if (kind === 'rmimg') { cardImg = ''; try { localStorage.removeItem(KEY + '.img'); } catch (e) {} var tc0 = $('threeCard'); if (tc0) tc0.innerHTML = ideaCard(); return; }
    if (kind === 'copy3') return copyText(cardText()).then(function () { toast('아이디어 발굴 카드를 복사했어요'); }, function () { toast('복사에 실패했어요'); });
    var text = plain(id), n = blanks(id), first = id === 'p1';
    var copied = copyText(text);
    var done = function (msg) { D()[id] = true; save(); render(); toast(msg); };
    if (kind === 'copy') { copied.then(function () { done(n ? '복사했어요 (노란 칸 ' + n + '개가 [대괄호]로 남았어요)' : first ? '복사 완료! AI 대화창에 붙여넣기(Ctrl+V)' : '복사 완료! 같은 대화창에 붙여넣기(Ctrl+V)'); }, function () { toast('복사에 실패했어요. 프롬프트 상자를 직접 선택해 복사해 주세요.'); }); return; }
    var url = kind === 'gemini' ? 'https://gemini.google.com/app' : kind === 'chatgpt' ? 'https://chatgpt.com/' : 'https://claude.ai/new', auto = false;
    if (first && kind !== 'gemini') { var full = (kind === 'chatgpt' ? 'https://chatgpt.com/?q=' : 'https://claude.ai/new?q=') + encodeURIComponent(text); if (full.length < 7000) { url = full; auto = true; } }
    window.open(url, '_blank', 'noopener');
    copied.then(function () { done(auto ? NAMES[kind] + ' 새 창에 자동 입력됩니다. 안 보이면 붙여넣기(Ctrl+V)' : '복사됨 → ' + NAMES[kind] + '에서 붙여넣기(Ctrl+V)'); }, function () { toast('복사에 실패했어요. 프롬프트 상자를 직접 복사해 주세요.'); });
  }

  /* ---------- 이벤트 ---------- */
  function refreshPrompt() {
    if (!$('pre')) return;
    $('pre').innerHTML = html(cur);
    var n = blanks(cur), c = $('cnt'); c.textContent = cntText(n); c.className = 'cnt' + (n ? '' : ' ok');
  }
  document.addEventListener('click', function (e) {
    var t = e.target;
    var fl = t.closest('[data-fill]'); if (fl) { V()[fl.dataset.fill] = fl.dataset.v; save(); var inp = $('f_' + fl.dataset.fill); if (inp) { inp.value = fl.dataset.v; inp.closest('.field').classList.add('filled'); } refreshPrompt(); var pl2 = $('pLive'); if (pl2) pl2.outerHTML = personaCard(); return; }
    var pm = t.closest('[data-pmode]'); if (pm) { state.pmode = pm.dataset.pmode; save(); render(); return; }
    var th = t.closest('[data-theme]'); if (th) { state.theme = th.dataset.theme; save(); render(); return; }
    var g = t.closest('[data-go]'); if (g && g.dataset.go && !g.disabled) { e.preventDefault(); go(g.dataset.go); return; }
    var rc = t.closest('[data-copy]'); if (rc) { copyText(rc.dataset.copy).then(function () { toast('복사했어요 → AI 대화창에 붙여넣기'); }); return; }
    var a = t.closest('[data-act]'); if (a) { e.preventDefault(); act(a.dataset.act); }
  });
  document.addEventListener('input', function (e) {
    var k = e.target.dataset && e.target.dataset.k; if (!k) return;
    V()[k] = e.target.value; save();
    var f = e.target.closest('.field'); if (f) f.classList.toggle('filled', !!e.target.value.trim());
    var tc = $('threeCard'); if (tc && /^s\d$/.test(k)) tc.innerHTML = ideaCard(); else refreshPrompt();
    var pl = $('pLive'); if (pl) pl.outerHTML = personaCard();
  });
  document.addEventListener('change', function (e) {
    if (e.target.id === 'cardFile' && e.target.files[0]) {
      var rd = new FileReader();
      rd.onload = function () { cardImg = rd.result; try { localStorage.setItem(KEY + '.img', cardImg); } catch (er) { toast('그림이 커서 이 화면에서만 보여요(저장은 안 돼요)'); } var tc = $('threeCard'); if (tc) tc.innerHTML = ideaCard(); };
      rd.readAsDataURL(e.target.files[0]);
    }
  });
  document.addEventListener('keydown', function (e) {
    if (!cur || /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) return;
    var i = IDX[cur];
    if (e.key === 'ArrowRight' && PAGES[i + 1]) go(PAGES[i + 1].id);
    if (e.key === 'ArrowLeft' && PAGES[i - 1]) go(PAGES[i - 1].id);
  });
  $('startBtn').onclick = function () { demo = false; go('p1'); };
  $('demoBtn').onclick = function () { startDemo(); go('p1'); };
  $('resumeBtn').onclick = function () { demo = false; go(state.last || 'p1'); };
  $('homeBtn').onclick = function () { demo = false; go(''); };
  $('resetBtn').onclick = function () {
    if (demo) { startDemo(); render(); toast('예시를 처음 상태로 되돌렸어요'); return; }
    if (!confirm('입력한 내용을 모두 지울까요?')) return;
    state = { theme: state.theme, pmode: state.pmode, v: {}, done: {}, last: cur }; save(); render(); toast('초기화했어요');
  };
  window.addEventListener('hashchange', route);
  route();
})();
