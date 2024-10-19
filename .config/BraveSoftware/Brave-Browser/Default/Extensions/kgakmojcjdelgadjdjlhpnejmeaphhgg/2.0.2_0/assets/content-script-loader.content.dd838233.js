(function () {
  'use strict';

  (async () => {
    await import(
      /* @vite-ignore */
      chrome.runtime.getURL("assets/content.39238aae.js")
    );
  })().catch(console.error);

})();
