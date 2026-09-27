import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

import {
  createBrowserRouter,
  RouterProvider,
  useBlocker,
  Routes,
  Route,
  Link,
  NavLink,
  useParams,
  useLocation,
  useNavigate
} from 'react-router-dom';

import {
  Menu,
  X,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  LogOut,
  Save,
  ImagePlus,
  Type,
  Instagram,
  Eye
} from 'lucide-react';

import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

import {
  configured,
  auth,
  articles,
  article,
  saveArticle,
  removeArticle,
  uploadImage
} from './firebase';

import {
  complaint,
  leaders,
  categories
} from './content';

import {
  instagramUrl,
  imageUrl,
  validateArticle
} from './validation';

import './style.css';


/* =========================================================
   ICON BUTTON
========================================================= */

function IconButton({ label, children, ...props }) {
  return (
    <button
      type="button"
      className="icon-button"
      title={label}
      aria-label={label}
      {...props}
    >
      {children}
    </button>
  );
}


/* =========================================================
   APP
========================================================= */

function App() {
  const [menu, setMenu] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <>
      <a className="skip" href="#main">
        Ke konten utama
      </a>

      <header>
        <div className="nav wrap">

          <Link className="brand" to="/">
            <img
              src="/assets/logo.png"
              alt="Logo HIMATAMA"
            />

            <span>
              HIMATAMA
              <small>
                UIN JURAI SIWO LAMPUNG
              </small>
            </span>
          </Link>

          <IconButton
            label={menu ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menu}
            aria-controls="main-nav"
            className="mobile-menu icon-button"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </IconButton>

          <nav
            id="main-nav"
            className={menu ? 'open' : ''}
            aria-label="Navigasi utama"
          >
            <NavLink to="/" end>
              Beranda
            </NavLink>

            <NavLink to="/berita">
              Berita
            </NavLink>

            <NavLink to="/tentang">
              Tentang Organisasi
            </NavLink>

            <NavLink to="/informasi">
              Informasi
            </NavLink>

            <a
              className="complaint"
              href={complaint}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pengaduan
              <ArrowUpRight size={16} />
            </a>
          </nav>

        </div>
      </header>

      <main id="main">
        <Routes>

          <Route
            path="/"
            element={<News home />}
          />

          <Route
            path="/berita"
            element={<News />}
          />

          <Route
            path="/berita/:id"
            element={<Detail />}
          />

          <Route
            path="/tentang"
            element={<About />}
          />

          <Route
            path="/informasi"
            element={<Information />}
          />

          <Route
            path="/admin/*"
            element={<Admin />}
          />

          <Route
            path="*"
            element={
              <section className="wrap page">
                <h1>Halaman tidak ditemukan</h1>
                <Link to="/">
                  Kembali ke beranda
                </Link>
              </section>
            }
          />

        </Routes>
      </main>

      <footer>

        <div className="wrap footer-grid">

          <div>
            <Link to="/" className="brand">
              HIMATAMA
            </Link>

            <p>
              Himpunan Mahasiswa Tadris Matematika
              <br />
              UIN Jurai Siwo Lampung
            </p>
          </div>

          <div>
            <strong>Jelajahi</strong>

            <Link to="/berita">
              Berita
            </Link>

            <Link to="/tentang">
              Tentang Organisasi
            </Link>
          </div>

          <div>
            <strong>Terhubung</strong>

            <Link to="/informasi">
              Informasi
            </Link>

            <a
              href={complaint}
              target="_blank"
              rel="noopener noreferrer"
            >
              Pengaduan
              <ArrowUpRight size={14} />
            </a>
          </div>

        </div>

        <div className="wrap footer-bottom">
          <span>
            © {new Date().getFullYear()} HIMATAMA
          </span>

          <Link to="/admin">
            Login admin
          </Link>
        </div>

      </footer>
    </>
  );
}


/* =========================================================
   NEWS DATA
========================================================= */

function useNews() {

  const [state, setState] = useState({
    loading: true,
    data: [],
    error: ''
  });

  useEffect(() => {

    let live = true;

    articles()
      .then(data => {
        if (live) {
          setState({
            data,
            loading: false,
            error: ''
          });
        }
      })
      .catch(() => {
        if (live) {
          setState({
            data: [],
            loading: false,
            error:
              'Berita belum dapat dimuat. Silakan muat ulang halaman.'
          });
        }
      });

    return () => {
      live = false;
    };

  }, []);

  return state;
}


/* =========================================================
   NEWS CARD
   SAMPUL OPSIONAL
========================================================= */

