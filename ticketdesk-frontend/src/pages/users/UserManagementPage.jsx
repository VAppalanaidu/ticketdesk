import React, { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Pagination } from 'react-bootstrap';
import { Search, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { userService } from '../../services/userService';
import { UserFormModal } from '../../components/users/UserFormModal';
import { UserTable } from '../../components/users/UserTable';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const UserManagementPage = () => {
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ADMIN';

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pagination & Search
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [savingUser, setSavingUser] = useState(false);

  const [deletingUser, setDeletingUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError(false);
    try {
      let pageRes;
      if (search || roleFilter) {
        pageRes = await userService.searchUsers({
          search: search || undefined,
          role: roleFilter || undefined,
          page,
          size: 10,
        });
      } else {
        pageRes = await userService.getAllUsers({ page, size: 10, sortBy: 'createdAt', sortDir: 'desc' });
      }

      // Filter out ADMIN role from directory display
      const filtered = (pageRes.content || []).filter((u) => u.role !== 'ADMIN');
      setUsers(filtered);
      setTotalPages(pageRes.totalPages || 1);
      setTotalElements(pageRes.totalElements || 0);
    } catch (err) {
      console.error('Failed to load users', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, roleFilter]);

  const handleSaveUser = async (formData) => {
    setSavingUser(true);
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, formData);
        toast.success('User updated successfully');
      } else {
        await userService.createUser(formData);
        toast.success('Support Engineer created successfully');
      }
      setShowFormModal(false);
      setEditingUser(null);
      await fetchUsers();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save user');
    } finally {
      setSavingUser(false);
    }
  };

  const handleToggleStatus = async (targetUser) => {
    try {
      if (targetUser.active) {
        await userService.deactivateUser(targetUser.id);
        toast.success(`User ${targetUser.username} deactivated`);
      } else {
        await userService.activateUser(targetUser.id);
        toast.success(`User ${targetUser.username} activated`);
      }
      await fetchUsers();
    } catch (err) {
      toast.error('Failed to change user status');
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setIsDeleting(true);
    try {
      await userService.deleteUser(deletingUser.id);
      toast.success(`User ${deletingUser.username} deleted`);
      setDeletingUser(null);
      await fetchUsers();
    } catch (err) {
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-slate-900 mb-1">User Directory & Permissions</h4>
          <p className="text-muted text-sm mb-0">System user accounts, Support Engineer management, and active status controls.</p>
        </div>

        {isAdmin && (
          <Button
            variant="primary"
            onClick={() => {
              setEditingUser(null);
              setShowFormModal(true);
            }}
            className="rounded-3 px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
          >
            <UserPlus size={18} /> Add Support Engineer
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-4 shadow-sm mb-4 border border-slate-200">
        <div className="row g-3">
          <div className="col-12 col-md-8">
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 text-slate-400">
                <Search size={18} />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search users by name, username, email, or department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                className="border-start-0 ps-0 shadow-none text-sm"
              />
              <Button variant="primary" onClick={fetchUsers} className="px-4 text-sm fw-semibold">
                Search
              </Button>
            </InputGroup>
          </div>

          <div className="col-12 col-md-4">
            <Form.Select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(0);
              }}
              className="text-sm shadow-none"
            >
              <option value="">All Operational Roles</option>
              <option value="EMPLOYEE">Employee / User</option>
              <option value="SUPPORT_ENGINEER">Support Engineer</option>
            </Form.Select>
          </div>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : error ? (
        <ErrorState title="Failed to load users" onRetry={fetchUsers} />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="No system users match your search criteria." />
      ) : (
        <UserTable
          users={users}
          currentUserId={currentUser?.id}
          onEdit={(u) => {
            setEditingUser(u);
            setShowFormModal(true);
          }}
          onDelete={(u) => setDeletingUser(u)}
          onToggleStatus={handleToggleStatus}
        />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between mt-4 bg-white p-3 rounded-4 shadow-sm border border-slate-200">
          <span className="text-slate-600 text-xs font-monospace">
            Showing Page {page + 1} of {totalPages} ({totalElements} Users)
          </span>
          <Pagination className="mb-0">
            <Pagination.Prev disabled={page === 0} onClick={() => setPage(page - 1)} />
            {Array.from({ length: totalPages }).map((_, idx) => (
              <Pagination.Item key={idx} active={idx === page} onClick={() => setPage(idx)}>
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next disabled={page === totalPages - 1} onClick={() => setPage(page + 1)} />
          </Pagination>
        </div>
      )}

      {/* Create / Edit Form Modal */}
      <UserFormModal
        show={showFormModal}
        user={editingUser}
        onSave={handleSaveUser}
        onCancel={() => {
          setShowFormModal(false);
          setEditingUser(null);
        }}
        isLoading={savingUser}
      />

      {/* Delete User Modal */}
      <ConfirmModal
        show={!!deletingUser}
        title="Delete User Account"
        message={`Are you sure you want to delete user account '${deletingUser?.username}'?`}
        onConfirm={handleDeleteUser}
        onCancel={() => setDeletingUser(null)}
        isLoading={isDeleting}
      />
    </div>
  );
};
