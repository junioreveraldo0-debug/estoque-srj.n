
import { readJSON } from '../../../lib/storage';
export default async function handler(req,res){
  const { id } = req.query;
  const rolls = await readJSON('rolls');
  const r = rolls.find(x=>x.id===id);
  if(!r) return res.status(404).json({ error: 'Rolo não encontrado' });
  // normalize fields expected by label page
  const out = { ...r, barcode: r.id, articleName: r.articleName || r.article_name || '' , supplier: r.supplier || '', width: r.width || r.largura || '', remaining_quantity: r.remaining_quantity || r.initial_quantity || 0 };
  res.json(out);
}
