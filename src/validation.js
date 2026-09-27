export function instagramUrl(value) {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  try {
    const u = new URL(value.trim());

    if (
      u.protocol !== 'https:' ||
      !['www.instagram.com', 'instagram.com'].includes(u.hostname)
    ) {
      return null;
    }

    const match = u.pathname.match(/^\/(p|reel|tv)\/([\w-]+)\/?$/);

    if (!match) {
      return null;
    }

    return `https://www.instagram.com/${match[1]}/${match[2]}/`;
  } catch {
    return null;
  }
}


export function imageUrl(value) {
  if (typeof value !== 'string') {
    return false;
  }

  const url = value.trim();

  if (!url) {
    return false;
  }

  // Gambar lokal dari folder public/assets
  if (/^\/assets\/[\w.-]+$/.test(url)) {
    return true;
  }

  try {
    const u = new URL(url);

    return (
      u.protocol === 'https:' &&
      Boolean(u.hostname) &&
      !u.username &&
      !u.password
    );
  } catch {
    return false;
  }
}


export function validateArticle(a) {

  /* =========================
     JUDUL
  ========================= */

  if (
    typeof a.title !== 'string' ||
    !a.title.trim() ||
    a.title.length > 180
  ) {
    return 'Judul wajib diisi, maksimal 180 karakter.';
  }


  /* =========================
     RINGKASAN
  ========================= */

  if (
    typeof a.excerpt !== 'string' ||
    !a.excerpt.trim() ||
    a.excerpt.length > 500
  ) {
    return 'Ringkasan wajib diisi, maksimal 500 karakter.';
  }


  /* =========================
     KATEGORI
  ========================= */

  if (
    ![
      'Kegiatan',
      'Akademik',
      'Organisasi',
      'Prestasi',
      'Pengumuman'
    ].includes(a.category)
  ) {
    return 'Pilih kategori berita yang valid.';
  }


  /* =========================
     SAMPUL — OPSIONAL
  ========================= */

  if (
    typeof a.cover === 'string' &&
    a.cover.trim() &&
    !imageUrl(a.cover)
  ) {
    return 'URL gambar sampul tidak valid.';
  }


  /* =========================
     BLOK ARTIKEL
  ========================= */

  if (
    !Array.isArray(a.blocks) ||
    !a.blocks.length ||
    a.blocks.length > 100
  ) {
    return 'Artikel harus memiliki 1–100 blok konten.';
  }


  /* =========================
     VALIDASI SETIAP BLOK
  ========================= */

  for (const b of a.blocks) {

    if (
      !b ||
      !['paragraph', 'image', 'instagram'].includes(b.type) ||
      typeof b.value !== 'string'
    ) {
      return 'Blok konten tidak valid.';
    }


    /* PARAGRAF */

    if (
      b.type === 'paragraph' &&
      !b.value.trim()
    ) {
      return 'Paragraf tidak boleh kosong.';
    }


    /* GAMBAR */

    if (b.type === 'image') {

      if (!imageUrl(b.value)) {
        return 'Blok gambar memerlukan gambar yang valid.';
      }

      if (
        typeof b.alt !== 'string' ||
        !b.alt.trim()
      ) {
        return 'Blok gambar memerlukan deskripsi alternatif.';
      }
    }


    /* INSTAGRAM */

    if (
      b.type === 'instagram' &&
      !instagramUrl(b.value)
    ) {
      return 'Gunakan URL posting atau reel Instagram yang valid.';
    }
  }


  return '';
}