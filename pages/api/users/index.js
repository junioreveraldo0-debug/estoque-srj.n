
import { readJSON, writeJSON } from '../../../lib/storage';
import bcrypt from 'bcryptjs';
export default async function handler(req,res){
  try{
    if(req.method==='GET'){ const users = await readJSON('users'); return res.json(users.map(u=>({ username:u.username, name:u.name, role:u.role||'usuario' }))); }
    if(req.method==='POST'){ const { username, name, password, role } = req.body; if(!username||!password) return res.status(400).send('Missing'); const users = await readJSON('users'); const exists = users.find(u=>u.username===username); if(exists) return res.status(400).send('User exists'); const hashed = await bcrypt.hash(password,10); const user={ username, name, password: hashed, role: role||'usuario' }; users.push(user); await writeJSON('users', users); return res.json({ username, name, role: user.role }); }
    res.status(405).end();
  }catch(e){ console.error(e); res.status(500).send('Erro') }
}
