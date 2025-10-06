
import jwt from 'jsonwebtoken';
import { readJSON } from '../../../lib/storage';
export default async function handler(req,res){
  const auth = req.headers.authorization || '';
  if(!auth.startsWith('Bearer ')) return res.status(401).send('Unauthorized');
  const token = auth.split(' ')[1];
  try{
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'devsecret');
    const users = await readJSON('users');
    const u = users.find(x=>x.username===payload.username);
    if(!u) return res.status(404).send('User not found');
    return res.json({ username: u.username, name: u.name, role: u.role || 'user' });
  }catch(e){ return res.status(401).send('Invalid token') }
}
