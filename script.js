(function(){
  const chapters = REASONS_DATA;
  const main = document.getElementById('main');

  function renderText(t){
    // italicize quoted filipino words for warmth
    return t.replace(/"([^"]+)"/g, '<span class="quoteword">&ldquo;$1&rdquo;</span>');
  }

  chapters.forEach(ch => {
    const section = document.createElement('section');
    section.className = 'chapter';
    section.id = 'chapter-' + ch.roman;

    const first = ch.items[0].n, last = ch.items[ch.items.length-1].n;
    section.innerHTML = `
      <div class="chapter-head">
        <span class="chapter-roman">${ch.roman}</span>
        <h2 class="chapter-title">${ch.title}</h2>
        <span class="chapter-range">${first}&ndash;${last}</span>
      </div>
      <ul class="reason-list"></ul>
    `;

    const list = section.querySelector('.reason-list');
    ch.items.forEach(it => {
      const li = document.createElement('li');
      li.className = 'reason';
      li.dataset.n = it.n;
      li.innerHTML = `<span class="reason-num">${String(it.n).padStart(3,'0')}</span><span class="reason-text">${renderText(it.t)}</span>`;
      list.appendChild(li);
    });

    main.appendChild(section);
  });

  // finale content (items 500 & 501 rendered separately, already customized in data)
  const last = chapters[chapters.length-1].items;
  document.getElementById('finale500').innerHTML = '<span class="reason-num" style="margin-right:8px;">500</span>' + renderText(last[0].t);
  document.getElementById('finale501').textContent = last[1].t;

  // reveal-on-scroll for reason rows
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

  document.querySelectorAll('.reason').forEach(el => io.observe(el));

  // tally counter driven by scroll position of the highest-visible item
  const fill = document.getElementById('tallyFill');
  const countEl = document.getElementById('tallyCurrent');
  const allReasons = Array.from(document.querySelectorAll('.reason'));
  const finale = document.getElementById('finale');

  let ticking = false;
  function updateTally(){
    ticking = false;
    const viewLine = window.innerHeight * 0.5;
    let current = 0;

    // binary-ish scan is unnecessary at this size; simple pass is fine
    for(let i=0;i<allReasons.length;i++){
      const r = allReasons[i].getBoundingClientRect();
      if(r.top < viewLine){
        current = parseInt(allReasons[i].dataset.n, 10);
      } else {
        break;
      }
    }

    const finaleRect = finale.getBoundingClientRect();
    if(finaleRect.top < viewLine) current = 501;

    countEl.textContent = current;
    fill.style.width = Math.min(100, (current/501)*100) + '%';
  }

  window.addEventListener('scroll', () => {
    if(!ticking){ requestAnimationFrame(updateTally); ticking = true; }
  }, { passive:true });
  window.addEventListener('resize', updateTally);
  updateTally();
})();
