"use client";

const logos = [
  "/rtih_logo.png",
  "https://www.collegecircle.cc/assets/cclogo.PNG",
  "https://dc-cdn.s3-ap-southeast-1.amazonaws.com/dc-Cover-4upece6p9dvb9msn1tlcgsivc6-20160519052405.Medi.jpeg",
  "/incuxai_new.png",
  "https://upload.wikimedia.org/wikipedia/en/e/ea/Appolice%28emblem%29.png",
  "https://hinduengg.com/hinduenggnew/New-Images-HCET/College/Logos/hcet.png",
  "https://studentunionfornation.org/sunimages/logo.png",
  "https://smq.oym.mybluehostin.me/wp-content/uploads/2024/01/NuLeap-Logo.png"
];

const marqueeLogos = [...logos, ...logos, ...logos, ...logos, ...logos, ...logos];

export function LogoScrollSection() {
  return (
    <section className="w-full mt-16 mb-4">
      <p className="text-center text-text-muted text-xs uppercase tracking-widest mb-6 font-semibold">
        Supported & Recognized By
      </p>
      <div className="w-full py-8 bg-surface-light/50 border-y border-white/5 flex overflow-hidden">
      <style>{`
        @keyframes scroll-ltr {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-scroll-ltr {
          animation: scroll-ltr 90s linear infinite;
        }
      `}</style>
      <div className="flex w-max animate-scroll-ltr items-center hover:[animation-play-state:paused]">
        <div className="flex w-max items-center gap-16 px-8">
          {marqueeLogos.map((logo, i) => (
            <img
              key={`a-${i}`}
              src={logo}
              alt="Partner Logo"
              className="h-20 md:h-24 object-contain rounded-lg shadow-lg opacity-80 hover:opacity-100 transition-opacity shrink-0"
            />
          ))}
        </div>
        <div className="flex w-max items-center gap-16 px-8">
          {marqueeLogos.map((logo, i) => (
            <img
              key={`b-${i}`}
              src={logo}
              alt="Partner Logo"
              className="h-20 md:h-24 object-contain rounded-lg shadow-lg opacity-80 hover:opacity-100 transition-opacity shrink-0"
            />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
