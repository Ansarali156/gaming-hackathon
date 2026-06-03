const fs = require('fs');
let content = fs.readFileSync('frontend/app/dashboard/admin/page.tsx', 'utf8');

// Fix Registration Chart Padding and Tooltip
content = content.replace(
  '<div className="h-64 flex items-end justify-start gap-4 pt-6 relative border-l border-b border-white/10 pb-2 pl-2 min-w-max pr-4">',
  '<div className="h-64 flex items-end justify-start gap-4 pt-10 relative border-l border-b border-white/10 pb-2 pl-2 min-w-max pr-4">'
);
content = content.replace(
  '<span className="absolute bottom-full mb-1 bg-surface-light px-2 py-0.5 rounded text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity">',
  '<span className="absolute bottom-full mb-1 bg-surface-light px-2 py-0.5 rounded text-xs text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">'
);

// Fix Revenue Chart Padding and Tooltip
content = content.replace(
  '<div className="h-64 flex items-end justify-start gap-4 pt-6 relative border-l border-b border-white/10 pb-2 pl-2 min-w-max pr-4">',
  '<div className="h-64 flex items-end justify-start gap-4 pt-10 relative border-l border-b border-white/10 pb-2 pl-2 min-w-max pr-4">'
);
content = content.replace(
  '<span className="absolute bottom-full mb-1 bg-surface-light px-2 py-0.5 rounded text-xs text-neon-green font-bold opacity-0 group-hover:opacity-100 transition-opacity">',
  '<span className="absolute bottom-full mb-1 bg-surface-light px-2 py-0.5 rounded text-xs text-neon-green font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">'
);

fs.writeFileSync('frontend/app/dashboard/admin/page.tsx', content);
