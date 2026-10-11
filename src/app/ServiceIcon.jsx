export default function ServiceIcon({ type, className }) {
  const paths = {
    all: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    painters: <><path d="M4 5h12a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" /><path d="M18 8h2a2 2 0 0 1 2 2v1a2 2 0 0 1-2 2h-8v4m0 0v4" /></>,
    cleaning: <><path d="m4 20 8-8m-1-7 1.3 3.7L16 10l-3.7 1.3L11 15l-1.3-3.7L6 10l3.7-1.3L11 5Z" /><path d="m19 3 .6 1.4L21 5l-1.4.6L19 7l-.6-1.4L17 5l1.4-.6L19 3Z" /></>,
    auto_repair: <><path d="M5 17v2m14-2v2M4 13l2-6h12l2 6M3 13h18v4H3v-4Z" /><path d="M7 15h.01M17 15h.01" /></>,
  };
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[type]}</svg>;
}
