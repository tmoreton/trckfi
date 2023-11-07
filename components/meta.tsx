import Head from 'next/head'

const Meta = ({ post }) => {
  return (
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon.png" />
      <link rel="mask-icon" href="/favicon.png" color="#db2777" />
      <link rel="shortcut icon" href="/favicon/favicon.png" />
      <meta name="msapplication-TileColor" content="#db2777" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#db2777" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <title>{post && post?.title ? post.title : 'Trckfi - Your online all-in-one, user-friendly personal finance platform.'}</title>
      <meta name="description" content={post && post?.description ? post.description : "Trckfi is your all-in-one online personal finance platform. We provide you with the tools and insights you need to take control of your finances. Our platform seamlessly connects to your bank accounts, credit cards, investments, and more, giving you a comprehensive view of your financial landscape. We categorize your transactions, visualize your spending, and offer smart suggestions to help you make informed financial decisions. Plus, we're all about making finances fun and engaging with features like our Vision Board Magic."} />
      <meta name="keywords" content={post && post?.keywords ? post.keywords : "financial success, spend tracking, budgeting, expense tracking, budget planning, financial health, tips, tools, financial freedom, personal finance, financial management, financial goals, financial success" }/>
      <meta property="og:image" content={post && post?.coverImage ? post.coverImage : "/trckfi-og-image.png"} />
      { !post ?
        <meta property="og:title" content='Take control of your wealth journey while keeping your data private & secure with Trckfi' />
        :
        <meta property="og:title" content={post?.seoTitle || post?.title} />
      }
      <meta property="og:description" content={post && post?.description ? post.description : "Trckfi is your all-in-one online personal finance platform."} />
      <meta name="facebook-domain-verification" content="4edjuvyb4b7cwp99i13jbj0ttzammg" />
    </Head>
  )
}

export default Meta
