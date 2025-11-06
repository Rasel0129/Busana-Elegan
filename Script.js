/* Script.js - interaksi utama */

/* AUTH (demo) */
function loginUser(e){
  e.preventDefault();
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value.trim();

  if(u === 'admin' && p === '1234'){
    localStorage.setItem('busana_logged','true');
    window.location.href = 'Beranda.html';
    return false;
  } else {
    alert('Username atau password salah. (Gunakan admin / 1234)');
    return false;
  }
}

function logout(){
  localStorage.removeItem('busana_logged');
  window.location.href = 'Index.html';
}

/* CAROUSEL */
let carouselIntervalId = null;
function initCarousel(id, interval=4000){
  const el = document.getElementById(id);
  if(!el) return;
  const slides = el.children;
  const total = slides.length;
  let index = 0;

  const dotsContainer = document.getElementById('dots');
  if(dotsContainer){
    dotsContainer.innerHTML = '';
    for(let i=0;i<total;i++){
      const b = document.createElement('button');
      b.addEventListener('click', ()=> goTo(i));
      dotsContainer.appendChild(b);
    }
  }

  function refresh(){
    el.style.transform = `translateX(-${index*100}%)`;
    const dots = dotsContainer ? dotsContainer.children : [];
    for(let i=0;i<dots.length;i++){
      dots[i].classList.toggle('active', i===index);
    }
  }

  function next(){
    index = (index+1) % total;
    refresh();
  }
  function prev(){
    index = (index-1+total) % total;
    refresh();
  }
  function goTo(i){ index = i % total; refresh(); reset(); }

  function reset(){
    if(carouselIntervalId) clearInterval(carouselIntervalId);
    carouselIntervalId = setInterval(next, interval);
  }

  window.nextSlide = next;
  window.prevSlide = prev;
  window.goToSlide = goTo;

  refresh();
  reset();
}

/* CONTACT (localStorage demo) */
function kirimPesan(e){
  e.preventDefault();
  const nama = document.getElementById('nama')?.value?.trim();
  const email = document.getElementById('email')?.value?.trim();
  const judul = document.getElementById('judul')?.value?.trim();
  const pesan = document.getElementById('pesan')?.value?.trim();

  if(!nama || !email || !judul || !pesan){
    alert('Lengkapi semua field.');
    return false;
  }

  const inbox = JSON.parse(localStorage.getItem('busana_inbox') || "[]");
  inbox.unshift({ id: Date.now(), nama, email, judul, pesan, waktu: new Date().toLocaleString() });
  localStorage.setItem('busana_inbox', JSON.stringify(inbox));
  alert('Pesan terkirim! (disimpan sementara di browser)');
  e.target.reset();
  loadInbox();
  return false;
}

function loadInbox(){
  const area = document.getElementById('inboxArea');
  if(!area) return;
  const inbox = JSON.parse(localStorage.getItem('busana_inbox') || "[]");
  if(inbox.length === 0){
    area.innerHTML = '<p class="muted">Belum ada pesan.</p>';
    return;
  }

  area.innerHTML = inbox.map(i => `
    <div style="border-bottom:1px solid #eee;padding:10px 0;">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <strong>${escapeHtml(i.judul)}</strong>
        <small class="muted">${i.waktu}</small>
      </div>
      <div class="muted">${escapeHtml(i.nama)} — ${escapeHtml(i.email)}</div>
      <p style="margin-top:8px;">${escapeHtml(i.pesan)}</p>
    </div>
  `).join('');
}

/* UTIL */
function escapeHtml(s){
  if(!s) return '';
  return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
}

/* Close modal on ESC */
document.addEventListener('keydown', (ev)=>{
  if(ev.key === 'Escape'){
    const m = document.getElementById('productModal');
    if(m && !m.classList.contains('hidden')) {
      m.classList.add('hidden');
      document.body.classList.remove('no-scroll');
    }
  }
});