import Head from 'next/head'
import { ArticleJsonLd } from 'next-seo'
import Blogpost from '../layouts/Blogpost'
import ErrorMessage from '../components/ErrorMessage'
import { getPostBySlug, getAllPosts, convertMarkdownToHtml } from '../lib/blog'

function Post(props) {
  if (props.errorCode) {
    return <ErrorMessage code={props.errorCode} />
  }

  const title = `${props.title} // Gusttavo Castro`
  const description = props.description || ''
  const url = `https://castrogusttavo.vercel.app/${props.slug}`
  const date = new Date(props.date).toISOString()
  const image = props.image
    ? `https://zenorocha.com${props.image}`
    : 'https://zenorocha.com/static/images/home-opt.jpg'

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta content={title} property="og:title" />
        <meta content={description} name="description" />
        <meta content={description} property="og:description" />
        <meta content={url} property="og:url" />
        <meta content={image} property="og:image" />

        {props.canonical_url && (
          <link rel="canonical" href={props.canonical_url} />
        )}
      </Head>

      <ArticleJsonLd
        authorName="Gusttavo Castro"
        type="Blog"
        url={url}
        title={title}
        images={[image]}
        datePublished={date}
        dateModified={date}
        description={props.description}
      />

      <div dangerouslySetInnerHTML={{ __html: props.content }} />
    </>
  )
}

export async function getStaticProps({ params }) {
  try {
    console.log('Fetching post for slug:', params.slug)
    const post = getPostBySlug(params.slug, [
      'canonical_url',
      'content',
      'date',
      'description',
      'image',
      'lang',
      'slug',
      'title',
    ])

    if (!post) {
      console.error('Post not found:', params.slug)
      return { props: { errorCode: 404 } }
    }

    const content = await convertMarkdownToHtml(post.content || '')

    const isProd = process.env.NODE_ENV === 'production'
    const base = isProd ? 'https://castrogusttavo.vercel.app' : 'http://localhost:3000'

    if (isProd) {
      const viewsReq = await fetch(`${base}/api/views/${params.slug}`)
      const viewsRes = await viewsReq.json()

      post.views = new Intl.NumberFormat().format(viewsRes.views || 0)
    }

    return {
      props: {
        ...post,
        content,
      },
      revalidate: 60,
    }
  } catch (e) {
    return { props: { errorCode: 404 } }
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  console.log('Posts:', posts)

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.slug,
        },
      }
    }),
    fallback: 'blocking',
  }
}

Post.Layout = Blogpost

export default Post
