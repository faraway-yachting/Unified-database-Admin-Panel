import { useState } from 'react';
import { X, ExternalLink, GripVertical, Plus, Eye, EyeOff, Trash2, Upload } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { Region } from './RegionsList';

interface Package {
  id: string;
  name: string;
  duration: string;
  price: number;
  visible: boolean;
}

interface Yacht {
  id: string;
  name: string;
  type: string;
  thumbnail: string;
  availability: 'available' | 'booked' | 'maintenance';
}

interface RegionDetailPanelProps {
  region: Region;
  onClose: () => void;
}

export function RegionDetailPanel({ region, onClose }: RegionDetailPanelProps) {
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<'packages' | 'fleet' | 'settings'>('packages');
  
  // Mock data
  const packages: Package[] = [
    { id: 'P-001', name: 'Sunset Experience', duration: '4 hours', price: 3500, visible: true },
    { id: 'P-002', name: 'Full Day Charter', duration: '8 hours', price: 6800, visible: true },
    { id: 'P-003', name: 'Island Hopping', duration: '6 hours', price: 5200, visible: false },
    { id: 'P-004', name: 'Romantic Evening', duration: '3 hours', price: 4200, visible: true },
  ];
  
  const yachts: Yacht[] = [
    { 
      id: 'Y-001', 
      name: 'Azure Dream', 
      type: 'Motor Yacht', 
      thumbnail: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=200&h=150&fit=crop',
      availability: 'available'
    },
    { 
      id: 'Y-002', 
      name: 'Ocean Majesty', 
      type: 'Sailing Yacht', 
      thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=150&fit=crop',
      availability: 'booked'
    },
    { 
      id: 'Y-003', 
      name: 'Sea Harmony', 
      type: 'Catamaran', 
      thumbnail: 'https://images.unsplash.com/photo-1605281317010-fe5ffe798166?w=200&h=150&fit=crop',
      availability: 'available'
    },
  ];
  
  const tabs = [
    { id: 'packages' as const, label: 'Packages' },
    { id: 'fleet' as const, label: 'Fleet' },
    { id: 'settings' as const, label: 'Site Settings' },
  ];
  
  return (
    <div 
      className="rounded-lg border overflow-hidden"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      {/* Header */}
      <div 
        className="p-4 md:p-6 border-b"
        style={{ borderColor: colors.cardBorder }}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl md:text-4xl">{region.flag}</span>
            <div>
              <h3 
                className="text-xl md:text-2xl font-bold"
                style={{ color: colors.textPrimary }}
              >
                {region.city}, {region.country}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span 
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {region.siteUrl}
                </span>
                <div
                  className="px-2 py-0.5 rounded text-xs font-semibold"
                  style={{
                    backgroundColor: region.status === 'live' ? `${colors.accent}20` : `${colors.textSecondary}20`,
                    color: region.status === 'live' ? colors.accent : colors.textSecondary
                  }}
                >
                  {region.status.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={region.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg border transition-all hover:scale-105 text-sm"
              style={{
                borderColor: colors.cardBorder,
                color: colors.textPrimary,
                backgroundColor: colors.background
              }}
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Visit Site</span>
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-all hover:scale-110"
              style={{
                color: colors.textSecondary,
                backgroundColor: colors.background
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap"
              style={{
                backgroundColor: activeTab === tab.id ? colors.accent : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : colors.textSecondary
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 md:p-6">
        {/* Packages Tab */}
        {activeTab === 'packages' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                Assigned Packages
              </h4>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(to right, ${colors.accent}, #00B39F)`
                }}
              >
                <Plus className="w-4 h-4" />
                Assign Package
              </button>
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr 
                    className="border-b text-left"
                    style={{ borderColor: colors.cardBorder }}
                  >
                    <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary, width: '40px' }}></th>
                    <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Package Name</th>
                    <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Duration</th>
                    <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Price</th>
                    <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Visibility</th>
                    <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}></th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr 
                      key={pkg.id}
                      className="border-b"
                      style={{ borderColor: colors.cardBorder }}
                    >
                      <td className="py-3">
                        <GripVertical className="w-4 h-4 cursor-move" style={{ color: colors.textSecondary }} />
                      </td>
                      <td className="py-3 text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {pkg.name}
                      </td>
                      <td className="py-3 text-sm" style={{ color: colors.textSecondary }}>
                        {pkg.duration}
                      </td>
                      <td className="py-3 text-sm font-mono font-semibold" style={{ color: colors.textPrimary }}>
                        ${pkg.price.toLocaleString()}
                      </td>
                      <td className="py-3">
                        <button
                          className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-all"
                          style={{
                            backgroundColor: pkg.visible ? `${colors.accent}20` : `${colors.textSecondary}20`,
                            color: pkg.visible ? colors.accent : colors.textSecondary
                          }}
                        >
                          {pkg.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {pkg.visible ? 'Visible' : 'Hidden'}
                        </button>
                      </td>
                      <td className="py-3">
                        <button
                          className="p-2 rounded hover:bg-opacity-10 transition-all"
                          style={{ color: colors.textSecondary }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Mobile Cards */}
            <div className="md:hidden space-y-3">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-4 rounded-lg border"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                        {pkg.name}
                      </div>
                      <div className="text-xs" style={{ color: colors.textSecondary }}>
                        {pkg.duration}
                      </div>
                    </div>
                    <GripVertical className="w-4 h-4 cursor-move flex-shrink-0" style={{ color: colors.textSecondary }} />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-mono font-bold" style={{ color: colors.textPrimary }}>
                      ${pkg.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: pkg.visible ? `${colors.accent}20` : `${colors.textSecondary}20`,
                          color: pkg.visible ? colors.accent : colors.textSecondary
                        }}
                      >
                        {pkg.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      </button>
                      <button
                        className="p-2 rounded"
                        style={{ color: colors.textSecondary, backgroundColor: `${colors.textSecondary}10` }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Fleet Tab */}
        {activeTab === 'fleet' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold" style={{ color: colors.textPrimary }}>
                Assigned Yachts
              </h4>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                style={{
                  background: `linear-gradient(to right, ${colors.accent}, #00B39F)`
                }}
              >
                <Plus className="w-4 h-4" />
                Assign Yacht
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {yachts.map((yacht) => (
                <div
                  key={yacht.id}
                  className="rounded-lg border overflow-hidden"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder
                  }}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={yacht.thumbnail}
                      alt={yacht.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold backdrop-blur-sm"
                      style={{
                        backgroundColor: yacht.availability === 'available' 
                          ? `${colors.accent}90` 
                          : yacht.availability === 'booked'
                          ? `${colors.gold}90`
                          : `${colors.textSecondary}90`,
                        color: '#FFFFFF'
                      }}
                    >
                      {yacht.availability.charAt(0).toUpperCase() + yacht.availability.slice(1)}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <div className="font-semibold mb-1" style={{ color: colors.textPrimary }}>
                      {yacht.name}
                    </div>
                    <div className="text-xs mb-3" style={{ color: colors.textSecondary }}>
                      {yacht.type}
                    </div>
                    
                    <button
                      className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all"
                      style={{
                        backgroundColor: `${colors.textSecondary}10`,
                        color: colors.textSecondary
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div>
            <h4 className="text-lg font-bold mb-4" style={{ color: colors.textPrimary }}>
              Site Configuration
            </h4>
            
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                  Site Title
                </label>
                <input
                  type="text"
                  defaultValue={`Yacht Charter ${region.city}`}
                  className="w-full px-4 py-2.5 rounded-lg border text-sm"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary
                  }}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  defaultValue="Luxury yacht charter experiences in the region's most beautiful waters."
                  className="w-full px-4 py-2.5 rounded-lg border text-sm"
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.cardBorder,
                    color: colors.textPrimary
                  }}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    defaultValue={`info@yachtcharter-${region.city.toLowerCase()}.com`}
                    className="w-full px-4 py-2.5 rounded-lg border text-sm"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary
                    }}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    defaultValue="+1 (555) 123-4567"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary
                    }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                    Currency
                  </label>
                  <select
                    defaultValue="USD"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary
                    }}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="AED">AED (د.إ)</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                    Language
                  </label>
                  <select
                    defaultValue="en"
                    className="w-full px-4 py-2.5 rounded-lg border text-sm"
                    style={{
                      backgroundColor: colors.background,
                      borderColor: colors.cardBorder,
                      color: colors.textPrimary
                    }}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="ar">Arabic</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: colors.textPrimary }}>
                  Hero Banner Image
                </label>
                <div
                  className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all hover:scale-[1.02]"
                  style={{ borderColor: colors.cardBorder }}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: colors.textSecondary }} />
                  <div className="text-sm" style={{ color: colors.textPrimary }}>
                    Click to upload or drag and drop
                  </div>
                  <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    PNG, JPG or WebP (max. 2MB)
                  </div>
                </div>
              </div>
              
              <div className="pt-4">
                <button
                  className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
                  style={{
                    background: `linear-gradient(to right, ${colors.accent}, #00B39F)`
                  }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
