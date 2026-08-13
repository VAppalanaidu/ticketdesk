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
import { RoleBadge } from '../common/RoleBadge';

export const Sidebar = ({ mobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    onCloseMobile();
    await logout();
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <>
      {mobileOpen && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-3 d-lg-none"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`sidebar bg-slate-900 text-white d-flex flex-column position-fixed top-0 start-0 vh-100 z-3 transition-all ${
          mobileOpen ? 'translate-x-0' : 'translate-x-mobile-hide'
        } d-lg-flex`}
        style={{ width: '260px' }}
      >
        <div className="p-4 border-bottom border-slate-800 d-flex align-items-center justify-content-between">
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

        {user && (
          <div className="p-3 mx-3 my-3 bg-slate-800 rounded-3 border border-slate-700">
            <div className="d-flex align-items-center gap-3">
              <div className="avatar bg-primary text-white rounded-circle fw-bold d-flex align-items-center justify-content-center" style={{ width: 40, height: 40 }}>
                {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
              </div>
              <div className="overflow-hidden">
                <h6 className="fw-bold mb-0 text-white text-truncate">{user.fullName}</h6>
                <div className="mt-1">
                  <RoleBadge role={user.role} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex-grow-1 px-3 py-2 overflow-y-auto">
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

        <div className="p-3 border-top border-slate-800">
          <button
            onClick={handleLogout}
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 py-2 text-sm fw-semibold"
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
