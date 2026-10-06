import { api } from 'sdk';

const PAYLOAD='cozy:premium_starlight:v1';
const PRICE=49;

export default async function(query){
  const ok=query?.currency==='XTR'&&query?.total_amount===PRICE&&query?.invoice_payload===PAYLOAD;
  await api.answerPreCheckoutQuery({
    pre_checkout_query_id:query.id,
    ok,
    ...(ok?{}:{error_message:'Не удалось подтвердить товар. Попробуй открыть покупку заново.'})
  });
}