function NewsCard({ item, large = false }) {

  const hasCover = imageUrl(item.cover);

  return (
    <Link
      to={`/berita/${item.id}`}
      className={`news-card ${large ? 'large' : ''} ${
        hasCover ? '' : 'no-cover'
      }`}
    >

      {hasCover && (
        <div className="news-photo">

          <img
            src={item.cover}
            alt={item.coverAlt || ''}
            loading={large ? 'eager' : 'lazy'}
          />

          <span className="photo-arrow">
            <ArrowUpRight />
          </span>

        </div>
      )}

      <div className="news-copy">

        <span className="eyebrow">
          {item.category}
        </span>

        <h2>
          {item.title}
        </h2>

        <p>
          {item.excerpt}
        </p>

        <span className="meta">
          {item.sample
            ? 'Artikel contoh · Bersumber dari materi organisasi'
            : formatDate(item.publishedAt)}
        </span>

      </div>

    </Link>
  );
}


function formatDate(value) {

  return value?.seconds
    ? new Intl.DateTimeFormat(
        'id-ID',
        { dateStyle: 'long' }
      ).format(
        new Date(value.seconds * 1000)
      )
    : '';
}


/* =========================================================
   NEWS PAGE
========================================================= */

function News({ home = false }) {

  const {
    loading,
    data,
    error
  } = useNews();

  const [category, setCategory] =
    useState('Semua');

  const filtered = data.filter(
    x =>
      category === 'Semua' ||
      x.category === category
  );

  return (
    <>

      <section className="wrap page">

        <div className="edition">

          <span>
            HIMPUNAN MAHASISWA TADRIS MATEMATIKA
          </span>

          <span>
            BERKEISLAMAN · BERKEILMUAN · BERKEINDONESIAAN
          </span>

        </div>

        <div className="section-heading">

          <div>

            <span className="eyebrow">
              KABAR & CERITA KITA
            </span>

            <h1>
              {home
                ? 'Dari HIMATAMA, untuk kita.'
                : 'Berita HIMATAMA'}
            </h1>

          </div>

          <span className="edition-number">
            EST. 2018
          </span>

        </div>

        {!configured && (
          <div className="notice">
            Pratinjau konten · Artikel pengenalan
            dari materi organisasi, bukan berita terbit.
          </div>
        )}

        <div
          className="filters"
          aria-label="Kategori berita"
        >

          {['Semua', ...categories].map(c => (

            <button
              key={c}
              aria-pressed={c === category}
              className={
                c === category
                  ? 'selected'
                  : ''
              }
              onClick={() =>
                setCategory(c)
              }
            >
              {c}
            </button>

          ))}

        </div>

        {loading ? (

          <p role="status">
            Memuat berita...
          </p>

        ) : error ? (

          <p role="alert">
            {error}
          </p>

        ) : filtered.length === 0 ? (

          <div className="empty">

            <h2>
              Belum ada berita
              {category !== 'Semua'
                ? ` ${category.toLowerCase()}`
                : ''}
              .
            </h2>

            <p>
              Kabar terbaru dari HIMATAMA
              akan hadir di sini.
            </p>

          </div>

        ) : (

          <div
            className={
              home && category === 'Semua'
                ? 'lead-grid'
                : 'news-grid'
            }
          >

            {filtered.map((item, i) => (

              <NewsCard
                key={item.id}
                item={item}
                large={
                  home &&
                  category === 'Semua' &&
                  i === 0
                }
              />

            ))}

          </div>

        )}

      </section>

      {home && (
        <>

          <section className="about-band">

            <div className="wrap about-intro">

              <div>

                <span className="eyebrow">
                  RUMAH BAGI SETIAP POTENSI
                </span>

                <h2>
                  Satu himpunan.
                  <br />
                  Banyak kemungkinan.
                </h2>

                <p>
                  Sejak 18 Januari 2018,
                  HIMATAMA menjadi ruang belajar,
                  bertukar gagasan, dan tumbuh
                  bersama bagi mahasiswa
                  Tadris Matematika.
                </p>

                <Link
                  className="text-link"
                  to="/tentang"
                >
                  Kenali HIMATAMA
                  <ArrowRight size={18} />
                </Link>

              </div>

              <img
                src="/assets/logo.png"
                alt="Lambang HIMATAMA UIN Jurai Siwo Lampung"
              />

            </div>

          </section>

          <section className="wrap quick-info">

            <div>

              <span className="eyebrow">
                SUARA MAHASISWA
              </span>

              <h2>
                Aspirasi kamu berarti.
              </h2>

              <p>
                Sampaikan masukan dan pengaduan
                melalui kanal organisasi.
              </p>

            </div>

            <a
              className="button"
              href={complaint}
              target="_blank"
              rel="noopener noreferrer"
            >
              Sampaikan pengaduan
              <ArrowUpRight size={18} />
            </a>

          </section>

        </>
      )}

    </>
  );
}


