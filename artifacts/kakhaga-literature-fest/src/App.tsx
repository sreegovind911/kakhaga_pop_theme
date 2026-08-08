import { type FormEvent, type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, CircleArrowUp, ExternalLink, Instagram, Mail, MapPin, Menu, MessageCircle, Play, Plus, Send, Ticket, X } from 'lucide-react';
import posterImage from '@assets/INDIE_1786201107738.png';
import logoImage from '@assets/image_copy_1786202217330.png';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type ModalType = 'ticket' | 'register' | 'stall' | 'publishing' | 'member' | 'contact' | null;

const navItems = [
  ['about', 'The fest'], ['program', 'Program'], ['speakers', 'Voices'], ['fair', 'Book fair'], ['membership', 'Belong'], ['gallery', 'Field notes'],
];

const speakers = [
  { name: 'K. R. Meera', role: 'Writer · Kochi', tone: 'pink', mark: 'KM', note: 'The shape of a sentence after the rain.' },
  { name: 'S. Hareesh', role: 'Writer · Kuttanad', tone: 'yellow', mark: 'SH', note: 'Myths travel further when we read them aloud.' },
  { name: 'Anita Nair', role: 'Author · Mumbai', tone: 'blue', mark: 'AN', note: 'A room of one’s own, with a window to the coast.' },
  { name: 'M. Mukundan', role: 'Writer · Mayyazhi', tone: 'coral', mark: 'MM', note: 'Every city keeps a secret in its margins.' },
];

const schedule = [
  { time: '09:30', title: 'Doors open: chai, zines & a slow morning', speaker: 'Courtyard', stage: 'PANDAL', color: 'yellow' },
  { time: '10:30', title: 'The village is a library', speaker: 'K. R. Meera · S. Hareesh', stage: 'PANDAL', color: 'pink' },
  { time: '12:00', title: 'Listening to the backwaters', speaker: 'A live oral history walk', stage: 'KAYAL', color: 'blue' },
  { time: '14:00', title: 'How to print a small book', speaker: 'Workshop with Paper Moon Press', stage: 'KADAL', color: 'yellow' },
  { time: '16:00', title: 'Letters that refuse to sit still', speaker: 'Anita Nair · M. Mukundan', stage: 'PANDAL', color: 'pink' },
  { time: '18:30', title: 'The night remembers: a reading', speaker: 'Collective reading & music', stage: 'KAYAL', color: 'blue' },
  { time: '20:00', title: 'Afterwords / after-rain', speaker: 'DJs, poets, whoever stayed', stage: 'KADAL', color: 'coral' },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function ActionButton({ children, onClick, variant = 'primary', testId }: { children: ReactNode; onClick: () => void; variant?: 'primary' | 'secondary' | 'ink'; testId: string }) {
  return <button data-testid={testId} className={`button-${variant}`} onClick={onClick}>{children}</button>;
}

function Modal({ type, close }: { type: ModalType; close: () => void }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState('');
  const labels: Record<Exclude<ModalType, null>, { title: string; desc: string; submit: string }> = {
    ticket: { title: 'Keep a seat for yourself.', desc: 'One day. Three stages. More stories than you can carry home.', submit: 'Reserve my ticket' },
    register: { title: 'Put your name on the wall.', desc: 'Register for updates, volunteer calls, and the first word when the programme lands.', submit: 'Register for Kakhaga' },
    stall: { title: 'Bring your books to the coast.', desc: 'Applications are open for small presses, independent booksellers and printmakers.', submit: 'Request a stall' },
    publishing: { title: 'Let the small book travel.', desc: 'Tell us about your press and the worlds you are putting into print.', submit: 'Start an application' },
    member: { title: 'Join the circle.', desc: 'Founders, readers and annual members keep this unruly little festival alive.', submit: 'Choose membership' },
    contact: { title: 'Leave a note.', desc: 'The festival desk reads everything. We reply from Alappuzha.', submit: 'Send message' },
  };
  if (!type) return null;
  const content = labels[type];
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true); };
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && close()}>
    <div className="modal-panel" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="flex items-start justify-between border-b border-[rgba(39,35,65,.2)] p-5 md:p-7">
        <div><p className="eyebrow">Kakhaga / 2027</p><h2 id="modal-title" className="font-display mt-2 text-4xl leading-none">{sent ? 'You are on the list.' : content.title}</h2></div>
        <button data-testid="button-close-modal" aria-label="Close dialog" className="rounded-full p-2 hover:bg-[var(--blue)]" onClick={close}><X size={21} /></button>
      </div>
      {sent ? <div className="p-7 md:p-10">
        <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[var(--yellow)]"><Check size={27} /></div>
        <p className="max-w-sm text-lg">Thank you{name ? `, ${name}` : ''}. We have your note. Look for a confirmation in your inbox soon.</p>
        <button data-testid="button-done-modal" className="button-ink mt-7" onClick={close}>Back to the festival <ArrowUpRight size={17} /></button>
      </div> : <form onSubmit={handleSubmit} className="space-y-5 p-5 md:p-7">
        <p className="text-[15px] leading-relaxed text-[var(--muted-foreground)]">{content.desc}</p>
        <label className="block"><span className="mb-2 block text-sm font-bold">Your name</span><input data-testid="input-name" className="form-input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Write it as it appears on your book" /></label>
        <label className="block"><span className="mb-2 block text-sm font-bold">Email address</span><input data-testid="input-email" className="form-input" required type="email" placeholder="you@somewhere.in" /></label>
        {type === 'ticket' && <label className="block"><span className="mb-2 block text-sm font-bold">Pass</span><select data-testid="select-pass" className="form-input" defaultValue="day"><option value="day">Day pass · ₹450</option><option value="weekend">Weekend pass · ₹850</option><option value="student">Student pass · ₹250</option></select></label>}
        {(type === 'contact' || type === 'publishing') && <label className="block"><span className="mb-2 block text-sm font-bold">{type === 'contact' ? 'Your note' : 'Tell us about your press'}</span><textarea data-testid="input-message" className="form-input min-h-28" required placeholder="A few good lines..." /></label>}
        <button data-testid="button-submit-modal" className="button-primary w-full" type="submit">{content.submit} <Send size={16} /></button>
      </form>}
    </div>
  </div>;
}

