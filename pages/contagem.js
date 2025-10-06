
import { useState, useMemo } from 'react';
import TopNav from '../components/TopNav';

export default function Contagem() {
  const [code, setCode] = useState('');
  const [counted, setCounted] = useState([]);
  const [msg, setMsg] = useState('');

  const add = async () => {
    if (!code) return setMsg('Informe código');
    const res = await fetch('/api/rolls?barcode=' + encodeURIComponent(code));
    if (!res.ok) return setMsg('Rolo não encontrado');
    const r = await res.json();
    setCounted(prev => [...prev, r]);
    setCode('');
    setMsg('Rolo adicionado: ' + r.id);
  };

  const grouped = useMemo(() => {
    const map = {};
    counted.forEach(r => {
      const k = r.article_id || 'unknown';
      if (!map[k]) map[k] = { articleName: r.articleName || '', width: r.width || '', count: 0, total: 0 };
      map[k].count += 1;
      map[k].total += Number(r.remaining_quantity || 0);
    });
    return Object.values(map);
  }, [counted]);

  const print = () => {
    const w = window.open('', '_blank');
    w.document.write('<html><head><title>Contagem - SRJ</title><style>body{font-family:Arial;margin:20px} .header{display:flex;justify-content:space-between;align-items:center} table{width:100%;border-collapse:collapse} th{background:#e6f0ff;padding:8px;text-align:left} td{padding:8px;border-bottom:1px solid #eee}</style></head><body>');
    w.document.write('<div class="header"><div><img src="/srj-logo.svg" width="140"/></div><div>Emitido em: ' + new Date().toLocaleString() + '</div></div>');
    w.document.write('<h2>Contagem de Estoque</h2>');
    w.document.write('<table><thead><tr><th>Artigo</th><th>Largura (cm)</th><th>Qtd. de rolos</th><th>Metragem total (m)</th></tr></thead><tbody>');
    grouped.forEach(g => { w.document.write('<tr><td>' + g.articleName + '</td><td>' + g.width + '</td><td>' + g.count + '</td><td>' + g.total + '</td></tr>'); });
    w.document.write('</tbody></table></body></html>');
    w.document.close();
    w.print();
    w.onafterprint = () => w.close();
  };

  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold text-brand-500">Contagem de Estoque</h1>

        <div className="mt-4 p-4 bg-white rounded shadow space-y-2">
          <div className="flex gap-2">
            <input value={code} onChange={e => setCode(e.target.value)} placeholder="Inserir/escaneie código do rolo" className="flex-1 border p-2 rounded" />
            <button onClick={add} className="bg-brand-500 text-white p-2 rounded">Adicionar</button>
          </div>
          <div className="text-sm text-gray-600">{msg}</div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold">Resumo por Artigo</h3>
          <div className="mt-2 bg-white rounded shadow overflow-hidden">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left p-2">Artigo</th>
                  <th className="text-left p-2">Largura</th>
                  <th className="text-left p-2">Qtd</th>
                  <th className="text-left p-2">Metragem</th>
                </tr>
              </thead>
              <tbody>
                {grouped.map((g, i) => (
                  <tr key={i}>
                    <td className="p-2">{g.articleName}</td>
                    <td className="p-2">{g.width}</td>
                    <td className="p-2">{g.count}</td>
                    <td className="p-2">{g.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4">
          <button onClick={print} className="bg-brand-500 text-white p-2 rounded">Imprimir Contagem</button>
        </div>

      </main>
    </div>
  );
}