/* =========================================================
   ARTICLE BLOCKS
========================================================= */

function Blocks({ blocks = [] }) {

  return (
    <div className="article-body">

      {blocks.map((b, i) => {

        if (b.type === 'paragraph') {

          return (
            <p key={b.id || i}>
              {b.value}
            </p>
          );
        }

        if (
          b.type === 'image' &&
          imageUrl(b.value)
        ) {

          return (
            <figure key={b.id || i}>

              <img
                src={b.value}
                alt={b.alt || ''}
                loading="lazy"
              />

              {b.caption && (
                <figcaption>
                  {b.caption}
                </figcaption>
              )}

            </figure>
          );
        }

        if (
          b.type === 'instagram' &&
          instagramUrl(b.value)
        ) {

          return (
            <InstagramBlock
              key={b.id || i}
              url={instagramUrl(b.value)}
            />
          );
        }

        return null;
      })}

    </div>
  );
}


/* =========================================================
   INSTAGRAM
   LANGSUNG PREVIEW
========================================================= */

function InstagramBlock({ url }) {

  return (
    <div className="instagram-block">

      <iframe
        src={`${url}embed/`}
        title="Posting Instagram"
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        Lihat di Instagram
        <ArrowUpRight size={16} />
      </a>

    </div>
  );
}


/* =========================================================
   ARTICLE DETAIL
   SAMPUL OPSIONAL
========================================================= */

function Detail() {

  const { id } = useParams();

  const [state, setState] =
    useState({
      loading: true
    });

  useEffect(() => {

    let live = true;

    setState({
      loading: true
    });

    article(id)
      .then(data => {
        if (live) {
          setState({ data });
        }
      })
      .catch(() => {
        if (live) {
          setState({
            error: true
          });
        }
      });

    return () => {
      live = false;
    };

  }, [id]);

  if (state.loading) {

    return (
      <section
        className="wrap page"
        role="status"
      >
        Memuat artikel...
      </section>
    );
  }

  if (!state.data || state.error) {

    return (
      <section className="wrap page">

        <h1>
          Artikel tidak tersedia
        </h1>

        <Link to="/berita">
          Kembali ke berita
        </Link>

      </section>
    );
  }

  const a = state.data;

  const hasCover =
    imageUrl(a.cover);

  return (
    <article className="wrap page article">

      <Link
        className="text-link"
        to="/berita"
      >
        Berita / {a.category}
      </Link>

      <span className="eyebrow">
        {a.category}
      </span>

      <h1>
        {a.title}
      </h1>

      <p className="dek">
        {a.excerpt}
      </p>

      <p className="meta">
        HIMATAMA ·{' '}
        {a.sample
          ? 'Artikel contoh dari materi organisasi'
          : formatDate(a.publishedAt)}
      </p>

      {hasCover && (
        <img
          className="article-cover"
          src={a.cover}
          alt={a.coverAlt || a.title}
        />
      )}

      <Blocks
        blocks={a.blocks || []}
      />

    </article>
  );
}


/* =========================================================
   ABOUT
========================================================= */

