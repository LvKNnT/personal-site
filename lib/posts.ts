export type Post = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  fullDate: string;
  description: string;
  readingTime: string;
  content: string;
};

const postFiles = import.meta.glob<string>('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function parsePost(path: string, source: string): Post {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  const attributes: Record<string, string> = {};

  if (match) {
    for (const line of match[1].split(/\r?\n/)) {
      const separator = line.indexOf(':');
      if (separator === -1) continue;
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
      attributes[key] = value;
    }
  }

  const slug = path.split('/').pop()?.replace(/\.md$/, '') ?? '';
  const content = match ? source.slice(match[0].length).trim() : source.trim();
  const date = attributes.date ?? '1970-01-01';
  const parsedDate = new Date(`${date}T00:00:00Z`);
  const words = content.split(/\s+/).filter(Boolean).length;

  return {
    slug,
    title: attributes.title ?? slug,
    date,
    displayDate: new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(parsedDate),
    fullDate: new Intl.DateTimeFormat('en', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(parsedDate),
    description: attributes.description ?? '',
    readingTime: attributes.readingTime ?? `${Math.max(1, Math.ceil(words / 200))} min`,
    content,
  };
}

export function getAllPosts(): Post[] {
  return Object.entries(postFiles)
    .map(([path, source]) => parsePost(path, source))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}
