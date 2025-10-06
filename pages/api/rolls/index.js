
import { v4 as uuidv4 } from 'uuid';
import { readJSON, writeJSON } from '../../../lib/storage';
export default async function handler(req,res){
  try{
    if(req.method==='POST'){
      const { article_id, initial_quantity, lot_number, location, nuance } = req.body;
      if(!article_id || initial_quantity==null) return res.status(400).send('Dados incompletos');
      const artigos = await readJSON('artigos');
      const art = artigos.find(a=>a.id===article_id);
      const id = uuidv4();
      const roll = { id, article_id, articleName: art?.name||'', supplier: art?.supplier||'', width: art?.width||'', initial_quantity: Number(initial_quantity), remaining_quantity: Number(initial_quantity), lot_number: lot_number||'', location: location||'', nuance: nuance||'', created_at: new Date().toISOString() };
      const rolls = await readJSON('rolls'); rolls.push(roll); await writeJSON('rolls', rolls);
      return res.json(roll);
    }
    if(req.method==='GET'){
      const { barcode } = req.query;
      if(!barcode) return res.status(400).send('Missing');
      const rolls = await readJSON('rolls');
      const r = rolls.find(x=>x.id===barcode);
      if(r) return res.json(r);
      return res.status(404).send('Not found');
    }
    res.status(405).end();
  }catch(e){ console.error(e); res.status(500).send('Erro') }
}
