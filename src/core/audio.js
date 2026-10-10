let ctx=null,timer=null,currentRoom=null,danceStyle='macarena';
const danceMelodies={macarena:[523.25,659.25,783.99,659.25,587.33,523.25],aram:[392,440,523.25,587.33,523.25,440],hiphop:[261.63,311.13,392,349.23,311.13,261.63]};
export function setDanceStyle(style){if(danceMelodies[style])danceStyle=style;}
let musicBus=null,sfxBus=null,voiceBus=null;
let settings={musicEnabled:true,sfxEnabled:true,voiceEnabled:true,musicVolume:.35,sfxVolume:.7,voiceVolume:.65};
const roomNotes={dance:[523.25,659.25,783.99,880,783.99,659.25],living:[261.63,329.63,392],kitchen:[293.66,369.99,440],bathroom:[220,277.18,329.63],toilet:[246.94,311.13,369.99],bedroom:[196,246.94,293.66],wardrobe:[277.18,349.23,415.3],playroom:[329.63,415.3,493.88],school:[392,493.88,587.33,783.99],lake:[174.61,220,261.63],store:[349.23,440,523.25]};
function ensure(){if(ctx)return;ctx=new (window.AudioContext||window.webkitAudioContext)();musicBus=ctx.createGain();sfxBus=ctx.createGain();voiceBus=ctx.createGain();musicBus.connect(ctx.destination);sfxBus.connect(ctx.destination);voiceBus.connect(ctx.destination);applyVolumes()}
function applyVolumes(){if(!ctx)return;musicBus.gain.setTargetAtTime((settings.musicEnabled===false?0:Math.min(1,settings.musicVolume*(currentRoom==='dance'?.96:.62))),ctx.currentTime,.08);sfxBus.gain.setTargetAtTime((settings.sfxEnabled===false?0:settings.sfxVolume*.56),ctx.currentTime,.05);voiceBus.gain.setTargetAtTime((settings.voiceEnabled===false?0:settings.voiceVolume*.56),ctx.currentTime,.05)}
export function configureAudio(next={}){settings={...settings,...next};if(ctx)applyVolumes()}
function tone(freq,dur=.9,vol=.15,type='sine',bus='sfx'){ensure();const o=ctx.createOscillator(),g=ctx.createGain(),out=bus==='music'?musicBus:bus==='voice'?voiceBus:sfxBus;o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(.001,ctx.currentTime);g.gain.linearRampToValueAtTime(vol,ctx.currentTime+.06);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+dur);o.connect(g);g.connect(out);o.start();o.stop(ctx.currentTime+dur)}
export function startRoomMusic(room){ensure();if(ctx.state==='suspended')ctx.resume();if(currentRoom===room&&timer)return;currentRoom=room;applyVolumes();clearInterval(timer);let i=0;const play=()=>{
 const notes=currentRoom==='dance'?danceMelodies[danceStyle]:(roomNotes[currentRoom]||roomNotes.living);
 const a=notes[i%notes.length],b=notes[(i+1)%notes.length];
 if(currentRoom==='dance'){
   // A steady four-beat dance groove, rendered via WebAudio; no external audio file.
   [0,365,730,1095].forEach((ms,beat)=>setTimeout(()=>{
     if(currentRoom!=='dance'||settings.musicEnabled===false)return;
     tone(danceStyle==='hiphop'?(beat%2===0?82:146):(beat%2===0?110:175),.115,danceStyle==='hiphop'?.17:.12,'triangle','music');
     tone(beat%2===0?1960:1450,.055,.024,'sine','music');
   },ms));
   tone(a,.34,danceStyle==='hiphop'?.16:.19,'triangle','music');
   tone(a/2,.23,.10,'sine','music');
   setTimeout(()=>{tone(b,.36,.16,'triangle','music');tone(b/2,.24,.09,'sine','music')},730);
 }else{
   tone(a,1.5,.16,'sine','music');
   setTimeout(()=>tone(b,1.05,.07,'triangle','music'),180);
 }
 i++;
};play();timer=setInterval(play,1450)}
export function stopMusic(){clearInterval(timer);timer=null;currentRoom=null}
export function duckMusic(on=true){ensure();musicBus.gain.setTargetAtTime(on ? .10 : (settings.musicEnabled===false ? 0 : settings.musicVolume*(currentRoom==='dance'?.96:.62)),ctx.currentTime,.12)}
export function sfx(kind){const f={pet:520,feed:620,drink:720,bath:440,toilet:350,play:800,sleep:260,step:330,jump:690,draw:570,cast:460,catch:880,miss:260,coin:980,level:1040}[kind]||500;tone(f,.28,.24,kind==='play'?'triangle':'sine')}
export function purr(duration=2.8){ensure();if(ctx.state==='suspended')ctx.resume();const now=ctx.currentTime,end=now+duration;const carrier=ctx.createOscillator(),harm=ctx.createOscillator(),mod=ctx.createOscillator(),modGain=ctx.createGain(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();carrier.type='sine';carrier.frequency.value=26;harm.type='sine';harm.frequency.value=52;mod.type='sine';mod.frequency.value=22;modGain.gain.value=.055;filter.type='lowpass';filter.frequency.value=135;gain.gain.setValueAtTime(.001,now);gain.gain.linearRampToValueAtTime(.34,now+.18);gain.gain.setValueAtTime(.30,end-.22);gain.gain.linearRampToValueAtTime(.001,end);mod.connect(modGain);modGain.connect(gain.gain);carrier.connect(filter);harm.connect(filter);filter.connect(gain);gain.connect(sfxBus);carrier.start(now);harm.start(now);mod.start(now);carrier.stop(end);harm.stop(end);mod.stop(end)}
function noise(duration=.8,vol=.07,filterFreq=1800){ensure();const len=Math.floor(ctx.sampleRate*duration),buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=buf;filter.type='lowpass';filter.frequency.value=filterFreq;g.gain.value=vol;src.connect(filter);filter.connect(g);g.connect(sfxBus);src.start()}
export function waterSound(){noise(2.2,.16,2600)}
export function fartSound(){tone(92,.16,.20,'sawtooth');setTimeout(()=>tone(64,.24,.16,'sawtooth'),105)}
export function flushSound(){noise(1.4,.22,1100);setTimeout(()=>tone(110,.7,.13),250)}
export function applauseSound(){for(let i=0;i<9;i++)setTimeout(()=>noise(.12,.10,3200),i*105)}
export function eatSound(){for(let i=0;i<4;i++)setTimeout(()=>tone(180+i*22,.12,.12,'triangle'),i*180)}
export function biteSound(){noise(.075,.095,2400);tone(210,.10,.13,'triangle');setTimeout(()=>tone(165,.08,.09,'triangle'),55)}
export function chewSound(){noise(.08,.055,1200);tone(145,.09,.075,'triangle')}
export function swallowSound(){tone(235,.09,.085,'sine');setTimeout(()=>tone(155,.18,.10,'sine'),75)}
export function lickSound(){noise(.11,.035,3200);tone(430,.13,.055,'sine')}
export function meow(kind='want'){const map={food:[420,520],sleep:[350,300],toilet:[480,390],bath:[520,440],play:[620,760],fish:[560,690],happy:[650,820],sad:[390,320],annoyed:[330,430],want:[440,540]};const n=map[kind]||map.want;tone(n[0],.22,.2,'triangle','voice');setTimeout(()=>tone(n[1],.3,.18,'triangle','voice'),170)}
export function happyJingle(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>tone(f,.24,.12,'triangle'),i*115))}
export function splashSound(){noise(.55,.19,2900);setTimeout(()=>noise(.32,.13,2200),190)}
export function bubbleSound(){for(let i=0;i<7;i++)setTimeout(()=>tone(720+i*38,.09,.07,'sine'),i*85)}
export function giggleSound(){[720,850,760,930].forEach((f,i)=>setTimeout(()=>tone(f,.12,.12,'triangle','voice'),i*105))}
export function sadWhimper(){[430,365,310].forEach((f,i)=>setTimeout(()=>tone(f,.26,.11,'triangle','voice'),i*180))}
export function drumSound(){[150,205,150,205,150,260].forEach((f,i)=>setTimeout(()=>{tone(f,.13,.22,'triangle');noise(.07,.05,1000)},i*145))}
export function introTheme(){[392,523,659,784,659,523].forEach((f,i)=>setTimeout(()=>tone(f,.34,.12,'sine','music'),i*260))}
export function glamourJingle(){ // Runway sparkle: a short original fanfare, distinct from other rooms.
 const melody=[523.25,659.25,783.99,1046.5,880,1046.5,1318.51];
 melody.forEach((pitch,i)=>setTimeout(()=>{tone(pitch,.24,.16,i%2?'triangle':'sine','music');if(i===3||i===6)tone(pitch/2,.34,.11,'triangle','sfx')},i*95));
}
export function sleepyChime(){[392,330,262].forEach((f,i)=>setTimeout(()=>tone(f,.5,.08),i*260))}

