"use client";

interface AdminPageHeaderProps {
  title: string;
  description: string;
}

export function AdminPageHeader({ title, description }: AdminPageHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-orange-400 font-cyberpunk mb-2">{title}</h1>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}