function Nav({ openModal }: { openModal: (type: ModalType) => void }) {
  const [open, setOpen] = useState(false);
  return <header className="masthead sticky top-0 z-40">
    <div className="mx-auto flex max-w-[1280px] items-center justify-between px-4 py-3 md:px-7">
      <button data-testid="button-logo" onClick={() => scrollToId('top')} className="flex items-center gap-3 text-left">
        <img src={logoImage} alt="Kakhaga logo" className="h-11 w-11 rounded-full object-cover mix-blend-multiply" />
        <span className="hidden font-display text-xl leading-none sm:block">Kakhaga<br /><i className="font-normal">Literature Fest</i></span>
      </button>
      <nav className={`${open ? 'flex' : 'hidden'} absolute left-0 right-0 top-full flex-col gap-5 border-b border-[rgba(39,35,65,.2)] bg-[var(--cream)] px-5 py-5 md:static md:flex md:flex-row md:items-center md:border-0 md:bg-transparent md:p-0`} aria-label="Main navigation">
        {navItems.map(([id, label]) => <button data-testid={`link-${id}`} key={id} className="nav-link text-left text-sm font-bold" onClick={() => { scrollToId(id); setOpen(false); }}>{label}</button>)}
      </nav>
      <div className="flex items-center gap-2">
        <ActionButton testId="button-nav-ticket" onClick={() => openModal('ticket')} variant="primary"><Ticket size={16} /> <span className="hidden sm:inline">Book a ticket</span><span className="sm:hidden">Tickets</span></ActionButton>
        <button data-testid="button-mobile-menu" className="grid h-11 w-11 place-items-center border border-[var(--ink)] md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu"><Menu size={19} /></button>
      </div>
    </div>
  </header>;
}

