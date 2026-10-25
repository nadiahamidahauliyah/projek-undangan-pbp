const $ = (id) => document.getElementById(id);

// Personalized greeting from ?to=Nama
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");
if (guest) {
  const openingGuest = $("openingGuest");
  if (openingGuest) openingGuest.textContent = guest.replace(/[<>]/g, "").slice(0, 80);
}

$("openInvitation")?.addEventListener("click", () => {
  $("opening")?.classList.add("opening-hidden");
  document.body.classList.add("invitation-open");
  setTimeout(() => document.getElementById("home")?.scrollIntoView({ behavior: "smooth" }), 100);
});

$("menuToggle")?.addEventListener("click", () => $("mainNav")?.classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(link => link.addEventListener("click", () => $("mainNav")?.classList.remove("open")));

const eventDate = new Date("2026-11-18T08:00:00+07:00").getTime();
function updateCountdown() {
  let diff = Math.max(0, eventDate - Date.now());
  const values = {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000)
  };
  Object.entries(values).forEach(([id, value]) => { if ($(id)) $(id).textContent = String(value).padStart(2, "0"); });
}
updateCountdown();
setInterval(updateCountdown, 1000);

$("calendarButton")?.addEventListener("click", () => {
  const start = "20261118T010000Z";
  const end = "20261118T030000Z";
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("Akad Nikah Raissa & Malik")}&dates=${start}/${end}&details=${encodeURIComponent("Undangan pernikahan Raissa & Malik")}&location=${encodeURIComponent("Masjid Istiqlal, Jakarta Pusat")}`;
  window.open(url, "_blank", "noopener,noreferrer");
});

// RSVP and guestbook work as local demo. Connect a backend to collect responses across devices.
$("rsvpForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = $("rsvpName").value.trim();
  const attendance = $("attendance").value;
  $("rsvpStatus").textContent = `Terima kasih, ${name}. Konfirmasi "${attendance}" tercatat di halaman demo ini.`;
  $("rsvpForm").reset();
});

const guestbookKey = "rm-guestbook-v1";
function readGuestbook() {
  try { return JSON.parse(localStorage.getItem(guestbookKey) || "[]"); } catch { return []; }
}
function renderGuestbook() {
  const list = $("guestbookList");
  if (!list) return;
  const entries = readGuestbook();
  list.replaceChildren();
  if (!entries.length) {
    const p = document.createElement("p"); p.className = "muted"; p.textContent = "Jadilah yang pertama meninggalkan ucapan."; list.append(p); return;
  }
  entries.slice().reverse().forEach(entry => {
    const article = document.createElement("article"); article.className = "guestbook-entry";
    const name = document.createElement("strong"); name.textContent = entry.name;
    const message = document.createElement("p"); message.textContent = entry.message;
    article.append(name, message); list.append(article);
  });
}
renderGuestbook();
$("guestbookForm")?.addEventListener("submit", event => {
  event.preventDefault();
  const name = $("guestbookName").value.trim();
  const message = $("guestbookText").value.trim();
  if (!name || !message) return;
  const entries = readGuestbook();
  entries.push({ name: name.slice(0, 80), message: message.slice(0, 500), at: Date.now() });
  localStorage.setItem(guestbookKey, JSON.stringify(entries.slice(-100)));
  $("guestbookForm").reset(); renderGuestbook();
});

$("copyBank")?.addEventListener("click", async () => {
  const number = $("bankNumber")?.textContent.trim() || "";
  try {
    await navigator.clipboard.writeText(number);
    $("copyStatus").textContent = "Nomor rekening berhasil disalin.";
  } catch {
    $("copyStatus").textContent = "Salin nomor rekening secara manual ya.";
  }
});

// Wedding Quest sesuai rancangan awal: 8 misi, bukti foto, dan skor berdasarkan ketepatan waktu.
// Demo lokal: untuk timestamp anti-manipulasi dan leaderboard lintas perangkat, gunakan backend.
const missions = [
  { title: "The Journey Begins", desc: "Ambil foto persiapan sebelum berangkat menuju acara.", points: 10, start: "2026-11-18T06:00", end: "2026-11-18T08:00", evidence: "Foto persiapan sebelum berangkat" },
  { title: "The Arrival", desc: "Tiba di venue dan lakukan check-in. Bukti waktu kedatangan menjadi bagian penilaian.", points: 20, start: "2026-11-18T08:00", end: "2026-11-18T08:30", evidence: "Foto area venue atau bukti check-in" },
  { title: "The Grand Entrance", desc: "Abadikan dekorasi atau area masuk setelah tiba, tanpa mengganggu prosesi.", points: 10, start: "2026-11-18T08:30", end: "2026-11-18T11:00", evidence: "Foto dekorasi/area masuk" },
  { title: "A Wish for the Couple", desc: "Tinggalkan doa atau ucapan tulus untuk Raissa dan Malik.", points: 10, start: "2026-11-18T08:00", end: "2026-11-18T11:30", evidence: "Foto bukti ucapan atau dekorasi buku tamu", type: "wish" },
  { title: "The Memory Makers", desc: "Ambil foto di photo booth atau spot foto yang disediakan.", points: 10, start: "2026-11-18T10:00", end: "2026-11-18T12:00", evidence: "Foto di photo booth/spot foto" },
  { title: "The Celebration Table", desc: "Abadikan sajian atau meja sebelum mulai makan.", points: 10, start: "2026-11-18T11:00", end: "2026-11-18T13:00", evidence: "Foto sajian/meja sebelum makan" },
  { title: "The Green Promise", desc: "Selesaikan checklist kebersihan dan rapikan area sendiri. Jangan memotret orang lain tanpa izin.", points: 10, start: "2026-11-18T11:00", end: "2026-11-18T14:00", evidence: "Foto area/meja sendiri setelah dirapikan", type: "green" },
  { title: "Until We Meet Again", desc: "Selesaikan check-out dan tinggalkan pesan penutup sebelum acara berakhir.", points: 20, start: "2026-11-18T13:00", end: "2026-11-18T14:00", evidence: "Foto bukti check-out atau area keluar" }
];
const questKey = "rm-wedding-quest-v2";
let questState = {};
try { questState = JSON.parse(localStorage.getItem(questKey) || "{}"); } catch { questState = {}; }
const questList = $("questList");
const toLocalInput = (date) => date;
const escapeText = (text) => String(text ?? "");
function saveQuestState() {
  try { localStorage.setItem(questKey, JSON.stringify(questState)); return true; }
  catch { return false; }
}
  
function missionScore(mission, state) {
  if (!state?.photoData || !state.submittedAt) return 0;

  const start = new Date(state.startAt || mission.start).getTime();
  const end = new Date(state.deadline || mission.end).getTime();
  const submitted = Number(state.submittedAt);

  // Waktu harus valid
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    end <= start
  ) return 0;

  // Tidak mendapat poin jika terlalu awal atau terlambat
  if (submitted < start || submitted >= end) return 0;

  // Semakin cepat setelah misi dibuka, semakin tinggi skor
  const progress = (submitted - start) / (end - start);

  return Math.ceil(mission.points * (1 - progress));
}


function localDateTime(timestamp) {
  const date = new Date(timestamp);
  const pad = n => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Foto tidak bisa dibaca."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error("File ini bukan gambar yang bisa dibaca."));
      image.onload = () => {
        const maxSide = 1100;
        const scale = Math.min(1, maxSide / Math.max(image.width, image.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.width * scale));
        canvas.height = Math.max(1, Math.round(image.height * scale));
        canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function renderMissions() {
  if (!questList) return;
  questList.replaceChildren();
  missions.forEach((mission, i) => {
    const state = questState[i] || {};
    if (!state.startAt) state.startAt = mission.start;
    if (!state.deadline) state.deadline = mission.end;
    const card = document.createElement("article");
    card.className = "quest-item" + (state.photoData ? " done" : "");
    const number = document.createElement("span"); number.className = "quest-number"; number.textContent = String(i + 1).padStart(2, "0");
    const body = document.createElement("div"); body.className = "quest-copy";
    const title = document.createElement("h3"); title.textContent = mission.title;
    const desc = document.createElement("p"); desc.textContent = mission.desc;
    const timeFields = document.createElement("div"); timeFields.className = "quest-time-fields";
    const startLabel = document.createElement("label"); startLabel.textContent = "Waktu mulai";
    const startInput = document.createElement("input"); startInput.type = "datetime-local"; startInput.value = toLocalInput(state.startAt); startInput.setAttribute("aria-label", `Waktu mulai ${mission.title}`);
    const endLabel = document.createElement("label"); endLabel.textContent = "Batas waktu";
    const endInput = document.createElement("input"); endInput.type = "datetime-local"; endInput.value = toLocalInput(state.deadline); endInput.setAttribute("aria-label", `Batas waktu ${mission.title}`);
    startLabel.append(startInput); endLabel.append(endInput); timeFields.append(startLabel, endLabel);
    const uploadLabel = document.createElement("label"); uploadLabel.className = "quest-upload-label"; uploadLabel.append(document.createTextNode(`Unggah bukti: ${mission.evidence}`));
    const fileInput = document.createElement("input"); fileInput.type = "file"; fileInput.accept = "image/*"; fileInput.setAttribute("aria-label", `Unggah foto bukti ${mission.title}`); uploadLabel.append(fileInput);
    const preview = document.createElement("img"); preview.className = "quest-photo-preview"; preview.alt = `Bukti foto untuk ${mission.title}`;
    if (state.photoData) { preview.src = state.photoData; preview.classList.add("visible"); }
    let extra = null;
    if (mission.type === "wish") {
      extra = document.createElement("div"); extra.className = "quest-extra";
      const wish = document.createElement("textarea"); wish.placeholder = "Tulis doa untuk Raissa dan Malik..."; wish.value = state.wish || ""; wish.setAttribute("aria-label", "Doa untuk mempelai");
      wish.addEventListener("change", () => { state.wish = wish.value.slice(0, 500); questState[i] = state; saveQuestState(); });
      extra.append(wish);
    } else if (mission.type === "green") {
      extra = document.createElement("div"); extra.className = "quest-extra";
      const checkLabel = document.createElement("label"); const check = document.createElement("input"); check.type = "checkbox"; check.checked = Boolean(state.greenChecked);
      check.addEventListener("change", () => { state.greenChecked = check.checked; questState[i] = state; saveQuestState(); renderMissions(); });
      checkLabel.append(check, document.createTextNode(" Saya sudah merapikan area sendiri dan membuang sampah pada tempatnya.")); extra.append(checkLabel);
    }
    const status = document.createElement("p"); status.className = "quest-status";
    const scoreLine = document.createElement("p"); scoreLine.className = "quest-score-line";
    function updateStatus() {
      const score = missionScore(mission, state);
      const start = new Date(state.startAt || mission.start).getTime();
      const end = new Date(state.deadline || mission.end).getTime();
      const submitted = Number(state.submittedAt || 0);
      if (!state.photoData) {
        status.className = "quest-status"; status.textContent = "Belum ada bukti foto. Unggah foto untuk mencatat waktu pengiriman.";
      } else if (end <= start) {
        status.className = "quest-status late"; status.textContent = "Rentang waktu tidak valid: batas waktu harus setelah waktu mulai.";
      } else if (submitted < start) {
        status.className = "quest-status late"; status.textContent = `Bukti tercatat ${new Date(submitted).toLocaleString("id-ID")}, sebelum misi dibuka.`;
      } else if (submitted > end) {
        status.className = "quest-status late"; status.textContent = `Terlambat. Bukti tercatat ${new Date(submitted).toLocaleString("id-ID")}, melewati batas waktu.`;
      } else {
        status.className = "quest-status success"; status.textContent = `Tepat waktu · dikirim ${new Date(submitted).toLocaleString("id-ID")}.`;
      }
      scoreLine.textContent = `Skor misi: ${score}/${mission.points} poin`;
      card.classList.toggle("done", Boolean(state.photoData) && score > 0);
    }
    function persistTimes() {
      state.startAt = startInput.value || mission.start;
      state.deadline = endInput.value || mission.end;
      questState[i] = state; saveQuestState(); updateStatus(); updateQuestTotals();
    }
    startInput.addEventListener("change", persistTimes);
    endInput.addEventListener("change", persistTimes);
    
fileInput.addEventListener("change", async () => {
  const file = fileInput.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    status.textContent = "Pilih file gambar (JPG, PNG, WEBP).";
    return;
  }

  const start = new Date(startInput.value || mission.start).getTime();
  const end = new Date(endInput.value || mission.end).getTime();
  const submitted = Date.now();

  if (end <= start) {
    status.className = "quest-status late";
    status.textContent = "Batas waktu harus setelah waktu mulai.";
    fileInput.value = "";
    return;
  }

  if (submitted < start) {
    status.className = "quest-status late";
    status.textContent = "Misi belum dimulai. Unggah bukti setelah waktu mulai.";
    fileInput.value = "";
    return;
  }

  if (submitted >= end) {
    status.className = "quest-status late";
    status.textContent = "Waktu misi sudah berakhir. Kamu tidak mendapat poin.";
    fileInput.value = "";
    return;
  }

  try {
    const compressed = await compressImage(file);

    state.photoData = compressed;
    state.fileName = file.name.slice(0, 120);
    state.submittedAt = submitted;
    state.startAt = startInput.value || mission.start;
    state.deadline = endInput.value || mission.end;

    questState[i] = state;

    if (!saveQuestState()) {
      status.className = "quest-status late";
      status.textContent = "Penyimpanan penuh. Coba foto yang lebih kecil.";
      return;
    }

    renderMissions();
  } catch (error) {
    status.className = "quest-status late";
    status.textContent = error.message || "Foto gagal diproses.";
  }
});

    body.append(title, desc, timeFields, uploadLabel);
    if (extra) body.append(extra);
    body.append(preview, status, scoreLine);
    card.append(number, body); questList.append(card);
    updateStatus();
  });
  updateQuestTotals();
}
function updateQuestTotals() {
  const completed = missions.reduce((sum, mission, i) => sum + (missionScore(mission, questState[i]) > 0 ? 1 : 0), 0);
  const score = missions.reduce((sum, mission, i) => sum + missionScore(mission, questState[i]), 0);
  if ($("progressText")) $("progressText").textContent = `${completed}/8 selesai`;
  if ($("progressBar")) $("progressBar").style.width = `${completed / 8 * 100}%`;
  if ($("totalScore")) $("totalScore").textContent = score;
  if ($("rankText")) $("rankText").textContent = score >= 100 ? "MasyaAllah, semua misi selesai!" : score >= 60 ? "Hebat! Kamu hampir menyelesaikan semuanya." : score > 0 ? "Bagus! Lanjutkan misi berikutnya." : "Mulai misi pertamamu!";
}
renderMissions();

// Upload foto mempelai ke bingkai pintu lengkung pada hero.
const heroPhotoInput = $("heroCouplePhoto");
const heroPhotoPreview = $("heroCouplePreview");
const heroPhotoFrame = document.querySelector(".hero-photo-frame");
const heroPhotoPlaceholder = $("heroPhotoPlaceholder");
try {
  const savedHeroPhoto = localStorage.getItem("rm-hero-couple-photo-v1");
  if (savedHeroPhoto && heroPhotoPreview && heroPhotoFrame) {
    heroPhotoPreview.src = savedHeroPhoto; heroPhotoFrame.classList.add("has-photo");
  }
} catch {}
heroPhotoInput?.addEventListener("change", async () => {
  const file = heroPhotoInput.files?.[0]; if (!file) return;
  if (!file.type.startsWith("image/")) { alert("Pilih file gambar JPG, PNG, atau WEBP."); return; }
  try {
    const data = await compressImage(file);
    localStorage.setItem("rm-hero-couple-photo-v1", data);
    heroPhotoPreview.src = data; heroPhotoFrame?.classList.add("has-photo");
  } catch { alert("Foto belum bisa disimpan. Coba gambar yang ukurannya lebih kecil."); }
});

$("saveGuestId")?.addEventListener("click", () => {
  const code = $("guestId").value.trim().slice(0, 30);
  if (!code) { $("guestId").focus(); return; }
  localStorage.setItem("rm-guest-code-v1", code);
  $("saveGuestId").textContent = "Kode tersimpan ✓";
});
const savedGuestCode = localStorage.getItem("rm-guest-code-v1");
if (savedGuestCode && $("guestId")) $("guestId").value = savedGuestCode;

const music = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicToggle");

let musicReady = false;

musicButton?.addEventListener("click", async () => {
  if (!musicReady) {
    music.src = "lagu.mp3";
    musicReady = true;
  }

  if (music.paused) {
    try {
      await music.play();
      musicButton.textContent = "Ⅱ";
      musicButton.setAttribute("aria-label", "Jeda musik");
    } catch (error) {
      console.error("Lagu gagal diputar:", error);
    }
  } else {
    music.pause();
    musicButton.textContent = "♫";
    musicButton.setAttribute("aria-label", "Putar musik");
  }
});




