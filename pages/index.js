
import { useState } from 'react'; import { useAuth } from '../utils/auth';
export default function Home(){ const { login } = useAuth(); const [u,setU]=useState(''); const [p,setP]=useState(''); const [err,setErr]=useState(null);
  const onSubmit=async e=>{ e.preventDefault(); try{ await login(u,p) }catch(er){ setErr(er.message) } }
  return (<div className="min-h-screen flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="bg-brand-500 text-white rounded-t-2xl p-6 text-center"><h1 className="text-xl font-bold">SRJ</h1></div>
      <div className="bg-white p-6 rounded-b-2xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Login</h2>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <input value={u} onChange={e=>setU(e.target.value)} placeholder="Usuário" className="w-full border rounded p-3" />
          <input type="password" value={p} onChange={e=>setP(e.target.value)} placeholder="Senha" className="w-full border rounded p-3" />
          <button className="w-full bg-brand-500 text-white rounded p-3">Entrar</button>
        </form>
      </div>
    </div>
  </div>) }
