export function renderPet({ sleeping = false, mood = 80 }) {
  const happy = mood >= 70;
  return `
    <div class="pet-stage ${sleeping ? 'is-sleeping' : ''}" aria-label="Котёнок">
      <svg class="kitten" viewBox="0 0 420 560" role="img" aria-label="Серо-белый котёнок">
        <defs>
          <radialGradient id="furFace" cx="50%" cy="56%" r="65%">
            <stop offset="0%" stop-color="#f5f2ef"/>
            <stop offset="42%" stop-color="#d9d9dd"/>
            <stop offset="100%" stop-color="#8d9098"/>
          </radialGradient>
          <linearGradient id="furBody" x1="0" x2="1">
            <stop offset="0%" stop-color="#8f9299"/>
            <stop offset="44%" stop-color="#f4f0ec"/>
            <stop offset="64%" stop-color="#ece8e5"/>
            <stop offset="100%" stop-color="#858992"/>
          </linearGradient>
          <radialGradient id="eye" cx="42%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#fff"/>
            <stop offset="7%" stop-color="#11151a"/>
            <stop offset="37%" stop-color="#68d5c4"/>
            <stop offset="72%" stop-color="#2d807c"/>
            <stop offset="100%" stop-color="#0c2324"/>
          </radialGradient>
          <filter id="shadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="18" stdDeviation="14" flood-color="#11101c" flood-opacity=".55"/>
          </filter>
        </defs>

        <g filter="url(#shadow)" class="pet-body-group">
          <path class="tail-svg" d="M316 356c66 6 84 68 34 96-27 15-62 0-57-20 5-17 35-6 45-19 18-24-10-39-32-41z" fill="#858991"/>
          <ellipse cx="210" cy="390" rx="108" ry="131" fill="url(#furBody)"/>
          <ellipse cx="173" cy="492" rx="43" ry="25" fill="#e7e5e3"/>
          <ellipse cx="247" cy="492" rx="43" ry="25" fill="#e7e5e3"/>

          <path class="ear-left" d="M100 124L126 28l79 82z" fill="#94979e"/>
          <path d="M121 101l12-49 42 50z" fill="#e5aab6" opacity=".9"/>
          <path class="ear-right" d="M315 124L289 28l-79 82z" fill="#94979e"/>
          <path d="M294 101l-12-49-42 50z" fill="#e5aab6" opacity=".9"/>

          <ellipse cx="208" cy="191" rx="132" ry="118" fill="url(#furFace)"/>
          <path d="M135 170c22-20 44-20 65-2" stroke="#767a82" stroke-width="8" stroke-linecap="round" fill="none" opacity=".55"/>
          <path d="M217 168c23-20 45-19 66 2" stroke="#767a82" stroke-width="8" stroke-linecap="round" fill="none" opacity=".55"/>

          <g class="eyes">
            <ellipse cx="154" cy="190" rx="39" ry="49" fill="url(#eye)"/>
            <ellipse cx="262" cy="190" rx="39" ry="49" fill="url(#eye)"/>
            <ellipse cx="142" cy="171" rx="9" ry="12" fill="#fff" opacity=".9"/>
            <ellipse cx="250" cy="171" rx="9" ry="12" fill="#fff" opacity=".9"/>
          </g>

          <path d="M195 238q14-13 28 0-3 20-14 20t-14-20z" fill="#ef9aaa"/>
          <path d="M208 258c-1 14-13 19-24 20m24-20c1 14 13 19 24 20" stroke="#6b5a63" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path class="mouth" d="${happy ? 'M186 281q22 18 44 0' : 'M190 288q18-8 36 0'}" stroke="#6d5b64" stroke-width="4" fill="none" stroke-linecap="round"/>

          <path d="M129 255l-53-10m56 26l-58 5m211-20l53-10m-55 27l58 6" stroke="#d7d3d3" stroke-width="3" stroke-linecap="round"/>

          <path d="M132 315q77 33 155 0" stroke="#6256a8" stroke-width="17" fill="none" stroke-linecap="round"/>
          <g class="tag">
            <circle cx="210" cy="336" r="18" fill="#7c6bd0"/>
            <path d="M201 332c0-9 11-12 17-4 6-8 17-5 17 4 0 10-17 20-17 20s-17-10-17-20z" transform="translate(-8 -3) scale(.75)" fill="#d9d1ff"/>
          </g>
        </g>
      </svg>
      ${sleeping ? '<div class="sleep-z">Z <span>z</span></div>' : ''}
    </div>
  `;
}