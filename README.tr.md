# MediCare — Hastane Yönetim Sistemi

> 🇬🇧 **English documentation: [README.md](README.md)**

React 19, React Router v7, Tailwind CSS v4 ve Vite ile geliştirilmiş, rol tabanlı bir hastane yönetim uygulaması. Dört kullanıcı rolü — **Hasta**, **Doktor**, **Hemşire** ve **Ön Büro** — kendi menüsüne, yetkilerine ve çalışma alanına sahiptir.

> ### ⚠️ Bu yalnızca bir arayüz (frontend) prototipidir
>
> **Backend yok, veritabanı yok, gerçek SMS servisi yok.** Bütün kayıtlar [`src/data/mockData.js`](src/data/mockData.js) dosyasından gelir ve tarayıcının `localStorage`'ında yaşar. Kimlik doğrulama simüle edilmiştir (sabit bir demo doğrulama kodu) ve rol kontrolleri tamamen tarayıcıda çalışır; yani **güvenlik sınırı değil, kullanıcı deneyimi koruması** sağlarlar.
>
> Projenin SRS ve SDD dokümanları; ilişkisel veritabanı, sunucu tarafı RBAC ve harici SMS servisi içeren eksiksiz bir istemci–sunucu sistemi tarif eder. Bu depo, o tasarımın **çalışan arayüz prototipidir** — bkz. [docs/SRS.md](docs/SRS.md) ve [docs/SDD.md](docs/SDD.md).

---

## İçindekiler

