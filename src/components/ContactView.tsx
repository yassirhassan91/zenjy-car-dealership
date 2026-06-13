import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, CheckCircle, Smartphone } from 'lucide-react';
import { ContactInfo } from '../types';

export default function ContactView() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userMessage, setUserMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
      .catch((err) => console.error('Error loading dynamic contact layout:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail || !userMessage) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: userName,
          email: userEmail,
          phone: userPhone,
          message: userMessage
        })
      });
      const data = await res.json();
      if (!data.error) {
        setSubmitSuccess(true);
        setUserName('');
        setUserEmail('');
        setUserPhone('');
        setUserMessage('');
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="contact-view-container" className="py-16 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn text-slate-200">
      {/* Intro section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="font-heading font-extrabold text-3xl md:text-5xl text-white tracking-tight leading-none uppercase">
          Motors Direct Inbox
        </h2>
        <p className="text-slate-400 text-sm mt-3">
          Have an inquiry regarding specific custom luxury trims, regional warranties or low-interest loan periods? Connect instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto">
        {/* Left Column: Direct contact info & Hours card */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Info Card */}
          <div className="bg-slate-900 border border-slate-850 rounded-3xl p-8 text-white relative">
            <h3 className="font-heading font-extrabold text-lg mb-6 tracking-wide text-white uppercase">Direct Channels</h3>
            
            <div className="flex flex-col gap-6 text-xs text-slate-300">
              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-blue-600/15 border border-blue-500/20 text-blue-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-100 uppercase tracking-wider text-[10px]">ADDRESS</p>
                  <p className="mt-1 leading-relaxed text-sm">{contactInfo.address}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-indigo-600/15 border border-indigo-500/20 text-indigo-400">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-100 uppercase tracking-wider text-[10px]">Sales Telephone Line</p>
                  <p className="mt-1 leading-relaxed text-sm text-slate-200">
                    <a href={`tel:${contactInfo.phoneRaw}`} className="hover:text-blue-400 transition-colors">
                      {contactInfo.phone}
                    </a>
                  </p>
                  <p className="text-slate-500 text-[10px] mt-0.5">International/Regional wires options</p>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="p-2.5 rounded-lg bg-emerald-600/15 border border-emerald-500/20 text-emerald-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-100 uppercase tracking-wider text-[10px]">Advisory Email Inbox</p>
                  <p className="mt-1 leading-relaxed text-sm text-slate-200">
                    <a href={`mailto:${contactInfo.email}`} className="hover:text-blue-400 transition-colors">
                      {contactInfo.email}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-none text-white">
            <h3 className="font-heading font-extrabold text-base mb-4 uppercase text-white">Office Operating Hours</h3>
            <div className="flex flex-col gap-3 text-xs text-slate-300">
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="font-bold text-slate-200">Monday - Friday</span>
                <span className="text-emerald-400 font-bold">{contactInfo.hoursMonFri}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="font-bold text-slate-200">Saturday</span>
                <span className="text-emerald-400 font-bold">{contactInfo.hoursSat}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800">
                <span className="font-bold text-slate-200">Sunday</span>
                <span className="text-emerald-400 font-bold">{contactInfo.hoursSun}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-2">
                <Clock className="w-3.5 h-3.5 text-emerald-500" /> {contactInfo.hoursNote}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-none text-white">
          <h3 className="font-heading font-extrabold text-lg text-white mb-1 uppercase tracking-wide">Submit Inquiry</h3>
          <p className="text-xs text-slate-400 mb-6">Our standard client-care responding time limit is strictly under **two hours**.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4.5 text-xs text-slate-300">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Your Name</label>
              <input
                id="contact-name-input"
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="E.g. Alexander Sterling"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Email Address</label>
                <input
                  id="contact-email-input"
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="contact@yourdom.com"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Mobile Phone (Optional)</label>
                <input
                  id="contact-phone-input"
                  type="tel"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Message / Trim details request</label>
              <textarea
                id="contact-message-input"
                required
                rows={5}
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="State your pricing request, trim certifications questions or finance approval inquires..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-2">
              <a
                href={`https://wa.me/${contactInfo.whatsapp}?text=Hello%20Zenjy%20Motors.%20I'd%20love%20to%20chat%20live%25`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 bg-emerald-600/15 border border-emerald-500/20 px-4 py-2 rounded-xl"
              >
                <Smartphone className="w-4 h-4 text-emerald-400 animate-bounce" /> WhatsApp Quick Chat
              </a>

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={submitting}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer text-xs"
              >
                {submitting ? 'Transmitting...' : 'Send Inquiry Message'}
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {submitSuccess && (
              <div className="flex gap-2 items-center bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 mt-3 text-emerald-400 font-medium">
                <CheckCircle className="w-5 h-5 shrink-0" />
                <p>✓ Inquiry transmitted successfully! We've logged your query parameters safely.</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
