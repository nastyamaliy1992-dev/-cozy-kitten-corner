// School is a self-contained, offline mini-game. Coin purchases are in-game only.
export const LESSONS = [
 {id:'math',title:'Математика',icon:'🔢',level:1,price:0,description:'Сложение и вычитание до десяти',
  questions:[
   {prompt:'2 + 3 = ?',answers:['4','5','6'],correct:1,explain:'Два яблока и ещё три — всего пять!'},
   {prompt:'7 − 2 = ?',answers:['6','4','5'],correct:2,explain:'Из семи убираем два: остаётся пять.'},
   {prompt:'4 + 4 = ?',answers:['7','8','9'],correct:1,explain:'Четыре и четыре — восемь.'}]},
 {id:'reading',title:'Буквы и слова',icon:'📖',level:3,price:160,description:'Узнаём буквы и собираем слова',
  questions:[
   {prompt:'Какая первая буква слова КОТ?',answers:['К','Т','О'],correct:0,explain:'КОТ начинается с буквы К.'},
   {prompt:'Найди слово «ЛУНА»',answers:['ЛИНА','ЛУНА','ЛАНА'],correct:1,explain:'Верно! Л-У-Н-А.'},
   {prompt:'Сколько букв в слове МЯУ?',answers:['2','4','3'],correct:2,explain:'Три буквы: М, Я и У.'}]},
 {id:'logic',title:'Логика и фигуры',icon:'🧩',level:5,price:220,description:'Формы, цвета и простые закономерности',
  questions:[
   {prompt:'Что идёт дальше: ⭐ 🌙 ⭐ 🌙 ⭐ ?',answers:['⭐','🌙','☀️'],correct:1,explain:'Звезда и луна повторяются по очереди.'},
   {prompt:'Сколько углов у треугольника?',answers:['3','4','0'],correct:0,explain:'У треугольника три угла.'},
   {prompt:'Что лишнее: 🟦 🟦 🟠 🟦 ?',answers:['первый квадрат','круг','последний квадрат'],correct:1,explain:'Круг отличается от квадратов.'}]}
];
export function getLesson(id){return LESSONS.find(x=>x.id===id)}
export function ensureSchool(s){s.school??={unlocked:[],completed:{},active:null,rewards:{}};s.school.unlocked??=[];s.school.completed??={};s.school.rewards??={};return s.school}
export function lessonUnlocked(state,id){const l=getLesson(id);return !!l&&(l.level<=state.economy.level||!!state.school?.unlocked?.includes(id))}
export function unlockLesson(s,id){const n=structuredClone(s),l=getLesson(id),k=ensureSchool(n);if(!l)return{state:n,ok:false,reason:'missing'};if(lessonUnlocked(n,id))return{state:n,ok:true,already:true};if(n.economy.coins<l.price)return{state:n,ok:false,reason:'coins'};n.economy.coins-=l.price;k.unlocked.push(id);return{state:n,ok:true}}
export function startLesson(s,id){const n=structuredClone(s),l=getLesson(id),k=ensureSchool(n);if(!l)return{state:n,ok:false,reason:'missing'};if(!lessonUnlocked(n,id))return{state:n,ok:false,reason:'locked'};k.active={id,index:0,mistakes:0,startedAt:Date.now()};return{state:n,ok:true}}
export function answerLesson(s,answerIndex){const n=structuredClone(s),k=ensureSchool(n),a=k.active,l=getLesson(a?.id);if(!a||!l)return{state:n,ok:false,reason:'inactive'};const question=l.questions[a.index];if(!question)return{state:n,ok:false,reason:'finished'};if(!Number.isInteger(answerIndex)||answerIndex<0||answerIndex>=question.answers.length)return{state:n,ok:false,reason:'answer'};const correct=answerIndex===question.correct;
 if(!correct){a.mistakes++;return{state:n,ok:true,correct:false,finished:false,explain:'Попробуй ещё! Посчитаем вместе.'}}
 a.index++;
 if(a.index<l.questions.length)return{state:n,ok:true,correct:true,finished:false,explain:question.explain};
 const mistakes=a.mistakes;
 k.completed[l.id]=(k.completed[l.id]||0)+1;
 const today=new Date().toISOString().slice(0,10),firstToday=k.rewards[l.id]!==today;
 const coins=firstToday?(mistakes===0?45:30):5;
 const xp=firstToday?(mistakes===0?30:20):3;
 n.economy.coins+=coins;n.economy.xp+=xp;
 n.needs.mood=Math.min(100,n.needs.mood+8);
 k.rewards[l.id]=today;k.active=null;
 return{state:n,ok:true,correct:true,finished:true,coins,xp,explain:question.explain};
}
