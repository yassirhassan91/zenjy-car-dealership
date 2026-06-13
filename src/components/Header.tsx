import React from 'react';
import { Heart, User, Sparkles, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { User as UserType, Vehicle } from '../types';
import ZenjyLogo from './ZenjyLogo';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currUser: UserType | null;
  onLogout: () => void;
  wishlistCount: number;
  setSelectedVehicleId: (id: string | null) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currUser,
  onLogout,
  wishlistCount,
  setSelectedVehicleId
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [logoClicks, setLogoClicks] = React.useState(0);
  const clickTimeoutRef = React.useRef<any>(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedVehicleId(null);
    setMobileMenuOpen(false);
  };

  const handleLogoSvgClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextCount = logoClicks + 1;
    setLogoClicks(nextCount);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (nextCount >= 6) {
      setLogoClicks(0);
      handleTabClick('admin');
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setLogoClicks(0);
        handleTabClick('home');
      }, 500);
    }
  };

  return (
    <header id="app-header" className="sticky top-0 z-50 bg-slate-950/80 border-b border-slate-900/85 text-white backdrop-blur-md px-4 md:px-8 py-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          id="brand-logo" 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <ZenjyLogo 
            onClick={handleLogoSvgClick}
            className="w-12 h-12 text-white group-hover:scale-105 transition-transform" 
            dark={true} 
          />
          <div onClick={() => handleTabClick('home')}>
            <h1 className="font-heading font-black text-lg tracking-tight text-white leading-none">
              ZENJY <span className="text-[#f15a24] font-bold text-sm">MOTORS</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">DEALERSHIP</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              id={`nav-item-${item.id}`}
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`font-sans text-sm font-medium tracking-wide transition-colors relative py-1 cursor-pointer ${
                activeTab === item.id 
                  ? 'text-blue-400' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div id="header-actions" className="hidden md:flex items-center gap-5">
          {/* Dashboard route if Admin */}
          {currUser?.role === 'admin' && (
            <button
              id="admin-dashboard-btn"
              onClick={() => handleTabClick('admin')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-blue-400 hover:bg-slate-750 transition-all cursor-pointer`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Admin Portal
            </button>
          )}

          {/* Wishlist link */}
          <button
            id="header-wishlist-btn"
            onClick={() => handleTabClick('wishlist')}
            className={`relative p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer ${
              activeTab === 'wishlist' ? 'text-rose-400' : 'text-slate-300'
            }`}
            title="My Favorites Wishlist"
          >
            <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white animate-pulse">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* User Profile Hook */}
          {currUser ? (
            <div className="flex items-center gap-3">
              <button
                id="header-profile-btn"
                onClick={() => handleTabClick('account')}
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border border-slate-600 text-blue-400 font-bold uppercase text-xs">
                  {currUser.name.slice(0, 2)}
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-slate-200 truncate max-w-[100px]">{currUser.name}</p>
                  <p className="text-[10px] text-slate-400 capitalize">{currUser.role}</p>
                </div>
              </button>
              <button
                id="header-logout-btn"
                onClick={onLogout}
                className="p-1.5 min-w-[32px] rounded-lg hover:bg-red-950/40 hover:text-red-400 text-slate-400 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="header-login-btn"
              onClick={() => handleTabClick('account')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-medium tracking-wide transition-all shadow-md shadow-blue-950/20 cursor-pointer"
            >
              <User className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => handleTabClick('wishlist')}
            className="p-2 relative rounded-lg text-slate-300"
          >
            <Heart className={`w-5 h-5 ${activeTab === 'wishlist' ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </button>
          <button
            id="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div id="mobile-nav" className="md:hidden mt-4 pt-4 border-t border-slate-800 flex flex-col gap-3 animate-fadeIn">
          {navItems.map((item) => (
            <button
              id={`mobile-nav-item-${item.id}`}
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-950/35 text-blue-400' 
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {currUser?.role === 'admin' && (
            <button
              onClick={() => handleTabClick('admin')}
              className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-blue-400 hover:bg-slate-800"
            >
              Admin Dashboard
            </button>
          )}

          <div className="border-t border-slate-800 my-2 pt-2">
            {currUser ? (
              <div className="flex items-center justify-between px-3">
                <button
                  onClick={() => handleTabClick('account')}
                  className="flex items-center gap-2 text-left"
                >
                  <div className="h-8 w-8 rounded-full bg-slate-705 flex items-center justify-center text-blue-400 font-bold text-xs uppercase border border-slate-650">
                    {currUser.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{currUser.name}</p>
                    <p className="text-xs text-slate-400">{currUser.email}</p>
                  </div>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-lg bg-red-950/30 text-red-400"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabClick('account')}
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-blue-600 text-sm font-semibold text-white"
              >
                <User className="w-4 h-4" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
