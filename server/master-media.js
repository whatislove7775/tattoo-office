import {fail} from './domain.js';
export function jpegPayload(value,max) {
  if(typeof value!=='string'||value.length>max||!/^data:image\/jpeg;base64,[A-Za-z0-9+/]+={0,2}$/.test(value))fail('Выберите фотографию JPG, PNG или WebP');
  const bytes=Buffer.from(value.split(',')[1],'base64');
  if(bytes.length<4||bytes[0]!==255||bytes[1]!==216||bytes.at(-2)!==255||bytes.at(-1)!==217)fail('Не удалось прочитать фотографию');
  return value;
}
export const mediaView=m=>({id:m.id,kind:m.kind,caption:m.caption,position:m.position,src:'/api/media/'+m.id,thumb:'/api/media/'+m.id+'?size=thumb'});
