// EduPsi Campus · v3: siempre busca la versión más reciente (sin caché), usa la copia guardada solo sin internet y muestra los avisos push
const C='edupsi-v2';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 const page=r.mode==='navigate'||/\/(index\.html)?(\?.*)?$/.test(new URL(r.url).pathname+new URL(r.url).search);
 e.respondWith(fetch(r.url,{cache:page?'no-store':'no-cache',credentials:'same-origin'}).then(res=>{if(page&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put('./',cp)).catch(()=>{})}return res}).catch(()=>caches.match(page?'./':r).then(x=>x||caches.match(r))))});
// v3: avisos en el celular (notificaciones push)
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data?e.data.text():''}}
 e.waitUntil(self.registration.showNotification(d.title||'EduPsi Campus',{body:d.body||'Tienes un aviso nuevo',icon:'icon-192.png',badge:'icon-192.png',tag:d.tag||undefined,data:{link:d.link||''}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const link=(e.notification.data&&e.notification.data.link)||'';
 e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cs=>{const c=cs.find(x=>new URL(x.url).origin===location.origin);
  if(c){c.postMessage({t:'push-open',link});return c.focus()}return self.clients.openWindow('./'+(link?'?ir='+encodeURIComponent(link):''))}))});
