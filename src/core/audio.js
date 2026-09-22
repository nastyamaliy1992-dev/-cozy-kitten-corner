let ctx=null,master=null,timer=null,currentRoom=null;
const roomNotes={living:[261.63,329.63,392],kitchen:[293.66,369.99,440],bathroom:[220,277.18,329.63],toilet:[246.94,311.13,369.99],bedroom:[196,246.94,293.66],wardrobe:[277.18,349.23,415.3],playroom:[329.63,415.3,493.88],lake:[174.61,220,261.63]};
function ensure(){if(ctx)return;ctx=new (window.AudioContext||window.webkitAudioContext)();master=ctx.createGain();master.gain.value=.035;master.connect(ctx.destination)}
function tone(freq,dur=.9,vol=.15,type='sine'){ensure();const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(0,ctx.currentTime);g.gain.linearRampToValueAtTime(vol,ctx.currentTime+.08);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+dur);o.connect(g);g.connect(master);o.start();o.stop(ctx.currentTime+dur)}
export function startRoomMusic(room){ensure();if(ctx.state==='suspended')ctx.resume();if(currentRoom===room&&timer)return;currentRoom=room;clearInterval(timer);let i=0;const play=()=>{const notes=roomNotes[currentRoom]||roomNotes.living;tone(notes[i++%notes.length],1.7,.09,'sine')};play();timer=setInterval(play,1900)}
export function stopMusic(){clearInterval(timer);timer=null}
export function sfx(kind){const f={pet:520,feed:620,drink:720,bath:440,toilet:350,play:800,sleep:260}[kind]||500;tone(f,.28,.24,kind==='play'?'triangle':'sine')}
export function speak(text){if(!('speechSynthesis'in window))return;window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ru-RU';u.pitch=1.55;u.rate=.92;u.volume=.42;window.speechSynthesis.speak(u)}

export function purr(duration=2.4){ensure();if(ctx.state==='suspended')ctx.resume();const end=ctx.currentTime+duration;const o=ctx.createOscillator(),g=ctx.createGain(),lfo=ctx.createOscillator(),lg=ctx.createGain();o.type='sawtooth';o.frequency.value=27;lfo.frequency.value=23;lg.gain.value=.045;lfo.connect(lg);lg.connect(g.gain);g.gain.value=.055;o.connect(g);g.connect(master);o.start();lfo.start();g.gain.setValueAtTime(.01,ctx.currentTime);g.gain.linearRampToValueAtTime(.09,ctx.currentTime+.2);g.gain.linearRampToValueAtTime(.01,end);o.stop(end);lfo.stop(end)}

function noise(duration=.8,vol=.07,filterFreq=1800){ensure();const len=Math.floor(ctx.sampleRate*duration),buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),g=ctx.createGain();src.buffer=buf;filter.type='lowpass';filter.frequency.value=filterFreq;g.gain.value=vol;src.connect(filter);filter.connect(g);g.connect(master);src.start()}
export function waterSound(){noise(2.2,.16,2600)}
export function flushSound(){noise(1.4,.22,1100);setTimeout(()=>tone(110,.7,.13,'sine'),250)}
export function eatSound(){for(let i=0;i<4;i++)setTimeout(()=>tone(180+i*22,.12,.12,'triangle'),i*180)}
export function meow(kind='want'){const map={food:[420,520],sleep:[350,300],toilet:[480,390],bath:[520,440],play:[620,760],fish:[560,690],want:[440,540]};const n=map[kind]||map.want;tone(n[0],.22,.2,'triangle');setTimeout(()=>tone(n[1],.3,.18,'triangle'),170)}
