'use client';

import { useState } from 'react';

const SKIN_CONDITIONS = [
  {
    id: 'eksim',
    name: 'Eksim (Dermatitis Atopik)',
    description: 'Eksim atau Dermatitis Atopik adalah kondisi kulit kronis yang menyebabkan kulit menjadi kering, gatal, meradang, dan kemerahan. Kondisi ini sering kambuh dan bisa terjadi di berbagai bagian tubuh, terutama di area lipatan kulit seperti siku dan belakang lutut.',
    causes: 'Penyebab utama eksim meliputi faktor genetik (riwayat keluarga dengan alergi atau asma), gangguan sistem imun, paparan alergen (debu, bulu hewan, serbuk sari), stres, perubahan cuaca, dan penggunaan sabun atau deterjen yang keras.',
    treatment: 'Penanganan meliputi penggunaan pelembab secara rutin, krim kortikosteroid topikal untuk mengurangi peradangan, antihistamin untuk meredakan gatal, menghindari pemicu alergi, dan menjaga kelembaban kulit. Pada kasus berat, dokter mungkin meresepkan imunosupresan.',
  },
  {
    id: 'psoriasis',
    name: 'Psoriasis',
    description: 'Psoriasis adalah penyakit autoimun kronis yang menyebabkan sel-sel kulit tumbuh terlalu cepat, sehingga membentuk lapisan bersisik tebal berwarna keperakan di atas kulit yang merah dan meradang. Psoriasis bukan penyakit menular.',
    causes: 'Psoriasis disebabkan oleh gangguan sistem imun yang mempercepat siklus pertumbuhan sel kulit. Faktor pemicu meliputi stres, infeksi (terutama infeksi tenggorokan), cedera kulit, perubahan cuaca dingin, dan konsumsi alkohol atau obat-obatan tertentu.',
    treatment: 'Pengobatan meliputi krim kortikosteroid, retinoid topikal, fototerapi (terapi sinar UV), dan obat sistemik untuk kasus berat. Menjaga kulit tetap lembab, menghindari stres, dan menjalani gaya hidup sehat juga membantu mengelola gejala.',
  },
  {
    id: 'jerawat',
    name: 'Jerawat (Acne Vulgaris)',
    description: 'Jerawat adalah kondisi kulit yang terjadi ketika folikel rambut tersumbat oleh minyak berlebih dan sel kulit mati. Jerawat paling sering muncul di wajah, dahi, dada, punggung atas, dan bahu. Kondisi ini umum terjadi pada remaja dan dewasa muda.',
    causes: 'Penyebab utama jerawat meliputi produksi sebum berlebih, penyumbatan folikel rambut, aktivitas bakteri Propionibacterium acnes, perubahan hormon (terutama saat pubertas, menstruasi, atau stres), faktor genetik, dan pola makan tertentu.',
    treatment: 'Penanganan meliputi pembersihan wajah secara teratur, penggunaan produk yang mengandung benzoyl peroxide atau asam salisilat, retinoid topikal, antibiotik topikal atau oral, dan pada kasus berat, isotretinoin. Hindari memencet jerawat.',
  },
  {
    id: 'panu',
    name: 'Panu (Tinea Versicolor)',
    description: 'Panu atau Tinea Versicolor adalah infeksi jamur pada kulit yang menyebabkan munculnya bercak-bercak kecil berwarna yang berbeda dari kulit sekitarnya. Bercak ini bisa berwarna lebih terang atau lebih gelap dan biasanya muncul di punggung, dada, dan lengan atas.',
    causes: 'Panu disebabkan oleh pertumbuhan berlebih dari jamur Malassezia yang normalnya hidup di permukaan kulit. Faktor pemicu meliputi cuaca panas dan lembab, keringat berlebih, kulit berminyak, sistem imun yang lemah, dan perubahan hormonal.',
    treatment: 'Penanganan meliputi penggunaan sampo atau krim antijamur yang mengandung ketokonazol, selenium sulfida, atau clotrimazol. Untuk kasus yang luas, dokter mungkin meresepkan antijamur oral. Menjaga kebersihan kulit dan mengurangi keringat berlebih juga penting.',
  },
  {
    id: 'kurap',
    name: 'Kurap (Tinea Corporis)',
    description: 'Kurap adalah infeksi jamur pada kulit yang ditandai dengan ruam berbentuk cincin berwarna merah dengan tepi yang jelas dan meninggi. Bagian tengah ruam biasanya lebih bersih. Meski namanya kurap, kondisi ini tidak disebabkan oleh cacing.',
    causes: 'Kurap disebabkan oleh jamur dermatofit yang dapat menyebar melalui kontak langsung dengan orang atau hewan yang terinfeksi, benda yang terkontaminasi, atau tanah. Faktor risiko meliputi kebersihan yang kurang, cuaca lembab, dan penggunaan pakaian ketat.',
    treatment: 'Penanganan meliputi penggunaan krim antijamur topikal seperti clotrimazol, mikonazol, atau terbinafin selama 2-4 minggu. Untuk kasus berat atau luas, dokter mungkin meresepkan antijamur oral. Menjaga kulit tetap bersih dan kering sangat penting.',
  },
  {
    id: 'kutil',
    name: 'Kutil (Verruca Vulgaris)',
    description: 'Kutil adalah pertumbuhan kulit kecil yang kasar dan keras yang disebabkan oleh infeksi virus. Kutil bisa muncul di mana saja di tubuh, tetapi paling sering di tangan dan kaki. Meski umumnya tidak berbahaya, kutil bisa menular dan menyebar.',
    causes: 'Kutil disebabkan oleh Human Papillomavirus (HPV) yang masuk melalui luka kecil di kulit. Virus ini menyebar melalui kontak langsung atau tidak langsung. Faktor risiko meliputi sistem imun yang lemah, kebiasaan menggigit kuku, dan luka terbuka.',
    treatment: 'Penanganan meliputi asam salisilat topikal, krioterapi (pembekuan dengan nitrogen cair), elektrokauter, atau pengangkatan bedah untuk kutil yang membandel. Banyak kutil juga dapat hilang sendiri seiring waktu seiring penguatan sistem imun.',
  },
  {
    id: 'herpes',
    name: 'Herpes Simpleks',
    description: 'Herpes simpleks adalah infeksi virus yang menyebabkan luka atau lepuhan kecil yang menyakitkan. HSV-1 umumnya menyebabkan herpes oral (di sekitar mulut), sedangkan HSV-2 lebih sering menyebabkan herpes genital. Virus ini bersifat laten dan bisa kambuh.',
    causes: 'Herpes disebabkan oleh Herpes Simplex Virus (HSV). Virus ini menyebar melalui kontak langsung dengan lesi atau cairan tubuh. Kekambuhan dipicu oleh stres, kelelahan, paparan sinar matahari berlebih, demam, dan penurunan daya tahan tubuh.',
    treatment: 'Pengobatan menggunakan antivirus seperti asiklovir, valasiklovir, atau famsiklovir untuk memperpendek durasi dan mengurangi keparahan gejala. Kompres dingin dan obat pereda nyeri dapat membantu meredakan ketidaknyamanan. Virus tidak dapat disembuhkan sepenuhnya.',
  },
  {
    id: 'dermatitis',
    name: 'Dermatitis Kontak',
    description: 'Dermatitis kontak adalah reaksi peradangan kulit yang terjadi akibat kontak langsung dengan zat iritan atau alergen. Kulit menjadi merah, gatal, bengkak, dan mungkin melepuh. Ada dua jenis: dermatitis kontak iritan dan dermatitis kontak alergi.',
    causes: 'Penyebab meliputi paparan bahan kimia (deterjen, pelarut, kosmetik), logam (nikel, krom), lateks, tanaman (poison ivy), dan obat-obatan topikal. Dermatitis kontak iritan langsung merusak kulit, sedangkan tipe alergi melibatkan reaksi sistem imun.',
    treatment: 'Penanganan utama adalah mengidentifikasi dan menghindari pemicu. Pengobatan meliputi krim kortikosteroid, kompres dingin, pelembab, dan antihistamin oral untuk meredakan gatal. Pada kasus berat, dokter mungkin meresepkan kortikosteroid oral.',
  },
  {
    id: 'cacar-air',
    name: 'Cacar Air (Varicella)',
    description: 'Cacar air adalah penyakit infeksi yang sangat menular yang disebabkan oleh virus Varicella-Zoster. Ditandai dengan ruam kulit berupa bintik merah yang berkembang menjadi lepuhan berisi cairan, kemudian mengering dan membentuk keropeng.',
    causes: 'Cacar air disebabkan oleh Varicella-Zoster Virus (VZV) yang menyebar melalui percikan air liur atau kontak langsung dengan cairan lepuhan. Virus ini sangat menular dan paling sering menyerang anak-anak yang belum divaksinasi.',
    treatment: 'Pengobatan bersifat suportif: obat penurun demam (parasetamol), losion kalamin untuk meredakan gatal, antihistamin oral, dan menjaga kebersihan kulit. Pada pasien dewasa atau imunokompromais, antivirus asiklovir mungkin diresepkan. Vaksinasi adalah pencegahan terbaik.',
  },
  {
    id: 'impetigo',
    name: 'Impetigo',
    description: 'Impetigo adalah infeksi kulit bakteri yang sangat menular, ditandai dengan luka merah yang cepat pecah dan membentuk kerak berwarna kuning keemasan. Impetigo paling sering menyerang anak-anak dan biasanya muncul di wajah, terutama di sekitar hidung dan mulut.',
    causes: 'Impetigo disebabkan oleh bakteri Staphylococcus aureus atau Streptococcus pyogenes. Bakteri masuk melalui luka kecil, gigitan serangga, atau ruam. Faktor risiko meliputi kebersihan buruk, cuaca lembab, kontak dekat, dan kondisi kulit yang sudah ada sebelumnya.',
    treatment: 'Pengobatan meliputi antibiotik topikal (mupirocin atau fusidic acid) untuk kasus ringan, dan antibiotik oral untuk kasus yang lebih luas. Menjaga kebersihan, membersihkan luka dengan lembut, dan mencegah garukan sangat penting untuk mencegah penyebaran.',
  },
];

