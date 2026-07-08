interface RBCShieldProps {
  size?: number;
  className?: string;
}

export default function RBCShield({ size = 40, className = '' }: RBCShieldProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-label="RBC"
    >
      <path
        d="M24 2C24 2 6 8 6 18v12c0 8 8 14 18 16 10-2 18-8 18-16V18C42 8 24 2 24 2z"
        fill="#005DAA"
        stroke="#FFD200"
        strokeWidth="1.5"
      />
      <path
        d="M24 6C24 6 10 11 10 19v10c0 6 6 11 14 13 8-2 14-7 14-13V19C38 11 24 6 24 6z"
        fill="#005DAA"
      />
      {/* Stylized lion silhouette */}
      <path
        d="M20 18c-1 0-2 1-2 2v2c0 1 .5 2 1.5 2.5L17 28c-.5.5-.5 1 0 1.5l2 2c.5.5 1 .5 1.5 0l2-2.5h3l2 2.5c.5.5 1 .5 1.5 0l2-2c.5-.5.5-1 0-1.5l-2.5-3.5c1-.5 1.5-1.5 1.5-2.5v-2c0-1-1-2-2-2h-8z"
        fill="#FFD200"
        opacity="0.9"
      />
      <circle cx="22" cy="21" r="1" fill="#005DAA" />
      <circle cx="26" cy="21" r="1" fill="#005DAA" />
      <text
        x="24"
        y="40"
        textAnchor="middle"
        fill="#FFD200"
        fontSize="6"
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        RBC
      </text>
    </svg>
  );
}
