import { useState } from 'react'; import TopNav from '../components/TopNav'; import Router from 'next/router'; import useSWR from 'swr';
const f=(u)=>fetch(u).then(r=>r.json());
export default function Entrada(){ const {data:articles}=useSWR('/api/articles',f); const [article,setArticle]=useState(''); const [qty,setQty]=useState(''); const [nuance,setNuance]=useState(''); const [lot,setLot]=useState(''); const [location,setLocation]=useState(''); const [msg,setMsg]=useState(null);
  const submit=async()=>{ const res=await fetch('/api/rolls',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({article_id:article,initial_quantity:qty,nuance,lot_number:lot,location})}); if(res.ok){ const data=await res.json(); Router.push('/label/'+data.id) } else setMsg('Erro ao registrar') }
  return (<div className="min-h-screen"><TopNav /><main className="max-w-5xl mx-auto p-4"><h1 className="text-2xl font-bold text-brand-500">Entrada de Tecido</h1>
    <div className="mt-4 p-4 bg-white rounded shadow space-y-2">
      <select value={article} onChange={e=>setArticle(e.target.value)} className="w-full border p-2 rounded">
        <option value="">-- Selecionar Artigo --</option>
        {articles?.map(a=> <option key={a.id} value={a.id}>{a.name} — {a.supplier} — {a.width}cm</option>)}
      </select>
      <input value={qty} onChange={e=>setQty(e.target.value)} placeholder="Metragem (m)" className="w-full border p-2 rounded" />
      <input value={nuance} onChange={e=>setNuance(e.target.value)} placeholder="Nuance" className="w-full border p-2 rounded" />
      <input value={lot} onChange={e=>setLot(e.target.value)} placeholder="Número do Lote" className="w-full border p-2 rounded" />
      <input value={location} onChange={e=>setLocation(e.target.value)} placeholder="Localização (opcional)" className="w-full border p-2 rounded" />
      <button onClick={submit} className="bg-brand-500 text-white rounded p-2">Registrar Entrada e Imprimir Etiqueta</button>{msg && <div className='text-red-600'>{msg}</div>}
    </div>
  </main></div>) }