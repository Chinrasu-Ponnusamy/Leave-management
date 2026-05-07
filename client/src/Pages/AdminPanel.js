import "./AdminPanel.css";
import { useState } from "react";
import { Icon, Icons } from "../components/common/Icons";

function AdminPanel({ leaveTypes, onAdd, onDelete }) {
  const [form, setForm] = useState({
    type_name: "",
    max_days_per_year: ""
  });
  const [error, setError] = useState("");

  const handleAdd = () => {
    if (!form.type_name || !form.max_days_per_year)
      return setError("Both fields required");

    if (
      leaveTypes.find(
        l =>
          l.type_name.toLowerCase() ===
          form.type_name.toLowerCase()
      )
    )
      return setError("Leave type already exists");

    onAdd(form);
    setForm({ type_name: "", max_days_per_year: "" });
    setError("");
  };

  return (
    <div className="admin">
      <h2 className="admin-title">Leave Types Configuration</h2>
      <p className="admin-subtitle">
        Manage available leave types and their annual limits
      </p>

      <div className="admin-grid">

        {/* Existing Types */}
        <div>
          <h3 className="section-title">Existing Types</h3>

          <div className="list">
            {leaveTypes.map(lt => (
              <div key={lt.id} className="card list-item">
                
                <div>
                  <div className="type-name">{lt.type_name}</div>
                  <div className="type-sub">
                    Max {lt.max_days_per_year} days / year
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  
                  <div className="badge-box">
                    {lt.max_days_per_year}
                  </div>

                  {/* DELETE BUTTON */}
                  <button
                    onClick={() => onDelete(lt.id)}
                    style={{
                      background: "rgba(239,68,68,0.1)",
                      border: "1px solid rgba(239,68,68,0.3)",
                      color: "#f87171",
                      borderRadius: 8,
                      padding: "6px 10px",
                      cursor: "pointer"
                    }}
                  >
                    <Icon d={Icons.trash} size={14} color="#f87171" />
                  </button>

                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add New */}
        <div>
          <h3 className="section-title">Add New Type</h3>

          <div className="card">

            <div className="input-group">
              <label className="label">Type Name</label>
              <input
                className="input"
                value={form.type_name}
                onChange={e =>
                  setForm({
                    ...form,
                    type_name: e.target.value
                  })
                }
                placeholder="e.g. Maternity"
              />
            </div>

            <div className="input-group">
              <label className="label">Max Days / Year</label>
              <input
                type="number"
                className="input"
                value={form.max_days_per_year}
                onChange={e =>
                  setForm({
                    ...form,
                    max_days_per_year:
                      parseInt(e.target.value) || ""
                  })
                }
                placeholder="e.g. 180"
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button className="btn" onClick={handleAdd}>
              <Icon d={Icons.plus} size={16} color="#fff" />
              Add Leave Type
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminPanel;