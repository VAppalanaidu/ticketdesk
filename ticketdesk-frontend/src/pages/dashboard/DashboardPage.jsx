import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Col, Row } from 'react-bootstrap';
import {
  AlertOctagon,
  CheckCircle2,
  Clock,
  PlusCircle,
  ShieldAlert,
  Ticket,
  Users,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { dashboardService } from '../../services/dashboardService';
import { ticketService } from '../../services/ticketService';
import { CategoryChart } from '../../components/dashboard/CategoryChart';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { PriorityChart } from '../../components/dashboard/PriorityChart';
import { RecentTicketsTable } from '../../components/dashboard/RecentTicketsTable';
import { StatusChart } from '../../components/dashboard/StatusChart';
import { WorkflowStepper } from '../../components/dashboard/WorkflowStepper';
import { ErrorState } from '../../components/common/ErrorState';
import { SkeletonLoader } from '../../components/common/SkeletonLoader';

export const DashboardPage = () => {
  const { user } = useAuth();
  const isStaff = user?.role === 'ADMIN' || user?.role === 'SUPPORT_ENGINEER';

  const [stats, setStats] = useState(null);
  const [recentTickets, setRecentTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(false);
    try {
      if (isStaff) {
        // Fetch dashboard statistics from backend API
        const statsData = await dashboardService.getDashboardStats();
        setStats(statsData);

        // Fetch recent tickets feed
        const ticketPage = await ticketService.getAllTickets({ page: 0, size: 6, sortBy: 'createdAt', sortDir: 'desc' });
        setRecentTickets(ticketPage.content || []);
      } else {
        // Employee view: fetch personal tickets
        const myPage = await ticketService.getMyTickets({ page: 0, size: 50 });
        const list = myPage.content || [];
        setRecentTickets(list.slice(0, 6));

        // Derive personal KPI stats
        const open = list.filter((t) => t.status === 'OPEN').length;
        const inProg = list.filter((t) => t.status === 'IN_PROGRESS').length;
        const res = list.filter((t) => t.status === 'RESOLVED').length;
        const closed = list.filter((t) => t.status === 'CLOSED').length;
        const highCrit = list.filter((t) => t.priority === 'HIGH' || t.priority === 'CRITICAL').length;

        const pMap = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
        const cMap = {};

        list.forEach((t) => {
          if (t.priority) pMap[t.priority] = (pMap[t.priority] || 0) + 1;
          if (t.category) cMap[t.category] = (cMap[t.category] || 0) + 1;
        });

        setStats({
          totalTickets: list.length,
          openTickets: open,
          inProgressTickets: inProg,
          resolvedTickets: res,
          closedTickets: closed,
          ticketsByPriority: pMap,
          ticketsByCategory: cMap,
          ticketsByEngineer: {},
        });
      }
    } catch (err) {
      console.error('Failed to load dashboard', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [isStaff]);

  if (loading) {
    return (
      <div>
        <SkeletonLoader type="dashboard" />
      </div>
    );
  }

  if (error) {
    return <ErrorState title="Unable to load dashboard metrics" onRetry={loadDashboardData} />;
  }

  return (
    <div className="dashboard-container">
      {/* Header Greeting Banner */}
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4 gap-3 bg-white p-4 rounded-4 shadow-sm border border-slate-200">
        <div>
          <h4 className="fw-bold text-slate-900 mb-1">
            Hello, {user?.firstName} 👋
          </h4>
          <p className="text-muted text-sm mb-0">
            {isStaff
              ? 'Real-time IT Support Desk health, metrics, and incoming ticket queue.'
              : 'Track and manage your submitted IT support requests.'}
          </p>
        </div>

        <div className="d-flex gap-2">
          <Button
            as={Link}
            to="/tickets/create"
            variant="primary"
            className="rounded-3 px-4 py-2 fw-semibold shadow-sm d-inline-flex align-items-center gap-2"
          >
            <PlusCircle size={18} /> Submit New Ticket
          </Button>
        </div>
      </div>

      {/* KPI Metric Cards Row */}
      <Row className="g-4 mb-4">
        <Col xs={12} sm={6} lg={3}>
          <KpiCard
            title="Total Tickets"
            count={stats?.totalTickets || 0}
            icon={<Ticket size={22} />}
            subtitle="All logged tickets"
            variant="primary"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <KpiCard
            title="Open Tickets"
            count={stats?.openTickets || 0}
            icon={<Clock size={22} />}
            subtitle="Awaiting resolution"
            variant="info"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <KpiCard
            title="In Progress"
            count={stats?.inProgressTickets || 0}
            icon={<AlertOctagon size={22} />}
            subtitle="Currently being worked"
            variant="warning"
          />
        </Col>
        <Col xs={12} sm={6} lg={3}>
          <KpiCard
            title="Resolved / Closed"
            count={(stats?.resolvedTickets || 0) + (stats?.closedTickets || 0)}
            icon={<CheckCircle2 size={22} />}
            subtitle="Successfully completed"
            variant="success"
          />
        </Col>
      </Row>

      {/* Ticket Lifecycle Workflow Stepper */}
      <WorkflowStepper stats={stats} />

      {/* Charts Section */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={6}>
          <StatusChart stats={stats} />
        </Col>
        <Col xs={12} lg={6}>
          <PriorityChart priorityMap={stats?.ticketsByPriority} />
        </Col>
      </Row>

      {/* Category Distribution and Recent Tickets Row */}
      <Row className="g-4 mb-4">
        <Col xs={12} lg={5}>
          <CategoryChart categoryMap={stats?.ticketsByCategory} />
        </Col>
        <Col xs={12} lg={7}>
          <RecentTicketsTable tickets={recentTickets} />
        </Col>
      </Row>
    </div>
  );
};
