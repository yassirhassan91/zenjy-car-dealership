import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Twitter, Facebook, Instagram, ShieldCheck, CreditCard } from 'lucide-react';
import ZenjyLogo from './ZenjyLogo';
import { ContactInfo } from '../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  setSelectedVehicleId: (id: string | null) => void;
}

export default function Footer({ setActiveTab, setSelectedVehicleId }: FooterProps) {
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    address: '500 Luxury Boulevard, Suite A, Premium District, NY 10013',
    phone: '+1 (500) ZEN-CARS',
    phoneRaw: '+15009362277',
    email: 'contact@zenjy.com',
    whatsapp: '15009362277',
    hoursMonFri: '24 Hours / Always Open',
    hoursSat: '24 Hours / Always Open',
    hoursSun: '24 Hours / Always Open',
    hoursNote: 'Showroom, Support & Direct delivery dispatches occur 24/7/365.'
  });

  useEffect(() => {
    fetch('/api/contact')
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setContactInfo(data);
        }
      })
      .catch((err) => console.error('Error fetching footer context:', err));
  }, []);

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
              <Clock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-400">Weekly Business Schedule</p>
                <p className="text-xs text-slate-400">Weekdays: {contactInfo.hoursMonFri}</p>
                <p className="text-xs text-slate-400">Saturday: {contactInfo.hoursSat}</p>
                <p className="text-xs text-slate-400">Sunday: {contactInfo.hoursSun}</p>
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
                {contactInfo.address}
              </p>
            </div>
            <div className="flex gap-2.5 items-center">
              <Phone className="w-4 h-4 text-blue-500 shrink-0" />
              <a href={`tel:${contactInfo.phoneRaw}`} className="hover:text-white transition-colors text-slate-300">
                {contactInfo.phone}
              </a>
            </div>
            <div className="flex gap-2.5 items-center">
              <Mail className="w-4 h-4 text-blue-500 shrink-0" />
              <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition-colors text-slate-300">
                {contactInfo.email}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
        <p>© 2026 ZENJY MOTORS DEALERSHIP. ALL RIGHTS RESERVED. {contactInfo.hoursNote}</p>
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
