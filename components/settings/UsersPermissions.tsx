import { Plus, Edit, Trash2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  role: 'Super Admin' | 'Manager' | 'Agent' | 'Viewer';
  regions: string[];
  lastActive: string;
  status: boolean;
}

interface Permission {
  role: string;
  fleet: string;
  packages: string;
  bookings: string;
  pricing: string;
  crm: string;
  regions: string;
  settings: string;
}

const users: User[] = [
  {
    id: 'U-001',
    name: 'Sarah Mitchell',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    email: 'sarah.mitchell@yachtcharter.com',
    role: 'Super Admin',
    regions: ['All Regions'],
    lastActive: '2 hours ago',
    status: true
  },
  {
    id: 'U-002',
    name: 'James Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    email: 'james.rodriguez@yachtcharter.com',
    role: 'Manager',
    regions: ['Dubai', 'Monaco'],
    lastActive: '5 hours ago',
    status: true
  },
  {
    id: 'U-003',
    name: 'Emma Thompson',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    email: 'emma.thompson@yachtcharter.com',
    role: 'Agent',
    regions: ['Barcelona', 'Athens'],
    lastActive: '1 day ago',
    status: true
  },
  {
    id: 'U-004',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    email: 'michael.chen@yachtcharter.com',
    role: 'Agent',
    regions: ['Miami', 'Maldives'],
    lastActive: '3 days ago',
    status: false
  },
  {
    id: 'U-005',
    name: 'Lisa Anderson',
    avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    email: 'lisa.anderson@yachtcharter.com',
    role: 'Viewer',
    regions: ['All Regions'],
    lastActive: '1 week ago',
    status: true
  }
];

const permissions: Permission[] = [
  { role: 'Super Admin', fleet: 'Full', packages: 'Full', bookings: 'Full', pricing: 'Full', crm: 'Full', regions: 'Full', settings: 'Full' },
  { role: 'Manager', fleet: 'Edit', packages: 'Edit', bookings: 'Edit', pricing: 'Edit', crm: 'Edit', regions: 'Edit', settings: 'View' },
  { role: 'Agent', fleet: 'View', packages: 'View', bookings: 'Edit', pricing: 'View', crm: 'Edit', regions: 'View', settings: 'None' },
  { role: 'Viewer', fleet: 'View', packages: 'View', bookings: 'View', pricing: 'View', crm: 'View', regions: 'View', settings: 'None' }
];

const roleColors: Record<string, string> = {
  'Super Admin': '#00C9B1',
  'Manager': '#F4A924',
  'Agent': '#8B5CF6',
  'Viewer': '#6B7280'
};

