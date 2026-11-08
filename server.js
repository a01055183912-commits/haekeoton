// 비밀번호로 잠긴 정적 파일 서버 (Railway: PORT, APP_PASSWORD 환경변수 사용)
// - 비밀번호는 코드에 적지 않고 환경변수 APP_PASSWORD 로만 받습니다.
// - APP_PASSWORD 가 없으면 사이트 전체를 닫아 둡니다(/health 제외).
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, 'public');
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.APP_PASSWORD || '';
const SESSION_HOURS = 12;
const COOKIE = 'ais_auth';
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8'
};

/* ---------- 인증 ---------- */
const sha = (s) => crypto.createHash('sha256').update(String(s)).digest();
// 비밀번호에서 만든 서명 키 — 비밀번호가 바뀌면 기존 로그인은 모두 무효가 됩니다.
const KEY = PASSWORD ? crypto.createHmac('sha256', 'ai-startup-studio').update(PASSWORD).digest() : null;
function sign(exp) { return crypto.createHmac('sha256', KEY).update('v1.' + exp).digest('hex'); }
function makeToken() { const exp = Date.now() + SESSION_HOURS * 3600 * 1000; return exp + '.' + sign(exp); }
function validToken(tok) {
  if (!KEY || !tok) return false;
  const [exp, sig] = String(tok).split('.');
  if (!exp || !sig || !/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function cookies(req) {
  const out = {};
  String(req.headers.cookie || '').split(';').forEach((p) => { const i = p.indexOf('='); if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim()); });
  return out;
}
function passwordOk(input) { return !!PASSWORD && crypto.timingSafeEqual(sha(input), sha(PASSWORD)); }
function cookieHeader(req, value, maxAge) {
  const secure = req.headers['x-forwarded-proto'] === 'https' || req.socket.encrypted;
  return COOKIE + '=' + encodeURIComponent(value) + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + maxAge + (secure ? '; Secure' : '');
}

/* 로그인 실패 제한: 같은 IP에서 10분에 30번까지 (무차별 대입 방지) */
const fails = new Map();
function ipOf(req) { return String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim(); }
function blocked(ip) { const f = fails.get(ip); return !!f && f.n >= 30 && Date.now() - f.t < 600000; }
function addFail(ip) { const f = fails.get(ip); if (!f || Date.now() - f.t >= 600000) fails.set(ip, { n: 1, t: Date.now() }); else f.n++; }
setInterval(() => { const now = Date.now(); for (const [k, v] of fails) if (now - v.t >= 600000) fails.delete(k); }, 600000).unref();

function readBody(req, limit = 2048) {
  return new Promise((resolve) => {
    let b = '';
    req.on('data', (d) => { b += d; if (b.length > limit) { req.destroy(); resolve(''); } });
    req.on('end', () => resolve(b));
    req.on('error', () => resolve(''));
  });
}

function page(title, body, status = 200) {
  const html = '<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex,nofollow">' +
    '<title>' + title + '</title><style>' +
    ':root{--navy:#16294A;--red:#C23A2F;--yellow:#FFE45C;--paper:#ECEBE8}*{box-sizing:border-box}' +
    'body{margin:0;min-height:100vh;min-height:100dvh;display:flex;align-items:center;justify-content:center;background:var(--navy);color:#fff;font-family:Pretendard,"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",system-ui,sans-serif;padding:20px}' +
    '.box{width:100%;max-width:400px}.k{margin:0 0 22px;font-size:14px;opacity:.8}h1{margin:0 0 8px;font-size:30px;line-height:1.2;letter-spacing:-.02em}' +
    '.s{margin:0 0 26px;color:var(--yellow);font-weight:700}label{display:block;font-size:14px;margin-bottom:6px;font-weight:700}' +
    'input{width:100%;font:inherit;font-size:17px;padding:13px 14px;border:0;border-radius:2px;color:#2E2E2E}input:focus{outline:3px solid var(--yellow)}' +
    'button{width:100%;margin-top:12px;font:inherit;font-size:17px;font-weight:800;padding:14px;border:0;border-radius:2px;background:var(--yellow);color:var(--navy);cursor:pointer}' +
    '.e{min-height:22px;margin:10px 0 0;color:#ffb4ab;font-weight:700;font-size:14px}.n{margin:22px 0 0;font-size:13px;opacity:.7;line-height:1.6}</style></head><body><div class="box">' + body + '</div></body></html>';
  return { status, html };
}
function loginPage(error) {
  return page('AI 창업 아이디어 발굴 스튜디오 · 로그인',
    '<p class="k">AI Build-up 창업 캠프 · AI 창업 아이디어 해커톤</p><h1>AI 창업 아이디어<br>발굴 스튜디오</h1><p class="s">프롬프트 5개로 완성하는 나의 창업 아이디어 카드</p>' +
    '<form id="f" method="post" action="/login"><label for="pw">비밀번호</label><input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>' +
    '<button type="submit">입장하기</button><p class="e" id="e" role="alert">' + (error || '') + '</p></form>' +
    '<p class="n">강의에서 안내받은 비밀번호를 입력하세요.</p>' +
    '<script>var f=document.getElementById("f"),e=document.getElementById("e");f.addEventListener("submit",function(ev){ev.preventDefault();e.textContent="";' +
    'fetch("/login",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:"password="+encodeURIComponent(document.getElementById("pw").value),credentials:"same-origin"})' +
    '.then(function(r){if(r.ok){location.reload();}else if(r.status===429){e.textContent="시도가 너무 많아요. 잠시 후 다시 해 주세요.";}else{e.textContent="비밀번호가 맞지 않아요.";document.getElementById("pw").select();}})' +
    '.catch(function(){e.textContent="연결에 실패했어요. 다시 시도해 주세요.";});});</script>');
}
function send(res, p, extra = {}) {
  res.writeHead(p.status, Object.assign({ 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' }, extra));
  res.end(p.html);
}

/* ---------- 서버 ---------- */
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');

  // Railway 상태 확인 (내용 없음)
  if (url.pathname === '/health') { res.writeHead(200, { 'Content-Type': 'text/plain' }); return res.end('ok'); }

  // 비밀번호가 설정되지 않았으면 전부 닫기
  if (!PASSWORD) {
    return send(res, page('닫혀 있어요', '<h1>지금은 닫혀 있어요</h1><p class="n">관리자가 접속 비밀번호를 아직 설정하지 않았습니다.</p>', 503));
  }

  // 로그인
  if (url.pathname === '/login' && req.method === 'POST') {
    const ip = ipOf(req);
    if (blocked(ip)) { res.writeHead(429, { 'Cache-Control': 'no-store' }); return res.end('too many attempts'); }
    const pw = new URLSearchParams(await readBody(req)).get('password') || '';
    if (passwordOk(pw)) {
      fails.delete(ip);
      const h = { 'Set-Cookie': cookieHeader(req, makeToken(), SESSION_HOURS * 3600), 'Cache-Control': 'no-store' };
      if (req.headers['accept'] && req.headers['accept'].includes('text/html')) { res.writeHead(303, Object.assign({ Location: '/' }, h)); return res.end(); }
      res.writeHead(204, h); return res.end();
    }
    addFail(ip);
    if (req.headers['accept'] && req.headers['accept'].includes('text/html')) return send(res, loginPage('비밀번호가 맞지 않아요.'), {});
    res.writeHead(401, { 'Cache-Control': 'no-store' }); return res.end('unauthorized');
  }
  if (url.pathname === '/logout') {
    res.writeHead(303, { Location: '/', 'Set-Cookie': cookieHeader(req, '', 0), 'Cache-Control': 'no-store' }); return res.end();
  }

  // 로그인하지 않았으면 로그인 화면만 보여 줌 (파일 내용은 내보내지 않음)
  if (!validToken(cookies(req)[COOKIE])) return send(res, loginPage(''));

  // 로그인한 사용자: 정적 파일
  let p;
  try { p = path.normalize(decodeURIComponent(url.pathname)); } catch (e) { res.writeHead(400); return res.end('Bad request'); }
  if (p.endsWith(path.sep) || p === '.') p = path.join(p, 'index.html');
  const file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) {
      return fs.readFile(path.join(ROOT, 'index.html'), (e2, d2) => {
        if (e2) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200, { 'Content-Type': TYPES['.html'], 'Cache-Control': 'no-cache' }); res.end(d2);
      });
    }
    const ext = path.extname(file);
    const etag = '"' + data.length + '-' + fs.statSync(file).mtimeMs.toString(16) + '"';
    const headers = { 'Content-Type': TYPES[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'ETag': etag, 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex' };
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers); return res.end(); }
    res.writeHead(200, headers);
    res.end(data);
  });
}).listen(PORT, '0.0.0.0', () => console.log('listening on ' + PORT + (PASSWORD ? ' (비밀번호 잠금 켜짐)' : ' (APP_PASSWORD 없음 — 전체 닫힘)')));
