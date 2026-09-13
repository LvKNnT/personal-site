import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { getAllPosts } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'Posts',
  description: 'Notes about CS, learning, and the occasional side quest.',
};

export default function PostsPage() {
  const posts = getAllPosts();

  return (
    <main className="page-shell">
      <div className="section-frame">
        <header className="page-intro">
          <p className="kicker">Posts</p>
          <h1>Notes, or yapping lol</h1>
          <p>Thoughts on CS, learning, and the occasional side quest.</p>
        </header>

        <div className="post-list">
          {posts.map((post) => (
            <a className="post-item" href={`/posts/${post.slug}`} key={post.slug}>
              <div className="post-date"><time dateTime={post.date}>{post.displayDate}</time><span>{post.readingTime}</span></div>
              <div className="post-copy">
                <div className="post-title"><h2>{post.title}</h2><ArrowUpRight size={18} aria-hidden="true" /></div>
                <p>{post.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
