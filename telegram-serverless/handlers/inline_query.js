import { api } from 'sdk';

const APP_URL='https://nastyamaliy1992-dev.github.io/-cozy-kitten-corner/';

export default async function(query){
  if(!query?.id)return;

  await api.answerInlineQuery({
    inline_query_id:query.id,
    cache_time:5,
    is_personal:true,
    button:{
      text:'🐱 Открыть Cozy Kitten Corner',
      web_app:{url:APP_URL}
    },
    results:[{
      type:'article',
      id:'cozy-kitten-corner-play',
      title:'🐱 Играть с Луной',
      description:'Открыть Cozy Kitten Corner',
      input_message_content:{
        message_text:'🐾 Луна ждёт тебя в Cozy Kitten Corner 💜'
      },
      reply_markup:{
        inline_keyboard:[[
          {text:'🐱 Открыть игру',url:'https://t.me/CozyKittenCornerBot?startapp=play'}
        ]]
      }
    }]
  });
}
