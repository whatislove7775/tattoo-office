const esc = (value) =>
  String(value ?? "").replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
const apiBase = () => window.OFFICE_API_BASE || "/api";

export const photoURL = (id, path) =>
  apiBase() +
  (path ? path + "/photos/" : "/about-photo/") +
  encodeURIComponent(id);

function photoView(photo, path, interactive) {
  const src = photo.id ? photoURL(photo.id, path) : photo.image;
  const thumb = photo.id ? src + "?size=thumb" : photo.thumbnail;
  const alt = photo.alt || photo.caption || "Фото профиля";
  const image = `<img src="${esc(interactive ? src : thumb)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
  return `<figure class="about-photo">${
    interactive
      ? `<button type="button" class="about-photo__open" data-about-photo="${esc(src)}" data-caption="${esc(photo.caption)}" aria-label="Открыть фото: ${esc(alt)}">${image}</button>`
      : image
  }${photo.caption ? `<figcaption>${esc(photo.caption)}</figcaption>` : ""}</figure>`;
}

export function aboutHTML(
  blocks,
  {
    bio = "",
    status = "",
    specialty = "",
    styleLabel = "Стиль",
    empty = "",
    path,
    interactive = true,
  } = {},
) {
  const intro = [bio, status, specialty].some(Boolean)
    ? `<section class="about-intro">${status ? `<p class="about-intro__status">${esc(status)}</p>` : ""}
        ${bio ? `<p class="about-intro__bio">${esc(bio)}</p>` : ""}
        ${specialty ? `<p class="about-intro__style">${esc(styleLabel)} · ${esc(specialty)}</p>` : ""}</section>`
    : "";
  if (!blocks.length && !intro)
    return empty ? `<p class="about-empty">${esc(empty)}</p>` : "";
  const sections = blocks
    .map((block) => {
      const type = ["text", "photo", "split", "gallery", "link"].includes(
        block.type,
      )
        ? block.type
        : "text";
      const tone = ["soft", "dark"].includes(block.tone) ? block.tone : "plain";
      const images = block.photos.map((photo) =>
        photoView(photo, path, interactive),
      );
      const action =
        type === "link" && /^https:\/\//i.test(block.href)
          ? `<a class="about-link" href="${esc(block.href)}" target="_blank" rel="noopener noreferrer">${esc(block.label)}</a>`
          : "";
      const copy =
        block.title || block.text || action
          ? `<div class="about-block__text">${block.title ? `<h3>${esc(block.title)}</h3>` : ""}
          ${block.text ? `<p>${esc(block.text)}</p>` : ""}${action}</div>`
          : "";
      const pictures =
        type === "gallery"
          ? `<div class="about-photos" data-count="${images.length}">${images.join("")}</div>`
          : images.join("");
      return `<section class="about-block about-block--${type} about-block--${tone}"${block.side === "right" ? ' data-side="right"' : ""}>${type === "split" ? pictures + copy : copy + pictures}</section>`;
    })
    .join("");
  return `<div class="about-story">${intro}${sections}</div>`;
}

export async function fetchAbout(id) {
  const response = await fetch(
    apiBase() + "/masters/" + encodeURIComponent(id) + "/about",
    { cache: "no-store" },
  );
  if (!response.ok) throw Error("Не удалось загрузить раздел");
  return (await response.json()).blocks;
}

export function openAboutPhoto(event) {
  const photo = event.target.closest("[data-about-photo]");
  if (!photo) return;
  const group = [
    ...photo.closest(".about-block").querySelectorAll("[data-about-photo]"),
  ];
  window.PhotoViewer.open(
    group.map((button) => ({
      src: button.dataset.aboutPhoto,
      caption: button.dataset.caption,
    })),
    group.indexOf(photo),
  );
}
