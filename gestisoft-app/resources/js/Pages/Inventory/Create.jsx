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

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="sku" value="SKU (Código de Barras / Identificador)" />
                                <TextInput
                                    id="sku"
                                    className="mt-1 block w-full bg-gray-50"
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
                                    className="mt-1 block w-full bg-gray-50"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <InputLabel htmlFor="price" value="Precio de Venta" />
                                    <TextInput
                                        id="price"
                                        type="number"
                                        className="mt-1 block w-full bg-gray-50"
                                        value={data.price}
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
                                        className="mt-1 block w-full bg-gray-50"
                                        value={data.stock}
                                        onChange={(e) => setData('stock', e.target.value)}
                                        required
                                        min="0"
                                    />
                                    <InputError message={errors.stock} className="mt-2" />
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-8 border-t pt-4">
                                <Link href={route('inventory.index')} className="text-gray-500 hover:text-gray-900 mr-4 font-medium transition">
                                    Cancelar
                                </Link>
                                <PrimaryButton disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">
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
