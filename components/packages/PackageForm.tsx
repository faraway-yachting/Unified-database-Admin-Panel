import { useState } from 'react';
import { ChevronDown, User, Fuel, UtensilsCrossed, Car, Users, Waves, Plus, Upload, X, Calendar } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PackageFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PackageForm({ isOpen, onClose }: PackageFormProps) {
  const { colors } = useTheme();
  const [selectedDuration, setSelectedDuration] = useState('Full-day');
  const [selectedRegions, setSelectedRegions] = useState(['Dubai', 'Athens']);
  const [selectedServices, setSelectedServices] = useState(['Skipper', 'Fuel', 'Catering']);
  const [addons, setAddons] = useState([
    { name: 'Premium Wine Package', price: 250 },
    { name: 'Professional Photography', price: 400 }
  ]);
  
  if (!isOpen) return null;
  
  const durations = ['Half-day', 'Full-day', 'Weekly', 'Custom'];
  const regions = ['Dubai', 'Athens', 'Barcelona', 'Miami', 'Monaco', 'Ibiza'];
  const services = [
    { id: 'skipper', name: 'Skipper', icon: User },
    { id: 'fuel', name: 'Fuel', icon: Fuel },
    { id: 'catering', name: 'Catering', icon: UtensilsCrossed },
    { id: 'transfer', name: 'Transfer', icon: Car },
    { id: 'crew', name: 'Crew', icon: Users },
    { id: 'snorkeling', name: 'Snorkeling Gear', icon: Waves },
  ];
  
  const toggleRegion = (region: string) => {
    if (selectedRegions.includes(region)) {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    } else {
      setSelectedRegions([...selectedRegions, region]);
    }
  };
  
  const toggleService = (serviceName: string) => {
    if (selectedServices.includes(serviceName)) {
      setSelectedServices(selectedServices.filter(s => s !== serviceName));
    } else {
      setSelectedServices([...selectedServices, serviceName]);
    }
  };
  
  return (
    <div 
      className="rounded-xl p-4 md:p-6 border backdrop-blur-sm"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 md:mb-6 pb-4 md:pb-6 border-b" style={{ borderColor: colors.cardBorder }}>
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-1" style={{ color: colors.textPrimary }}>Create New Package</h3>
          <p className="text-xs md:text-sm" style={{ color: colors.textSecondary }}>Build a custom package for your yacht charter</p>
        </div>
        <button 
          onClick={onClose}
          className="p-2 rounded-lg transition-all flex-shrink-0"
          style={{
            backgroundColor: colors.background,
            color: colors.textSecondary
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = `${colors.danger}15`;
            e.currentTarget.style.color = colors.danger;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = colors.background;
            e.currentTarget.style.color = colors.textSecondary;
          }}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Section 1 - Basic Info */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Basic Information
            </h4>
            
            <div className="space-y-4">
              {/* Package Name */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                  Package Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sunset Deluxe Experience"
                  defaultValue="Mediterranean Premium Day Charter"
                  className="w-full px-4 py-2.5 rounded-lg border text-sm transition-all"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary
                  }}
                />
              </div>
              
              {/* Description */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                  Description
                </label>
                <textarea
                  placeholder="Describe the package..."
                  defaultValue="Experience the ultimate luxury sailing adventure with our premium full-day charter. Explore hidden coves, enjoy gourmet catering, and create unforgettable memories."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm transition-all resize-none"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary
                  }}
                />
              </div>
              
              {/* Linked Yacht */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                  Linked Yacht
                </label>
                <div className="relative">
                  <select
                    className="w-full px-4 py-2.5 rounded-lg border text-sm appearance-none transition-all cursor-pointer"
                    style={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary
                    }}
                  >
                    <option>Azure Dream (Sailboat, 82ft)</option>
                    <option>Ocean Majesty (Motor Yacht, 95ft)</option>
                    <option>Twin Seas (Catamaran, 68ft)</option>
                    <option>Platinum Wave (Motor Yacht, 105ft)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: colors.textSecondary }} />
                </div>
              </div>
              
              {/* Duration Selector */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                  Duration Type
                </label>
                <div className="flex gap-2">
                  {durations.map((duration) => (
                    <button
                      key={duration}
                      onClick={() => setSelectedDuration(duration)}
                      className="flex-1 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
                      style={{
                        backgroundColor: selectedDuration === duration ? `${colors.accent}15` : colors.cardBg,
                        borderColor: selectedDuration === duration ? colors.accent : colors.cardBorder,
                        color: selectedDuration === duration ? colors.accent : colors.textPrimary
                      }}
                    >
                      {duration}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 2 - Region Visibility */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Region Visibility
            </h4>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => {
                const isSelected = selectedRegions.includes(region);
                return (
                  <button
                    key={region}
                    onClick={() => toggleRegion(region)}
                    className="px-4 py-2 rounded-lg border text-sm font-medium transition-all"
                    style={{
                      backgroundColor: isSelected ? `${colors.accent}15` : colors.cardBg,
                      borderColor: isSelected ? colors.accent : colors.cardBorder,
                      color: isSelected ? colors.accent : colors.textPrimary
                    }}
                  >
                    {region}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Section 3 - Included Services */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Included Services
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {services.map((service) => {
                const isSelected = selectedServices.includes(service.name);
                const Icon = service.icon;
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.name)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg border transition-all"
                    style={{
                      backgroundColor: isSelected ? `${colors.accent}15` : colors.cardBg,
                      borderColor: isSelected ? colors.accent : colors.cardBorder
                    }}
                  >
                    <div 
                      className="p-2 rounded-lg"
                      style={{
                        backgroundColor: isSelected ? `${colors.accent}20` : `${colors.textSecondary}10`
                      }}
                    >
                      <Icon 
                        className="w-4 h-4" 
                        style={{ color: isSelected ? colors.accent : colors.textSecondary }}
                      />
                    </div>
                    <span 
                      className="text-sm font-medium"
                      style={{ color: isSelected ? colors.accent : colors.textPrimary }}
                    >
                      {service.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Section 4 - Add-on Services */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Add-on Services
            </h4>
            <div className="space-y-3 mb-4">
              {addons.map((addon, idx) => (
                <div 
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg border"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder
                  }}
                >
                  <input
                    type="text"
                    value={addon.name}
                    className="flex-1 bg-transparent text-sm"
                    style={{ color: colors.textPrimary }}
                    readOnly
                  />
                  <input
                    type="text"
                    value={`$${addon.price}`}
                    className="w-24 bg-transparent text-sm font-mono text-right"
                    style={{ color: colors.textPrimary }}
                    readOnly
                  />
                  <button 
                    className="p-1 rounded transition-all"
                    style={{ color: colors.textSecondary }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = colors.danger;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = colors.textSecondary;
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button 
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all"
              style={{
                backgroundColor: colors.cardBg,
                borderColor: colors.cardBorder,
                color: colors.textSecondary
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = colors.accent;
                e.currentTarget.style.color = colors.accent;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = colors.cardBorder;
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Extra Service</span>
            </button>
          </div>
          
          {/* Section 5 - Pricing */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Pricing
            </h4>
            <div className="space-y-4">
              {/* Base Price */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                  Base Price
                </label>
                <div className="relative">
                  <span 
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium"
                    style={{ color: colors.textSecondary }}
                  >
                    $
                  </span>
                  <input
                    type="text"
                    defaultValue="3,850"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border text-sm font-mono transition-all"
                    style={{
                      backgroundColor: colors.cardBg,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary
                    }}
                  />
                </div>
              </div>
              
              {/* Seasonal Multiplier */}
              <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: colors.cardBorder }}>
                <div>
                  <div className="text-sm font-medium mb-1" style={{ color: colors.textPrimary }}>
                    Seasonal Multiplier
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    Apply peak season pricing
                  </div>
                </div>
                <button
                  className="relative w-12 h-6 rounded-full transition-all"
                  style={{ backgroundColor: colors.accent }}
                >
                  <div 
                    className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white shadow-lg"
                  />
                </button>
              </div>
              
              {/* Peak Season Range */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: colors.textSecondary }}>
                  Peak Season Dates
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textSecondary }} />
                    <input
                      type="text"
                      defaultValue="Jun 1, 2026"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary
                      }}
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: colors.textSecondary }} />
                    <input
                      type="text"
                      defaultValue="Sep 15, 2026"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm transition-all"
                      style={{
                        backgroundColor: colors.cardBg,
                        borderColor: colors.cardBorder,
                        color: colors.textPrimary
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Section 6 - Media */}
          <div 
            className="rounded-xl p-6 border"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder
            }}
          >
            <h4 className="text-sm font-bold uppercase tracking-wide mb-4" style={{ color: colors.textPrimary }}>
              Package Images
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all"
                  style={{
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = colors.accent;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = colors.cardBorder;
                  }}
                >
                  <Upload className="w-6 h-6 mb-2" style={{ color: colors.textSecondary }} />
                  <span className="text-xs" style={{ color: colors.textSecondary }}>Upload</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t" style={{ borderColor: colors.cardBorder }}>
        <button 
          className="px-6 py-2.5 rounded-lg border text-sm font-medium transition-all"
          style={{
            backgroundColor: colors.background,
            borderColor: colors.cardBorder,
            color: colors.textPrimary
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = colors.textSecondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = colors.cardBorder;
          }}
        >
          Save as Draft
        </button>
        <button 
          className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-all"
          style={{
            background: `linear-gradient(to right, ${colors.accent}, #00B39F)`,
            boxShadow: `0 10px 25px -5px ${colors.accent}30`
          }}
        >
          Publish Package
        </button>
      </div>
    </div>
  );
}