/* ==========================================================
   Libro para Adamary — script.js
   Secciones: datos editables · utilidades · portada · navegación
   · mesa · stickers · lluvia · atardecer · museo · reproductor
   ========================================================== */
'use strict';

/* ---------- DATOS EDITABLES ---------- */
const OBJECTS = [
  ['🐰','Conejito','Algunas cosas suaves te recuerdan que no todo tiene que ser serio.'],
  ['🌻','Girasoles','Porque algunas cosas simplemente hacen que un lugar se sienta más alegre.'],
  ['🌷','Tulipanes','Delicados, tranquilos, y siempre aparecen justo cuando hacen falta.'],
  ['🌹','Rosa de listón','Una flor que no se marchita: la hicieron para quedarse.'],
  ['🍫','Chocolate','Pequeño, dulce y sorprendentemente eficaz contra los días grises.'],
  ['🧸','Peluche','Hay compañías que no necesitan decir nada para acompañar.'],
  ['💎','Cuarzo','Una piedra que parece guardar un poco de luz para después.'],
  ['🎧','Audífonos','Con cable y todo: una canción bien elegida puede cambiar la tarde.'],
  ['🐬','Delfín','Curioso y juguetón, como esas conversaciones que se alargan sin querer.'],
  ['✉️','Carta','Escrita a mano se siente distinto: se nota que alguien se detuvo a pensarla.'],
  ['⌚','Reloj','Hay ratos que uno quisiera guardar más tiempo del que dura una hora.'],
  ['👛','Monedero','Pequeño por fuera, lleno de cosas importantes por dentro.']
];
const STICKERS = [
  ['🍫','Una de esas pequeñas cosas que pueden arreglar cualquier día.'],
  ['🌶️','Probablemente esto desaparezca misteriosamente en cinco minutos.'],
  ['🧸','Lotso aprueba este libro. (Con reservas, pero aprueba.)'],
  ['🐶','Snoopy dice que hoy toca descansar y mirar las nubes.'],
  ['💅','Uñas nuevas: el tipo de cambio pequeño que se nota mucho.'],
  ['💍','Una pulsera más y la colección ya es oficialmente un tesoro.'],
  ['👜','Cabe justo lo necesario. Ni más ni menos.'],
  ['🎮','Un nivel más. Solo uno. (Nadie lo cree, pero se dice.)']
];
const RAIN_LINES = ['Algunas tardes son mejores con paraguas y sin prisa.','Escucha: hasta el silencio suena bonito.','Hoy no hay que ir a ningún lado.','La lluvia también se sienta a conversar.'];
const OBRAS = [
  ['Los días tranquilos','Nada pasó de más,<br>y sin embargo<br>aquí seguimos hablando<br>de todo y de nada.','Una pequeña colección de momentos que probablemente parecían normales mientras ocurrían.'],
  ['Risa sin motivo','Empezó con una tontería<br>y terminó siendo<br>lo mejor de la tarde.','Técnica: espontánea. Material: buena compañía. Se recomienda no explicar el chiste.'],
  ['Cosas que se guardan','Un cuarzo, una carta,<br>una canción que se repite:<br>el museo es todo aquello<br>que decidimos conservar.','Pieza en constante ampliación. Se permite tocar.']
];
/* Para añadir música: copia tu .mp3 a assets/audio/ y añade aquí su ruta */
const TRACKS = [{name:'Canción 1 (tu mp3 aquí)',src:'assets/audio/cancion1.mp3'},{name:'Canción 2 (tu mp3 aquí)',src:'assets/audio/cancion2.mp3'}];

/* ---------- UTILIDADES ---------- */
const $ = (s, r=document) => r.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let toastTimer;
function flash(el, text, ms=3200){ el.innerHTML = text; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove('show'), ms); }

/* ---------- PÉTALOS ---------- */
(function petals(){
  const box = $('.petals'); if (reduced) return;
  const colors = ['#f2c9cf','#f7e3a1','#d9cbe8'];
  for (let i=0;i<10;i++){
    const s = document.createElement('span');
    s.style.cssText = `left:${Math.random()*100}%;background:${colors[i%3]};animation-duration:${14+Math.random()*12}s;animation-delay:${-Math.random()*20}s`;
    box.appendChild(s);
  }
})();

/* ---------- PORTADA ---------- */
$('#openBtn').addEventListener('click', () => {
  $('#cover').classList.add('opening');
  setTimeout(() => { $('#cover').hidden = true; $('#book').hidden = false; go(Number(localStorage.getItem('adamary-page'))||0, true); }, reduced?50:1100);
});

