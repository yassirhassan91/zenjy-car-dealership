import React, { useState, useEffect } from 'react';
import { User, Heart, Compass, ClipboardList, PenTool, CheckCircle, Package, Truck, UserCheck, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { Vehicle, Order, User as UserType } from '../types';

interface AccountViewProps {
  currUser: UserType | null;
  onLogin: (email: string) => void;
  onRegister: (name: string, email: string) => void;
  onUpdateMe: (name: string, email: string) => void;
  vehiclesList: Vehicle[];
  onSelectVehicle: (id: string) => void;
  onRemoveFavorite: (id: string) => void;
}

export default function AccountView({
  currUser,
  onLogin,
  onRegister,
  onUpdateMe,
  vehiclesList,
  onSelectVehicle,
  onRemoveFavorite
}: AccountViewProps) {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  // Active panel tab inside Account Dashboard
  const [dashboardTab, setDashboardTab] = useState<'wishlist' | 'orders' | 'profile'>('wishlist');

  // Profile fields editing states
  const [editName, setEditName] = useState(currUser?.name || '');
  const [editEmail, setEditEmail] = useState(currUser?.email || '');
  const [editSuccess, setEditSuccess] = useState(false);

  // Orders list
  const [userOrders, setUserOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (currUser) {
      setEditName(currUser.name);
      setEditEmail(currUser.email);
      
      // Fetch user specific historical orders
      setLoadingOrders(true);
      fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${currUser.id}` }
      })
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setUserOrders(data);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoadingOrders(false));
    }
  }, [currUser]);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      if (emailInput.trim()) {
        onLogin(emailInput.trim());
      }
    } else {
      if (nameInput.trim() && emailInput.trim()) {
        onRegister(nameInput.trim(), emailInput.trim());
      }
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.trim() && editEmail.trim()) {
      onUpdateMe(editName.trim(), editEmail.trim());
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 4000);
    }
  };

  // Auth View
  if (!currUser) {
    return (
      <div id="auth-box-container" className="py-20 px-4 max-w-sm mx-auto animate-fadeIn">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-md">
          <div className="text-center mb-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-3 border border-blue-50">
              <User className="w-5 h-5" />
            </span>
            <h2 className="font-heading font-extrabold text-xl tracking-tight uppercase leading-none text-slate-950">
              {authMode === 'login' ? 'Secure Login' : 'Register Account'}
            </h2>
            <p className="text-xs text-slate-450 mt-1.5 leading-relaxed">
              {authMode === 'login' ? 'Unlock saved vehicle parameters and dynamic histories tracking.' : 'Form a secure profile context immediately.'}
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4 text-xs">
            {authMode === 'register' && (
              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Your Full Name</label>
                <input
                  id="auth-name-input"
                  type="text"
                  required
                  placeholder="Alexander Wright"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-250 text-xs focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-black mb-1">Your Email Address</label>
              <input
                id="auth-email-input"
                type="email"
                required
                placeholder="E.g. contact@domain.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-250 text-xs focus:outline-none"
              />
              <p className="text-[10px] text-slate-404 mt-1">Include **admin** in email to trigger admin views.</p>
            </div>

            <button
              id="auth-submit-btn"
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-900/10 uppercase tracking-wider text-xs cursor-pointer"
            >
              {authMode === 'login' ? 'Sign In / Authenticate' : 'Complete Registration'}
            </button>
          </form>

          {/* Toggle button */}
          <div className="text-center mt-6 text-xs text-slate-500">
            {authMode === 'login' ? (
              <p>
                Don't have an active account?{' '}
                <button onClick={() => setAuthMode('register')} className="text-blue-600 font-bold hover:underline cursor-pointer">
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have a profile recorded?{' '}
                <button onClick={() => setAuthMode('login')} className="text-blue-600 font-bold hover:underline cursor-pointer">
                  Log in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard View
  const wishlistItems = vehiclesList.filter(v => currUser.savedVehicles.includes(v.id));

  return (
    <div id="account-dashboard-panel" className="py-12 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Intro Header banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 w-full">
        <div className="flex gap-4 items-center">
          <div className="h-14 w-14 rounded-full bg-slate-850 flex items-center justify-center font-heading font-black text-blue-400 text-lg border border-slate-700 uppercase">
            {currUser.name.slice(0, 2)}
          </div>
          <div>
            <h2 className="font-heading font-extrabold text-xl text-white tracking-widest leading-none">
              {currUser.name.toUpperCase()}
            </h2>
            <p className="text-xs text-slate-400 mt-1 capitalize">Role authorization: <span className="font-bold text-blue-400">{currUser.role}</span></p>
          </div>
        </div>

        {/* Dynamic badge indicator */}
        <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px] uppercase font-bold flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5" /> SECURED PROFILE CONNECT
        </span>
      </div>

      {/* Main panel columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column Tabs */}
        <div className="lg:col-span-3 flex flex-col gap-2">
          {[
            { id: 'wishlist', label: 'Favorites Wishlist', count: wishlistItems.length, icon: Heart },
            { id: 'orders', label: 'Historical Orders', count: userOrders.length, icon: ClipboardList },
            { id: 'profile', label: 'Acquirer Settings', icon: PenTool }
          ].map(it => {
            const Icon = it.icon;
            return (
              <button
                key={it.id}
                onClick={() => setDashboardTab(it.id as any)}
                className={`py-3.5 px-4 rounded-xl font-heading font-extrabold text-xs tracking-wider text-left uppercase cursor-pointer flex justify-between items-center transition-all ${
                  dashboardTab === it.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-705 hover:bg-slate-50'
                }`}
              >
                <span className="flex gap-2 items-center">
                  <Icon className="w-4 h-4" />
                  {it.label}
                </span>
                {it.count !== undefined && (
                  <span className={`h-5 px-1.5 inline-flex items-center justify-center rounded-full text-[10px] font-bold ${
                    dashboardTab === it.id ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {it.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right content details page */}
        <div className="lg:col-span-9 bg-white border border-slate-205 rounded-3xl p-8 shadow-sm">
          {/* 1. WISHLIST PANEL */}
          {dashboardTab === 'wishlist' && (
            <div id="wishlist-subsection">
              <h3 className="font-heading font-extrabold text-lg uppercase mb-2">Favorites Wishlist</h3>
              <p className="text-xs text-slate-400 mb-8">Inspect your list of favorite vehicles saved for purchase consideration.</p>

              {wishlistItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {wishlistItems.map(car => (
                    <div
                      key={car.id}
                      onClick={() => onSelectVehicle(car.id)}
                      className="border border-slate-200 rounded-3xl overflow-hidden group pb-4 cursor-pointer hover:border-slate-350 transition-all flex flex-col bg-slate-50/20"
                    >
                      <div className="h-40 overflow-hidden relative">
                        <img src={car.imageUrls[0]} alt={car.model} className="w-full h-full object-cover" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveFavorite(car.id);
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white text-red-500 shadow hover:scale-105 transition-all text-center"
                          title="Remove from favorites"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <p className="text-[9px] text-slate-450 uppercase font-mono">{car.year} • {car.transmission}</p>
                          <h4 className="font-heading font-black text-slate-900 mt-1">{car.make} <span className="font-medium text-slate-650">{car.model}</span></h4>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <p className="font-heading font-bold text-blue-700">TZS {car.price.toLocaleString()}</p>
                          <span className="text-[10px] text-slate-400 group-hover:text-blue-600 font-bold uppercase">Inspect Specs →</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-sm mx-auto p-4 flex flex-col items-center">
                  <Compass className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="font-heading font-bold text-sm">Wishlist is Empty</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed text-center mt-1">Lock favorite vehicle models directly in vehicle spec-grids to follow their availability.</p>
                </div>
              )}
            </div>
          )}

          {/* 2. ORDERS LIST */}
          {dashboardTab === 'orders' && (
            <div id="orders-subsection">
              <h3 className="font-heading font-extrabold text-lg uppercase mb-2">Historical Wires Tracker</h3>
              <p className="text-xs text-slate-400 mb-8 font-sans">Track real delivery pipeline steps or notary processing speeds immediately.</p>

              {loadingOrders ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              ) : userOrders.length > 0 ? (
                <div className="flex flex-col gap-6.5">
                  {userOrders.map((ord) => (
                    <div key={ord.id} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
                      <div className="flex flex-wrap justify-between items-center mb-4 pb-3 border-b border-slate-108 text-xs font-mono">
                        <div>
                          <span className="font-bold text-slate-800">WIRE REFID: {ord.id}</span>
                          <span className="text-slate-400 ml-3">| Date: {new Date(ord.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex gap-2">
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-900 text-white`}>
                            {ord.orderStatus}
                          </span>
                        </div>
                      </div>

                      {/* Purchased Item info */}
                      <div className="flex flex-col gap-2 ml-1 text-xs">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest font-mono">Core assets acquired</p>
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center leading-relaxed">
                            <span className="font-bold text-slate-800">{item.year} {item.make} {item.model} ({item.specs.exteriorColor})</span>
                            <span className="text-blue-700 font-mono font-bold">TZS {item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Interactive Visual delivery tracker lines */}
                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-4 font-mono">Active Delivery States Steps</p>
                        
                        {/* 4 horizontal points layout */}
                        <div className="grid grid-cols-4 gap-1 relative text-center text-[10px]">
                          {[
                            { label: 'Authorized', icon: CheckCircle, active: true },
                            { label: 'Notary Documents', icon: UserCheck, active: ord.orderStatus !== 'Cancelled' },
                            { label: 'Custom Trucking', icon: Truck, active: ord.orderStatus === 'Shipped' || ord.orderStatus === 'Completed' },
                            { label: 'Delivered', icon: Package, active: ord.orderStatus === 'Completed' }
                          ].map((step, idx) => {
                            const Icon = step.icon;
                            return (
                              <div key={idx} className="flex flex-col items-center">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${
                                  step.active
                                    ? 'bg-blue-600 border-blue-500 text-white'
                                    : 'bg-white border-slate-150 text-slate-350'
                                }`}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className={`mt-2 font-bold uppercase text-[9px] ${step.active ? 'text-slate-800' : 'text-slate-400'}`}>{step.label}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-200 max-w-sm mx-auto p-4 flex flex-col items-center">
                  <ClipboardList className="w-10 h-10 text-slate-300 mb-3" />
                  <p className="font-heading font-bold text-sm">No Purchases Logged</p>
                  <p className="text-[11px] text-slate-400 mt-1 text-center">Your direct escrow wires transactions will display instantly once completed.</p>
                </div>
              )}
            </div>
          )}

          {/* 3. PROFILE SETTINGS WRITE */}
          {dashboardTab === 'profile' && (
            <div id="profile-subsection">
              <h3 className="font-heading font-extrabold text-lg uppercase mb-2">Acquirer Profile Settings</h3>
              <p className="text-xs text-slate-400 mb-8 font-sans">Modify security and dispatching targets credentials safely.</p>

              <form onSubmit={handleProfileUpdate} className="flex flex-col gap-4 text-xs text-slate-705 max-w-md">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Legal Acquirer Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1.5">Contact-dispatch email</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end mt-2">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>

                {editSuccess && (
                  <p className="text-emerald-500 font-bold text-[11px] mt-1">✓ Settings coordinates mapped and saved inside Local storage browser registries.</p>
                )}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