function About() {

  const [open, setOpen] =
    useState(false);

  return (
    <div className="wrap page">

      <div className="section-heading">

        <div>

          <span className="eyebrow">
            MENGENAL LEBIH DEKAT
          </span>

          <h1>
            Tentang HIMATAMA
          </h1>

        </div>

      </div>

      <section className="history">

        <div>

          <span className="eyebrow">
            01 / SEJARAH
          </span>

          <h2>
            Berawal dari kebersamaan.
            <br />
            Bergerak untuk kemajuan.
          </h2>

          <p>
            Himpunan Mahasiswa Tadris
            Matematika dibentuk di IAIN
            Metro pada{' '}
            <strong>
              18 Januari 2018
            </strong>
            . HIMATAMA merupakan nama
            yang digunakan HMPS Tadris
            Matematika di tingkat
            nasional, dan kini membawa
            identitas UIN Jurai Siwo
            Lampung.
          </p>

          <p>
            HIMATAMA memperjuangkan
            kepentingan dan hak mahasiswa,
            membangun relasi, serta
            mengembangkan ilmu pengetahuan
            dan potensi mahasiswa dengan
            semangat keislaman, keilmuan,
            dan keindonesiaan.
          </p>

        </div>

        <img
          src="/assets/logo.png"
          alt="Logo HIMATAMA"
        />

      </section>

      <section className="about-section">

        <span className="eyebrow">
          02 / IDENTITAS
        </span>

        <h2>
          Makna dalam setiap elemen.
        </h2>

        <div className="meaning-grid">

          {[
            [
              'Buku terbuka',
              'Terbuka menerima ilmu dan mengamalkannya.'
            ],
            [
              'M, Phi, dan Sigma',
              'Identitas matematika, keteraturan, keindahan, serta kolaborasi dalam menghimpun potensi.'
            ],
            [
              'Belah ketupat & segi delapan',
              'Keberlanjutan antargenerasi dan keseimbangan duniawi dengan ukhrawi.'
            ],
            [
              'Nama & elemen',
              'Himpunan yang solid berlandaskan iman dan Islam, dengan identitas UIN Jurai Siwo Lampung.'
            ]
          ].map(([h, p]) => (

            <div key={h}>
              <h3>{h}</h3>
              <p>{p}</p>
            </div>

          ))}

        </div>

      </section>

      <section className="about-section">

        <button
          className="leader-toggle"
          onClick={() =>
            setOpen(!open)
          }
          aria-expanded={open}
          aria-controls="leaders"
        >

          <span>

            <span className="eyebrow">
              03 / KETUA UMUM
            </span>

            <span className="h2">
              Estafet kepemimpinan
            </span>

          </span>

          <ChevronDown
            className={
              open
                ? 'rotate'
                : ''
            }
          />

        </button>

        {open && (

          <div
            className="leader-grid"
            id="leaders"
          >

            {leaders.map(
              ([name, term, img]) => (

                <article
                  className="leader"
                  key={term}
                >

                  <img
                    src={`/assets/${img}`}
                    alt={name}
                    loading="lazy"
                  />

                  <h3>{name}</h3>

                  <p>
                    Ketua Umum HIMATAMA{' '}
                    {term}
                  </p>

                </article>

              )
            )}

          </div>

        )}

      </section>

      <section className="maskot about-section">

        <img
          src="/assets/maskot.jpeg"
          alt="SIGMOEBA, maskot HIMATAMA"
        />

        <div>

          <span className="eyebrow">
            04 / MASKOT
          </span>

          <h2>
            Halo, SIGMOEBA.
          </h2>

          <p>
            Terinspirasi dari amoeba,
            SIGMOEBA membawa semangat
            mahasiswa Tadris Matematika
            yang adaptif, penuh potensi,
            dan terus bertransformasi.
          </p>

          <h3>
            Adaptif dan fleksibel
          </h3>

          <p>
            Siap menghadapi perubahan
            kurikulum, pendekatan
            pembelajaran, dan tantangan
            zaman.
          </p>

          <h3>
            Satu sel, banyak potensi
          </h3>

          <p>
            Setiap mahasiswa memiliki
            potensi besar, dari latar
            belakang apa pun.
          </p>

          <h3>
            Terus bertransformasi
          </h3>

          <p>
            Perjalanan belajar mengubah
            pemikiran, dari awam menuju
            ahli.
          </p>

        </div>

      </section>

    </div>
  );
}


/* =========================================================
   INFORMATION
========================================================= */

function Information() {

  return (
    <section className="wrap page">

      <span className="eyebrow">
        TETAP TERHUBUNG
      </span>

      <h1>
        Informasi
      </h1>

      <div className="information-grid">

        <div>

          <h2>
            HIMATAMA
          </h2>

          <p>
            Himpunan Mahasiswa
            Tadris Matematika
            <br />
            UIN Jurai Siwo Lampung
          </p>

          <p>
            Informasi sekretariat,
            email, dan media sosial
            resmi akan ditampilkan
            setelah dikonfirmasi
            oleh pengurus.
          </p>

        </div>

        <div>

          <h2>
            Pengaduan & aspirasi
          </h2>

          <p>
            Gunakan formulir pengaduan
            untuk menyampaikan masukan
            kepada organisasi. Formulir
            dibuka melalui Google Forms.
          </p>

          <a
            className="button"
            href={complaint}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buka formulir
            <ArrowUpRight size={18} />
          </a>

        </div>

      </div>

    </section>
  );
}


/* =========================================================
   ADMIN
========================================================= */