/* ---------- NAVEGACIÓN ---------- */
const pages = [...document.querySelectorAll('.page')];
const dots = $('#dots'); let cur = 0;
pages.forEach(() => dots.appendChild(document.createElement('i')));
function go(n, first){
  n = Math.max(0, Math.min(pages.length-1, n));
  pages.forEach((p,i) => { p.classList.toggle('active', i===n); p.classList.toggle('past', i<n); if(i===n) p.scrollTop = 0; });
  [...dots.children].forEach((d,i) => d.classList.toggle('on', i===n));
  $('#prev').disabled = n===0; $('#next').disabled = n===pages.length-1;
  $('#prev').style.opacity = n===0 ? .35 : 1; $('#next').style.opacity = n===pages.length-1 ? .35 : 1;
  cur = n; localStorage.setItem('adamary-page', n);
  document.title = 'Para Adamary — ' + pages[n].dataset.title;
  rainPage(pages[n].id === 'rainPage'); skyPage(pages[n].id === 'skyPage');
}
$('#prev').onclick = () => go(cur-1); $('#next').onclick = () => go(cur+1);
$('#restart').onclick = () => go(0);
document.addEventListener('keydown', e => { if(e.key==='ArrowRight') go(cur+1); if(e.key==='ArrowLeft') go(cur-1); });
// Swipe horizontal (ignora el deslizador y gestos verticales)
let sx=0, sy=0;
$('#pages').addEventListener('touchstart', e => { sx=e.touches[0].clientX; sy=e.touches[0].clientY; }, {passive:true});
$('#pages').addEventListener('touchend', e => {
  if (e.target.type === 'range') return;
  const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)*1.5) go(cur + (dx<0 ? 1 : -1));
}, {passive:true});

/* ---------- CAP 2: MESA ---------- */
OBJECTS.forEach(([emoji, title, text]) => {
  const b = document.createElement('button'); b.className = 'obj'; b.textContent = emoji; b.setAttribute('aria-label', title);
  b.onclick = () => { b.classList.remove('glow'); void b.offsetWidth; b.classList.add('glow'); flash($('#card'), `<b>${title}</b>${text}`, 4500); };
  $('#table').appendChild(b);
});

/* ---------- CAP 3: STICKERS ---------- */
STICKERS.forEach(([emoji, text]) => {
  const b = document.createElement('button'); b.className = 'sticker'; b.textContent = emoji; b.setAttribute('aria-label', text);
  b.onclick = () => { b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); flash($('#toast'), text); };
  $('#stickers').appendChild(b);
});

/* ---------- CAP 4: LLUVIA ---------- */
const cv = $('#rain'), ctx = cv.getContext('2d'); let drops = [], rainOn = false, raf;
function sizeRain(){ cv.width = cv.offsetWidth; cv.height = cv.offsetHeight; }
function newDrop(){ return {x:Math.random()*cv.width, y:Math.random()*cv.height, r:2+Math.random()*4, v:.3+Math.random()*1.2, tr:[]}; }
function tickRain(){
  ctx.clearRect(0,0,cv.width,cv.height);
  drops.forEach(d => {
    ctx.fillStyle = 'rgba(200,220,240,.35)'; ctx.beginPath(); ctx.ellipse(d.x,d.y,d.r*.7,d.r,0,0,7); ctx.fill();
    ctx.strokeStyle = 'rgba(200,220,240,.12)'; ctx.lineWidth = d.r*.5; ctx.beginPath(); ctx.moveTo(d.x,d.y); ctx.lineTo(d.x,d.y-d.v*14); ctx.stroke();
    d.y += d.v; if (d.y > cv.height+10){ Object.assign(d, newDrop(), {y:-10}); }
  });
  raf = requestAnimationFrame(tickRain);
}
function rainPage(active){
  cancelAnimationFrame(raf);
  if (!active){ return; }
  sizeRain(); drops = Array.from({length: reduced?12:45}, newDrop);
  if (!reduced) tickRain(); else tickRainStatic();
}
function tickRainStatic(){ ctx.clearRect(0,0,cv.width,cv.height); drops.forEach(d=>{ctx.fillStyle='rgba(200,220,240,.35)';ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,7);ctx.fill();}); }
cv.parentElement.addEventListener('click', e => { // tocar una gota cercana muestra una frase
  const r = cv.getBoundingClientRect(), x = e.clientX-r.left, y = e.clientY-r.top;
  if (e.target.closest('button')) return;
  if (drops.some(d => Math.hypot(d.x-x, d.y-y) < 40)) $('#dropMsg').textContent = RAIN_LINES[Math.floor(Math.random()*RAIN_LINES.length)];
});
// Sonido de lluvia con Web Audio (ruido filtrado) — solo tras pulsar el botón
let ac, rainNode, rainGain;
$('#rainBtn').onclick = function(){
  if (!ac){
    ac = new (window.AudioContext||window.webkitAudioContext)();
    const buf = ac.createBuffer(1, ac.sampleRate*2, ac.sampleRate), data = buf.getChannelData(0);
    for (let i=0;i<data.length;i++) data[i] = Math.random()*2-1;
    rainNode = ac.createBufferSource(); rainNode.buffer = buf; rainNode.loop = true;
    const f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1800;
    rainGain = ac.createGain(); rainGain.gain.value = 0; rainNode.connect(f).connect(rainGain).connect(ac.destination); rainNode.start();
  }
  const on = this.getAttribute('aria-pressed') !== 'true';
  ac.resume(); rainGain.gain.setTargetAtTime(on ? .25 : 0, ac.currentTime, .3);
  this.setAttribute('aria-pressed', on); this.textContent = on ? 'Silenciar la lluvia' : 'Escuchar la lluvia';
};
addEventListener('resize', () => { if (pages[cur].id === 'rainPage') rainPage(true); });

