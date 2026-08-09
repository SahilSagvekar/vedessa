import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const VIDEO_SRC = 'https://res.cloudinary.com/dmigevbpo/video/upload/v1786267578/v3_ptptze.mp4';

const CollectionBanner = () => {
  return (
     <section className="relative h-[500px] my-16 overflow-hidden bg-black">
      {/* Blurred, zoomed copy fills the frame so there's no empty letterbox space */}
      <video
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
      />
      {/* Real video shown uncropped, centered on top */}
      <video
        src={VIDEO_SRC}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-contain"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-end pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <Link to="/products?collection=bringaras">
              <Button className="bg-[#C17855] hover:bg-[#A66545] text-white px-10 py-4 text-sm font-medium tracking-wider uppercase transition-colors">
                EXPLORE COLLECTION
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
    // <section className="relative h-[400px] overflow-hidden">
    //   <div className="absolute inset-0">
    //     <img
    //       src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920&h=800&fit=crop"
    //       alt="Bringaras Collection"
    //       className="w-full h-full object-cover"
    //     />
    //     <div className="absolute inset-0 bg-gradient-to-r from-kama-olive/70 via-kama-olive/40 to-transparent" />
    //   </div>

    //   <div className="relative z-10 h-full flex items-center justify-center text-center">
    //     <div>
    //       <h2 className="text-4xl md:text-5xl font-display text-kama-cream mb-3">
    //         Bringaras Collection
    //       </h2>
    //       <p className="text-lg text-kama-cream/90 mb-6">
    //         For healthy, lustrous hair
    //       </p>
    //       <Link to="/products?collection=bringaras">
    //         <Button className="bg-kama-olive hover:bg-kama-olive-light text-kama-cream px-8 py-6 text-sm tracking-wide">
    //           EXPLORE COLLECTION
    //         </Button>
    //       </Link>
    //     </div>
    //   </div>
    // </section>
  );
};

export default CollectionBanner;