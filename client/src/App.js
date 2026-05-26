import { useState, useCallback } from "react";

import { MOCK_USERS, INIT_LEAVE_TYPES, INIT_REQUESTS, INIT_BALANCES } from "./data/mockData";

import LoginScreen from "./components/layout/LoginScreen";
import Sidebar from "./components/layout/Sidebar";

import Dashboard from "./Pages/Dashboard";
import ApplyLeave from "./Pages/ApplyLeave";
import MyRequests from "./Pages/MyRequests";
import TeamRequests from "./Pages/TeamRequests";
import AdminPanel from "./Pages/AdminPanel";

import Toast from "./components/common/Toast";
import "./App.css";

export default function App() {

  // STATES
  const [user, setUser] = useState(null);
  const [activeTab, setTab] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const [leaveTypes, setLeaveTypes] = useState(INIT_LEAVE_TYPES);
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [balances, setBalances] = useState(INIT_BALANCES);
  const [toast, setToast] = useState(null);

  //  TOAST
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  // AUTH
  const handleLogin = (u) => {
    setUser(u);
    setTab("dashboard");
  };

  const handleLogout = () => {
    setUser(null);
  };

  // SIDEBAR
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  //  LEAVE TYPE
  const handleAddLeaveType = (newType) => {
    const id = leaveTypes.length
      ? Math.max(...leaveTypes.map(l => l.id)) + 1
      : 1;

    setLeaveTypes(prev => [...prev, { id, ...newType }]);
    showToast("Leave type added");
  };

  const handleDeleteLeaveType = (id) => {
    setLeaveTypes(prev => prev.filter(l => l.id !== id));
    showToast("Leave type deleted");
  };

  //  REQUEST ACTIONS
  const handleApprove = (id) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "approved" } : r)
    );
    showToast("Request approved");
  };

  const handleReject = (id) => {
    setRequests(prev =>
      prev.map(r => r.id === id ? { ...r, status: "rejected" } : r)
    );
    showToast("Request rejected");
  };

  const handleCancel = (id) => {
    setRequests(prev => prev.filter(r => r.id !== id));
    showToast("Request cancelled");
  };

  //  APPLY LEAVE
  const handleApply = useCallback((form) => {
    const newId = requests.length
      ? Math.max(...requests.map(r => r.id)) + 1
      : 1;

    setRequests(prev => [
      ...prev,
      {
        id: newId,
        employee_id: user.id,
        ...form,
        status: "pending"
      }
    ]);

    showToast("Leave applied");
  }, [requests, user]);

  //  LOGIN SCREEN
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  //  MAIN UI
  return (
    <div style={{ display: "flex" }}>

      <Sidebar
        user={user}
        activeTab={activeTab}
        setTab={setTab}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div style={{ flex: 1, padding: "20px" }}>

        {activeTab === "dashboard" && (
          <Dashboard
            user={user}
            leaveTypes={leaveTypes}
            requests={requests}
            balances={balances}
          />
        )}

        {activeTab === "apply" && (
          <ApplyLeave
            user={user}
            leaveTypes={leaveTypes}
            balances={balances}
            onSubmit={handleApply}
          />
        )}

        {activeTab === "my" && (
          <MyRequests
            user={user}
            requests={requests}
            leaveTypes={leaveTypes}
            onCancel={handleCancel}
          />
        )}

        {activeTab === "team" && (
          <TeamRequests
            user={user}
            requests={requests}
            leaveTypes={leaveTypes}
            users={MOCK_USERS}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}

        {activeTab === "admin" && (
          <AdminPanel
            leaveTypes={leaveTypes}
            onAdd={handleAddLeaveType}
            onDelete={handleDeleteLeaveType}
          />
        )}

      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} />}

    </div>
  );
}
