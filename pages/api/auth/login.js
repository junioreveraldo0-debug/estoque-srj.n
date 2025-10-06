
import { readJSON } from '../../../lib/storage';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
export default async function handler(req,res){
  if(req.method!=='POST') return res.status(405).json({ error:'Método não permitido' });
  const { username, password } = req.body||{};
  if(!username||!password) return res.status(400).json({ error:'Usuário e senha obrigatórios' });
  const users = await readJSON('users');
  const user = users.find(u=>u.username===username);
  if(!user) return res.status(401).json({ error:'Usuário não encontrado' });
  const ok = await bcrypt.compare(password, user.password);
  if(!ok) return res.status(401).json({ error:'Senha incorreta' });
  const token = jwt.sign({ username }, process.env.JWT_SECRET || 'devsecret', { expiresIn:'6h' });
  return res.json({ message:'ok', token, role: user.role||'user' });
}
