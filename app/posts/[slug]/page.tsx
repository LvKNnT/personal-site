import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { getAllPosts, getPostBySlug } from '@/lib/posts';

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

  return (
    <main className="page-shell">
      <article className="section-frame post-article">
        <header className="post-article-header">
          <a className="back-link" href="/posts"><ArrowLeft size={16} aria-hidden="true" /> Posts</a>
          <h1>{post.title}</h1>
          <div className="post-article-meta">
            <time dateTime={post.date}>{post.fullDate}</time>
            <span>{post.readingTime}</span>
          </div>
        </header>
        <div className="markdown-body post-article-body">
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeKatex]}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
