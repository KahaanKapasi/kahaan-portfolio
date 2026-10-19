// Paste into the page console: horizontal overflow, broken images, and text contrast (computed, against the nearest opaque background).
(() => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,\/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b }) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const bgOf = (el) => { let e = el; while (e) { const c = parse(getComputedStyle(e).backgroundColor); if (c && c.a > 0.95) return c; e = e.parentElement; } return { r: 11, g: 11, b: 12, a: 1 }; };
  const bad = [];
  document.querySelectorAll('.c-autos *').forEach((el) => {
    if (!el.childNodes.length) return;
    const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (!own) return;
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none') return;
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) return;
    const fg = parse(cs.color); const bg = bgOf(el); const cr = ratio(fg, bg);
    const size = parseFloat(cs.fontSize), bold = parseInt(cs.fontWeight) >= 700;
    const need = size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5;
    if (cr < need) bad.push([el.className || el.tagName, el.textContent.trim().slice(0, 30), cr.toFixed(2), need, !!el.closest('.au-hero, .au-marque')]);
  });
  const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.src);
  return JSON.stringify({ w: innerWidth, overflowX: document.documentElement.scrollWidth - innerWidth, broken, lowContrast: bad.slice(0, 30) });
})()
