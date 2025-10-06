
(async ()=>{
  try{
    const storage = await import('../lib/storage.js');
    const readJSON = storage.readJSON;
    const writeJSON = storage.writeJSON;
    const bcrypt = (await import('bcryptjs')).default;
    const users = await readJSON('users');
    const exists = users.find(u=>u.username==='admin');
    if(exists){ console.log('admin already exists'); process.exit(0) }
    const hash = await bcrypt.hash('123456',10);
    users.push({ username:'admin', name:'Administrador', password: hash, role: 'admin' });
    await writeJSON('users', users);
    console.log('Admin criado: admin / 123456');
  }catch(e){ console.error(e); process.exit(1) }
})();
