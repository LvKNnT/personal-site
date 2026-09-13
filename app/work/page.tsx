import type { Metadata } from 'next';
import { WorkList, type Project } from '../../components/work-list';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Selected projects, experiments, and collaborations.',
};

const projects: Project[] = [
  {
    year: '2026',
    title: 'Cryptography Research',
    type: 'Independent research',
    description: 'Conducted research on cryptography, including lattice-based cryptography, post-quantum cryptography, and cryptanalysis techniques.',
    tags: ['Cryptography', 'Mathematics'],
    href: 'https://github.com/LvKNnT/Cryptography_Learn'
  },
  {
    year: '2026',
    title: 'Cryptanalysis & CTF Practice',
    type: 'Independent work',
    description: 'Developed SageMath/Python attacks and public writeups covering lattice reduction, p-adic methods, elliptic-curve isogenies, hash length extension, polynomial attacks and custom block ciphers.',
    tags: ['Python', 'SageMath', 'Cryptography'],
    href: 'https://github.com/LvKNnT/CTF-Writeup',
    image: '/work/img/HCMUSCTF.jpg',
    imageAlt: 'HCMUSCTF 2026 Finals',
  },
  {
    year: '2026',
    title: 'AI Challenge 2026',
    type: 'Team project',
    description: 'Build front-end components and back-end APIs for a web-based tools for multi-hour video retrieval challenge. Also help extracting ASR and OCR data from the video dataset and building a retrieval system for the challenge.',
    tags: ['Python', 'PyTorch', 'KIS'],
    href: 'https://github.com/KiyoshiKoii/AICHCM-2026-Glitch'
  },
  {
    year: '2026',
    title: 'AI Challenge 2026',
    type: 'Personal project',
    description: 'Simultaneously built my own retrieval system for the challenge using a different approach from the team project, giving the team more options for handling edge cases.',
    tags: ['Python', 'PyTorch', 'SLM', 'KIS'],
    href: 'https://github.com/LvKNnT/AIC-Glitch'
  },
  {
    year: '2026',
    title: 'Campus Space Management System',
    type: 'Team Project',
    description: 'Builds and improves an OpenCode AI agent that reads the business requirement for a Campus Space Management System and generates the full set of database design artifacts - from requirement analysis through SQL query design, and then extends that database with maintenance impact levels, concurrency control, a large generated dataset and an indexing study.',
    tags: ['Microsoft SQL Server (T-SQL)', 'DBMS', 'AI agents'],
    href: 'https://github.com/LvKNnT/CS486-Campus-Space-Management-System'
  },
  {
    year: '2026',
    title: 'Campus Loop',
    type: 'Team Project',
    description: 'CampusLoop is a campus-only marketplace for buying, trading, borrowing, renting, and giving away useful items. It is intentionally simple to run while covering a complete exchange journey.',
    tags: ['Jetpack Compose', 'Android', 'TypeScript'],
    href: 'https://github.com/huytrinhm/CampusLoop'
  },
  {
    year: '2026',
    title: 'The Code Cup',
    type: 'Personal project',
    description: 'A simple and elegant coffee shop ordering app. Built with Native Android and Kotlin.',
    tags: ['Kotlin', 'Android', 'Mobile app'],
    href: 'https://github.com/LvKNnT/CS426-Midterm-TheCodeCup'
  },
  {
    year: '2026',
    title: 'Common Intent Learning',
    type: 'Team Project',
    description: 'Small project to explore common intent in Android apps. Simple apps that having 8 different intents to showcase how useful they are in Android development.',
    tags: ['Kotlin', 'Android', 'Mobile app'],
    href: 'https://github.com/LvKNnT/-CS426-Common-Intent'
  },
  {
    year: '2025-2026',
    title: 'Toward Real-World Discontinuity Supervision for Video Frame Interpolation',
    type: 'Research project',
    description: 'Audited data and benchmark results across Vimeo-90K, DAVIS, GDM and a 187-sequence real-world dataset; helped analyze failure modes and experimental limitations.',
    tags: ['Python', 'PyTorch', 'Computer vision'],
  },
  {
    year: '2025',
    title: 'Advent of Code 2025',
    type: 'Personal project',
    description: 'A collection of my solutions to the Advent of Code 2025 programming puzzles, implemented in C++.',
    tags: ['C++', 'Python', 'Competitive programming'],
    href: 'https://github.com/LvKNnT/AOC/tree/main/2025'
  },
  {
    year: '2025',
    title: 'Hybrid Destination Recommender',
    type: 'Team Project',
    description: 'Built and deployed backend APIs for a conversational place-discovery application, integrating MongoDB/Firebase with intent routing and personalized retrieval.',
    tags: ['Python', 'Machine Learning', 'Recommendation Systems'],
    href: 'https://github.com/layb3r/Hybrid-Destination-Recommender'
  },
  {
    year: '2025',
    title: 'BTD4',
    type: 'Team Project',
    description: 'A tower defense game using Raylib inspired by Bloons Tower Defense Series, a classic strategy game known for its addictive gameplay and progressive difficulty.',
    tags: ['C++', 'Game development', 'Raylib'],
    href: 'https://github.com/LvKNnT/CS202_BTD4',
    image: '/work/img/BTD4.png',
    imageAlt: 'BTD4 game screenshot',
  },
  {
    year: '2025',
    title: 'Temporal Path Computation',
    type: 'Paper implementation and evaluation',
    description: 'Applied competitive-programming techniques to implement and optimize paper algorithms for foremost, reverse-foremost, fastest and shortest temporal paths in C++.',
    tags: ['C++', 'Algorithms', 'Graph theory'],
    href: 'https://github.com/LvKNnT/TemporalPathComputation'
  },
  {
    year: '2025',
    title: 'Data C  helf',
    type: 'Personal project',
    description: 'An interactive desktop application for exploring common data structures and watching their operations step by step. The project is written in C++ and uses raylib for graphics, audio, and input.',
    tags: ['C++', 'Raylib', 'Data structures'],
    href: 'https://github.com/LvKNnT/CS163_Data_Visualizer'
  },
  {
    year: '2024',
    title: 'NEET Chess',
    type: 'Team Project',
    description: '"The project is a personality statement that I need satiating my wibu needs onto a course project" - Pannda6785',
    tags: ['C++', 'Raylib', 'Game development'],
    href: 'https://github.com/Pannda6785/Touhou-BA-Chess',
    image: '/work/img/NEETchess.png',
    imageAlt: 'NEET Chess game screenshot',
  },
  {
    year: 'now',
    title: 'My GitHub lol',
    type: 'Personal GitHub profile',
    description: 'Some little Easter eggs, I guess. Thanks for reading this far - I really appreciate it.',
    tags: ['GitHub'],
    href: 'https://github.com/LvKNnT',
    image: '/avatar.jpg',
    imageAlt: 'My github profile picture',
  } 
];

export default function WorkPage() {
  return (
    <main className="page-shell">
      <div className="section-frame">
        <header className="page-intro">
          <p className="kicker">Work</p>
          <h1>Things I&apos;ve made.</h1>
          <p>A small selection of projects, experiments, and collaborations.</p>
        </header>

        <WorkList projects={projects} />
      </div>
    </main>
  );
}
