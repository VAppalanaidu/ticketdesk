import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Headphones,
  LayoutDashboard,
  LogOut,
  PlusCircle,
  Ticket,
  User,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

export const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleLogout = async () => {
    onCloseMobile();
    await logout();
  };

  const isAdmin = user?.role === 'ADMIN';

  const getInitials = (u) => {
    if (!u) return 'U';
    if (u.firstName && u.lastName) {
      return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
    }
    if (u.fullName) {
      const parts = u.fullName.trim().split(' ');
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
      }
      return parts[0][0].toUpperCase();
    }
    if (u.username) return u.username[0].toUpperCase();
    return 'U';
  };

  const getRoleLabel = (role) => {
    if (role === 'ADMIN') return 'Administrator';
    if (role === 'SUPPORT_ENGINEER' || role === 'SUPPORT') return 'Support Engineer';
    if (role === 'EMPLOYEE') return 'Employee';
    return role || 'User';
  };

  return (
    <>
      {mobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-3 d-lg-none"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`sidebar d-flex flex-column position-fixed top-0 start-0 vh-100 z-3 transition-all ${
          mobileOpen ? 'translate-x-0' : 'translate-x-mobile-hide'
        } d-lg-flex`}
        style={{ width: '260px' }}
      >
        {/* Sidebar Brand Header */}
        <div className={`p-4 border-bottom d-flex align-items-center justify-content-between ${
          isDark ? 'border-slate-800' : 'border-slate-800'
        }`}>
          <div className="d-flex align-items-center gap-2.5">
            <div className="bg-primary p-2 rounded-3 text-white shadow-sm d-flex align-items-center justify-content-center">
              <Headphones size={22} />
            </div>
            <div>
              <h5 className="fw-bold mb-0 text-white font-monospace tracking-wide">TicketDesk</h5>
              <span className="text-2xs text-slate-400 text-uppercase font-monospace">IT Support Portal</span>
            </div>
          </div>
          <button
            className="btn btn-sm btn-link text-slate-400 p-0 d-lg-none"
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Section */}
        <div className="flex-grow-1 px-3 py-3 overflow-y-auto">
          <div className="text-2xs font-monospace text-slate-400 text-uppercase fw-semibold mb-2 px-3">
            Menu
          </div>
          <nav className="nav flex-column gap-1">
            <NavLink
              to="/dashboard"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `nav-link sidebar-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium ${
                  isActive ? 'active bg-primary text-white' : 'text-slate-300 hover-bg-slate-800'
                }`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/tickets"
              end
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `nav-link sidebar-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium ${
                  isActive ? 'active bg-primary text-white' : 'text-slate-300 hover-bg-slate-800'
                }`
              }
            >
              <Ticket size={18} />
              <span>Tickets</span>
            </NavLink>

            <NavLink
              to="/tickets/create"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `nav-link sidebar-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium ${
                  isActive ? 'active bg-primary text-white' : 'text-slate-300 hover-bg-slate-800'
                }`
              }
            >
              <PlusCircle size={18} />
              <span>Create Ticket</span>
            </NavLink>

            {/* Administration Section: Strictly Admin Only */}
            {isAdmin && (
              <>
                <div className="text-2xs font-monospace text-slate-400 text-uppercase fw-semibold mt-4 mb-2 px-3">
                  Administration
                </div>
                <NavLink
                  to="/users"
                  end
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `nav-link sidebar-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium ${
                      isActive ? 'active bg-primary text-white' : 'text-slate-300 hover-bg-slate-800'
                    }`
                  }
                >
                  <Users size={18} />
                  <span>User Directory</span>
                </NavLink>

                <NavLink
                  to="/users/add-support-engineer"
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `nav-link sidebar-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium ${
                      isActive ? 'active bg-primary text-white' : 'text-slate-300 hover-bg-slate-800'
                    }`
                  }
                >
                  <UserPlus size={18} />
                  <span>+ Add Support Engineer</span>
                </NavLink>
              </>
            )}
          </nav>

          <div className="text-2xs font-monospace text-slate-400 text-uppercase fw-semibold mt-4 mb-2 px-3">
            Account
          </div>
          <nav className="nav flex-column gap-1">
            <NavLink
              to="/profile"
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `nav-link sidebar-link d-flex align-items-center gap-3 px-3 py-2.5 rounded-3 fw-medium ${
                  isActive ? 'active bg-primary text-white' : 'text-slate-300 hover-bg-slate-800'
                }`
              }
            >
              <User size={18} />
              <span>My Profile</span>
            </NavLink>
          </nav>
        </div>

        {/* Integrated Bottom Profile & Sign Out Footer */}
        <div className="p-3 border-top border-slate-800 mt-auto">
          {user && (
            <div className="d-flex align-items-center gap-3 px-2 py-2 mb-2 rounded-3 hover-bg-slate-800 transition-all cursor-pointer">
              <div className="position-relative">
                <div
                  className="avatar bg-primary text-white rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: 38, height: 38, fontSize: '14px' }}
                >
                  {getInitials(user)}
                </div>
                <span className="position-absolute bottom-0 end-0 p-1 bg-success border border-2 border-dark rounded-circle" />
              </div>
              <div className="overflow-hidden me-auto">
                <h6 className="fw-semibold mb-0 text-white text-truncate text-sm lh-sm">
                  {user.fullName || user.username}
                </h6>
                <span className="text-2xs text-slate-400 d-block text-truncate">
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2 text-xs fw-semibold transition-all"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
