export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-card rounded-3xl border border-border ${className}`}>
      {children}
    </div>
  );
}