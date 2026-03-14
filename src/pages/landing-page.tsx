import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function LandingPage() {
  return (
    <div className="space-y-16 py-10">
      <section className="grid gap-6 md:grid-cols-2 md:items-center">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold tracking-tight">Build startup MVPs through high-upside collaboration.</h1>
          <p className="mt-4 text-lg text-slate-500">Junior developers and indie founders match on skills, commitment, and outcomes.</p>
          <div className="mt-6 flex gap-3"><Link to="/auth"><Button>Get Started</Button></Link><Link to="/projects"><Button className="bg-slate-700">Explore Projects</Button></Link></div>
        </motion.div>
        <Card className="grid gap-4"><h2 className="font-semibold">How it works</h2><ol className="list-decimal pl-5 text-sm"><li>Founders publish validated MVP projects.</li><li>Developers apply with portfolio links.</li><li>Accepted applications become managed matches.</li></ol></Card>
      </section>
      <section className="grid gap-4 md:grid-cols-3">{['Problem','Solution','Benefits'].map((t)=><Card key={t}><h3 className="font-semibold">{t}</h3><p className="text-sm text-slate-500">Structured collaboration with milestone tracking, agreements, and reviews.</p></Card>)}</section>
      <section className="grid gap-4 md:grid-cols-2"><Card><h3 className="font-semibold">Testimonials</h3><p className="text-sm">“Hired my first dev partner in 4 days and shipped.”</p></Card><Card><h3 className="font-semibold">FAQ</h3><p className="text-sm">Is this paid? Mostly equity/revenue-share + optional stipends.</p></Card></section>
    </div>
  );
}
