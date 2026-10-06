// Gilded Hour: slit-to-full hero, word-by-word statement, drawn planning path, parallax gallery.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- inquiry form ---------- */
const form = document.querySelector('.form');
document.querySelectorAll('[data-type]').forEach(a => a.addEventListener('click', () => (form.type.value = a.dataset.type)));
form.addEventListener('submit', e => {
  e.preventDefault();
  const bad = ['names', 'contact'].filter(n => !form[n].value.trim());
  ['names', 'contact'].forEach(n => form[n].setAttribute('aria-invalid', bad.includes(n)));
  form.querySelector('.err').hidden = !bad.length;
  if (bad.length) return form[bad[0]].focus();
  form.querySelector('.done').hidden = false;
});

// statement: wrap each word so it can light up
const words = document.querySelector('.words');
words.innerHTML = words.textContent.split(' ').map(w => `<span>${w}</span>`).join(' ');

// mouse users: the hovered strip opens and stays open (touch layouts stack the strips instead)
if (matchMedia('(hover: hover)').matches) {
  document.querySelector('.strip').classList.add('is-open');
  document.querySelectorAll('.strip').forEach(s => s.addEventListener('mouseenter', () => document.querySelectorAll('.strip').forEach(o => o.classList.toggle('is-open', o === s))));
}

/* ---------- motion ---------- */
if (!reduce && window.gsap) {
  gsap.registerPlugin(ScrollTrigger);
  const nav = document.querySelector('.nav');

  gsap.from('.hero-copy > *', { y: 30, opacity: 0, stagger: .14, duration: 1.1, ease: 'power3.out', delay: .2 });
  gsap.from('.hero-img img', { scale: 1.2, opacity: 0, duration: 1.6, ease: 'power3.out' });

  // hero: the sunset opens out to full-bleed and the type turns white over it
  gsap.timeline({
    scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=110%', pin: true, scrub: 1, onUpdate: s => nav.classList.toggle('on-dark', s.progress > .3 && s.progress < 1) },
  })
    .to('.hero-img', { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' })
    .to('.hero h1', { color: '#fff', ease: 'none', duration: .3 }, .2)
    .to('.hero p', { color: 'rgb(255 255 255 / .88)', ease: 'none', duration: .3 }, .2);

  // statement: words brighten one by one as you scroll through
  gsap.to('.words span', { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '.statement', start: 'top top', end: '+=100%', pin: true, scrub: 1 } });

  gsap.from('.strip', { y: 80, opacity: 0, stagger: .1, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.strips', start: 'top 80%' } });

  // planning path draws as you read down the milestones
  const path = document.querySelector('.path path'), len = path.getTotalLength();
  gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  gsap.to(path, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.path-wrap', start: 'top 65%', end: 'bottom 65%', scrub: true } });
  gsap.utils.toArray('.miles li').forEach((li, i) => gsap.from(li, { x: i % 2 ? 60 : -60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: li, start: 'top 75%' } }));

  // gallery columns drift at different speeds
  [['.g1', -60], ['.g2', -160], ['.g3', -100], ['.g4', -220]].forEach(([s, y]) =>
    gsap.to(s, { y, ease: 'none', scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: true } }));
  gsap.utils.toArray('.g img').forEach(img => gsap.from(img, { scale: 1.25, ease: 'none', scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true } }));

  gsap.from('.quote blockquote > *', { y: 40, opacity: 0, stagger: .15, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.quote', start: 'top 70%' } });
  gsap.from('.form', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.inquire', start: 'top 80%' } });
}
