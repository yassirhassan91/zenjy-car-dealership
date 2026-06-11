import React from 'react';
import { Heart, Trash2, ArrowRight, Smartphone } from 'lucide-react';
import { Vehicle } from '../types';

interface WishlistViewProps {
  wishlist: string[];
  vehicles: Vehicle[];
  onToggleWishlist: (id: string) => void;
  onSelectVehicle: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export default function WishlistView({
  wishlist,
  vehicles,
  onToggleWishlist,
  onSelectVehicle,
  setActiveTab
}: WishlistViewProps) {
  // Filter the vehicles that are in the wishlist
  const wishlistItems = vehicles.filter((v) => wishlist.includes(v.id));

  const getWhatsAppUrl = (car: Vehicle) => {
    const pageUrl = `${window.location.origin}/?vehicle=${car.id}`;
    const message = `Hello Zenjy Motors, I am interested in the ${car.year} ${car.make} ${car.model} which is listed for TZS ${car.price.toLocaleString()}. Here is the link to the vehicle: ${pageUrl}`;
    return `https://wa.me/15009362277?text=${encodeURIComponent(message)}`;
  };

  if (wishlistItems.length === 0) {
    return (
      <div id="wishlist-empty-state" className="py-24 max-w-md mx-auto text-center px-4 animate-fadeIn">
        <div className="h-16 w-16 bg-blue-500/10 border border-blue-500/25 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="font-heading font-extrabold text-xl text-white mb-2 leading-none uppercase">
          YOUR WISHLIST IS EMPTY
        </h2>
        <p className="text-xs text-slate-400 leading-relaxed mb-8">
          Save your favorite prestige assets while browsing our inventory to keep track of them and inquire about them easily.
        </p>
        <button
          onClick={() => setActiveTab('home')}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs tracking-wide cursor-pointer transition-colors"
        >
          Browse Vehicles Inventory
        </button>
      </div>
    );
  }

  return (
    <div id="wishlist-view-container" className="py-12 px-4 md:px-8 max-w-7xl mx-auto animate-fadeIn text-white">
      <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-white mb-1 leading-none uppercase tracking-tight">
        My Favorites Wishlist
      </h2>
      <p className="text-slate-400 text-xs mb-10">Review and inquire about your saved luxury vehicles.</p>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Wishlist Vehicles list */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {wishlistItems.map((car) => (
            <div
              id={`wishlist-item-${car.id}`}
              key={car.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 flex flex-col md:flex-row gap-5 relative group hover:border-slate-705 transition-colors"
            >
              <div 
                className="h-28 md:w-44 rounded-2xl overflow-hidden bg-slate-950 shrink-0 cursor-pointer"
                onClick={() => onSelectVehicle(car.id)}
              >
                <img src={car.imageUrls[0]} alt={car.model} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div className="cursor-pointer" onClick={() => onSelectVehicle(car.id)}>
                      <p className="text-[9px] text-slate-405 uppercase font-black tracking-wide">
                        {car.year} • {car.transmission}
                      </p>
                      <h3 className="font-heading font-extrabold text-base text-white mt-1 leading-none group-hover:text-blue-400 transition-colors">
                        {car.make} <span className="font-medium text-slate-300">{car.model}</span>
                      </h3>
                    </div>
                    <button
                      onClick={() => onToggleWishlist(car.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-2.5 line-clamp-2 leading-relaxed">
                    {car.description}
                  </p>
                </div>

                <div className="flex justify-between items-end border-t border-slate-800 pt-3 mt-4">
                  <div className="flex gap-3 text-[10px] text-slate-400 font-mono">
                    <span>Power: {car.specs.horsepower || car.specs.engine}</span>
                    <span>•</span>
                    <span className="capitalize">Fuel: {car.fuelType}</span>
                  </div>
                  <p className="font-heading font-black text-lg text-blue-400 leading-none">
                    TZS {car.price.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Action buttons list */}
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={() => setActiveTab('home')}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
            >
              ← Continue browsing vehicle catalog
            </button>
          </div>
        </div>

        {/* Right Column: Direct Contact & Action panel */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6.5 shadow-none text-white h-fit">
          <h3 className="font-heading font-extrabold text-base text-white mb-3 uppercase">Wishlist Inquiries</h3>
          <p className="text-slate-400 text-xs mb-6">Select a vehicle on the left to view specifics or initiate direct sales inquiries via WhatsApp.</p>

          <div className="flex flex-col gap-4 text-xs">
            {wishlistItems.map((car) => (
              <div key={car.id} className="p-3 border border-slate-800/80 bg-slate-950/40 rounded-2xl flex flex-col gap-2">
                <div className="flex justify-between text-slate-300 font-medium">
                  <span className="font-bold truncate text-white">{car.make} {car.model}</span>
                  <span className="font-mono text-blue-400 font-bold shrink-0">TZS {car.price.toLocaleString()}</span>
                </div>
                
                <a
                  href={getWhatsAppUrl(car)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  Chat WhatsApp Sales Agent
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
