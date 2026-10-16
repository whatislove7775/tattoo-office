export const moscowDate=(now=new Date())=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
export function ageFromBirthDate(value,now=new Date()) {
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
  const [y,m,d]=value.split('-').map(Number),date=new Date(Date.UTC(y,m-1,d));
  if(date.getUTCFullYear()!==y||date.getUTCMonth()!==m-1||date.getUTCDate()!==d)return null;
  const [year,month,day]=moscowDate(now).split('-').map(Number);
  return year-y-(month<m||(month===m&&day<d)?1:0);
}
