// public/service-worker.js
console.log("Service Worker Loaded");

self.addEventListener("push", (e) => {
    const data = e.data.json();
    console.log("Push Received...");
    self.registration.showNotification(data.title, {
        body: data.body,
        icon: "/logo192.png",
    });
});