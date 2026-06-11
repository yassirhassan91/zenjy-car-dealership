import React from 'react';
import { Mail, Phone, MapPin, Clock, Twitter, Facebook, Instagram, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';
import ZenjyLogo from './ZenjyLogo';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedVehicleId: (id: string | null) => void;
}

export default function Footer({ setActiveTab, setSelectedVehicleId }: FooterProps) {
  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setSelectedVehicleId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="app-footer" className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand identity */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => handleNav('home')}>
            <ZenjyLogo className="w-12 h-12 text-white" dark={true} />
            <div>
              <h3 className="font-heading font-black text-lg text-white tracking-widest leading-none">
                ZENJY <span className="text-[#f15a24] font-bold text-xs">MOTORS</span>
              </h3>
              <p className="text-[9px] text-slate-400 font-mono uppercase tracking-widest">DEALERSHIP</p>
            </div>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            Curating and delivering the world's finest premium vehicles. Our focus is absolute dynamic efficiency, flawless quality checks, and custom structured finance solutions.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-400 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-500 transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-pink-400 transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Navigation Quicklinks */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-bold text-white text-sm tracking-widest uppercase">Quick Links</h4>
          <ul className="flex flex-col gap-2.5 text-sm">
            <li>
              <button onClick={() => handleNav('home')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                Search Premium Vehicles
              </button>
            </li>

            <li>
              <button onClick={() => handleNav('contact')} className="hover:text-blue-400 transition-colors cursor-pointer text-left">
                Direct Sales Office Inquiries
              </button>
            </li>
          </ul>
        </div>

        {/* Operating Hours */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-bold text-white text-sm tracking-widest uppercase">Operating Hours</h4>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex gap-2.5 items-start">
              <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="font-bold text-emerald-400">Always Open (24 / 7)</p>
                <p className="text-xs text-slate-400">Showroom, Online Fleet Consultation, & Deliveries 24 Hours / 365 Days</p>
              </div>
            </div>
            <div className="flex gap-2.5 items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <p className="text-xs text-slate-400">Fully Licensed Dealer Network</p>
            </div>
          </div>
        </div>

        {/* Connect Details */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-bold text-white text-sm tracking-widest uppercase">Direct Contact</h4>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex gap-2.5 items-start">
              <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[13px] leading-relaxed">
                500 Luxury Boulevard, Suite A, Premium District, NY 10013
              </p>
            </div>
            <div className="flex gap-2.5 items-center">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <a href="tel:+15009362277" className="hover:text-white transition-colors text-slate-300">
                +1 (500) ZEN-CARS
              </a>
            </div>
            <div className="flex gap-2.5 items-center">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <a href="mailto:contact@zenjy.com" className="hover:text-white transition-colors text-slate-300">
                contact@zenjy.com
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>© 2026 ZENJY MOTORS DEALERSHIP. All rights reserved. Built using premium Full-Stack React technology.</p>
        <div className="flex items-center gap-6">
          <p className="text-slate-500 flex items-center gap-1">
            <CreditCard className="w-3.5 h-3.5" /> Secured SSL Transactions
          </p>
          <button onClick={() => handleNav('contact')} className="hover:text-blue-400">Privacy Policy</button>
          <button onClick={() => handleNav('contact')} className="hover:text-blue-400">Terms of Sale</button>
        </div>
      </div>
    </footer>
  );
}
