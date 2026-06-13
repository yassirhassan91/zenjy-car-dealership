import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import InventoryView from './components/InventoryView';
import VehicleDetailView from './components/VehicleDetailView';

import ContactView from './components/ContactView';
import WishlistView from './components/WishlistView';
import AccountView from './components/AccountView';
import AdminView from './components/AdminView';
import AIChatBot from './components/AIChatBot';
import { Vehicle, User, Order } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Core collections
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('zenjy_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // User state
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zenjy_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Recently Viewed tracker
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>(() => {
    const saved = localStorage.getItem('zenjy_views');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch cars catalog on load
  useEffect(() => {
    fetchVehicles();

    // Check if deep linked vehicle ID is present in URL
    const params = new URLSearchParams(window.location.search);
    const vehicleIdParam = params.get('vehicle');
    if (vehicleIdParam) {
      setSelectedVehicleId(vehicleIdParam);
    }
  }, []);

  const fetchVehicles = () => {
    fetch('/api/vehicles')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setVehicles(data);
        }
      })
      .catch(err => console.error(err));
  };

  // Sync state modifications with localStorages
  useEffect(() => {
    localStorage.setItem('zenjy_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('zenjy_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('zenjy_views', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  // Auth Operations
  const handleLogin = (email: string) => {
    fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data);
          // Auto switch to home upon logged in
          setActiveTab('home');
        } else {
          alert(`Authentication Fail: ${data.error}`);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleRegister = (name: string, email: string) => {
    fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data);
          setActiveTab('home');
        } else {
          alert(`Registration Error: ${data.error}`);
        }
      })
      .catch((err) => console.error(err));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('zenjy_user');
    setActiveTab('home');
  };

  const handleUpdateMe = (name: string, email: string) => {
    if (!user) return;
    fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data);
        }
      })
      .catch(err => console.error(err));
  };

  // Add to Wishlist / Favorites
  const handleToggleWishlist = (id: string) => {
    setWishlist(prev => {
      const isSaved = prev.includes(id);
      const nextList = isSaved ? prev.filter(item => item !== id) : [...prev, id];
      
      // Update DB if user logged in
      if (user) {
        fetch(`/api/users/${user.id}/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ savedVehicles: nextList })
        })
          .then(res => res.json())
          .then(data => {
            if (!data.error) {
              setUser(data);
            }
          });
      }
      return nextList;
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setWishlist(prev => {
      const nextList = prev.filter(item => item !== id);
      if (user) {
        fetch(`/api/users/${user.id}/wishlist`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ savedVehicles: nextList })
        }).then(res => res.json()).then(data => {
          if (!data.error) setUser(data);
        });
      }
      return nextList;
    });
  };

  // Select Vehicle details
  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    if (id) {
      window.history.pushState(null, '', `?vehicle=${id}`);
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
    // Log in recentlyViewed
    setRecentlyViewed(prev => {
      const exists = prev.includes(id);
      if (exists) return prev;
      return [id, ...prev].slice(0, 5); // limit to 5 views
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased">
      {/* Universal header navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setSelectedVehicleId(null);
        }}
        currUser={user}
        onLogout={handleLogout}
        wishlistCount={wishlist.length}
        setSelectedVehicleId={setSelectedVehicleId}
      />

      {/* Primary content router section */}
      <main className="flex-1">
        {selectedVehicleId ? (
          <VehicleDetailView
            vehicleId={selectedVehicleId}
            onBack={() => {
              setSelectedVehicleId(null);
              window.history.pushState(null, '', window.location.pathname);
            }}
            onAddToWishlist={handleToggleWishlist}
            wishlist={wishlist}
            allVehicles={vehicles}
            currUser={user}
            onSelectVehicle={handleSelectVehicle}
          />
        ) : (
          <>
            {activeTab === 'home' && (
              <InventoryView
                vehicles={vehicles}
                onSelectVehicle={handleSelectVehicle}
                onToggleWishlist={handleToggleWishlist}
                wishlist={wishlist}
                recentlyViewed={recentlyViewed}
              />
            )}

            {activeTab === 'contact' && <ContactView />}
            {activeTab === 'wishlist' && (
              <WishlistView
                wishlist={wishlist}
                vehicles={vehicles}
                onToggleWishlist={handleToggleWishlist}
                onSelectVehicle={handleSelectVehicle}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'account' && (
              <AccountView
                currUser={user}
                onLogin={handleLogin}
                onRegister={handleRegister}
                onUpdateMe={handleUpdateMe}
                vehiclesList={vehicles}
                onSelectVehicle={handleSelectVehicle}
                onRemoveFavorite={handleRemoveFavorite}
              />
            )}
            {activeTab === 'admin' && (
              <AdminView
                currUser={user}
                vehicles={vehicles}
                onRefreshVehicles={fetchVehicles}
                setActiveTab={setActiveTab}
                onAdminLogin={setUser}
              />
            )}
          </>
        )}
      </main>

      {/* Floating sales assistant */}
      <AIChatBot />

      {/* Site footer */}
      <Footer setActiveTab={setActiveTab} setSelectedVehicleId={setSelectedVehicleId} />
    </div>
  );

  // Helper utility to refresh user object in local memory
  function loadDashboardUserData() {
    if (!user) return;
    fetch(`/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email })
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUser(data);
        }
      });
  }
}
