import React from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { CheckCircle, Edit3, Trash2, XCircle } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
import { RoleBadge } from '../common/RoleBadge';

export const UserTable = ({ users = [], onEdit, onDelete, onToggleStatus, currentUserId }) => {
  return (
    <div className="table-responsive">
      <Table hover align="middle" className="mb-0 bg-white rounded-4 shadow-sm overflow-hidden text-sm">
        <thead className="table-light">
          <tr>
            <th className="font-monospace text-xs text-uppercase ps-4 py-3">ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined Date</th>
            <th className="text-end pe-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isSelf = u.id === currentUserId;

            return (
              <tr key={u.id}>
                <td className="ps-4 font-monospace fw-bold text-primary">#{u.id}</td>
                <td className="fw-semibold text-slate-900">{u.fullName}</td>
                <td className="font-monospace text-slate-600 text-xs">{u.username}</td>
                <td className="text-slate-700 text-xs">{u.email}</td>
                <td className="text-slate-600 text-xs">{u.department || 'General'}</td>
                <td>
                  <RoleBadge role={u.role} />
                </td>
                <td>
                  {u.active ? (
                    <Badge bg="success" className="px-2 py-1 text-2xs fw-semibold rounded-pill">
                      Active
                    </Badge>
                  ) : (
                    <Badge bg="danger" className="px-2 py-1 text-2xs fw-semibold rounded-pill">
                      Deactivated
                    </Badge>
                  )}
                </td>
                <td className="text-muted text-xs font-monospace">{formatDate(u.createdAt)}</td>
                <td className="text-end pe-4">
                  <div className="d-flex align-items-center justify-content-end gap-1.5">
                    <Button
                      variant={u.active ? 'outline-warning' : 'outline-success'}
                      size="sm"
                      onClick={() => onToggleStatus(u)}
                      disabled={isSelf}
                      title={u.active ? 'Deactivate User' : 'Activate User'}
                      className="rounded-3 p-1.5 shadow-2xs"
                    >
                      {u.active ? <XCircle size={15} /> : <CheckCircle size={15} />}
                    </Button>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => onEdit(u)}
                      title="Edit User"
                      className="rounded-3 p-1.5 shadow-2xs"
                    >
                      <Edit3 size={15} />
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => onDelete(u)}
                      disabled={isSelf}
                      title="Delete User"
                      className="rounded-3 p-1.5 shadow-2xs"
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};
