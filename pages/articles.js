
import useSWR from 'swr'; import { useState, useEffect } from 'react'; import TopNav from '../components/TopNav';
const f=(u)=>fetch(u).then(r=>r.json());
function getToken(){ try{ const raw=localStorage.getItem('estoque_srj_user'); if(!raw) return null; return JSON.parse(raw).token }catch(e){return null} }
export default function Articles(){ const {data,mutate}=useSWR('/api/articles',f); const [name,setName]=useState(''); const [supplier,setSupplier]=useState(''); const [width,setWidth]=useState(''); const [role,setRole]=useState(null);
  useEffect(()=>{ (async ()=>{ const res=await fetch('/api/users/me',{ headers: { Authorization: 'Bearer '+getToken() } }); if(res.ok){ const j=await res.json(); setRole(j.role) } })() },[]);
  const add=async()=>{ await fetch('/api/articles',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name,supplier,width})}); setName(''); setSupplier(''); setWidth(''); mutate(); }
  const remove=async(id)=>{ if(!confirm('Excluir artigo e todos os rolos relacionados?')) return; const token = getToken(); const res=await fetch('/api/articles/'+id,{method:'DELETE', headers: { Authorization: 'Bearer '+token }}); if(res.ok) mutate(); else alert('Erro ao excluir') }
  return (<div className="min-h-screen"><TopNav /><main className="max-w-5xl mx-auto p-4"><h1 className="text-2xl font-bold text-brand-500">Artigos</h1>
    <div className="mt-4 p-4 bg-white rounded shadow">
      <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nome do artigo" className="w-full border p-2 rounded mb-2" />
      <input value={supplier} onChange={e=>setSupplier(e.target.value)} placeholder="Fornecedor" className="w-full border p-2 rounded mb-2" />
      <input value={width} onChange={e=>setWidth(e.target.value)} placeholder="Largura (cm)" className="w-full border p-2 rounded mb-2" />
      <button onClick={add} className="bg-brand-500 text-white rounded p-2">Adicionar</button>
    </div>
    <div className="mt-4 bg-white p-4 rounded shadow">{data?.map(a=>(<div key={a.id} className="p-2 border-b flex justify-between items-center"><div><div className="font-medium">{a.name}</div><div className="text-sm text-gray-500">Fornecedor: {a.supplier} • Largura: {a.width} cm</div></div><div className="text-sm flex items-center gap-2">{role==='admin' && <button onClick={()=>remove(a.id)} className="text-red-600">Excluir</button>}<div className="text-xs text-gray-400">{a.id}</div></div></div>))}</div>
  </main></div>) }
