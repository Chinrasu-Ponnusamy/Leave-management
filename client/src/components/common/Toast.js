import { useEffect } from "react";

export default function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div style={{ position:"fixed", bottom:20, right:20, background:"#333", color:"#fff", padding:10 }}>
      {msg}
    </div>
  );
}