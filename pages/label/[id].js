
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import JsBarcode from 'jsbarcode'

export default function LabelPage() {
  const router = useRouter()
  const { id } = router.query
  const [data, setData] = useState(null)
  const barcodeRef = useRef(null)

  useEffect(() => {
    if (!id) return
    fetch(`/api/entrada/${id}`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [id])

  useEffect(() => {
    if (data && barcodeRef.current) {
      try {
        const code = data.barcode || data.id || id
        JsBarcode(barcodeRef.current, code, {
          format: "CODE128",
          width: 2.0,
          height: 56,
          displayValue: true,
          fontSize: 12,
          margin: 4,
        })
      } catch (e) {
        console.error('JsBarcode error', e)
      }
    }
  }, [data, id])

  const handlePrint = () => {
    window.print()
  }

  if (!data) return <div className="min-h-screen flex items-center justify-center">Carregando etiqueta...</div>

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-6">
      <div
        className="border border-gray-300 rounded-xl shadow p-4 flex flex-col items-center justify-between"
        style={{ width: '10cm', height: '8cm', boxSizing: 'border-box' }}
      >
        <div className="text-center mb-2">
          <h1 className="text-4xl font-bold text-blue-700">SRJ</h1>
          <p className="text-sm text-gray-600">Etiqueta de Rolo</p>
        </div>

        <div className="text-sm text-gray-800 space-y-1 text-center">
          <p><strong>Artigo:</strong> {data.articleName}</p>
          <p><strong>Fornecedor:</strong> {data.supplier}</p>
          <p><strong>Largura:</strong> {data.width} cm</p>
          <p><strong>Metragem:</strong> {data.remaining_quantity} m</p>
          <p><strong>Nuance:</strong> {data.nuance}</p>
        </div>

        <div className="mt-2 flex flex-col items-center">
          <svg ref={barcodeRef} className="barcode-svg" />
        </div>

        <button onClick={handlePrint} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded shadow print:hidden">Imprimir Etiqueta</button>
      </div>
    </div>
  )
}
