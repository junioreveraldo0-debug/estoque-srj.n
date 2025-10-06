
import { readJSON, writeJSON } from '../../../lib/storage';
import { v4 as uuidv4 } from 'uuid';
export default async function handler(req,res){
  try{
    if(req.method==='POST'){
      const { roll_id, quantity, note, type } = req.body;
      if(!roll_id||!quantity) return res.status(400).send('Missing');
      const rolls = await readJSON('rolls');
      const roll = rolls.find(r=>r.id===roll_id);
      if(!roll) return res.status(404).send('Roll not found');
      const id = uuidv4();
      const mov = { id, roll_id, article_id: roll.article_id, articleName: roll.articleName, quantity:Number(quantity), note, type: type||'OUT', performed_by: 'admin', created_at: new Date().toISOString() };
      if(mov.type==='OUT'){ const rem = Number(roll.remaining_quantity)-Number(quantity); if(rem<0) return res.status(400).send('Quantidade maior que restante'); roll.remaining_quantity = rem; await writeJSON('rolls', rolls); }
      const mv = await readJSON('movements'); mv.unshift(mov); await writeJSON('movements', mv);
      return res.json(mov);
    }
    if(req.method==='GET'){
      const items = await readJSON('movements'); return res.json(items.slice(0,50));
    }
    res.status(405).end();
  }catch(e){ console.error(e); res.status(500).send('Erro') }
}
