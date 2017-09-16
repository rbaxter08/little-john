let ticker = '';
chrome.runtime.onMessage.addListener((msg, sender, response) => {

  if (msg.type === 'openDialog') {

    //open popup
    ticker = msg.ticker;
    msg.event;
    chrome.windows.create({
      type: 'popup',
      url: chrome.extension.getURL('index.html'),
    });
  }

  if (msg.type === 'tickerRequest') {

    //send ticker to vue control
    chrome.runtime.sendMessage({
      type: 'tickerInfo',
      ticker: ticker,
    });
  }
});