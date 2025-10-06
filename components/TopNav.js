
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../utils/auth'
export default function TopNav(){
  const router = useRouter();
  const { user, logout } = useAuth();
  if(!user) return null;
  const tabs = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/articles', label: 'Artigos' },
    { href: '/entrada', label: 'Entrada' },
    { href: '/saida', label: 'Saída' },
    { href: '/estoque', label: 'Estoque' },
    { href: '/contagem', label: 'Contagem' },
    { href: '/usuarios', label: 'Usuários' },
  ];
  return (
    <header className="header sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <img src="/srj-logo.svg" alt="SRJ" width="140" />
        </div>
        <nav className="hidden md:flex gap-2">
          {tabs.map(t=>{
            const active = router.pathname===t.href;
            return <Link key={t.href} href={t.href}><div className={`nav-tab ${active? 'nav-tab-active' : ''}`}>{t.label}</div></Link>
          })}
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-600">Olá, {user?.username}</div>
          <button onClick={()=>{ logout() }} className="bg-brand-500 text-white px-3 py-1 rounded no-print">Sair</button>
        </div>
      </div>
      <div className="md:hidden overflow-auto"><div className="flex gap-2 px-3 pb-2">
        {tabs.map(t=> <Link key={t.href} href={t.href}><div className="nav-tab">{t.label}</div></Link>)}
      </div></div>
    </header>
  )
}
