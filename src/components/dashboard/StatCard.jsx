const StatCard = ({ title, value }) => {
  return (
    <div className="relative bg-card/80 backdrop-blur-glass border border-border rounded-xl p-6 shadow-glow">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-white mt-2">
        {value}
      </p>
    </div>
  );
};

export default StatCard;
