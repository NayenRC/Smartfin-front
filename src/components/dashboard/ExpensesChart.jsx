import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8b5cf6", "#2563eb", "#3b82f6", "#6366f1", "#0284c7"];

const ExpensesChart = ({ data }) => {
  return (
    <div className="bg-card/50 backdrop-blur-glass border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">
        Gastos por categoría
      </h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="amount"
              nameKey="category"
              outerRadius={90}
            >
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpensesChart;
