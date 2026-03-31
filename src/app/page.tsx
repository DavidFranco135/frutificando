import Navbar from '@/components/site/Navbar';
import Hero from '@/components/site/Hero';
import About from '@/components/site/About';
import Schedule from '@/components/site/Schedule';
import Accommodation from '@/components/site/Accommodation';
import Pricing from '@/components/site/Pricing';
import Gallery from '@/components/site/Gallery';
import RegistrationForm from '@/components/site/RegistrationForm';
import WhatsAppButton from '@/components/site/WhatsAppButton';
import { Leaf } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="relative min-h-screen bg-white">
      <Navbar />
      <Hero />
      <About />
      <Schedule />
      <Accommodation />
      <Pricing />
      <Gallery />
      <RegistrationForm />
      <WhatsAppButton />

      <footer className="py-14 bg-brand-700 text-white text-center">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-2 text-xl font-black tracking-tighter mb-3">
            <Leaf className="w-5 h-5 text-accent" />
            FRUTIFICANDO
          </div>
          <p className="text-sm opacity-40">© 2026 Frutificando – Encontro Cristão. Todos os direitos reservados.</p>
          <div className="mt-6">
            <a
              href="/admin"
              className="text-[10px] uppercase tracking-widest font-bold opacity-20 hover:opacity-60 transition-opacity"
            >
              Área Administrativa
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
