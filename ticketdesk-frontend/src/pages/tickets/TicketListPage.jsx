import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Col, Pagination, Row } from 'react-bootstrap';
import { LayoutGrid, List, PlusCircle, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { ticketService } from '../../services/ticketService';
import { AssignEngineerModal } from '../../components/tickets/AssignEngineerModal';
import { TicketCard } from '../../components/tickets/TicketCard';
import { TicketFilters } from '../../components/tickets/TicketFilters';
import { TicketTable } from '../../components/tickets/TicketTable';
import { EmptyState } from '../../components/common/EmptyState';
import { ErrorState } from '../../components/common/ErrorState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const TicketListPage = () => {
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'SUPPORT_ENGINEER';

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Assign Modal
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState(null);
  const [assigning, setAssigning] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    setError(false);
    try {
      let pageData;

      if (selectedStatus) {
        pageData = await ticketService.getTicketsByStatus(selectedStatus, { page, size: pageSize });
      } else if (selectedPriority) {
        pageData = await ticketService.getTicketsByPriority(selectedPriority, { page, size: pageSize });
      } else if (selectedCategory) {
        pageData = await ticketService.getTicketsByCategory(selectedCategory, { page, size: pageSize });
      } else if (isStaff) {
        pageData = await ticketService.getAllTickets({ page, size: pageSize, sortBy: 'createdAt', sortDir: 'desc' });
      } else {
        pageData = await ticketService.getMyTickets({ page, size: pageSize });
      }

      setTickets(pageData.content || []);
      setTotalPages(pageData.totalPages || 1);
      setTotalElements(pageData.totalElements || 0);
    } catch (err) {
      console.error('Failed to fetch tickets', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, selectedStatus, selectedPriority, selectedCategory, isStaff]);

  // Client-side search filtering
  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.title?.toLowerCase().includes(q) ||
      t.ticketNumber?.toLowerCase().includes(q) ||
      t.description?.toLowerCase().includes(q)
    );
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
    setSelectedPriority('');
    setSelectedCategory('');
    setPage(0);
  };

  const handleAssignConfirm = async (engineerId) => {
    if (!selectedTicketForAssign) return;

    setAssigning(true);
    try {
      await ticketService.assignEngineer(selectedTicketForAssign.id, { engineerId });
      toast.success('Engineer assigned successfully');
      setSelectedTicketForAssign(null);
      await fetchTickets();
    } catch (err) {
      toast.error('Failed to assign engineer');
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div>
      {/* Top Header Controls */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-slate-900 mb-1">Support Ticket Directory</h4>
          <p className="text-muted text-sm mb-0">
            {isStaff ? 'Manage, assign, and track all system support tickets.' : 'View and track your submitted tickets.'}
          </p>
        </div>

        <div className="d-flex align-items-center gap-2">
          <div className="btn-group bg-white p-1 rounded-3 border shadow-2xs">
            <Button
              variant={viewMode === 'table' ? 'primary' : 'light'}
              size="sm"
              onClick={() => setViewMode('table')}
              className="px-2.5 py-1"
            >
              <List size={18} />
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'primary' : 'light'}
              size="sm"
              onClick={() => setViewMode('cards')}
              className="px-2.5 py-1"
            >
              <LayoutGrid size={18} />
            </Button>
          </div>

          <Button
            as={Link}
            to="/tickets/create"
            variant="primary"
            className="rounded-3 px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
          >
            <PlusCircle size={18} /> Create Ticket
          </Button>
        </div>
      </div>

      {/* Filter Component */}
      <TicketFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedStatus={selectedStatus}
        onStatusChange={(val) => {
          setSelectedStatus(val);
          setPage(0);
        }}
        selectedPriority={selectedPriority}
        onPriorityChange={(val) => {
          setSelectedPriority(val);
          setPage(0);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(val) => {
          setSelectedCategory(val);
          setPage(0);
        }}
        onResetFilters={handleResetFilters}
      />

      {/* Content Rendering */}
      {loading ? (
        <SkeletonLoader type={viewMode === 'table' ? 'table' : 'cards'} count={5} />
      ) : error ? (
        <ErrorState title="Failed to load tickets" onRetry={fetchTickets} />
      ) : filteredTickets.length === 0 ? (
        <EmptyState
          title="No tickets found"
          description="There are no tickets matching your current search criteria or active filters."
          actionLabel="Clear Filters"
          onAction={handleResetFilters}
        />
      ) : viewMode === 'table' ? (
        <TicketTable
          tickets={filteredTickets}
          onOpenAssignModal={(t) => setSelectedTicketForAssign(t)}
          canAssign={isStaff}
        />
      ) : (
        <Row className="g-4">
          {filteredTickets.map((t) => (
            <Col key={t.id} xs={12} md={6} lg={4}>
              <TicketCard ticket={t} />
            </Col>
          ))}
        </Row>
      )}

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="d-flex align-items-center justify-content-between mt-4 bg-white p-3 rounded-4 shadow-sm border border-slate-200">
          <span className="text-slate-600 text-xs font-monospace">
            Showing Page {page + 1} of {totalPages} ({totalElements} Total Tickets)
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

      {/* Assign Engineer Modal */}
      <AssignEngineerModal
        show={!!selectedTicketForAssign}
        ticket={selectedTicketForAssign}
        onConfirm={handleAssignConfirm}
        onCancel={() => setSelectedTicketForAssign(null)}
        isLoading={assigning}
      />
    </div>
  );
};
