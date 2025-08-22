interface LogoProps {
  className?: string;
  color?: "white" | "green" | "current";
}

export default function Logo({ className, color = "current" }: LogoProps) {
  const colorClass = {
    white: "text-white",
    green: "text-green-800",
    current: "text-current"
  }[color];

  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="5 10 310 65" 
      fill="none"
      className={`${colorClass} ${className || ""}`}
    >
      {/* Ticket */}
      <rect 
        x="10" 
        y="20" 
        width="80" 
        height="50" 
        rx="10" 
        ry="10"
        stroke="currentColor" 
        strokeWidth="6"
      />
      
      {/* Star (popping out) */}
      <polygon 
        points="50,10 58,34 84,34 62,50 70,74 50,60 30,74 38,50 16,34 42,34"
        fill="currentColor"
      />
      
      {/* Text */}
      <text 
        x="110" 
        y="58" 
        fontSize="36" 
        fontWeight="800"
        fontFamily="Inter, sans-serif" 
        fill="currentColor" 
        letterSpacing="1"
      >
        Concerto.
      </text>
    </svg>
  );
}
