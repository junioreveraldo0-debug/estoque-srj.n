
import { v4 as uuidv4 } from 'uuid';
import { readJSON, writeJSON } from '../../../lib/storage';

export default async function handler(req,res){
  try{
    if(req.method==='GET'){
      const list = await readJSON('artigos');
      return res.json(list);
    }
    if(req.method==='POST'){
      const { name, supplier, width } = req.body;
      if(!name) return res.status(400).send('Nome obrigatório');
      const list = await readJSON('artigos');
      const id = uuidv4();
      const article = { id, name, supplier: supplier||'', width: width||'' };
      list.push(article);
      await writeJSON('artigos', list);
      return res.json(article);
    }
    res.status(405).end();
  }catch(e){ console.error(e); res.status(500).send('Erro') }
}
