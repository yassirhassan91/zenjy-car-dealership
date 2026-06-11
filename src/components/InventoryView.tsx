import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Eye, RefreshCw, X, Heart, Sparkles, Scale, Info, Car, Bike } from 'lucide-react';
import { Vehicle } from '../types';

interface InventoryViewProps {
  vehicles: Vehicle[];
  onSelectVehicle: (id: string) => void;
  onToggleWishlist: (id: string) => void;
  wishlist: string[];
  recentlyViewed: string[];
}

export default function InventoryView({
  vehicles,
  onSelectVehicle,
  onToggleWishlist,
  wishlist,
  recentlyViewed
}: InventoryViewProps) {
  // Filtering states
  const [activeCategory, setActiveCategory] = useState<'Car' | 'Motorcycle'>('Car');
  const [search, setSearch] = useState('');
  const [selectedMake, setSelectedMake] = useState('All');
  const [selectedFuel, setSelectedFuel] = useState('All');
  const [selectedTrans, setSelectedTrans] = useState('All');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [maxPrice, setMaxPrice] = useState(350000000);
  const [sortBy, setSortBy] = useState('relevant');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Compare states
  const [compareList, setCompareList] = useState<Vehicle[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Auto-adjust default maximum price limits based on asset category selection
  useEffect(() => {
    if (activeCategory === 'Motorcycle') {
      setMaxPrice(15000000);
    } else {
      setMaxPrice(350000000);
    }
  }, [activeCategory]);

  const categoryVehicles = vehicles.filter(v => {
    const isBike = v.category === 'Motorcycle';
    return activeCategory === 'Motorcycle' ? isBike : !isBike;
  });

  const makes = ['All', ...Array.from(new Set(categoryVehicles.map(v => v.make)))];
  const fuels = ['All', 'Gasoline', 'Diesel', 'Electric', 'Hybrid'];
  const transmissions = ['All', 'Automatic', 'Manual'];
  const conditions = ['All', 'New', 'Used'];

  // Handle filtering
  const filteredVehicles = categoryVehicles.filter(car => {
    const matchesSearch = 
      car.make.toLowerCase().includes(search.toLowerCase()) ||
      car.model.toLowerCase().includes(search.toLowerCase()) ||
      car.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesMake = selectedMake === 'All' || car.make === selectedMake;
    const matchesFuel = selectedFuel === 'All' || car.fuelType === selectedFuel;
    const matchesTrans = selectedTrans === 'All' || car.transmission === selectedTrans;
    const matchesCondition = selectedCondition === 'All' || car.condition === selectedCondition;
    const matchesPrice = car.price <= maxPrice;

    return matchesSearch && matchesMake && matchesFuel && matchesTrans && matchesCondition && matchesPrice;
  });

  // Handle sorting
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'year-new') return b.year - a.year;
    if (sortBy === 'mileage-low') return a.mileage - b.mileage;
    return 0; // Default relevant
  });

  // Handle comparison selection
  const handleToggleCompare = (car: Vehicle, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList(prev => {
      const exists = prev.some(item => item.id === car.id);
      if (exists) {
        return prev.filter(item => item.id !== car.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare a maximum of 3 vehicles side by side.');
          return prev;
        }
        return [...prev, car];
      }
    });
  };

  const handleClearFilters = () => {
    setSearch('');
    setSelectedMake('All');
    setSelectedFuel('All');
    setSelectedTrans('All');
    setSelectedCondition('All');
    if (activeCategory === 'Motorcycle') {
      setMaxPrice(15000000);
    } else {
      setMaxPrice(350000000);
    }
    setSortBy('relevant');
  };

  return (
    <div id="inventory-view-container" className="py-12 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn">
      {/* Header and Compare Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-slate-950 tracking-tight leading-none uppercase">
            PREMIUM VEHICLE CATALOG
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 font-sans">
            Showing <span className="font-bold text-slate-800">{filteredVehicles.length}</span> luxury assets matching your criteria.
          </p>
        </div>

        {compareList.length > 0 && (
          <div className="flex items-center gap-3.5 bg-blue-50 border border-blue-200 py-2 px-4.5 rounded-2xl animate-pulse">
            <span className="text-xs text-blue-800 font-semibold flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-blue-500" />
              {compareList.length} Selected
            </span>
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-sm transition-colors text-center"
            >
              Compare Side-by-Side
            </button>
            <button
              onClick={() => setCompareList([])}
              className="p-1 rounded bg-blue-100 text-blue-500 hover:text-blue-700"
              title="Clear Comparison Selection"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Categories Selector */}
      <div className="flex border-b border-slate-200 mb-8 mt-4 gap-2">
        <button
          onClick={() => {
            setActiveCategory('Car');
            setSelectedMake('All');
          }}
          className={`pb-4 px-6 text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 relative flex items-center gap-2 cursor-pointer ${
            activeCategory === 'Car'
              ? 'text-blue-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Car className="w-4 h-4" />
          Car
          {activeCategory === 'Car' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
        <button
          onClick={() => {
            setActiveCategory('Motorcycle');
            setSelectedMake('All');
          }}
          className={`pb-4 px-6 text-xs md:text-sm font-bold tracking-wider uppercase transition-all duration-300 relative flex items-center gap-2 cursor-pointer ${
            activeCategory === 'Motorcycle'
              ? 'text-blue-600 font-extrabold'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Bike className="w-4 h-4" />
          Motorcycle
          {activeCategory === 'Motorcycle' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
          )}
        </button>
      </div>

      {/* Advanced Filter Component Panel */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm mb-10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Keywords */}
          <div className="flex-1 relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              id="catalog-search-input"
              type="text"
              placeholder="Search make, model or interior features..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 text-xs text-slate-705"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-3.5">
            <select
              value={selectedMake}
              onChange={(e) => setSelectedMake(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
            >
              <option disabled>Select Make</option>
              {makes.map(m => <option key={m} value={m}>{m === 'All' ? 'All Makes' : m}</option>)}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:border-blue-500 text-slate-800 font-medium"
            >
              <option value="relevant">Relevant Sorting</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="year-new">Model Year: Newest</option>
              <option value="mileage-low">Mileage: Lowest</option>
            </select>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-4.5 py-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                showAdvanced || selectedFuel !== 'All' || selectedTrans !== 'All' || selectedCondition !== 'All'
                  ? 'bg-blue-50 text-blue-600 border-blue-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Advanced Filters
            </button>
          </div>
        </div>

        {/* Collapsible Advanced Filters Row */}
        {showAdvanced && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-slate-100 animate-slideDown">
            {/* Fuel select */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase font-bold mb-2">Fuel Type</label>
              <select
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none text-slate-805"
              >
                {fuels.map(f => <option key={f} value={f}>{f === 'All' ? 'All Fuels' : f}</option>)}
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase font-bold mb-2">Transmission</label>
              <select
                value={selectedTrans}
                onChange={(e) => setSelectedTrans(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none text-slate-803"
              >
                {transmissions.map(t => <option key={t} value={t}>{t === 'All' ? 'All Transmissions' : t}</option>)}
              </select>
            </div>

            {/* Condition badge select */}
            <div>
              <label className="block text-[11px] text-slate-400 uppercase font-bold mb-2">Vehicle Condition</label>
              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none text-slate-802"
              >
                {conditions.map(c => <option key={c} value={c}>{c === 'All' ? 'All Conditions' : c === 'New' ? 'New Fleet' : 'Used Fleet'}</option>)}
              </select>
            </div>

            {/* Price slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-[11px] text-slate-400 uppercase font-bold">Max Price</label>
                <span className="text-xs font-bold text-blue-600">TZS {maxPrice.toLocaleString()}</span>
              </div>
              <input
                id="catalog-price-slider"
                type="range"
                min={activeCategory === 'Motorcycle' ? "500000" : "1000000"}
                max={activeCategory === 'Motorcycle' ? "15000000" : "350000000"}
                step={activeCategory === 'Motorcycle' ? "250000" : "5000000"}
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-200 rounded"
              />
            </div>
          </div>
        )}

        {/* Clear filters utility banner */}
        {(search || selectedMake !== 'All' || selectedFuel !== 'All' || selectedTrans !== 'All' || selectedCondition !== 'All' || maxPrice !== (activeCategory === 'Motorcycle' ? 15000000 : 350000000)) && (
          <div className="flex justify-end mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={handleClearFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Clear Options
            </button>
          </div>
        )}
      </div>

      {/* Grid of Results */}
      {sortedVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sortedVehicles.map(car => {
            const isSaved = wishlist.includes(car.id);
            const isCompared = compareList.some(item => item.id === car.id);
            return (
              <div
                id={`inventory-card-${car.id}`}
                key={car.id}
                onClick={() => onSelectVehicle(car.id)}
                className="group relative bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                {/* Photo Space */}
                <div className="h-56 relative bg-slate-100 overflow-hidden">
                  <img
                    src={car.imageUrls[0]}
                    alt={`${car.make} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                  />

                  {/* Stock Availability Badge */}
                  {car.availability === 'Sold' ? (
                    <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] z-20 flex items-center justify-center">
                      <span className="px-5 py-2 border-2 border-red-500/50 bg-red-950/80 text-white rounded-xl font-heading font-black text-xs uppercase tracking-widest text-shadow">
                        SOLD OUT
                      </span>
                    </div>
                  ) : null}

                  {/* Top-Right Save Toggle button and compare handle toggle */}
                  <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(car.id);
                      }}
                      className={`p-2.5 rounded-full backdrop-blur border shadow-sm transition-all text-center ${
                        isSaved
                          ? 'bg-red-50 text-red-500 border-red-200'
                          : 'bg-slate-900/30 text-white border-white/20 hover:bg-white hover:text-slate-900'
                      }`}
                      title={isSaved ? 'Remove from Saved' : 'Save to Favorites List'}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>

                    <button
                      onClick={(e) => handleToggleCompare(car, e)}
                      disabled={car.availability === 'Sold'}
                      className={`p-2.5 rounded-full backdrop-blur border shadow-sm transition-all text-center ${
                        isCompared
                          ? 'bg-blue-600 text-white border-blue-500'
                          : car.availability === 'Sold'
                            ? 'opacity-40 cursor-not-allowed bg-slate-900/20 text-slate-400 border-transparent'
                            : 'bg-slate-900/30 text-white border-white/20 hover:bg-white hover:text-slate-900'
                      }`}
                      title="Compare specs with alternative"
                    >
                      <Scale className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Condition Badget left */}
                  <div className="absolute bottom-4 left-4 z-20 flex gap-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-slate-950 text-white text-[9px] font-bold tracking-widest font-mono uppercase">
                      {car.condition}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-white text-[9px] font-bold tracking-widest font-mono uppercase ${
                      car.fuelType === 'Electric' ? 'bg-blue-600' : car.fuelType === 'Hybrid' ? 'bg-emerald-600' : 'bg-slate-800'
                    }`}>
                      {car.fuelType}
                    </span>
                  </div>
                </div>

                {/* Content details description and action items */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-slate-450 uppercase font-bold tracking-wide">
                      {car.year} • {car.transmission}
                    </p>
                    <span className="text-slate-300">•</span>
                    <p className="text-[10px] text-slate-450 font-mono tracking-wider">
                      {car.specs.exteriorColor}
                    </p>
                  </div>

                  <h3 className="font-heading font-extrabold text-base text-slate-900 mt-1">
                    {car.make} <span className="font-medium text-slate-600">{car.model}</span>
                  </h3>

                  {/* Quick features overview bullets list */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {car.features.slice(0, 2).map((feat, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-50 border border-slate-100 rounded-lg px-2 py-1 text-slate-500">
                        {feat}
                      </span>
                    ))}
                  </div>

                  {/* Horizontal dividers & specs points */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-50/50 border border-slate-100 rounded-xl py-2 px-3 mt-4 text-[11px] text-slate-500 text-center font-mono">
                    <div className="border-r border-slate-100 pr-1 text-left pl-1">
                      <p className="text-[8px] text-slate-400 uppercase">
                        {car.category === 'Motorcycle' ? 'Engine' : 'Power Output'}
                      </p>
                      <p className="font-bold text-slate-700 truncate" title={car.category === 'Motorcycle' ? car.specs.engine : `${car.specs.horsepower} HP`}>
                        {car.category === 'Motorcycle' ? car.specs.engine.split(',')[0] : `${car.specs.horsepower} HP`}
                      </p>
                    </div>
                    <div className="text-left pl-2">
                      <p className="text-[8px] text-slate-400 uppercase">
                        {car.category === 'Motorcycle' ? 'Fuel Economy' : 'Mileage Range'}
                      </p>
                      <p className="font-bold text-slate-700">
                        {car.category === 'Motorcycle' ? car.specs.fuelEconomy : `${car.mileage.toLocaleString()} mi`}
                      </p>
                    </div>
                  </div>

                  {/* Financial section details price and direct metrics CTA */}
                  <div className="border-t border-slate-100 my-4 pt-4 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold">Dealership Price</p>
                      <p className="font-heading font-black text-xl text-blue-700 leading-none mt-1">
                        TZS {car.price.toLocaleString()}
                      </p>
                    </div>
                    
                    <button className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-400 text-xs font-bold text-slate-700 flex items-center gap-1 transition-all">
                      Inspect <Eye className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-white border border-slate-250 rounded-3xl p-8 max-w-md mx-auto">
          <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-heading font-extrabold text-lg text-slate-950 mb-1">Inquiries Unmatched</h3>
          <p className="text-xs text-slate-450 leading-relaxed mb-6">We could not locate any active vehicle matching your dynamic filter choices. Change values or search parameters to reset catalog indexes.</p>
          <button
            onClick={handleClearFilters}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Side-by-Side Compare Overlay Modal sheet */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-[4px] z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal headers */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-heading font-black text-lg text-slate-950 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-blue-500" />
                  VEHICLE COMPARISON SHEET
                </h3>
                <p className="text-xs text-slate-400">Inspecting direct differences side-by-side regarding powertrain and metrics.</p>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison matrix */}
            <div className="p-6 overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-150">
                    <th className="py-2.5 text-slate-400 uppercase tracking-widest font-mono text-[10px] w-1/4">Metric</th>
                    {compareList.map(car => (
                      <th key={car.id} className="py-2.5 px-4 text-slate-950 font-heading font-black text-sm text-center">
                        <div>
                          <img src={car.imageUrls[0]} alt={car.model} className="w-24 h-16 object-cover rounded-lg mx-auto mb-2 border border-slate-200" />
                          <p>{car.make}</p>
                          <p className="text-slate-500 font-medium text-xs font-sans">{car.model}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Dealership Price</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center font-bold text-blue-600 text-sm font-heading">TZS {car.price.toLocaleString()}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Model Year</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center">{car.year}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Odometer Milage</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center">{car.mileage.toLocaleString()} mi</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Fuel Type</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center text-blue-500">{car.fuelType}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Transmission System</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center">{car.transmission}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Power Horsepower</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center text-slate-900 font-semibold">{car.specs.horsepower} HP</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Engine / Electric Motor</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center">{car.specs.engine}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Zero-to-Sixty Acceleration</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center text-emerald-600 font-semibold">{car.specs.acceleration}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Drivetrain Configuration</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center">{car.specs.drivetrain}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Fuel/Charge Economy</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center">{car.specs.fuelEconomy}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Exterior Color Index</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center">{car.specs.exteriorColor}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="py-3 text-slate-550 font-bold">Actions</td>
                    {compareList.map(car => (
                      <td key={car.id} className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            onSelectVehicle(car.id);
                            setShowCompareModal(false);
                          }}
                          className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Footer warning */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 rounded-b-3xl">
              <span className="flex items-center gap-1">
                <Info className="w-4 h-4 text-slate-450" /> Values represented here originate directly from manufacturer spec-sheets.
              </span>
              <button
                onClick={() => setCompareList([])}
                className="text-xs font-bold text-red-500 hover:text-red-700"
              >
                Clear comparison list
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
