'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

type MathJaxApi = {
  startup?: { promise?: Promise<void> };
  typesetClear?: (elements?: Element[]) => void;
  typesetPromise?: (elements?: Element[]) => Promise<void>;
};

declare global {
  interface Window {
    MathJax?: MathJaxApi & Record<string, unknown>;
  }
}

const scriptId = 'mathjax-script';
const scriptSource = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';

function loadMathJax() {
  if (window.MathJax?.typesetPromise) return Promise.resolve();

  window.MathJax ??= {
    tex: {
      inlineMath: [['\\(', '\\)']],
      displayMath: [['\\[', '\\]']],
      processEscapes: true,
    },
    svg: { fontCache: 'global' },
    startup: { typeset: false },
  } as MathJaxApi & Record<string, unknown>;

  const existing = document.getElementById(scriptId) as HTMLScriptElement | null;

  return new Promise<void>((resolve, reject) => {
    const script = existing ?? document.createElement('script');

    script.addEventListener('load', () => resolve(), { once: true });
    script.addEventListener('error', () => reject(new Error('MathJax failed to load.')), { once: true });

    if (!existing) {
      script.id = scriptId;
      script.src = scriptSource;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }
  });
}

export function MathJaxLoader() {
  const pathname = usePathname();

  useEffect(() => {
    const post = document.querySelector('.post-article-body');
    if (!post) return;

    let active = true;

    void loadMathJax()
      .then(async () => {
        await window.MathJax?.startup?.promise;
        if (!active) return;

        window.MathJax?.typesetClear?.([post]);
        await window.MathJax?.typesetPromise?.([post]);
      })
      .catch((error: unknown) => {
        if (active) console.warn('MathJax could not render this post.', error);
      });

    return () => {
      active = false;
    };
  }, [pathname]);

  return null;
}
