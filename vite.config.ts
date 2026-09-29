import tailwindcss from '@tailwindcss/postcss';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import vinext from 'vinext';
import { defineConfig, type Plugin } from 'vite';

const localBindingConfig = {
  main: 'vinext/server/fetch-handler',
  compatibility_flags: ['nodejs_compat'],
};

function formatPostDate(date: Date) {
  return new Intl.DateTimeFormat('en-CA', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
  }).format(date);
}

function getPostModifiedDates() {
  const postsDirectory = resolve(process.cwd(), 'content/posts');

  return Object.fromEntries(
    readdirSync(postsDirectory)
      .filter((file) => file.endsWith('.md'))
      .map((file) => {
        const slug = basename(file, '.md');
        const relativePath = `content/posts/${file}`;
        let modifiedAt = statSync(resolve(postsDirectory, file)).mtime;

        try {
          const status = execFileSync('git', ['status', '--porcelain', '--', relativePath], {
            encoding: 'utf8',
          }).trim();

          if (!status) {
            const lastCommitTimestamp = execFileSync(
              'git',
              ['log', '-1', '--format=%cI', '--', relativePath],
              { encoding: 'utf8' },
            ).trim();

            if (lastCommitTimestamp) modifiedAt = new Date(lastCommitTimestamp);
          }
        } catch {
          // Filesystem modification time is the fallback when Git is unavailable.
        }

        return [slug, {
          date: formatPostDate(modifiedAt),
          timestamp: modifiedAt.toISOString(),
        }];
      }),
  );
}

function refreshUndatedPostsPlugin(): Plugin {
  const postsDirectory = resolve(process.cwd(), 'content/posts').replace(/\\/g, '/');

  return {
    name: 'refresh-undated-post-metadata',
    configureServer(server) {
      const refresh = (file: string) => {
        const normalizedFile = file.replace(/\\/g, '/');
        if (!normalizedFile.startsWith(`${postsDirectory}/`) || !normalizedFile.endsWith('.md')) return;

        const source = readFileSync(file, 'utf8');
        const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (frontmatter?.[1].match(/^date:\s*\S+/m)) return;

        void server.restart();
      };

      server.watcher.on('add', refresh);
      server.watcher.on('change', refresh);

      server.httpServer?.once('close', () => {
        server.watcher.off('add', refresh);
        server.watcher.off('change', refresh);
      });
    },
  };
}

export default defineConfig(async () => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= 'false';
  process.env.WRANGLER_LOG_PATH ??= '.wrangler/logs';
  process.env.MINIFLARE_REGISTRY_PATH ??= '.wrangler/registry';

  // Wrangler snapshots its log path while the Cloudflare plugin is imported.
  const { cloudflare } = await import('@cloudflare/vite-plugin');

  return {
    assetsInclude: ['**/*.md'],
    css: { postcss: { plugins: [tailwindcss()] } },
    define: {
      __POST_MODIFIED_DATES__: JSON.stringify(getPostModifiedDates()),
    },
    plugins: [
      refreshUndatedPostsPlugin(),
      vinext(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: localBindingConfig,
      }),
    ],
  };
});
