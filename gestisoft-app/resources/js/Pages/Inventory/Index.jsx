import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, products }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Inventario</h2>}
        >
            <Head title="Inventario" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xs sm:rounded-2xl border border-gray-200/80 p-6">
                        
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Catálogo de Productos</h3>
                                <p className="text-xs text-gray-500 mt-0.5">Control de existencias y precios del negocio</p>
                            </div>
                            <Link 
                                href={route('inventory.create')} 
                                className="inline-flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 shadow-xs hover:shadow transition-all duration-200 active:scale-[0.99]"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                <span>Nuevo Producto</span>
                            </Link>
                        </div>

                        <div className="overflow-x-auto rounded-xl border border-gray-100">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50/75">
                                    <tr>
                                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
                                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-indigo-50/20 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                                                    {product.sku}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                                                {product.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 tabular-nums">
                                                ${product.price.toLocaleString('es-CL')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                    product.stock === 0 
                                                        ? 'bg-red-50 text-red-700 border border-red-200' 
                                                        : product.stock <= 5 
                                                        ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                }`}>
                                                    {product.stock === 0 ? 'Agotado' : product.stock <= 5 ? `Bajo: ${product.stock} un.` : `${product.stock} un.`}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right space-x-2">
                                                <Link 
                                                    href={route('inventory.edit', product.id)} 
                                                    className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-colors"
                                                >
                                                    Editar
                                                </Link>
                                                <Link 
                                                    href={route('inventory.destroy', product.id)} 
                                                    method="delete" 
                                                    as="button" 
                                                    className="inline-flex items-center px-2.5 py-1 text-xs font-semibold text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    Eliminar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                    </svg>
                                                    <p className="font-semibold text-gray-700">No hay productos en inventario</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">Comienza agregando el primer producto a tu tienda.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
