# Pemeriksaan ulang — 27 September 2026

## Diperbaiki
- Unggahan gambar blok kini memperbarui state terbaru berdasarkan ID blok. Mengubah urutan atau mengetik saat unggah tidak lagi menggunakan salinan lama seluruh blok.
- Simpan dan terbit dinonaktifkan selama unggahan berlangsung.
- Hasil penyimpanan dibaca kembali dari Firestore agar timestamp terbit pertama tersimpan dalam state editor dan tidak diganti saat penyimpanan berikutnya dalam sesi yang sama.
- Navigasi keluar editor dan penutupan tab mendapat perlindungan perubahan yang belum disimpan.
- Validasi menolak kategori tidak dikenal, ringkasan di atas 500 karakter, lebih dari 100 blok, tipe blok tidak dikenal, serta URL gambar yang rusak.
- Aturan Firestore memeriksa ringkasan dan sampul tidak kosong serta tipe tanggal terbit.
- Tombol menu menyediakan status terbuka/tertutup untuk pembaca layar; menu tablet dilipat pada lebar 721–900 piksel untuk menghindari kepadatan navigasi.

## Pemeriksaan yang selesai
- Empat tes validasi konten lulus; build produksi berhasil.
- Teks PPT sejarah dan materi dibaca ulang; lembar visual logo/maskot ditinjau. Tanggal pembentukan, daftar ketua terdahulu, dan konsep maskot cocok dengan materi. Saiful dan periode 2025–2026 berasal dari aset yang diberikan pengguna.
- Berkas logo, maskot, foto ketua, dan gambar artikel contoh tersedia.
- Link pengaduan cocok dengan URL yang diberikan pengguna.
- Source dan konfigurasi Vercel tersedia; rahasia service account tidak disertakan.

## Belum terverifikasi langsung
- Browser pengujian gagal diunduh. Tata letak dan interaksi belum diuji secara visual di browser desktop/ponsel.
- Firebase belum dikonfigurasi: login, custom claim admin, upload, CRUD, dan rules belum diuji dengan emulator atau project Firebase.
- Deploy Vercel dan akses Google Form/Instagram oleh pembaca belum diuji.
- Build masih memberi peringatan ukuran bundle JavaScript. Ini tidak menggagalkan build, tetapi optimasi pemuatan masih dapat dilakukan.

## Batasan konten
- Tiga artikel yang tampil tanpa Firebase merupakan contoh dari materi organisasi. Setelah Firebase diaktifkan, berita berasal dari database.
- Kontak sekretariat/email belum tersedia dan belum diisi dengan data rekaan.
- Masa jabatan 2020 dan 2021 ditampilkan sebagai satu tahun sesuai materi; tidak ditambah rentang yang belum dikonfirmasi.

Referensi teknis pemeriksaan: https://reactrouter.com/api/hooks/useBlocker dan https://firebase.google.com/docs/firestore/security/rules-conditions
