import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CollectionsGrid from '@/components/home/CollectionsGrid';
import NewLaunches from '@/components/home/NewLaunches';
import ArtOfAyurveda from '@/components/home/ArtOfAyurveda';
import CollectionBanner from '@/components/home/CollectionBanner';
import Bestsellers from '@/components/home/Bestsellers';
import SupportCollaborations from '@/components/SupportCollaborations'
import Testimonials from '@/components/Testimonials';
import SEO from '@/components/seo/SEO';
import ScrollReveal from '@/components/common/ScrollReveal';

const Index = () => {
  return (
    <Layout>
      <SEO />
      <HeroSection />
      
      <ScrollReveal>
        <CollectionsGrid />
      </ScrollReveal>
      
      <ScrollReveal delay={0.2}>
        <NewLaunches />
      </ScrollReveal>
      
      <ScrollReveal>
        <ArtOfAyurveda />
      </ScrollReveal>
      
      <ScrollReveal>
        <CollectionBanner />
      </ScrollReveal>
      
      <ScrollReveal>
        <Bestsellers />
      </ScrollReveal>
      
      <ScrollReveal>
        <SupportCollaborations />
      </ScrollReveal>
    </Layout>
  );
};

export default Index;
