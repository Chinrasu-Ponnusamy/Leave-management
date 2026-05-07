import "./Sidebar.css";
import { Icon, Icons } from "../common/Icons";

function Sidebar({ user, activeTab, setTab, onLogout }) {
  const navItems = [
    { id:"dashboard", label:"Dashboard", icon:Icons.chart, roles:["employee","manager","admin"] },
    { id:"apply", label:"Apply Leave", icon:Icons.plus, roles:["employee"] },
    { id:"my", label:"My Requests", icon:Icons.list, roles:["employee"] },
    { id:"team", label:"Team Requests", icon:Icons.team, roles:["manager","admin"] },
    { id:"admin", label:"Leave Types", icon:Icons.settings, roles:["admin"] },
  ].filter(n => n.roles.includes(user.role));

  const roleColors = { employee:"#3b82f6", manager:"#8b5cf6", admin:"#f59e0b" };

  return (
    <div className="sidebar">

      {/* Logo */}
      <div className="sidebar-logo">
        <div
          className="logo-icon"
          style={{ background: "linear-gradient(135deg,#3b82f6,#06b6d4)" }}
        >
          <Icon d={Icons.calendar} size={18} color="#fff" />
        </div>
        <span className="logo-text">LeavePortal</span>
      </div>

      {/* User */}
      <div className="user-card">
        <div
          className="user-avatar"
          style={{
            background: `linear-gradient(135deg,${roleColors[user.role]},${roleColors[user.role]}88)`
          }}
        >
          {user.name[0]}
        </div>
        <div>
          <div className="user-name">{user.name}</div>
          <div
            className="user-role"
            style={{ color: roleColors[user.role] }}
          >
            {user.role}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="nav">
        {navItems.map(item => {
          const active = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`nav-item ${active ? "active" : ""}`}
            >
              <Icon
                d={item.icon}
                size={17}
                color={active ? "#93c5fd" : "#94a3b8"}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="logout">
        <button onClick={onLogout}>
          <Icon d={Icons.logout} size={17} />
          Sign Out
        </button>
      </div>

    </div>
  );
}

export default Sidebar;