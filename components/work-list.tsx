'use client';

import { ArrowUpRight, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type Project = {
  year: string;
  title: string;
  type: string;
  description: string;
  tags: string[];
  href?: string;
  image?: string;
  imageAlt?: string;
};

export function WorkList({ projects }: { projects: Project[] }) {
  const [zoomedProject, setZoomedProject] = useState<Project | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!zoomedProject) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setZoomedProject(null);
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', closeOnEscape);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [zoomedProject]);

  return (
    <>
      <div className="work-list">
        {projects.map((project) => (
          <article className={`work-item${project.href ? ' work-item-linked' : ''}`} key={`${project.year}-${project.title}`}>
            {project.href && (
              <a className="work-card-link" href={project.href} target="_blank" rel="noreferrer" aria-label={`View ${project.title}`} />
            )}
            <div className="work-meta"><span>{project.type}</span><time>{project.year}</time></div>
            <div className="work-title">
              <h2>{project.title}</h2>
              {project.href && <ArrowUpRight size={18} aria-hidden="true" />}
            </div>
            <p>{project.description}</p>
            {project.image && (
              <button className="work-image" type="button" onClick={() => setZoomedProject(project)} aria-label={`Enlarge ${project.imageAlt ?? project.title}`}>
                <img src={project.image} alt={project.imageAlt ?? project.title} />
              </button>
            )}
            <ul aria-label="Technologies">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
          </article>
        ))}
      </div>

      {zoomedProject?.image && (
        <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={zoomedProject.imageAlt ?? zoomedProject.title} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setZoomedProject(null);
        }}>
          <div className="image-lightbox-panel">
            <button ref={closeButtonRef} className="image-lightbox-close" type="button" onClick={() => setZoomedProject(null)} aria-label="Close enlarged image">
              <X size={20} aria-hidden="true" />
            </button>
            <img src={zoomedProject.image} alt={zoomedProject.imageAlt ?? zoomedProject.title} />
          </div>
        </div>
      )}
    </>
  );
}