- [Akademik bağlam](#akademik-bağlam)
- [Hızlı başlangıç](#hızlı-başlangıç)
- [Demo hesapları](#demo-hesapları)
- [Roller ve sayfalar](#roller-ve-sayfalar)
- [Nasıl çalışır](#nasıl-çalışır)
- [Kullanıcı akışları](#kullanıcı-akışları)
- [İş kuralları](#i̇ş-kuralları)
- [Proje yapısı](#proje-yapısı)
- [Dokümantasyon](#dokümantasyon)
- [Bilinen sınırlamalar](#bilinen-sınırlamalar)

---

## Akademik bağlam

TED Üniversitesi **CMPE 313 / SENG 214 — Software Engineering** dersi dönem projesi, 2026 Bahar dönemi.
**Section 3 — Team 6** (5 kişilik ekip). Ekip **Waterfall** modelini uyguladı: gereksinimler bir SRS'te, tasarım kararları bir SDD'de, arayüz prototipi ise bu depoda toplandı.

---

## Hızlı başlangıç

**Gereksinim:** Node.js **20.19+** veya **22.12+** (Vite 8 şartı).

```bash
npm install
npm run dev
```

Uygulama `http://localhost:5173` adresinde çalışır ve `/giris` sayfasına yönlendirir.

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Vite geliştirme sunucusunu hot reload ile başlatır |
| `npm run build` | `dist/` altına production build üretir |
| `npm run preview` | Production build'i yerelde servis eder |
| `npm run lint` | Proje üzerinde ESLint çalıştırır |

**Verileri sıfırlamak:** tüm durum `localStorage`'da tutulur. Başlangıçtaki mock verilere dönmek için DevTools → Application → Local Storage yolundan sitenin kayıtlarını silin (ya da konsolda `localStorage.clear()` çalıştırın) ve sayfayı yenileyin.

---

## Demo hesapları

Giriş iki adımlıdır: **TC Kimlik No + rol**, ardından **6 haneli SMS kodu**. Kod gerçekten gönderilmez — ekranda gösterilir.

| Rol | TC Kimlik No | Doğrulama kodu |
| --- | --- | --- |
| Hasta | `12345678901` | `123456` |
| Doktor | `45678901234` | `123456` |
| Hemşire | `89012345678` | `123456` |
| Ön Büro | `01234567890` | `123456` |

Giriş sayfasında bu hesapların her biri için tek tıkla doldurma düğmesi vardır. Ek hazır hesaplar (2 hasta, 3 doktor, 1 hemşire, 1 ön büro daha) [`src/data/mockData.js`](src/data/mockData.js) içinde listelenir.

Hesap kurtarma (`/hesap-kurtar`) **farklı** bir demo kodu kullanır: `654321`. TC Kimlik No ve kayıtlı telefon numarasının eşleşmesi gerekir.

> Projedeki tüm kimlik numaraları, isimler ve tıbbi veriler **kurgusaldır**. Gerçek hasta verisi kullanılmamıştır.

---

## Roller ve sayfalar

| Rol | Rota öneki | Sayfalar |
| --- | --- | --- |
| **Hasta** (`hasta`) | `/hasta` | Panel, Randevu Al, Randevularım, Test Sonuçları, Reçeteler, Aile Profilleri, Yardım (SSS) |
| **Doktor** (`doktor`) | `/doktor` | Panel, Program, Hasta Kayıtları, Reçeteler |
| **Hemşire** (`hemsire`) | `/hemsire` | Panel, Bölüm Programı, Hasta Kayıtları |
| **Ön Büro** (`onBuro`) | `/on-buro` | Panel, Randevular, Manuel Giriş, Test Durumu, Bakım Veren Erişimi, Personel Yönetimi, Doktor Programları |

Herkese açık rotalar (giriş gerekmez): `/giris`, `/kayit`, `/hesap-kurtar`, `/sss`.
Ortak rota (giriş yapmış her rol): `/profil`.

Her rolün menüsü tek bir yerde, [`src/components/navigation.js`](src/components/navigation.js) içindeki `roleMenus` sabitinde tanımlıdır; vurgu rengi ve açılış sayfası ise `roleMeta` içindedir.

---

## Nasıl çalışır

### Render zinciri

```
main.jsx
  └── App.jsx
        └── AppProvider          ← tüm paylaşılan state + aksiyonlar (context)
              └── BrowserRouter
                    └── Routes
                          └── ProtectedRoute   ← giriş yapılmış mı? rol uygun mu?
                                └── Sayfa
                                      └── Layout → Navbar + <main> + footer
```

### State ve kalıcılık

[`src/context/AppContext.jsx`](src/context/AppContext.jsx) tek doğruluk kaynağıdır. İlk render'da `localStorage`'dan beslenen ve her değişimde kendi `useEffect`'i ile geri yazılan dokuz parça state tutar:

`aktifKullanici` · `aktifProfil` (görüntülenen bağımlı) · `randevular` · `receteler` · `bagimliProfiller` · `bakimOnayi` (bakım veren onayları) · `denetimKayitlari` (denetim günlüğü) · `doktorProgramlari` · `personelListesi`

**Değiştirilebilir ve salt-okunur veri ayrımı.** Uygulamanın davranışının büyük kısmını bu ayrım açıklar:

- **Değiştirilebilir** — yukarıdaki dokuz anahtar. `mockData.js`'ten başlar, sonra context ve `localStorage`'da yaşar. Değişiklikler sayfa yenilendiğinde kaybolmaz.
- **Salt-okunur** — `testSonuclari`, `tibbiKayitlar`, `bolumler`, `sssIcerigi` doğrudan ilgili sayfalara import edilir. Hiç yazılmadıkları için her zaman başlangıç hâllerinde okunurlar. (Bir test sonucunun arayüzde hiç durum değiştirmemesinin sebebi budur.)

### Erişim kontrolü

[`src/components/ProtectedRoute.jsx`](src/components/ProtectedRoute.jsx) her özel rotayı sarar:

1. `aktifKullanici` yoksa → `/giris` sayfasına yönlendirir.
2. Giriş yapılmış ama rol, rotanın `roller` listesinde değilse → mevcut rolü gösteren bir **Access Denied** kartı basar.
3. Aksi hâlde → sayfayı render eder.

Bu yalnızca tarayıcıda çalışır. Gerçek bir dağıtımda aynı kontrollerin sunucu tarafında da uygulanması gerekir.

---

## Kullanıcı akışları

### Hasta — randevu alma (`/hasta/randevu-al`)

Dört adımlı sihirbaz:

1. **Bölüm** — `bolumler` içindeki sekiz bölüm. Doktoru atanmamış bölümler seçilemez.
2. **Doktor** — o bölümdeki doktorlar. Programında `musait: false` olan (devir nedeniyle kapalı) doktor görünür ama seçilemez.
3. **Tarih ve saat** — yalnızca doktorun `musaitSaatler` içinde yayımladığı tarihler ve henüz dolmamış saatler. Müsait slotlar, *doktorun o tarihteki yayımlanmış saatleri* eksi *o tarihte durumu `iptalEdildi` olmayan randevular* şeklinde hesaplanır; böylece çifte kayıt imkânsızdır.
4. **Onay** — isteğe bağlı not, ardından `randevuAl()` kaydı `onaylandi` durumuyla oluşturur ve denetim kaydı yazar.

Aktif bir bağımlı profil varsa randevu hesap sahibi için değil, bağımlı için (`aktifHastaId`) açılır.

### Hasta — iptal ve erteleme (`/hasta/randevularim`)

Randevular en yeniden eskiye listelenir; sekmelerle filtrelenir (Tümü / Yaklaşan / Geçmiş / İptal edilen). **İptal** ve **Ertele** düğmeleri yalnızca hâlâ gelecekte olan ve durumu `onaylandi` olan randevularda görünür.

- **İptal** → `randevuIptal()`. Randevunun başlamasına **1 saatten az** kaldıysa mesajla reddedilir. Aksi hâlde durum `iptalEdildi` olur — kayıt silinmez, saklanır ve slotu tekrar müsaitliğe döner.
- **Erteleme** → `randevuYenidenZamanla()`. Doktorun kalan boş saatlerini sunar, tarih ve saati günceller, durumu `onaylandi` olarak sıfırlar.

### Hasta — test sonuçları (`/hasta/test-sonuclari`)

Sonuçlar parametre parametre referans aralıklarıyla birlikte gösterilir; aralık dışı değerler vurgulanır. **İndir** düğmesi blob URL üzerinden düz metin özeti yazar; **Yazdır** biçimlendirilmiş bir yazdırma penceresi açar. Durumu `bekliyor` olan testlerde değer gösterilmez.

### Hasta — aile profilleri (`/hasta/bagimli-profiller`)

Bağımlı (çocuk, ebeveyn, eş…) ekleyip o profile geçilebilir. Bağımlı aktifken navbar'da bir rozet görünür ve bütün hasta sayfaları veriyi `aktifHastaId` üzerinden o bağımlı için okur. Geri dönmek için yeniden giriş gerekmez.

### Doktor — reçeteler (`/doktor/recete-yonetimi`)

Giriş yapan doktorun yazdığı reçeteleri listeler. Seçilen reçetenin ilaçları (ad, doz, sıklık, süre, kullanım talimatı) görüntülenir; düzenleme ilaç listesini `receteGuncelle()` ile yeniden yazar, `guncellemeTarihi` damgası basar ve denetim kaydı ekler.

### Doktor / Hemşire — hasta kayıtları

Doktorlar randevusu olduğu hastaların kayıtlarını, hemşireler kendi bölümlerinin kayıtlarını görür. Bir kaydın açılması `denetimEkle()` çağırır; yani her tıbbi kayıt erişimi günlüğe yazılır.

### Ön Büro — manuel randevu (`/on-buro/manuel-randevu`)

Hasta TC ile bulunur, sonra bölüm → doktor → tarih → saat seçilir; müsaitlik mantığı hasta tarafındakiyle birebir aynıdır. Oluşan kayıt `manuelGiris: true` olarak işaretlenir ve işlemi yapan personelin kimliği `girenPersonel` alanında saklanır.

### Ön Büro — doktor programları ve devir (`/on-buro/doktor-program`)

Bir doktorun müsaitliği açılıp kapatılabilir veya **devir** yapılabilir: müsait olmayan bir doktor ve yerine bakacak doktor seçilir; `doktorDevirAta()` ilk doktorun **tüm `onaylandi` randevularını** ikinciye taşır ve her kayda bir `devirNotu` ekler. Ardından kaynak doktor müsait değil olarak işaretlenir, böylece üzerine yeni randevu düşmez.

### Ön Büro — test durumu (`/on-buro/test-durumu`)

Bilinçli olarak kısıtlanmış bir sorgu: hasta arandığında yalnızca testin **adı, tarihi ve durumu** döner. Sonuç değerleri, notlar ve tanılar projeksiyona hiç dâhil edilmez. Her arama denetim günlüğüne yazılır.

### Ön Büro — bakım veren onayı (`/on-buro/bakim-veren`)

Bir hasta adına bakım verenin (ad, kimlik, yakınlık) yazılı onayını kaydeder; onayı veren personel ve tarih damgalanır.

### Ön Büro — personel ve roller (`/on-buro/personel-yonetimi`)

Kullanıcılar ada veya kimliğe göre aranır, role göre filtrelenir; rol değişikliği `personelRoluGuncelle()` ile yapılır ve denetim günlüğüne yazılır.

---

## İş kuralları

| Kural | Davranış | Yer |
| --- | --- | --- |
| **1 saatlik iptal penceresi** | Randevuya 1 saatten az kaldıysa iptal edilemez | `AppContext.jsx` → `randevuIptal()` |
| **15 dakikalık hareketsizlik zaman aşımı** | Fare, klavye, kaydırma ve dokunma olayları sayacı sıfırlar; 15 dakika sessizlikten sonra oturum kapatılır (30 sn'de bir kontrol) | `AppContext.jsx` → hareketsizlik `useEffect`'i |
| **Çifte randevu engeli** | İptal edilmemiş bir randevunun tuttuğu saat müsaitlik listesinden çıkarılır | `RandevuAl.jsx`, `ManuelRandevu.jsx`, `Randevularim.jsx` |
| **Denetim günlüğü** | Giriş, randevu alma, iptal, erteleme, reçete güncelleme, kayıt erişimi, test durumu sorgusu, rol değişikliği, doktor devri ve bakım veren onayı `denetimKayitlari`'na eklenir | `AppContext.jsx` → `denetimEkle()` |
| **İptaller yumuşaktır** | Durum `iptalEdildi` olur; kayıt silinmez | `AppContext.jsx` → `randevuIptal()` |
| **Bağımlı bağlamı** | Bir bağımlı seçiliyse `aktifHastaId` onu, değilse hesap sahibini gösterir | `AppContext.jsx` |
| **Ön büroda veri asgariliği** | Test durumu sorgusu yalnızca durumu döner, klinik değerleri asla | `TestDurumu.jsx` |

---

## Proje yapısı

```
.
├── index.html                  Vite giriş dokümanı
├── vite.config.js              React + Tailwind v4 eklentileri
├── eslint.config.js            Flat ESLint yapılandırması
├── public/                     favicon.svg, icons.svg
├── docs/                       Proje dokümantasyonu (aşağıya bakın)
└── src/
    ├── main.jsx                React kökü
    ├── App.jsx                 Tüm rotalar + rol korumaları
    ├── index.css / App.css     Tailwind importu ve tema token'ları
    ├── assets/                 hero.png ve logolar
    ├── components/
    │   ├── Layout.jsx          Navbar + main + footer kabuğu
    │   ├── Navbar.jsx          Role duyarlı menü, bağımlı rozeti, çıkış
    │   ├── navigation.js       roleMeta ve roleMenus (menülerin tek kaynağı)
    │   ├── ProtectedRoute.jsx  Oturum + rol koruması
    │   ├── ui.jsx              Button, Surface, SectionCard, PageHeader, Badge,
    │   │                       StatCard, EmptyState, InfoBanner, Field, Tabs,
    │   │                       Modal, DataTable, Stepper
    │   ├── AppIcon.jsx         Heroicons üzerine isimli ikon kayıt defteri
    │   ├── AuthShell.jsx       Kimlik doğrulama sayfaları için bölünmüş düzen
    │   ├── AuthField.jsx       Field bileşeninin yeniden dışa aktarımı
    │   └── ui-helpers.js       cn() sınıf birleştirici, ortak input sınıfı
    ├── context/
    │   └── AppContext.jsx      Tüm paylaşılan state, aksiyonlar ve iş kuralları
    ├── data/
    │   └── mockData.js         Her varlık için başlangıç verisi
    ├── pages/
    │   ├── Giris.jsx           Giriş (TC + rol → SMS kodu)
    │   ├── Kayit.jsx           Hasta kaydı
    │   ├── HesapKurtar.jsx     Hesap kurtarma
    │   ├── SSS.jsx             Sıkça sorulan sorular
    │   ├── Profil.jsx          Ortak profil düzenleme
    │   ├── hasta/              6 hasta sayfası
    │   ├── doktor/             4 doktor sayfası
    │   ├── hemsire/            3 hemşire sayfası
    │   └── onBuro/             7 ön büro sayfası
    └── utils/
        └── helpers.js          Tarih biçimleme, arama, durum etiket ve renkleri
```

---

## Dokümantasyon

| Doküman | İçerik |
| --- | --- |
| [docs/USE-CASES.md](docs/USE-CASES.md) | UML use-case diyagramı (Mermaid) ve her use-case'i rota, dosya ve fonksiyona bağlayan eşleme tablosu |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Veri modeli, `AppContext` API'sinin tamamı, durum makineleri, kalıcılık, UI sistemi ve gerçek bir backend'in nasıl bağlanacağı |
| [docs/SRS.md](docs/SRS.md) | Yazılım Gereksinimleri Şartnamesi — use-case'ler, fonksiyonel ve fonksiyonel olmayan gereksinimler |
| [docs/SDD.md](docs/SDD.md) | Yazılım Tasarım Dokümanı — katmanlı mimari, modül ayrıştırması, veri sözlüğü, tasarım gerekçeleri |
| [docs/PRESENTATION.md](docs/PRESENTATION.md) | Final sunumunun içeriği — metodoloji, gereksinim toplama yaklaşımı, UML modelleri |
| [README.md](README.md) | Bu dokümanın İngilizce sürümü |

> Orijinal SRS, SDD ve sunum PDF'leri bu depoya **dâhil edilmemiştir** — kapak sayfalarında ekip üyelerinin adları ve öğrenci numaraları yer almaktadır. Yukarıdaki Markdown dokümanları, bu dosyaların teknik içeriğini kişisel veri olmadan aktarır.

---

## Bilinen sınırlamalar

- **Gerçek kimlik doğrulama yok.** Doğrulama kodu sabittir ve hiçbir yerde parola kontrol edilmez. Mock veride bir `sifre` alanı bulunur ama giriş akışı onu kullanmaz.
- **Sunucu ve veritabanı yok.** Her şey tarayıcı durumudur; site verisi temizlenince silinir, cihazlar veya kullanıcılar arasında paylaşılmaz.
- **Rol kontrolleri yalnızca istemci tarafındadır.** Yanlışlıkla gezinmeyi engeller, kararlı bir kullanıcıyı değil.
- **SMS ve bildirim yok.** SRS, SMS doğrulaması ve randevu hatırlatıcıları öngörür; ikisi de bir sağlayıcıya bağlı değildir.
- **Otomatik test yok.** Yapılandırılmış bir test koşucusu bulunmuyor.
- **Başlangıç takvimi sabittir ve geçmişte kalmıştır.** Doktor müsaitliği yalnızca **5–13 Mayıs 2026** için tanımlıdır. Randevu sihirbazı geçmiş tarihleri elemez; bu yüzden bugün alınan bir randevu geçmişe düşer, panolarda yaklaşan randevu görünmez ve İptal/Ertele düğmeleri hiç çıkmaz. Bu akışları denemek için `mockData.js` içindeki `doktorProgramlari` gelecekteki bir aralığa güncellenmelidir.
- **Bazı veriler değişmez.** Test sonuçları, tıbbi kayıtlar, bölümler ve SSS içerikleri salt-okunur import'lardır; işlemler onları değiştirmez.
- **Karışık dilli tanımlayıcılar.** Kod tanımlayıcıları ve rota yolları Türkçedir (`randevu`, `hasta`, `recete`); kullanıcıya görünen tüm metinler İngilizcedir.

---

## Lisans

[MIT Lisansı](LICENSE) ile yayımlanmıştır. Bu bir üniversite ders projesidir; mock veriler tamamen kurgusaldır ve prototip gerçek hasta bilgisiyle kullanılmaya uygun değildir.
