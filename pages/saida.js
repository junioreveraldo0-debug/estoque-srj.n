import { useState } from 'react'; import TopNav from '../components/TopNav';
export default function Saida(){ const [code,setCode]=useState(''); const [roll,setRoll]=useState(null); const [qty,setQty]=useState(''); const [note,setNote]=useState('');
  const find=async ()=>{ const res=await fetch('/api/rolls?barcode='+encodeURIComponent(code)); if(res.ok){ setRoll(await res.json()) } else { setRoll(null); alert('Rolo não encontrado') } }
  const submit=async ()=>{ if(!roll) return alert('Nenhum rolo'); const res=await fetch('/api/movements',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({roll_id:roll.id,quantity:qty,note,type:'OUT'})}); if(res.ok){ alert('Saída registrada'); setRoll(null); setCode(''); setQty('') } else { alert('Erro') } }
  return (<div className="min-h-screen"><TopNav /><main className="max-w-5xl mx-auto p-4"><h1 className="text-2xl font-bold text-brand-500">Saída / Corte</h1>
    <div className="mt-4 p-4 bg-white rounded shadow space-y-2">
      <div className="flex gap-2"><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Código do Rolo (barcode)" className="flex-1 border p-2 rounded" /><button onClick={find} className="bg-brand-500 text-white p-2 rounded">Buscar</button></div>
      {roll && (<div className="p-2 border rounded">
        <div className="font-medium">{roll.articleName} - Rolo {roll.id}</div>
        <div>Quantidade restante: {roll.remaining_quantity}</div>
        <input value={qty} onChange={e=>setQty(e.target.value)} placeholder="Quantidade a cortar" className="w-full border p-2 rounded mt-2" />
        <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Observação" className="w-full border p-2 rounded mt-2" />
        <button onClick={submit} className="bg-brand-500 text-white rounded p-2 mt-2">Registrar Saída</button>
      </div>)}
    </div>
  </main></div>) }