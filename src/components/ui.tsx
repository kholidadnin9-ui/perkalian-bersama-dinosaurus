import type { ReactNode, CSSProperties, ButtonHTMLAttributes } from "react";
const dinoGreen = `${import.meta.env.BASE_URL}images/dino-green.png`;
const dinoRed = `${import.meta.env.BASE_URL}images/dino-red.png`;
const dinoBlue = `${import.meta.env.BASE_URL}images/dino-blue.png`;
const dinoPurple = `${import.meta.env.BASE_URL}images/dino-purple.png`;

/* ---------------- Star ---------------- */
export function Star({
  filled = true,
  size = 28,
  delay = 0,
  animate = false,
  className = "",
}: {
  filled?: boolean;
  size?: number;
  delay?: number;
  animate?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={`${animate ? "anim-star" : ""} ${className}`}
      style={animate ? { animationDelay: `${delay}ms` } : undefined}
    >
      <defs>
        <linearGradient id={`sg-${filled ? "f" : "e"}`} x1="0" y1="0" x2="0" y2="1">
          {filled ? (
            <>
              <stop offset="0%" stopColor="#FFF0A8" />
              <stop offset="45%" stopColor="#FFC42E" />
              <stop offset="100%" stopColor="#E89311" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#E4D3B4" />
              <stop offset="100%" stopColor="#BFA379" />
            </>
          )}
        </linearGradient>
      </defs>
      <path
        d="M12 1.7l3.1 6.5 7.1.92-5.2 4.87 1.32 7.1L12 17.62 5.68 21.1 7 13.99 1.8 9.12 8.9 8.2z"
        fill={`url(#sg-${filled ? "f" : "e"})`}
        stroke={filled ? "#B4711A" : "#9C8154"}
        strokeWidth="1.1"
        strokeLinejoin="round"
      />
      {filled && (
        <path
          d="M9.4 6.2c.7-.9 1.6-1.6 2.4-1.9"
          stroke="#FFF6D2"
          strokeWidth="1.3"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />
      )}
    </svg>
  );
}

export function StarRow({
  count,
  size = 30,
  animate = false,
}: {
  count: number;
  size?: number;
  animate?: boolean;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <Star key={i} filled={i < count} size={size} animate={animate} delay={i * 190} />
      ))}
    </div>
  );
}

/* ---------------- Buttons ---------------- */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "green" | "orange" | "blue" | "purple" | "red" | "slate" | "cream";
  size?: "sm" | "md" | "lg";
};

export function Btn({
  variant = "green",
  size = "md",
  className = "",
  children,
  ...rest
}: BtnProps) {
  const sizes = {
    sm: "px-5 py-2 text-[clamp(0.95rem,2.4vw,1.15rem)]",
    md: "px-7 py-2.5 text-[clamp(1.15rem,3.2vw,1.65rem)]",
    lg: "px-9 py-3.5 text-[clamp(1.5rem,4.4vw,2.35rem)]",
  };
  return (
    <button
      {...rest}
      className={`btn3d btn-${variant} ${sizes[size]} ${className}`}
      style={{ ...(rest.style ?? {}) }}
    >
      {children}
    </button>
  );
}

export function IconBtn({
  label,
  onClick,
  children,
  variant = "orange",
  className = "",
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  variant?: "orange" | "green" | "red" | "blue";
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`btn3d btn-${variant} h-11 w-11 sm:h-13 sm:w-13 shrink-0 rounded-full p-0 ${className}`}
      style={{ fontSize: 0 }}
    >
      <span className="pointer-events-none flex items-center justify-center">{children}</span>
    </button>
  );
}

/* ---------------- Materials ---------------- */
export function WoodSign({
  children,
  className = "",
  style,
  deep = false,
  bolted = true,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  deep?: boolean;
  bolted?: boolean;
}) {
  return (
    <div className={`${deep ? "wood-deep" : "wood"} rounded-[26px] ${className}`} style={style}>
      {bolted && (
        <>
          <span className="pointer-events-none absolute left-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#e7c489] shadow-[inset_0_-2px_2px_rgba(90,50,15,0.55)]" />
          <span className="pointer-events-none absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-[#e7c489] shadow-[inset_0_-2px_2px_rgba(90,50,15,0.55)]" />
          <span className="pointer-events-none absolute bottom-2.5 left-2.5 h-2.5 w-2.5 rounded-full bg-[#c99b62] shadow-[inset_0_-2px_2px_rgba(90,50,15,0.55)]" />
          <span className="pointer-events-none absolute bottom-2.5 right-2.5 h-2.5 w-2.5 rounded-full bg-[#c99b62] shadow-[inset_0_-2px_2px_rgba(90,50,15,0.55)]" />
        </>
      )}
      {children}
    </div>
  );
}

export function Parchment({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`parchment rounded-[28px] ${className}`} style={style}>
      {children}
    </div>
  );
}

