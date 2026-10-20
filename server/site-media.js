import { fail } from "./domain.js";
// Картинка сайта: файл из assets или фото, загруженное администратором (/api/site-media/<id>).
const IMAGE = /^(?:assets\/[\w/.-]{1,160}\.(?:jpe?g|png|webp|svg)|\/api\/site-media\/[0-9a-f-]{36})$/i;
export function imageSrc(value) {
  const src = String(value ?? "").trim();
  if (!src) return "";
  if (!IMAGE.test(src) || src.includes("..")) fail("Проверьте фотографию");
  return src;
}
