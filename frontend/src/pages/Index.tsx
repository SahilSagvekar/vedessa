import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import ShopByCategory from '@/components/home/ShopByCategory';
import CardGallery from '@/components/home/CardGallery';
import BannerGrid from '@/components/home/BannerGrid';
import NewLaunches from '@/components/home/NewLaunches';
import FeaturedProductStrip from '@/components/home/FeaturedProductStrip';
import ArtOfAyurveda from '@/components/home/ArtOfAyurveda';
import CollectionBanner from '@/components/home/CollectionBanner';
import ShopByConcern from '@/components/home/ShopByConcern';
import Bestsellers from '@/components/home/Bestsellers';
import InstagramGrid from '@/components/home/InstagramGrid';
import StatsRow from '@/components/home/StatsRow';
import Testimonials from '@/components/Testimonials';
import Editorials from '@/components/home/Editorials';
import PressLogos from '@/components/home/PressLogos';
import NewsletterBanner from '@/components/home/NewsletterBanner';
import SupportCollaborations from '@/components/SupportCollaborations'
import SEO from '@/components/seo/SEO';
import ScrollReveal from '@/components/common/ScrollReveal';

// Placeholder data for the new gallery/banner sections below — swap in real
// image URLs and copy whenever ready. Structure mirrors the reference
// homepage; wording is generic Vedessa filler, not meant to be final copy.

const spotlightBrands = [
  { title: 'Niacinamide', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786042653/11_nhn25p.png' },
  { title: 'Vitamin C', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786044002/12_qsmvac.png' },
  { title: 'Salicylic Acid', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786044713/13_pbmxtr.png' },
  { title: 'Aloe Vera', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786045316/15_fp6fxg.jpg' },
  { title: 'Shikakai', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786045759/16_tuc9wx.jpg' },
  { title: 'Almond', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786046176/19_yq3sbj.jpg' },
  { title: 'Kumkumadi', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786045055/14_fhsizx.jpg' },
  { title: 'Hibiscuss', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1786045915/17_vlt2bl.jpg' },
];

const occasionBanners = [
  { title: 'WHO-GMP Manufacturing', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785956038/WHO-GMP_mdthag.png' }, // hero
  { title: 'Dermatologically Tested', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785956036/Dermatologically_Tested-1_ffadqv.jpg', span: 2 as const },
  { title: 'Vegan', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785956288/vegan_lc7mdi.jpg', span: 2 as const },
  { title: 'Made in India', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785956535/india_wiltek.png', span: 2 as const },
  { title: 'Sulphate Free', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785956693/sulphate_free_cbek16.jpg', span: 1 as const },
  { title: 'Paraben Free', image: 'https://res.cloudinary.com/dmigevbpo/image/upload/v1785956853/Gemini_Generated_eahgdk.png', span: 1 as const },
];

const inHighDemand = [
  { name: 'Vitamin C Face Wash', description: 'Brightening formula for all skin types', price: 249, comparePrice: 299, image: '' },
  { name: 'Almond Shampoo', description: 'Creamy protein shampoo for soft, shiny hair', price: 299, comparePrice: 349, image: '' },
  { name: 'Skin Radiance Cream', description: 'Niacinamide + Alpha Arbutin glow cream', price: 499, comparePrice: 599, image: '' },
  { name: 'Kumkumadi Oil', description: 'Traditional Ayurvedic radiance oil', price: 699, comparePrice: 849, image: '' },
];

const mustTryFormulations = [
  { title: 'Salicylic Acid Face Wash', subtitle: 'For active acne', image: '' },
  { title: 'Niacinamide Cleanser', subtitle: 'Deep hydration', image: '' },
  { title: 'Sunblock Aqua Gel', subtitle: 'SPF 50+', image: '' },
  { title: 'Aloe Vera Gel', subtitle: '99% pure', image: '' },
  { title: 'Cucumber Face Wash', subtitle: 'Instant refresh', image: '' },
];

const editorsPicks = [
  { name: 'De-Tan Face Wash', description: 'Glowing, refreshed skin', price: 229, image: '' },
  { name: 'Aloevera & Hibiscus Shampoo', description: 'Reduces hair fall', price: 299, image: '' },
  { name: 'Sunblock Matte Finish', description: 'Broad spectrum SPF 50+', price: 549, image: '' },
  { name: 'Kumkumadi Essential Oil', description: 'Skin healing ritual', price: 699, image: '' },
];

const communityFavorites = [
  { title: 'Ananya S.', subtitle: 'Skincare devotee', image: '' },
  { title: 'Rhea K.', subtitle: 'Haircare convert', image: '' },
  { title: 'Meera P.', subtitle: 'Bestseller fan', image: '' },
  { title: 'Divya T.', subtitle: 'First-time buyer', image: '' },
];

const Index = () => {
  return (
    <Layout>
      <SEO />
      <HeroSection />

      <ScrollReveal>
        <ShopByCategory />
      </ScrollReveal>

      <ScrollReveal>
        <CardGallery title="Shop By Ingredient" items={spotlightBrands} />
      </ScrollReveal>

      <ScrollReveal>
        <BannerGrid title="Why Choose Vedessa" items={occasionBanners} />
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <NewLaunches />
      </ScrollReveal>

      <ScrollReveal>
        <FeaturedProductStrip title="In High Demand" items={inHighDemand} />
      </ScrollReveal>

      <ScrollReveal>
        <ArtOfAyurveda />
      </ScrollReveal>

      <ScrollReveal>
        <CollectionBanner />
      </ScrollReveal>

      <ScrollReveal>
        <ShopByConcern />
      </ScrollReveal>

      <ScrollReveal>
        <CardGallery title="Must-Try Formulations" items={mustTryFormulations} showShopNow />
      </ScrollReveal>

      <ScrollReveal>
        <Bestsellers />
      </ScrollReveal>

      <ScrollReveal>
        <FeaturedProductStrip title="Editor's Picks" items={editorsPicks} />
      </ScrollReveal>

      <ScrollReveal>
        <CardGallery title="Community Favorites" viewAllHref="/products" items={communityFavorites} />
      </ScrollReveal>

      <ScrollReveal>
        <InstagramGrid />
      </ScrollReveal>

      <ScrollReveal>
        <StatsRow />
      </ScrollReveal>

      <ScrollReveal>
        <Testimonials />
      </ScrollReveal>

      <ScrollReveal>
        <Editorials />
      </ScrollReveal>

      <ScrollReveal>
        <PressLogos />
      </ScrollReveal>

      <ScrollReveal>
        <NewsletterBanner />
      </ScrollReveal>

      <ScrollReveal>
        <SupportCollaborations />
      </ScrollReveal>
    </Layout>
  );
};

export default Index;