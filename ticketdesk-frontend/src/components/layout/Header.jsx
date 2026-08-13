import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { KeyRound, LogOut, Menu, Moon, Sun, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { RoleBadge } from '../common/RoleBadge';

export const Header = ({ onToggleMobileSidebar, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';

  return (
    <header className={`sticky-top py-2.5 px-4 shadow-sm z-2 transition-all ${isDark ? 'bg-slate-900 border-bottom border-slate-800 text-white' : 'bg-white border-bottom border-slate-200 text-slate-900'}`}>
      <div className="d-flex align-items-center justify-content-between">
        {/* Left Side: Mobile Menu + Page Title */}
        <div className="d-flex align-items-center gap-3">
          <button
            className={`btn btn-sm border p-2 rounded-3 ${isDark ? 'btn-dark border-slate-700 text-slate-200' : 'btn-light border-slate-200 text-slate-600'} d-lg-none`}
            onClick={onToggleMobileSidebar}
            aria-label="Toggle Navigation"
          >
            <Menu size={20} />
          </button>
          <div>
            <h4 className={`fw-bold mb-0 text-capitalize ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
          </div>
        </div>

        {/* Right Side: Light/Dark Mode Toggle Button + User Profile */}
        <div className="d-flex align-items-center gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`btn btn-sm d-flex align-items-center gap-2 px-3 py-1.5 rounded-pill border fw-medium transition-all shadow-sm ${
              isDark
                ? 'btn-outline-light border-slate-700 bg-slate-800 text-warning hover-bg-slate-700'
                : 'btn-outline-secondary border-slate-300 bg-slate-100 text-slate-700 hover-bg-slate-200'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle Theme Mode"
          >
            {isDark ? (
              <>
                <Sun size={17} className="text-warning fill-warning" />
                <span className="text-xs d-none d-sm-inline fw-semibold text-slate-200">Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={17} className="text-indigo-600 fill-indigo-600" />
                <span className="text-xs d-none d-sm-inline fw-semibold text-slate-700">Dark Mode</span>
              </>
            )}
          </button>

          {/* Logged In User Profile Dropdown */}
          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle
                as="div"
                className={`d-flex align-items-center gap-2.5 cursor-pointer select-none p-1 rounded-pill transition-all ${
                  isDark ? 'hover-bg-slate-800' : 'hover-bg-slate-100'
                }`}
                id="user-dropdown"
              >
                <div
                  className="avatar bg-primary text-white rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: 38, height: 38 }}
                >
                  {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
                <div className="d-none d-md-block text-start pe-2">
                  <div className={`fw-semibold text-sm lh-1 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                    {user.fullName}
                  </div>
                  <small className={`text-2xs font-monospace ${isDark ? 'text-slate-400' : 'text-muted'}`}>
                    {user.username}
                  </small>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className={`border-0 shadow-lg rounded-4 p-2 mt-2 ${isDark ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'bg-white'}`} style={{ minWidth: 220 }}>
                <div className={`px-3 py-2 border-bottom mb-1 ${isDark ? 'border-slate-700' : 'border-slate-100'}`}>
                  <p className={`fw-bold mb-0 text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{user.fullName}</p>
                  <p className={`mb-1 text-xs ${isDark ? 'text-slate-400' : 'text-muted'}`}>{user.email}</p>
                  <RoleBadge role={user.role} />
                </div>

                <Dropdown.Item
                  as={Link}
                  to="/profile"
                  className={`rounded-3 py-2 text-sm d-flex align-items-center gap-2 ${isDark ? 'text-slate-200 hover-bg-slate-700' : ''}`}
                >
                  <User size={16} /> My Profile
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/profile#password"
                  className={`rounded-3 py-2 text-sm d-flex align-items-center gap-2 ${isDark ? 'text-slate-200 hover-bg-slate-700' : ''}`}
                >
                  <KeyRound size={16} /> Change Password
                </Dropdown.Item>

                <Dropdown.Divider className={`my-1 ${isDark ? 'border-slate-700' : ''}`} />

                <Dropdown.Item
                  onClick={() => logout()}
                  className="rounded-3 py-2 text-sm text-danger d-flex align-items-center gap-2"
                >
                  <LogOut size={16} /> Sign Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    </header>
  );
};
