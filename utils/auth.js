
import { createContext, useContext, useEffect, useState } from 'react'
import Router from 'next/router'
const AuthContext = createContext()
export function AuthProvider({children}){
  const [user,setUser]=useState(null)
  useEffect(()=>{ 
    const raw = typeof window!=='undefined'? localStorage.getItem('estoque_srj_user'): null; 
    if(raw) setUser(JSON.parse(raw)) 
  },[])
  const login = async (username,password)=>{
    const res = await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})})
    if(res.ok){ const j = await res.json(); localStorage.setItem('estoque_srj_user', JSON.stringify({username, token: j.token})); setUser({username, token: j.token}); Router.push('/dashboard'); return true }
    const err = await res.json().catch(()=>({error:'Login failed'})); throw new Error(err.error||'Login failed')
  }
  const logout = ()=>{ if(typeof window!=='undefined') localStorage.removeItem('estoque_srj_user'); setUser(null); Router.push('/') }
  return <AuthContext.Provider value={{user,login,logout}}>{children}</AuthContext.Provider>
}
export function useAuth(){ return useContext(AuthContext) }
export function getToken(){ if(typeof window==='undefined') return null; const raw = localStorage.getItem('estoque_srj_user'); if(!raw) return null; try{ const j=JSON.parse(raw); return j.token }catch(e){return null} }
