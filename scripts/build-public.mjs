import {responsiveImages} from "./responsive-images.mjs";
import {mkdir,cp,readFile,writeFile,rm} from 'node:fs/promises';
import {defaults} from '../server/domain.js';
await rm('dist',{recursive:true,force:true});await mkdir('dist');
for(const folder of ['assets','css','js'])await cp(folder,`dist/${folder}`,{recursive:true});
await responsiveImages();
const html=(await readFile('index.html','utf8')).replace('<script src="js/pages.js">','<script src="js/image-sources.js"></script>\n<script src="js/pages.js">');
await writeFile('dist/index.html',html.replace('<script src="js/sound.js">','<script src="public-mode.js"></script>\n<script src="js/sound.js">'));
// Превью-сборки Vercel работают в тестовом режиме со своей базой (api/demo.js).
const demo=process.env.VERCEL_ENV==='preview'||process.env.OFFICE_DEMO==='1';
await writeFile('dist/public-mode.js','window.OFFICE_PUBLIC_ONLY = false;\n'+(demo?'window.OFFICE_API_BASE = "/api/demo";\n':''));
await writeFile('dist/public-data.json',JSON.stringify({settings:defaults,resources:[],catalog:[],content:[],telegramEnabled:false,paymentEnabled:false}));
console.log('Site built: static assets; API requests are proxied to the separate server.');
