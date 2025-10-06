
import { readJSON } from '../../../lib/storage';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
export default async function handler(req,res){
  try{
    const id = req.query.id;
    if(!id) return res.status(400).send('Missing id');
    const rolls = await readJSON('rolls');
    const roll = rolls.find(r=>r.id===id);
    if(!roll) return res.status(404).send('Not found');
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([283.46*2,226.77*2]);
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    page.drawText('SRJ', { x: 20, y: page.getHeight()-40, size:24, color: rgb(0.12,0.45,0.91)});
    page.drawText('Artigo: '+(roll.articleName||''), { x:20, y: page.getHeight()-70, size:10 });
    page.drawText('Fornecedor: '+(roll.supplier||''), { x:20, y: page.getHeight()-85, size:10 });
    page.drawText('Nuance: '+(roll.nuance||''), { x:20, y: page.getHeight()-100, size:10 });
    page.drawText('Metragem: '+(roll.remaining_quantity||'')+' m', { x:20, y: page.getHeight()-115, size:10 });
    page.drawText('Lote: '+(roll.lot_number||''), { x:20, y: page.getHeight()-130, size:10 });
    page.drawText('ID: '+roll.id, { x:20, y: page.getHeight()-150, size:9 });
    const pdfBytes = await pdfDoc.save();
    res.setHeader('Content-Type','application/pdf');
    res.setHeader('Content-Disposition','attachment; filename=etiqueta-'+id+'.pdf');
    res.send(Buffer.from(pdfBytes));
  }catch(e){ console.error(e); res.status(500).send('Erro') }
}
