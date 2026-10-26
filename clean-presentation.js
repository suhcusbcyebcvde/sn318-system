/* Strip annotation copy from content inserted by dialogs and page renderers. */
(() => {
  const prefix = /^(?:来源(?:证据)?|证据|依据|证明|计费规则|规则口径|标准配置口径|发布版本只读|产品封装版本)\s*[:：]/;
  const annotationSelectors = '.zone-price-meta, .zwb-hint, .zrv-tip, .rate-unified-meta';
  function clean(root) {
    if (!(root instanceof Element)) return;
    const candidates = [root, ...root.querySelectorAll('p, small, span, div')];
    for (const element of candidates) {
      if (element.closest('script, style, textarea, button, select, [role="alert"], .by-toast')) continue;
      if (element.querySelector('input, button, a, textarea, select, table, h1, h2, h3, h4, p, div')) continue;
      const text = element.textContent.trim();
      if (prefix.test(text) || (element.matches(annotationSelectors) && /系统|维护|统一|支持|默认|请|不会|可复用/.test(text))) {
        element.remove();
      }
    }
    for (const element of root.querySelectorAll('[title]')) {
      if (/来源|依据|证据|证明|原型演示|演示口径/.test(element.title)) element.removeAttribute('title');
    }
  }
  clean(document.body);
  new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) clean(node);
    }
  }).observe(document.body, { childList: true, subtree: true });
})();
