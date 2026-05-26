import "./ApplyLeave.css";
import { useState } from "react";
import { daysBetween } from "../utils/helpers";

function ApplyLeave({ user, leaveTypes, balances, onSubmit }) {
  const [form, setForm] = useState({
    leave_type_id: "",
    from_date: "",
    to_date: "",
    reason: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selectedBal = balances.find(
    b =>
      b.employee_id === user.id &&
      b.leave_type_id === parseInt(form.leave_type_id) &&
      b.year === 2026
  );

  const days =
    form.from_date && form.to_date
      ? Math.max(0, daysBetween(form.from_date, form.to_date))
      : 0;

  const remaining = selectedBal
    ? selectedBal.total_days - selectedBal.used_days
    : null;

  const handleSubmit = () => {
    setError("");

    if (
      !form.leave_type_id ||
      !form.from_date ||
      !form.to_date
    )
      return setError("All fields are required");

    if (days <= 0)
      return setError(
        "End date must be on or after start date"
      );

    if (remaining !== null && days > remaining)
      return setError(
        `Insufficient balance. You have ${remaining} days available.`
      );

    setLoading(true);

    setTimeout(() => {
      onSubmit({
        ...form,
        leave_type_id: parseInt(form.leave_type_id),
        days
      });

      setForm({
        leave_type_id: "",
        from_date: "",
        to_date: "",
        reason: ""
      });

      setLoading(false);
    }, 600);
  };

  return (
    <div className="apply">

      <h2 className="apply-title">
        Apply for Leave
      </h2>

      <p className="apply-subtitle">
        Submit a new leave request for approval
      </p>

      <div className="card-1">

        {/* Leave Type */}
        <div className="field">
          <label className="label">Leave Type</label>
          <select
            className="input"
            value={form.leave_type_id}
            onChange={e =>
              setForm({
                ...form,
                leave_type_id: e.target.value
              })
            }
          >
            <option value="">
              Select leave type…
            </option>

            {leaveTypes.map(lt => {
              const b = balances.find(
                b =>
                  b.employee_id === user.id &&
                  b.leave_type_id === lt.id &&
                  b.year === 2026
              );

              const avail = b
                ? b.total_days - b.used_days
                : 0;

              return (
                <option key={lt.id} value={lt.id}>
                  {lt.type_name} ({avail} days available)
                </option>
              );
            })}
          </select>
        </div>

        {/* Dates */}
        <div className="grid">

          <div className="field">
            <label className="label">
              From Date
            </label>
            <input
              type="date"
              className="input"
              value={form.from_date}
              onChange={e =>
                setForm({
                  ...form,
                  from_date: e.target.value
                })
              }
            />
          </div><br></br>

          <div className="field">
            <label className="label">
              To Date
            </label>
            <input
              type="date"
              className="input"
              value={form.to_date}
              onChange={e =>
                setForm({
                  ...form,
                  to_date: e.target.value
                })
              }
            />
          </div>

        </div>

        {/* Info */}
        {days > 0 && (
          <div className="info-box">
            {days} day{days !== 1 ? "s" : ""} requested
            {remaining !== null && (
              <span
                style={{
                  marginLeft: 10,
                  color:
                    days > remaining
                      ? "#f87171"
                      : "#6ee7b7"
                }}
              >
                ({remaining} available)
              </span>
            )}
          </div>
        )}

        {/* Reason */}
        <div className="field">
          <label className="label">Reason</label>
          <textarea
            className="input"
            rows={3}
            placeholder="Describe the reason for your leave…"
            value={form.reason}
            onChange={e =>
              setForm({
                ...form,
                reason: e.target.value
              })
            }
          />
        </div>

        {/* Error */}
        {error && (
          <p className="error">{error}</p>
        )}

        {/* Submit */}
        <button
          className="button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading
            ? "Submitting…"
            : "Submit Leave Request"}
        </button>

      </div>
    </div>
  );
}

export default ApplyLeave;