const sequenceCueMap={
 'eating:feed07':['bite'],'eating:feed08':['chew'],'eating:feed09':['chew'],
 'eating:feed10':['swallow'],'eating:feed11':['lick'],
 'drink:drink04':['water'],'drink:drink05':['drink'],
 'draw:drawStart':['draw'],'draw:drawFirstLine':['draw'],'draw:drawHeart':['draw'],
 'draw:drawOutline':['draw'],'draw:drawColor':['draw'],'draw:drawStars':['draw'],
 'jump:jumping':['jump'],'play:chasing':['play'],'bath:bathStepIn':['splash'],
 'toilet:toiletSitting':['fart'],'toilet:toiletFinished':['flush'],
 'towel:bathStepOut':['splash'],'towel:bathShake':['water'],
 'fishGame:cast':['cast','water'],'fishCatch:biteFish':['splash'],'fishCatch:fishOnHook':['catch']
};
export function sequenceSoundCue(type,stage){return [...(sequenceCueMap[`${type}:${stage}`]||[])]}
export function playSequenceFrameSound(type,stage){
 for(const cue of sequenceSoundCue(type,stage)){
  if(cue==='bite')biteSound();
  else if(cue==='chew')chewSound();
  else if(cue==='swallow')swallowSound();
  else if(cue==='lick')lickSound();
  else if(cue==='water')waterSound();
  else if(cue==='splash')splashSound();
  else if(cue==='fart')fartSound();
  else if(cue==='flush')flushSound();
  else sfx(cue);
 }
}

