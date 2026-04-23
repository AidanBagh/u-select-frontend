import React, { useState } from 'react';
import CandidateReasoning from '../CandidateReasoning/CandidateReasoning';
import './ShortlistTable.css';

function scoreColor(score) {
  if (score >= 75) return 'var(--green)';
  if (score >= 50) return '#f59e0b';
  return 'var(--red)';
}

function ShortlistTable({ rankedApplicants }) {
  const [expanded, setExpanded] = useState(null);

  const toggle = (id) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="shortlist-table-wrapper">
      <table className="shortlist-table">
        <thead>
          <tr>
            <th className="shortlist-table-th shortlist-table-rank-col">#</th>
            <th className="shortlist-table-th">Name</th>
            <th className="shortlist-table-th shortlist-table-score-col">Score</th>
            <th className="shortlist-table-th shortlist-table-status-col">Status</th>
            <th className="shortlist-table-th shortlist-table-action-col"></th>
          </tr>
        </thead>
        <tbody>
          {rankedApplicants.map((a, i) => (
            <React.Fragment key={a.applicantId}>
              <tr className={`shortlist-table-row ${a.shortlisted ? 'shortlist-table-row--shortlisted' : ''}`}>
                <td className="shortlist-table-td shortlist-table-rank-col">{i + 1}</td>
                <td className="shortlist-table-td shortlist-table-name">{a.name}</td>
                <td className="shortlist-table-td">
                  <div className="shortlist-table-score-wrap">
                    <div className="shortlist-table-score-track">
                      <div
                        className="shortlist-table-score-fill"
                        style={{ width: `${a.score}%`, background: scoreColor(a.score) }}
                      />
                    </div>
                    <span className="shortlist-table-score-num">{a.score}</span>
                  </div>
                </td>
                <td className="shortlist-table-td">
                  {a.shortlisted ? (
                    <span className="shortlist-table-chip shortlist-table-chip--yes">Shortlisted</span>
                  ) : (
                    <span className="shortlist-table-chip shortlist-table-chip--no">Not shortlisted</span>
                  )}
                </td>
                <td className="shortlist-table-td shortlist-table-action-col">
                  <button
                    className="shortlist-table-toggle"
                    onClick={() => toggle(a.applicantId)}
                  >
                    {expanded === a.applicantId ? 'Hide' : 'Reasoning'}
                  </button>
                </td>
              </tr>
              {expanded === a.applicantId && (
                <tr>
                  <td colSpan={5} className="shortlist-table-reasoning-cell">
                    <CandidateReasoning
                      name={a.name}
                      score={a.score}
                      reasoning={a.reasoning}
                    />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ShortlistTable;