export function UsersPermissions() {
  const { colors } = useTheme();
  
  return (
    <div className="space-y-6">
      {/* Team Members Section */}
      <div 
        className="rounded-lg border p-4 md:p-6"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold" style={{ color: colors.textPrimary }}>
            Team Members
          </h2>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:scale-105"
            style={{
              background: `linear-gradient(to right, ${colors.accent}, #00B39F)`
            }}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Invite User</span>
          </button>
        </div>
        
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr 
                className="border-b text-left"
                style={{ borderColor: colors.cardBorder }}
              >
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>User</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Email</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Role</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Regions</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Last Active</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Status</th>
                <th className="pb-3 text-xs font-semibold" style={{ color: colors.textSecondary }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr 
                  key={user.id}
                  className="border-b"
                  style={{ borderColor: colors.cardBorder }}
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium" style={{ color: colors.textPrimary }}>
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 text-sm" style={{ color: colors.textSecondary }}>
                    {user.email}
                  </td>
                  <td className="py-4">
                    <span
                      className="px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: `${roleColors[user.role]}20`,
                        color: roleColors[user.role]
                      }}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {user.regions.slice(0, 2).map((region, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            backgroundColor: colors.background,
                            color: colors.textSecondary
                          }}
                        >
                          {region}
                        </span>
                      ))}
                      {user.regions.length > 2 && (
                        <span
                          className="px-2 py-0.5 rounded text-xs"
                          style={{
                            backgroundColor: colors.background,
                            color: colors.textSecondary
                          }}
                        >
                          +{user.regions.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 text-sm" style={{ color: colors.textSecondary }}>
                    {user.lastActive}
                  </td>
                  <td className="py-4">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked={user.status} />
                      <div 
                        className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: user.status ? colors.accent : colors.textSecondary
                        }}
                      />
                    </label>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 rounded transition-all hover:scale-110"
                        style={{ color: colors.textSecondary }}
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 rounded transition-all hover:scale-110"
                        style={{ color: colors.textSecondary }}
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 rounded-lg border"
              style={{
                backgroundColor: colors.background,
                borderColor: colors.cardBorder
              }}
            >
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm mb-1" style={{ color: colors.textPrimary }}>
                    {user.name}
                  </div>
                  <div className="text-xs mb-2 truncate" style={{ color: colors.textSecondary }}>
                    {user.email}
                  </div>
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-semibold"
                    style={{
                      backgroundColor: `${roleColors[user.role]}20`,
                      color: roleColors[user.role]
                    }}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {user.regions.map((region, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-xs"
                    style={{
                      backgroundColor: colors.cardBg,
                      color: colors.textSecondary
                    }}
                  >
                    {region}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: colors.cardBorder }}>
                <div className="flex items-center gap-3">
                  <span className="text-xs" style={{ color: colors.textSecondary }}>
                    {user.lastActive}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={user.status} />
                    <div 
                      className="w-11 h-6 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={{
                        backgroundColor: user.status ? colors.accent : colors.textSecondary
                      }}
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-2 rounded"
                    style={{ color: colors.textSecondary, backgroundColor: `${colors.textSecondary}10` }}
                  >
                    <Edit className="w-4 h-4" />
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
      
      {/* Role Permissions Matrix */}
      <div 
        className="rounded-lg border p-4 md:p-6"
        style={{
          backgroundColor: colors.cardBg,
          borderColor: colors.cardBorder
        }}
      >
        <h3 className="text-lg md:text-xl font-bold mb-4" style={{ color: colors.textPrimary }}>
          Role Permissions Matrix
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr 
                className="border-b"
                style={{ borderColor: colors.cardBorder }}
              >
                <th className="pb-3 pr-4 text-left text-xs font-semibold" style={{ color: colors.textSecondary }}>Role</th>
                <th className="pb-3 px-2 text-center text-xs font-semibold" style={{ color: colors.textSecondary }}>Fleet</th>
                <th className="pb-3 px-2 text-center text-xs font-semibold" style={{ color: colors.textSecondary }}>Packages</th>
                <th className="pb-3 px-2 text-center text-xs font-semibold" style={{ color: colors.textSecondary }}>Bookings</th>
                <th className="pb-3 px-2 text-center text-xs font-semibold" style={{ color: colors.textSecondary }}>Pricing</th>
                <th className="pb-3 px-2 text-center text-xs font-semibold" style={{ color: colors.textSecondary }}>CRM</th>
                <th className="pb-3 px-2 text-center text-xs font-semibold" style={{ color: colors.textSecondary }}>Regions</th>
                <th className="pb-3 px-2 text-center text-xs font-semibold" style={{ color: colors.textSecondary }}>Settings</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, index) => (
                <tr 
                  key={perm.role}
                  className="border-b"
                  style={{ 
                    borderColor: colors.cardBorder,
                    backgroundColor: index % 2 === 0 ? 'transparent' : `${colors.background}80`
                  }}
                >
                  <td className="py-3 pr-4">
                    <span
                      className="inline-block px-2 py-1 rounded text-xs font-semibold"
                      style={{
                        backgroundColor: `${roleColors[perm.role]}20`,
                        color: roleColors[perm.role]
                      }}
                    >
                      {perm.role}
                    </span>
                  </td>
                  {(['fleet', 'packages', 'bookings', 'pricing', 'crm', 'regions', 'settings'] as const).map((module) => (
                    <td key={module} className="py-3 px-2 text-center">
                      <select
                        defaultValue={perm[module]}
                        className="px-2 py-1 rounded text-xs border"
                        style={{
                          backgroundColor: colors.background,
                          borderColor: colors.cardBorder,
                          color: colors.textPrimary
                        }}
                      >
                        <option value="None">None</option>
                        <option value="View">View</option>
                        <option value="Edit">Edit</option>
                        <option value="Full">Full</option>
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
