// Native DOM/Web Animations mini-game: ball bounces, yarn rolls; Luna runs, catches and returns.
export async function animateToyChase(scene,kind,round,{reduceMotion=false}={}){
 if(!scene)throw Error('Missing playroom scene');
 const positions=[68,28,73,34,62,42];
 const target=positions[(round+((kind==='yarn')?2:0))%positions.length];
 const left=50,delta=(target-left)*scene.clientWidth/100,side=delta<0?-1:1;
 const base='./assets/';
 const layer=document.createElement('div');
 layer.className='toy-chase-layer';
 layer.setAttribute('aria-label',kind==='ball'?'Луна бежит за мячиком':'Луна бежит за клубком');
 layer.innerHTML=`<span class="toy-chase-shadow"></span><img class="toy-chase-cat" src="${base}luna/hall/luna-main-clean.png" alt="Луна бежит и ловит"><img class="toy-chase-object" src="${base}toys/${kind==='yarn'?'yarn':'ball'}.svg" alt=""><span class="toy-chase-sparkles" aria-hidden="true">✦ ✨ ✦</span>${kind==='yarn'?'<span class="toy-chase-thread"></span>':''}`;
 scene.appendChild(layer);
 const cat=layer.querySelector('.toy-chase-cat'),toy=layer.querySelector('.toy-chase-object'),sparks=layer.querySelector('.toy-chase-sparkles');
 const shadow=layer.querySelector('.toy-chase-shadow');
 const catStart='translateX(-50%) translateY(0) scaleX(1)';
 const move= (element,frames,duration,easing='ease-in-out')=>{
  if(reduceMotion||!element.animate)return null;
  const anim=element.animate(frames,{duration,easing,fill:'forwards'});
  return anim;
 };
 const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 try{
  const flight=reduceMotion?260:850,run=reduceMotion?300:1020;
  toy.style.left='50%';
  toy.style.bottom='14%';
  toy.style.opacity='1';
  const top=kind==='ball'?'-115px':'-38px';
  move(toy,[{transform:'translateX(-50%) translateY(0) rotate(0deg)',left:'50%'},
    {transform:`translateX(-50%) translateY(${top}) rotate(${kind==='ball'?190:110}deg)`,left:(50+target)/2+'%'},
    {transform:`translateX(-50%) translateY(-4px) rotate(${kind==='ball'?365:245}deg)`,left:target+'%'}],flight,'cubic-bezier(.3,.04,.55,1)');
  await sleep(flight);
  toy.style.left=target+'%';toy.style.transform='translateX(-50%)';toy.style.bottom='14%';
  cat.src=base+'luna/hall/luna-idle-tail-clean.png';
  move(cat,[
   {transform:catStart,offset:0},
   {transform:`translateX(calc(-50% + ${delta*.18}px)) translateY(-12px) scaleX(${side}) rotate(-2deg)`,offset:.22},
   {transform:`translateX(calc(-50% + ${delta*.43}px)) translateY(-1px) scaleX(${side}) rotate(2deg)`,offset:.48},
   {transform:`translateX(calc(-50% + ${delta*.72}px)) translateY(-13px) scaleX(${side}) rotate(-2deg)`,offset:.78},
   {transform:`translateX(calc(-50% + ${delta}px)) translateY(0) scaleX(${side})`,offset:1}
  ],run,'cubic-bezier(.42,.05,.38,1)');
  move(shadow,[{transform:'translateX(-50%)',left:'50%'},{transform:'translateX(-50%)',left:target+'%'}],run);
  await sleep(run);
  cat.src=base+'luna/hall/luna-wave-clean.png';
  sparks.style.left=target+'%';sparks.classList.add('active');
  toy.style.left=target+'%';
  toy.style.opacity='.95';
  move(toy,[{transform:'translate(-50%,-5px) scale(1)'},{transform:'translate(-50%,-75px) scale(.45)',opacity:0}],380);
  await sleep(reduceMotion?200:430);
  toy.style.opacity='0';
  cat.src=base+'luna/hall/luna-main-clean.png';
  move(cat,[{transform:`translateX(calc(-50% + ${delta}px)) scaleX(${-side})`},{transform:'translateX(-50%) scaleX(1)'}],reduceMotion?300:700,'ease-in-out');
  await sleep(reduceMotion?310:710);
 }finally{
  layer.remove();
 }
}
