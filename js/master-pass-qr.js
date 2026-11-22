import { encode, QrCodeDataType } from "./vendor/uqr/index.js";

const quietZone = 4;
const badgeSize = 9;

function logoPosition({ size, types }) {
  const center = (size - badgeSize) / 2;
  let best = { distance: Infinity };
  for (let y = quietZone; y <= size - quietZone - badgeSize; y++) {
    for (let x = quietZone; x <= size - quietZone - badgeSize; x++) {
      const distance = (x - center) ** 2 + (y - center) ** 2;
      if (distance >= best.distance) continue;
      const cells = types.slice(y, y + badgeSize);
      if (cells.every(row => row.slice(x, x + badgeSize).every(type => type === QrCodeDataType.Data))) {
        best = { x, y, distance };
        if (distance === 0) return best;
      }
    }
  }
  return best;
}

export function masterPassQR(url) {
  const code = encode(url, { ecc: "H", minVersion: 5, border: quietZone });
  const { size, data, types } = code;
  const logo = logoPosition(code);
  const inBadge = (x, y) => x >= logo.x && x < logo.x + badgeSize && y >= logo.y && y < logo.y + badgeSize;
  const contrast = "#111";
  const marks = data.flatMap((row, y) => row.map((marked, x) => {
    if (!marked || types[y][x] === QrCodeDataType.Position || inBadge(x, y)) return "";
    return `M${x} ${y}h1v1h-1z`;
  })).join("");
  const far = size - quietZone - 7;
  const finders = [[quietZone, quietZone], [far, quietZone], [quietZone, far]].map(([x, y]) => `
    <g transform="translate(${x} ${y})">
      <rect width="7" height="7" rx="1"/>
      <rect x="1" y="1" width="5" height="5" rx=".58" fill="white"/>
      <rect x="2" y="2" width="3" height="3" rx=".4"/>
    </g>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
    <rect width="${size}" height="${size}" fill="white"/>
    <path fill="${contrast}" shape-rendering="crispEdges" d="${marks}"/>
    <g fill="${contrast}">${finders}</g>
  </svg>`;
  return {
    image: "data:image/svg+xml," + encodeURIComponent(svg),
    logo: { left: 100 * logo.x / size, top: 100 * logo.y / size, width: 100 * badgeSize / size },
  };
}
