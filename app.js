const seedParts=[
{id:'PT-001',name:'Hex Bolt',category:'Fasteners',qty:150,min:50,location:'Warehouse A',team:'Warehouse',stage:'In use',manufacturer:'Acme Manufacturing',icon:'🔩',description:'Zinc-plated hex head bolt for general assembly.',updated:'Today, 10:24'},
{id:'PT-002',name:'Ball Bearing',category:'Bearings',qty:8,min:20,location:'Assembly Line 1',team:'Harris Racing',stage:'In use',manufacturer:'Acme Manufacturing',icon:'⚙️',description:'Precision bearing used in motor assemblies.',updated:'Today, 09:12'},
{id:'PT-003',name:'Electric Motor',category:'Motors',qty:15,min:5,location:'Warehouse A',team:'Maintenance',stage:'In use',manufacturer:'Acme Manufacturing',icon:'🔧',description:'Three-phase induction motor, 5.5 kW, 400 V. Demo data only.',updated:'Yesterday'},
{id:'PT-004',name:'Gear Wheel',category:'Gears',qty:42,min:10,location:'Warehouse B',team:'Harris Racing',stage:'Donated',manufacturer:'Acme Manufacturing',icon:'⚙️',description:'Steel gear wheel, transferred to a museum collection.',updated:'Yesterday'},
{id:'PT-005',name:'Hydraulic Pump',category:'Hydraulics',qty:0,min:5,location:'Service Centre',team:'Maintenance',stage:'In storage',manufacturer:'Acme Manufacturing',icon:'🛠️',description:'Hydraulic pump awaiting replacement parts.',updated:'2 days ago'},
{id:'PT-006',name:'Control Module',category:'Electrical',qty:12,min:4,location:'R&D Lab',team:'R&D',stage:'Repurposed',manufacturer:'Northstar Components',icon:'▣',description:'Control module reassigned to a training rig.',updated:'2 days ago'},
{id:'PT-007',name:'Drive Belt',category:'Other',qty:8,min:10,location:'Warehouse C',team:'Warehouse',stage:'In use',manufacturer:'Northstar Components',icon:'〰️',description:'Replacement belt for a workshop machine.',updated:'3 days ago'},
{id:'PT-008',name:'Cooling Fan',category:'Motors',qty:25,min:8,location:'Production Line 2',team:'Harris Racing',stage:'In use',manufacturer:'Precision Works',icon:'🌀',description:'Cooling fan used in an equipment enclosure.',updated:'3 days ago'},
{id:'PT-009',name:'Battery Pack',category:'Electrical',qty:0,min:6,location:'Recycling Facility',team:'Maintenance',stage:'Recycled',manufacturer:'Precision Works',icon:'▰',description:'Retired pack sent to a certified recycling facility.',updated:'4 days ago'},
{id:'PT-010',name:'Hydraulic Valve',category:'Hydraulics',qty:3,min:8,location:'Warehouse A',team:'Warehouse',stage:'In use',manufacturer:'Acme Manufacturing',icon:'🔧',description:'Pressure control valve.',updated:'4 days ago'}];
const seedEvents=[{id:'PT-003',name:'Electric Motor',event:'Stock received',detail:'+10 units · Warehouse A',time:'2 hours ago',icon:'＋'},{id:'PT-004',name:'Gear Wheel',event:'Donated to museum',detail:'Location updated · City Museum',time:'5 hours ago',icon:'◇'},{id:'PT-006',name:'Control Module',event:'Repurposed',detail:'Assigned to training equipment',time:'1 day ago',icon:'↻'},{id:'PT-008',name:'Cooling Fan',event:'Location transfer',detail:'Warehouse B → Production Line 2',time:'2 days ago',icon:'⇄'}];
const lifecycleStages=['In use','In storage','Donated','Repurposed','Recycled','Decommissioned'];
let parts=load('partstrack.parts',seedParts),events=load('partstrack.events',seedEvents),currentPage='dashboard',activeManufacturer='Acme Manufacturing',roleMode=load('partstrack.activeUser','admin')==='team'?'team':'admin',activeTeam='Harris Racing',editingPartId=null;
function load(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):structuredClone(fallback)}catch{return structuredClone(fallback)}}function save(){try{localStorage.setItem('partstrack.parts',JSON.stringify(parts));localStorage.setItem('partstrack.events',JSON.stringify(events))}catch{toast('Browser storage is unavailable; changes may not persist.')}}
const $=id=>document.getElementById(id);const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if(!load('partstrack.harrisRacingSetup',false)){for(const part of parts)if(['PT-002','PT-004','PT-008'].includes(part.id)&&part.team==='Assembly')part.team='Harris Racing';try{localStorage.setItem('partstrack.parts',JSON.stringify(parts));localStorage.setItem('partstrack.harrisRacingSetup','true')}catch{toast('Could not save the Harris Racing demo setup in this browser.')}}
function stockStatus(p){return p.qty===0?'Out of stock':p.qty<=p.min?'Low stock':'In stock'}function statusClass(s){return 'status-'+s.toLowerCase().replaceAll(' ','-')}
function scopedParts(){return roleMode==='admin'?parts:parts.filter(p=>p.team===activeTeam)}
function render(){const data=scopedParts();const total=data.reduce((n,p)=>n+p.qty,0);$('totalParts').textContent=data.length;$('totalUnits').textContent=total.toLocaleString();$('lowStock').textContent=data.filter(p=>p.qty>0&&p.qty<=p.min).length;$('outStock').textContent=data.filter(p=>p.qty===0).length;$('lifecycleCount').textContent=data.length;renderCards(data,$('partSearch').value);renderLegend(data);renderActivity();renderTable(data);renderTimeline(data);renderTransactions();renderTeamManagement();renderNotifications();updateUserDisplay();const scope=roleMode==='admin'?'All teams':`${activeTeam} team`;$('viewEyebrow').textContent=roleMode==='admin'?'ADMIN WORKSPACE':'TEAM WORKSPACE';$('pageSubtitle').textContent=`${scope} · ${data.length} part records in scope.`;if(currentPage==='dashboard')$('pageTitle').textContent=roleMode==='admin'?'Admin dashboard':'Harris Racing dashboard';}
function recordChange(entry){events.unshift({...entry,eventId:`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`,isNew:true,actor:roleMode==='admin'?'Admin':'Harris Racing',time:'Just now'});events=events.slice(0,200)}
function renderCards(data,query=''){const status=$('statusFilter').value;const q=(query||'').toLowerCase();const filtered=data.filter(p=>(status==='all'||stockStatus(p)===status)&&[p.id,p.name,p.category,p.location,p.manufacturer].join(' ').toLowerCase().includes(q));$('partsGrid').innerHTML=filtered.slice(0,8).map((p,i)=>`<article class="part-card" data-part="${esc(p.id)}" style="animation-delay:${i*35}ms" tabindex="0" role="button" aria-label="View ${esc(p.name)}"><div class="part-top"><div class="part-art">${p.icon}</div><div class="part-meta"><div class="part-id">${esc(p.id)}</div><div class="part-name">${esc(p.name)}</div><div class="part-category">${esc(p.category)}</div><div style="margin-top:7px"><span class="status-pill ${statusClass(stockStatus(p))}">${stockStatus(p)}</span></div></div></div><div class="part-stock-row"><div><span>Current stock</span><b>${p.qty.toLocaleString()} <small style="font:400 9px 'DM Sans';color:#8593a8">units</small></b></div><div><span>Minimum stock</span><b>${p.min} <small style="font:400 9px 'DM Sans';color:#8593a8">units</small></b></div></div><div class="part-location">⌖ ${esc(p.location)} <span style="margin-left:auto;color:#a0aabd">· ${esc(p.team)}</span></div><div class="part-bottom"><small>${esc(p.manufacturer)}</small><button class="mini-link" data-view="${esc(p.id)}">View details →</button></div></article>`).join('');$('emptyState').classList.toggle('hidden',filtered.length>0);}
function renderLegend(data){const counts=lifecycleStages.map(stage=>({stage,count:data.filter(p=>p.stage===stage).length}));const colors=['#2d6be5','#23b987','#8c69e8','#edb34f','#1aa6a6','#a9b7ca'];const total=Math.max(data.length,1);let start=0;const stops=counts.map((x,i)=>{const end=start+x.count/total*100;const out=`${colors[i]} ${start}% ${end}%`;start=end;return out}).join(',');$('donut').style.background=`conic-gradient(${stops})`;$('lifecycleLegend').innerHTML=counts.map((x,i)=>`<div class="legend-row"><i class="legend-dot" style="background:${colors[i]}"></i><span>${x.stage}</span><b>${x.count}</b></div>`).join('')}
function eventsInScope(){return roleMode==='admin'?events:events.filter(event=>event.team===activeTeam||parts.some(part=>part.id===event.id&&part.team===activeTeam))}
function renderActivity(){const e=eventsInScope().slice(0,5);$('activityList').innerHTML=e.map(x=>`<div class="activity-item"><div class="activity-icon">${x.icon}</div><div class="activity-text"><b>${esc(x.event)} · ${esc(x.name)}</b><p>${esc(x.detail)}</p></div><span class="activity-time">${esc(x.time)}</span></div>`).join('')||'<div class="empty-state">No activity yet.</div>'}
function renderTable(data){const q=($('inventorySearch')?.value||'').toLowerCase(),cat=$('categoryFilter')?.value||'all',stat=$('inventoryStatus')?.value||'all';const rows=data.filter(p=>[p.id,p.name,p.category,p.location,p.team].join(' ').toLowerCase().includes(q)&&(cat==='all'||p.category===cat)&&(stat==='all'||stockStatus(p).toLowerCase()===stat.toLowerCase()));$('inventoryTable').innerHTML=`<table><thead><tr><th>Part</th><th>Manufacturer / team</th><th>Location</th><th>Stock</th><th>Lifecycle</th><th>Status</th><th></th></tr></thead><tbody>${rows.map(p=>`<tr><td><div class="table-part"><span class="part-art">${p.icon}</span><span><b>${esc(p.name)}</b><small>${esc(p.id)} · ${esc(p.category)}</small></span></div></td><td>${esc(p.manufacturer)}<br><small style="color:#8996aa">${esc(p.team)}</small></td><td>${esc(p.location)}</td><td><b>${p.qty}</b> <small style="color:#8996aa">/ min ${p.min}</small></td><td>${esc(p.stage)}</td><td><span class="status-pill ${statusClass(stockStatus(p))}">${stockStatus(p)}</span></td><td><button class="mini-link" data-view="${esc(p.id)}">Open</button></td></tr>`).join('')}</tbody></table>${rows.length?'':'<div class="empty-state">No matching parts.</div>'}`}
function renderTimeline(data){const items=data.flatMap(p=>(p.history||[{stage:p.stage,location:p.location,date:p.updated,detail:'Current lifecycle record'}]).map(h=>({...h,id:p.id,name:p.name,manufacturer:p.manufacturer}))).slice(0,30);$('fullTimeline').innerHTML=items.map(x=>`<div class="timeline-entry"><div class="timeline-symbol">◷</div><div><b>${esc(x.name)} <span style="font-weight:400;color:#8b98ac">· ${esc(x.id)}</span></b><p>${esc(x.detail||('Lifecycle stage: '+x.stage))} · ${esc(x.location||'Location not specified')}</p><small>${esc(x.manufacturer||'')} · ${esc(x.date||'Date not recorded')}</small></div><span class="tag tag-blue">${esc(x.stage||'Recorded')}</span></div>`).join('')||'<div class="empty-state">No lifecycle history yet.</div>'}
function renderTransactions(){const rows=eventsInScope().map(e=>`<tr><td>${esc(e.time)}</td><td><b>${esc(e.name)}</b><br><small style="color:#8996aa">${esc(e.id)}</small></td><td>${esc(e.event)}</td><td>${esc(e.detail)}</td><td><span class="tag tag-blue">Demo log</span></td></tr>`).join('');$('transactionsTable').innerHTML=`<table><thead><tr><th>When</th><th>Part</th><th>Activity</th><th>Details</th><th>Record type</th></tr></thead><tbody>${rows}</tbody></table>`}
function renderNotifications(){
  const notifications=eventsInScope().slice(0,12),unread=eventsInScope().filter(event=>event.isNew).length;
  const badge=$('notificationBadge');
  badge.textContent=unread>9?'9+':String(unread);
  badge.classList.toggle('hidden',unread===0);
  $('notificationCount').textContent=unread?`${unread} new change${unread===1?'':'s'}`:'Recent inventory changes';
  $('notificationList').innerHTML=notifications.map(event=>`<button type="button" class="notification-item${event.isNew?' notification-unread':''}" data-notification-id="${esc(event.eventId||'')}" data-notification-part="${esc(event.id)}"><span class="notification-status">${event.isNew?'●':''}</span><span class="notification-copy"><b>${esc(event.event)} · ${esc(event.name)}</b><small>${esc(event.detail)}</small><small>${esc(event.time)}${event.actor?` · ${esc(event.actor)}`:''}</small></span></button>`).join('')||'<div class="notification-empty">No inventory changes yet.</div>';
}
function updateUserDisplay(){
  const isAdmin=roleMode==='admin',name=isAdmin?'Admin':'Harris Racing',role=isAdmin?'System administrator':'Team member',initials=isAdmin?'AD':'HR';
  $('userSelect').value=roleMode;
  $('profileName').textContent=$('sidebarUserName').textContent=name;
  $('profileRole').textContent=$('roleLabel').textContent=role;
  $('profileAvatar').textContent=$('sidebarAvatar').textContent=initials;
}
function switchUser(user){
  roleMode=user==='team'?'team':'admin';
  if(roleMode==='team')activeTeam='Harris Racing';
  try{localStorage.setItem('partstrack.activeUser',roleMode)}catch{toast('The selected demo user could not be saved in this browser.')}
  render();toast(`Switched to ${roleMode==='admin'?'Admin':'Harris Racing'}.`);
}
function toggleNotifications(){
  const panel=$('notificationPanel'),opening=panel.classList.contains('hidden');
  panel.classList.toggle('hidden',!opening);
  $('alertsBtn').setAttribute('aria-expanded',String(opening));
  if(opening)renderNotifications();
}
function markNotificationsRead(){
  for(const event of eventsInScope())event.isNew=false;
  save();renderNotifications();
}
function openPart(id){const p=parts.find(x=>x.id===id);if(!p)return;const history=p.history||[{stage:p.stage,location:p.location,date:p.updated,detail:'Current lifecycle record'}];$('modalTitle').textContent=p.name;$('partModalBody').innerHTML=`<div class="detail-layout"><div><div class="detail-hero">${p.icon}</div><div class="detail-actions"><button class="btn btn-primary" data-stock="${esc(p.id)}" data-delta="1">＋ Add stock</button><button class="btn btn-secondary" data-stock="${esc(p.id)}" data-delta="-1">− Remove 1</button><button class="btn btn-secondary" data-stage="${esc(p.id)}">Update lifecycle</button></div></div><div class="detail-info"><span class="part-id">${esc(p.id)} · ${esc(p.manufacturer)}</span><h3>${esc(p.name)}</h3><span class="status-pill ${statusClass(stockStatus(p))}">${stockStatus(p)}</span><p>${esc(p.description||'No description supplied.')}</p><div class="detail-specs"><div class="detail-spec"><small>Current stock</small><b>${p.qty} units</b></div><div class="detail-spec"><small>Minimum stock</small><b>${p.min} units</b></div><div class="detail-spec"><small>Category</small><b>${esc(p.category)}</b></div><div class="detail-spec"><small>Owning team</small><b>${esc(p.team)}</b></div><div class="detail-spec"><small>Current location</small><b>${esc(p.location)}</b></div><div class="detail-spec"><small>Lifecycle stage</small><b>${esc(p.stage)}</b></div></div></div></div><div class="detail-timeline"><h3>Lifecycle history</h3>${history.slice().reverse().map(h=>`<div class="detail-event"><div><b>${esc(h.stage)}</b><small>${esc(h.date||'')} · ${esc(h.location||p.location)} — ${esc(h.detail||'Lifecycle update')}</small></div></div>`).join('')}</div>`;$('partModal').classList.remove('hidden')}
function updateStock(id,delta){const p=parts.find(x=>x.id===id);if(!p)return;let amount=1;if(delta===1){const raw=prompt(`How many units should be added to ${p.name}?`,'10');if(raw===null)return;amount=Number(raw);if(!Number.isInteger(amount)||amount<=0||amount>1000000){toast('Enter a whole number greater than zero.');return}}else{const raw=prompt(`How many units should be removed from ${p.name}?`,'1');if(raw===null)return;amount=Number(raw);if(!Number.isInteger(amount)||amount<=0||amount>p.qty){toast('Enter a valid quantity not exceeding current stock.');return}}p.qty+=delta*amount;p.updated=new Date().toLocaleString();events.unshift({id:p.id,name:p.name,event:delta===1?'Stock received':'Stock removed',detail:`${delta===1?'+':'−'}${amount} units · ${p.location}`,time:'Just now',icon:delta===1?'＋':'−'});save();render();openPart(id);toast('Stock updated successfully.')}
function updateStage(id){const p=parts.find(x=>x.id===id);if(!p)return;const stage=prompt('Enter lifecycle stage: '+lifecycleStages.join(', '),p.stage);if(stage===null)return;const match=lifecycleStages.find(s=>s.toLowerCase()===stage.trim().toLowerCase());if(!match){toast('Choose one of the listed lifecycle stages.');return}const location=prompt('Current location or organisation:',p.location);if(location===null)return;const detail=prompt('Reason / notes (optional):','Lifecycle status updated');p.stage=match;p.location=location.trim()||p.location;p.updated=new Date().toLocaleString();p.history=p.history||[];p.history.push({stage:match,location:p.location,date:new Date().toLocaleDateString(),detail:detail||'Lifecycle status updated'});events.unshift({id:p.id,name:p.name,event:match,detail:`Location: ${p.location}`,time:'Just now',icon:'◷'});save();render();openPart(id);toast('Lifecycle record updated.')}
function addPart(form){const fd=new FormData(form);const id=String(fd.get('id')).trim().toUpperCase();if(parts.some(p=>p.id.toLowerCase()===id.toLowerCase())){toast('That part ID already exists.');return}const p={id,name:String(fd.get('name')).trim(),category:fd.get('category'),qty:Number(fd.get('qty')),min:Number(fd.get('min')),location:String(fd.get('location')).trim(),team:fd.get('team'),stage:fd.get('stage'),manufacturer:roleMode==='admin'?activeManufacturer:activeManufacturer,icon:({Motors:'🔧',Bearings:'⚙️',Gears:'⚙️',Hydraulics:'🛠️',Electrical:'▣',Fasteners:'🔩'})[fd.get('category')]||'⬡',description:String(fd.get('description')).trim(),updated:new Date().toLocaleString(),history:[{stage:fd.get('stage'),location:String(fd.get('location')).trim(),date:new Date().toLocaleDateString(),detail:'Part registered in inventory'}]};parts.unshift(p);events.unshift({id:p.id,name:p.name,event:'Part registered',detail:`${p.qty} units · ${p.location}`,time:'Just now',icon:'＋'});save();form.reset();$('addModal').classList.add('hidden');render();goPage('inventory');toast(`${p.name} added to inventory.`)}
function goPage(page){currentPage=page;document.querySelectorAll('.page-section').forEach(el=>el.classList.add('hidden'));$(page+'Page').classList.remove('hidden');document.querySelectorAll('.nav-item[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));const labels={dashboard:'Dashboard',inventory:'Parts inventory',lifecycle:'Lifecycle tracking',transactions:'Stock transactions',teams:'Team parts'};$('crumbTitle').textContent=labels[page];$('pageTitle').innerHTML=labels[page]+(page==='dashboard'?' <span class="wave">✦</span>':'');if(page==='dashboard')$('pageTitle').textContent=`${roleMode==='admin'?'Admin':'Harris Racing'} dashboard`;window.scrollTo({top:0,behavior:'smooth'});document.querySelector('.sidebar').classList.remove('open')}
function toast(message){const t=$('toast');t.textContent=message;t.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove('show'),2600)}
document.addEventListener('click',e=>{const nav=e.target.closest('[data-page]');if(nav){goPage(nav.dataset.page);return}const go=e.target.closest('[data-goto]');if(go){goPage(go.dataset.goto);return}const view=e.target.closest('[data-view]');if(view){openPart(view.dataset.view);return}const card=e.target.closest('[data-part]');if(card){openPart(card.dataset.part);return}const close=e.target.closest('[data-close]');if(close){$(close.dataset.close).classList.add('hidden');return}const stock=e.target.closest('[data-stock]');if(stock){updateStock(stock.dataset.stock,Number(stock.dataset.delta));return}const stage=e.target.closest('[data-stage]');if(stage){updateStage(stage.dataset.stage);return}});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-part]')){e.preventDefault();openPart(e.target.dataset.part)}if(e.key==='Escape'){document.querySelectorAll('.modal-backdrop').forEach(m=>m.classList.add('hidden'));$('notificationPanel').classList.add('hidden');$('alertsBtn').setAttribute('aria-expanded','false')}});
$('addPartBtn').onclick=$('inventoryAddBtn').onclick=()=>$('addModal').classList.remove('hidden');$('addPartForm').addEventListener('submit',e=>{e.preventDefault();addPart(e.target)});$('userSelect').addEventListener('change',e=>switchUser(e.target.value));$('partSearch').addEventListener('input',e=>renderCards(scopedParts(),e.target.value));$('statusFilter').addEventListener('change',()=>renderCards(scopedParts(),$('partSearch').value));['inventorySearch','categoryFilter','inventoryStatus'].forEach(id=>$(id).addEventListener('input',()=>renderTable(scopedParts())));$('globalSearch').addEventListener('input',e=>{const q=e.target.value;$('partSearch').value=q;$('inventorySearch').value=q;renderCards(scopedParts(),q);if(q.trim())goPage('dashboard')});$('privacyBtn').onclick=()=>$('privacyModal').classList.remove('hidden');$('dismissNotice').onclick=()=>$('demoNotice').classList.add('hidden');$('mobileMenu').onclick=()=>document.querySelector('.sidebar').classList.toggle('open');$('alertsBtn').onclick=toggleNotifications;$('markNotificationsRead').onclick=markNotificationsRead;$('exportBtn').onclick=exportCsv;
const conditionOptions=['In use','Not in use','Donated','Broken'];
function conditionOf(part){if(conditionOptions.includes(part.condition))return part.condition;if(part.stage==='Donated')return 'Donated';if(part.stage==='In storage'||part.stage==='Recycled'||part.stage==='Decommissioned')return 'Not in use';return part.stage==='Broken'?'Broken':'In use'}
function renderTeamManagement(){
  const teams=roleMode==='team'?['Harris Racing']:[...new Set(['Harris Racing','Warehouse','Assembly','Maintenance','R&D',...parts.map(p=>p.team).filter(Boolean)])];
  const teamSelect=$('teamSelect');
  if(!teams.includes(activeTeam))activeTeam=teams[0];
  teamSelect.innerHTML=teams.map(team=>`<option value="${esc(team)}">${esc(team)}</option>`).join('');
  teamSelect.value=activeTeam;
  teamSelect.closest('.scope-select').classList.toggle('hidden',roleMode==='team');
  const teamParts=parts.filter(p=>p.team===activeTeam);
  const colors={'In use':'#23b987','Not in use':'#8c69e8','Donated':'#edb34f','Broken':'#d84c5b'};
  $('conditionSummary').innerHTML=conditionOptions.map(condition=>{
    const matches=teamParts.filter(p=>conditionOf(p)===condition);
    const units=matches.reduce((sum,p)=>sum+p.qty,0);
    return `<article class="condition-card"><div class="condition-card-top"><span class="condition-dot" style="background:${colors[condition]}"></span><b>${condition}</b></div><strong>${matches.length}</strong><span>parts · ${units.toLocaleString()} units</span></article>`;
  }).join('');
  const totals=conditionOptions.map(condition=>({condition,units:teamParts.filter(p=>conditionOf(p)===condition).reduce((sum,p)=>sum+p.qty,0)}));
  const maxUnits=Math.max(1,...totals.map(item=>item.units));
  $('conditionChart').innerHTML=totals.map(item=>`<div class="condition-bar-row"><span>${item.condition}</span><div class="condition-bar-track"><i style="width:${item.units/maxUnits*100}%;background:${colors[item.condition]}"></i></div><b>${item.units.toLocaleString()}</b></div>`).join('');
  const query=$('teamSearch').value.trim().toLowerCase();
  const filter=$('teamConditionFilter').value;
  const visible=teamParts.filter(p=>(filter==='all'||conditionOf(p)===filter)&&[p.id,p.name,p.location,p.category].join(' ').toLowerCase().includes(query));
  $('teamPartCount').textContent=`${teamParts.length} parts assigned to ${activeTeam}.`;
  $('teamPartsTable').innerHTML=visible.length?`<table><thead><tr><th>Part number</th><th>Part</th><th>Location</th><th>Quantity</th><th>Condition</th><th>Actions</th></tr></thead><tbody>${visible.map(p=>`<tr><td><b>${esc(p.id)}</b></td><td><div class="table-part"><span class="part-art">${esc(p.icon)}</span><span><b>${esc(p.name)}</b><small>${esc(p.category)} · ${esc(p.manufacturer)}</small></span></div></td><td>${esc(p.location)}</td><td><b>${p.qty.toLocaleString()}</b></td><td><span class="condition-label condition-${conditionOf(p).toLowerCase().replaceAll(' ','-')}">${conditionOf(p)}</span></td><td><div class="row-actions"><button class="mini-link" data-stock="${esc(p.id)}" data-delta="1" aria-label="Add one ${esc(p.name)}">+1</button><button class="mini-link" data-stock="${esc(p.id)}" data-delta="-1" aria-label="Remove one ${esc(p.name)}">−1</button><button class="mini-link" data-edit="${esc(p.id)}">Edit</button><button class="mini-link remove-link" data-delete="${esc(p.id)}">Remove</button></div></td></tr>`).join('')}</tbody></table>`:'<div class="empty-state">No parts match this team and filter.</div>';
}
function renderTable(data){
  const categorySelect=$('categoryFilter'),selectedCategory=categorySelect.value;
  const categories=[...new Set([...Array.from(categorySelect.options,option=>option.value).filter(value=>value!=='all'),...parts.map(part=>part.category).filter(Boolean)])];
  categorySelect.innerHTML='<option value="all">All categories</option>'+categories.map(category=>`<option value="${esc(category)}">${esc(category)}</option>`).join('');
  categorySelect.value=categories.includes(selectedCategory)?selectedCategory:'all';
  const query=$('inventorySearch').value.trim().toLowerCase(),category=categorySelect.value,status=$('inventoryStatus').value;
  const rows=data.filter(p=>[p.id,p.name,p.category,p.location,p.team].join(' ').toLowerCase().includes(query)&&(category==='all'||p.category===category)&&(status==='all'||stockStatus(p).toLowerCase()===status.toLowerCase()));
  $('inventoryTable').innerHTML=rows.length?`<table><thead><tr><th>Part number</th><th>Manufacturer / team</th><th>Location</th><th>Stock</th><th>Condition</th><th>Actions</th></tr></thead><tbody>${rows.map(p=>`<tr><td><b>${esc(p.id)}</b><br><small>${esc(p.name)} · ${esc(p.category)}</small></td><td>${esc(p.manufacturer)}<br><small>${esc(p.team)}</small></td><td>${esc(p.location)}</td><td><b>${p.qty.toLocaleString()}</b> <small>/ min ${p.min}</small></td><td>${conditionOf(p)}</td><td><div class="row-actions"><button class="mini-link" data-view="${esc(p.id)}">Open</button><button class="mini-link" data-edit="${esc(p.id)}">Edit</button><button class="mini-link remove-link" data-delete="${esc(p.id)}">Remove</button></div></td></tr>`).join('')}</tbody></table>`:'<div class="empty-state">No matching parts.</div>';
}
function populateFormSelect(name,extraValues,selected){
  const field=$('addPartForm').elements[name];
  const allowed=roleMode==='team'&&name==='team'?['Harris Racing']:[...Array.from(field.options,option=>option.value),...extraValues,selected];
  const values=[...new Set(allowed.filter(Boolean))];
  field.innerHTML=values.map(value=>`<option value="${esc(value)}">${esc(value)}</option>`).join('');
  field.value=selected||values[0]||'';
}
function openAddForm(team=activeTeam){
  editingPartId=null;
  const form=$('addPartForm');
  form.reset();
  populateFormSelect('team',parts.map(part=>part.team),team);
  populateFormSelect('category',parts.map(part=>part.category),form.elements.category.value);
  populateFormSelect('stage',parts.map(part=>part.stage),form.elements.stage.value);
  form.elements.id.readOnly=false;
  $('addModalTitle').textContent='Add a part';
  $('addModalDescription').textContent='Create a new part tracking record.';
  form.querySelector('[type="submit"]').textContent='Save part';
  $('addModal').classList.remove('hidden');
}
function editPart(id){
  const part=parts.find(item=>item.id===id);
  if(!part)return;
  editingPartId=id;
  const form=$('addPartForm');
  form.reset();
  for(const field of ['name','id','category','qty','min','location','team','stage','description'])form.elements[field].value=part[field]??'';
  populateFormSelect('team',parts.map(item=>item.team),part.team);
  populateFormSelect('category',parts.map(item=>item.category),part.category);
  populateFormSelect('stage',parts.map(item=>item.stage),part.stage);
  form.elements.condition.value=conditionOf(part);
  form.elements.id.readOnly=true;
  $('addModalTitle').textContent='Update part';
  $('addModalDescription').textContent='Update part details, team, location, stock, or condition.';
  form.querySelector('[type="submit"]').textContent='Save changes';
  $('addModal').classList.remove('hidden');
}
function addPart(form){
  const values=Object.fromEntries(new FormData(form).entries());
  const id=String(values.id).trim();
  if(!id){toast('Enter a part number.');return}
  const now=new Date().toLocaleString();
  if(editingPartId){
    const part=parts.find(item=>item.id===editingPartId);
    if(!part){toast('This part no longer exists.');return}
    const previousStage=part.stage,previousLocation=part.location;
    Object.assign(part,{name:String(values.name).trim(),category:values.category,qty:Number(values.qty),min:Number(values.min),location:String(values.location).trim(),team:values.team,condition:values.condition,stage:values.stage,description:String(values.description).trim(),updated:now});
    if(previousStage!==part.stage||previousLocation!==part.location){part.history=part.history||[];part.history.push({stage:part.stage,location:part.location,date:new Date().toLocaleDateString(),detail:'Part details updated'})}
    recordChange({id:part.id,name:part.name,team:part.team,event:'Part details updated',detail:`${part.condition} · ${part.location}`,icon:'✎'});
    editingPartId=null;
    save();$('addModal').classList.add('hidden');render();toast(`${part.name} updated.`);return;
  }
  if(parts.some(part=>part.id.toLowerCase()===id.toLowerCase())){toast('That part number already exists.');return}
  const category=String(values.category);
  const part={id,name:String(values.name).trim(),category,qty:Number(values.qty),min:Number(values.min),location:String(values.location).trim(),team:String(values.team),condition:String(values.condition),stage:String(values.stage),manufacturer:activeManufacturer,icon:({Motors:'🔧',Bearings:'⚙️',Gears:'⚙️',Hydraulics:'🛠️',Electrical:'▣',Fasteners:'🔩'})[category]||'⬡',description:String(values.description).trim(),updated:now,history:[{stage:String(values.stage),location:String(values.location).trim(),date:new Date().toLocaleDateString(),detail:'Part registered in inventory'}]};
  parts.unshift(part);recordChange({id:part.id,name:part.name,team:part.team,event:'Part registered',detail:`${part.qty} units · ${part.location}`,icon:'＋'});editingPartId=null;save();form.reset();$('addModal').classList.add('hidden');render();if(currentPage!=='teams')goPage('inventory');toast(`${part.name} added to inventory.`);
}
function updateStock(id,delta){
  const part=parts.find(item=>item.id===id);
  if(!part)return;
  if(delta<0&&part.qty<1){toast('There are no units available to remove.');return}
  if(delta>0&&part.qty>=1000000){toast('Quantity limit reached.');return}
  part.qty+=delta;part.updated=new Date().toLocaleString();recordChange({id:part.id,name:part.name,team:part.team,event:delta>0?'Stock received':'Stock removed',detail:`${delta>0?'+1':'−1'} unit · ${part.location}`,icon:delta>0?'＋':'−'});save();render();toast('Stock updated.');
}
function updateStage(id){editPart(id)}
function removePart(id){
  const index=parts.findIndex(item=>item.id===id);
  if(index<0)return;
  if(!confirm(`Remove ${parts[index].name} from inventory?`))return;
  const [part]=parts.splice(index,1);
  recordChange({id:part.id,name:part.name,team:part.team,event:'Part removed',detail:'Removed from the active inventory',icon:'−'});
  save();render();toast(`${part.name} removed from inventory.`);
}
function parseCsv(text){
  const rows=[];let row=[],cell='',quoted=false;
  for(let i=0;i<text.length;i++){
    const char=text[i];
    if(quoted&&char==='"'&&text[i+1]==='"'){cell+='"';i++}
    else if(char==='"')quoted=!quoted;
    else if(char===','&&!quoted){row.push(cell);cell=''}
    else if((char==='\n'||char==='\r')&&!quoted){if(char==='\r'&&text[i+1]==='\n')i++;row.push(cell);if(row.some(value=>value.trim()))rows.push(row);row=[];cell=''}
    else cell+=char;
  }
  if(quoted)throw new Error('CSV contains an unclosed quoted field.');
  row.push(cell);if(row.some(value=>value.trim()))rows.push(row);
  if(rows.length<2)throw new Error('CSV needs a header row and at least one part.');
  const headers=rows.shift().map(value=>value.trim().replace(/^\uFEFF/,'').toLowerCase().replace(/[^a-z0-9]/g,''));
  const column=(...names)=>headers.findIndex(header=>names.includes(header));
  const idColumn=column('id','partid','partnumber','mpn','manufacturerpartnumber');
  const nameColumn=column('name','partname','description');
  const qtyColumn=column('qty','quantity','stock','currentquantity');
  if(idColumn<0||nameColumn<0||qtyColumn<0)throw new Error('CSV must include Part ID/Part Number, Part Name, and Quantity columns.');
  const optional={category:column('category'),min:column('min','minimum','minimumstock'),location:column('location'),team:column('team','owningteam'),manufacturer:column('manufacturer','brand'),condition:column('condition'),stage:column('stage','lifecyclestage'),description:column('notes','description')};
  const seen=new Set();
  return rows.map((cells,index)=>{
    const at=i=>i<0?'':String(cells[i]??'').trim();
    const id=at(idColumn),name=at(nameColumn),qty=Number(at(qtyColumn));
    if(!id||!name||!Number.isInteger(qty)||qty<0||qty>1000000)throw new Error(`Invalid part number, name, or quantity on CSV row ${index+2}.`);
    if(seen.has(id.toLowerCase()))throw new Error(`Part number "${id}" appears more than once in the CSV.`);
    seen.add(id.toLowerCase());
    const result={id,name,qty};
    for(const [key,columnIndex] of Object.entries(optional))if(columnIndex>=0)result[key]=at(columnIndex);
    if(result.min!==undefined&&result.min!==''&&(!Number.isInteger(Number(result.min))||Number(result.min)<0))throw new Error(`Invalid minimum stock on CSV row ${index+2}.`);
    if(result.condition&&!conditionOptions.includes(result.condition))throw new Error(`Unknown condition on CSV row ${index+2}. Use In use, Not in use, Donated, or Broken.`);
    return result;
  });
}
async function importParts(file){
  try{
    const rows=parseCsv(await file.text());
    for(const row of rows){
      const current=parts.find(item=>item.id.toLowerCase()===row.id.toLowerCase());
      const category=row.category||current?.category||'Other';
      const condition=row.condition||(current?conditionOf(current):'In use');
      const location=row.location||current?.location||'Warehouse A';
      const team=row.team||current?.team||activeTeam;
      const manufacturer=row.manufacturer||current?.manufacturer||activeManufacturer;
      const stage=row.stage||current?.stage||(condition==='Donated'?'Donated':condition==='Not in use'?'In storage':'In use');
      const icon=({Motors:'🔧',Bearings:'⚙️',Gears:'⚙️',Hydraulics:'🛠️',Electrical:'▣',Fasteners:'🔩'})[category]||'⬡';
      if(current){Object.assign(current,{...row,category,condition,location,team,manufacturer,stage,icon,min:row.min===''||row.min===undefined?current.min:Number(row.min),description:row.description||current.description,updated:new Date().toLocaleString()});recordChange({id:current.id,name:current.name,team,event:'Part inventory updated',detail:`${current.qty} units · ${current.location}`,icon:'↻'})}
      else{parts.push({...row,category,condition,location,team,manufacturer,stage,min:row.min===''||row.min===undefined?0:Number(row.min),description:row.description||'',icon,updated:new Date().toLocaleString(),history:[]});recordChange({id:row.id,name:row.name,team,event:'Part imported',detail:`${row.qty} units · ${location}`,icon:'＋'})}
    }
    save();render();toast(`${rows.length} CSV part record${rows.length===1?'':'s'} imported or updated.`);
  }catch(error){toast(error instanceof Error?error.message:'Could not import this CSV file.')}
}
function exportCsv(){
  const rows=[['Part ID','Part Name','Manufacturer','Team','Location','Quantity','Minimum','Condition','Lifecycle Stage'],...scopedParts().map(p=>[p.id,p.name,p.manufacturer,p.team,p.location,p.qty,p.min,conditionOf(p),p.stage])];
  const csv=rows.map(row=>row.map(value=>'"'+String(value).replaceAll('"','""')+'"').join(',')).join('\r\n');
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='partstrack-inventory.csv';link.click();URL.revokeObjectURL(url);toast('Inventory CSV exported.');
}
const addModalDescription=document.createElement('p');
addModalDescription.id='addModalDescription';
addModalDescription.textContent='Create a new part tracking record.';
$('addModalTitle').after(addModalDescription);
const conditionField=document.createElement('label');
conditionField.innerHTML=`Condition<select name="condition">${conditionOptions.map(value=>`<option>${value}</option>`).join('')}</select>`;
$('addPartForm').querySelector('[name="stage"]').closest('label').before(conditionField);
$('addPartForm').elements.id.maxLength=80;
$('addPartForm').elements.id.placeholder='e.g. manufacturer part number';
$('addPartBtn').onclick=$('inventoryAddBtn').onclick=()=>openAddForm();
$('teamAddBtn').onclick=()=>openAddForm(activeTeam);
$('teamSelect').addEventListener('change',event=>{activeTeam=event.target.value;render()});
$('teamSearch').addEventListener('input',renderTeamManagement);
$('teamConditionFilter').addEventListener('change',renderTeamManagement);
$('importBtn').onclick=()=>$('importFile').click();
$('importFile').addEventListener('change',event=>{const file=event.target.files[0];if(file)importParts(file);event.target.value=''});
$('exportBtn').onclick=exportCsv;
document.addEventListener('click',event=>{const notification=event.target.closest('[data-notification-id]');if(notification){const item=events.find(entry=>entry.eventId===notification.dataset.notificationId);if(item)item.isNew=false;save();renderNotifications();$('notificationPanel').classList.add('hidden');$('alertsBtn').setAttribute('aria-expanded','false');if(parts.some(part=>part.id===notification.dataset.notificationPart))openPart(notification.dataset.notificationPart);return}if(!event.target.closest('.notification-wrap')){$('notificationPanel').classList.add('hidden');$('alertsBtn').setAttribute('aria-expanded','false')}});
document.addEventListener('click',event=>{
  const edit=event.target.closest('[data-edit]');if(edit){editPart(edit.dataset.edit);return}
  const remove=event.target.closest('[data-delete]');if(remove){removePart(remove.dataset.delete);return}
});
render()
