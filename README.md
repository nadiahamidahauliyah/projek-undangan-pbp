# Raissa & Malik — Vintage Floral Islami

Undangan pernikahan digital berbasis HTML, CSS, dan JavaScript tanpa AI. Desain mengambil arah visual dari referensi: tekstur kertas krem, burgundy, ornamen bunga, lengkungan pintu Islami, karpet bermotif, aksen emas, serta panel gelap untuk RSVP dan Wedding Quest.

## Cara menjalankan
1. Ekstrak folder ZIP.
2. Buka `index.html` di browser. Untuk hasil terbaik, jalankan lewat Live Server di VS Code.
3. Ganti nama orang tua, jadwal, alamat, nomor rekening, foto, dan data lain yang masih berupa contoh.
4. Jika ingin musik, masukkan file MP3 ke folder `assets/` dan beri nama `lagu-undangan.mp3`.

## Bagian utama
- Sampul pembuka dengan tombol Click to Open
- Hero dengan teks Arab, ornamen masjid, pintu lengkung, bunga, dan karpet
- Mempelai, countdown, acara, Google Maps dan petunjuk arah
- Galeri dekoratif (siap diganti foto asli)
- RSVP dan buku ucapan (demo lokal)
- 8 misi Wedding Quest, skor maksimum 100 poin tanpa AI
- Hadiah digital dan tombol salin rekening

## Catatan penting
Form RSVP, buku ucapan, dan skor misi pada versi ini berjalan secara lokal di browser masing-masing. Data tidak terkirim ke pemilik undangan atau perangkat lain. Untuk pengumpulan online lintas perangkat, sambungkan ke database/backend. Jadwal dan detail acara saat ini adalah contoh dan harus dikonfirmasi sebelum dipublikasikan.


## Aset visual vintage floral
Folder `assets/` menyimpan potongan ornamen visual dari gambar referensi: bunga merah, pintu ukiran, karpet, dan dekorasi sisi. CSS memakainya sebagai aset dekoratif agar tampilan lebih dekat dengan referensi. Jika ingin mengganti gambar, cukup ganti file aset dengan nama yang sama.


## Pembaruan Hero & Wedding Quest
- Foto mempelai dapat dipilih dari perangkat dan ditampilkan di dalam bingkai lengkung.
- Wedding Quest menggunakan delapan misi asli: The Journey Begins, The Arrival, The Grand Entrance, A Wish for the Couple, The Memory Makers, The Celebration Table, The Green Promise, dan Until We Meet Again.
- Setiap misi menyediakan upload bukti foto dan pengaturan waktu mulai/batas waktu. Skor demo lebih tinggi jika bukti dikirim lebih awal di dalam rentang waktu; bukti di luar rentang mendapat 0 poin.
- Foto dan skor disimpan di localStorage browser. Ini hanya prototipe: jangan gunakan untuk penilaian resmi tanpa backend yang mencatat timestamp server dan mengunci pengaturan waktu.
