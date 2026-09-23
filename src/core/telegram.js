export function initTelegram(){
 const tg=window.Telegram?.WebApp;if(!tg)return{available:false,user:null,initData:null};
 try{tg.ready();tg.expand();tg.setHeaderColor?.('#171522');tg.setBackgroundColor?.('#171522')}catch{}
 const user=tg.initDataUnsafe?.user||null;
 return{available:true,user,initData:tg.initData||null,verified:false};
}
export function bindTelegramBack(handler){const b=window.Telegram?.WebApp?.BackButton;if(!b)return;try{b.show();b.onClick(handler)}catch{}}
export function haptic(kind='light'){try{window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(kind)}catch{}}
export function safeInsets(){const tg=window.Telegram?.WebApp;return{top:tg?.safeAreaInset?.top||0,bottom:tg?.safeAreaInset?.bottom||0}}
