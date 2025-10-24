'use client';

interface CircularProgressProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
}

export const CircularProgress = ({
  score,
  size = 120,
  strokeWidth = 10,
  trackColor = '#1E293B',
  progressColor = '#34D399',
}: CircularProgressProps) => {
  const clampedScore = Math.min(Math.max(score, 0), 100);
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampedScore / 100);

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Match score ${clampedScore}%`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <g>
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={trackColor}
            strokeWidth={strokeWidth}
            className="opacity-40"
          />

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-500 ease-out"
          />
        </g>
      </svg>

      <span className="absolute text-3xl font-semibold text-white">{clampedScore}%</span>
    </div>
  );
};
