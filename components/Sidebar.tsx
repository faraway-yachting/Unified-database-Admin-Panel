import { LucideIcon, Menu, X } from 'lucide-react';
import { Link } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

interface SidebarNavItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  href: string;
  onClick?: () => void;
}

function SidebarNavItem({ icon: Icon, label, active = false, href, onClick }: SidebarNavItemProps) {
  const { colors } = useTheme();
  
  return (
    <Link
      to={href}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all group"
      style={{
        backgroundColor: active ? `${colors.accent}15` : 'transparent',
        color: active ? colors.accent : colors.textSecondary,
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = colors.hoverBg;
          e.currentTarget.style.color = colors.textPrimary;
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = colors.textSecondary;
        }
      }}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

interface SidebarProps {
  navItems: Array<{
    icon: LucideIcon;
    label: string;
    active?: boolean;
    href: string;
  }>;
  adminName: string;
  adminRole: string;
  adminAvatar: string;
}

export function Sidebar({ navItems, adminName, adminRole, adminAvatar }: SidebarProps) {
  const { colors } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg shadow-lg"
        style={{
          backgroundColor: colors.cardBg,
          color: colors.textPrimary,
          border: `1px solid ${colors.cardBorder}`
        }}
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 bottom-0 w-[240px] border-r flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder
        }}
      >
        {/* Logo */}
        <div 
          className="h-[72px] flex items-center px-6 border-b"
          style={{ borderColor: colors.cardBorder }}
        >
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: `linear-gradient(to bottom right, ${colors.accent}, ${colors.accentGold})`
              }}
            >
              <svg className="w-5 h-5" fill={colors.background} viewBox="0 0 24 24">
                <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: colors.textPrimary }}>YachtPortal</div>
              <div className="text-xs font-mono" style={{ color: colors.accent }}>ADMIN</div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarNavItem 
              key={item.label} 
              {...item} 
              onClick={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </nav>
        
        {/* Admin Profile */}
        <div 
          className="p-4 border-t"
          style={{ borderColor: colors.cardBorder }}
        >
          <div 
            className="flex items-center gap-3 p-3 rounded-lg transition-all cursor-pointer"
            style={{ backgroundColor: `${colors.cardBorder}` }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = colors.hoverBg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.cardBorder}`;
            }}
          >
            <img 
              src={adminAvatar} 
              alt={adminName}
              className="w-10 h-10 rounded-full border-2"
              style={{ borderColor: colors.accent }}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate" style={{ color: colors.textPrimary }}>{adminName}</div>
              <div className="text-xs" style={{ color: colors.textSecondary }}>{adminRole}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
