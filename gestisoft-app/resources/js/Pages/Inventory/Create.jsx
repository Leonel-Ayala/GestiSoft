import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        sku: '',
        name: '',
        price: '',
        stock: '0',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('inventory.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Agregar Producto</h2>}
        >
            <Head title="Nuevo Producto" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white border border-gray-200/80 shadow-sm sm:rounded-xl p-6 sm:p-8">
                        <div className="mb-6 pb-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Detalles del Nuevo Producto</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Ingresa la información básica para registrar el artículo en el inventario del negocio.
                            </p>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="sku" value="SKU (Código de Barras / Identificador)" />
                                <TextInput
                                    id="sku"
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm font-mono text-sm"
                                    value={data.sku}
                                    placeholder="Ej: 7801234567890"
                                    onChange={(e) => setData('sku', e.target.value)}
                                    required
                                    isFocused
                                    autoComplete="off"
                                />
                                <InputError message={errors.sku} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="Nombre del Producto" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                    value={data.name}
                                    placeholder="Ej: Bebida Cola 1.5L"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="price" value="Precio de Venta ($ CLP)" />
                                    <TextInput
                                        id="price"
                                        type="number"
                                        className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm font-mono tabular-nums"
                                        value={data.price}
                                        placeholder="1500"
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                        min="0"
                                    />
                                    <InputError message={errors.price} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="stock" value="Stock Inicial" />
                                    <TextInput
                                        id="stock"
                                        type="number"
                                        className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm font-mono tabular-nums"
                                        value={data.stock}
                                        placeholder="10"
                                        onChange={(e) => setData('stock', e.target.value)}
                                        required
                                        min="0"
                                    />
                                    <InputError message={errors.stock} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-8 border-t border-gray-100 pt-5">
                                <Link 
                                    href={route('inventory.index')} 
                                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                                >
                                    Cancelar
                                </Link>
                                <PrimaryButton 
                                    disabled={processing} 
                                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    Guardar Producto
                                </PrimaryButton>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