/* ---------- CAP 5: ATARDECER ---------- */
const skyEl = $('#skyPage'), timeIn = $('#time'); let skyRaf;
const STOPS = [[247,201,139,242,160,123],[233,130,120,120,90,140],[24,30,60,40,50,90]]; // día · atardecer · noche
for (let i=0;i<40;i++){ const s=document.createElement('i'); s.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*55}%;animation-delay:${-Math.random()*3}s`; $('#stars').appendChild(s); }
function paintSky(t){ // t: 0..1
  const seg = t<.5 ? 0 : 1, k = (t - seg*.5)*2, a = STOPS[seg], b = STOPS[seg+1];
  const m = i => Math.round(a[i] + (b[i]-a[i])*k);
  skyEl.style.setProperty('--c1', `rgb(${m(0)},${m(1)},${m(2)})`); skyEl.style.setProperty('--c2', `rgb(${m(3)},${m(4)},${m(5)})`);
  $('#sun').style.top = (20 + t*62) + '%'; $('#sun').style.opacity = Math.max(0, 1 - Math.max(0,t-.65)*3);
  const night = Math.max(0, (t-.6)/.4);
  $('#stars').style.opacity = night; $('#moon').style.opacity = night;
  $('#skyPoem').style.color = t>.55 ? '#fdf6dc' : '#fff';
}
function skyPage(active){
  cancelAnimationFrame(skyRaf); if (!active) return;
  let t0 = null; timeIn.value = 0; paintSky(0);
  if (reduced) return;
  const step = ts => { t0 = t0 ?? ts; const t = Math.min(1, (ts-t0)/22000); timeIn.value = t*100; paintSky(t); if (t<1) skyRaf = requestAnimationFrame(step); };
  skyRaf = requestAnimationFrame(step);
}
timeIn.addEventListener('input', () => { cancelAnimationFrame(skyRaf); paintSky(timeIn.value/100); });

/* ---------- CAP 6: MUSEO ---------- */
OBRAS.forEach(([title, poem, desc], i) => {
  const a = document.createElement('article'); a.className = 'obra';
  a.innerHTML = `<small>OBRA ${['I','II','III'][i]}</small><h3>“${title}”</h3><p>${poem}</p><p class="desc"><b>Descripción</b><br>${desc}</p>`;
  $('#gallery').appendChild(a);
});

/* ---------- CAP 7: REPRODUCTOR ---------- */
const audio = $('#audio'), playBtn = $('#playBtn'); let ti = 0;
function loadTrack(i, autoplay){
  ti = i % TRACKS.length; audio.src = TRACKS[ti].src; $('#trackName').textContent = TRACKS[ti].name; $('#seek').value = 0; $('#audioNote').textContent = '';
  if (autoplay) togglePlay(true);
}
function togglePlay(forcePlay){
  if (audio.paused || forcePlay){ audio.play().then(()=>setPlaying(true)).catch(()=>{ setPlaying(false); $('#audioNote').textContent = 'Aún no hay audio: agrega un .mp3 en assets/audio/ y edita TRACKS en script.js.'; }); }
  else { audio.pause(); setPlaying(false); }
}
function setPlaying(on){ playBtn.textContent = on ? '⏸' : '▶'; playBtn.setAttribute('aria-label', on ? 'Pausar' : 'Reproducir'); $('#wave').classList.toggle('on', on); }
playBtn.onclick = () => togglePlay(); $('#nextBtn').onclick = () => loadTrack(ti+1, true);
audio.addEventListener('timeupdate', () => { if (audio.duration) $('#seek').value = audio.currentTime/audio.duration*100; });
audio.addEventListener('ended', () => loadTrack(ti+1, true));
$('#seek').addEventListener('input', e => { if (audio.duration) audio.currentTime = e.target.value/100*audio.duration; });
loadTrack(0, false);
