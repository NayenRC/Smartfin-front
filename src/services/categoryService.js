import api from "./api";

const getCategories = async () => {
    const { data } = await api.get("/categorias");
    return data;
};

const createCategory = async (categoryData) => {
    // Mapeo: name -> nombre, type -> tipo
    const payload = {
        nombre: categoryData.name,
        tipo: categoryData.type,
        color: categoryData.color
    };
    const { data } = await api.post("/categorias", payload);
    return data;
};

const updateCategory = async (id, categoryData) => {
    const payload = {
        nombre: categoryData.name,
        tipo: categoryData.type,
        color: categoryData.color
    };
    const { data } = await api.put(`/categorias/${id}`, payload);
    return data;
};

const deleteCategory = async (id) => {
    const { data } = await api.delete(`/categorias/${id}`);
    return data;
};

export default {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
};