/* ---------------- Dinosaur egg ---------------- */
export function Egg({
  body,
  top,
  bottom,
  edge,
  speck,
  letter,
  number,
}: {
  body: string;
  top: string;
  bottom: string;
  edge: string;
  speck: string;
  letter: string;
  number: number;
}) {
  const gid = `egg-${number}`;
  return (
    <svg viewBox="0 0 120 156" className="h-full w-full">
      <defs>
        <linearGradient id={`${gid}-g`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={top} />
          <stop offset="52%" stopColor={body} />
          <stop offset="100%" stopColor={bottom} />
        </linearGradient>
        <radialGradient id={`${gid}-h`} cx="0.34" cy="0.24" r="0.42">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path
        d="M60 5C90 5 115 51 115 91c0 35-24 60-55 60S5 126 5 91C5 51 30 5 60 5Z"
        fill={`url(#${gid}-g)`}
        stroke={edge}
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <ellipse cx="42" cy="42" rx="19" ry="26" fill={`url(#${gid}-h)`} />
      <g fill={speck} opacity="0.55">
        <ellipse cx="34" cy="92" rx="9" ry="7" transform="rotate(-18 34 92)" />
        <ellipse cx="82" cy="66" rx="7.5" ry="6" transform="rotate(15 82 66)" />
        <ellipse cx="72" cy="116" rx="10" ry="7.5" transform="rotate(-8 72 116)" />
        <ellipse cx="90" cy="98" rx="6" ry="5" />
        <ellipse cx="46" cy="126" rx="6.5" ry="5" />
      </g>
      <text
        x="60"
        y="106"
        textAnchor="middle"
        className="font-display"
        style={{
          fontSize: 74,
          fontWeight: 800,
          fill: letter,
          paintOrder: "stroke",
          stroke: "rgba(255,255,255,0.55)",
          strokeWidth: 4,
        }}
      >
        {number}
      </text>
    </svg>
  );
}

/* ---------------- Dinosaurs ---------------- */
const DINO_SRC: Record<string, string> = {
  green: dinoGreen,
  red: dinoRed,
  blue: dinoBlue,
  purple: dinoPurple,
  green2: dinoGreen,
};

export function Dino({
  name,
  className = "",
  style,
  flip = false,
}: {
  name: "green" | "red" | "blue" | "purple" | "green2";
  className?: string;
  style?: CSSProperties;
  flip?: boolean;
}) {
  return (
    <img
      src={DINO_SRC[name]}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={`pointer-events-none select-none ${className}`}
      style={{
        ...style,
        filter: "drop-shadow(0 18px 22px rgba(8,40,28,0.42))",
        transform: `${style?.transform ?? ""} ${flip ? "scaleX(-1)" : ""}`.trim(),
      }}
    />
  );
}

/* ---------------- Small icons (inline SVG) ---------------- */
export const IconGear = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path
      fill="#fff6e2"
      d="M12 8.4a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2Zm0 5.4a1.8 1.8 0 1 1 0-3.6 1.8 1.8 0 0 1 0 3.6Z"
    />
    <path
      fill="#fff6e2"
      d="M20.2 13.6a8.4 8.4 0 0 0 0-3.2l1.9-1.4-2-3.4-2.2.9a8.6 8.6 0 0 0-2.8-1.6L14.8 2h-4l-.4 2.9a8.6 8.6 0 0 0-2.8 1.6l-2.2-.9-2 3.4 1.9 1.4a8.4 8.4 0 0 0 0 3.2l-1.9 1.4 2 3.4 2.2-.9a8.6 8.6 0 0 0 2.8 1.6l.4 2.9h4l.4-2.9a8.6 8.6 0 0 0 2.8-1.6l2.2.9 2-3.4-2-1.4Z"
      opacity="0.92"
    />
  </svg>
);

export const IconSound = ({ muted }: { muted: boolean }) => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path fill="#fff6e2" d="M4 9.5h3.4L12 5.4v13.2L7.4 14.5H4z" />
    {muted ? (
      <path
        stroke="#fff6e2"
        strokeWidth="2.1"
        strokeLinecap="round"
        d="M15.6 9.4l4.8 5.2M20.4 9.4l-4.8 5.2"
      />
    ) : (
      <>
        <path
          stroke="#fff6e2"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          d="M15.4 9.2a4 4 0 0 1 0 5.6"
        />
        <path
          stroke="#fff6e2"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          d="M18 6.6a7.7 7.7 0 0 1 0 10.8"
        />
      </>
    )}
  </svg>
);

export const IconHome = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path fill="#fff6e2" d="M12 3.2 21 11h-2.6v8.4h-4.6v-5h-3.6v5H5.6V11H3z" />
  </svg>
);

export const IconBack = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
    <path
      fill="none"
      stroke="#fff6e2"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14.5 5.5 8 12l6.5 6.5"
    />
  </svg>
);

export const IconPlay = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path fill="currentColor" d="M7.5 4.6 19 12 7.5 19.4z" />
  </svg>
);

export const IconRetry = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      d="M19.5 12a7.5 7.5 0 1 1-2.4-5.5"
    />
    <path fill="currentColor" d="M18.6 2.6 20.4 8l-5.5.9z" />
  </svg>
);

export const IconArrow = ({ size = 22 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5"
    />
  </svg>
);
