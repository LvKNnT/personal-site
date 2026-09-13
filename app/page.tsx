import { ArrowUpRight, Mail } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import aboutContent from '../content/about.md?raw';

const timeline = [
  { year: '2024 - 2028', text: 'Student at VNUHCM - University of Science' },
  { year: '2021 - 2024', text: 'Student at High School for the Gifted, VNU-HCM' },
];

export default function ProfilePage() {
  return (
    <main className="page-shell">
      <div className="section-frame">
        <section className="profile-card">
        <div className="profile-heading">
          <div>
            <h1>Lâm Vĩnh Khang</h1>
            <p className="handle">@LvK_NnT</p>
          </div>
            <img
              className="avatar"
              src="/avatar.jpg"
              alt="Lâm Vĩnh Khang"
            />
          </div>

        <p className="profile-bio">
          Sometimes LvK. Sometimes NnT. 
        </p>

        <p className="profile-meta">Ho Chi Minh City · Open to collaborations</p>

        <div className="profile-links" aria-label="Social links">
          <a href="https://github.com/LvKNnT"><span className="link-monogram">GH</span> GitHub</a>
          <a href="https://www.linkedin.com/in/lvknntuwu/"><span className="link-monogram">IN</span> LinkedIn</a>
          <a href="mailto:khanglamtat@gmail.com"><Mail size={18} /> Email</a>
          <a href="mailto:lvkhang2430@apcs.fitus.edu.vn"><Mail size={18} /> Student Email</a>
        </div>
        </section>

        <section className="content-section">
          <div className="section-label"><h2>About</h2></div>
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{aboutContent}</ReactMarkdown>
          </div>
        </section>

        <div className="cover-section">
          <div className="profile-cover">
            <img src="/cover.jpg" alt="Kaboom cover" />
          </div>
        </div>

        <section className="content-section">
          <div className="section-label"><h2>Timeline</h2></div>
          <div className="timeline">
            {timeline.map((item) => (
              <div className="timeline-item" key={item.year}>
                <time>{item.year}</time><p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section">
          <div className="section-label"><h2>Elsewhere</h2></div>
          <div className="link-rows">
            <a href="/work"><span>Selected work</span><ArrowUpRight size={18} /></a>
            <a href="/posts"><span>Notes and writing</span><ArrowUpRight size={18} /></a>
          </div>
        </section>
      </div>
    </main>
  );
}
