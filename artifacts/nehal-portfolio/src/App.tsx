import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  Camera,
  ChevronDown,
  CircleDot,
  Code2,
  Download,
  ExternalLink,
  Github,
  GraduationCap,
  Menu,
  Network,
  Sparkles,
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
};

const certificates: Certificate[] = [
  {
    name: 'ServiceNow CSA',
    issuer: 'ServiceNow',
    short: 'CSA',
    description: 'Certified System Administrator credential covering the ServiceNow platform, configuration, and workflow foundations.',
    seal: 'PLATFORM\nFOUNDATIONS',
  },
  {
    name: 'ServiceNow CAD',
    issuer: 'ServiceNow',
    short: 'CAD',
    description: 'Certified Application Developer credential — a marker of continued learning across application design and development.',
    seal: 'APP\nBUILDER',
  },
  {
    name: 'Cloud Computing Foundations',
    issuer: 'Google Cloud',
    short: 'GCP',
    description: 'Google Cloud learning credential focused on the fundamentals behind modern cloud computing and infrastructure.',
    seal: 'CLOUD\nORBIT',
  },
  {
    name: 'NPTEL Winter Internship',
    issuer: 'IIT Roorkee',
    short: 'NPTEL',
    description: 'Certificate for research-based content work exploring augmented reality and artificial intelligence across domains.',
    seal: 'RESEARCH\nNOTES',
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
        <h2 id="resume-title">The resume is available.</h2>
        <p>Nehal keeps the detailed academic and project record in a current resume. It can be shared directly when you are hiring, collaborating, or simply curious about the work behind this page.</p>
        <button className="button button-primary" onClick={onClose} data-testid="button-close-resume-cta">Got it <ArrowUpRight size={15} /></button>
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
        <p className="section-kicker">Credential gallery preview · no verification link published</p>
      </div>
    </div>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState<{ kind: 'resume' } | { kind: 'certificate'; certificate: Certificate } | null>(null);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  const jumpTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="site-shell">
      <header className="site-nav">
        <a href="#top" className="brand" data-testid="link-home">
          <span className="brand-mark">N</span>
          <span className="brand-name">Nehal Goyal</span>
        </a>
        <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
          <a href="#about" onClick={() => setMenuOpen(false)} data-testid="link-about">About</a>
          <a href="#journey" onClick={() => setMenuOpen(false)} data-testid="link-journey">Journey</a>
          <a href="#work" onClick={() => setMenuOpen(false)} data-testid="link-work">Work</a>
          <a href="#credentials" onClick={() => setMenuOpen(false)} data-testid="link-credentials">Credentials</a>
        </nav>
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
            <h1 data-testid="text-hero-heading">Curious mind.<br /><span>AI ahead.</span></h1>
            <p className="hero-lede">I’m Nehal — a Python-first computer science student at JECRC University, building a sharper understanding of how intelligent systems can meet the real world.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => jumpTo('work')} data-testid="button-explore-work">Explore the work <ArrowDownRight size={17} /></button>
              <button className="button button-ghost" onClick={() => setModal({ kind: 'resume' })} data-testid="button-hero-resume">View resume note <Download size={16} /></button>
            </div>
            <div className="hero-note"><CircleDot size={14} />Still learning, still shipping. The best work usually starts as a question worth staying with.</div>
          </ScrollReveal>
          <ScrollReveal delay="delay-2">
            <div className="hero-art" aria-label="Abstract portrait of Nehal's creative and technical point of view">
              <div className="orbit" />
              <div className="scribble">build / observe / repeat</div>
              <div className="art-card">
                <div className="art-label">Field notes · 2025</div>
                <div className="art-letters">NG</div>
                <div className="art-foot">AI engineer in progress</div>
              </div>
            </div>
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
          <ScrollReveal><SectionHeading kicker="01 / Point of view" title="More signal. Less noise." intro="The goal is not to know everything. It is to stay attentive enough to find the right next thing to learn." /></ScrollReveal>
          <div className="about-grid">
            <ScrollReveal delay="delay-1">
              <p className="about-copy">I like work that sits at the edge of <em>logic and imagination</em> — where a clean system, a thoughtful question, and a little persistence turn into something useful.</p>
              <p className="about-copy" style={{ fontSize: '1rem', lineHeight: 1.6, marginTop: '2rem', color: 'hsl(var(--muted-foreground))' }}>Alongside code, I keep an eye out for frames worth capturing. Photography has taught me to notice detail, context, and the story hiding in plain sight.</p>
            </ScrollReveal>
            <ScrollReveal delay="delay-2">
              <div className="strengths" data-testid="list-strengths">
                {['Attention to detail', 'Adaptability', 'Teamwork', 'Problem solving'].map((strength, index) => (
                  <div className="strength" key={strength} data-testid={`text-strength-${index}`}><span>0{index + 1}</span>{strength}<ArrowUpRight size={15} /></div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section dark-section" id="journey">
        <div className="section-inner">
          <ScrollReveal><SectionHeading kicker="02 / The long game" title="Research, then make it real." intro="A few chapters that have shaped the way Nehal learns: by going deep, sharing the room, and building for people." /></ScrollReveal>
          <div className="story-grid">
            <ScrollReveal delay="delay-1">
              <article className="story-card large" data-testid="card-nptel-internship">
                <div className="story-meta"><span>NPTEL Winter Internship</span><span>Research chapter</span></div>
                <h3>Augmented reality meets AI across domains.</h3>
                <p>Selected for the NPTEL Winter Internship at IIT Roorkee under Prof. Rashmi Gaur. The assignment: develop research-based content that looks at how augmented reality and artificial intelligence can move between disciplines.</p>
                <div className="story-shape" />
              </article>
            </ScrollReveal>
            <div className="small-stack">
              <ScrollReveal delay="delay-2">
                <article className="story-card small" data-testid="card-servicenow-training">
                  <div className="story-meta"><span>ServiceNow</span><span>Share the room</span></div>
                  <h3>Make the platform feel possible.</h3>
                  <p>Part of a training program held for 120 students to help them work toward ServiceNow certifications worth $200.</p>
                  <Users className="story-icon" size={27} />
                </article>
              </ScrollReveal>
              <ScrollReveal delay="delay-3">
                <article className="story-card" data-testid="card-learning">
                  <div className="story-meta"><span>Now building</span><span>Chapter 03</span></div>
                  <h3>Curiosity is a technical skill.</h3>
                  <p>Python is the strongest thread right now, with C++, cloud, ServiceNow, and new questions constantly joining the toolkit.</p>
                  <BrainCircuit className="story-icon" size={27} />
                </article>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="work">
        <div className="section-inner">
          <ScrollReveal><SectionHeading kicker="03 / Selected build" title="Money, but make it visible." intro="A final-year academic project with a practical brief: make everyday expenses easier to understand before they become a surprise." /></ScrollReveal>
          <ScrollReveal delay="delay-1">
            <article className="project-feature" data-testid="card-master-project">
              <div className="project-info">
                <div>
                  <div className="project-num">Project 01 · academic build</div>
                  <h3>Master₹</h3>
                  <p>An expense tracker designed to help users manage spending with monthly summaries and useful alerts — a small system with a very human job.</p>
                </div>
                <div>
                  <div className="tech-list" aria-label="Project technology stack">
                    {['HTML', 'CSS', 'JavaScript', 'Python Flask', 'SQLite'].map((tech) => <span className="tech-tag" key={tech}>{tech}</span>)}
                  </div>
                  <button className="button button-ghost" style={{ marginTop: '1.5rem', color: 'inherit', borderColor: 'rgba(244,239,230,.5)' }} onClick={() => jumpTo('credentials')} data-testid="button-see-more-work">More of the toolkit <ArrowUpRight size={15} /></button>
                </div>
              </div>
              <div className="project-visual" aria-label="Illustrated Master₹ expense dashboard">
                <div className="dashboard">
                  <div className="dashboard-top"><span>MASTER₹ / MONTHLY VIEW</span><span className="dashboard-dots"><i /><i /><i /></span></div>
                  <div className="dash-total"><small>THIS MONTH</small>₹ 18,420</div>
                  <div className="bars"><i style={{ height: '48%' }} /><i style={{ height: '72%' }} /><i style={{ height: '38%' }} /><i style={{ height: '89%' }} /><i style={{ height: '60%' }} /><i style={{ height: '78%' }} /></div>
                  <div className="dash-alert">ALERT<br />spending pattern noticed</div>
                </div>
              </div>
            </article>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" id="credentials">
        <div className="section-inner">
          <ScrollReveal><SectionHeading kicker="04 / Proof of practice" title="Credentials, with character." intro="A gallery of milestones — designed as visual reminders of what each learning loop opened up next." /></ScrollReveal>
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
          <ScrollReveal><SectionHeading kicker="05 / Beyond the screen" title="Build with people in mind." intro="The most valuable projects are not always the ones with a repository. Community is also a place to practice." /></ScrollReveal>
          <div className="initiative-grid">
            <ScrollReveal delay="delay-1">
              <article className="initiative" data-testid="card-zarurat">
                <div><div className="section-kicker">University initiative</div><h3>Zarurat</h3><p>Contributing to an initiative focused on teaching underprivileged students — a reminder that access can be the most important feature.</p></div>
                <GraduationCap className="initiative-icon" size={38} strokeWidth={1.5} />
              </article>
            </ScrollReveal>
            <ScrollReveal delay="delay-2">
              <article className="initiative" data-testid="card-makerspace">
                <div><div className="section-kicker" style={{ color: 'inherit' }}>University club</div><h3>Makerspace</h3><p>Part of a hardware and software club where ideas are allowed to get tactile, messy, and a little more real.</p></div>
                <Wrench className="initiative-icon" size={38} strokeWidth={1.5} />
              </article>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="skill-band" aria-label="Current toolkit">
        <div className="skill-band-inner">
          <strong>Current toolkit</strong>
          <div className="skill-pills">
            {[
              { label: 'Python', icon: Code2 }, { label: 'C++', icon: Code2 }, { label: 'GitHub', icon: Github },
              { label: 'VS Code', icon: Wrench }, { label: 'ServiceNow', icon: Network }, { label: 'Google Cloud', icon: Sparkles },
            ].map(({ label, icon: Icon }) => <span className="skill-pill" key={label}><Icon size={12} /> {label}</span>)}
          </div>
        </div>
      </section>

      <footer className="footer" id="contact">
        <div className="footer-inner">
          <ScrollReveal>
            <div className="section-kicker">06 / Keep in touch</div>
            <h2>Let’s build the <span>next question.</span></h2>
            <p className="footer-sub">For opportunities, conversations, and thoughtful problems worth exploring, Nehal is open to connecting.</p>
            <button className="button button-primary" onClick={() => setModal({ kind: 'resume' })} style={{ marginTop: '1.7rem' }} data-testid="button-footer-resume">Resume is available <Download size={15} /></button>
          </ScrollReveal>
          <div className="footer-row"><span>Nehal Goyal · aspiring AI engineer</span><span><Camera size={13} style={{ verticalAlign: 'middle', marginRight: '.35rem' }} /> made with attention to detail</span><a href="#top" data-testid="link-back-to-top">Back to top <ChevronDown size={12} style={{ transform: 'rotate(180deg)', verticalAlign: 'middle' }} /></a></div>
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