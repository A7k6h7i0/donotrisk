"use client";

type UploadCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function UploadCard({ title, description, children }: UploadCardProps) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mt-1 text-sm text-ink/70">{description}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
