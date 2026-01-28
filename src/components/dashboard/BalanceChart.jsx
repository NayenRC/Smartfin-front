import {
  BarChart,
  Bar,
  Cell,
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
    <div className="bg-card/50 backdrop-blur-glass border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Ingresos vs Gastos
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar
              dataKey="value"
              radius={[6, 6, 0, 0]}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.name === "Ingresos" ? "#00ff9c" : "#8b5cf6"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BalanceChart;
