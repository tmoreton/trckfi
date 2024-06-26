import Head from 'next/head'
import { useRouter } from 'next/router'

const Meta = ({ meta }) => {
  const router = useRouter()

  const addProductJsonLd = (meta) => {
    if(meta?.slug){
      return {
        __html: `{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://www.trckfi.com/blog/${meta?.slug}"
          },
          "headline": "${meta?.title}",
          "description": "${meta?.description}",
          "image": "${meta?.coverImage}",  
          "author": {
            "@type": "Organization",
            "name": "Trckfi",
            "url": "https://www.trckfi.com/"
          },  
          "publisher": {
            "@type": "Organization",
            "name": "Trckfi",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.trckfi.com/trckfi-black-sm.png"
            }
          },
          "datePublished": "${meta?.publishedAt}"
        }
      `}
    }
    return {
      __html: `{
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "${meta?.title || 'Trckfi'}",
        "description": "${meta?.description || 'Trckfi'}",
        "url": "https://www.trckfi.com${router.pathname}",
        "logo": "https://www.trckfi.com/trckfi-black-sm.png",
        "sameAs": [
          "https://www.facebook.com/trckfi",
          "https://twitter.com/trckfi",
          "https://www.instagram.com/trckfi/",
          "https://www.youtube.com/channel/UC9dzSltq_QHoFLYBoP2_cXg"
        ]
      }
    `}
  }

  return (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon.jpg" />
      <link rel="icon" type="image/png" sizes="32x32" href="/apple-icon.jpg" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      <link rel="mask-icon" href="/favicon.png" color="#db2777" />
      <link rel="shortcut icon" href="/favicon/favicon.png" />
      <meta name="msapplication-TileColor" content="#db2777" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#db2777" />
      <meta name="robots" content="index, follow" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <title>{meta && meta?.title ? meta.title : 'Trckfi Expense & Investment Tracking - Best Personal Finance App'}</title>
      <meta name="description" content={meta && meta?.description ? meta.description : "Take control of your finances with Trckfi, best app for tracking expenses, managing budgets, and monitoring investments. Simplify your financial management and reach your goals."} />
      <meta name="keywords" content={meta && meta?.keywords ? meta.keywords : "Trckfi, Personal finance app, Personal finance tracker, Personal expense tracker app, Personal finance expense tracker, Personal finance management, Personal finance solutions, Best app to keep track of spending, Best expenses app, Best spending tracker, Best expense tracking app, Best monthly expense tracker app, Best personal expense tracker, Best spending tracker app, Best personal expense tracker app, Best online expense tracker, Best app for keeping track of expenses, Finance tracker online, Finance tracker app, Online personal expense tracker, Online finance tracker, Online expense tracker, Online budget tracker, Money tracking app, Online spending tracker , Cash flow tracker, best way to track cash flow, personal cash flow tracker, Net worth analysis, investment tracking app, best investment tracking app" }/>
      <meta property="og:image" content={meta && meta?.coverImage ? meta.coverImage : "/trckfi-og-image.png"} />
      { !meta ?
        <meta property="og:title" content='Best Personal Finance App - Trckfi: Expense & Investment Tracking' />
        :
        <meta property="og:title" content={meta?.seoTitle || meta?.title } />
      }
      <meta property="og:description" content={meta && meta?.description ? meta.description : "Take control of your finances with Trckfi, best app for tracking expenses, managing budgets, and monitoring investments. Simplify your financial management and reach your goals."} />
      <meta name="facebook-domain-verification" content="4edjuvyb4b7cwp99i13jbj0ttzammg" />
      <meta name="ahrefs-site-verification" content="a2ef4d971772d5ef47866ad9d3d1e9fba252fab335831788b3fe0ce67b3ec738" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={addProductJsonLd(meta)}
        key="product-jsonld"
      />
    </Head>
  )
}

export default Meta
