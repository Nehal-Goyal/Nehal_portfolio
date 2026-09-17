import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  ChevronDown,
  CircleDot,
  Code2,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Mail,
  Menu,
  Moon,
  Network,
  Sparkles,
  Sun,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Certificate = {
  name: string;
  issuer: string;
  short: string;
  description: string;
  seal: string;
  url?: string;
};

const certificates: Certificate[] = [
  {
  name: 'ServiceNow CSA',
  issuer: 'ServiceNow',
  short: 'CSA',
  description: 'Certified System Administrator credential covering the ServiceNow platform, configuration, and workflow administrations.',
  seal: 'PLATFORM\nFOUNDATIONS',
  url: 'https://bit.ly/ServiceNowCSACertificate',
},
  {
    name: 'ServiceNow CAD',
    issuer: 'ServiceNow',
    short: 'CAD',
    description: 'Certified Application Developer credential — focused on application development, scripting, workflows, and application design on ServiceNow.',
    seal: 'APP\nBUILDER',
    url: 'https://bit.ly/ServiceNowCADCertificate' ,
  },
  {
    name: 'Cloud Computing Foundations',
    issuer: 'Google Cloud',
    short: 'GCP',
    description: 'Google Cloud learning credential focused on the fundamentals behind modern cloud computing and infrastructure.',
    seal: 'CLOUD\nORBIT',
    url: 'https://bit.ly/linkgooglefoundationcertificate',
  },
  {
    name: 'NPTEL Winter Internship',
    issuer: 'IIT Roorkee',
    short: 'NPTEL',
    description: 'Certificate for research-based content work exploring augmented reality and artificial intelligence across domains.',
    seal: 'RESEARCH\nNOTES',
    url: 'https://bit.ly/NPTELInternshipcertificate',
  },
];

function ScrollReveal({ children, className = '', delay = '' }: { children: ReactNode; className?: string; delay?: string }) {
  const [visible, setVisible] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const current = revealRef.current;
    if (!current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(current);
    return () => observer.disconnect();
  }, []);

  return <div ref={revealRef} className={`reveal reveal-hook ${visible ? 'visible' : ''} ${delay} ${className}`}>{children}</div>;
}

function SectionHeading({ kicker, title, intro }: { kicker: string; title: string; intro: string }) {
  return (
    <div className="section-heading">
      <div className="section-kicker">{kicker}</div>
      <div>
        <h2 className="section-title" data-testid={`text-section-${kicker.toLowerCase().replaceAll(' ', '-')}`}>{title}</h2>
        <p className="section-intro">{intro}</p>
      </div>
    </div>
  );
}

function ResumeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="resume-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close resume information" data-testid="button-close-resume"><X size={16} /></button>
        <div className="modal-seal">RESUME<br />READY</div>
        <div className="section-kicker">A small note</div>
        <h2 id="resume-title">Resume</h2>
        <p>For a detailed view of Nehal’s education, experience, projects, and certifications, get in touch by email.</p>
        <a
  className="button button-primary"
  href={`${import.meta.env.BASE_URL}Nehal-Goyal-Resume.pdf`}
  target="_blank"
  rel="noreferrer"
  onClick={onClose}
  data-testid="link-request-resume"
>
  View resume <Download size={15} />
</a>
      </div>
    </div>
  );
}

