export function renderRoomDecor(room) {
  if (room === 'kitchen') {
    return `
      <div class="decor kitchen-decor">
        <div class="cabinet left"></div><div class="cabinet right"></div>
        <div class="fridge"><div class="fridge-handle"></div><div class="fridge-light"></div></div>
        <div class="counter"><div class="bowl"></div></div>
      </div>`;
  }

  if (room === 'bedroom') {
    return `
      <div class="decor bedroom-decor">
        <div class="wall-lamp"><span></span></div>
        <div class="bed"><div class="pillow"></div><div class="blanket"></div></div>
        <div class="nightstand"><div class="lamp-glow"></div></div>
      </div>`;
  }

  return `
    <div class="decor living-decor">
      <div class="wall-panel p1"></div><div class="wall-panel p2"></div>
      <div class="sofa"><span></span><span></span></div>
      <div class="plant"><i></i><i></i><i></i><b></b></div>
      <div class="rug"></div>
    </div>`;
}