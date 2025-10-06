
import useSWR from 'swr'; import TopNav from '../components/TopNav'; const f=(u)=>fetch(u).then(r=>r.json());
export default function Dashboard(){ const {data}=useSWR('/api/reports/inventory',f); if(!data) return <div>Carregando...</div>;
  return (<div className="min-h-screen"><TopNav /><main className="max-w-5xl mx-auto p-4">
    <h1 className="text-2xl font-bold text-brand-500">Dashboard — SRJ</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      <div className="p-4 bg-white rounded shadow"><div className="text-sm text-gray-500">Artigos</div><div className="text-2xl font-semibold">{data.totalArticles}</div></div>
      <div className="p-4 bg-white rounded shadow"><div className="text-sm text-gray-500">Rolos</div><div className="text-2xl font-semibold">{data.totalRolls}</div></div>
      <div className="p-4 bg-white rounded shadow"><div className="text-sm text-gray-500">Total em estoque ({data.uom})</div><div className="text-2xl font-semibold">{data.totalQuantity}</div></div>
    </div>
  </main></div>) }
