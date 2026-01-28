import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';

export default function CategoryForm({
    initialData = null,
    onSubmit,
    onCancel,
    isLoading = false
}) {
    const [formData, setFormData] = useState({
        name: '',
        type: 'expense', // 'income' or 'expense'
        color: '#3b82f6', // default blue
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                type: initialData.type || 'expense',
                color: initialData.color || '#3b82f6',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {initialData ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
            </div>

            <Input
                id="name"
                label="Nombre"
                value={formData.name}
                onChange={(e) => handleChange({ target: { name: 'name', value: e.target.value } })}
                placeholder="Ej: Alimentación, Transporte..."
                required
            />

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <div className="flex space-x-4 mt-1">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            value="expense"
                            checked={formData.type === 'expense'}
                            onChange={handleChange}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Gasto</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name="type"
                            value="income"
                            checked={formData.type === 'income'}
                            onChange={handleChange}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">Ingreso</span>
                    </label>
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="color" className="block text-sm font-medium text-gray-700">
                    Color (Hex)
                </label>
                <div className="flex items-center space-x-2">
                    <input
                        type="color"
                        id="color"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="h-9 w-16 p-1 rounded-md border border-gray-300 cursor-pointer"
                    />
                    <Input
                        id="color-text"
                        value={formData.color}
                        onChange={(e) => handleChange({ target: { name: 'color', value: e.target.value } })}
                        placeholder="#000000"
                        className="flex-1"
                    />
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : (initialData ? 'Actualizar' : 'Crear')}
                </Button>
            </div>
        </form>
    );
}
