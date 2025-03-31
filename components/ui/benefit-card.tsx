import React from "react";

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const BenefitCard = ({ icon, title, description }: BenefitCardProps) => {
  return (
    <div className="rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 p-6 border border-purple-500/10 shadow-[0_0_15px_rgba(139,92,246,0.1)] backdrop-blur-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-600/20 to-indigo-600/20 text-purple-400 backdrop-blur-sm">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
};

export default BenefitCard;
