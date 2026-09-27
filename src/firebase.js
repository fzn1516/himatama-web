import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';

import { samples } from './content';

const e = import.meta.env;

/* =========================
   FIREBASE CONFIG
========================= */

export const configured = Boolean(
  e.VITE_FIREBASE_API_KEY &&
  e.VITE_FIREBASE_PROJECT_ID &&
  e.VITE_FIREBASE_APP_ID &&
  e.VITE_FIREBASE_AUTH_DOMAIN
);

const app = configured
  ? initializeApp({
      apiKey: e.VITE_FIREBASE_API_KEY,
      authDomain: e.VITE_FIREBASE_AUTH_DOMAIN,
      projectId: e.VITE_FIREBASE_PROJECT_ID,
      messagingSenderId: e.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: e.VITE_FIREBASE_APP_ID
    })
  : null;

export const auth = app ? getAuth(app) : null;

const db = app ? getFirestore(app) : null;


/* =========================
   BERITA / FIRESTORE
========================= */

export async function articles(admin = false) {
  if (!configured) return samples;

  const c = collection(db, 'articles');

  const s = await getDocs(
    admin
      ? c
      : query(c, where('status', '==', 'published'))
  );

  return s.docs
    .map(d => ({
      ...d.data(),
      id: d.id
    }))
    .sort(
      (a, b) =>
        (b.publishedAt?.seconds || b.updatedAt?.seconds || 0) -
        (a.publishedAt?.seconds || a.updatedAt?.seconds || 0)
    );
}


export async function article(id) {
  if (!configured) {
    return samples.find(x => x.id === id);
  }

  const d = await getDoc(doc(db, 'articles', id));

  return d.exists()
    ? {
        ...d.data(),
        id: d.id
      }
    : null;
}


export async function saveArticle(a, status) {
  const id = a.id || crypto.randomUUID();

  const { id: ignored, ...data } = a;

  const target = doc(db, 'articles', id);

  await setDoc(target, {
    ...data,
    status,
    updatedAt: serverTimestamp(),

    publishedAt:
      status === 'published'
        ? (a.publishedAt || serverTimestamp())
        : (a.publishedAt || null)
  });

  const saved = await getDoc(target);

  return {
    ...saved.data(),
    id
  };
}


export async function removeArticle(id) {
  await deleteDoc(doc(db, 'articles', id));
}


/* =========================
   CLOUDINARY IMAGE UPLOAD
========================= */

export async function uploadImage(file) {

  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error(
      'Gunakan gambar JPG, PNG, atau WebP.'
    );
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error(
      'Ukuran gambar maksimal 5 MB.'
    );
  }

  const cloudName =
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  const uploadPreset =
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Konfigurasi Cloudinary belum tersedia.'
    );
  }

  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.error?.message ||
      'Gagal mengunggah gambar ke Cloudinary.'
    );
  }

  return result.secure_url;
}