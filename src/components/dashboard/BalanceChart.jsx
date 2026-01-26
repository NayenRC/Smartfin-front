import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BalanceChart = ({ income, expenses }) => {
  const data = [
    { name: "Ingresos", value: income },
    { name: "Gastos", value: expenses },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-glow">
      <h3 className="text-lg font-semibold mb-4">
        Ingresos vs Gastos
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
