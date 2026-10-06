import {mkdir,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {defaults} from '../server/domain.js';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const folder of ['assets','css','js'])await cp(folder,`dist/${folder}`,{recursive:true});
const html=await readFile('index.html','utf8');
await writeFile('dist/index.html',html.replace('<script src="js/sound.js">','<script src="public-mode.js"></script>\n<script src="js/sound.js">'));
await writeFile('dist/public-mode.js','window.OFFICE_PUBLIC_ONLY = true;\n');
await writeFile('dist/public-data.json',JSON.stringify({settings:defaults,resources:[],catalog:[],content:[],telegramEnabled:false,paymentEnabled:false}));
console.log('Public site built: assets only; no server, secrets or database included.');
