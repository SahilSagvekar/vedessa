import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: string;
    price?: string;
    availability?: string;
}

const SEO = ({
    title = 'Vedessa | Authentic Ayurvedic Skincare & Wellness',
    description = 'Experience the power of Ancient Ayurveda with Vedessa. Premium, natural, and effective skincare, haircare, and wellness products crafted for modern living.',
    keywords = 'ayurveda, skincare, natural beauty, organic wellness, vedessa, hair care, herbal products',
    image = '/logo/1.png',
    url = window.location.href,
    type = 'website',
    price,
    availability,
}: SEOProps) => {
    const siteName = 'Vedessa';
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Product Specific Metadata (if applicable) */}
            {type === 'product' && price && (
                <meta property="product:price:amount" content={price} />
            )}
            {type === 'product' && (
                <meta property="product:price:currency" content="INR" />
            )}
            {type === 'product' && availability && (
                <meta property="product:availability" content={availability} />
            )}

            {/* Favicon related */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
};

export default SEO;
