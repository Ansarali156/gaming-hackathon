import { TRACK_CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ParticleBackground } from "@/components/ui/ParticleBackground";
import Link from "next/link";
import { Swords, Shapes, Car, Castle, Crosshair, Moon, Calculator, Music, Paintbrush, ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return TRACK_CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

const iconList = [Swords, Shapes, Car, Castle, Crosshair, Moon, Calculator, Music, Paintbrush];

export default function TrackPage({ params }: { params: { slug: string } }) {
  const categoryIndex = TRACK_CATEGORIES.findIndex((c) => c.slug === params.slug);
  
  if (categoryIndex === -1) {
    notFound();
  }

  const category = TRACK_CATEGORIES[categoryIndex];

  return (
    <main className="min-h-screen flex flex-col bg-background text-text font-sans relative selection:bg-primary/30 selection:text-white">
      <ParticleBackground />
      <Header />

      <div className="flex-1 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pt-32 pb-24 relative z-10 w-full">
        
        <Link href="/#tracks" className="inline-flex items-center text-text-muted hover:text-primary transition-colors mb-8">
          <ArrowLeft className="mr-2" size={20} /> Back to Tracks
        </Link>

        <div className="text-center mb-16 border-b border-white/10 pb-12">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
            {category.category}
          </h1>
          <p className="text-text-muted text-lg md:text-xl max-w-3xl mx-auto mb-8">
            {category.description}
          </p>
          <Link href="/register" className="btn-primary btn-glow inline-flex">
            Register for this Track
          </Link>
        </div>

        {params.slug === "track-01" && <Track1Grid category={category} categoryIndex={categoryIndex} />}
        {params.slug === "track-02" && <Track2Content />}
        {params.slug === "track-03" && <Track3Content />}
      </div>

      <Footer />
    </main>
  );
}

function Track1Grid({ category, categoryIndex }: { category: any, categoryIndex: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {category.tracks.map((track: any, i: number) => {
        const Icon = iconList[i] || iconList[0];
        return (
          <div key={track.id} className="glass-card p-6 card-hover group flex flex-col">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Icon className="text-primary" size={28} />
            </div>
            <h4 className="font-display text-xl font-bold text-text mb-3">{track.title}</h4>
            <p className="text-text-muted text-sm leading-relaxed mb-6 flex-grow">{track.description}</p>
            
            {track.elements && track.elements.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto border-t border-white/5 pt-4">
                {track.elements.map((el: string) => (
                  <span key={el} className="text-[10px] px-2 py-1 bg-white/5 border border-white/10 rounded-full text-text-dim">
                    {el}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Track2Content() {
  return (
    <div className="space-y-12">
      <div className="glass-card p-8 md:p-10">
        <h2 className="text-2xl font-display font-bold text-primary mb-4">Overview</h2>
        <p className="text-text-muted leading-relaxed">
          Track 02 is built for participants who think in systems, markets, and growth loops. This is not a coding track — it is a strategic intelligence track. Participants use AI tools to analyze real business opportunities, design go-to-market strategies, and build growth plans that are investor-ready and execution-focused.
        </p>
        <p className="text-text-muted leading-relaxed mt-4">
          If you are an MBA student, a product management enthusiast, a startup strategist, or someone who understands that AI is not just a technical tool but a business superpower — Track 02 is your arena.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8">
          <h2 className="text-xl font-display font-bold text-neon-blue mb-4">Who Should Participate</h2>
          <ul className="space-y-3 text-text-muted text-sm">
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> MBA students and business school participants</li>
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> Product managers, aspiring PMs, and product enthusiasts</li>
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> Strategy and consulting track students</li>
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> Startup founders or co-founders with a growth problem to solve</li>
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> Anyone who can connect AI capabilities to real business outcomes</li>
          </ul>
        </div>
        
        <div className="glass-card p-8">
          <h2 className="text-xl font-display font-bold text-neon-green mb-4">What You Will Build</h2>
          <p className="text-sm text-text-muted mb-4">An AI-assisted business strategy or growth plan containing:</p>
          <ul className="space-y-3 text-text-muted text-sm">
            <li className="flex items-start"><span className="text-neon-green font-bold mr-2">01.</span> A well-defined business idea with a clear value proposition</li>
            <li className="flex items-start"><span className="text-neon-green font-bold mr-2">02.</span> An AI-powered market analysis (competitors, size, trends)</li>
            <li className="flex items-start"><span className="text-neon-green font-bold mr-2">03.</span> A go-to-market strategy or product growth roadmap</li>
            <li className="flex items-start"><span className="text-neon-green font-bold mr-2">04.</span> A revenue model or monetization framework</li>
            <li className="flex items-start"><span className="text-neon-green font-bold mr-2">05.</span> A strategic pitch deck — concise, data-backed, investor-ready</li>
          </ul>
        </div>
      </div>

      <div className="glass-card p-8">
        <h2 className="text-2xl font-display font-bold text-primary mb-6">Judging Criteria</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Strategic Clarity</h4>
            <p className="text-xs text-text-muted">Is the business problem clearly defined? Is the solution logical and well-scoped?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">AI Integration</h4>
            <p className="text-xs text-text-muted">How meaningfully is AI used in analysis, research, strategy, or execution?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Market Viability</h4>
            <p className="text-xs text-text-muted">Does the growth plan reflect real understanding of market dynamics and customer needs?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Revenue Model</h4>
            <p className="text-xs text-text-muted">Is there a credible path to monetization? Are the assumptions reasonable?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Pitch Quality</h4>
            <p className="text-xs text-text-muted">Is the delivery clear, confident, and compelling? Does the story flow logically?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Innovation</h4>
            <p className="text-xs text-text-muted">Does the idea bring a fresh angle, unique insight, or creative approach?</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 border-l-4 border-l-primary">
        <h2 className="text-2xl font-display font-bold text-primary mb-6">Key Insights for Success</h2>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-text mb-1">Use AI as Your Research Engine</h4>
            <p className="text-sm text-text-muted">Tools like Claude, ChatGPT, and Gemini can compress weeks of market research into hours. Use them to map competitor landscapes, identify market gaps, and stress-test assumptions.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-text mb-1">Lead with the Problem, Not the Solution</h4>
            <p className="text-sm text-text-muted">Judges need to feel the weight of the problem first. Establish who is affected, how severely, and why existing solutions fall short. A well-articulated problem makes your solution look inevitable.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-text mb-1">Every Claim Needs a Number</h4>
            <p className="text-sm text-text-muted">Vague strategies lose credibility fast. Back every key point with data. Even rough, reasoned estimates signal strategic thinking.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-text mb-1">Build a Revenue Model That Makes Sense</h4>
            <p className="text-sm text-text-muted">Your monetization plan should be simple, defensible, and tied to real behavior. Explain who pays, how much, how often, and why they would.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-text mb-1">Keep Your Pitch Deck Under 8 Slides</h4>
            <p className="text-sm text-text-muted">Clarity wins over volume. Each slide should carry one clear idea. If you cannot explain a slide in under 30 seconds, it needs to be simplified or removed.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Track3Content() {
  return (
    <div className="space-y-12">
      <div className="glass-card p-8 md:p-10">
        <h2 className="text-2xl font-display font-bold text-primary mb-4">Overview</h2>
        <p className="text-text-muted leading-relaxed">
          Track 03 is the most accessible and open track in the IncuX AI Hackathon. There is no domain restriction, no technical requirement, and no experience barrier. All you need is one solid idea and the ability to pitch it simply and confidently.
        </p>
        <p className="text-text-muted leading-relaxed mt-4">
          Great ideas don't care about your major, your year, or whether you have ever attended a hackathon. If you have spotted a real problem and imagined an AI-powered solution — this is your stage to own it.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 glass-card p-8">
          <h2 className="text-xl font-display font-bold text-neon-blue mb-4">Who Should Participate</h2>
          <ul className="space-y-3 text-text-muted text-sm">
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> First-timers at hackathons</li>
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> Non-technical students with strong communication</li>
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> Students from any branch, any year, any background</li>
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> Solo participants or small teams</li>
            <li className="flex items-start"><Crosshair className="mr-2 text-neon-blue shrink-0" size={16} /> Anyone with a real problem they genuinely want to solve using AI</li>
          </ul>
        </div>
        
        <div className="md:col-span-2 glass-card p-8">
          <h2 className="text-xl font-display font-bold text-neon-green mb-4">What You Will Submit (8-Slide Deck)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-white/5 rounded border border-white/5">
              <span className="text-neon-green font-bold text-xs">Slide 01</span>
              <h4 className="font-bold text-text text-sm mb-1">Title</h4>
              <p className="text-xs text-text-muted">Idea name and punchy one-liner.</p>
            </div>
            <div className="p-3 bg-white/5 rounded border border-white/5">
              <span className="text-neon-green font-bold text-xs">Slide 02</span>
              <h4 className="font-bold text-text text-sm mb-1">The Problem</h4>
              <p className="text-xs text-text-muted">What pain point exists? Who faces it?</p>
            </div>
            <div className="p-3 bg-white/5 rounded border border-white/5">
              <span className="text-neon-green font-bold text-xs">Slide 03</span>
              <h4 className="font-bold text-text text-sm mb-1">The Solution</h4>
              <p className="text-xs text-text-muted">How does AI fix the problem?</p>
            </div>
            <div className="p-3 bg-white/5 rounded border border-white/5">
              <span className="text-neon-green font-bold text-xs">Slide 04</span>
              <h4 className="font-bold text-text text-sm mb-1">Who It's For</h4>
              <p className="text-xs text-text-muted">Describe target user clearly.</p>
            </div>
            <div className="p-3 bg-white/5 rounded border border-white/5">
              <span className="text-neon-green font-bold text-xs">Slide 05</span>
              <h4 className="font-bold text-text text-sm mb-1">How It Works</h4>
              <p className="text-xs text-text-muted">A simple flow or concept walkthrough.</p>
            </div>
            <div className="p-3 bg-white/5 rounded border border-white/5">
              <span className="text-neon-green font-bold text-xs">Slide 06</span>
              <h4 className="font-bold text-text text-sm mb-1">Why AI?</h4>
              <p className="text-xs text-text-muted">What does AI uniquely enable here?</p>
            </div>
            <div className="p-3 bg-white/5 rounded border border-white/5">
              <span className="text-neon-green font-bold text-xs">Slide 07</span>
              <h4 className="font-bold text-text text-sm mb-1">Why Now?</h4>
              <p className="text-xs text-text-muted">Market shift, new tech, timing?</p>
            </div>
            <div className="p-3 bg-white/5 rounded border border-white/5">
              <span className="text-neon-green font-bold text-xs">Slide 08</span>
              <h4 className="font-bold text-text text-sm mb-1">The Ask</h4>
              <p className="text-xs text-text-muted">Mentorship, funding, or team needed?</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <h2 className="text-2xl font-display font-bold text-primary mb-6">Judging Criteria</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Idea Strength</h4>
            <p className="text-xs text-text-muted">Is problem real? Solution useful?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">AI Relevance</h4>
            <p className="text-xs text-text-muted">Logical and meaningful role for AI?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Pitch Clarity</h4>
            <p className="text-xs text-text-muted">Clean, focused, easy to follow?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Originality</h4>
            <p className="text-xs text-text-muted">Fresh angle to an old problem?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Delivery</h4>
            <p className="text-xs text-text-muted">Confident, clear communication?</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg border border-white/5">
            <h4 className="font-bold text-text mb-1">Impact Potential</h4>
            <p className="text-xs text-text-muted">Measurable impact for real people?</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-8 border-l-4 border-l-primary">
        <h2 className="text-2xl font-display font-bold text-primary mb-6">Key Insights for Success</h2>
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-bold text-text mb-1">Pick a Problem You Personally Understand</h4>
            <p className="text-sm text-text-muted">The strongest pitches come from personal experience. Authenticity beats online research.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-text mb-1">Simplicity Is a Feature, Not a Limitation</h4>
            <p className="text-sm text-text-muted">Track 03 rewards clarity. A simple idea explained brilliantly beats a complex idea explained poorly. Ensure a judge understands within 60 seconds.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-text mb-1">Make AI a Core Part of Your Solution</h4>
            <p className="text-sm text-text-muted">Be specific: does it personalize, predict, automate, analyze, or generate? Vague mentions will cost you points.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-text mb-1">Your Pitch Delivery Is Half the Score</h4>
            <p className="text-sm text-text-muted">A good idea delivered badly loses to a decent idea delivered confidently. Practice out loud and time yourself.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-text mb-1">End with Something Memorable</h4>
            <p className="text-sm text-text-muted">Close with conviction. The last 20 seconds are what judges carry into deliberations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
