import api from "./api";


export async function getDashboardResumen() {
  const response = await api.get("/dashboard/resumen");
  return response.data;
}

const [gastosCategoria, setGastosCategoria] = useState([]);

useEffect(() => {
  getDashboardResumen()
    .then((data) => {
      setResumen(data); // si ya lo tienes
      setGastosCategoria(data.por_categoria || []);
    })
    .catch(console.error);
}, []);
useEffect(() => {
  getDashboardResumen()
    .then((data) => {
      setResumen(data); // si ya lo tienes
      setGastosCategoria(data.por_categoria || []);
    })
    .catch(console.error);
}, []);
export async function getGastosPorCategoria() {
  const response = await api.get("/dashboard/gastos-por-categoria");
  return response.data;
}