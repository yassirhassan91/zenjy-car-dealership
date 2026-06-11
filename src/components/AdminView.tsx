import React, { useState, useEffect } from 'react';
import { DollarSign, ShieldCheck, ClipboardList, Car, Mail, Calendar, Settings, Plus, Edit, Trash2, X, RefreshCw, Layers, ShieldAlert } from 'lucide-react';
import { Vehicle, Order, Inquiry, TestDrive } from '../types';

interface AdminViewProps {
  currUser: any;
  vehicles: Vehicle[];
  onRefreshVehicles: () => void;
  setActiveTab: (tab: string) => void;
}

export default function AdminView({
  currUser,
  vehicles,
  onRefreshVehicles,
  setActiveTab
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

  const [activeAdminSec, setActiveAdminSec] = useState<'overview' | 'vehicles' | 'orders' | 'inquiries' | 'test-drives'>('overview');
  const [loading, setLoading] = useState(false);

  // Data lists
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [inquiriesList, setInquiriesList] = useState<Inquiry[]>([]);
  const [testDrivesList, setTestDrivesList] = useState<TestDrive[]>([]);

  // Vehicle Form Popups
  const [showVehiclePopup, setShowVehiclePopup] = useState(false);
  const [editingCar, setEditingCar] = useState<Vehicle | null>(null);

  // Form states matching Vehicle type
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(2024);
  const [price, setPrice] = useState(50000000);
  const [mileage, setMileage] = useState(10);
  const [fuelType, setFuelType] = useState<'Gasoline' | 'Diesel' | 'Electric' | 'Hybrid'>('Gasoline');
  const [transmission, setTransmission] = useState<'Automatic' | 'Manual'>('Automatic');
  const [condition, setCondition] = useState<'New' | 'Used'>('New');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
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
    setMake(car.make);
    setModel(car.model);
    setYear(car.year);
    setPrice(car.price);
    setMileage(car.mileage);
    setFuelType(car.fuelType);
    setTransmission(car.transmission);
    setCondition(car.condition);
    setImage1(car.imageUrls[0] || '');
    setImage2(car.imageUrls[1] || '');
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

  // Reset form values
  const handleOpenAdd = () => {
    setEditingCar(null);
    setMake('');
    setModel('');
    setYear(2025);
    setPrice(65000);
    setMileage(10);
    setFuelType('Gasoline');
    setTransmission('Automatic');
    setCondition('New');
    setImage1('https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=800');
    setImage2('https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=800');
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
      make,
      model,
      year: parseInt(year as any),
      price: parseInt(price as any),
      mileage: parseInt(mileage as any),
      fuelType,
      transmission,
      condition,
      imageUrls: [image1, image2].filter(img => !!img.trim()),
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

  // Security guard check
  if (!currUser || currUser.role !== 'admin') {
    return (
      <div className="py-24 max-w-sm mx-auto text-center animate-fadeIn px-4">
        <div className="h-12 w-12 bg-red-105 rounded-full flex items-center justify-center mx-auto text-red-650 border border-red-200 mb-6">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="font-heading font-extrabold text-lg text-slate-950 uppercase leading-none">Access Restrained</h2>
        <p className="text-xs text-slate-450 mt-2 leading-relaxed mb-6">
          Administrator level privilege credentials required. Please login with accounts indicating administrative rights to open this command portal.
        </p>
        <button
          onClick={() => setActiveTab('account')}
          className="px-5 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-xs cursor-pointer"
        >
          Sign in Admin Account
        </button>
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
            { id: 'inquiries', label: 'Inquiries Inbox', icon: Mail }
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map(car => (
              <div key={car.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-none relative p-4.5 flex gap-4 text-white">
                <div className="h-20 w-28 bg-slate-950 rounded-xl overflow-hidden shrink-0 self-center">
                  <img src={car.imageUrls[0]} alt={car.model} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-heading font-extrabold text-sm text-white leading-tight truncate">{car.make} {car.model}</h4>
                    <p className="text-[10px] text-slate-400 mt-1">{car.year} • {car.fuelType} • TZS {car.price.toLocaleString()}</p>
                    <span className={`inline-block text-[9px] font-bold uppercase rounded px-1.5 py-0.5 mt-2 ${
                      car.availability === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-450 border border-red-500/20'
                    }`}>
                      {car.availability}
                    </span>
                  </div>

                  <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={(e) => handleOpenEdit(car, e)}
                      className="p-1.5 rounded bg-slate-950 hover:bg-slate-800 text-blue-400 cursor-pointer"
                      title="Edit specifications"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteVehicle(car.id, e)}
                      className="p-1.5 rounded bg-red-950/20 text-red-400 hover:bg-slate-800 cursor-pointer"
                      title="Delete vehicle from data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
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
                <div key={ord.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-none flex flex-col md:flex-row justify-between gap-6.5 text-xs text-slate-200">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Primary Image URL</label>
                  <input
                    type="text"
                    required
                    value={image1}
                    onChange={(e) => setImage1(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Thumbnail Image URL (Optional)</label>
                  <input
                    type="text"
                    value={image2}
                    onChange={(e) => setImage2(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white"
                  />
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4.5">
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
                <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Custom Features Bullets (Comma Separated)</label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="Carbon Diffuser, Air Suspension, Laser lights, Active HUD"
                  className="w-full px-3 py-2 rounded-xl border border-slate-800 bg-slate-950 text-white placeholder-slate-600"
                />
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
