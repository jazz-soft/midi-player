var script = document.createElement('script');
if (typeof browser == 'undefined') browser = chrome;
script.src = browser.runtime.getURL('inject.js');
script.onload = function() { script.remove(); }
document.documentElement.appendChild(script);