function CertificateModal({ certificate, onClose }: { certificate: Certificate; onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="certificate-title" onClick={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close certificate details" data-testid="button-close-certificate"><X size={16} /></button>
        <div className="modal-seal">{certificate.seal.split('\n').map((line) => <span key={line}>{line}<br /></span>)}</div>
        <div className="section-kicker">{certificate.issuer}</div>
        <h2 id="certificate-title">{certificate.name}</h2>
        <p>{certificate.description}</p>
        {certificate.url && (
          <a className="button button-primary" href={certificate.url} target="_blank" rel="noreferrer">
            Verify certificate <ExternalLink size={15} />
          </a>
        )}
      </div>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<{ kind: 'resume' } | { kind: 'certificate'; certificate: Certificate } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (
    window.localStorage.getItem('nehal-theme') === 'dark' ? 'dark' : 'light'
  ));

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('nehal-theme', theme);
  }, [theme]);

  const jumpTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className={`site-shell ${theme === 'dark' ? 'dark-theme' : ''}`}>
      <header className="site-nav">
        <a href="#top" className="brand" data-testid="link-home">
          <span className="brand-mark">N</span>
          <span className="brand-name">Nehal Goyal</span>
        </a>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
          <a href="#about" onClick={() => setMenuOpen(false)} data-testid="link-about">About</a>
          <a href="#soft-skills" onClick={() => setMenuOpen(false)} data-testid="link-soft-skills">Soft skills</a>
          <a href="#journey" onClick={() => setMenuOpen(false)} data-testid="link-experience">Experience</a>
          <a href="#work" onClick={() => setMenuOpen(false)} data-testid="link-projects">Projects</a>
          <a href="#credentials" onClick={() => setMenuOpen(false)} data-testid="link-certificates">Certificates</a>
          <a href="#contact" onClick={() => setMenuOpen(false)} data-testid="link-contact">Contact</a>
        </nav>
        <button className="theme-toggle" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`} data-testid="button-theme-toggle">
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>
        <button className="nav-resume" onClick={() => setModal({ kind: 'resume' })} data-testid="button-open-resume">
          Resume <Download size={14} />
        </button>
        <button className="menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} data-testid="button-menu">
          {menuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-grid">
          <ScrollReveal>
            <div className="eyebrow">Final-year CS student · Jaipur, India</div>
            <h1 data-testid="text-hero-heading">Nehal <span>Goyal.</span></h1>
            <p className="hero-lede">Aspiring AI Engineer, building a sharper understanding of how intelligent systems can meet the real world.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => jumpTo('work')} data-testid="button-explore-work">Explore the work <ArrowDownRight size={17} /></button>
              <button className="button button-ghost" onClick={() => setModal({ kind: 'resume' })} data-testid="button-hero-resume">Resume <Download size={16} /></button>
            </div>
            <div className="hero-note"><CircleDot size={14} />The goal is not to know everything. It is to stay attentive enough to find the right next thing to learn.</div>
          </ScrollReveal>
        </div>
        <div className="scroll-cue"><span /> Scroll to see the thinking</div>
      </section>

      <div className="ticker" aria-label="Areas of interest">
        <div className="ticker-track">
          {['Python', 'Artificial intelligence', 'Research', 'Problem solving', 'Photography', 'Learning in public', 'Python', 'Artificial intelligence', 'Research', 'Problem solving', 'Photography', 'Learning in public'].map((item, index) => (
            <div className="ticker-item" key={`${item}-${index}`}><b>+</b>{item}</div>
          ))}
        </div>
      </div>

      <section className="section" id="about">
        <div className="section-inner">
          <ScrollReveal><SectionHeading kicker="01 / About" title="About" intro="A short introduction to how I learn and build." /></ScrollReveal>
          <div className="about-grid">
            <ScrollReveal delay="delay-1">
              <p className="about-copy">I like building useful software with clear logic and a focus on people. I am learning how intelligent systems can solve practical problems, one thoughtful step at a time.</p>
              <p className="about-copy" style={{ fontSize: '1rem', lineHeight: 1.6, marginTop: '2rem', color: 'hsl(var(--muted-foreground))' }}>Photography also helps me notice detail, context, and the story in everyday things.</p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section soft-skills-section" id="soft-skills">
        <div className="section-inner">
          <ScrollReveal><SectionHeading kicker="02 / Soft skills" title="Soft skills" intro="The habits I bring into projects, classrooms, and teams." /></ScrollReveal>
          <ScrollReveal delay="delay-1">
            <div className="strengths" data-testid="list-strengths">
              {['Attention to detail', 'Adaptability', 'Teamwork', 'Problem solving', 'Quick learning'].map((strength, index) => (
                <div className="strength" key={strength} data-testid={`text-strength-${index}`}><span>0{index + 1}</span>{strength}<ArrowUpRight size={15} /></div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section dark-section" id="journey">
        <div className="section-inner">
          <ScrollReveal><SectionHeading kicker="03 / Experience" title="Experience" intro="Research, training, and education that continue to shape how I learn." /></ScrollReveal>
          <div className="story-grid">
            <ScrollReveal delay="delay-1">
              <article className="story-card large" data-testid="card-nptel-internship">
                <div className="story-meta"><span>NPTEL Winter Internship</span><span>Research chapter</span></div>
                <h3>Research on AR and AI.</h3>
                <p>Selected for the NPTEL Winter Internship at IIT Roorkee under Prof. Rashmi Gaur. Researched AR and AI applications in healthcare, education, and industrial automation, analyzed 5+ research papers, and presented findings on AI-powered computer vision.</p>
                <div className="story-shape" />
              </article>
            </ScrollReveal>
            <div className="small-stack">
              <ScrollReveal delay="delay-2">
                <article className="story-card small" data-testid="card-servicenow-training">
                  <div className="story-meta"><span>ServiceNow Trainee</span><span>JECRC University</span></div>
                  <h3>ServiceNow training.</h3>
                  <p>Selected as part of a cohort of 120 students. Completed training in platform fundamentals and application development basics.</p>
                  <Users className="story-icon" size={27} />
                </article>
              </ScrollReveal>
              <ScrollReveal delay="delay-3">
                <article className="story-card" data-testid="card-learning">
                  <div className="story-meta"><span>Education</span><span>JECRC University</span></div>
                  <h3>Computer Science and Engineering.</h3>
                  <p>B.Tech in Computer Science and Engineering with a current CGPA of 8.71/10.0. Building a strong foundation in Python, C++, DSA, and OOP.</p>
                  <BrainCircuit className="story-icon" size={27} />
                </article>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="section-inner">
          <ScrollReveal><SectionHeading kicker="04 / Projects" title="Projects" intro="A final-year academic project focused on making everyday expenses easier to understand." /></ScrollReveal>
          <ScrollReveal delay="delay-1">
            <article className="project-feature project-simple" data-testid="card-master-project">
              <div className="project-info">
                <div>
                  <div className="project-num">Project 01 · academic build</div>
                  <h3>Master₹ — Expense Tracker</h3>
                  <p>An expense tracker that helps users record spending, view monthly summaries, and receive useful alerts.</p>
                </div>
              </div>
              <div className="project-details">
                <div className="detail-row"><span>Built with</span><strong>HTML · CSS · JavaScript · Flask · SQLite</strong></div>
                <ol className="project-points">
                  <li>Designed the frontend for income and expense tracking.</li>
                  <li>Built login, dashboard, and monthly summary views.</li>
                  <li>Connected the interface to Flask APIs for dynamic data.</li>
                  <li>Worked in a team of three, owning frontend development and contributing to testing and documentation.</li>
                </ol>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" id="credentials">
        <div className="section-inner">
          <ScrollReveal><SectionHeading kicker="05 / Certificates" title="Certificates" intro="A visual record of the certifications and learning milestones completed so far." /></ScrollReveal>
          <div className="cert-grid">
            {certificates.map((certificate, index) => (
              <ScrollReveal key={certificate.name} delay={`delay-${(index % 3) + 1}`}>
                <article className="cert-card" data-testid={`card-certificate-${index}`}>
                  <div className="cert-top"><span>{certificate.issuer}</span><span>0{index + 1} / 04</span></div>
                  <div className="seal"><div className="seal-text">{certificate.short}<small>{certificate.seal.split('\n')[0]}</small></div></div>
                  <h3>{certificate.name}</h3>
                  <p>{certificate.description}</p>
                  <button className="cert-button" onClick={() => setModal({ kind: 'certificate', certificate })} data-testid={`button-view-certificate-${index}`}>View credential note <ExternalLink size={13} /></button>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="initiatives">
        <div className="section-inner">
          <ScrollReveal><SectionHeading kicker="06 / Activities & initiatives" title="Activities & initiatives" intro="Experiences outside the classroom that have helped me communicate, contribute, and work with others." /></ScrollReveal>
          <div className="initiative-grid">
            <ScrollReveal delay="delay-1">
              <article className="initiative" data-testid="card-zarurat">
                <div><div className="section-kicker">University initiative</div><h3>Zarurat</h3><p>Contributing to an initiative that teaches underprivileged students.</p></div>
                <GraduationCap className="initiative-icon" size={38} strokeWidth={1.5} />
              </article>
            </ScrollReveal>
            <ScrollReveal delay="delay-2">
              <article className="initiative" data-testid="card-makerspace">
                <div><div className="section-kicker" style={{ color: 'inherit' }}>University club</div><h3>Makerspace</h3><p>Part of a hardware and software club focused on learning by building.</p></div>
                <Wrench className="initiative-icon" size={38} strokeWidth={1.5} />
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="skill-band" id="skills" aria-label="Programming skills">
        <div className="skill-band-inner">
          <div>
            <div className="section-kicker">07 / Programming skills</div>
            <strong>Programming skills</strong>
          </div>
          <div>
            <div className="skill-pills">
              {[
                { label: 'Python', icon: Code2 }, { label: 'C++', icon: Code2 }, { label: 'GitHub', icon: Github },
                { label: 'VS Code', icon: Wrench }, { label: 'ServiceNow', icon: Network }, { label: 'Google Cloud', icon: Sparkles },
              ].map(({ label, icon: Icon }) => <span className="skill-pill" key={label}><Icon size={12} /> {label}</span>)}
            </div>
            <p className="learning-note">The goal is not to know everything. It is to stay attentive enough to find the right next thing to learn.</p>
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-inner">
          <ScrollReveal>
            <div className="section-kicker">08 / Contact</div>
            <h2>Contact</h2>
            <p className="footer-sub">For opportunities, conversations, and thoughtful problems worth exploring, Nehal is open to connecting.</p>
            <a className="button button-primary" href="mailto:nehalgoyal890@gmail.com" style={{ marginTop: '1.7rem' }} data-testid="link-footer-email">Email Nehal <Mail size={15} /></a>
          </ScrollReveal>
          <div className="footer-row"><span>Nehal Goyal · aspiring AI engineer</span><span>Jaipur, India</span><a href="#top" data-testid="link-back-to-top">Back to top <ChevronDown size={12} style={{ transform: 'rotate(180deg)', verticalAlign: 'middle' }} /></a></div>
        </div>
      </footer>

      {modal?.kind === 'resume' && <ResumeModal onClose={() => setModal(null)} />}
      {modal?.kind === 'certificate' && <CertificateModal certificate={modal.certificate} onClose={() => setModal(null)} />}
    </main>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
