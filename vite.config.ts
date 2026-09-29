import tailwindcss from '@tailwindcss/postcss';
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import vinext from 'vinext';
import { defineConfig } from 'vite';

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
        let date = formatPostDate(statSync(resolve(postsDirectory, file)).mtime);

        try {
          const status = execFileSync('git', ['status', '--porcelain', '--', relativePath], {
            encoding: 'utf8',
          }).trim();

          if (!status) {
            const lastCommitDate = execFileSync(
              'git',
              ['log', '-1', '--format=%cs', '--', relativePath],
              { encoding: 'utf8' },
            ).trim();

            if (lastCommitDate) date = lastCommitDate;
          }
        } catch {
          // Filesystem modification time is the fallback when Git is unavailable.
        }

        return [slug, date];
      }),
  );
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
      vinext(),
      cloudflare({
        viteEnvironment: { name: 'rsc', childEnvironments: ['ssr'] },
        config: localBindingConfig,
      }),
    ],
  };
});
