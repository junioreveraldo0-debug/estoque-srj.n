
import fs from 'fs';
import path from 'path';
import { redis } from './redis.js';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

function filePath(name){ return path.join(dataDir, name + '.json'); }

// Local JSON helpers
function readLocal(name){
  const p = filePath(name);
  try { const txt = fs.readFileSync(p, 'utf8'); if(!txt) return []; return JSON.parse(txt); } catch (e) { return []; }
}
function writeLocal(name, data){
  const p = filePath(name);
  fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
  return true;
}

// Exported functions: when redis is available (Upstash) use it, otherwise fallback to local files.
// We'll store each "collection" as a Redis Key prefixed with "srj:" storing JSON string of array.
export async function readJSON(name){
  if(redis){
    try{
      const key = `srj:${name}`;
      const val = await redis.get(key);
      if(!val) return [];
      return JSON.parse(val);
    }catch(e){
      console.error('Redis read error', e);
      return readLocal(name);
    }
  } else {
    return readLocal(name);
  }
}

export async function writeJSON(name, data){
  if(redis){
    try{
      const key = `srj:${name}`;
      await redis.set(key, JSON.stringify(data));
      return true;
    }catch(e){
      console.error('Redis write error', e);
      return writeLocal(name, data);
    }
  } else {
    return writeLocal(name, data);
  }
}
