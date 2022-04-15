window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then((registration) => {
            console.log('registered service worker scope: ', registration.scope);
        }).catch((err) => {
            console.error('failed to register service worker', err);
        });
    } else {
        console.log('service worker unavailable');
    }
});
