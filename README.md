# Personal Site

A simple personal website for my profile, selected work, and technical notes.

**Live site:** [personal-site.khanglamtat.workers.dev](https://personal-site.khanglamtat.workers.dev)

## Features

- Profile, work, and posts routes
- Responsive light and dark themes
- Markdown-powered About section and blog posts
- MathJax support for inline and display LaTeX
- Automatic post reading time and first-image previews
- Project images with an accessible zoom view
- Cloudflare Workers deployment

## Stack

- [React 19](https://react.dev/)
- [Vinext](https://github.com/cloudflare/vinext)
- [Vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [MathJax](https://www.mathjax.org/)
- [Cloudflare Workers](https://workers.cloudflare.com/)

## Routes

| Route | Content |
| --- | --- |
| `/` | Profile, About, cover image, timeline, and links |
| `/work` | Projects, descriptions, links, images, and tags |
| `/posts` | Blog index with dates, reading times, and previews |
| `/posts/:slug` | Individual Markdown post |

## Requirements

- Node.js 22.13 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Vinext watches the source and Markdown files, so saved changes normally appear without restarting the development server.

To test the production build locally:

```bash
npm run build
npm run start
```

## Editing the site

### Profile

- Edit profile details, social links, and the timeline in `app/page.tsx`.
- Edit the About section in `content/about.md`.
- Replace `public/avatar.jpg` to change the avatar and navigation mark.
- Replace `public/cover.jpg` to change the profile cover.
- Edit or replace `public/favicon.svg` to change the favicon.

Keep the same filenames to update an image without changing the code. If the browser shows an older image, perform a hard refresh.

### Work

Projects are stored in the `projects` array in `app/work/page.tsx`:

```ts
{
  year: '2026',
  title: 'Project name',
  type: 'Personal project',
  description: 'A short explanation of the project.',
  tags: ['TypeScript', 'React'],
  href: 'https://github.com/username/project',
  image: '/work/img/project.png',
  imageAlt: 'Project screenshot',
}
```

Place work images in `public/work/img/`. The `image` and `imageAlt` fields are optional, but linked projects should include `href` when available.

### Posts

Create a Markdown file in `content/posts/`. Its filename becomes the URL slug:

```text
content/posts/my-new-post.md -> /posts/my-new-post
```

Use this front matter:

```md
---
title: My new post
date: 2026-09-16
description: A short description shown on the posts page.
# readingTime: 5 min
---

Post content goes here.
```

`readingTime` is optional. When omitted, it is calculated automatically at approximately 200 words per minute.

The first Markdown image is used as the post preview image:

```md
![Description](/work/img/example.jpg)
```

Assets placed in `public/` are referenced from the site root, so do not include `/public` in the URL.

### Mathematics

Use `$...$` for inline math:

```md
The error vector is $\mathbf{e} \in \mathbb{Z}_q^n$.
```

Use `$$...$$` for centered display math:

```md
$$
\mathbf{A}\mathbf{e} = \mathbf{b} \pmod q
$$
```

Long equations can be split with an aligned environment:

```md
$$
\begin{aligned}
a &\Longrightarrow b \\
  &\Longrightarrow c
\end{aligned}
$$
```

MathJax is loaded in the browser from jsDelivr, so displaying equations requires an internet connection.

## Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create the production Worker build |
| `npm run start` | Run the built Worker locally with Wrangler |
| `npm run lint` | Check the source with Oxlint |
| `npm run format` | Format the source with Oxfmt |

## Deploying to Cloudflare Workers

Authenticate once if Wrangler requests it:

```bash
npx wrangler login
```

Build and deploy the current local files:

```bash
npm run build
npx wrangler deploy --config ./dist/server/wrangler.json
```

Wrangler deploys the generated local build, not the contents of the GitHub repository. Run `npm run build` again before every deployment so `dist/` contains the latest changes.

## Repository structure

```text
app/                  Routes, layout, and global styles
components/           Shared React components
content/about.md      About section
content/posts/        Markdown blog posts
lib/posts.ts          Post discovery and metadata parsing
public/               Avatar, cover, favicon, and content images
vite.config.ts        Vinext, Tailwind, and Cloudflare configuration
```

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
