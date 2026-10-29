// EduPsi Campus · v2: siempre busca la versión más reciente (sin caché) y usa la copia guardada solo sin internet
const C='edupsi-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 const page=r.mode==='navigate'||/\/(index\.html)?(\?.*)?$/.test(new URL(r.url).pathname+new URL(r.url).search);
 e.respondWith(fetch(r.url,{cache:page?'no-store':'no-cache',credentials:'same-origin'}).then(res=>{if(page&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put('./',cp)).catch(()=>{})}return res}).catch(()=>caches.match(page?'./':r).then(x=>x||caches.match(r))))});
