import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldCheck, ClipboardList, Car, Mail, Calendar, Settings, Plus, Edit, Trash2, X, RefreshCw, Layers, ShieldAlert, Upload, Image } from 'lucide-react';
import { Vehicle, Order, Inquiry, TestDrive } from '../types';

interface AdminViewProps {
  currUser: any;
  vehicles: Vehicle[];
  onRefreshVehicles: () => void;
  setActiveTab: (tab: string) => void;
  onAdminLogin?: (adminUser: any) => void;
}

export default function AdminView({
  currUser,
  vehicles,
  onRefreshVehicles,
  setActiveTab,
  onAdminLogin
}: AdminViewProps) {
  // Stats overview states
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalVehicles: 0,
    totalUsers: 0,
    inquiriesCount: 0,
    revenueHistory: [] as any[],
    statusBreakdown: { Available: 0, Sold: 0 }
  });

  const [activeAdminSec, setActiveAdminSec] = useState<'overview' | 'vehicles' | 'orders' | 'inquiries' | 'test-drives' | 'users' | 'contact'>('overview');
  const [loading, setLoading] = useState(false);

  // Business Profile details
  const [profileAddress, setProfileAddress] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profilePhoneRaw, setProfilePhoneRaw] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profileWhatsapp, setProfileWhatsapp] = useState('');
  const [profileHoursMonFri, setProfileHoursMonFri] = useState('');
  const [profileHoursSat, setProfileHoursSat] = useState('');
  const [profileHoursSun, setProfileHoursSun] = useState('');
  const [profileHoursNote, setProfileHoursNote] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Special login credentials fields
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data lists
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [inquiriesList, setInquiriesList] = useState<Inquiry[]>([]);
  const [testDrivesList, setTestDrivesList] = useState<TestDrive[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);

  // User details inline editor
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState<'user' | 'admin'>('user');

  // Vehicle Form Popups
  const [showVehiclePopup, setShowVehiclePopup] = useState(false);
  const [editingCar, setEditingCar] = useState<Vehicle | null>(null);

  // Form states matching Vehicle type
  const [category, setCategory] = useState<'Car' | 'Motorcycle'>('Car');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [price, setPrice] = useState(50000000);
  const [mileage, setMileage] = useState(10);
  const [fuelType, setFuelType] = useState<'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid'>('Gasoline');
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [condition, setCondition] = useState<'New' | 'Used'>('New');
  const [photos, setPhotos] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState(''); // comma separated
  const [specEngine, setSpecEngine] = useState('');
  const [specHP, setSpecHP] = useState(300);
  const [specEco, setSpecEco] = useState('');
  const [specExt, setSpecExt] = useState('');
  const [specInt, setSpecInt] = useState('');
  const [specDrive, setSpecDrive] = useState('');
  const [specAccel, setSpecAccel] = useState('3.9s');
  const [formSuccess, setFormSuccess] = useState(false);

  // Loading general dashboard datasets
  useEffect(() => {
    if (!currUser || currUser.role !== 'admin') return;
    loadDashboardData();
  }, [currUser, activeAdminSec]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${currUser.id}` };

      // Fetch Stats
      const sRes = await fetch('/api/stats', { headers });
      const sData = await sRes.json();
      if (!sData.error) setStats(sData);

      // Fetch Orders
      const oRes = await fetch('/api/orders', { headers });
      const oData = await oRes.json();
      if (!oData.error) setOrdersList(oData);

      // Fetch Inquiries
      const iRes = await fetch('/api/inquiries', { headers });
      const iData = await iRes.json();
      if (!iData.error) setInquiriesList(iData);

      // Fetch Test Drives
      const tRes = await fetch('/api/test-drives', { headers });
      const tData = await tRes.json();
      if (!tData.error) setTestDrivesList(tData);

      // Fetch Joined Users
      const uRes = await fetch('/api/admin/users', { headers });
      const uData = await uRes.json();
      if (!uData.error) setUsersList(uData);

      // Fetch Business Contact Profile
      const cRes = await fetch('/api/contact');
      const cData = await cRes.json();
      if (cData && !cData.error) {
        setProfileAddress(cData.address || '');
        setProfilePhone(cData.phone || '');
        setProfilePhoneRaw(cData.phoneRaw || '');
        setProfileEmail(cData.email || '');
        setProfileWhatsapp(cData.whatsapp || '');
        setProfileHoursMonFri(cData.hoursMonFri || '');
        setProfileHoursSat(cData.hoursSat || '');
        setProfileHoursSun(cData.hoursSun || '');
        setProfileHoursNote(cData.hoursNote || '');
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Setup Form for Editing
  const handleOpenEdit = (car: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCar(car);
    setCategory(car.category || 'Car');
    setMake(car.make);
    setModel(car.model);
    setYear(car.year);
    setPrice(car.price);
    setMileage(car.mileage);
    setFuelType(car.fuelType);
    setTransmission(car.transmission);
    setCondition(car.condition);
    setPhotos(car.imageUrls || []);
    setDescription(car.description);
    setFeaturesInput(car.features.join(', '));
    setSpecEngine(car.specs.engine);
    setSpecHP(car.specs.horsepower);
    setSpecEco(car.specs.fuelEconomy);
    setSpecExt(car.specs.exteriorColor);
    setSpecInt(car.specs.interiorColor);
    setSpecDrive(car.specs.drivetrain);
    setSpecAccel(car.specs.acceleration);

    setShowVehiclePopup(true);
  };

  const handleUploadFiles = (files: File[]) => {
    const remainingSlots = 20 - photos.length;
    if (remainingSlots <= 0) return;
    
    const filesToLoad = files.slice(0, remainingSlots);
    filesToLoad.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos(prev => {
          if (prev.length >= 20) return prev;
          return [...prev, reader.result as string];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  // Reset form values
  const handleOpenAdd = () => {
    setEditingCar(null);
    setCategory('Car');
    setMake('');
    setModel('');
    setYear(2025);
    setPrice(65000);
    setMileage(10);
    setFuelType('Gasoline');
    setTransmission('Automatic');
    setCondition('New');
    setPhotos([
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800'
    ]);
    setDescription('Indulge in absolute luxury and precision steering. Highly configured with premium leather and standard assistance packages.');
    setFeaturesInput('Heated Steering Wheel, Park Assist Pro, Heads-up display');
    setSpecEngine('3.0L V6 Turbo');
    setSpecHP(382);
    setSpecEco('22 / 30 MPG');
    setSpecExt('Alpine White');
    setSpecInt('Cognac Vernasca Leather');
    setSpecDrive('AWD');
    setSpecAccel('4.1s (0-60)');

    setShowVehiclePopup(true);
  };

  // Submit Add or Edit Car
  const handleVehicleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = editingCar ? `/api/vehicles/${editingCar.id}` : '/api/vehicles';
    const method = editingCar ? 'PUT' : 'POST';

    const payloads = {
      category,
      make,
      model,
      year: parseInt(year as any),
      price: parseInt(price as any),
      mileage: parseInt(mileage as any),
      fuelType,
      transmission,
      condition,
      imageUrls: photos.filter(img => !!img.trim()),
      specs: {
        engine: specEngine,
        horsepower: parseInt(specHP as any),
        fuelEconomy: specEco,
        exteriorColor: specExt,
        interiorColor: specInt,
        drivetrain: specDrive,
        acceleration: specAccel
      },
      description,
      features: featuresInput.split(',').map(f => f.trim()).filter(f => !!f)
    };

    try {
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currUser.id}`
        },
        body: JSON.stringify(payloads)
      });
      const data = await res.json();
      if (!data.error) {
        setFormSuccess(true);
        onRefreshVehicles();
        setTimeout(() => {
          setFormSuccess(false);
          setShowVehiclePopup(false);
          loadDashboardData();
        }, 2000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you absolutely sure you want to delete this vehicle asset from catalog databases?')) return;

    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currUser.id}` }
      });
      const data = await res.json();
      if (!data.error) {
        onRefreshVehicles();
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Update order status
  const handleUpdateOrderStatus = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currUser.id}`
        },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (!data.error) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Resolve Inquiry
  const handleResolveInquiry = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currUser.id}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!data.error) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Change Test Drive status
  const handleUpdateTestDrive = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/test-drives/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currUser.id}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!data.error) {
        loadDashboardData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdminVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: adminUsername, password: adminPassword })
      });
      const data = await res.json();
      if (!data.error) {
        if (onAdminLogin) {
          onAdminLogin(data.user);
        }
      } else {
        setLoginError(data.error);
      }
    } catch (err) {
      console.error(err);
      setLoginError('An unexpected networking error occurred. Make sure API nodes are operational.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, name: string, email: string, role: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currUser.id}`
        },
        body: JSON.stringify({ name, email, role })
      });
      const data = await res.json();
      if (!data.error) {
        setEditingUser(null);
        loadDashboardData();
      } else {
        alert(`Error editing: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you entirely sure you want to remove this joined user? This action is permanent and clears their system cache.')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${currUser.id}` }
      });
      const data = await res.json();
      if (!data.error) {
        loadDashboardData();
      } else {
        alert(`Deletion error: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveContactInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileSuccessMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currUser.id}`
        },
        body: JSON.stringify({
          address: profileAddress,
          phone: profilePhone,
          phoneRaw: profilePhoneRaw,
          email: profileEmail,
          whatsapp: profileWhatsapp,
          hoursMonFri: profileHoursMonFri,
          hoursSat: profileHoursSat,
          hoursSun: profileHoursSun,
          hoursNote: profileHoursNote
        })
      });
      const data = await res.json();
      if (!data.error) {
        setProfileSuccessMsg('✓ Business Contact details saved and synchronized successfully!');
        setTimeout(() => setProfileSuccessMsg(''), 5000);
      } else {
        alert(`Failed to save details: ${data.error}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error saving contact profile details.');
    } finally {
      setProfileSaving(false);
    }
  };

  // Security guard check
  if (!currUser || currUser.role !== 'admin') {
    return (
      <div className="py-20 md:py-28 max-w-md mx-auto animate-fadeIn px-4 text-white">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
          <div className="h-14 w-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto text-blue-400 border border-blue-500/20 mb-6">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          
          <h2 className="font-heading font-black text-xl text-center text-white uppercase tracking-tight">
            ZENJY MOTORS MASTER PANEL
          </h2>
          <p className="text-[11px] text-slate-400 mt-2 text-center leading-relaxed mb-6 font-mono">
            AUTHORIZATION REQUIRED. ENTER MASTER CONTROLLER CREDENTIALS KEYS TO LOG IN.
          </p>

          <form onSubmit={handleAdminVerify} className="flex flex-col gap-4 text-xs">
            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-black mb-1.5 tracking-wider font-mono">
                Admin Username
              </label>
              <input
                id="admin-username-input"
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="Username"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-700 outline-none focus:border-blue-500 font-bold tracking-wide"
              />
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 uppercase font-black mb-1.5 tracking-wider font-mono">
                Admin Password
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-700 outline-none focus:border-blue-500"
              />
            </div>

            {loginError && (
              <p className="text-red-400 font-semibold bg-red-950/20 border border-red-900/30 p-3 rounded-xl leading-relaxed text-[11px]">
                ⚠ {loginError}
              </p>
            )}

            <button
              id="admin-login-submit"
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg shadow-blue-500/15 transition-all text-center flex items-center justify-center gap-1.5"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Keys...
                </>
              ) : (
                'Decrypt & Command'
              )}
            </button>

            <button
              id="admin-prefill-btn"
              type="button"
              onClick={() => {
                setAdminUsername('YASIN');
                setAdminPassword('OMAR');
              }}
              className="w-full py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-400 hover:bg-slate-900 hover:text-white font-semibold text-[10px] tracking-widest font-mono uppercase transition-all text-center mt-3"
            >
              ⚡ AUTO-FILL SECURE ADMIN KEYS
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
            <button
              onClick={() => setActiveTab('home')}
              className="text-[11px] text-slate-400 hover:text-blue-400 font-semibold font-mono"
            >
              ← Cancel and Return to Showroom
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-view-container" className="py-12 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Upper banner content */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 w-full">
        <div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white uppercase leading-none tracking-tight">
            Administration Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1.5 font-sans">Shed analytics, pipeline checkouts, and active catalog managers.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'overview', label: 'Stats Overview', icon: DollarSign },
            { id: 'vehicles', label: 'Catalog Manager', icon: Car },
            { id: 'orders', label: 'Pipeline Wires', icon: ClipboardList },
            { id: 'inquiries', label: 'Inquiries Inbox', icon: Mail },
            { id: 'users', label: 'Joined Users', icon: ShieldCheck },
            { id: 'contact', label: 'Dealership Profile', icon: Settings }
          ].map(sec => {
            const Icon = sec.icon;
            return (
              <button
                key={sec.id}
                onClick={() => setActiveAdminSec(sec.id as any)}
                className={`py-2 px-3.5 rounded-xl font-semibold transition-all border cursor-pointer flex items-center gap-1.5 ${
                  activeAdminSec === sec.id
                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/15'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {sec.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center mb-6">
          <span className="text-blue-600 text-xs flex items-center gap-1.5 font-semibold">
            <RefreshCw className="w-4 h-4 animate-spin" /> Synchronizing master database tables...
          </span>
        </div>
      )}

      {/* RENDER DETAILED ADIMIN SUBSECTIONS */}

      {/* SECTION 1: OVERVIEW METRIC FIELDS */}
      {activeAdminSec === 'overview' && (
        <div id="section-overview" className="animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-white">
            {/* Sales Revenue */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative flex items-center gap-4">
              <span className="p-3 w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Total Revenue</p>
                <p className="font-heading font-black text-2xl text-white mt-1">TZS {stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>

            {/* Total Sales volume */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative flex items-center gap-4">
              <span className="p-3 w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
                <ClipboardList className="w-6 h-6" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Wires Placed</p>
                <p className="font-heading font-black text-2xl text-white mt-1">{stats.totalSales}</p>
              </div>
            </div>

            {/* Catalog volume */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative flex items-center gap-4">
              <span className="p-3 w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center">
                <Car className="w-6 h-6" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Catalog Fleet</p>
                <p className="font-heading font-black text-2xl text-white mt-1">{stats.totalVehicles} Models</p>
              </div>
            </div>

            {/* Inbox notifications */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl relative flex items-center gap-4">
              <span className="p-3 w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center">
                <Mail className="w-6 h-6" />
              </span>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Registered Queries</p>
                <p className="font-heading font-black text-2xl text-white mt-1">{stats.inquiriesCount}</p>
              </div>
            </div>
          </div>

          {/* Graphical layout tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-none text-white">
              <h3 className="font-heading font-extrabold text-sm mb-4 uppercase text-white">Acquisition History Stream</h3>
              <div className="divide-y divide-slate-800 max-h-[300px] overflow-y-auto">
                {ordersList.length > 0 ? (
                  ordersList.map(ord => (
                    <div key={ord.id} className="py-3 flex justify-between text-xs">
                      <div>
                        <p className="font-bold text-white">{ord.customerName}</p>
                        <p className="text-[10px] text-slate-455 font-mono">REFID: {ord.id} • Method: {ord.paymentMethod}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-400">TZS {ord.totalAmount.toLocaleString()}</p>
                        <span className="text-[9px] font-bold text-emerald-400">{ord.orderStatus}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-6">No wire orders completed yet.</p>
                )}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-none text-white flex flex-col justify-between">
              <div>
                <h3 className="font-heading font-extrabold text-sm mb-4 uppercase text-white">Fleet Stock Allocation Matrix</h3>
                <div className="flex justify-around items-center py-6 text-xs text-slate-300">
                  <div className="text-center p-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/20">
                    <p className="text-[9px] text-slate-400 uppercase font-mono">Available Fleet</p>
                    <p className="font-heading font-black text-2xl text-emerald-400">{stats.statusBreakdown.Available}</p>
                  </div>
                  <div className="text-center p-4 bg-red-950/20 rounded-2xl border border-red-500/20">
                    <p className="text-[9px] text-slate-400 uppercase font-mono">Sold Assets</p>
                    <p className="font-heading font-black text-2xl text-red-450">{stats.statusBreakdown.Sold}</p>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 font-mono leading-relaxed bg-slate-950/30 border border-slate-800 p-3 rounded-xl mt-4">
                ✓ System Health Indicators: Optimal CPU loading, static persistence file backups fully locked in `/db.json`.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: CATALOG VEHICLE MANAGEMENT */}
      {activeAdminSec === 'vehicles' && (
        <div id="section-vehicles" className="animate-fadeIn">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-black text-lg text-white uppercase leading-none">Catalog Inventory</h3>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-500/10"
            >
              <Plus className="w-4 h-4 animate-bounce" /> Add New Vehicle
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map(car => (
              <div key={car.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-none flex flex-col text-white transition-all hover:border-slate-700/60">
                {/* Vehicle Image & Badge HUD */}
                <div className="h-44 w-full bg-slate-950 relative overflow-hidden">
                  <img src={car.imageUrls[0]} alt={car.model} className="w-full h-full object-cover" />
                  
                  {/* Category badge */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[9px] font-bold font-mono uppercase tracking-wider text-slate-300 backdrop-blur-md">
                    {car.category}
                  </span>
                  
                  {/* Availability badge/toggle */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const newStatus = car.availability === 'Available' ? 'Sold' : 'Available';
                        fetch(`/api/vehicles/${car.id}`, {
                          method: 'PUT',
                          headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${currUser.id}`
                          },
                          body: JSON.stringify({ availability: newStatus })
                        })
                        .then(res => res.json())
                        .then(data => {
                          if (!data.error) {
                            onRefreshVehicles();
                            loadDashboardData();
                          }
                        });
                      }}
                      className={`inline-block text-[10px] font-bold uppercase rounded-lg px-2.5 py-1.5 transition-all border cursor-pointer backdrop-blur-md ${
                        car.availability === 'Available' 
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25' 
                          : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
                      }`}
                      title="Click to toggle status"
                    >
                      {car.availability}
                    </button>
                  </div>
                </div>

                {/* Content Panel */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading font-black text-base text-white tracking-tight leading-tight">{car.make} {car.model}</h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 font-mono">
                      {car.year} • {car.fuelType} • {car.transmission}
                    </p>
                    <p className="font-heading font-black text-base text-blue-400 mt-2">
                      TZS {car.price.toLocaleString()}
                    </p>
                  </div>

                  {/* Labeled Edit and Delete Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 mt-5 pt-4 border-t border-slate-800/80">
                    <button
                      onClick={(e) => handleOpenEdit(car, e)}
                      className="py-2 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-blue-450 hover:text-blue-400 font-bold text-xs transition-colors border border-slate-800 hover:border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Edit vehicle details"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={(e) => handleDeleteVehicle(car.id, e)}
                      className="py-2 px-3 rounded-xl bg-red-950/15 hover:bg-red-950/30 text-red-450 hover:text-red-400 font-bold text-xs transition-colors border border-red-500/10 hover:border-red-500/20 flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Delete vehicle asset"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* SECTION 3: PIPELINE ORDERS status managers */}
      {activeAdminSec === 'orders' && (
        <div id="section-orders" className="animate-fadeIn">
          <h3 className="font-heading font-extrabold text-lg uppercase mb-4 text-white">Escrow Checkouts pipeline</h3>
          <div className="flex flex-col gap-6">
            {ordersList.length > 0 ? (
              ordersList.map(ord => (
                <div key={ord.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-none flex flex-col md:flex-row justify-between gap-6 text-xs text-slate-200">
                  <div className="flex-1">
                    <div className="flex gap-2.5 items-center mb-2.5">
                      <span className="font-mono font-bold text-white">ORDER REFID: {ord.id}</span>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-slate-950 text-white font-mono">{ord.paymentMethod}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-400 mt-4 leading-normal">
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Client</p>
                        <p className="font-bold text-white">{ord.customerName}</p>
                        <p>{ord.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Acquired Assets</p>
                        {ord.items.map((it, idx) => (
                          <p key={idx} className="font-semibold text-blue-400">{it.year} {it.make} {it.model}</p>
                        ))}
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Delivery Coordinates</p>
                        <p className="font-semibold text-slate-300">{ord.address}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Transferred amount</p>
                        <p className="font-heading font-black text-white">TZS {ord.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Status update column action panel */}
                  <div className="flex flex-col gap-3 min-w-[180px] bg-slate-950/40 p-4 rounded-2xl border border-slate-850 shrink-0 select-none">
                    <p className="text-[10px] text-slate-400 uppercase font-bold text-center tracking-wider">Pipeline Controllers</p>
                    <div>
                      <label className="block text-[9px] text-slate-550 uppercase font-black mb-1">State Status</label>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, { orderStatus: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] bg-slate-950 text-white font-bold"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Custom Trucking</option>
                        <option value="Completed">Completed / Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] text-slate-555 uppercase font-black mb-1">Payment Status</label>
                      <select
                        value={ord.paymentStatus}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, { paymentStatus: e.target.value })}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] bg-slate-950 text-white font-bold"
                      >
                        <option value="Pending">Pending Wire</option>
                        <option value="Paid">Paid / Verified</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-900 border border-dashed border-slate-800 rounded-3xl">No historical orders logged in current DB caches.</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 4: INQUIRIES LIST resolvings */}
      {activeAdminSec === 'inquiries' && (
        <div id="section-inquiries" className="animate-fadeIn">
          <h3 className="font-heading font-extrabold text-lg uppercase mb-4 text-white">Inquiries Communications Inbox</h3>
          <div className="flex flex-col gap-4">
            {inquiriesList.length > 0 ? (
              inquiriesList.map(inq => (
                <div key={inq.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-none flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-xs text-slate-300">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-bold text-white font-heading text-sm">{inq.customerName}</span>
                      <span className="text-slate-700">•</span>
                      <span className="text-slate-400">{inq.email} • {inq.phone || 'No phone'}</span>
                      <span className="text-slate-700">•</span>
                      <span className="text-slate-400 font-mono text-[10px]">{new Date(inq.date).toLocaleString()}</span>
                    </div>
                    {inq.vehicleName && (
                      <span className="inline-block px-2.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-bold uppercase mb-2">
                        Target model: {inq.vehicleName}
                      </span>
                    )}
                    <p className="text-slate-300 italic leading-relaxed mt-2 p-3 bg-slate-950 border border-slate-850 rounded-xl">"{inq.message}"</p>
                  </div>

                  <div className="flex gap-2 shrink-0 select-none">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase self-center ${
                      inq.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {inq.status}
                    </span>
                    {inq.status !== 'Resolved' ? (
                      <button
                        onClick={() => handleResolveInquiry(inq.id, 'Resolved')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl cursor-pointer"
                      >
                        Resolve
                      </button>
                    ) : (
                      <button
                        onClick={() => handleResolveInquiry(inq.id, 'New')}
                        className="px-3 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-300 font-medium text-[11px] rounded-xl cursor-pointer border border-slate-800"
                      >
                        Un-resolve
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-900 border border-dashed border-slate-800 rounded-3xl">Inbox is entirely cleared!</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 5: BOOKED TEST DRIVES */}
      {activeAdminSec === 'test-drives' && (
        <div id="section-test-drives" className="animate-fadeIn">
          <h3 className="font-heading font-extrabold text-lg uppercase mb-4 text-white">Booked Test Rides Calendar</h3>
          
          <div className="flex flex-col gap-4">
            {testDrivesList.length > 0 ? (
              testDrivesList.map(td => (
                <div key={td.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-none flex flex-col md:flex-row justify-between items-start md:items-center gap-5 text-xs text-slate-300">
                  <div className="flex-1">
                    <div className="flex gap-3 items-center mb-2 flex-wrap text-slate-400">
                      <span className="font-mono text-[10px] font-bold text-white">REFID: {td.id}</span>
                      <span>•</span>
                      <span className="text-white font-bold">{td.customerName}</span>
                      <span>•</span>
                      <span>{td.email} {td.phone ? `(${td.phone})` : ''}</span>
                    </div>

                    <div className="flex gap-4 items-center mt-3 flex-wrap">
                      <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/20 inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                        <Car className="w-4 h-4" /> Drive model: {td.vehicleName}
                      </div>
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                        <Calendar className="w-4 h-4" /> Code date: {new Date(td.dateTime).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0 select-none">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase self-center ${
                      td.status === 'Confirmed' ? 'bg-emerald-500/10 text-emerald-400' : td.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {td.status}
                    </span>
                    
                    {td.status === 'Pending' && (
                      <div className="flex gap-1.5 font-sans">
                        <button
                          onClick={() => handleUpdateTestDrive(td.id, 'Confirmed')}
                          className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateTestDrive(td.id, 'Cancelled')}
                          className="px-3.5 py-1.5 bg-red-950 text-red-400 hover:bg-red-900 text-[11px] rounded-xl cursor-pointer font-semibold border border-red-900/30"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic py-8 text-center bg-slate-900 border border-dashed border-slate-800 rounded-3xl">No test rides scheduled in database streams.</p>
            )}
          </div>
        </div>
      )}

      {/* SECTION 5: REGISTERED SYSTEM MEMBERS */}
      {activeAdminSec === 'users' && (
        <div id="section-users" className="animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="font-heading font-black text-lg text-white uppercase tracking-wider">
                Joined System Ledger
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                CONTROL REGISTERED MEMBERS REGISTERED DIRECTLY ON THE SHOWROOM APP PLATFORM.
              </p>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-[10px] font-mono text-slate-400">
              Total Active Nodes: <span className="font-bold text-blue-400">{usersList.length}</span>
            </div>
          </div>

          {editingUser && (
            <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl mb-6 animate-fadeIn text-white">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-heading font-bold text-sm text-white uppercase tracking-wider">
                  🔐 Modify Node Privileges
                </h4>
                <button
                  onClick={() => setEditingUser(null)}
                  className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 bg-slate-900 rounded-xl text-white outline-none focus:border-blue-500 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">
                    Email Stream Link
                  </label>
                  <input
                    type="email"
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-800 bg-slate-900 rounded-xl text-white outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black font-mono mb-1">
                    Privilege Role Levels
                  </label>
                  <select
                    value={editUserRole}
                    onChange={(e) => setEditUserRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-800 bg-slate-900 rounded-xl text-white outline-none focus:border-blue-500"
                  >
                    <option value="user">Standard Agent Client ('user')</option>
                    <option value="admin">Platform Administrator ('admin')</option>
                  </select>
                </div>
              </div>
               <div className="flex justify-end gap-2 text-xs">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold"
                >
                  Discard Changes
                </button>
                <button
                  onClick={() => handleUpdateUser(editingUser.id, editUserName, editUserEmail, editUserRole)}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Commit Privileges
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {usersList.length > 0 ? (
              usersList.map((user) => (
                <div
                  key={user.id}
                  className={`bg-slate-900 border ${
                    user.role === 'admin' ? 'border-amber-500/35' : 'border-slate-800'
                  } p-5 rounded-2xl flex flex-col justify-between text-white transition-all hover:scale-[1.015] shadow-lg`}
                >
                  <div>
                    <div className="flex justify-between items-start gap-2.5 mb-3">
                      <div className="h-10 w-10 flex items-center justify-center bg-slate-800 border border-slate-800 rounded-xl text-blue-400 font-bold uppercase text-xs">
                        {user.name.slice(0, 2)}
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] tracking-widest font-mono uppercase border shrink-0 ${
                          user.role === 'admin'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>

                    <h4 id={`user-name-${user.id}`} className="font-heading font-black text-sm text-white truncate">
                      {user.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono tracking-wide mt-1 truncate">
                      {user.email || 'No email links recorded'}
                    </p>
                    <p className="text-[8px] text-amber-500/80 font-mono mt-1.5">
                      NODE_ID: <span className="font-bold">{user.id}</span>
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-800/85 flex items-center justify-end gap-2.5">
                    <button
                      onClick={() => {
                        setEditingUser(user);
                        setEditUserName(user.name);
                        setEditUserEmail(user.email || '');
                        setEditUserRole(user.role);
                      }}
                      className="p-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors border border-slate-700"
                      title="Edit Account Details"
                    >
                      <Edit className="w-3 h-3" /> Edit
                    </button>
                    <button
                      disabled={user.id === currUser.id || user.id === 'user-admin'}
                      onClick={() => handleDeleteUser(user.id)}
                      className={`p-1.5 px-2.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors border ${
                        user.id === currUser.id || user.id === 'user-admin'
                          ? 'opacity-30 cursor-not-allowed bg-slate-800 text-slate-600 border-slate-800'
                          : 'bg-red-950/30 text-red-400 border-red-950/40 hover:bg-red-950/55'
                      }`}
                      title="De-register Account Node"
                    >
                      <Trash2 className="w-3 h-3" /> Dissolve
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-800/80 bg-slate-900 rounded-3xl">
                <p className="text-sm text-slate-400 italic">No nodes joined the platform network yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 6: DEALERSHIP PROFILE SETTINGS */}
      {activeAdminSec === 'contact' && (
        <div id="section-contact-settings" className="animate-fadeIn">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h3 className="font-heading font-black text-xl text-white uppercase tracking-wider">
                Dealership Profile & Contact Details
              </h3>
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                UPDATE CHANNELS, OPERATING HOURS, AND PHYSICAL LOCATION IN REAL-TIME.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveContactInfo} className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-xs text-slate-300 max-w-4xl">
            {profileSuccessMsg && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-400 font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <p>{profileSuccessMsg}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Left Form: General Channel Links */}
              <div className="flex flex-col gap-5">
                <h4 className="font-heading font-bold text-sm text-white uppercase border-b border-slate-800 pb-2 tracking-wide">
                  Direct Contact Information
                </h4>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider font-mono">
                    Showroom Physical Address
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={profileAddress}
                    onChange={(e) => setProfileAddress(e.target.value)}
                    placeholder="E.g. 500 Luxury Boulevard, Suite A, Premium District, NY 10013"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider font-mono">
                    Sales Phone Line (Display Text)
                  </label>
                  <input
                    type="text"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="E.g. +1 (500) ZEN-CARS"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider font-mono">
                    Dialable Phone Link (Raw Digits)
                  </label>
                  <input
                    type="text"
                    required
                    value={profilePhoneRaw}
                    onChange={(e) => setProfilePhoneRaw(e.target.value)}
                    placeholder="E.g. +15009362277"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Used on click of a telephone anchor.</p>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider font-mono">
                    Advisory Email Inbox
                  </label>
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    placeholder="E.g. contact@zenjy.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider font-mono">
                    WhatsApp Hotline Number (Digits Only)
                  </label>
                  <input
                    type="text"
                    required
                    value={profileWhatsapp}
                    onChange={(e) => setProfileWhatsapp(e.target.value)}
                    placeholder="E.g. 15009362277"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500 font-mono text-[11px]"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Digits only, no symbols, spaces or leading zeros (like '15009362277').</p>
                </div>
              </div>

              {/* Right Form: Operating hours configuration */}
              <div className="flex flex-col gap-5">
                <h4 className="font-heading font-bold text-sm text-white uppercase border-b border-slate-800 pb-2 tracking-wide">
                  Office Operating Hours
                </h4>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider font-mono">
                    Monday - Friday Schedule
                  </label>
                  <input
                    type="text"
                    required
                    value={profileHoursMonFri}
                    onChange={(e) => setProfileHoursMonFri(e.target.value)}
                    placeholder="E.g. 24 Hours / Always Open"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider font-mono">
                    Saturday Schedule
                  </label>
                  <input
                    type="text"
                    required
                    value={profileHoursSat}
                    onChange={(e) => setProfileHoursSat(e.target.value)}
                    placeholder="E.g. 24 Hours / Always Open"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider font-mono">
                    Sunday Schedule
                  </label>
                  <input
                    type="text"
                    required
                    value={profileHoursSun}
                    onChange={(e) => setProfileHoursSun(e.target.value)}
                    placeholder="E.g. 24 Hours / Always Open"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-black mb-2 tracking-wider font-mono">
                    Hours Advisory Notice Note
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={profileHoursNote}
                    onChange={(e) => setProfileHoursNote(e.target.value)}
                    placeholder="E.g. Showroom, Support & Direct delivery dispatches occur 24/7/365."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-blue-300 font-sans"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Appears at footer of operating hours block card.</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800/80">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold inline-flex items-center gap-1.5 transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                {profileSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Synchronizing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Save Dealership Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* POPUP FOR ADD OR EDIT VEHICLE SPECIFICATIONS */}
      {showVehiclePopup && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-[3px] z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-800 text-white" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-heading font-black text-lg text-white uppercase leading-none">
                {editingCar ? 'Modify Specifications' : 'Add New Vehicle Model'}
              </h3>
              <button
                onClick={() => setShowVehiclePopup(false)}
                className="p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-white border border-slate-850 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVehicleSubmit} className="flex flex-col gap-4 text-xs text-slate-300">
              <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-white uppercase font-mono text-[9px] mb-1">Vehicle Classification Category</h4>
                  <p className="text-[10px] text-slate-400">Classify as Car or Motorcycle to dynamically sort into target catalog categories.</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {['Car', 'Motorcycle'].map((cat) => (
                    <button
                      id={`category-btn-${cat.toLowerCase()}`}
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat as any)}
                      className={`px-3.5 py-1.5 rounded-xl text-[10px] font-extrabold uppercase transition-all tracking-wider ${
                        category === cat
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {cat}s
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Make / Brand</label>
                  <input
                    type="text"
                    required
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="E.g. Audi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Model Name</label>
                  <input
                    type="text"
                    required
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="E.g. RS 6 Avant"
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Model Year</label>
                  <input
                    type="number"
                    required
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Dealer Price (TZS)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Odometer Mileage (mi)</label>
                  <input
                    type="number"
                    required
                    value={mileage}
                    onChange={(e) => setMileage(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Transmission</label>
                  <select
                    value={transmission}
                    onChange={(e) => setTransmission(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Fuel Type</label>
                  <select
                    value={fuelType}
                    onChange={(e) => setFuelType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric (EV)</option>
                    <option value="Hybrid">Plug-in Hybrid (PHEV)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Condition Class</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  >
                    <option value="New">Certified New</option>
                    <option value="Used">Pre-owned Heritage</option>
                  </select>
                </div>
                {editingCar && (
                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Stock Availability</label>
                    <select
                      value={editingCar.availability}
                      onChange={(e) => setEditingCar({ ...editingCar, availability: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white font-bold"
                    >
                      <option value="Available">Available Stock</option>
                      <option value="Sold">Sold / Off-market</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Dynamic Multi-Photo Uploader Grid */}
              <div id="vehicle-photos-control-block" className="bg-slate-950 border border-slate-800 rounded-2xl p-5 col-span-1 md:col-span-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                  <div>
                    <h4 className="font-bold text-white text-sm">Vehicle Photos Grid</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Upload a primary beauty photo plus up to 19 optional secondary/thumbnail photos (Max 20 total)</p>
                  </div>
                  <span id="photo-count-badge" className="text-[10px] font-mono text-slate-400 font-bold bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
                    {photos.length} / 20 Photos Added
                  </span>
                </div>

                <div id="photos-grid-layout" className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {photos.map((photo, index) => (
                    <div key={index} id={`photo-thumbnail-card-${index}`} className="relative group/pic aspect-video rounded-xl bg-slate-900 border border-slate-800 overflow-hidden h-28">
                      <img src={photo} alt={`Vehicle slot ${index}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      
                      {/* Banner label for primary / optional index */}
                      <div className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-bold font-mono uppercase tracking-wider backdrop-blur-md ${
                        index === 0 
                          ? 'bg-blue-600/80 text-white border border-blue-400/20' 
                          : 'bg-slate-900/85 text-slate-300 border border-slate-800'
                      }`}>
                        {index === 0 ? 'Primary Photo' : `Optional Photo ${index + 1}`}
                      </div>

                      {/* Control panel hover layer */}
                      <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover/pic:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-2">
                        {index > 0 ? (
                          <button
                            id={`btn-set-primary-${index}`}
                            type="button"
                            onClick={() => {
                              // Move to main first item
                              const updated = [photo, ...photos.filter((_, i) => i !== index)];
                              setPhotos(updated);
                            }}
                            className="w-full py-1 bg-blue-600 hover:bg-blue-500 text-white font-mono text-[9px] font-bold rounded-lg transition-colors cursor-pointer"
                          >
                            Set Primary
                          </button>
                        ) : (
                          <span className="text-[9px] font-mono text-blue-400 font-black tracking-wider">PRIMARY ACTIVE</span>
                        )}
                        <button
                          id={`btn-delete-photo-${index}`}
                          type="button"
                          onClick={() => {
                            setPhotos(photos.filter((_, i) => i !== index));
                          }}
                          className="w-full py-1 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-500/20 font-mono text-[9px] font-bold cursor-pointer transition-colors"
                        >
                          Remove Photo
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add photo slot button */}
                  {photos.length < 20 && (
                    <div
                      id="photo-uploader-dragzone-card"
                      className="relative group hover:border-blue-500 hover:bg-blue-950/15 border-2 border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-4 bg-slate-950 text-center h-28 cursor-pointer transition-all"
                      onDragOver={(e) => {
                        e.preventDefault();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const files = Array.from(e.dataTransfer.files || []) as File[];
                        handleUploadFiles(files);
                      }}
                    >
                      <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 mb-1.5 transition-colors" />
                      <span className="text-[10px] font-bold text-slate-300">Add Vehicle Photo</span>
                      <span className="text-[8px] text-slate-500 mt-0.5 font-mono">Drag multi-files or Click</span>
                      
                      <input
                        id="multi-photo-file-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []) as File[];
                          handleUploadFiles(files);
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <h4 className="font-bold text-white uppercase font-mono text-[9px] mb-3">Subsystem Specifications Parameters</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-black mb-0.5">Engine Model</label>
                    <input type="text" value={specEngine} onChange={(e) => setSpecEngine(e.target.value)} placeholder="4.0L V8 twin-turbo" className="w-full px-2 py-1.5 text-white rounded-lg border bg-slate-900 border-slate-800 placeholder-slate-600" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-black mb-0.5">Horsepower</label>
                    <input type="number" value={specHP} onChange={(e) => setSpecHP(parseInt(e.target.value))} className="w-full px-2 py-1.5 text-white rounded-lg border bg-slate-900 border-slate-800" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-black mb-0.5">0-60 Accel</label>
                    <input type="text" value={specAccel} onChange={(e) => setSpecAccel(e.target.value)} placeholder="3.4s (0-60)" className="w-full px-2 py-1.5 text-white rounded-lg border bg-slate-900 border-slate-800 placeholder-slate-600" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-black mb-0.5">Eco Economy</label>
                    <input type="text" value={specEco} onChange={(e) => setSpecEco(e.target.value)} placeholder="20/28 MPG" className="w-full px-2 py-1.5 text-white rounded-lg border bg-slate-900 border-slate-800 placeholder-slate-600" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-black mb-0.5">Exterior Color</label>
                    <input type="text" value={specExt} onChange={(e) => setSpecExt(e.target.value)} className="w-full px-2 py-1.5 text-white rounded-lg border bg-slate-900 border-slate-800 text-white" />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 uppercase font-black mb-0.5">Interior color</label>
                    <input type="text" value={specInt} onChange={(e) => setSpecInt(e.target.value)} className="w-full px-2 py-1.5 text-white rounded-lg border bg-slate-900 border-slate-800 text-white" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Public Description Copy</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600"
                />
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowVehiclePopup(false)}
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Close Out
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Spec Sheet
                </button>
              </div>

              {formSuccess && (
                <p className="text-emerald-450 font-bold block text-center mt-2 animate-pulse">✓ Saved options successfully! Re-indexing stats...</p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