function Admin() {

  const [session, setSession] =
    useState({
      loading: configured,
      user: null,
      admin: false
    });

  const [error, setError] =
    useState('');

  const [busy, setBusy] =
    useState(false);

  useEffect(() => {

    if (!auth) return;

    return onAuthStateChanged(
      auth,
      async user => {

        try {

          const token = user
            ? await user.getIdTokenResult()
            : null;

          setSession({
            loading: false,
            user,
            admin:
              token?.claims.admin === true
          });

        } catch {

          setError(
            'Sesi tidak dapat diperiksa. Silakan masuk ulang.'
          );

          setSession({
            loading: false,
            user: null,
            admin: false
          });
        }

      }
    );

  }, []);

  async function login(e) {

    e.preventDefault();

    setBusy(true);
    setError('');

    const f =
      new FormData(e.currentTarget);

    try {

      await signInWithEmailAndPassword(
        auth,
        f.get('email'),
        f.get('password')
      );

    } catch {

      setError(
        'Login gagal. Periksa email dan kata sandi Anda.'
      );

    } finally {

      setBusy(false);
    }
  }

  if (!configured) {

    return (
      <section className="wrap page narrow">

        <span className="eyebrow">
          RUANG REDAKSI
        </span>

        <h1>
          CMS HIMATAMA
        </h1>

        <div className="notice">
          Firebase belum terhubung.
          Isi konfigurasi proyek untuk
          mengaktifkan login dan
          pengelolaan berita.
        </div>

        <p>
          Panduan konfigurasi dan
          pemberian akses admin tersedia
          dalam README proyek.
        </p>

      </section>
    );
  }

  if (session.loading) {

    return (
      <section className="wrap page">
        Memeriksa sesi...
      </section>
    );
  }

  if (!session.admin) {

    return (
      <section className="wrap page narrow">

        <span className="eyebrow">
          RUANG REDAKSI
        </span>

        <h1>
          Login admin
        </h1>

        {session.user ? (
          <>

            <p role="alert">
              Akun ini belum memiliki
              akses admin.
            </p>

            <button
              className="button"
              onClick={() =>
                signOut(auth)
              }
            >
              Keluar
            </button>

          </>
        ) : (

          <form onSubmit={login}>

            <label>
              Email

              <input
                name="email"
                type="email"
                autoComplete="username"
                required
              />
            </label>

            <label>
              Kata sandi

              <input
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
            </label>

            {error && (
              <p role="alert">
                {error}
              </p>
            )}

            <button
              className="button"
              disabled={busy}
            >
              {busy
                ? 'Memproses...'
                : 'Masuk'}
            </button>

          </form>
        )}

      </section>
    );
  }

  return (
    <section className="wrap page">

      <div className="admin-heading">

        <div>

          <span className="eyebrow">
            RUANG REDAKSI
          </span>

          <h1>
            Kelola berita
          </h1>

        </div>

        <IconButton
          label="Keluar"
          onClick={() => {

            if (
              window.confirm(
                'Keluar dari admin? Pastikan perubahan artikel sudah disimpan dan unggahan selesai.'
              )
            ) {
              signOut(auth).catch(
                () =>
                  setError(
                    'Gagal keluar. Coba lagi.'
                  )
              );
            }

          }}
        >
          <LogOut />
        </IconButton>

      </div>

      <Routes>

        <Route
          index
          element={<Manager />}
        />

        <Route
          path="baru"
          element={<Editor />}
        />

        <Route
          path=":id"
          element={<Editor />}
        />

      </Routes>

    </section>
  );
}


/* =========================================================
   MANAGER
========================================================= */

