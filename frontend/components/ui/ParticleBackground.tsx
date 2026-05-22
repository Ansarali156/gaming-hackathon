"use client";

export function ParticleBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#f4f6fa]">
      {/* Soft floating blobs */}
      <div className="absolute top-[-15%] left-[-15%] w-[60vw] h-[60vw] rounded-full bg-[var(--color-primary)] opacity-[0.09] blur-[120px] animate-float-slow" />
      <div className="absolute bottom-[-15%] right-[-15%] w-[70vw] h-[70vw] rounded-full bg-[var(--color-secondary)] opacity-[0.09] blur-[140px] animate-float-slower" />
      <div className="absolute top-[30%] right-[-20%] w-[50vw] h-[50vw] rounded-full bg-[var(--color-accent)] opacity-[0.09] blur-[100px] animate-float-medium" />
    </div>
  );
}