export function unlockAudio(){ensure();if(ctx?.state==='suspended')return ctx.resume();return Promise.resolve()}
// Prefer the enhanced neural/local female Russian voices already installed on the device.
// Never claim cloud-quality speech: the browser chooses which voices it exposes.
export function speakLuna(text,lang='ru-RU'){
 if(settings.voiceEnabled===false||!text||!('speechSynthesis' in window))return;
 try{
  const synth=window.speechSynthesis;
  const available=synth.getVoices?.()||[];
  const prefix=lang.slice(0,2).toLowerCase();
  const candidates=available.filter(v=>v.lang?.toLowerCase().startsWith(prefix));
  const rank=v=>{
   const name=(v.name||'').toLowerCase();
   return (/enhanced|premium|neural|high quality|улучшенн/.test(name)?100:0)
    +(/milena|алёна|alyona|alena|katya|irina|svetlana|female|сири|siri/.test(name)?40:0)
    -(/compact|low quality|male|yuri|pavel|alexander/.test(name)?70:0)
    +(v.localService?6:0);
  };
  candidates.sort((a,b)=>rank(b)-rank(a));
  const u=new SpeechSynthesisUtterance(text);
  u.lang=lang;u.rate=.94;u.pitch=1.03;
  u.volume=Math.max(0,Math.min(1,settings.voiceVolume??.65));
  if(candidates[0])u.voice=candidates[0];
  u.onstart=()=>duckMusic(true);
  u.onend=()=>duckMusic(false);
  u.onerror=()=>duckMusic(false);
  synth.cancel();synth.speak(u);
 }catch{}
}
