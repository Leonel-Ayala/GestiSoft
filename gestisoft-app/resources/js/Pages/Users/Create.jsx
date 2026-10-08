import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'cajero',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Añadir Nuevo Empleado</h2>}
        >
            <Head title="Añadir Empleado" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nombre Completo" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full bg-gray-50"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Correo Electrónico (Para Iniciar Sesión)" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full bg-gray-50"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Contraseña (Mínimo 8 caracteres)" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="mt-1 block w-full bg-gray-50"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Rol o Cargo en el Sistema" />
                                <select
                                    id="role"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm bg-gray-50"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="cajero">Cajero (Solo accede a Caja/POS)</option>
                                    <option value="admin">Administrador (Acceso total e Inventario)</option>
                                </select>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end mt-8 border-t pt-4">
                                <Link href={route('users.index')} className="text-gray-500 hover:text-gray-900 mr-4 font-medium transition">
                                    Cancelar
                                </Link>
                                <PrimaryButton disabled={processing} className="bg-indigo-600 hover:bg-indigo-700">
                                    Guardar Empleado
                                </PrimaryButton>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
