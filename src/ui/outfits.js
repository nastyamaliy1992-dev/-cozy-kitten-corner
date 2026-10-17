// Fitted vector clothes; draw actual garments, not emoji.
const colors=[["#9295d7","#56588e","#ece9ff"],["#c5a2bd","#805b83","#fff0fa"],["#76aeb3","#487983","#d8f7f3"],["#d2b08b","#936d4f","#fff0cb"],["#a8acbc","#686f89","#fff"],["#96aaca","#5d7296","#e2e9ff"]];
export function outfitPalette(item){
 const id=(item?.id||'')+' '+(item?.name||'');
 if(/moon|лун|фиолет|звёзд|звезд|лаванд/i.test(id))return colors[0];
 if(/плать|принцесс|серд|розов/i.test(id))return colors[1];
 if(/джинс|космо|сер|костюм/i.test(id))return colors[4];
 let hash=0;for(const c of id)hash=(hash*33+c.charCodeAt(0))>>>0;
 return colors[hash%colors.length];
}
function outfitShapes(slot,item,c,id){
 const [a,b,light]=c,fill=`url(#${id}-cloth)`,name=(item?.name||'').toLowerCase();
 if(slot==='body'){
  const dress=/плать|принцесс|юбк|фея/.test(name),hoodie=/худи|капюшон/.test(name),pajama=/пижам|звёзд|лун/.test(name),suit=/костюм|супер-кот/.test(name);
  const sleeves=`<path d="M121 225Q99 221 94 242L80 271Q89 284 110 278L127 248Z" fill="${fill}" stroke="${b}" stroke-width="3"/><path d="M179 225Q201 221 206 242L220 271Q211 284 190 278L173 248Z" fill="${fill}" stroke="${b}" stroke-width="3"/>`;
  const torso=`<path d="M121 223Q150 234 179 223Q188 233 193 253L190 312Q151 320 110 312L107 253Q112 233 121 223Z" fill="${fill}" stroke="${b}" stroke-width="3"/><path d="M120 227Q150 242 180 227L162 249H138Z" fill="${light}" opacity=".76"/>`;
  const skirt=dress?`<path d="M112 281Q104 303 88 336Q150 351 212 336Q196 303 188 281Z" fill="${fill}" stroke="${b}" stroke-width="3"/><path d="M97 331Q150 340 203 331" fill="none" stroke="${light}" stroke-width="5"/>`:`<path d="M111 303Q150 314 189 303" fill="none" stroke="${light}" stroke-width="4" stroke-linecap="round"/>`;
  const detail=hoodie?`<path d="M118 224Q150 202 182 224L168 248Q150 236 132 248Z" fill="${b}" stroke="${light}" stroke-width="3"/><path d="M143 249v29m14-29v29" stroke="${light}" stroke-width="2"/>`:suit?`<path d="M126 233l24 36 24-36-8 45h-32z" fill="${light}"/><path d="M145 263l5 22 5-22-5-8z" fill="${b}"/>`:pajama?`<path d="M150 252l5 8 9 2-7 7 2 9-9-4-9 4 2-9-7-7 9-2z" fill="${light}"/><circle cx="150" cy="298" r="4" fill="${light}"/>`:`<path d="M143 253v51" stroke="${light}" stroke-width="3"/><rect x="122" y="283" width="56" height="19" rx="7" fill="none" stroke="${light}" stroke-width="2"/>`;
  return sleeves+torso+skirt+detail;
 }
 if(slot==='head')return /корон/.test(name)?`<path d="M94 104l-9-48 37 21 28-42 28 42 37-21-9 48z" fill="${fill}" stroke="${light}" stroke-width="4"/><ellipse cx="150" cy="104" rx="58" ry="8" fill="${b}"/><circle cx="150" cy="74" r="8" fill="${light}"/>`:`<path d="M92 108Q92 59 150 59Q208 59 208 108Z" fill="${fill}" stroke="${b}" stroke-width="4"/><ellipse cx="150" cy="107" rx="68" ry="13" fill="${a}" stroke="${b}" stroke-width="3"/><path d="M108 90Q150 79 191 90" fill="none" stroke="${light}" stroke-width="5"/>`;
 if(slot==='eyes')return `<g fill="none" stroke="${b}" stroke-width="7"><ellipse cx="111" cy="157" rx="31" ry="25"/><ellipse cx="189" cy="157" rx="31" ry="25"/><path d="M142 157q8-7 16 0M80 152l-12-7M220 152l12-7"/></g><g fill="${light}" opacity=".08"><ellipse cx="111" cy="157" rx="28" ry="21"/><ellipse cx="189" cy="157" rx="28" ry="21"/></g>`;
 if(slot==='neck')return `<path d="M118 207Q150 224 182 207L177 223Q150 235 123 223Z" fill="${fill}" stroke="${light}" stroke-width="3"/><path d="M150 225l-9 10 9 11 9-11z" fill="${light}" stroke="${b}" stroke-width="2"/>`;
 if(slot==='feet')return `<path d="M101 355Q78 344 71 362Q64 382 83 388L130 389Q142 384 135 371L125 354Z" fill="${fill}" stroke="${light}" stroke-width="3"/><path d="M177 354Q164 371 167 381Q172 391 224 388Q238 381 228 362Q211 344 199 355Z" fill="${fill}" stroke="${light}" stroke-width="3"/><path d="M77 378h54m45 0h50" stroke="${light}" stroke-width="4"/>`;
 if(slot==='accessory')return `<rect x="203" y="238" width="46" height="70" rx="15" fill="${fill}" stroke="${light}" stroke-width="4"/><path d="M212 241q8-23 27 0" fill="none" stroke="${light}" stroke-width="5"/><rect x="208" y="260" width="35" height="20" rx="5" fill="${a}" stroke="${light}" stroke-width="2"/>`;
 return '';
}
export function outfitLayer(slot,item){
 if(!item||!['body','head','neck','eyes','feet','accessory'].includes(slot))return '';
 const id='ck-'+String(item.id||'outfit').replace(/[^a-z0-9_-]/gi,'')+'-'+slot;
 const c=outfitPalette(item);
 const safe=String(item.id||'').replace(/[&<>"']/g,k=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[k]));
 return `<svg class="luna-outfit-svg outfit-slot-${slot}" viewBox="0 0 300 400" preserveAspectRatio="none" aria-hidden="true" data-wear-id="${safe}"><defs><linearGradient id="${id}-cloth" x1="0" y1="0" x2=".85" y2="1"><stop stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><g stroke-linejoin="round" stroke-linecap="round">${outfitShapes(slot,item,c,id)}</g></svg>`;
}
