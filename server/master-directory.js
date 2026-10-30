import {rankingFacts,scoreMaster,applyPointsAdjustment} from "./ranking-points.js";
import {ageFromBirthDate} from "./profile-age.js";
import {readFile} from 'node:fs/promises';
const catalog=JSON.parse(await readFile(new URL('./master-catalog.json',import.meta.url),'utf8'));
export const catalogContentId=id=>catalog.find(m=>m.id===id)?.contentId;
export const catalogIds=new Set(catalog.map(m=>m.id));
const text=(v,n=1000)=>String(v??'').slice(0,n);
export function bookingContact(value) {
  if(!value)return '';
  try {const u=new URL(value);return u.protocol==='https:' && ['t.me','telegram.me'].includes(u.hostname) && !u.username && !u.password && !u.port && /^\/(?:[a-zA-Z0-9_]{3,64}|m\/[a-zA-Z0-9_-]{1,128})\/?$/.test(u.pathname) && !['share','proxy','joinchat','addstickers'].includes(u.pathname.slice(1)) ? u.href : '';}catch{return '';}
}
export function safeAvatar(value) {return typeof value==='string' && value.length<=90000 && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(value)?value:'';}
const localized=v=>typeof v==='object'?v?.ru||'':v||'';
export async function masterDirectory(db,{period='all',includeInactive=false}={}) {
  const [{rows:users},{rows:content},{rows:links},{rows:media}]=await Promise.all([
    db.query(`SELECT u.id,u.name,u.role,u.active,u.profile,
      COUNT(b.id) FILTER (WHERE b.status IN ('confirmed','invoiced','completed') AND ($1='all' OR (b.starts_at >= (date_trunc('month',now() AT TIME ZONE 'Europe/Moscow') AT TIME ZONE 'Europe/Moscow') AND b.starts_at < ((date_trunc('month',now() AT TIME ZONE 'Europe/Moscow') + interval '1 month') AT TIME ZONE 'Europe/Moscow'))))::int AS bookings,
      COUNT(b.id) FILTER (WHERE b.status='completed' AND ($1='all' OR (b.starts_at >= (date_trunc('month',now() AT TIME ZONE 'Europe/Moscow') AT TIME ZONE 'Europe/Moscow') AND b.starts_at < ((date_trunc('month',now() AT TIME ZONE 'Europe/Moscow') + interval '1 month') AT TIME ZONE 'Europe/Moscow'))))::int AS completed
      FROM users u LEFT JOIN bookings b ON b.user_id=u.id WHERE u.deleted_at IS NULL AND u.account_type='master' AND u.role IN ('guest','resident') GROUP BY u.id`,[period]),
    db.query("SELECT id,data FROM content WHERE id LIKE 'master-%'"),db.query('SELECT * FROM master_links'),
    db.query('SELECT id,user_id,kind,caption,position FROM master_media ORDER BY position,created_at,id')
  ]);
  const points=await rankingFacts(db,{period});
  const byUser=new Map(users.map(u=>[u.id,u])),byContent=new Map(content.map(c=>[c.id,c.data]));
  const gallery=(id,kind)=>media.filter(m=>m.user_id===id&&m.kind===kind).map(m=>({id:m.id,src:'/api/media/'+m.id,thumb:'/api/media/'+m.id+'?size=thumb',cap:m.caption}));
  const fromUser=(u,base={})=>{
    const p=u.profile||{},resident=u.role==='resident';
    const master={...base,id:base.id||u.id,name:u.name,resident,active:u.active,registered:true,
      city:['Москва','СПБ'].includes(p.city)?p.city:(base.city||''),avatar:safeAvatar(p.avatar)||base.avatar||'',
      bio:p.bio===undefined?base.bio||'':text(p.bio),specialty:p.specialty===undefined?base.specialty||'':text(p.specialty,100),
      status:text(p.status,160),
      age:p.birthDate?ageFromBirthDate(p.birthDate):(Number.isInteger(p.age)?p.age:base.age||null),exp:text(p.experience,80)||base.exp||'',
      bookingLink:p.adminBookingLink===undefined?base.bookingLink||'':bookingContact(p.adminBookingLink),rankingVisible:p.rankingVisible!==false,
      completed:u.completed,bookings:u.bookings,score:0,
      portfolio:p.galleryManaged?gallery(u.id,'portfolio'):base.portfolio||[],
      drafts:p.galleryManaged?gallery(u.id,'drafts'):base.drafts||[]};
    return applyPointsAdjustment({...master,...scoreMaster(master,points.byUser.get(u.id)||{},points.rules)},p.adminPointsAdjustment);
  };
  const linked=new Set(links.map(l=>l.user_id));
  const result=catalog.map(m=>{
    const c=byContent.get(m.contentId)||{};
    const base={id:m.id,name:c.title||localized(m.name),city:localized(m.city),age:m.age,exp:localized(m.exp),avatar:m.photo,
      bio:c.body||localized(m.bio),specialty:c.specialty||'',resident:m.resident===true,active:true,registered:false,featured:c.featured!==false,rankingVisible:true,
      bookingLink:bookingContact(c.bookingLink),completed:0,bookings:0,score:0,
      portfolio:(c.portfolio?.length?c.portfolio.map(f=>({src:'assets/works/'+f+'.png',cap:''})):m.portfolio.map(w=>({...w,cap:''}))),
      drafts:(c.drafts?.length?c.drafts.map(f=>({src:'assets/works/'+f+'.png',cap:''})):m.drafts.map(w=>({...w,cap:''})))};
    const link=links.find(l=>l.master_id===m.id);return link?(byUser.has(link.user_id)?fromUser(byUser.get(link.user_id),base):{...base,active:false}):applyPointsAdjustment(base,c.pointsAdjustment);
  });
  return [...result,...users.filter(u=>!linked.has(u.id)).map(u=>fromUser(u,{featured:true}))].filter(m=>includeInactive||m.active).map(({active,...m})=>m);
}
