// Pencil drawing is visible in the playroom and saved in Luna's gallery.
export function drawingPaper(className='drawing-paper'){
 return `<svg class="${className}" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-label="Рисунок Луны: сердечко и звёзды">
 <defs><linearGradient id="paperBg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fffdf4"/><stop offset="1" stop-color="#f7eedf"/></linearGradient></defs>
 <rect x="10" y="10" width="220" height="220" rx="10" fill="url(#paperBg)" stroke="#d7bfa1" stroke-width="3"/>
 <path d="M30 52h179M30 85h179M30 118h179M30 151h179M30 184h179" stroke="#a3c9d9" stroke-opacity=".32" stroke-width="2"/>
 <path class="drawing-stroke" d="M120 185C103 166 55 131 57 101C60 58 106 65 120 98C135 65 183 59 185 102C189 132 140 171 120 185Z" fill="#f7b9d1" fill-opacity=".74" stroke="#d95b89" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"/>
 <path class="drawing-star star1" d="M54 54l6 12 13 2-10 9 2 13-11-7-11 7 2-13-10-9 13-2z" fill="#f1c96b" stroke="#c18c39" stroke-width="2"/>
 <path class="drawing-star star2" d="M195 168l5 9 11 1-8 8 2 11-10-5-10 5 2-11-8-8 11-1z" fill="#9c9ad9" stroke="#6867b2" stroke-width="2"/>
 <path d="M102 208q18 7 36 0" fill="none" stroke="#a48a98" stroke-width="2" stroke-linecap="round"/>
 </svg>`;
}
export function drawingGallery(state){
 const count=state?.progress?.drawings?.length||0;
 return `<div class="game-panel drawing-gallery"><div class="panel-head"><b>🎨 Рисунки Луны</b><button data-close-panel aria-label="Закрыть галерею">×</button></div><p>Луна нарисовала и сохранила ${count} ${count===1?'рисунок':count<5?'рисунка':'рисунков'}!</p><div class="drawing-gallery-art">${drawingPaper('drawing-paper gallery-paper')}<span>Лунное сердечко ✨</span></div><button class="drawing-again" data-play-action="draw">🎨 Нарисовать ещё</button></div>`;
}
