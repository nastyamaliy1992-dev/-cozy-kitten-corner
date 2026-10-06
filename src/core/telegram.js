export function initTelegram(){
 const tg=window.Telegram?.WebApp;if(!tg)return{available:false,user:null,initData:null};
 try{tg.ready();tg.expand();tg.setHeaderColor?.('#171522');tg.setBackgroundColor?.('#171522')}catch{}
 const user=tg.initDataUnsafe?.user||null;
 return{available:true,user,initData:tg.initData||null,verified:false};
}
export function bindTelegramBack(handler){const b=window.Telegram?.WebApp?.BackButton;if(!b)return;try{b.show();b.onClick(handler)}catch{}}
export function haptic(kind='light'){try{window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(kind)}catch{}}
export function safeInsets(){const tg=window.Telegram?.WebApp;return{top:tg?.safeAreaInset?.top||0,bottom:tg?.safeAreaInset?.bottom||0}}

export function telegramContext(){const tg=window.Telegram?.WebApp;return {platform:tg?.platform||'web',version:tg?.version||null,colorScheme:tg?.colorScheme||'dark',isExpanded:!!tg?.isExpanded}}
export function openTelegramInvoice(url,callback){const tg=window.Telegram?.WebApp;if(!tg?.openInvoice)return false;try{tg.openInvoice(url,callback);return true}catch{return false}}


export function openBotPurchase(itemId){
 const tg=window.Telegram?.WebApp;
 const url=`https://t.me/CozyKittenCornerBot?start=buy_${encodeURIComponent(itemId)}`;
 try{
   if(tg?.openTelegramLink){tg.openTelegramLink(url);return true}
   window.location.href=url;return true
 }catch{return false}
}

export function readTelegramPurchaseGrant(){
 const tg=window.Telegram?.WebApp;
 if(!tg?.initDataUnsafe?.user?.id)return null;
 const p=new URLSearchParams(location.search);
 const item=p.get('grant'),receipt=p.get('receipt');
 if(!item||!receipt)return null;
 return{item,receipt,userId:String(tg.initDataUnsafe.user.id)};
}

export function clearTelegramPurchaseGrant(){
 try{
   const u=new URL(location.href);
   u.searchParams.delete('grant');u.searchParams.delete('receipt');
   history.replaceState(null,'',u.pathname+(u.search?u.search:'')+u.hash);
 }catch{}
}
