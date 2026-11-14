import Link from 'next/link';
import { ArrowUpRight, Blocks, Bot, CheckCircle2, ChevronRight, Clock3, Compass, FileText, MessageCircle, MessagesSquare, ShieldCheck, Sparkles, Users } from 'lucide-react';

export function Header() {
  return <header className="site-header"><Link className="brand" href="/" aria-label="Yinny home"><span className="brand-mark">Y</span><span>yinny<span className="blue">.</span></span></Link><nav><Link href="/#about">About</Link><Link href="/#experience">Experience</Link><Link href="/tools">Tools</Link><Link href="/games">Game stats</Link><Link href="/#communities"><MessagesSquare size={14}/> Discord servers</Link></nav><a className="header-cta" href="mailto:hello@example.com">Get in touch <ArrowUpRight size={15}/></a></header>;
}
export function Footer() { return <footer className="footer"><span>© {new Date().getFullYear()} Yinny. Built with care.</span><a href="https://yinnymodportfolio.carrd.co/" target="_blank" rel="noreferrer">Previous Carrd portfolio <ArrowUpRight size={13}/></a></footer>; }
export function Eyebrow({children}:{children:React.ReactNode}) { return <div className="eyebrow"><span className="eyebrow-dot"/>{children}</div>; }
export function SectionTitle({eyebrow,title,description}:{eyebrow:string,title:string,description?:string}) { return <div className="section-heading"><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2>{description && <p>{description}</p>}</div>; }
export const IconTile = ({children}:{children:React.ReactNode}) => <span className="icon-tile">{children}</span>;
