const icons = {
  add: (
    <>
      <path pathLength="1" d="M23 17h14l7 7v23H23a3 3 0 0 1-3-3V20a3 3 0 0 1 3-3Z" />
      <path pathLength="1" d="M36 17v8h8M32 31v10m-5-5h10" />
    </>
  ),
  search: (
    <>
      <circle pathLength="1" cx="29" cy="29" r="11" />
      <path pathLength="1" d="m37 37 10 10" />
    </>
  ),
  contact: (
    <path pathLength="1" d="m23 18-5 4c-2 2 1 11 8 18s16 10 18 8l4-5-8-6-4 4c-5-2-9-6-11-11l4-4-6-8Z" />
  ),
};

export default function StepIllustration({ type, className }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true" focusable="false" className={className}>
      <circle data-icon-background="" cx="32" cy="32" r="30" fill="#E3EDE5" />
      <g data-icon-lines="" stroke="#008080" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        {icons[type]}
      </g>
    </svg>
  );
}
