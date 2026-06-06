import React from 'react';
import { Helmet } from 'react-helmet-async';
import { usePortfolio } from '../context/PortfolioContext';

export const SEOHead: React.FC = () => {
  const { meta, seo } = usePortfolio();

  return (
    <Helmet>
      {/* Basic Metadata */}
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <meta name="keywords" content={meta.keywords.join(', ')} />
      <meta name="author" content={meta.author} />
      <meta name="robots" content={seo.robots} />
      <meta name="viewport" content={seo.viewport} />
      <meta name="theme-color" content={seo.themeColor} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={meta.canonicalUrl || meta.siteUrl} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={meta.ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={meta.canonicalUrl || meta.siteUrl} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={meta.ogImage} />
      <meta name="twitter:creator" content={meta.twitterHandle} />

      {/* Canonical URL & Links */}
      <link rel="canonical" href={meta.canonicalUrl || meta.siteUrl} />
      <link rel="icon" type="image/x-icon" href={meta.favicon} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify(seo.structuredData)}
      </script>
    </Helmet>
  );
};
