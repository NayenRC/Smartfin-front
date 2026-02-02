import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8b5cf6", "#2563eb", "#3b82f6", "#6366f1", "#0284c7"];

const ExpensesChart = ({ data }) => {
  const hasData =
    Array.isArray(data) &&
    data.length > 0 &&
    data.some(item => Number(item.amount) > 0);

  return (
    <div className="bg-card/50 backdrop-blur-glass border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <h3 className="text-lg font-semibold mb-4 text-gray-200">
        Gastos por categoría
      </h3>

      <div className="flex-1 w-full min-h-[250px] relative">
        {!hasData ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <p>No tienes gastos registrados aún</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default ExpensesChart;
