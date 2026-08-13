import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card, Container } from 'react-bootstrap';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  Code,
  Cpu,
  FileText,
  Headphones,
  Key,
  Layers,
  Lock,
  MessageSquare,
  Paperclip,
  Shield,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-vh-100 bg-slate-900 text-slate-100 d-flex flex-column overflow-hidden">
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg border-bottom border-slate-800 py-3 sticky-top bg-slate-900 bg-opacity-90 backdrop-blur">
        <Container className="max-w-7xl">
          <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none">
            <div className="bg-primary p-2.5 rounded-3 text-white shadow-lg d-flex align-items-center justify-content-center">
              <Headphones size={24} />
            </div>
            <div>
              <span className="fw-bold text-white fs-4 font-monospace">TicketDesk</span>
              <span className="d-block text-2xs text-slate-400 font-monospace text-uppercase tracking-wider">
                IT Support Tracker
              </span>
            </div>
          </Link>

          <div className="d-flex align-items-center gap-3 ms-auto">
            {isAuthenticated ? (
              <Button as={Link} to="/dashboard" variant="primary" className="rounded-3 px-4 py-2 fw-semibold shadow-sm">
                Go to Dashboard <ArrowRight size={16} className="ms-1" />
              </Button>
            ) : (
              <>
                <Button as={Link} to="/login" variant="link" className="text-slate-300 hover-text-white text-decoration-none fw-semibold">
                  Sign In
                </Button>
                <Button as={Link} to="/register" variant="primary" className="rounded-3 px-4 py-2 fw-semibold shadow-sm">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="py-5 my-4 position-relative">
        <Container className="max-w-7xl text-center">
          <div className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill bg-slate-800 border border-slate-700 text-xs font-monospace text-primary mb-4 shadow-sm">
            <Sparkles size={14} /> Enterprise IT Support & Ticket Tracking Solution
          </div>

          <h1 className="display-4 fw-extrabold text-white mb-4 tracking-tight max-w-4xl mx-auto">
            Smart IT Support Ticket Management <br />
            <span className="text-gradient">Simplified for Enterprise Teams</span>
          </h1>

          <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-5">
            Create, track, assign, and resolve IT support tickets seamlessly. Built with role-based access control, real-time analytics, file attachments, and threaded collaboration.
          </p>

          <div className="d-flex flex-wrap justify-content-center gap-3 mb-5">
            {isAuthenticated ? (
              <Button as={Link} to="/dashboard" size="lg" variant="primary" className="rounded-3 px-5 py-3 fw-bold shadow-lg">
                Go to Workspace <ArrowRight size={18} className="ms-2" />
              </Button>
            ) : (
              <>
                <Button as={Link} to="/register" size="lg" variant="primary" className="rounded-3 px-5 py-3 fw-bold shadow-lg">
                  Create Free Account <ArrowRight size={18} className="ms-2" />
                </Button>
                <Button as={Link} to="/login" size="lg" variant="outline-light" className="rounded-3 px-5 py-3 fw-bold border-slate-700">
                  Sign In to System
                </Button>
              </>
            )}
          </div>

          {/* Interactive UI Mockup Card */}
          <div className="max-w-5xl mx-auto rounded-4 p-2 bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 shadow-2xl overflow-hidden">
            <div className="bg-slate-950 rounded-3 p-4 text-start border border-slate-800">
              <div className="d-flex align-items-center justify-content-between mb-4 border-bottom border-slate-800 pb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="rounded-circle bg-danger opacity-75" style={{ width: 10, height: 10 }} />
                  <div className="rounded-circle bg-warning opacity-75" style={{ width: 10, height: 10 }} />
                  <div className="rounded-circle bg-success opacity-75" style={{ width: 10, height: 10 }} />
                  <span className="text-xs font-monospace text-slate-500 ms-2">TicketDesk Executive Dashboard — Live Workspace</span>
                </div>
                <div className="badge bg-primary bg-opacity-20 text-primary font-monospace text-xs">
                  Role: SUPPORT_ENGINEER
                </div>
              </div>

              {/* Mock Dashboard Row */}
              <div className="row g-3">
                <div className="col-12 col-md-3">
                  <div className="p-3 bg-slate-900 rounded-3 border border-slate-800">
                    <span className="text-2xs font-monospace text-slate-400 text-uppercase">Total Tickets</span>
                    <div className="h3 fw-bold text-white mb-0 font-monospace">248</div>
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="p-3 bg-slate-900 rounded-3 border border-cyan-900 border-opacity-50">
                    <span className="text-2xs font-monospace text-info text-uppercase">Open</span>
                    <div className="h3 fw-bold text-cyan-400 mb-0 font-monospace">32</div>
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="p-3 bg-slate-900 rounded-3 border border-amber-900 border-opacity-50">
                    <span className="text-2xs font-monospace text-warning text-uppercase">In Progress</span>
                    <div className="h3 fw-bold text-amber-400 mb-0 font-monospace">18</div>
                  </div>
                </div>
                <div className="col-12 col-md-3">
                  <div className="p-3 bg-slate-900 rounded-3 border border-emerald-900 border-opacity-50">
                    <span className="text-2xs font-monospace text-success text-uppercase">Resolved</span>
                    <div className="h3 fw-bold text-emerald-400 mb-0 font-monospace">198</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-5 bg-slate-950 border-top border-slate-800">
        <Container className="max-w-7xl">
          <div className="text-center mb-5">
            <h2 className="fw-bold text-white h3 mb-2">Everything You Need for IT Help Desk Operations</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Engineered specifically for enterprise IT teams, support engineers, and employees.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-slate-900 rounded-4 border border-slate-800 h-100 hover-border-primary transition-all">
                <div className="p-3 bg-primary bg-opacity-10 text-primary rounded-3 d-inline-block mb-3">
                  <Ticket size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2">Easy Ticket Creation</h5>
                <p className="text-slate-400 text-xs mb-0">
                  Employees can submit detailed tickets with category tags, urgency priority, and mandatory file attachment support.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-slate-900 rounded-4 border border-slate-800 h-100 hover-border-primary transition-all">
                <div className="p-3 bg-warning bg-opacity-10 text-warning rounded-3 d-inline-block mb-3">
                  <Activity size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2">Lifecycle Status Tracking</h5>
                <p className="text-slate-400 text-xs mb-0">
                  Track tickets strictly through status transitions: OPEN &rarr; IN PROGRESS &rarr; RESOLVED &rarr; CLOSED with re-open support.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-slate-900 rounded-4 border border-slate-800 h-100 hover-border-primary transition-all">
                <div className="p-3 bg-danger bg-opacity-10 text-danger rounded-3 d-inline-block mb-3">
                  <AlertTriangle size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2">Priority Matrix</h5>
                <p className="text-slate-400 text-xs mb-0">
                  Low, Medium, High, and Critical priority indicators with color-coded badge highlights to resolve urgent outages faster.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-slate-900 rounded-4 border border-slate-800 h-100 hover-border-primary transition-all">
                <div className="p-3 bg-info bg-opacity-10 text-info rounded-3 d-inline-block mb-3">
                  <Users size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2">Team & Role Access</h5>
                <p className="text-slate-400 text-xs mb-0">
                  Custom role-adapted interfaces for Employee, Support Engineer, and Administrator to keep views relevant and secure.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-slate-900 rounded-4 border border-slate-800 h-100 hover-border-primary transition-all">
                <div className="p-3 bg-success bg-opacity-10 text-success rounded-3 d-inline-block mb-3">
                  <Paperclip size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2">File Attachments</h5>
                <p className="text-slate-400 text-xs mb-0">
                  Attach screenshots, logs, or diagnostic PDFs directly to tickets with secure file download and preview options.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-4">
              <div className="p-4 bg-slate-900 rounded-4 border border-slate-800 h-100 hover-border-primary transition-all">
                <div className="p-3 bg-secondary bg-opacity-10 text-light rounded-3 d-inline-block mb-3">
                  <MessageSquare size={24} />
                </div>
                <h5 className="fw-bold text-white mb-2">Threaded Comments</h5>
                <p className="text-slate-400 text-xs mb-0">
                  Real-time ticket comments allowing support engineers and end users to exchange notes, ask questions, and verify solutions.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Ticket Workflow Stepper Section */}
      <section className="py-5 bg-slate-900 border-top border-slate-800">
        <Container className="max-w-5xl text-center">
          <h2 className="fw-bold text-white h3 mb-2">Strict Workflow State Lifecycle</h2>
          <p className="text-slate-400 text-sm mb-5">
            Backend-enforced ticket status transitions ensure structured resolution without skipped steps.
          </p>

          <div className="row g-4 align-items-center justify-content-center">
            <div className="col-12 col-sm-6 col-md-3">
              <div className="p-4 bg-slate-800 rounded-4 border border-cyan-500 border-opacity-30">
                <div className="p-3 rounded-circle bg-cyan-500 bg-opacity-20 text-cyan-400 d-inline-block mb-3">
                  <Ticket size={24} />
                </div>
                <h6 className="fw-bold text-white mb-1">1. OPEN</h6>
                <span className="text-2xs font-monospace text-slate-400">Newly Submitted Ticket</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="p-4 bg-slate-800 rounded-4 border border-amber-500 border-opacity-30">
                <div className="p-3 rounded-circle bg-amber-500 bg-opacity-20 text-amber-400 d-inline-block mb-3">
                  <Clock size={24} />
                </div>
                <h6 className="fw-bold text-white mb-1">2. IN PROGRESS</h6>
                <span className="text-2xs font-monospace text-slate-400">Engineer Working</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="p-4 bg-slate-800 rounded-4 border border-emerald-500 border-opacity-30">
                <div className="p-3 rounded-circle bg-emerald-500 bg-opacity-20 text-emerald-400 d-inline-block mb-3">
                  <CheckCircle2 size={24} />
                </div>
                <h6 className="fw-bold text-white mb-1">3. RESOLVED</h6>
                <span className="text-2xs font-monospace text-slate-400">Fix Applied & Verified</span>
              </div>
            </div>

            <div className="col-12 col-sm-6 col-md-3">
              <div className="p-4 bg-slate-800 rounded-4 border border-slate-600">
                <div className="p-3 rounded-circle bg-slate-700 text-slate-300 d-inline-block mb-3">
                  <ShieldCheck size={24} />
                </div>
                <h6 className="fw-bold text-white mb-1">4. CLOSED</h6>
                <span className="text-2xs font-monospace text-slate-400">Ticket Archived</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-gradient-to-r from-primary to-indigo-900 text-center text-white my-auto">
        <Container className="max-w-3xl py-4">
          <h2 className="fw-extrabold display-6 mb-3">Ready to Simplify IT Support Operations?</h2>
          <p className="text-blue-100 text-md mb-4 max-w-xl mx-auto">
            Experience a modern, enterprise-ready IT ticket management system connected to live REST APIs.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/register" size="lg" variant="light" className="rounded-3 px-5 py-3 fw-bold text-primary shadow-lg">
              Get Started Now
            </Button>
            <Button as={Link} to="/login" size="lg" variant="outline-light" className="rounded-3 px-5 py-3 fw-bold">
              Sign In
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-slate-950 border-top border-slate-800 text-slate-400 text-xs font-monospace text-center">
        <Container className="max-w-7xl d-flex flex-column flex-md-row align-items-center justify-content-between gap-3">
          <div>
            <span className="fw-bold text-white">TicketDesk</span> &copy; {new Date().getFullYear()} Enterprise IT Support System.
          </div>
          <div className="d-flex gap-4">
            <Link to="/login" className="text-slate-400 hover-text-white text-decoration-none">Login</Link>
            <Link to="/register" className="text-slate-400 hover-text-white text-decoration-none">Register</Link>
            <span className="text-slate-600">v1.0.0</span>
          </div>
        </Container>
      </footer>
    </div>
  );
};
