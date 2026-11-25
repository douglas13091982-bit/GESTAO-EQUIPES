import { createClient } from '@supabase/supabase-js';
const env = (import.meta as ImportMeta & { env: Record<string,string> }).env;
export const db = env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY ? createClient(env.VITE_SUPABASE_URL,env.VITE_SUPABASE_ANON_KEY) : null;
export const funcoes = ['Auxiliar de Limpeza','Recepcionista','Porteiro'];
export const tipos = ['RG','CPF','CTPS','Comprovante de residência','Contrato','ASO','Certificado/NR','Atestado'];
export function localizar(): Promise<GeolocationPosition> {
 return new Promise((resolve,reject)=>{if(!navigator.geolocation) return reject(new Error('Geolocalização indisponível')); navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:true,timeout:20000,maximumAge:0});});
}
export function validade(data: string|null) {
 if(!data)return 'Sem validade';
 const dias=Math.ceil((new Date(data+'T23:59:59').getTime()-Date.now())/86400000);
 return dias<0?'Vencido':dias<=30?'A vencer':'Válido';
}
