
import { readJSON } from '../../../lib/storage';
export default async function handler(req,res){
  try{
    const artigos = await readJSON('artigos');
    const rolls = await readJSON('rolls');
    const articles = artigos.map(a=>{ const rs = rolls.filter(r=>r.article_id===a.id && Number(r.remaining_quantity)>0); const total_remaining = rs.reduce((s,x)=>s+Number(x.remaining_quantity||0),0); const count = rs.length; return { id:a.id, name:a.name, supplier:a.supplier, width:a.width, total_remaining, count } });
    const totalArticles = artigos.length; const totalRolls = rolls.length; const totalQuantity = rolls.reduce((s,r)=>s+Number(r.remaining_quantity||0),0);
    return res.json({ totalArticles, totalRolls, totalQuantity, uom:'m', articles, rolls });
  }catch(e){ console.error(e); res.status(500).send('Erro') }
}
