import { bindFileUpload } from "./file-upload.js";
import { compressed } from "./profile-media.js";
import { aboutHTML, photoURL } from "./master-about.js";

const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const types = {
  text: "Текст",
  photo: "Фото",
  split: "Фото + текст",
  gallery: "Галерея",
  link: "Кнопка-ссылка",
};
const tones = { plain: "Без подложки", soft: "Мягкий фон", dark: "Тёмный фон" };
const input = (
  label,
  key,
  value,
  limit,
  type = "text",
) => `<label class="about-field">${label}
  <input type="${type}" data-field="${key}" maxlength="${limit}" value="${esc(value)}"></label>`;
const select = (label, key, value, options) =>
  `<label class="about-field">${label}<select data-field="${key}">${Object.entries(
    options,
  )
    .map(
      ([id, title]) =>
        `<option value="${id}"${id === value ? " selected" : ""}>${title}</option>`,
    )
    .join("")}</select></label>`;
const limitFor = (type) =>
  type === "gallery" ? 4 : ["photo", "split"].includes(type) ? 1 : 0;

export async function mountAboutEditor(
  root,
  { api, path = "/me/about", intro = {} } = {},
) {
  let { revision, blocks } = await api(path);
  if (!root.isConnected) return;
  let active = -1,
    previewOnly = false,
    busy = false,
    message = "",
    hasError = false;
  const report = (text, error = false) => {
    message = text;
    hasError = error;
    const status = root.querySelector("[data-about-status]");
    if (status) {
      status.textContent = text;
      status.classList.toggle("is-error", error);
    }
  };
  const changed = () => {
    root.dataset.dirty = "1";
    root.querySelector("[data-about-save]").disabled = busy;
    const heading = root.querySelector(
      "[data-about-select][aria-pressed=true] span",
    );
    if (heading)
      heading.textContent = blocks[active].title || types[blocks[active].type];
    const pane = root.querySelector("[data-about-preview]");
    pane.innerHTML = aboutHTML(blocks, {
      ...intro,
      path,
      interactive: false,
      empty: "Добавьте первый блок, чтобы увидеть предпросмотр.",
    });
    report("Изменения ещё не опубликованы");
  };
  function paint(focus) {
    const block = blocks[active];
    const photoMax = block ? limitFor(block.type) : 0;
    root.innerHTML = `<section class="about-editor">
      <header class="about-editor__head"><h3>О себе</h3><div class="about-actions">
        <button type="button" class="chrome" data-about-toggle aria-pressed="${previewOnly}">${previewOnly ? "К редактированию" : "Предпросмотр"}</button>
        <button type="button" class="chrome pro-primary" data-about-save${root.dataset.dirty && !busy ? "" : " disabled"}>Опубликовать</button>
      </div></header>
      <p class="about-editor__status${hasError ? " is-error" : ""}" data-about-status role="status">${esc(message)}</p>
      <div class="about-studio${previewOnly ? " is-preview" : ""}">
      <div class="about-studio__tools"${previewOnly ? " hidden" : ""}>
        <div class="about-actions about-add" aria-label="Добавить блок">
          ${Object.entries(types)
            .map(
              ([key, title]) =>
                `<button type="button" class="chrome" data-about-add="${key}"${blocks.length < 12 ? "" : " disabled"}>+ ${title}</button>`,
            )
            .join("")}
        </div>
        ${
          blocks.length
            ? `<ol class="about-order" aria-label="Порядок блоков">${blocks
                .map(
                  (item, i) => `<li>
          <button type="button" data-about-select="${i}" aria-pressed="${i === active}"><span>${esc(item.title || types[item.type])}</span>${item.title ? `<small>${types[item.type]}</small>` : ""}</button>
          <button type="button" data-about-move="${i}" data-by="-1" aria-label="Поднять блок ${i + 1}"${i ? "" : " disabled"}>↑</button>
          <button type="button" data-about-move="${i}" data-by="1" aria-label="Опустить блок ${i + 1}"${i < blocks.length - 1 ? "" : " disabled"}>↓</button></li>`,
                )
                .join("")}</ol>`
            : ""
        }
        ${
          block
            ? `<fieldset class="about-edit-block"><legend>${types[block.type]}</legend>
          ${input("Заголовок", "title", block.title, 100)}
          <label class="about-field">Текст<textarea data-field="text" maxlength="3000" rows="4">${esc(block.text)}</textarea></label>
          ${select("Оформление", "tone", block.tone, tones)}
          ${block.type === "split" ? select("Фото на широком экране", "side", block.side, { left: "Слева", right: "Справа" }) : ""}
          ${block.type === "link" ? input("Куда ведёт кнопка", "href", block.href, 2048, "url") + input("Подпись кнопки", "label", block.label, 80) : ""}
          ${photoMax ? photoEditor(block, photoMax) : ""}
          <button type="button" class="about-text-action" data-about-remove>Удалить блок</button>
        </fieldset>`
            : '<p class="small muted">Выберите тип блока, чтобы добавить его в профиль.</p>'
        }
      </div><div class="about-studio__preview"><h4>Как в профиле</h4><div data-about-preview></div></div></div></section>`;
    root.querySelector("[data-about-preview]").innerHTML = aboutHTML(blocks, {
      ...intro,
      path,
      interactive: false,
      empty: "Здесь появится ваше содержание.",
    });
    root.querySelector("[data-about-toggle]").onclick = () => {
      previewOnly = !previewOnly;
      paint("[data-about-toggle]");
    };
    root.querySelectorAll("[data-about-add]").forEach(
      (button) =>
        (button.onclick = () => {
          blocks.push({
            type: button.dataset.aboutAdd,
            title: "",
            text: "",
            tone: "plain",
            photos: [],
            side: "left",
            label: "",
            href: "",
          });
          active = blocks.length - 1;
          paint('[data-field="title"]');
          changed();
        }),
    );
    root.querySelectorAll("[data-about-select]").forEach(
      (button) =>
        (button.onclick = () => {
          active = Number(button.dataset.aboutSelect);
          paint(`[data-about-select="${active}"]`);
        }),
    );
    root.querySelectorAll("[data-about-move]").forEach(
      (button) =>
        (button.onclick = () => {
          const from = Number(button.dataset.aboutMove),
            to = from + Number(button.dataset.by);
          const selected = block;
          const [moved] = blocks.splice(from, 1);
          blocks.splice(to, 0, moved);
          active = blocks.indexOf(selected || moved);
          paint(`[data-about-select="${to}"]`);
          changed();
        }),
    );
    const remove = root.querySelector("[data-about-remove]");
    if (remove)
      remove.onclick = () => {
        blocks.splice(active, 1);
        active = Math.min(active, blocks.length - 1);
        paint(
          active < 0 ? "[data-about-add]" : `[data-about-select="${active}"]`,
        );
        changed();
      };
    root.querySelectorAll("[data-field]").forEach((el) =>
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", () => {
        const photo = el.closest("[data-edit-photo]");
        (photo ? block.photos[Number(photo.dataset.editPhoto)] : block)[
          el.dataset.field
        ] = el.value;
        changed();
      }),
    );
    root.querySelectorAll("[data-photo-remove]").forEach(
      (button) =>
        (button.onclick = () => {
          block.photos.splice(Number(button.dataset.photoRemove), 1);
          paint("[data-photo-choose]");
          changed();
        }),
    );
    root.querySelectorAll("[data-photo-move]").forEach(
      (button) =>
        (button.onclick = () => {
          const i = Number(button.dataset.photoMove),
            next = i + Number(button.dataset.by);
          [block.photos[i], block.photos[next]] = [
            block.photos[next],
            block.photos[i],
          ];
          paint(`[data-edit-photo="${next}"] input`);
          changed();
        }),
    );
    const uploadZone = root.querySelector(".about-file-zone");
    if (uploadZone)
      bindFileUpload(
        uploadZone,
        uploadZone.querySelector("input"),
        uploadZone.querySelector("button"),
        (files) => upload(block, photoMax, files),
      );
    root.querySelector("[data-about-save]").onclick = save;
    if (busy)
      root
        .querySelectorAll("button,input,textarea,select")
        .forEach((el) => (el.disabled = true));
    if (focus) root.querySelector(focus)?.focus();
  }
  function photoEditor(block, max) {
    return `<div class="about-photo-editor">${block.photos
      .map(
        (p, i) => `<div class="about-photo-form" data-edit-photo="${i}">
      <img src="${esc(p.id ? photoURL(p.id, path) + "?size=thumb" : p.thumbnail)}" alt="">
      <div>${input("Подпись к фото", "caption", p.caption, 160)}${input("Описание изображения", "alt", p.alt, 150)}
        <div class="about-actions">${
          block.photos.length > 1
            ? `<button type="button" class="chrome" data-photo-move="${i}" data-by="-1" aria-label="Передвинуть фото влево"${i ? "" : " disabled"}>←</button>
          <button type="button" class="chrome" data-photo-move="${i}" data-by="1" aria-label="Передвинуть фото вправо"${i < block.photos.length - 1 ? "" : " disabled"}>→</button>`
            : ""
        }
          <button type="button" class="about-text-action" data-photo-remove="${i}">Убрать фото</button></div>
      </div></div>`,
      )
      .join("")}
      ${
        block.photos.length < max
          ? `<div class="about-file-zone file-upload-zone"><button class="chrome" type="button" data-photo-choose>Загрузить ${max > 1 ? "фотографии" : "фото"}</button>
        <input type="file" accept="image/jpeg,image/png,image/webp"${max > 1 ? " multiple" : ""} hidden>
        <span class="small muted">JPG, PNG или WebP до 12 МБ</span></div>`
          : ""
      }</div>`;
  }
  async function upload(block, max, files) {
    if (busy || !files.length) return;
    const remaining = Math.min(
      max - block.photos.length,
      12 - blocks.reduce((sum, item) => sum + item.photos.length, 0),
    );
    if (files.length > remaining) {
      report(
        remaining
          ? `Можно добавить ещё ${remaining} фото`
          : "Достигнут лимит в 12 фотографий",
        true,
      );
      return;
    }
    busy = true;
    root.setAttribute("aria-busy", "true");
    paint();
    try {
      const photos = [];
      for (const file of files) {
        if (
          !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
          file.size > 12 * 1024 * 1024
        )
          throw Error("Выберите JPG, PNG или WebP до 12 МБ");
        const [image, thumbnail] = await Promise.all([
          compressed(file, 125000, 1440).catch(() =>
            compressed(file, 125000, 1024),
          ),
          compressed(file, 20000, 320),
        ]);
        photos.push({ image, thumbnail, caption: "", alt: "" });
      }
      block.photos.push(...photos);
      changed();
    } catch (error) {
      report(error.message || "Не удалось прочитать фото", true);
    } finally {
      busy = false;
      root.removeAttribute("aria-busy");
      paint();
    }
  }
  async function save() {
    if (busy || !root.dataset.dirty) return;
    busy = true;
    root.setAttribute("aria-busy", "true");
    paint();
    try {
      ({ revision, blocks } = await api(path, "PUT", { revision, blocks }));
      delete root.dataset.dirty;
      report("Раздел опубликован");
    } catch (error) {
      report(error.message, true);
    } finally {
      busy = false;
      root.removeAttribute("aria-busy");
      paint("[data-about-toggle]");
    }
  }
  paint();
}
