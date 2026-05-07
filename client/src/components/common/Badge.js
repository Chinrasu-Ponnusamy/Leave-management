import { statusBg, statusColor } from "../../utils/helpers";

export default function Badge({ status }) {
  return (
    <span style={{ background: statusBg(status), color: statusColor(status), padding:"4px 10px", borderRadius:20 }}>
      {status}
    </span>
  );
}