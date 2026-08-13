import React from 'react';
import { Card } from 'react-bootstrap';

export const SkeletonLoader = ({ type = 'cards', count = 3 }) => {
  if (type === 'table') {
    return (
      <div className="table-responsive">
        <table className="table align-middle">
          <thead>
            <tr>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <th key={i}>
                  <div className="skeleton-line w-75 py-2" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: count }).map((_, idx) => (
              <tr key={idx}>
                {[1, 2, 3, 4, 5, 6].map((col) => (
                  <td key={col}>
                    <div className="skeleton-line py-2 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (type === 'dashboard') {
    return (
      <div className="row g-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-12 col-sm-6 col-lg-3">
            <Card className="border-0 shadow-sm rounded-4 p-4">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div className="skeleton-line w-50 py-2" />
                <div className="skeleton-circle" style={{ width: 40, height: 40 }} />
              </div>
              <div className="skeleton-line w-75 py-3 rounded mb-2" />
              <div className="skeleton-line w-25 py-1 rounded" />
            </Card>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="row g-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="col-12 col-md-6 col-lg-4">
          <Card className="border-0 shadow-sm rounded-4 p-4">
            <div className="skeleton-line w-25 py-1 mb-2" />
            <div className="skeleton-line w-75 py-3 mb-3" />
            <div className="skeleton-line w-100 py-4 mb-3" />
            <div className="d-flex justify-content-between align-items-center">
              <div className="skeleton-line w-33 py-2" />
              <div className="skeleton-line w-25 py-2" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};
