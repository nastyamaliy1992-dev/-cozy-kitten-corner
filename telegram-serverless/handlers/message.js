import { api } from 'sdk';

const APP_URL='https://nastyamaliy1992-dev.github.io/-cozy-kitten-corner/';
const ITEM_ID='premium_starlight';
const PAYLOAD='cozy:premium_starlight:v1';
const PRICE=49;

async function sendWelcome(chatId){
  await api.sendMessage({
    chat_id:chatId,
    text:'🐾 Привет! Добро пожаловать в Cozy Kitten Corner. Луна уже ждёт тебя 💜',
    reply_markup:{inline_keyboard:[[{text:'🐱 Играть с Луной',web_app:{url:APP_URL}}]]}
  });
}

async function sendPremiumInvoice(chatId){
  await api.sendInvoice({
    chat_id:chatId,
    title:'Звёздный ошейник',
    description:'Редкий ошейник для Луны в Cozy Kitten Corner',
    payload:PAYLOAD,
    currency:'XTR',
    prices:[{label:'Звёздный ошейник',amount:PRICE}]
  });
}

export default async function(message){
  const chatId=message?.chat?.id;
  if(!chatId)return;

  const payment=message.successful_payment;
  if(payment){
    const ok=payment.currency==='XTR'&&payment.total_amount===PRICE&&payment.invoice_payload===PAYLOAD;
    if(!ok){
      await api.sendMessage({chat_id:chatId,text:'Платёж получен, но товар не удалось определить. Напиши /paysupport.'});
      return;
    }
    const receipt=encodeURIComponent(payment.telegram_payment_charge_id||'');
    const url=`${APP_URL}?grant=${ITEM_ID}&receipt=${receipt}`;
    await api.sendMessage({
      chat_id:chatId,
      text:'⭐ Оплата прошла успешно! Звёздный ошейник уже готов для Луны.',
      reply_markup:{inline_keyboard:[[{text:'✨ Вернуться в игру и получить предмет',web_app:{url}}]]}
    });
    return;
  }

  const text=(message.text||'').trim();
  if(text.startsWith('/start buy_'+ITEM_ID)){await sendPremiumInvoice(chatId);return}
  if(text==='/buy' || text==='/buy '+ITEM_ID){await sendPremiumInvoice(chatId);return}
  if(text.startsWith('/paysupport')){
    await api.sendMessage({chat_id:chatId,text:'💳 Поддержка по оплате Cozy Kitten Corner. Опиши проблему с покупкой и приложи время платежа.'});
    return;
  }
  if(text.startsWith('/help')){
    await api.sendMessage({chat_id:chatId,text:'🐾 Нажми «Играть с Луной», чтобы открыть Cozy Kitten Corner. По вопросам оплаты используй /paysupport.'});
    return;
  }
  if(text.startsWith('/play')){await sendWelcome(chatId);return}
  if(text.startsWith('/start')){await sendWelcome(chatId);return}
}
