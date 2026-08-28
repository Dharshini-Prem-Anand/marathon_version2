export default function MarathonMark({ size = 26, className }) {
  return (
    <svg
      width={size}
      height={size * 1.13}
      viewBox="0 0 100 113"
      className={className}
      aria-label="Marathon"
    >
      <path
        d="M50 5 L88 29 L88 85 L50 108 L12 85 L12 29 Z"
        fill="#ffffff"
        stroke="#003DA5"
        strokeWidth="9"
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="76"
        textAnchor="middle"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="900"
        fontSize="58"
        fill="#EE2E24"
      >
        M
      </text>
    </svg>
  )
}
