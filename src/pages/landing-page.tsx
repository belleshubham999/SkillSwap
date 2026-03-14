import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const items = [
  'AI-powered matching with multi-factor scoring',
  'Founder trust badges and profile credibility',
  'Milestone collaboration and realtime delivery',
  'Community discussions, AMAs, and public portfolios'
];

export default function LandingPage() {
  return (
    <div className="space-y-14 py-6 md:space-y-16 md:py-12">
      <section className="grid gap-8 md:grid-cols-2 md:items-center">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5 text-primary" /> Premium startup collaboration platform
          </div>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Build startup MVPs with the right partners, faster.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-slate-500 dark:text-slate-400">
            SkillSwap matches ambitious developers and founders with intelligence, trust, and execution-first workflows.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/auth">
              <Button>
                Start building <ArrowRight className="ml-2 inline size-4" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button className="bg-slate-700">Explore opportunities</Button>
            </Link>
          </div>
        </motion.div>
        <Card className="space-y-3">
          <h2 className="font-semibold">Why teams switch to SkillSwap</h2>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            {items.map((item) => (
              <li key={item} className="flex gap-2">
                <CheckCircle2 className="mt-0.5 size-4 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Intelligent Discovery', 'Advanced ranking uses skills, experience, availability, and reputation signals.'],
          ['Credibility Layer', 'Trust scores and reviews help developers pick reliable founders and projects.'],
          ['Execution OS', 'Milestones, collaboration boards, and messaging keep every build accountable.']
        ].map(([title, copy]) => (
          <Card key={title}>
            <h3 className="font-semibold">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{copy}</p>
          </Card>
        ))}
      </section>
    </div>
  );
}
