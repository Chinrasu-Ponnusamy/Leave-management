export const Icon = ({ d, size=18, color="currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d}/>
  </svg>
);

export const Icons = {
  calendar: "M8 7V3m8 4V3m-9 8h10M5 21h14...",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
  logout: "M17 16l4-4...",
  plus: "M12 5v14M5 12h14",
  list: "M9 5H7a2 2 0 00-2 2...",
  team: "M17 20h5v-2...",
  settings: "M10.325 4.317...",
  chart: "M9 19v-6...",
  trash: "M19 7l-.867...",
};