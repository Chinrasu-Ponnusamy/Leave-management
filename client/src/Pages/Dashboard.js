import "./Dashboard.css";
import Badge from "../components/common/Badge";
import { fmt } from "../utils/helpers";
import { Icon, Icons } from "../components/common/Icons";

function Dashboard({ user, leaveTypes, requests, balances }) {

  // ✅ My Data
  const myRequests = requests.filter(r => r.employee_id === user.id);
  const myBalances = balances.filter(
    b => b.employee_id === user.id && b.year === 2026
  );

  // ✅ Counts (optimized)
  const approvedCount = myRequests.filter(r => r.status === "approved").length;
  const pendingCount = myRequests.filter(r => r.status === "pending").length;

  // ✅ Role-based pending approvals
  const pending =
    user.role === "manager"
      ? requests.filter(
          r => r.status === "pending" && r.manager_id === user.id
        ).length
      : requests.filter(r => r.status === "pending").length;

  // ✅ Reusable Card
  const StatCard = ({ label, value, sub, color, icon }) => (
    <div className="card">
      <div className="stat-header">
        <div>
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
          {sub && <div className="dashboard-subtitle">{sub}</div>}
        </div>

        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: 12,
            background: color + "1a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon d={icon} size={20} color={color} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      {/* ✅ Header */}
      <h2 className="dashboard-title">
        Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
      </h2>
      <p className="dashboard-subtitle">
        Here's your leave overview for 2026
      </p>

      {/* ✅ Stats */}
      <div className="grid">
        {user.role === "employee" && (
          <>
            <StatCard
              label="Total Requests"
              value={myRequests.length}
              icon={Icons.list}
              color="#3b82f6"
            />
            <StatCard
              label="Approved"
              value={approvedCount}
              icon={Icons.check}
              color="#10b981"
            />
            <StatCard
              label="Pending"
              value={pendingCount}
              icon={Icons.calendar}
              color="#f59e0b"
            />
          </>
        )}

        {(user.role === "manager" || user.role === "admin") && (
          <>
            <StatCard
              label="Pending Approvals"
              value={pending}
              sub="Awaiting action"
              icon={Icons.calendar}
              color="#f59e0b"
            />
            <StatCard
              label="Total Requests"
              value={requests.length}
              icon={Icons.list}
              color="#3b82f6"
            />
            <StatCard
              label="Approved This Year"
              value={
                requests.filter(r => r.status === "approved").length
              }
              icon={Icons.check}
              color="#10b981"
            />
            <StatCard
              label="Leave Types"
              value={leaveTypes.length}
              icon={Icons.settings}
              color="#8b5cf6"
            />
          </>
        )}
      </div>

      {/* ✅ Leave Balance */}
      {user.role === "employee" && myBalances.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <h3 className="section-title">Leave Balance — 2026</h3>

          <div className="grid">
            {myBalances.map(b => {
              const lt = leaveTypes.find(
                l => l.id === b.leave_type_id
              );
              const pct = Math.round(
                (b.used_days / b.total_days) * 100
              );

              const colors = ["#3b82f6", "#10b981", "#f59e0b"];
              const c = colors[b.leave_type_id % colors.length];

              return (
                <div key={b.id} className="card">
                  <div className="stat-label">
                    {lt?.type_name}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 8,
                    }}
                  >
                    <span className="stat-value">
                      {b.total_days - b.used_days}
                    </span>
                    <span className="dashboard-subtitle">
                      / {b.total_days} days
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${pct}%`,
                        background: c,
                      }}
                    />
                  </div>

                  <div className="dashboard-subtitle">
                    {b.used_days} used
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ✅ Recent Requests */}
      {user.role === "employee" && myRequests.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h3 className="section-title">Recent Requests</h3>

          <div className="card">
            {myRequests.slice(0, 4).map((r, i) => {
              const lt = leaveTypes.find(
                l => l.id === r.leave_type_id
              );

              return (
                <div
                  key={r.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom:
                      i < 3
                        ? "1px solid rgba(255,255,255,0.04)"
                        : "none",
                  }}
                >
                  <div>
                    <div
                      className="stat-value"
                      style={{ fontSize: 14 }}
                    >
                      {lt?.type_name} Leave
                    </div>

                    <div className="dashboard-subtitle">
                      {fmt(r.from_date)} → {fmt(r.to_date)}
                    </div>
                  </div>

                  <Badge status={r.status} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;