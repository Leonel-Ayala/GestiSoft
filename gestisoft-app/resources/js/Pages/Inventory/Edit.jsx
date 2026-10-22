import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Edit({ auth, product }) {
    const { data, setData, put, processing, errors } = useForm({
        sku: product.sku,
        name: product.name,
        price: product.price,
        stock: product.stock,
        motivo: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('inventory.update', product.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Producto</h2>}
        >
            <Head title={`Editar: ${product.name}`} />

            <div className="py-8">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white border border-gray-200/80 shadow-sm sm:rounded-xl p-6 sm:p-8">
                        <div className="mb-6 pb-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Editar Producto</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Modifica los datos o ajusta el stock del producto registrado.
                            </p>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="sku" value="SKU (Código de Barras / Identificador)" />
                                <TextInput
                                    id="sku"
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm font-mono text-sm"
                                    value={data.sku}
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
                                        onChange={(e) => setData('price', e.target.value)}
                                        required
                                        min="0"
                                    />
                                    <InputError message={errors.price} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="stock" value="Stock Actual" />
                                    <TextInput
                                        id="stock"
                                        type="number"
                                        className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm font-mono tabular-nums"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        required
                                        min="0"
                                    />
                                    <InputError message={errors.stock} className="mt-2" />
                                </div>
                            </div>

                            {data.stock != product.stock && (
                                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 text-amber-900">
                                    <div className="flex items-start gap-2.5 mb-2">
                                        <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <div>
                                            <span className="font-semibold text-sm">Cambio de inventario detectado</span>
                                            <p className="text-xs text-amber-800 mt-0.5">
                                                Stock anterior: <strong>{product.stock}</strong> → Nuevo stock: <strong>{data.stock}</strong>. Por motivos de auditoría debes justificar este ajuste.
                                            </p>
                                        </div>
                                    </div>
                                    <InputLabel htmlFor="motivo" value="Motivo del ajuste de stock (Ej: Merma, Ajuste por conteo, Proveedor)" />
                                    <TextInput
                                        id="motivo"
                                        className="mt-1 block w-full bg-white rounded-lg border-amber-300 focus:border-amber-500 focus:ring-amber-500 shadow-sm text-sm"
                                        value={data.motivo}
                                        placeholder="Escribe el motivo del ajuste..."
                                        onChange={(e) => setData('motivo', e.target.value)}
                                        required={data.stock != product.stock}
                                    />
                                    <InputError message={errors.motivo} className="mt-2" />
                                </div>
                            )}

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
                                    Actualizar Producto
                                </PrimaryButton>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
