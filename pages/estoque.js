
import useSWR from 'swr'; import TopNav from '../components/TopNav'; import { useState, useMemo } from 'react';
const f=(u)=>fetch(u).then(r=>r.json());
export default function Estoque(){ const {data} = useSWR('/api/reports/inventory',f); const [q,setQ]=useState('');
  const grouped = useMemo(()=>{
    if(!data) return [];
    return data.articles.filter(a=> a.name.toLowerCase().includes(q.toLowerCase()));
  },[data,q]);
  if(!data) return <div>Carregando...</div>;
  const print = ()=>{
    const w = window.open('','_blank');
    w.document.write('<html><head><title>Estoque Atual - SRJ</title><style>body{font-family:Arial;margin:20px} .header{display:flex;justify-content:space-between;align-items:center} .table th{background:#e6f0ff;padding:8px;text-align:left} .table td{padding:8px;border-bottom:1px solid #eee}</style></head><body>');
    w.document.write('<div class="header"><div><img src="/srj-logo.svg" width="140"/></div><div>Emitido em: '+new Date().toLocaleString()+'</div></div>');
    w.document.write('<h2>Estoque Atual - Resumo por Artigo</h2>');
    w.document.write('<table class="table" style="width:100%"><thead><tr><th>Artigo</th><th>Fornecedor</th><th>Largura (cm)</th><th>Qtd. R.</th><th>Metragem (m)</th></tr></thead><tbody>');
    grouped.forEach(a=>{ w.document.write('<tr><td>'+a.name+'</td><td>'+ (a.supplier||'') +'</td><td>'+ (a.width||'') +'</td><td>'+ (a.count||0) +'</td><td>'+ (a.total_remaining||0) +'</td></tr>') });
    w.document.write('</tbody></table>');
    w.document.write('</body></html>'); w.document.close();
    w.print();
    w.onafterprint = ()=> w.close();
  }
  return (<div className="min-h-screen"><TopNav /><main className="max-w-5xl mx-auto p-4"><h1 className="text-2xl font-bold text-brand-500">Estoque Atual</h1>
    <div className="mt-4 flex gap-2 items-center"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por artigo" className="border p-2 rounded flex-1"/><button onClick={print} className="bg-brand-500 text-white p-2 rounded">Imprimir Estoque</button></div>
    <div className="mt-4 space-y-2">{grouped.map(a=>(<div key={a.id} className="p-4 bg-white rounded shadow"><div className="flex justify-between"><div><div className="font-medium">{a.name}</div><div className="text-sm text-gray-500">Fornecedor: {a.supplier} • Largura: {a.width} cm</div></div><div className="text-sm"><div>Rolos: {a.count||0}</div><div>Total: {a.total_remaining||0} m</div></div></div></div>))}</div>
  </main></div>) }
