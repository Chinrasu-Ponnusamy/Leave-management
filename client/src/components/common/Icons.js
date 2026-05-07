export const Icon = ({ d, size = 18, color = "currentColor" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

export const Icons = {
  calendar:
    "M8 7V3 M16 7V3 M3 11H21 M5 21H19 A2 2 0 0 0 21 19V7 A2 2 0 0 0 19 5H5 A2 2 0 0 0 3 7V19 A2 2 0 0 0 5 21Z",

  check:
    "M20 6L9 17L4 12",

  x:
    "M18 6L6 18 M6 6L18 18",

  user:
    "M20 21V19A4 4 0 0 0 16 15H8A4 4 0 0 0 4 19V21 M12 11A4 4 0 1 0 12 3A4 4 0 0 0 12 11Z",

  logout:
    "M16 17L21 12L16 7 M21 12H9 M13 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H13",

  plus:
    "M12 5V19 M5 12H19",

  list:
    "M8 6H21 M8 12H21 M8 18H21 M3 6H3.01 M3 12H3.01 M3 18H3.01",

  trash:
    "M3 6H21 M8 6V4H16V6 M6 6V20A2 2 0 0 0 8 22H16A2 2 0 0 0 18 20V6",
};