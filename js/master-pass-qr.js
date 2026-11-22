import { QrCode, EccMap, appendBits, getNumDataCodewords, renderSVG } from "./vendor/uqr/index.js";

const version = 12;
const correction = EccMap.L;
const size = version * 4 + 17;
const quietZone = 4;
const artworkSize = 55;
const artworkRadius = artworkSize / 2;
const artworkOffset = (size - artworkSize) / 2;
const logoSource = new URL("../assets/mark.svg", import.meta.url).href;

// QArt uses a numeric segment to give the image independent bits to vary.
// See https://research.swtch.com/qart for the encoding technique.
function encodeArtworkData(url) {
  const target = new URL(url);
  const suffix = target.hash;
  target.hash = "";
  target.searchParams.delete("qart");
  const prefix = target.href + (target.search ? "&" : "?") + "qart=";

  const capacity = getNumDataCodewords(version, correction) * 8;
  const bits = [];
  const addBytes = (text) => {
    const bytes = new TextEncoder().encode(text);
    appendBits(4, 4, bits);
    appendBits(bytes.length, 16, bits);
    for (const byte of bytes) appendBits(byte, 8, bits);
  };

  addBytes(prefix);
  const suffixLength = new TextEncoder().encode(suffix).length;
  const groupCount = Math.floor((capacity - bits.length - 16 - 20 - 8 * suffixLength - 4) / 10);
  if (groupCount < 1 || groupCount * 3 >= 4096) throw new Error("QR link is outside the artwork capacity");
  appendBits(1, 4, bits);
  appendBits(groupCount * 3, 12, bits);

  const freeBits = [];
  let seed = 1;
  for (const char of url) seed = (Math.imul(seed, 31) + char.charCodeAt(0)) >>> 0;
  for (let group = 0; group < groupCount; group++) {
    for (let bit = 0; bit < 10; bit++) freeBits.push(bits.length + bit);
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    appendBits((seed >>> 16) % 1000, 10, bits);
  }
  addBytes(suffix);
  appendBits(0, 4, bits);
  appendBits(0, (8 - bits.length % 8) % 8, bits);
  for (let pad = 236; bits.length < capacity; pad ^= 236 ^ 17) appendBits(pad, 8, bits);

  const bytes = Array(capacity / 8).fill(0);
  bits.forEach((bit, index) => { bytes[index >>> 3] |= bit << (7 - (index & 7)); });
  return { bytes, freeBits };
}

function constraintsFor(code, pixels, words) {
  const constraints = [];
  for (let row = 0; row < artworkSize; row++) {
    for (let col = 0; col < artworkSize; col++) {
      const x = artworkOffset + col, y = artworkOffset + row;
      // The circular artwork needs no control over the corners of its bounds.
      const outsideLogo = (col + .5 - artworkRadius) ** 2 + (row + .5 - artworkRadius) ** 2 > artworkRadius ** 2;
      if (outsideLogo || code.types[y][x]) continue;
      const darkness = pixels[row * artworkSize + col];
      constraints.push({
        x, y,
        priority: darkness > 127 ? 256 + darkness : 127 - darkness,
        differs: code.modules[y][x] !== (darkness > 127) ? 1 : 0,
        coefficients: new Uint32Array(words),
      });
    }
  }
  return constraints.sort((a, b) => b.priority - a.priority);
}

