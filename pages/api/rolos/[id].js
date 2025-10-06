
import { readJSON } from '../../../lib/storage';
export default async function handler(req,res){
  const id = req.query.id;
  const rolls = await readJSON('rolls');
  const r = rolls.find(x=>x.id===id);
  if(!r) return res.status(404).json({ error: 'Rolo não encontrado' });
  res.json(r);
}
