function textNodeReplace(node, regex, handler) {
  var mom = node.parentNode, nxt = node.nextSibling,
    doc = node.ownerDocument, hits;
  if (regex.global) {
    while (node && (hits = regex.exec(node.nodeValue))) {
      regex.lastIndex = 0;
      node = handleResult(node, hits, handler.apply(this, hits));
    }
  } else if (hits = regex.exec(node.nodeValue))
    handleResult(node, hits, handler.apply(this, hits));

  function handleResult(node, hits, results) {
    var orig = node.nodeValue;
    node.nodeValue = orig.slice(0, hits.index);
    [].concat(create(mom, results)).forEach(function (n) {
      mom.insertBefore(n, nxt);
    });
    var rest = orig.slice(hits.index + hits[0].length);
    return rest && mom.insertBefore(doc.createTextNode(rest), nxt);
  }

  function create(el, o) {
    if (o.map) return o.map(function (v) { return create(el, v) });
    else if (typeof o === 'object') {
      var e = doc.createElementNS(o.namespaceURI || el.namespaceURI, o.name);
      if (o.attrs) for (var a in o.attrs) e.setAttribute(a, o.attrs[a]);
      if (o.content)[].concat(create(e, o.content)).forEach(e.appendChild, e);
      return e;
    } else return doc.createTextNode(o + "");
  }
}

function parse() {
  //add class name to all tickers
  let treeWalk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (treeWalk.nextNode()) {
    textNodeReplace(treeWalk.currentNode, /\$(\w*)/, (matched) => {
      return {
        name: 'span',
        attrs: { "class": 'lj-ticker' },
        content: {
          name: 'b',
          content: matched.substr(1),  //need to prepend $
        }
      };
    });
  }

  //add event listener for mouseover
  _.each(document.getElementsByClassName('lj-ticker'), element => {
    element.addEventListener("mouseenter", (e) => {
      openWindow(e, element.textContent);
    });
  });
}

function openWindow(event, ticker) {
  chrome.runtime.sendMessage({
    type: 'openDialog',
    event: event,
    ticker: ticker,
  });
}

parse();
