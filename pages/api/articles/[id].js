
import { readJSON, writeJSON } from '../../../lib/storage';
import jwt from 'jsonwebtoken';
export default async function handler(req,res){
  const id = req.query.id;
  if(req.method==='DELETE'){
    const auth = req.headers.authorization || '';
    if(!auth.startsWith('Bearer ')) return res.status(401).send('Unauthorized');
    const token = auth.split(' ')[1];
    try{
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
      const users = await readJSON('users');
      const u = users.find(x=>x.username===payload.username);
      if(!u || u.role!=='admin') return res.status(403).send('Forbidden');
    }catch(e){ return res.status(401).send('Invalid token') }
    // delete article and cascade delete rolls and movements
    const artigos = await readJSON('artigos');
    const remaining = artigos.filter(a=>a.id!==id);
    await writeJSON('artigos', remaining);
    const rolls = await readJSON('rolls');
    const rollsRemaining = rolls.filter(r=>r.article_id!==id);
    await writeJSON('rolls', rollsRemaining);
    const movements = await readJSON('movements');
    const mvRemaining = movements.filter(m=>m.article_id!==id);
    await writeJSON('movements', mvRemaining);
    return res.json({ ok:true });
  }
  res.status(405).end();
}
