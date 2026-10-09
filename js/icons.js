/* Replace text arrows in generated controls with one consistent enamel icon set. */
(() => {
  const ids = { "←":"arrow-left", "→":"arrow-right", "↗":"arrow-up-right", "‹":"chevron-left", "›":"chevron-right", "↺":"reset", "⟲":"reset", "−":"minus", "+":"plus" };
  function enhance(root) {
    const controls = root.querySelectorAll("a,button");
    for (const control of controls) {
      if (control.closest(".rent-slider") || control.closest(".theme")) continue;
      const walker = document.createTreeWalker(control, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const node of nodes) {
        const value = node.nodeValue;
        const symbols = control.closest(".model-controls") ? /([←→↗‹›↺⟲+−])(?=\s*$)/ : /([←→↗‹›↺⟲])(?=\s*$)/;
        const match = value.match(symbols) || value.match(/([←→↗‹›↺⟲])/);
        if (!match) continue;
        const glyph = match[1];
        const at = match.index + match[0].lastIndexOf(glyph);
        if (at < 0) continue;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("class", "ui-icon " + (at === 0 ? "ui-icon--before" : "ui-icon--inline"));
        svg.setAttribute("aria-hidden", "true");
        const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
        use.setAttribute("href", "#ui-" + ids[glyph]);
        svg.append(use);
        node.replaceWith(document.createTextNode(value.slice(0, at)), svg, document.createTextNode(value.slice(at + glyph.length)));
      }
    }
  }
  let queued = false;
  new MutationObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; enhance(document); });
  }).observe(document.body, { childList: true, subtree: true });
  enhance(document);
})();
