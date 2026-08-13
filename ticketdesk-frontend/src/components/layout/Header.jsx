import React from 'react';
import { Link } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { KeyRound, LogOut, Menu, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { RoleBadge } from '../common/RoleBadge';

export const Header = ({ onToggleMobileSidebar, title = 'Dashboard' }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-bottom border-slate-200 sticky-top py-2.5 px-4 shadow-sm z-2">
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          <button
            className="btn btn-sm btn-light border p-2 text-slate-600 d-lg-none rounded-3"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle Navigation"
          >
            <Menu size={20} />
          </button>
          <div>
            <h4 className="fw-bold text-slate-900 mb-0 text-capitalize">{title}</h4>
          </div>
        </div>

        <div className="d-flex align-items-center gap-3">
          {user && (
            <Dropdown align="end">
              <Dropdown.Toggle
                as="div"
                className="d-flex align-items-center gap-2.5 cursor-pointer select-none p-1 rounded-pill hover-bg-slate-100 transition-all"
                id="user-dropdown"
              >
                <div
                  className="avatar bg-primary text-white rounded-circle fw-bold d-flex align-items-center justify-content-center shadow-sm"
                  style={{ width: 38, height: 38 }}
                >
                  {user.firstName ? user.firstName[0].toUpperCase() : 'U'}
                </div>
                <div className="d-none d-md-block text-start pe-2">
                  <div className="fw-semibold text-slate-800 text-sm lh-1">{user.fullName}</div>
                  <small className="text-muted text-2xs font-monospace">{user.username}</small>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="border-0 shadow-lg rounded-4 p-2 mt-2" style={{ minWidth: 220 }}>
                <div className="px-3 py-2 border-bottom border-slate-100 mb-1">
                  <p className="fw-bold mb-0 text-slate-900 text-sm">{user.fullName}</p>
                  <p className="text-muted mb-1 text-xs">{user.email}</p>
                  <RoleBadge role={user.role} />
                </div>

                <Dropdown.Item
                  as={Link}
                  to="/profile"
                  className="rounded-3 py-2 text-sm d-flex align-items-center gap-2"
                >
                  <User size={16} /> My Profile
                </Dropdown.Item>

                <Dropdown.Item
                  as={Link}
                  to="/profile#password"
                  className="rounded-3 py-2 text-sm d-flex align-items-center gap-2"
                >
                  <KeyRound size={16} /> Change Password
                </Dropdown.Item>

                <Dropdown.Divider className="my-1" />

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
