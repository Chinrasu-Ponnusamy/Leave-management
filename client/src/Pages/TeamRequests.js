import { useState } from "react";
import Badge from "../components/common/Badge";
import { fmt, daysBetween } from "../utils/helpers";
import { Icon, Icons } from "../components/common/Icons";
import "./TeamRequests.css";

function TeamRequests({
  user,
  requests,
  leaveTypes,
  users,
  onApprove,
  onReject,
}) {
  const [filter, setFilter] = useState("pending");

  const filtered = requests
    .filter((r) => filter === "all" || r.status === filter)
    .sort((a, b) => b.id - a.id);

  const filters = ["all", "pending", "approved", "rejected"];

  return (
    <div className="team-container">
      <h2 className="team-title">Team Leave Requests</h2>
      <p className="team-subtitle">
        Review and manage team leave requests
      </p>

      {/* Filters */}
      <div className="filter-tabs">
        {filters.map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
            {f !== "all" && (
              <span className="count">
                ({requests.filter((r) => r.status === f).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">No requests found.</div>
      ) : (
        <div className="team-list">
          {filtered.map((r) => {
            const emp = users.find((u) => u.id === r.employee_id);
            const lt = leaveTypes.find((l) => l.id === r.leave_type_id);
            const days = daysBetween(r.from_date, r.to_date);

            return (
              <div key={r.id} className="team-card">
                <div className="card-top">
                  <div className="emp-info">
                    <div className="avatar">
                      {emp?.name?.[0]}
                    </div>

                    <div>
                      <div className="emp-header">
                        <span className="emp-name">{emp?.name}</span>
                        <span className="dot">·</span>
                        <span className="emp-dept">{emp?.dept}</span>
                        <Badge status={r.status} />
                      </div>

                      <div className="leave-info">
                        <strong>{lt?.type_name}</strong> ·{" "}
                        {fmt(r.from_date)} → {fmt(r.to_date)} ·{" "}
                        {days} day{days !== 1 ? "s" : ""}
                      </div>

                      {r.reason && (
                        <div className="leave-reason">
                          {r.reason}
                        </div>
                      )}
                    </div>
                  </div>

                  {r.status === "pending" && (
                    <div className="actions">
                      <button
                        className="approve-btn"
                        onClick={() => onApprove(r.id)}
                      >
                        <Icon d={Icons.check} size={16} color="#34d399" />
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => onReject(r.id)}
                      >
                        <Icon d={Icons.x} size={16} color="#f87171" />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TeamRequests;