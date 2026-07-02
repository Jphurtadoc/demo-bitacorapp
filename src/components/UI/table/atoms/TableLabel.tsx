interface TableLabelProps {
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}

export default function TableLabel({ htmlFor, children, className = '' }: TableLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={`mb-1.5 block text-xs font-semibold uppercase tracking-wide text-subtle ${className}`}
    >
      {children}
    </label>
  );
}
