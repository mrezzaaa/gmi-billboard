import {
  MapPin,
  PaintBrush,
  Megaphone,
  FileText,
  Wrench,
  Lightbulb,
  Phone,
  Globe,
  InstagramLogo,
} from '@phosphor-icons/react'

export default function Sections({ brand }) {
  const locations = [
    { name: 'Jakarta Selatan', tag: 'LED' },
    { name: 'Jakarta Pusat', tag: null },
    { name: 'Jakarta Timur', tag: 'LED' },
    { name: 'Jakarta Utara', tag: null },
    { name: 'Jakarta Barat', tag: null },
    { name: 'Depok', tag: null },
    { name: 'Bekasi', tag: null },
    { name: 'Bandung', tag: null },
  ]

  const services = [
    {
      icon: <PaintBrush size={48} weight="duotone" />,
      title: 'Graphic Design',
      desc: 'Desain grafis profesional untuk materi promosi produk Anda yang menarik dan efektif.',
    },
    {
      icon: <Megaphone size={48} weight="duotone" />,
      title: 'Media Reklame Indoor & Outdoor',
      desc: 'Solusi signage lengkap untuk meningkatkan brand image dan marketing produk Anda.',
    },
    {
      icon: <FileText size={48} weight="duotone" />,
      title: 'Pengurusan Izin & Pajak',
      desc: 'Kami bantu pengurusan izin dan pajak reklame agar media Anda sesuai peraturan.',
    },
    {
      icon: <Wrench size={48} weight="duotone" />,
      title: 'Maintenance & Perawatan',
      desc: 'Perawatan berkala untuk menjaga media reklame Anda tetap kokoh dan tampil maksimal.',
    },
    {
      icon: <Lightbulb size={48} weight="duotone" />,
      title: 'Konsultasi Media Advertising',
      desc: 'Konsultasi untuk memastikan media signage Anda memberikan hasil yang signifikan.',
    },
  ]

  const clients = [
    'Google',
    'Microsoft', 
    'Nokia',
    'Yahoo',
    'Marlboro',
    'WordPress',
    'Pertamina',
    'Indofood',
    'Bank Mandiri',
    'Telkom',
    'XL Axiata',
    'Astra',
    'Unilever',
    'Coca-Cola',
    'Samsung',
  ]

  return (
    <>
      {/* About Section */}
      <section className="section section-about">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Tentang Kami</span>
            <h2 className="section-title">PT. Global Mitra Indonesia Adv</h2>
          </div>
          <div className="about-grid">
            <div className="about-text">
              <p>
                Perusahaan ini secara resmi kami dirikan pada Tahun <strong>2014</strong> dengan nama PT. GLOBAL MITRA
                INDONESIA ADV yang bergerak dibidang <strong>Periklanan Dalam dan Luar Ruang</strong> (Billboard,
                Neonbox, LED, dll.) serta Pekerjaan Jasa Konstruksi dan General Contractor pada umumnya.
              </p>
              <p>
                Dalam rangka ikut serta membantu meningkatkan brand image klien, kami memperkerjakan Sumber Daya Manusia
                dan tenaga ahli dibidangnya yang sudah berpengalaman, sehingga diharapkan hasil akhir dari suatu
                pekerjaan dapat sempurna.
              </p>
            </div>
            <div className="about-stats">
              <div className="stat-box">
                <div className="stat-value">2014</div>
                <div className="stat-label">Berdiri Sejak</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">9+</div>
                <div className="stat-label">Wilayah Coverage</div>
              </div>
              <div className="stat-box">
                <div className="stat-value">24/7</div>
                <div className="stat-label">Visibilitas</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <section className="section section-locations">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Jangkauan Luas</span>
            <h2 className="section-title">Lokasi Billboard Strategis</h2>
            <p className="section-desc">
              Kami memiliki lokasi billboard premium di seluruh Jabodetabek dan Bandung, termasuk area toll road dengan
              traffic tinggi.
            </p>
          </div>
          <div className="locations-grid">
            {locations.map((loc, i) => (
              <div
                key={i}
                className="location-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="location-icon">
                  <MapPin size={36} weight="duotone" />
                </div>
                <h3 className="location-name">{loc.name}</h3>
                {loc.tag && <span className="location-tag">{loc.tag}</span>}
              </div>
            ))}
            <div className="location-card" style={{ animationDelay: '0.8s' }}>
              <div className="location-icon">
                <MapPin size={36} weight="duotone" />
              </div>
              <h3 className="location-name">View Toll</h3>
              <span className="location-tag">PREMIUM</span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section section-services">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Layanan Lengkap</span>
            <h2 className="section-title">Produk & Layanan Kami</h2>
          </div>
          <div className="services-grid">
            {services.map((service, i) => (
              <div
                key={i}
                className="service-card"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Mission Section */}
      <section className="section section-vision">
        <div className="container">
          <div className="vision-grid">
            <div className="vision-card">
              <h3 className="vision-title">Misi</h3>
              <p>
                Menjadikan perusahaan kami sebagai perusahaan yang berkualitas efektif, dinamis, serta efisien,
                khususnya di bidang Jasa Periklanan dan Jasa General Contractor pada umumnya.
              </p>
            </div>
            <div className="vision-card">
              <h3 className="vision-title">Visi</h3>
              <p>
                Bekerja dengan semangat dan berdedikasi tinggi serta profesional sehingga dapat mewujudkan hasil akhir
                dari suatu pekerjaan menjadi lebih berkualitas dan bernilai tinggi sehingga dapat mencapai hasil yang
                maksimal dan dapat memuaskan klien kami.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Section */}
      <section className="section section-clients">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Dipercaya Brand Terkemuka</span>
            <h2 className="section-title">Klien Kami</h2>
          </div>
          <div className="clients-grid">
            {clients.map((client, i) => (
              <div
                key={i}
                className="client-card"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="client-name">{client}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section section-cta">
        <div className="container">
          <div className="cta-box">
            <h2 className="cta-title">Siap Menjangkau Jutaan Orang?</h2>
            <p className="cta-desc">
              Hubungi kami sekarang untuk konsultasi gratis dan penawaran terbaik untuk brand Anda.
            </p>
            <div className="cta-buttons">
              <a href="tel:+628119522122" className="btn btn-primary">
                📞 0811-9522-122
              </a>
              <a href="https://gmibillboard.co.id" target="_blank" rel="noopener" className="btn btn-secondary">
                🌐 Website
              </a>
              <a
                href="https://instagram.com/gmibillboard_jakarta"
                target="_blank"
                rel="noopener"
                className="btn btn-secondary"
              >
                📸 Instagram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h4 className="footer-title">GMI BILLBOARD</h4>
              <p className="footer-text">PT. Global Mitra Indonesia Adv</p>
              <p className="footer-text">Media Advertising Outdoor Premium</p>
            </div>
            <div className="footer-col">
              <h4 className="footer-title">Office</h4>
              <p className="footer-text">
                Jl. Srengseng Sawah No.4, RT.2/RW.7
                <br />
                Kec. Jagakarsa, Jakarta Selatan
                <br />
                Jakarta 12630
              </p>
            </div>
            <div className="footer-col">
              <h4 className="footer-title">Workshop</h4>
              <p className="footer-text">
                Jln. Perikanan RT 04 RW 08 No 35
                <br />
                Srengseng Sawah, Jagakarsa
                <br />
                Jakarta Selatan, 12640
              </p>
            </div>
            <div className="footer-col">
              <h4 className="footer-title">Kontak</h4>
              <p className="footer-text">
                <Phone size={16} weight="bold" style={{ display: 'inline', marginRight: 8 }} />
                0811-9522-122
              </p>
              <p className="footer-text">
                <Globe size={16} weight="bold" style={{ display: 'inline', marginRight: 8 }} />
                gmibillboard.co.id
              </p>
              <p className="footer-text">
                <InstagramLogo size={16} weight="bold" style={{ display: 'inline', marginRight: 8 }} />
                @gmibillboard_jakarta
              </p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 PT Global Mitra Indonesia Adv. All Rights Reserved.</p>
            <p className="footer-note">
              Mockup concept. Brand names (Gojek, Grab) are trademarks of their respective owners.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
