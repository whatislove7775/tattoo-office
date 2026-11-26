import {masterRanking} from './ranking.js';
import {rankingYear} from './ranking-points.js';

const samplePrizes=['День работы в Tattoo Office','Сертификат Tattoo Office Shop на 3 000 ₽','Набор расходников Tattoo Office Shop'];

// Call inside a transaction. Lock the old season before publishing its final podium.
export async function openRankingSeason(q,year=rankingYear()){
  const {rows}=await q.query('SELECT year,prizes FROM ranking_seasons WHERE year < $1 AND winners IS NULL ORDER BY year FOR UPDATE',[year]);
  for(const season of rows){
    const {masters}=await masterRanking(q,{period:'year',year:season.year});
    const winners=masters.filter(m=>m.score>0).slice(0,3).map(({id,name,rank,score})=>({id,name,rank,score}));
    await q.query('UPDATE ranking_seasons SET winners=$2 WHERE year=$1',[season.year,JSON.stringify(winners)]);
  }
  const existing=(await q.query('SELECT year,prizes,examples FROM ranking_seasons WHERE year=$1',[year])).rows[0];
  if(existing)return existing;
  const first=!(await q.query('SELECT year FROM ranking_seasons LIMIT 1')).rows.length;
  await q.query('INSERT INTO ranking_seasons(year,prizes,examples) VALUES($1,$2,$3) ON CONFLICT DO NOTHING',
    [year,JSON.stringify(first?samplePrizes:['','','']),first]);
  return (await q.query('SELECT year,prizes,examples FROM ranking_seasons WHERE year=$1',[year])).rows[0];
}

export async function currentRankingSeason(db){
  const year=rankingYear();
  return (await db.query('SELECT year,prizes,examples FROM ranking_seasons WHERE year=$1',[year])).rows[0]
    ?? db.transaction(q=>openRankingSeason(q,year));
}
