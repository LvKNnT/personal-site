import type { Metadata } from 'next';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import rehypeHighlight from 'rehype-highlight';
import rehypeMathjax from 'rehype-mathjax/browser';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { getAllPosts, getPostBySlug, getSeriesPosts } from '@/lib/posts';
import { MathJaxLoader } from '@/components/mathjax-loader';

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) return {};

  return { title: post.title, description: post.description };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const seriesPosts = post.series ? getSeriesPosts(post.series) : [];
  const seriesIndex = seriesPosts.findIndex((item) => item.slug === post.slug);
  const previousPost = seriesIndex > 0 ? seriesPosts[seriesIndex - 1] : undefined;
  const nextPost = seriesIndex >= 0 ? seriesPosts[seriesIndex + 1] : undefined;

  return (
    <main className="page-shell">
      <article className="section-frame post-article">
        <header className="post-article-header">
          <a className="back-link" href="/posts"><ArrowLeft size={16} aria-hidden="true" /> Posts</a>
          <h1>{post.title}</h1>
          {post.series && seriesIndex >= 0 ? (
            <p className="post-series-label">{post.series} · Chapter {seriesIndex + 1} of {seriesPosts.length}</p>
          ) : null}
          <div className="post-article-meta">
            <time dateTime={post.date}>{post.fullDate}</time>
            <span>{post.readingTime}</span>
          </div>
        </header>
        <div className="markdown-body post-article-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeMathjax]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
        {post.series ? (
          <nav className="series-navigation" aria-label={`${post.series} chapter navigation`}>
            {previousPost ? (
              <a className="series-link series-link-previous" href={`/posts/${previousPost.slug}`} aria-label={`Previous chapter: ${previousPost.title}`}>
                <ArrowLeft size={17} aria-hidden="true" />
                <span>Previous</span>
              </a>
            ) : (
              <span className="series-link series-link-previous series-link-disabled" aria-disabled="true">
                <ArrowLeft size={17} aria-hidden="true" />
                <span>Previous</span>
              </span>
            )}
            <span className="series-progress">Chapter {seriesIndex + 1} / {seriesPosts.length}</span>
            {nextPost ? (
              <a className="series-link series-link-next" href={`/posts/${nextPost.slug}`} aria-label={`Next chapter: ${nextPost.title}`}>
                <span>Next</span>
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            ) : (
              <span className="series-link series-link-next series-link-disabled" aria-disabled="true">
                <span>Next</span>
                <ArrowRight size={17} aria-hidden="true" />
              </span>
            )}
          </nav>
        ) : null}
        <MathJaxLoader />
      </article>
    </main>
  );
}
