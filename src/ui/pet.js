export function renderPet({ sleeping = false } = {}) {
  return `
    <div class="pet-stage ${sleeping ? 'is-sleeping' : ''}" aria-label="Luna">
      <div class="luna-photo-wrap">
        <img class="luna-photo" src="./assets/luna-main.png" alt="Пушистый серо-белый котёнок Luna" draggable="false">
      </div>
      ${sleeping ? '<div class="sleep-z">Z <span>z</span></div>' : ''}
    </div>
  `;
}