const fs = require('fs');
let content = fs.readFileSync('frontend/app/dashboard/admin/page.tsx', 'utf8');

// Replace Registration Trends
content = content.replace(
  '<h3 className="font-display font-bold text-text mb-4">Registration Trends (7 Days)</h3>\r\n          <div className="h-64 flex items-end justify-between gap-2 pt-6 relative border-l border-b border-white/10 pb-2 pl-2">',
  '<h3 className="font-display font-bold text-text mb-4">Registration Trends</h3>\r\n          <div className="overflow-x-auto pb-4 custom-scrollbar">\r\n            <div className="h-64 flex items-end justify-start gap-4 pt-6 relative border-l border-b border-white/10 pb-2 pl-2 min-w-max pr-4">'
);

// Replace flex-1 for registration
content = content.replace(
  '<div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">',
  '<div key={idx} className="flex flex-col items-center group relative h-full justify-end w-12 flex-shrink-0">'
);

// Close Registration wrapper
content = content.replace(
  '              );\r\n            })}\r\n          </div>\r\n        </div>\r\n\r\n        {/* Revenue Area Trend Chart (SVG) */}',
  '              );\r\n            })}\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        {/* Revenue Area Trend Chart (SVG) */}'
);

// Replace Revenue Analytics
content = content.replace(
  '<h3 className="font-display font-bold text-text mb-4">Revenue Analytics (7 Days)</h3>\r\n          <div className="h-64 flex items-end justify-between gap-2 pt-6 relative border-l border-b border-white/10 pb-2 pl-2">',
  '<h3 className="font-display font-bold text-text mb-4">Revenue Analytics</h3>\r\n          <div className="overflow-x-auto pb-4 custom-scrollbar">\r\n            <div className="h-64 flex items-end justify-start gap-4 pt-6 relative border-l border-b border-white/10 pb-2 pl-2 min-w-max pr-4">'
);

// Replace flex-1 for revenue
content = content.replace(
  '<div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">',
  '<div key={idx} className="flex flex-col items-center group relative h-full justify-end w-12 flex-shrink-0">'
);

// Close Revenue wrapper
content = content.replace(
  '              );\r\n            })}\r\n          </div>\r\n        </div>\r\n\r\n        {/* Category distribution */}',
  '              );\r\n            })}\r\n            </div>\r\n          </div>\r\n        </div>\r\n\r\n        {/* Category distribution */}'
);

// Fallback for LF line endings just in case Git checkout saved it with LF
content = content.replace(
  '<h3 className="font-display font-bold text-text mb-4">Registration Trends (7 Days)</h3>\n          <div className="h-64 flex items-end justify-between gap-2 pt-6 relative border-l border-b border-white/10 pb-2 pl-2">',
  '<h3 className="font-display font-bold text-text mb-4">Registration Trends</h3>\n          <div className="overflow-x-auto pb-4 custom-scrollbar">\n            <div className="h-64 flex items-end justify-start gap-4 pt-6 relative border-l border-b border-white/10 pb-2 pl-2 min-w-max pr-4">'
);

content = content.replace(
  '              );\n            })}\n          </div>\n        </div>\n\n        {/* Revenue Area Trend Chart (SVG) */}',
  '              );\n            })}\n            </div>\n          </div>\n        </div>\n\n        {/* Revenue Area Trend Chart (SVG) */}'
);

content = content.replace(
  '<h3 className="font-display font-bold text-text mb-4">Revenue Analytics (7 Days)</h3>\n          <div className="h-64 flex items-end justify-between gap-2 pt-6 relative border-l border-b border-white/10 pb-2 pl-2">',
  '<h3 className="font-display font-bold text-text mb-4">Revenue Analytics</h3>\n          <div className="overflow-x-auto pb-4 custom-scrollbar">\n            <div className="h-64 flex items-end justify-start gap-4 pt-6 relative border-l border-b border-white/10 pb-2 pl-2 min-w-max pr-4">'
);

content = content.replace(
  '              );\n            })}\n          </div>\n        </div>\n\n        {/* Category distribution */}',
  '              );\n            })}\n            </div>\n          </div>\n        </div>\n\n        {/* Category distribution */}'
);

fs.writeFileSync('frontend/app/dashboard/admin/page.tsx', content);
