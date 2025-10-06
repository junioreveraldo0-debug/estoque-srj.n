
import { readJSON, writeJSON } from '../../../lib/storage';
import jwt from 'jsonwebtoken';
export default async function handler(req,res){
  const username = req.query.username;
  if(req.method==='DELETE'){
    const auth = req.headers.authorization || '';
    if(!auth.startsWith('Bearer ')) return res.status(401).send('Unauthorized');
    const token = auth.split(' ')[1];
    try{
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
      if(payload.username===username) return res.status(400).send('Cannot delete yourself');
      const users = await readJSON('users');
      const u = users.find(x=>x.username===payload.username);
      if(!u || u.role!=='admin') return res.status(403).send('Forbidden');
      const remaining = users.filter(x=>x.username!==username);
      await writeJSON('users', remaining);
      return res.json({ ok:true });
    }catch(e){ return res.status(401).send('Invalid token') }
  }
  res.status(405).end();
}
