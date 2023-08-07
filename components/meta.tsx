import Head from 'next/head'

const Meta = ({ title, description, image, keywords }) => {
  return (
    <Head>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon.png"
      />
      <link
        rel="mask-icon"
        href="/favicon.png"
        color="#000000"
      />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <meta name="msapplication-TileColor" content="#db2777" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#db2777" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <title>{title || 'Trckfi'}</title>
      <meta
        name="description"
        content={description || "Take control of your wealth journey while keeping your data private & secure with Trckfi"}
      />
      <meta name="keywords" content={keywords || "financial success, spend tracking, budgeting, expense tracking, budget planning, financial health, tips, tools, financial freedom, personal finance, financial management, financial goals, financial success"}/>
      <meta property="og:image" content={image || "/trckfi-black-sm.png"} />
      <meta property="og:title" content={title || 'Trckfi'} />
      <meta property="og:description" content={description || "Take control of your wealth journey while keeping your data private & secure with Trckfi"} />
    </Head>
  )
}

export default Meta
