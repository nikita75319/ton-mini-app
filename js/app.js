const projects = [
  {emoji:'☕', title:'Кофемашина в бизнес-центре', sub:'Аренда · выплаты ежемесячно', desc:'Покупаем кофемашину и сдаём её в аренду. Доход делится между всеми участниками.', raised:420, goal:1200, backers:38, days:12},
  {emoji:'🛴', title:'10 электросамокатов', sub:'Прокат в центре города', desc:'Парк электросамокатов сдаётся в прокат через партнёрский сервис, доход делится между вкладчиками.', raised:3900, goal:5000, backers:112, days:5},
  {emoji:'🅿️', title:'Парковочное место', sub:'Сдаётся в аренду', desc:'Парковочное место в центре сдаётся в долгосрочную аренду, доход выплачивается ежемесячно.', raised:900, goal:9000, backers:14, days:30},
];

// --- load the split-out HTML fragments into the shell, then wire everything up ---
async function loadFragment(url, target) {
  const res = await fetch(url);
  target.innerHTML = await res.text();
}

async function init() {
  await Promise.all([
    loadFragment('components/topbar.html', document.getElementById('topbarRoot')),
    loadFragment('components/tabbar.html', document.getElementById('tabbarRoot')),
    loadFragment('pages/list.html', document.querySelector('.page[data-page="list"]')),
    loadFragment('pages/detail.html', document.querySelector('.page[data-page="detail"]')),
    loadFragment('pages/investments.html', document.querySelector('.page[data-page="investments"]')),
    loadFragment('pages/profile.html', document.querySelector('.page[data-page="profile"]')),
  ]);

  renderProjectCards();
  wireNavigation();
  wireTheme();
}

function renderProjectCards() {
  const cardList = document.getElementById('cardList');
  projects.forEach((p, i) => {
    const pct = Math.round(p.raised / p.goal * 100);
    const btn = document.createElement('button');
    btn.className = 'card';
    btn.innerHTML = `
      <div class="card-top">
        <div class="icon">${p.emoji}</div>
        <div>
          <p class="card-title">${p.title}</p>
          <p class="card-sub">${p.sub}</p>
        </div>
      </div>
      <div class="track"><div class="track-fill" style="width:${pct}%"></div></div>
      <div class="card-amounts"><span>${p.raised.toLocaleString('ru-RU')} € из ${p.goal.toLocaleString('ru-RU')} €</span><span class="pct">${pct}%</span></div>
      <p class="card-meta">от 10 € · ${p.backers} участников · ${p.days} дней</p>
    `;
    btn.addEventListener('click', () => openDetail(i));
    cardList.appendChild(btn);
  });
}

function openDetail(i) {
  const p = projects[i];
  const pct = Math.round(p.raised / p.goal * 100);
  document.getElementById('detailHero').textContent = p.emoji;
  document.getElementById('detailTitle').textContent = p.title;
  document.getElementById('detailDesc').textContent = p.desc;
  document.getElementById('detailAmount').textContent = `${p.raised.toLocaleString('ru-RU')} € из ${p.goal.toLocaleString('ru-RU')} €`;
  document.getElementById('detailFill').style.width = pct + '%';
  document.getElementById('detailPct').textContent = pct + '% собрано';
  document.getElementById('detailDays').textContent = `осталось ${p.days} дней`;
  goTo('detail', true);
}

let history = ['list'];

function goTo(name, push) {
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('active', p.dataset.page === name));
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t.dataset.tab === name));
  document.getElementById('backBtn').classList.toggle('show', name === 'detail');
  document.getElementById('ctaBtn').style.display = name === 'detail' ? 'block' : 'none';
  if (push) history.push(name);
}

function wireNavigation() {
  document.querySelectorAll('.tab').forEach(t => t.addEventListener('click', () => {
    history = [t.dataset.tab];
    goTo(t.dataset.tab);
  }));
  document.getElementById('backBtn').addEventListener('click', () => {
    history.pop();
    goTo(history[history.length - 1] || 'list');
  });
  document.getElementById('ctaBtn').addEventListener('click', (e) => {
    e.target.textContent = 'Заявка принята ✓';
  });
  goTo('list');
}

function applyTheme(t) {
  if (t) document.documentElement.setAttribute('data-theme', t);
  else document.documentElement.removeAttribute('data-theme');
}

function wireTheme() {
  try {
    const saved = localStorage.getItem('theme');
    applyTheme(saved || 'light');
  } catch (e) {
    applyTheme('light');
  }

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') ||
      (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

init();