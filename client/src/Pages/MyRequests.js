

import Badge from "../components/common/Badge";
import { fmt, daysBetween } from "../utils/helpers";
import { Icon, Icons } from "../components/common/Icons";
import "./MyRequests.css";

function MyRequests({ user, requests, leaveTypes, onCancel }) {
  const mine = requests
    .filter((r) => r.employee_id === user.id)
    .sort((a, b) => b.id - a.id);

  return (
    <div className="requests-container">
      <h2 className="requests-title">My Leave Requests</h2>
      <p className="requests-subtitle">{mine.length} total requests</p>

      {mine.length === 0 ? (
        <div className="empty-state">No leave requests yet.</div>
      ) : (
        <div className="requests-list">
          {mine.map((r) => {
            const lt = leaveTypes.find((l) => l.id === r.leave_type_id);
            const days = daysBetween(r.from_date, r.to_date);

            return (
              <div key={r.id} className="request-card">
                <div className="request-info">
                  <div className="request-header">
                    <span className="leave-type">
                      {lt?.type_name} Leave
                    </span>
                    <Badge status={r.status} />
                  </div>

                  <div className="request-dates">
                    {fmt(r.from_date)} → {fmt(r.to_date)} ·{" "}
                    <strong>
                      {days} day{days !== 1 ? "s" : ""}
                    </strong>
                  </div>

                  {r.reason && (
                    <div className="request-reason">{r.reason}</div>
                  )}
                </div>

                {r.status === "pending" && (
                  <button
                    className="cancel-btn"
                    onClick={() => onCancel(r.id)}
                  >
                    <Icon d={Icons.trash} size={14} color="#f87171" />
                    Cancel
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyRequests;