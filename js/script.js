let photos = JSON.parse(localStorage.getItem("photos")) || [];
let queue = JSON.parse(localStorage.getItem("queue")) || [];

/* ===== MUSIC ===== */
const musicList = [
  "music/lagu1.mp3",
  "music/lagu2.mp3",
  "music/lagu3.mp3",
  "music/lagu4.mp3",
  "music/lagu5.mp3"
];
let current = 0;
const audio = new Audio(musicList[current]);
audio.muted = localStorage.getItem("mute") === "true";

function togglePlay(){ audio.paused ? audio.play() : audio.pause(); }
function nextMusic(){ current=(current+1)%musicList.length; audio.src=musicList[current]; audio.play(); }
function prevMusic(){ current=(current-1+musicList.length)%musicList.length; audio.src=musicList[current]; audio.play(); }
function toggleMute(){
  audio.muted=!audio.muted;
  localStorage.setItem("mute",audio.muted);
  document.getElementById("muteBtn").textContent = audio.muted ? "🔇":"🔊";
}

/* ===== UPLOAD ===== */
function uploadPhoto(){
  const file = photoInput.files[0];
  if(!file) return;
  const r = new FileReader();
  r.onload = ()=>{
    const data = {
      image:r.result,
      caption:captionInput.value,
      category:categoryInput.value,
      like:0,
      comments:[],
      deleted:false
    };
    navigator.onLine ? photos.push(data) : queue.push(data);
    save();
  };
  r.readAsDataURL(file);
}

/* ===== SAVE & DISPLAY ===== */
function save(){
  localStorage.setItem("photos",JSON.stringify(photos));
  localStorage.setItem("queue",JSON.stringify(queue));
  displayPhotos();
}

function displayPhotos(list=photos){
  const el=document.getElementById("photoList");
  if(!el) return;
  el.innerHTML="";
  list.filter(p=>!p.deleted).forEach((p,i)=>{
    el.innerHTML+=`
    <div class="photo-card">
      <img src="${p.image}">
      <p>${p.caption}</p>
      <button onclick="p.like++;save()">❤️ ${p.like}</button>
      <button onclick="p.deleted=true;save()">🗑</button>
    </div>`;
  });
}

/* ===== SEARCH ===== */
function smartSearch(q){
  q=q.toLowerCase();
  displayPhotos(photos.filter(p=>
    p.caption.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  ));
}

/* ===== RECYCLE ===== */
function renderRecycle(){
  const box=document.getElementById("recycleList");
  box.innerHTML="";
  photos.filter(p=>p.deleted).forEach((p,i)=>{
    box.innerHTML+=`
    <div class="photo-card">
      <img src="${p.image}">
      <button onclick="p.deleted=false;save()">♻️</button>
      <button onclick="photos.splice(i,1);save()">❌</button>
    </div>`;
  });
}

displayPhotos();