function Home() {
  const [modal, setModal] = useState<ModalType>(null);
  const openModal = (type: ModalType) => setModal(type);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setModal(null); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  return <div id="top" className="festival-app">
    <Nav openModal={openModal} />
    <main>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-grid" />
        <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 pb-28 pt-16 md:grid-cols-[1.15fr_.85fr] md:px-10 md:pb-36 md:pt-24">
          <div className="relative z-10">
            <p className="eyebrow reveal reveal-delay-1 !text-[var(--blue)]">Alappuzha, Kerala · 07—09 February 2027</p>
            <h1 id="hero-title" className="font-display reveal mt-5 max-w-4xl text-[clamp(4.2rem,12vw,10.8rem)] leading-[.78] tracking-[-.07em]">Kakhaga<br /><span className="outline-text">Literature</span><br /><span className="text-[var(--yellow)]">Fest.</span></h1>
            <p className="reveal reveal-delay-1 mt-8 max-w-md text-lg leading-relaxed text-[var(--cream)]/75">A spirited gathering of Malayalam letters, coastal journeys, oral storytelling and the independent books that keep us curious.</p>
            <div className="reveal reveal-delay-2 mt-8 flex flex-wrap gap-3"><ActionButton testId="button-hero-ticket" onClick={() => openModal('ticket')}>Come for the stories <ArrowDownRight size={17} /></ActionButton><ActionButton testId="button-hero-program" onClick={() => scrollToId('program')} variant="secondary">See the programme</ActionButton></div>
          </div>
          <div className="poster-stack reveal reveal-delay-2" aria-label="Festival poster artwork">
            <span className="poster-tape" />
            <img src={posterImage} alt="Indie festival poster collage" className="poster-shadow border-4 border-[var(--cream)]" />
            <div className="absolute bottom-8 left-5 z-10 max-w-[220px] -rotate-6 bg-[var(--blue)] p-4 text-[var(--ink)] shadow-[6px_6px_0_var(--yellow)]"><p className="font-mono-custom text-[10px] uppercase leading-relaxed">A festival for<br />the underlined,<br />dog-eared &<br />passed-around.</p></div>
            <img src={logoImage} alt="Kakhaga mark" className="!bottom-4 !right-2 !top-auto !w-24 !rotate-12 rounded-full border-4 border-[var(--cream)] object-cover" />
          </div>
        </div>
      </section>
      <div className="marquee" aria-label="Festival announcement"><div className="marquee-track">{[...Array(2)].flatMap((_, i) => ['Letters in the rain', 'Kadal · Kayal · Pandal', 'Read something aloud', 'Small books, big weather', '07—09 February 2027'].map((x, j) => <span className="marquee-item" key={`${i}-${j}`}>{x} <span aria-hidden="true">/</span></span>))}</div></div>

      <section id="about" className="section-shell grid gap-10 md:grid-cols-[.9fr_1.1fr] md:items-end">
        <div><p className="eyebrow">01 / The invitation</p><h2 className="section-title mt-5 max-w-lg">Come as you are.<br /><span className="text-[var(--pink)]">Leave with a story.</span></h2></div>
        <div className="max-w-xl space-y-5 text-lg leading-relaxed text-[var(--muted-foreground)]"><p>Kakhaga is a three-day literary gathering in the old waterways of Alappuzha. Not a conference. Not a book launch marathon. A place to wander into a conversation, hear a poem from the next room, and find a book that feels like it was waiting for you.</p><p>We bring Malayalam’s deep, generous literary culture into an unruly conversation with translators, publishers, performers, illustrators and readers from everywhere.</p><button data-testid="button-about-read" className="group flex items-center gap-2 font-mono-custom text-xs uppercase tracking-[.12em] text-[var(--pink)]" onClick={() => scrollToId('committee')}>Meet the people behind it <ChevronRight className="transition-transform group-hover:translate-x-1" size={17} /></button></div>
      </section>

      <section id="committee" className="bg-[var(--pink)] text-[var(--cream)]">
        <div className="section-shell grid gap-10 md:grid-cols-[.72fr_1.28fr]">
          <div><p className="eyebrow !text-[var(--yellow)]">02 / The people</p><h2 className="section-title mt-5">Made by<br /><i>many hands.</i></h2><p className="mt-7 max-w-xs leading-relaxed text-[var(--cream)]/80">A festival is a temporary city. Ours is built by readers, neighbours, printers, cooks, boat people and believers.</p></div>
          <div className="grid gap-0 border-t border-[var(--cream)]/35 sm:grid-cols-2">{[['Asha Menon', 'Festival director'], ['Nikhil K. P.', 'Programme & partnerships'], ['Sreedevi Ravi', 'Malayalam curation'], ['Firoz M. Shakir', 'Design & visual identity'], ['Rohit Varma', 'Production & access'], ['You', 'Volunteer / future friend']].map(([name, role], i) => <div key={name} className="group border-b border-[var(--cream)]/35 py-5 pr-6"><span className="font-mono-custom text-xs text-[var(--yellow)]">0{i + 1}</span><h3 className="mt-3 font-display text-2xl">{name}</h3><p className="text-sm text-[var(--cream)]/65">{role}</p></div>)}</div>
        </div>
      </section>

      <section id="speakers" className="section-shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">03 / Voices</p><h2 className="section-title mt-5">People worth<br /><span className="text-[var(--pink)]">leaning in for.</span></h2></div><p className="max-w-xs text-sm leading-relaxed text-[var(--muted-foreground)]">Writers, translators, artists and listeners. More names are arriving by boat.</p></div>
        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">{speakers.map((speaker, i) => <article data-testid={`card-speaker-${i}`} key={speaker.name} className={`group ${speaker.tone}-card relative min-h-[330px] overflow-hidden border border-[var(--ink)] p-5 transition-transform hover:-translate-y-2`}><div className="flex items-start justify-between"><span className="font-mono-custom text-xs">0{i + 1}</span><ArrowUpRight className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" size={18} /></div><div className="absolute left-5 top-[85px] grid h-24 w-24 -rotate-6 place-items-center rounded-full border-2 border-[var(--ink)] bg-[var(--cream)] font-display text-3xl">{speaker.mark}</div><div className="absolute bottom-5 left-5 right-5"><p className="mb-2 font-mono-custom text-[10px] uppercase tracking-[.12em] opacity-70">{speaker.role}</p><h3 className="font-display text-3xl leading-none">{speaker.name}</h3><p className="mt-3 text-sm leading-snug opacity-75">{speaker.note}</p></div></article>)}</div>
      </section>

      <section id="program" className="bg-[var(--ink)] text-[var(--cream)]">
        <div className="section-shell">
          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="eyebrow !text-[var(--blue)]">04 / The day</p><h2 className="section-title mt-5">A day with<br /><span className="text-[var(--yellow)]">three currents.</span></h2></div><div className="flex gap-2 text-xs font-bold"><span className="bg-[var(--pink)] px-3 py-2">PANDAL</span><span className="bg-[var(--blue)] px-3 py-2 text-[var(--ink)]">KAYAL</span><span className="bg-[var(--yellow)] px-3 py-2 text-[var(--ink)]">KADAL</span></div></div>
          <div className="mt-14">{schedule.map((item, i) => <article data-testid={`row-schedule-${i}`} key={item.time} className="schedule-row group transition-colors hover:bg-[var(--cream)]/5"><time className="font-mono-custom text-sm text-[var(--yellow)]">{item.time}</time><div><h3 className="font-display text-2xl leading-tight group-hover:text-[var(--yellow)] md:text-3xl">{item.title}</h3><p className="mt-2 text-sm text-[var(--cream)]/55">{item.speaker}</p></div><span className={`stage h-fit justify-self-end px-3 py-1 font-mono-custom text-[10px] font-bold text-[var(--ink)] ${item.color === 'pink' ? 'bg-[var(--pink)] text-[var(--cream)]' : item.color === 'blue' ? 'bg-[var(--blue)]' : item.color === 'coral' ? 'bg-[var(--coral)]' : 'bg-[var(--yellow)]'}`}>{item.stage}</span></article>)}</div>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4"><p className="font-mono-custom text-xs uppercase tracking-[.1em] text-[var(--cream)]/50">Full programme drops December 2026</p><ActionButton testId="button-program-register" onClick={() => openModal('register')} variant="secondary">Get the first word <Mail size={16} /></ActionButton></div>
        </div>
      </section>

      <section id="fair" className="section-shell grid gap-12 md:grid-cols-[1fr_1.05fr] md:items-center">
        <div className="relative rotate-[-2deg] bg-[var(--yellow)] p-5 shadow-[10px_10px_0_var(--pink)]"><img src={posterImage} alt="Indie poster collage artwork" className="w-full mix-blend-multiply" /><p className="mt-4 font-mono-custom text-[10px] uppercase tracking-[.12em]">Field note / Book fair poster wall</p></div>
        <div><p className="eyebrow">05 / The book fair</p><h2 className="section-title mt-5">Small presses.<br /><span className="text-[var(--pink)]">Big weather.</span></h2><p className="mt-7 max-w-lg text-lg leading-relaxed text-[var(--muted-foreground)]">Come find handmade books, Malayalam classics, wild translations, risograph prints and the kind of zine you cannot explain to your group chat.</p><div className="mt-8 flex flex-wrap gap-3"><ActionButton testId="button-publishing" onClick={() => openModal('publishing')} variant="ink">Register a press <Plus size={17} /></ActionButton><ActionButton testId="button-stall" onClick={() => openModal('stall')} variant="secondary">Book a stall <ArrowUpRight size={17} /></ActionButton></div></div>
      </section>

      <section id="membership" className="border-y border-[rgba(39,35,65,.2)] bg-[var(--blue)]">
        <div className="section-shell">
          <div className="grid gap-8 md:grid-cols-[.9fr_1.1fr]"><div><p className="eyebrow">06 / Belong</p><h2 className="section-title mt-5">Keep the<br /><span className="text-[var(--pink)]">pages moving.</span></h2><p className="mt-7 max-w-sm leading-relaxed text-[var(--ink)]/70">Membership is an invitation to stay close: early access, a small annual parcel of good things, and a hand in shaping what comes next.</p><button data-testid="button-membership-details" className="mt-8 flex items-center gap-2 font-mono-custom text-xs uppercase" onClick={() => openModal('member')}>Membership desk <ArrowDownRight size={16} /></button></div><div className="grid gap-3 sm:grid-cols-3"><div className="paper-card p-5"><p className="font-mono-custom text-xs text-[var(--pink)]">01 / FRIEND</p><h3 className="mt-12 font-display text-3xl">₹750</h3><p className="mt-3 text-sm">For the curious reader.</p></div><div className="pink-card p-5"><p className="font-mono-custom text-xs text-[var(--yellow)]">02 / FOUNDER</p><h3 className="mt-12 font-display text-3xl">₹5,000</h3><p className="mt-3 text-sm text-[var(--cream)]/75">For the ones who make room.</p></div><div className="yellow-card p-5"><p className="font-mono-custom text-xs">03 / ANNUAL</p><h3 className="mt-12 font-display text-3xl">₹1,800</h3><p className="mt-3 text-sm">For a year of stories.</p></div></div></div>
        </div>
      </section>

      <section id="gallery" className="section-shell">
        <div className="flex items-end justify-between gap-5"><div><p className="eyebrow">07 / Field notes</p><h2 className="section-title mt-5">Before the<br /><span className="text-[var(--pink)]">first word.</span></h2></div><a data-testid="link-instagram" href="https://instagram.com" target="_blank" rel="noreferrer" className="button-ink hidden sm:inline-flex"><Instagram size={17} /> Follow the trail</a></div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">{[['boat', 'A boat to the venue', 'linear-gradient(145deg,#7bcde2 20%,#272341 21% 45%,#e61f72 46% 66%,#f8cb36 67%)'], ['wall', 'Posters after rain', 'linear-gradient(35deg,#e61f72,#f8cb36 48%,#7bcde2 49%)'], ['ink', 'Ink on a thumb', 'linear-gradient(135deg,#272341 30%,#f27b61 31% 57%,#f4edcf 58%)'], ['page', 'The page turns', 'linear-gradient(25deg,#f8cb36 10%,#f4edcf 11% 39%,#7bcde2 40% 68%,#e61f72 69%)']].map(([id, label, gradient], i) => <div data-testid={`tile-gallery-${id}`} key={id} className={`photo-tile ${i === 1 ? 'md:mt-12' : i === 2 ? 'md:-mt-8' : ''}`} style={{ background: gradient }}><span>{label}</span></div>)}</div>
      </section>

      <section id="media" className="bg-[var(--yellow)]">
        <div className="section-shell grid gap-10 md:grid-cols-[1fr_.8fr] md:items-center"><div><p className="eyebrow">08 / Media room</p><h2 className="section-title mt-5">Hear what<br /><span className="text-[var(--pink)]">is coming.</span></h2><p className="mt-6 max-w-md leading-relaxed">Press notes, downloadable marks, last year’s conversations and the Kakhaga radio hour. For stories about stories, write to our media desk.</p><button data-testid="button-media-kit" className="button-ink mt-7" onClick={() => openModal('contact')}>Ask for the media kit <ExternalLink size={16} /></button></div><div className="ink-card p-6 md:p-8"><div className="flex items-center justify-between border-b border-[var(--cream)]/25 pb-5"><span className="font-mono-custom text-xs text-[var(--blue)]">KAKHAGA RADIO / 001</span><Play size={19} /></div><h3 className="font-display mt-7 text-4xl">Why do we<br /><i>gather?</i></h3><div className="mt-7 flex items-center gap-4"><button data-testid="button-play-radio" className="grid h-12 w-12 place-items-center rounded-full bg-[var(--pink)]" onClick={() => alert('The radio hour will be available in December 2026.')}><Play size={19} fill="currentColor" /></button><span className="text-sm text-[var(--cream)]/65">12 min · conversation with the organisers</span></div></div></div>
      </section>

      <section id="sponsors" className="section-shell">
        <div className="grid gap-10 md:grid-cols-[.75fr_1.25fr]"><div><p className="eyebrow">09 / In good company</p><h2 className="section-title mt-5">Made possible<br /><span className="text-[var(--pink)]">together.</span></h2></div><div><p className="max-w-xl text-lg leading-relaxed text-[var(--muted-foreground)]">Kakhaga is independent by design. Our friends in print, food, travel, books and culture help us keep tickets generous and the gates open.</p><div className="mt-9 grid grid-cols-2 border-l border-t border-[var(--ink)]/20 sm:grid-cols-4">{['Paper Moon', 'Azhimukham', 'Kochi Design Week', 'The Reading Room', 'Muziris Project', 'Good Earth', 'Open Library', 'Your name here'].map((name) => <div key={name} className="flex min-h-24 items-center border-b border-r border-[var(--ink)]/20 p-4 font-display text-xl">{name}</div>)}</div><button data-testid="button-sponsor" className="mt-6 flex items-center gap-2 font-mono-custom text-xs uppercase text-[var(--pink)]" onClick={() => openModal('contact')}>Become a festival friend <ArrowUpRight size={16} /></button></div></div>
      </section>

      <section id="ssro" className="bg-[var(--coral)]">
        <div className="section-shell grid gap-10 md:grid-cols-[1.15fr_.85fr] md:items-center"><div><p className="eyebrow">10 / Open proposal</p><h2 className="section-title mt-5">Stories belong<br /><span className="text-[var(--cream)]">everywhere.</span></h2><p className="mt-7 max-w-lg text-lg leading-relaxed text-[var(--ink)]/75">The SSRO proposal invites libraries, schools, resident groups and community spaces to host a Kakhaga conversation of their own. A reading under a tree counts.</p><button data-testid="button-ssro" className="button-ink mt-8" onClick={() => openModal('contact')}>Read the SSRO proposal <ExternalLink size={16} /></button></div><div className="rotate-3 border-2 border-[var(--ink)] bg-[var(--cream)] p-6 shadow-[8px_8px_0_var(--ink)]"><p className="font-mono-custom text-xs uppercase">Proposal / 2027</p><p className="font-display mt-12 text-5xl leading-[.9]">A room,<br />a reader,<br /><span className="text-[var(--pink)]">a beginning.</span></p><div className="mt-14 border-t border-[var(--ink)]/20 pt-4 text-sm">Download brief · 3 pages</div></div></div>
      </section>

      <section id="contact" className="bg-[var(--ink)] text-[var(--cream)]">
        <div className="section-shell grid gap-12 md:grid-cols-[1fr_1fr]">
          <div><p className="eyebrow !text-[var(--blue)]">11 / Find us</p><h2 className="section-title mt-5">See you<br /><span className="text-[var(--yellow)]">by the water.</span></h2><div className="mt-10 space-y-5 text-sm"><a data-testid="link-email" href="mailto:hello@kakhaga.in" className="flex items-center gap-3 hover:text-[var(--yellow)]"><Mail size={18} /> hello@kakhaga.in</a><a data-testid="link-whatsapp" href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-[var(--yellow)]"><MessageCircle size={18} /> WhatsApp the festival desk</a><p className="flex items-start gap-3"><MapPin className="mt-1" size={18} /> Old Boat Jetty, Alappuzha<br />Kerala 688001, India</p></div><div className="mt-10 flex flex-wrap gap-3"><ActionButton testId="button-contact" onClick={() => openModal('contact')} variant="secondary">Write to us <Send size={16} /></ActionButton><ActionButton testId="button-footer-ticket" onClick={() => openModal('ticket')} variant="primary">Book a ticket <Ticket size={16} /></ActionButton></div></div>
          <div className="relative min-h-[340px] overflow-hidden border border-[var(--cream)]/25 bg-[var(--blue)]"><div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(39,35,65,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(39,35,65,.22) 1px, transparent 1px)', backgroundSize: '36px 36px' }} /><div className="absolute left-[14%] top-[18%] h-36 w-52 -rotate-6 border-2 border-[var(--ink)] bg-[var(--yellow)] p-5 shadow-[8px_8px_0_var(--pink)]"><p className="font-mono-custom text-[10px] uppercase">You are here</p><p className="font-display mt-5 text-3xl leading-none">Alappuzha<br /><i>backwaters</i></p></div><div className="absolute bottom-9 right-9 h-20 w-20 rounded-full border-2 border-[var(--ink)] bg-[var(--pink)]" /><span className="absolute bottom-5 left-5 font-mono-custom text-[10px] uppercase text-[var(--ink)]">9°29' N · 76°20' E</span></div>
        </div>
      </section>
    </main>
    <footer className="bg-[var(--ink)] px-5 pb-8 text-[var(--cream)] md:px-10"><div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-5 border-t border-[var(--cream)]/20 pt-6 text-xs md:flex-row"><span className="font-display text-xl">Kakhaga / 2027</span><span className="font-mono-custom text-[10px] uppercase text-[var(--cream)]/55">A literature festival from Kerala, with love.</span><button data-testid="button-back-top" onClick={() => scrollToId('top')} className="flex items-center gap-2 self-start hover:text-[var(--yellow)] md:self-auto">Back to top <CircleArrowUp size={16} /></button></div></footer>
    <Modal type={modal} close={() => setModal(null)} />
  </div>;
}

function Router() {
  return <ErrorBoundary resetKey={useLocation()[0]}><Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;