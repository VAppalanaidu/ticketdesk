import React, { useEffect, useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { Edit2, MessageSquare, Send, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { commentService } from '../../services/commentService';
import { formatDate, formatRelativeTime } from '../../utils/formatters';
import { RoleBadge } from '../common/RoleBadge';
import LoadingSpinner from '../common/LoadingSpinner';
import { ConfirmModal } from '../common/ConfirmModal';

export const CommentThread = ({ ticketId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editing, setEditing] = useState(false);

  // Delete State
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchComments = async () => {
    try {
      const pageRes = await commentService.getTicketComments(ticketId, { page: 0, size: 50 });
      setComments(pageRes.content || []);
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticketId) {
      fetchComments();
    }
  }, [ticketId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await commentService.addComment(ticketId, { comment: newComment.trim() });
      toast.success('Comment posted successfully');
      setNewComment('');
      await fetchComments();
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStartEdit = (c) => {
    setEditingId(c.id);
    setEditContent(c.comment);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editContent.trim()) return;

    setEditing(true);
    try {
      await commentService.updateComment(editingId, { comment: editContent.trim() });
      toast.success('Comment updated');
      setEditingId(null);
      await fetchComments();
    } catch (err) {
      toast.error('Failed to update comment');
    } finally {
      setEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;

    setDeleting(true);
    try {
      await commentService.deleteComment(deletingId);
      toast.success('Comment deleted');
      setDeletingId(null);
      await fetchComments();
    } catch (err) {
      toast.error('Failed to delete comment');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 p-4 mb-4">
      <Card.Body className="p-0">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h5 className="fw-bold text-slate-900 mb-0 d-flex align-items-center gap-2">
            <MessageSquare size={20} className="text-primary" /> Activity & Comments ({comments.length})
          </h5>
        </div>

        {/* Add Comment Form */}
        <Form onSubmit={handleAddComment} className="mb-4">
          <Form.Group className="mb-2">
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Write a clear, descriptive comment or update for this ticket..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="rounded-3 shadow-none text-sm p-3"
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting || !newComment.trim()}
              className="px-4 py-2 rounded-3 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
            >
              <Send size={16} /> {submitting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </Form>

        {/* Comment Thread List */}
        {loading ? (
          <LoadingSpinner label="Loading comments..." />
        ) : comments.length === 0 ? (
          <p className="text-muted text-sm text-center py-4 bg-light rounded-3">No comments posted on this ticket yet.</p>
        ) : (
          <div className="d-flex flex-column gap-3">
            {comments.map((c) => {
              const isOwner = user?.id === c.createdBy?.id || user?.role === 'ADMIN';

              if (editingId === c.id) {
                return (
                  <div key={c.id} className="p-3 bg-light rounded-3 border">
                    <Form onSubmit={handleSaveEdit}>
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="mb-2 text-sm"
                      />
                      <div className="d-flex justify-content-end gap-2">
                        <Button variant="light" size="sm" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                        <Button type="submit" variant="primary" size="sm" disabled={editing}>
                          {editing ? 'Saving...' : 'Save Changes'}
                        </Button>
                      </div>
                    </Form>
                  </div>
                );
              }

              return (
                <div key={c.id} className="p-3 rounded-3 bg-slate-50 border border-slate-200">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="avatar bg-slate-800 text-white rounded-circle fw-bold text-xs d-flex align-items-center justify-content-center"
                        style={{ width: 32, height: 32 }}
                      >
                        {c.createdBy?.fullName ? c.createdBy.fullName[0].toUpperCase() : 'U'}
                      </div>
                      <div>
                        <span className="fw-bold text-slate-900 text-sm me-2">{c.createdBy?.fullName}</span>
                        {c.createdBy?.role && <RoleBadge role={c.createdBy.role} />}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted text-2xs font-monospace">{formatRelativeTime(c.createdAt)}</span>
                      {isOwner && (
                        <div className="d-flex gap-1 ms-2">
                          <button
                            onClick={() => handleStartEdit(c)}
                            className="btn btn-sm btn-link text-slate-500 p-0 me-1"
                            title="Edit"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingId(c.id)}
                            className="btn btn-sm btn-link text-danger p-0"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-slate-800 text-sm mb-0 whitespace-pre-line ps-4 ms-2">{c.comment}</p>
                </div>
              );
            })}
          </div>
        )}
      </Card.Body>

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={!!deletingId}
        title="Delete Comment"
        message="Are you sure you want to delete this comment? This action cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
        isLoading={deleting}
      />
    </Card>
  );
};
