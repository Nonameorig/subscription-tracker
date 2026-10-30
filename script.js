let subs = JSON.parse(localStorage.getItem('subs_tracker')) || [];
let currentLang = localStorage.getItem('app_lang') || 'ru';
let translations = {};

document.getElementById('date').valueAsDate = new Date();

document.getElementById('langSwitch').value = currentLang;
document.getElementById('langSwitch').addEventListener('change', (e) => {
  currentLang = e.target.value;
  localStorage.setItem('app_lang', currentLang);
  loadLanguage();
});

async function loadLanguage() {
  try {
    const response = await fetch(`${currentLang}.json?v=${Date.now()}`);
    if (!response.ok) throw new Error('Network response was not ok');
    translations = await response.json();
    applyTranslations();
    render();
  } catch (error) {
    console.error('Ошибка загрузки локализации:', error);
    alert("Запустите локальный сервер для загрузки JSON.");
  }
}

function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[key]) el.innerHTML = translations[key];
  });
  
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[key]) el.placeholder = translations[key];
  });
}

function save() {
  localStorage.setItem('subs_tracker', JSON.stringify(subs));
  render();
}

function addSub() {
  const name = document.getElementById('name').value.trim();
  const amount = parseFloat(document.getElementById('amount').value);
  const currency = document.getElementById('currency').value;
  const date = document.getElementById('date').value;

  if (!name || isNaN(amount) || amount <= 0 || !date) {
    alert(translations.alert_fill || 'Заполните все поля');
    return;
  }

  subs.push({ id: Date.now().toString(), name, amount, currency, date });
  
  document.getElementById('name').value = '';
  document.getElementById('amount').value = '';
  save();
}

function deleteSub(id) {
  if(confirm(translations.confirm_delete || 'Удалить?')) {
    subs = subs.filter(s => s.id !== id);
    save();
  }
}

function formatMoney(amount, currency) {
  const locale = currentLang === 'ru' ? 'ru-RU' : 'en-US';
  return new Intl.NumberFormat(locale, { 
    style: 'currency', 
    currency: currency, 
    minimumFractionDigits: 0,
    maximumFractionDigits: 2 
  }).format(amount);
}

function formatDate(dateStr) {
  const locale = currentLang === 'ru' ? 'ru-RU' : 'en-US';
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
}

function render() {
  const list = document.getElementById('subList');
  const empty = document.getElementById('emptyState');
  const totalsContainer = document.getElementById('totalsContainer');
  
  list.innerHTML = '';
  totalsContainer.innerHTML = '';

  if (subs.length === 0) {
    empty.style.display = 'block';
    return;
  } else {
    empty.style.display = 'none';
  }

  const today = new Date();
  today.setHours(0,0,0,0);

  const sorted = [...subs].sort((a, b) => new Date(a.date) - new Date(b.date));
  const totals = {};

  sorted.forEach(sub => {
    const subDate = new Date(sub.date);
    subDate.setHours(0,0,0,0);
    const diffDays = Math.ceil((subDate - today) / (1000 * 60 * 60 * 24));

    let badgeClass = 'normal';
    let daysText = `${diffDays} ${translations.day_days || 'дн.'}`;

    if (diffDays === 0) { 
      badgeClass = 'today'; 
      daysText = translations.day_today || 'Сегодня'; 
    }
    else if (diffDays === 1) { 
      badgeClass = 'soon'; 
      daysText = translations.day_tomorrow || 'Завтра'; 
    }
    else if (diffDays < 0) { 
      badgeClass = 'today'; 
      daysText = translations.day_overdue || 'Просрочено'; 
    }
    else if (diffDays <= 3) { 
      badgeClass = 'soon'; 
    }

    const div = document.createElement('div');
    div.className = 'sub-card';
    div.innerHTML = `
      <div class="sub-header">
        <div class="sub-name">${sub.name}</div>
        <div class="sub-price">${formatMoney(sub.amount, sub.currency)}</div>
      </div>
      <div class="sub-footer">
        <div class="sub-date">
          ${formatDate(sub.date)} 
          <span class="badge ${badgeClass}" style="margin-left:8px;">${daysText}</span>
        </div>
        <button class="btn-del" onclick="deleteSub('${sub.id}')">${translations.btn_delete || 'Удалить'}</button>
      </div>
    `;
    list.appendChild(div);

    if (!totals[sub.currency]) totals[sub.currency] = 0;
    totals[sub.currency] += sub.amount;
  });

  Object.keys(totals).sort().forEach(curr => {
    const div = document.createElement('div');
    div.className = 'total-row';
    div.innerHTML = `
      <div class="total-label">${translations.total_label || 'Итого в'} ${curr}</div>
      <div class="total-value">${formatMoney(totals[curr], curr)}</div>
    `;
    totalsContainer.appendChild(div);
  });
}

loadLanguage();