function solvePixels(constraints, variableCount, fixed) {
  const words = Math.ceil(variableCount / 32);
  const pivots = new Array(variableCount);
  for (const [variable, value] of fixed) {
    const row = new Uint32Array(words);
    row[variable >>> 5] = 1 << (variable & 31);
    pivots[variable] = { row, value };
  }
  for (const constraint of constraints) {
    const row = constraint.coefficients.slice();
    let value = constraint.differs;
    for (let word = 0; word < row.length && word * 32 < variableCount; word++) {
      while (row[word]) {
        const pivot = word * 32 + 31 - Math.clz32(row[word] & -row[word]);
        const previous = pivots[pivot];
        if (!previous) {
          pivots[pivot] = { row, value };
          break;
        }
        for (let i = word; i < row.length; i++) row[i] ^= previous.row[i];
        value ^= previous.value;
      }
      if (row[word]) break;
    }
  }

  const solution = new Uint32Array(Math.ceil(variableCount / 32));
  for (let pivot = variableCount - 1; pivot >= 0; pivot--) {
    const constraint = pivots[pivot];
    if (!constraint) continue;
    const start = pivot >>> 5;
    let parity = 0;
    for (let word = start; word < solution.length; word++) parity ^= constraint.row[word] & solution[word];
    parity ^= parity >>> 16;
    parity ^= parity >>> 8;
    parity ^= parity >>> 4;
    parity ^= parity >>> 2;
    parity ^= parity >>> 1;
    if ((parity & 1) !== constraint.value) solution[start] |= 1 << (pivot & 31);
  }
  return solution;
}

function drawArtwork(url, pixels) {
  const { bytes, freeBits } = encodeArtworkData(url);
  const base = new QrCode(version, correction, bytes, -1);
  const constraints = constraintsFor(base, pixels, Math.ceil(freeBits.length / 32));
  freeBits.forEach((position, variable) => {
    const byte = position >>> 3, mask = 1 << (7 - (position & 7));
    bytes[byte] ^= mask;
    const variant = new QrCode(version, correction, bytes, base.mask);
    bytes[byte] ^= mask;
    for (const cell of constraints) {
      if (variant.modules[cell.y][cell.x] !== base.modules[cell.y][cell.x])
        cell.coefficients[variable >>> 5] |= 1 << (variable & 31);
    }
  });
  // Values 1000–1023 cannot be encoded as three decimal digits. For each
  // such group, lock one of its leading bits to zero and solve again.
  const bitAt = (data, position) => (data[position >>> 3] >>> (7 - (position & 7))) & 1;
  const fixed = new Map();
  let result;
  for (let attempt = 0; ; attempt++) {
    if (attempt === 8) {
      for (let group = 0; group < freeBits.length; group += 10)
        fixed.set(group, bitAt(bytes, freeBits[group]));
    }
    const solution = solvePixels(constraints, freeBits.length, fixed);
    result = bytes.slice();
    freeBits.forEach((position, variable) => {
      if (solution[variable >>> 5] & (1 << (variable & 31)))
        result[position >>> 3] ^= 1 << (7 - (position & 7));
    });
    let invalid = false;
    for (let group = 0; group < freeBits.length; group += 10) {
      let value = 0;
      for (let bit = 0; bit < 10; bit++) value = (value << 1) | bitAt(result, freeBits[group + bit]);
      if (value < 1000) continue;
      invalid = true;
      const variable = group + (group / 10) % 5;
      fixed.set(variable, bitAt(bytes, freeBits[variable]));
    }
    if (!invalid) break;
  }
  const qr = new QrCode(version, correction, result, base.mask);
  const modules = qr.modules.flatMap((row, y) => row.map((bit, x) =>
    bit ? `M${x + quietZone} ${y + quietZone}h1v1h-1z` : "")).join("");
  const imageSize = size + 2 * quietZone;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${imageSize} ${imageSize}" shape-rendering="crispEdges"><path fill="white" d="M0 0h${imageSize}v${imageSize}H0z"/><path fill="black" d="${modules}"/></svg>`;
}

async function readLogo() {
  const image = new Image();
  image.src = logoSource;
  await image.decode();
  const canvas = document.createElement("canvas");
  canvas.width = artworkSize;
  canvas.height = artworkSize;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0, artworkSize, artworkSize);
  const { data } = ctx.getImageData(0, 0, artworkSize, artworkSize);
  return Uint8Array.from({ length: artworkSize * artworkSize }, (_, i) => data[i * 4 + 3]);
}

export async function masterPassQR(url) {
  let svg;
  try {
    svg = drawArtwork(url, await readLogo());
  } catch {
    svg = renderSVG(url, { border: quietZone });
  }
  return "data:image/svg+xml," + encodeURIComponent(svg);
}
