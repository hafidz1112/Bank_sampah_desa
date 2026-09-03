import React, { useState, useRef, useEffect, useId } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';

/**
 * Shadcn-inspired accessible Select & Combobox Component
 * - Styled with Tailwind CSS
 * - Smart auto-positioning (opens downward or upward based on viewport space)
 * - Built-in search filtering for large datasets
 * - Mobile and Desktop friendly, prevents covering screen or breaking layout
 */
export const Select = ({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih opsi...',
  searchable = false,
  searchPlaceholder = 'Ketik untuk mencari...',
  disabled = false,
  className = '',
  triggerClassName = '',
  contentClassName = '',
  size = 'md', // 'sm' | 'md' | 'lg'
  error = false,
  renderOption = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Check viewport space on open to determine drop direction
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      // If less than 260px below but enough space above, flip upward
      if (spaceBelow < 260 && spaceAbove > 260) {
        setOpenUpward(true);
      } else {
        setOpenUpward(false);
      }

      // Auto-focus search input
      if (searchable) {
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }
    } else {
      setSearchQuery('');
    }
  }, [isOpen, searchable]);

  // Selected option lookup
  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Filter options based on search query
  const filteredOptions = searchQuery.trim()
    ? options.filter((opt) => {
        const query = searchQuery.toLowerCase();
        const label = String(opt.label || '').toLowerCase();
        const sub = String(opt.sublabel || '').toLowerCase();
        const searchVal = String(opt.searchValue || '').toLowerCase();
        return label.includes(query) || sub.includes(query) || searchVal.includes(query);
      })
    : options;

  const handleSelect = (val) => {
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
  };

  // Size styling
  const sizeClasses = {
    sm: 'py-1.5 px-2.5 text-xs rounded-lg min-h-[34px]',
    md: 'py-2 px-3 text-xs sm:text-sm rounded-xl min-h-[40px]',
    lg: 'py-2.5 px-3.5 text-sm sm:text-base rounded-xl min-h-[46px]'
  };

  return (
    <div ref={containerRef} className={`relative w-full select-none ${className}`}>
      {/* Trigger Button (Shadcn UI style) */}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-left font-medium transition-all duration-150 bg-white border ${
          error
            ? 'border-rose-400 focus:ring-rose-400'
            : isOpen
            ? 'border-emerald-500 ring-2 ring-emerald-500/20'
            : 'border-slate-200 hover:border-slate-300'
        } ${sizeClasses[size]} ${
          disabled ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:bg-slate-50/50'
        } ${triggerClassName}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate pr-2">
          {selectedOption ? (
            <span className="text-slate-900 font-semibold">{selectedOption.label}</span>
          ) : (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {/* Floating Popover Content */}
      {isOpen && (
        <div
          className={`absolute left-0 w-full z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in-80 zoom-in-95 duration-100 ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } ${contentClassName}`}
          style={{ maxHeight: '280px' }}
        >
          {/* Optional Search Bar inside dropdown */}
          {searchable && (
            <div className="p-2 border-b border-slate-100 bg-slate-50/80 sticky top-0 z-10 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400 ml-1.5 flex-shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full bg-transparent text-xs sm:text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none py-1 px-1"
                onClick={(e) => e.stopPropagation()}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Listbox Items with max height and custom scrollbar */}
          <div
            role="listbox"
            className="overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar"
            style={{ maxHeight: searchable ? '220px' : '260px' }}
          >
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-center text-xs text-slate-400 font-medium">
                Tidak ada data ditemukan
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);

                return (
                  <div
                    key={opt.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt.value)}
                    className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm cursor-pointer transition-colors duration-100 ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-900 font-bold'
                        : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex-1 truncate pr-2">
                      {renderOption ? (
                        renderOption(opt, isSelected)
                      ) : (
                        <div>
                          <div className="truncate">{opt.label}</div>
                          {opt.sublabel && (
                            <div className="text-[11px] text-slate-400 font-normal truncate mt-0.5">
                              {opt.sublabel}
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {opt.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 mr-2 flex-shrink-0">
                        {opt.badge}
                      </span>
                    )}

                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
