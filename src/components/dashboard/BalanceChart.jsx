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
  const hasData = income > 0 || expenses > 0;

  const data = [
    { name: "Ingresos", value: income },
    { name: "Gastos", value: expenses },
  ];

  return (
    <div className="bg-card/50 backdrop-blur-glass border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">
        Ingresos vs Gastos
      </h3>

      <div className="flex-1 w-full min-h-[250px] relative">
        {!hasData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <p>Sin movimientos este mes</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip
                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
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
        )}
      </div>
    </div>
  );
};

export default BalanceChart;
