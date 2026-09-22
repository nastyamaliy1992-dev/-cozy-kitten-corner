export function renderRoomDecor(room){
 const common='<div class="floor-glow"></div>';
 if(room==='kitchen')return `<div class="decor kitchen-decor">${common}<div class="cabinet left"></div><div class="cabinet right"></div><div class="fridge"><div class="fridge-handle"></div></div><div class="counter"><div class="bowl"></div></div></div>`;
 if(room==='bedroom')return `<div class="decor bedroom-decor">${common}<div class="wall-lamp"><span></span></div><div class="bed"><div class="pillow"></div><div class="blanket"></div></div><div class="nightstand"></div></div>`;
 if(room==='bathroom')return `<div class="decor bathroom-decor">${common}<div class="tub"></div><div class="shower"></div><div class="bath-shelf"></div></div>`;
 if(room==='toilet')return `<div class="decor toilet-decor">${common}<div class="litter-box"></div><div class="bath-shelf"></div></div>`;
 if(room==='wardrobe')return `<div class="decor wardrobe-decor">${common}<div class="closet"></div><div class="mirror"></div></div>`;
 if(room==='playroom')return `<div class="decor playroom-decor">${common}<div class="toy-box"></div><div class="play-rug"></div><div class="cat-tree"></div></div>`;
 if(room==='lake')return `<div class="decor lake-decor"><div class="sky"></div><div class="hills"></div><div class="water"></div><div class="dock"></div></div>`;
 return `<div class="decor living-decor">${common}<div class="wall-panel p1"></div><div class="wall-panel p2"></div><div class="sofa"><span></span><span></span></div><div class="plant"><i></i><i></i><i></i><b></b></div><div class="rug"></div></div>`;
}