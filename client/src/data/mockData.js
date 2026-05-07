export const MOCK_USERS = [
  { id: 1, name: "Alice Admin", email: "admin@company.com", password: "password123", role: "admin", dept: "HR" },
  { id: 2, name: "Mark Manager", email: "manager@company.com", password: "password123", role: "manager", dept: "Engineering" },
  { id: 3, name: "Eve Employee", email: "employee@company.com", password: "password123", role: "employee", dept: "Engineering" },
  { id: 4, name: "Sam Smith", email: "sam@company.com", password: "password123", role: "employee", dept: "Design" },
];

export const INIT_LEAVE_TYPES = [
  { id: 1, type_name: "Casual", max_days_per_year: 12 },
  { id: 2, type_name: "Sick", max_days_per_year: 10 },
  { id: 3, type_name: "Earned", max_days_per_year: 15 },
];

export const INIT_REQUESTS = [
  { id: 1, employee_id: 3, leave_type_id: 1, from_date: "2026-03-10", to_date: "2026-03-11", reason: "Personal work", status: "approved", approved_by: 2 },
  { id: 2, employee_id: 3, leave_type_id: 3, from_date: "2026-02-01", to_date: "2026-02-05", reason: "Vacation", status: "approved", approved_by: 2 },
  { id: 3, employee_id: 3, leave_type_id: 1, from_date: "2026-04-20", to_date: "2026-04-21", reason: "Family event", status: "pending", approved_by: null },
  { id: 4, employee_id: 4, leave_type_id: 2, from_date: "2026-04-15", to_date: "2026-04-16", reason: "Not feeling well", status: "pending", approved_by: null },
];

export const INIT_BALANCES = [
  { id: 1, employee_id: 3, leave_type_id: 1, year: 2026, total_days: 12, used_days: 2 },
  { id: 2, employee_id: 3, leave_type_id: 2, year: 2026, total_days: 10, used_days: 0 },
  { id: 3, employee_id: 3, leave_type_id: 3, year: 2026, total_days: 15, used_days: 5 },
  { id: 4, employee_id: 4, leave_type_id: 1, year: 2026, total_days: 12, used_days: 0 },
  { id: 5, employee_id: 4, leave_type_id: 2, year: 2026, total_days: 10, used_days: 0 },
  { id: 6, employee_id: 4, leave_type_id: 3, year: 2026, total_days: 15, used_days: 0 },
];