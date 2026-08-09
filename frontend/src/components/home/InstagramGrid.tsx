// `video`: direct video file URL (upload the reel's mp4 to Cloudinary/CDN).
// `link`:  the Instagram post/reel URL — clicking a card opens the post.
const CLIP_SECONDS = 5; // how many seconds of the video to loop

const posts = [
  { caption: 'Glow that speaks before words do', video: 'https://res.cloudinary.com/dmigevbpo/video/upload/v1786278893/Glow_that_speaks_before_words_do._Vedessa_isn_t_just_skincare_it_s_a_return_to_balance_calm_fuwvcy.mp4', link: 'https://www.instagram.com/reel/DQvxjIXCfzD/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { caption: 'Subah ka glow-sırf 5 minute me', video: 'https://res.cloudinary.com/dmigevbpo/video/upload/v1786278990/Subah_ka_glow-s%C4%B1rf_5_minute_mai_bina_chemicals_cleanbeauty_reelitfeelit_madeinindia_naturalg_cyrf1t.mp4', link: 'https://www.instagram.com/reel/DRJBN_qCLQP/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { caption: 'Synthetic perfume se headache?', video: 'https://res.cloudinary.com/dmigevbpo/video/upload/v1786279101/Synthetic_perfume_se_headache_Ayurvedic_attar_is_the_upgrade_your_skin_mood_deserves._Rose_for_fcsss4.mp4', link: 'https://www.instagram.com/reel/DSEQrVJjGhz/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { caption: 'Glow sirf cream se nahi aata', video: 'https://res.cloudinary.com/dmigevbpo/video/upload/v1786279205/Day_15_Challenge._Glow_sirf_cream_se_nahi_aata._Ayurveda_maanta_hai_inner_balance_out_gb5xd2.mp4', link: 'https://www.instagram.com/reel/DThCfkrCBlR/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { caption: 'Clean ingredients, visible results', video: 'https://res.cloudinary.com/dmigevbpo/video/upload/v1786279330/Day_12_Challenge._Color_jo_skin_ko_feed_kare._Makeup_jaisa_color_par_Ayurveda_jaisi_care_nm0f0j.mp4', link: 'https://www.instagram.com/reel/DTZSS_oDDPN/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { caption: 'Ancient wisdom, modern routine', video: 'https://res.cloudinary.com/dmigevbpo/video/upload/v1786279562/Day_4_Challenge_Breakouts_ka_reason_acne_nahi_hota_weak_skin_barrier_hota_hai._%EF%B8%8FAyurveda_ski_1_snlkoj.mp4', link: 'https://www.instagram.com/reel/DTE5GghjK7n/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { caption: 'Ayurvedic care, thoughtfully made', video: 'https://res.cloudinary.com/dmigevbpo/video/upload/v1786279655/Day_2_Challenge_Glow_jo_wash_karte_hi_chala_jaaye_woh_glow_nahi_hota._Chemical_skincare_ski_geia0p.mp4', link: 'https://www.instagram.com/reel/DS_fRJxDCR2/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
  { caption: 'Makeup ke bina bhi glow', video: 'https://res.cloudinary.com/dmigevbpo/video/upload/v1786279499/Day_21_Challenge._Makeup_ke_bina_bhi_glowHaan._Week_3_says_hello_Slow_care._Long_results._We_l3ymi9.mp4', link: 'https://www.instagram.com/reel/DTwqeuZDJDW/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==' },
];

export default function InstagramGrid() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif text-center text-gray-900 mb-10">
          Follow Us @vedessa
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {posts.map((post, i) => (
            <a
              key={i}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200 group flex items-end"
            >
              {post.video && (
                <video
                  src={post.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  onTimeUpdate={(e) => {
                    const v = e.currentTarget;
                    if (v.currentTime > CLIP_SECONDS) v.currentTime = 0;
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />
              <div className="relative bottom-3 left-3 right-3 p-3">
                <span className="block text-white text-xs md:text-sm leading-snug">{post.caption}</span>
                <span className="block text-white text-[10px] tracking-wider uppercase underline underline-offset-2 mt-1">
                  View Post
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}