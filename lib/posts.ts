export type Post = {
  slug: string;
  title: string;
  date: string;
  displayDate: string;
  fullDate: string;
  description: string;
  readingTime: string;
  hidden: boolean;
  series?: string;
  seriesOrder?: number;
  previewImage?: {
    src: string;
    alt: string;
  };
  content: string;
};

declare const __POST_MODIFIED_DATES__: Readonly<Record<string, string>>;

const postFiles = import.meta.glob<string>('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
});

function getFirstImage(content: string): Post['previewImage'] {
  const match = content.match(/!\[([^\]]*)\]\(\s*(?:<([^>]+)>|([^\s)]+))(?:\s+["'][^"']*["'])?\s*\)/);
  if (!match) return undefined;

  const source = match[2] ?? match[3];
  const publicAsset = source.match(/(?:^|\/)public\/(.+)$/);

  return {
    src: publicAsset ? `/${publicAsset[1]}` : source,
    alt: match[1] || 'Post preview',
  };
}

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
  const modifiedDate = typeof __POST_MODIFIED_DATES__ === 'undefined'
    ? undefined
    : __POST_MODIFIED_DATES__[slug];
  const date = attributes.date || modifiedDate || '1970-01-01';
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
    hidden: attributes.hidden === 'true',
    series: attributes.series || undefined,
    seriesOrder: attributes.seriesOrder ? Number(attributes.seriesOrder) : undefined,
    previewImage: getFirstImage(content),
    content,
  };
}

export function getAllPosts(): Post[] {
  return Object.entries(postFiles)
    .map(([path, source]) => parsePost(path, source))
    .filter((post) => !post.hidden)
    .sort((a, b) => {
      const dateOrder = b.date.localeCompare(a.date);

      if (dateOrder !== 0) return dateOrder;
      if (a.series && a.series === b.series) {
        return (b.seriesOrder ?? 0) - (a.seriesOrder ?? 0);
      }

      return a.title.localeCompare(b.title);
    });
}

export function getPostBySlug(slug: string): Post | undefined {
  return Object.entries(postFiles)
    .map(([path, source]) => parsePost(path, source))
    .find((post) => post.slug === slug);
}

export function getSeriesPosts(series: string): Post[] {
  return getAllPosts()
    .filter((post) => post.series === series)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}
