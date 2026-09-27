# HIMATAMA Web

Portal organisasi HIMATAMA UIN Jurai Siwo Lampung. React + Vite, Firebase Authentication, Firestore, dan Storage. Source siap ditempatkan di GitHub dan di-deploy ke Vercel. Belum terhubung ke akun Firebase atau Vercel organisasi.

## Menjalankan

```sh
npm install
npm run dev
```

Jalankan `npm test` untuk validasi konten dan `npm run build` untuk build produksi. Output berada di `dist/`. Tanpa konfigurasi Firebase, web menampilkan tiga artikel contoh dari materi organisasi dan menonaktifkan login CMS. Contoh tidak otomatis dimasukkan ke database. Setelah Firebase aktif, database kosong menampilkan kondisi belum ada berita.

## Firebase

1. Buat project Firebase dan tambahkan aplikasi Web.
2. Aktifkan Authentication > Email/Password. Buat akun pengurus melalui console; situs tidak menyediakan pendaftaran publik.
3. Buat Firestore Database dan Storage. Pilih lokasi yang sesuai.
4. Buat `.env.local` menggunakan kunci di `.env.example`, lalu isi konfigurasi Web dari Firebase Console. Jangan memasukkan service-account key ke variabel VITE.
5. Deploy `firestore.rules` dan `storage.rules` melalui Firebase CLI: `firebase deploy --only firestore:rules,storage --project PROJECT_ID`. Jangan menggunakan test mode atau rules yang mengizinkan semua penulisan.
6. Berikan custom claim `admin: true` pada UID pengurus. Pada mesin tepercaya, instal `firebase-admin` dengan `npm install --no-save firebase-admin`, konfigurasi Application Default Credentials atau GOOGLE_APPLICATION_CREDENTIALS ke service account di luar repo, lalu jalankan `node scripts/set-admin.mjs UID`. Jangan membagikan file kredensial. Pengurus harus keluar dan masuk lagi sesudah claim berubah.
7. Tambahkan domain Vercel/domain resmi ke Authorized domains di Authentication bila diperlukan.
8. Uji login, create, save draft, publish, edit, unpublish (Simpan draf), dan delete pada project uji sebelum produksi.

**Biaya:** Cloud Storage for Firebase memerlukan paket Blaze dan billing account. Kuota tanpa biaya tersedia, tetapi tidak berarti bebas risiko tagihan. Pasang budget alerts (bukan pembatas biaya). Sumber: https://firebase.google.com/docs/storage/faqs-storage-changes-announced-sept-2024

## GitHub dan Vercel

1. Push isi folder ini ke repository GitHub. `.env.local`, `node_modules`, dan `dist` tidak perlu diunggah.
2. Import repository ke Vercel, pilih framework Vite, build command `npm run build`, output `dist`.
3. Isi semua variabel dari `.env.example` pada Environment Variables Vercel, kemudian deploy. Redeploy setelah mengganti variabel.
4. `vercel.json` mengarahkan route publik dan admin ke aplikasi agar refresh halaman detail berfungsi. GitHub menyimpan source; ini bukan konfigurasi GitHub Pages.

## Konten dan CMS

- `/`: beranda editorial; `/berita`: daftar kategori; `/berita/:id`: artikel.
- `/tentang`: sejarah, makna logo, grid tujuh ketua umum yang dibuka lewat tombol, maskot SIGMOEBA.
- `/informasi`: informasi organisasi dan Google Form pengaduan.
- `/admin`: login dan pengelolaan berita. Tambahkan paragraf, gambar, dan URL posting/reel Instagram. Blok dapat diurutkan dan dihapus; Instagram dapat ditempatkan di tengah artikel.
- Tombol pratinjau menampilkan artikel sebelum disimpan. Terbitkan membuatnya tersedia publik; Simpan draf menghapus artikel dari daftar publik sampai diterbitkan lagi.
- Foto berita diunggah sebagai JPG/PNG/WebP maksimal 5 MB. Penghapusan berita tidak otomatis menghapus gambar untuk menghindari rusaknya gambar yang digunakan kembali. Bersihkan aset tidak terpakai melalui Storage Console.
- Gambar Storage bersifat publik, termasuk gambar untuk draf. Jangan unggah dokumen rahasia. Draf teks dibatasi untuk admin oleh Firestore Rules.
- Instagram hanya dimuat setelah pembaca menekan tombol, dengan tautan alternatif. Posting privat/dihapus atau yang menonaktifkan embed mungkin tidak tampil.
- URL artikel menggunakan ID stabil agar perubahan judul tidak merusak tautan.

## Materi

Data organisasi dan contoh artikel di `src/content.js`; layout di `src/main.jsx`; palet dan responsivitas di `src/style.css`. Aset logo, foto ketua, maskot, dan dokumentasi berasal dari berkas pengguna. Contoh artikel bukan klaim tentang kegiatan baru. Kontak lama dari PPT tidak dipublikasikan karena belum dikonfirmasi.

## Batasan verifikasi

Build produksi berhasil dan empat tes validasi konten lulus. Pemeriksaan visual browser belum selesai karena unduhan browser pengujian gagal di lingkungan pengerjaan. Periksa tampilan desktop dan ponsel setelah menjalankan proyek atau deploy pratinjau. Rincian pemeriksaan tersedia di `AUDIT.md`.

Integrasi live Firebase, otorisasi rules terhadap project nyata, pengiriman upload, dan deploy Vercel memerlukan konfigurasi serta akun organisasi. Verifikasi build dan tes lokal tidak menggantikan pengujian tersebut. Lakukan pengujian akun non-admin dan pembacaan draf tanpa login sebelum peluncuran.
