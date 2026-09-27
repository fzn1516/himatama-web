export const complaint = 'https://docs.google.com/forms/d/e/1FAIpQLSe97NtxCpSV3ecOWJAEzDlEfL0lks-ZRqtbnEyzJ6EUHJdmXA/viewform';
export const categories = ['Kegiatan', 'Akademik', 'Organisasi', 'Prestasi', 'Pengumuman'];
export const leaders = [
  ['Saiful Mahfud','2025-2026','saiful.jpg'],
  ['Cyara Ciwi Ayuningtyas, S.Pd','2024-2025','cyara.jpeg'],
  ['Dimas Nugroho','2023-2024','dimas.jpeg'],
  ['Nur Kholis','2022-2023','nur.jpeg'],
  ['Bagas Bayu Winata, S.Pd','2021','bagas.jpeg'],
  ['Lena Wahyuni','2020','lena.png'],
  ['Muhammad Hidayatun Naim, S.Pd','2018-2019','naim.jpg'],
];
export const samples = [
 {id:'mengenal-himatama',title:'HIMATAMA: ruang bertumbuh, berkarya, dan berjalan bersama',category:'Organisasi',excerpt:'Mengenal Himpunan Mahasiswa Tadris Matematika, rumah bagi gagasan dan kebersamaan mahasiswa.',cover:'/assets/kegiatan.jpeg',blocks:[{type:'paragraph',value:'Himpunan Mahasiswa Tadris Matematika (HIMATAMA) dibentuk di IAIN Metro pada 18 Januari 2018. Kini HIMATAMA membawa identitas UIN Jurai Siwo Lampung, sebagai wadah pengembangan potensi dan aspirasi mahasiswa Tadris Matematika.'},{type:'paragraph',value:'HIMATAMA berupaya membentuk mahasiswa yang berkeislaman, berkeilmuan, dan berkeindonesiaan. Kebersamaan menjadi landasan untuk mengembangkan kemampuan akademik, profesional, serta minat dan bakat mahasiswa.'}]},
 {id:'mengenal-mustamat',title:'MUSTAMAT, ruang musyawarah dan regenerasi himpunan',category:'Organisasi',excerpt:'Mengenal Musyawarah Tadris Matematika dalam perjalanan organisasi.',cover:'/assets/mustamat.jpeg',blocks:[{type:'paragraph',value:'Musyawarah Tadris Matematika (MUSTAMAT) merupakan agenda organisasi yang mencakup pembahasan AD/ART, laporan pertanggungjawaban, pendemisioneran, serta pemilihan dan penetapan ketua.'}]},
 {id:'sigmoeba',title:'Berkenalan dengan SIGMOEBA, maskot HIMATAMA',category:'Organisasi',excerpt:'Adaptif, penuh potensi, dan terus bertransformasi.',cover:'/assets/maskot.jpeg',blocks:[{type:'paragraph',value:'SIGMOEBA terinspirasi dari amoeba. Bentuknya yang fleksibel melambangkan mahasiswa Tadris Matematika yang adaptif terhadap perubahan kurikulum, pendekatan pembelajaran, dan tantangan zaman.'},{type:'paragraph',value:'Satu sel dengan banyak fungsi menjadi simbol potensi besar setiap mahasiswa. Perubahan bentuknya menggambarkan transformasi pemikiran dalam proses belajar.'}]}
].map(x=>({...x,status:'published',sample:true}));
