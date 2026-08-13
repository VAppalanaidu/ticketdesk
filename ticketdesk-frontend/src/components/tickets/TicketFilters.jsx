import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { Filter, RefreshCw, Search, X } from 'lucide-react';
import { TICKET_CATEGORY_CONFIG, TICKET_PRIORITY_CONFIG, TICKET_STATUS_CONFIG } from '../../constants/ticketConstants';

export const TicketFilters = ({
  searchQuery,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  selectedCategory,
  onCategoryChange,
  onResetFilters,
}) => {
  const hasActiveFilters = searchQuery || selectedStatus || selectedPriority || selectedCategory;

  return (
    <div className="bg-white p-3 p-md-4 rounded-4 shadow-sm mb-4 border border-slate-200">
      <div className="row g-3 align-items-center">
        {/* Search */}
        <div className="col-12 col-md-4">
          <InputGroup>
            <InputGroup.Text className="bg-white border-end-0 text-slate-400">
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search by ticket title, description or ID..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="border-start-0 ps-0 shadow-none text-sm"
            />
            {searchQuery && (
              <Button variant="link" className="text-muted p-0 pe-3" onClick={() => onSearchChange('')}>
                <X size={16} />
              </Button>
            )}
          </InputGroup>
        </div>

        {/* Status Dropdown */}
        <div className="col-12 col-sm-4 col-md-2.5">
          <Form.Select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-sm shadow-none"
          >
            <option value="">All Statuses</option>
            {Object.keys(TICKET_STATUS_CONFIG).map((st) => (
              <option key={st} value={st}>
                {TICKET_STATUS_CONFIG[st].label}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Priority Dropdown */}
        <div className="col-12 col-sm-4 col-md-2.5">
          <Form.Select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value)}
            className="text-sm shadow-none"
          >
            <option value="">All Priorities</option>
            {Object.keys(TICKET_PRIORITY_CONFIG).map((pr) => (
              <option key={pr} value={pr}>
                {TICKET_PRIORITY_CONFIG[pr].label}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Category Dropdown */}
        <div className="col-12 col-sm-4 col-md-2.5">
          <Form.Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="text-sm shadow-none"
          >
            <option value="">All Categories</option>
            {Object.keys(TICKET_CATEGORY_CONFIG).map((cat) => (
              <option key={cat} value={cat}>
                {TICKET_CATEGORY_CONFIG[cat].label}
              </option>
            ))}
          </Form.Select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="col-12 col-md-auto ms-auto">
            <Button
              variant="outline-secondary"
              onClick={onResetFilters}
              className="text-xs fw-semibold rounded-3 d-flex align-items-center gap-1.5 w-100 justify-content-center"
            >
              <RefreshCw size={14} /> Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
