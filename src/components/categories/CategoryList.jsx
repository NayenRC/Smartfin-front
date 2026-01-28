import React from 'react';
import { Edit2, Trash2, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import Button from '../ui/Button';

export default function CategoryList({ categories, onEdit, onDelete }) {
    if (!categories || categories.length === 0) {
        return (
            <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-100">
                <p>No hay categorías registradas.</p>
                <p className="text-sm mt-1">Crea una nueva para empezar.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
                <div
                    key={category.id_categoria || category.id || category._id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex justify-between items-center transition-shadow hover:shadow-md"
                >
                    <div className="flex items-center space-x-3">
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ backgroundColor: category.color || '#cbd5e1' }}
                        >
                            {(category.name || category.nombre || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-800">{category.name || category.nombre}</h4>
                            <div className="flex items-center text-xs text-gray-500">
                                {(category.type === 'income' || category.tipo === 'INGRESO') ? (
                                    <>
                                        <ArrowUpCircle className="w-3 h-3 text-green-500 mr-1" />
                                        <span>Ingreso</span>
                                    </>
                                ) : (
                                    <>
                                        <ArrowDownCircle className="w-3 h-3 text-red-500 mr-1" />
                                        <span>Gasto</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button
                            onClick={() => onEdit(category)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Editar"
                        >
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(category)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
