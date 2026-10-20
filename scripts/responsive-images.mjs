import sharp from 'sharp';
import {readdir,readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {basename,extname} from 'node:path';
export async function responsiveImages() {
  const manifest={};let originals=0,small=0;
  await mkdir('dist/assets/responsive',{recursive:true});
  for(const folder of ['masters','works'])for(const file of await readdir('assets/'+folder)){
    if(!/\.(png|jpe?g)$/i.test(file))continue;
    const path='assets/'+folder+'/'+file,input=await readFile(path),metadata=await sharp(input).metadata();
    const hash=createHash('sha256').update(input).update('responsive-v1-webp88').digest('hex').slice(0,12),variants=[];
    for(const width of [...new Set([160,320,640].map(w=>Math.min(w,metadata.width)))]){
      const target=`assets/responsive/${basename(file,extname(file))}-${hash}-${width}.webp`;
      const {data,info}=await sharp(input).rotate().resize({width,withoutEnlargement:true}).webp({quality:88}).toBuffer({resolveWithObject:true});
      await writeFile('dist/'+target,data);variants.push({src:target,width:info.width,size:data.length});
    }
    originals+=input.length;small+=variants[0].size;
    manifest[path]={small:variants[0].src,src:variants.at(-1).src,srcset:variants.map(v=>`${v.src} ${v.width}w`).join(', '),width:metadata.width,height:metadata.height};
  }
  await writeFile('dist/js/image-sources.js','window.PhotoSources='+JSON.stringify(manifest)+';\n');
  console.log(`Responsive photos: ${Object.keys(manifest).length} originals; thumbnail transfer ${(100-small/originals*100).toFixed(1)}% smaller.`);
}
