import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CollectionsGrid from '@/components/home/CollectionsGrid';
import NewLaunches from '@/components/home/NewLaunches';
import ArtOfAyurveda from '@/components/home/ArtOfAyurveda';
import CollectionBanner from '@/components/home/CollectionBanner';
import Bestsellers from '@/components/home/Bestsellers';
import SupportCollaborations from '@/components/SupportCollaborations'
import Testimonials from '@/components/Testimonials';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CollectionsGrid />
      <NewLaunches />
      <ArtOfAyurveda />
      <CollectionBanner />
      <Bestsellers />
      {/* <Testimonials /> */}
      <SupportCollaborations />
    </Layout>
  );
};

export default Index;
