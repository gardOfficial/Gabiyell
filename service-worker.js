self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open("gabiyell").then(cache=>{
      return cache.addAll([
        "./",
        "./index.html",
        "./gallery.html",
        "./upload.html",
        "./css/style.css",
        "./js/script.js"
      ]);
    })
  );
});