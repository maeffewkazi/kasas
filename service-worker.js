'use strict';

var cacheVersion = 1;
var currentCache = {
  offline: 'offline-cache' + cacheVersion
};

const offlineUrl = './wp-content/themes/craiecraie/resources/views/offline.html';

this.addEventListener('install', event => {
  event.waitUntil(
    caches.open(currentCache.offline).then(function(cache) {
      return cache.addAll([offlineUrl]);
    })
  );
});

const doesRequestAcceptHtml = (request) => {
  return request.headers.get('Accept').split(',').some(function (type) { return type === 'text/html'; });
};

this.addEventListener('fetch', event => {
  // for DevTools Chrome bug
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
  var request = event.request;
  if (doesRequestAcceptHtml(request)) {
    event.respondWith(fetch(request)
      .catch(function () {
        return caches.match(offlineUrl);
      })
    );
  } else {
    event.respondWith(caches.match(request)
      .then(function (response) {
        return response || fetch(request);
      })
    );
  }
});
