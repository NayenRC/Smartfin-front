import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CategoryList from '../components/categories/CategoryList';
import CategoryForm from '../components/categories/CategoryForm';
import Button from '../components/ui/Button';
import categoryService from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';

export default function Categories() {
    const { getToken } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [error, setError] = useState(null);

    // Cargar categorías
    const fetchCategories = async () => {
        try {
            setLoading(true);
            const token = await getToken();
            if (!token) return;

            const data = await categoryService.getCategories(token);
            setCategories(data);
        } catch (err) {
            console.error("Error fetching categories:", err);
            // Mantenemos un array vacío o mostramos error, pero ya es real
            setError("No se pudieron cargar las categorías.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleCreate = async (formData) => {
        try {
            const token = await getToken();
            const newHelper = await categoryService.createCategory(formData, token);

            // Actualizamos estado con la respuesta del backend
            setCategories([...categories, newHelper]);
            setShowForm(false);
            showSuccess("Categoría creada exitosamente.");
        } catch (err) {
            showError("Error al crear la categoría.");
            setError("Error al crear la categoría.");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            const token = await getToken();
            const updatedCat = await categoryService.updateCategory(editingCategory.id || editingCategory._id, formData, token);

            setCategories(categories.map(c =>
                (c.id === updatedCat.id || c._id === updatedCat._id) ? updatedCat : c
            ));
            setEditingCategory(null);
            setShowForm(false);
            showSuccess("Categoría actualizada.");
        } catch (err) {
            showError("Error al actualizar la categoría.");
            setError("Error al actualizar la categoría.");
        }
    };

    const handleDelete = async (category) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${category.name}"?`)) return;
        try {
            const token = await getToken();
            const id = category.id || category._id;
            await categoryService.deleteCategory(id, token);

            setCategories(categories.filter(c => (c.id || c._id) !== id));
            showSuccess("Categoría eliminada.");
        } catch (err) {
            showError("Error al eliminar la categoría.");
            setError("Error al eliminar la categoría.");
        }
    };

    const openEdit = (category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const openCreate = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const closeForm = () => {
        setEditingCategory(null);
        setShowForm(false);
        setError(null);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Categorías</h1>
                    <p className="text-gray-400 text-sm mt-1">Gestiona y personaliza tus finanzas</p>
                </div>
                {!showForm && (
                    <Button onClick={openCreate} className="flex items-center space-x-2 bg-neon-green/90 hover:bg-neon-green text-black font-semibold">
                        <Plus className="w-4 h-4" />
                        <span>Nueva Categoría</span>
                    </Button>
                )}
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {showForm ? (
                <div className="max-w-md mx-auto">
                    <CategoryForm
                        initialData={editingCategory}
                        onSubmit={editingCategory ? handleUpdate : handleCreate}
                        onCancel={closeForm}
                        isLoading={loading}
                    />
                </div>
            ) : (
                <>
                    {loading ? (
                        <div className="text-gray-400 text-center py-10 animate-pulse">Cargando categorías...</div>
                    ) : (
                        <CategoryList
                            categories={categories}
                            onEdit={openEdit}
                            onDelete={handleDelete}
                        />
                    )}
                </>
            )}
        </div>
    );
}
