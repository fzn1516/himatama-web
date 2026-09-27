const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");
const serviceAccount = require("./serviceAccountKey.json");

initializeApp({
  credential: cert(serviceAccount),
});

const uid = process.argv[2];

if (!uid) {
  console.error("UID belum dimasukkan.");
  process.exit(1);
}

getAuth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log("BERHASIL: akun sekarang memiliki hak admin.");
    process.exit(0);
  })
  .catch((error) => {
    console.error("GAGAL:", error.message);
    process.exit(1);
  });