export default function DermapediaPage() {
  const [selectedCondition, setSelectedCondition] = useState(null);

  return (
    <div className="container page-content">
      <div className="page-header">
        <h1 className="page-title">
          <i className="las la-book-medical" style={{ color: 'var(--accent-cyan)', marginRight: '8px' }} />
          Dermapedia
        </h1>
        <p className="page-subtitle">
          Ensiklopedia penyakit kulit populer di Indonesia
        </p>
      </div>

      <div className="grid grid-3" style={{ gap: '16px' }}>
        {SKIN_CONDITIONS.map((condition) => (
          <div
            key={condition.id}
            className="card"
            onClick={() => setSelectedCondition(condition)}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
          >
            <div style={{
              height: '140px',
              background: `linear-gradient(135deg, rgba(var(--accent-cyan-rgb), 0.08), rgba(var(--accent-cyan-rgb), 0.02))`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <i className="las la-diagnoses" style={{ fontSize: '2.5rem', color: 'rgba(var(--accent-cyan-rgb), 0.4)' }} />
            </div>
            <div className="card-body">
              <h3 className="heading-card" style={{ fontSize: '0.9375rem', marginBottom: '6px' }}>
                {condition.name}
              </h3>
              <p className="text-body" style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                fontSize: '0.8125rem',
              }}>
                {condition.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedCondition && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setSelectedCondition(null)}>
          <div className="modal-content modal-wide animate-slide-up">
            <div className="modal-header">
              <h2 style={{ fontSize: '1.125rem' }}>{selectedCondition.name}</h2>
              <button className="modal-close" onClick={() => setSelectedCondition(null)} aria-label="Tutup">
                <i className="las la-times" />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Deskripsi
                </h3>
                <p className="text-body" style={{ lineHeight: 1.7 }}>{selectedCondition.description}</p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--warning-amber)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Penyebab Utama
                </h3>
                <p className="text-body" style={{ lineHeight: 1.7 }}>{selectedCondition.causes}</p>
              </div>

              <div>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--success-mint)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Penanganan Medis
                </h3>
                <p className="text-body" style={{ lineHeight: 1.7 }}>{selectedCondition.treatment}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
