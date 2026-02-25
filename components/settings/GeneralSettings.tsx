import { Upload, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useState } from 'react';

export function GeneralSettings() {
  const { colors } = useTheme();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);
  
  return (
    <div 
      className="rounded-lg border p-4 md:p-6"
      style={{
        backgroundColor: colors.cardBg,
        borderColor: colors.cardBorder
      }}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-6" style={{ color: colors.textPrimary }}>
        General Settings
      </h2>
      
      <div className="space-y-6">
        {/* Portal Name */}
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
            Portal Name
          </label>
          <input
            type="text"
            defaultValue="Yacht Charter Portal"
            className="w-full px-4 py-3 rounded-lg border text-sm"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.cardBorder,
              color: colors.textPrimary
            }}
          />
        </div>
        
        {/* Two column grid for uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Company Logo */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Company Logo
            </label>
            <div
              className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all hover:scale-[1.02]"
              style={{ borderColor: colors.cardBorder }}
            >
              {logoPreview ? (
                <div className="relative">
                  <img src={logoPreview} alt="Logo preview" className="max-h-24 mx-auto" />
                  <button
                    onClick={() => setLogoPreview(null)}
                    className="absolute -top-2 -right-2 p-1 rounded-full text-white"
                    style={{ backgroundColor: colors.textSecondary }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: colors.textSecondary }} />
                  <div className="text-sm mb-1" style={{ color: colors.textPrimary }}>
                    Click to upload or drag and drop
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    PNG or SVG (max. 2MB)
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Favicon */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Favicon
            </label>
            <div
              className="relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all hover:scale-[1.02]"
              style={{ borderColor: colors.cardBorder }}
            >
              {faviconPreview ? (
                <div className="relative">
                  <img src={faviconPreview} alt="Favicon preview" className="w-16 h-16 mx-auto" />
                  <button
                    onClick={() => setFaviconPreview(null)}
                    className="absolute -top-2 -right-2 p-1 rounded-full text-white"
                    style={{ backgroundColor: colors.textSecondary }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: colors.textSecondary }} />
                  <div className="text-sm mb-1" style={{ color: colors.textPrimary }}>
                    Click to upload
                  </div>
                  <div className="text-xs" style={{ color: colors.textSecondary }}>
                    ICO or PNG 32x32
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Two column grid for dropdowns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Language */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Default Language
            </label>
            <select
              defaultValue="en"
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary
              }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="ar">Arabic</option>
            </select>
          </div>
          
          {/* Default Timezone */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Default Timezone
            </label>
            <select
              defaultValue="utc"
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary
              }}
            >
              <option value="utc">UTC (GMT+0)</option>
              <option value="est">Eastern Time (GMT-5)</option>
              <option value="cet">Central European Time (GMT+1)</option>
              <option value="gst">Gulf Standard Time (GMT+4)</option>
              <option value="ist">Indian Standard Time (GMT+5:30)</option>
            </select>
          </div>
        </div>
        
        {/* Two column grid for more settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Default Currency */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Default Currency
            </label>
            <select
              defaultValue="usd"
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary
              }}
            >
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
              <option value="gbp">GBP (£)</option>
              <option value="aed">AED (د.إ)</option>
            </select>
          </div>
          
          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Date Format
            </label>
            <select
              defaultValue="mdy"
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary
              }}
            >
              <option value="mdy">MM/DD/YYYY</option>
              <option value="dmy">DD/MM/YYYY</option>
              <option value="ymd">YYYY-MM-DD</option>
            </select>
          </div>
        </div>
        
        {/* Two column grid for contact info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Support Email */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Support Email
            </label>
            <input
              type="email"
              defaultValue="support@yachtcharter.com"
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary
              }}
            />
          </div>
          
          {/* Support Phone */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: colors.textPrimary }}>
              Support Phone
            </label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-4 py-3 rounded-lg border text-sm"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder,
                color: colors.textPrimary
              }}
            />
          </div>
        </div>
        
        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <button
            className="px-6 py-3 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: `linear-gradient(to right, ${colors.accent}, #00B39F)`
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
