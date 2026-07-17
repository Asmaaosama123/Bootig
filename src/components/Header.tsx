// src/components/Header.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, ShoppingCart, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import api from '../services/api';
import { Product } from '../types';

const debounce = <T extends unknown[]>(fn: (...args: T) => void, delay = 300) => {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: T) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

interface HeaderProps {
  cartItemCount: number;
  onCartClick: () => void;
  onLogoClick: () => void;
  onProductClick?: (product: Product) => void;
  user?: { role?: string } | null;
  onOpenMyStore?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  onCartClick,
  onLogoClick,
  onProductClick,
  user = null,
  onOpenMyStore
}) => {
  const { t, isRTL } = useLanguage();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  const doSearch = useCallback(async (term: string) => {
    if (!term) {
      setResults([]);
      setOpen(false);
      return;
    }
    try {
      const { data } = await api.get('/products', { params: { keyword: term } });
      setResults(data.products || []);
      setOpen(true);
    } catch (err) {
      console.error('Search error', err);
      setResults([]);
      setOpen(false);
    }
  }, []);

  const debouncedSearch = useMemo(
    () => debounce((v: string) => { void doSearch(v); }, 300),
    [doSearch]
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* ✅ Logo & Icons */}
      <div className="px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={onLogoClick} className="flex items-center">
            <img
              src="/assets/logo.png"
              alt="Bootig Logo"
              style={{ width: 100, height: 'auto' }}
              className="max-w-[120px] h-auto"
            />
          </button>
        </div>

        <div className="flex items-center gap-4">
          {user && user.role === 'vendor' && (
            <button
              onClick={() => onOpenMyStore?.()}
              className="p-1"
            >
              <Store className="w-6 h-6 text-gray-900" />
            </button>
          )}

          {/* ✅ أيقونة الكارت */}
          <button
            onClick={onCartClick}
            className="relative p-1 text-gray-900 hover:text-yellow-500 transition"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ✅ Search bar */}
      <div className="px-4 pb-2.5">
        <div className="relative" ref={containerRef}>
          <Search
            className={`absolute top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 ${
              isRTL ? 'right-3' : 'left-3'
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); debouncedSearch(e.target.value); }}
            onFocus={() => { if (results.length > 0) setOpen(true); }}
            placeholder={t('search.placeholder')}
            className={`w-full py-2 text-sm bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-200 transition-colors ${
              isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
            }`}
          />

          {open && results.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
              {results.map((p) => (
                <button
                  key={p._id || p.id}
                  onClick={() => { setOpen(false); setQuery(''); onProductClick?.(p); }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3"
                >
                  <img
                    src={p.images?.[0] || p.image || ''}
                    alt={p.name}
                    className="w-10 h-10 object-cover rounded-md bg-gray-100"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-500">${p.price?.toFixed?.(2) ?? p.price}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