function Manager() {

  const [data, setData] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [deleting, setDeleting] =
    useState('');

  async function refresh() {

    setLoading(true);

    try {

      setData(
        await articles(true)
      );

      setError('');

    } catch {

      setError(
        'Daftar berita gagal dimuat.'
      );

    } finally {

      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function remove(a) {

    if (
      !window.confirm(
        `Hapus berita "${a.title}"? Tindakan ini tidak dapat dibatalkan.`
      )
    ) {
      return;
    }

    setDeleting(a.id);

    try {

      await removeArticle(a.id);
      await refresh();

    } catch {

      setError(
        'Berita gagal dihapus. Coba lagi.'
      );

    } finally {

      setDeleting('');
    }
  }

  return (
    <>

      <Link
        className="button"
        to="/admin/baru"
      >
        <Plus size={18} />
        Buat berita
      </Link>

      {error && (

        <p role="alert">

          {error}{' '}

          <button
            onClick={refresh}
          >
            Coba lagi
          </button>

        </p>
      )}

      {loading ? (

        <p>
          Memuat berita...
        </p>

      ) : !data.length ? (

        <div className="empty">
          Belum ada berita.
          Mulai dengan membuat
          artikel pertama.
        </div>

      ) : (

        <div className="manager-list">

          {data.map(a => (

            <div
              className="manager-row"
              key={a.id}
            >

              <div>

                <span className="eyebrow">
                  {a.status === 'published'
                    ? 'Terbit'
                    : 'Draf'}
                </span>

                <h3>
                  {a.title}
                </h3>

              </div>

              <Link
                className="text-link"
                to={`/admin/${a.id}`}
              >
                Edit
              </Link>

              <IconButton
                label={`Hapus ${a.title}`}
                disabled={Boolean(deleting)}
                onClick={() =>
                  remove(a)
                }
              >
                <Trash2 size={18} />
              </IconButton>

            </div>

          ))}

        </div>
      )}

    </>
  );
}


/* =========================================================
   UPLOAD
========================================================= */

function Upload({
  onChange,
  label,
  onBusy
}) {

  const [busy, setBusy] =
    useState(false);

  const [error, setError] =
    useState('');

  return (
    <label className="upload">

      {busy
        ? 'Mengunggah...'
        : label}

      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={busy}
        onChange={async e => {

          const f =
            e.target.files[0];

          if (!f) return;

          setBusy(true);

          onBusy?.(1);

          setError('');

          try {

            onChange(
              await uploadImage(f)
            );

          } catch (err) {

            setError(
              err.message
            );

          } finally {

            setBusy(false);

            onBusy?.(-1);

            e.target.value = '';
          }

        }}
      />

      {error && (
        <span role="alert">
          {error}
        </span>
      )}

    </label>
  );
}


/* =========================================================
   EMPTY ARTICLE
========================================================= */

const blank = () => ({
  title: '',
  excerpt: '',
  category: 'Kegiatan',
  cover: '',
  coverAlt: '',
  blocks: [],
  status: 'draft'
});


/* =========================================================
   EDITOR
========================================================= */

function Editor() {

  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [a, setA] =
    useState(blank);

  const [loading, setLoading] =
    useState(Boolean(id));

  const [busy, setBusy] =
    useState(false);

  const [message, setMessage] =
    useState('');

  const [preview, setPreview] =
    useState(false);

  const [dirty, setDirty] =
    useState(false);

  const [uploads, setUploads] =
    useState(0);

  const uploadBusy = delta =>
    setUploads(
      n => Math.max(0, n + delta)
    );

  const blocker =
    useBlocker(
      dirty ||
      uploads > 0 ||
      busy
    );


  /* ---------------------------------------------------------
     Setelah artikel baru mendapat ID,
     arahkan editor ke URL artikel tersebut.
  --------------------------------------------------------- */

  useEffect(() => {

    if (
      !id &&
      a.id &&
      !dirty &&
      !busy
    ) {

      navigate(
        `/admin/${a.id}`,
        { replace: true }
      );
    }

  }, [
    a.id,
    id,
    dirty,
    busy,
    navigate
  ]);


  /* ---------------------------------------------------------
     Load artikel ketika edit
  --------------------------------------------------------- */

  useEffect(() => {

    if (!id) return;

    let live = true;

    article(id)
      .then(data => {

        if (live) {

          if (data) {

            setA({
              ...data,

              blocks:
                (data.blocks || [])
                  .map(b => ({
                    ...b,
                    id:
                      b.id ||
                      crypto.randomUUID()
                  }))
            });

          } else {

            setMessage(
              'Berita tidak ditemukan.'
            );
          }

          setLoading(false);
        }

      })
      .catch(() => {

        if (live) {

          setMessage(
            'Gagal memuat artikel.'
          );

          setLoading(false);
        }

      });

    return () => {
      live = false;
    };

  }, [id]);


  /* ---------------------------------------------------------
     Peringatan sebelum meninggalkan editor
  --------------------------------------------------------- */

  useEffect(() => {

    function warn(e) {

      if (
        dirty ||
        uploads > 0 ||
        busy
      ) {

        e.preventDefault();
        e.returnValue = '';
      }
    }

    window.addEventListener(
      'beforeunload',
      warn
    );

    return () =>
      window.removeEventListener(
        'beforeunload',
        warn
      );

  }, [
    dirty,
    uploads,
    busy
  ]);


  function change(p) {

    setDirty(true);

    setA(v => ({
      ...v,
      ...p
    }));
  }


  function blockChange(
    blockId,
    p
  ) {

    setDirty(true);

    setA(v => ({
      ...v,

      blocks:
        v.blocks.map(
          b =>
            b.id === blockId
              ? {
                  ...b,
                  ...p
                }
              : b
        )
    }));
  }


  function move(i, delta) {

    const b =
      [...a.blocks];

    [
      b[i],
      b[i + delta]
    ] = [
      b[i + delta],
      b[i]
    ];

    change({
      blocks: b
    });
  }


  async function save(status) {

    if (
      busy ||
      uploads
    ) {
      return;
    }

    const error =
      validateArticle(a);

    if (error) {

      setMessage(error);
      return;
    }

    setBusy(true);
    setMessage('');

    try {

      const saved =
        await saveArticle(
          a,
          status
        );

      setDirty(false);

      setA(saved);

      setMessage(
        status === 'published'
          ? 'Artikel berhasil diterbitkan.'
          : 'Draf berhasil disimpan.'
      );

    } catch {

      setMessage(
        'Gagal menyimpan. Periksa koneksi dan izin admin.'
      );

    } finally {

      setBusy(false);
    }
  }


  if (loading) {

    return (
      <p>
        Memuat editor...
      </p>
    );
  }


  if (
    id &&
    !a.id
  ) {

    return (
      <p role="alert">
        {message}
      </p>
    );
  }


  return (
    <>

      {blocker.state ===
        'blocked' && (

        <div
          className="notice"
          role="alert"
        >

          <p>

            {busy ||
            uploads > 0
              ? 'Proses simpan atau unggah masih berjalan. Tunggu sampai selesai.'
              : 'Ada perubahan yang belum disimpan. Tinggalkan editor?'}

          </p>

          <button
            className="button"
            onClick={() =>
              blocker.reset()
            }
          >
            Tetap mengedit
          </button>

          {' '}

          <button
            disabled={
              busy ||
              uploads > 0
            }
            onClick={() =>
              blocker.proceed()
            }
          >
            Tinggalkan
          </button>

        </div>
      )}


      {/* TOOLBAR */}

      <div className="editor-toolbar">

        <button
          disabled={
            busy ||
            uploads > 0
          }
          onClick={() =>
            navigate('/admin')
          }
        >
          Kembali
        </button>

        <button
          onClick={() =>
            setPreview(!preview)
          }
        >
          <Eye size={17} />

          {preview
            ? 'Edit'
            : 'Pratinjau'}
        </button>

        <button
          disabled={
            busy ||
            uploads > 0
          }
          onClick={() =>
            save('draft')
          }
        >
          <Save size={17} />
          Simpan draf
        </button>

        <button
          className="button"
          disabled={
            busy ||
            uploads > 0
          }
          onClick={() =>
            save('published')
          }
        >
          {busy
            ? 'Menyimpan...'
            : 'Terbitkan'}
        </button>

      </div>


      {message && (

        <p
          role="status"
          className="notice"
        >
          {message}
        </p>

      )}


      {/* =====================================================
          PREVIEW
      ===================================================== */}

      {preview ? (

        <article className="article">

          <h1>
            {a.title ||
              'Judul artikel'}
          </h1>

          <p>
            {a.excerpt}
          </p>

          {imageUrl(a.cover) && (

            <img
              className="article-cover"
              src={a.cover}
              alt={
                a.coverAlt ||
                a.title ||
                'Sampul artikel'
              }
            />

          )}

          <Blocks
            blocks={
              a.blocks || []
            }
          />

        </article>

      ) : (

        /* ===================================================
           EDIT MODE
        =================================================== */

        <fieldset
          disabled={busy}
          className="editor-fields"
        >

          <div className="editor-metadata">

            <label>
              Judul

              <input
                maxLength={180}
                value={a.title}
                onChange={e =>
                  change({
                    title:
                      e.target.value
                  })
                }
              />
            </label>


            <label>
              Kategori

              <select
                value={a.category}
                onChange={e =>
                  change({
                    category:
                      e.target.value
                  })
                }
              >

                {categories.map(c => (

                  <option key={c}>
                    {c}
                  </option>

                ))}

              </select>

            </label>


            <label>
              Ringkasan

              <textarea
                maxLength={500}
                value={a.excerpt}
                onChange={e =>
                  change({
                    excerpt:
                      e.target.value
                  })
                }
              />
            </label>


            {/* ===============================================
                SAMPUL OPSIONAL
            =============================================== */}

            <Upload
              onBusy={uploadBusy}
              label="Unggah sampul — opsional (maks. 5 MB)"
              onChange={url =>
                change({
                  cover: url
                })
              }
            />


            {imageUrl(a.cover) && (
              <>

                <img
                  className="editor-cover"
                  src={a.cover}
                  alt={
                    a.coverAlt ||
                    'Pratinjau sampul'
                  }
                />

                <button
                  type="button"
                  className="icon-button"
                  style={{
                    marginTop: '12px'
                  }}
                  onClick={() =>
                    change({
                      cover: '',
                      coverAlt: ''
                    })
                  }
                >
                  <Trash2 size={16} />
                  Hapus sampul
                </button>

              </>
            )}


            {imageUrl(a.cover) && (

              <label>
                Deskripsi gambar sampul

                <input
                  value={
                    a.coverAlt || ''
                  }
                  onChange={e =>
                    change({
                      coverAlt:
                        e.target.value
                    })
                  }
                />
              </label>

            )}

          </div>


          {/* ===============================================
              ISI ARTIKEL
          =============================================== */}

          <h2>
            Isi artikel
          </h2>


          {(a.blocks || [])
            .map((b, i) => (

            <section
              className="editor-block"
              key={b.id || i}
            >

              <div className="block-heading">

                <strong>
                  {i + 1}.{' '}
                  {b.type ===
                  'paragraph'
                    ? 'Paragraf'
                    : b.type ===
                      'image'
                    ? 'Gambar'
                    : 'Instagram'}
                </strong>


                <div>

                  <IconButton
                    label="Pindahkan ke atas"
                    disabled={i === 0}
                    onClick={() =>
                      move(i, -1)
                    }
                  >
                    <ArrowUp
                      size={16}
                    />
                  </IconButton>


                  <IconButton
                    label="Pindahkan ke bawah"
                    disabled={
                      i ===
                      a.blocks.length -
                        1
                    }
                    onClick={() =>
                      move(i, 1)
                    }
                  >
                    <ArrowDown
                      size={16}
                    />
                  </IconButton>


                  <IconButton
                    label="Hapus blok"
                    onClick={() =>
                      change({
                        blocks:
                          a.blocks.filter(
                            (
                              _,
                              index
                            ) =>
                              index !== i
                          )
                      })
                    }
                  >
                    <Trash2
                      size={16}
                    />
                  </IconButton>

                </div>

              </div>


              {/* PARAGRAPH */}

              {b.type ===
              'paragraph' ? (

                <label>
                  Teks paragraf

                  <textarea
                    rows={5}
                    value={
                      b.value
                    }
                    onChange={e =>
                      blockChange(
                        b.id,
                        {
                          value:
                            e.target
                              .value
                        }
                      )
                    }
                  />
                </label>


              ) : b.type ===
                'image' ? (

                /* IMAGE BLOCK */

                <>

                  <Upload
                    onBusy={
                      uploadBusy
                    }
                    label="Unggah gambar"
                    onChange={url =>
                      blockChange(
                        b.id,
                        {
                          value: url
                        }
                      )
                    }
                  />


                  {imageUrl(
                    b.value
                  ) && (
                    <>

                      <img
                        className="editor-cover"
                        src={b.value}
                        alt={
                          b.alt ||
                          'Pratinjau'
                        }
                      />

                      <button
                        type="button"
                        className="icon-button"
                        style={{
                          marginTop:
                            '12px'
                        }}
                        onClick={() =>
                          blockChange(
                            b.id,
                            {
                              value: '',
                              alt: '',
                              caption: ''
                            }
                          )
                        }
                      >
                        <Trash2
                          size={16}
                        />
                        Hapus gambar
                      </button>

                    </>
                  )}


                  {imageUrl(
                    b.value
                  ) && (
                    <>

                      <label>
                        Deskripsi alternatif

                        <input
                          value={
                            b.alt || ''
                          }
                          onChange={e =>
                            blockChange(
                              b.id,
                              {
                                alt:
                                  e.target
                                    .value
                              }
                            )
                          }
                        />
                      </label>


                      <label>
                        Keterangan gambar

                        <input
                          value={
                            b.caption ||
                            ''
                          }
                          onChange={e =>
                            blockChange(
                              b.id,
                              {
                                caption:
                                  e.target
                                    .value
                              }
                            )
                          }
                        />
                      </label>

                    </>
                  )}

                </>


              ) : (

                /* ===========================================
                   INSTAGRAM BLOCK
                =========================================== */

                <>

                  <label>
                    URL posting Instagram

                    <input
                      type="url"
                      placeholder="https://www.instagram.com/p/..."
                      value={
                        b.value
                      }
                      onChange={e =>
                        blockChange(
                          b.id,
                          {
                            value:
                              e.target
                                .value
                          }
                        )
                      }
                    />
                  </label>


                  {instagramUrl(
                    b.value
                  ) && (

                    <div
                      style={{
                        marginTop:
                          '16px'
                      }}
                    >

                      <span className="eyebrow">
                        PRATINJAU INSTAGRAM
                      </span>

                      <InstagramBlock
                        url={instagramUrl(
                          b.value
                        )}
                      />

                    </div>

                  )}

                </>

              )}

            </section>

          ))}


          {/* ===============================================
              TAMBAH BLOK
          =============================================== */}

          <div className="block-buttons">

            {[
              [
                'paragraph',
                'Paragraf',
                Type
              ],
              [
                'image',
                'Gambar',
                ImagePlus
              ],
              [
                'instagram',
                'Instagram',
                Instagram
              ]
            ].map(
              ([
                type,
                label,
                Icon
              ]) => (

                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    change({
                      blocks: [
                        ...a.blocks,
                        {
                          id:
                            crypto.randomUUID(),
                          type,
                          value: ''
                        }
                      ]
                    })
                  }
                >

                  <Icon
                    size={18}
                  />

                  Tambah {label}

                </button>

              )
            )}

          </div>

        </fieldset>

      )}

    </>
  );
}


/* =========================================================
   REACT
========================================================= */

createRoot(
  document.getElementById('root')
).render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: '/*',
        element: <App />
      }
    ])}
  />
);