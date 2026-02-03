import api from "./api";

export async function getRecentTransactions() {
    try {
        const [expensesResponse, incomesResponse] = await Promise.all([
            api.get("/gastos?limit=5"),
            api.get("/ingresos?limit=5")
        ]);

        const expenses = expensesResponse.data.map(item => ({
            ...item,
            type: 'expense'
        }));

        const incomes = incomesResponse.data.map(item => ({
            ...item,
            type: 'income'
        }));

        // Combinar y ordenar por fecha descendente
        return [...expenses, ...incomes]
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
            .slice(0, 10);
    } catch (error) {
        console.error("❌ Error fetching transactions:", error);
        return [];
    }
}
