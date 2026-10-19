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

            <div className="py-8">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white border border-gray-200/80 shadow-sm sm:rounded-xl p-6 sm:p-8">
                        <div className="mb-6 pb-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Credenciales del Empleado</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Ingresa la información necesaria para que el empleado acceda a su panel según su rol.
                            </p>
                        </div>
                        
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <InputLabel htmlFor="name" value="Nombre Completo" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                    value={data.name}
                                    placeholder="Ej: Carlos Silva"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    isFocused
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Correo Electrónico (Inicio de Sesión)" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                    value={data.email}
                                    placeholder="carlos@gestisoft.local"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Contraseña de Acceso" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="mt-1 block w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                                    value={data.password}
                                    placeholder="Mínimo 8 caracteres"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Rol y Permisos del Sistema" />
                                <select
                                    id="role"
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg shadow-sm text-sm"
                                    value={data.role}
                                    onChange={(e) => setData('role', e.target.value)}
                                    required
                                >
                                    <option value="cajero">Cajero — Acceso exclusivo a Caja y Punto de Venta (POS)</option>
                                    <option value="admin">Administrador — Acceso completo (Inventario, Usuarios, POS, Dashboard)</option>
                                </select>
                                <p className="text-xs text-gray-500 mt-1.5">
                                    Los cajeros no tendrán acceso al inventario ni al panel de administración.
                                </p>
                                <InputError message={errors.role} className="mt-2" />
                            </div>

                            <div className="flex items-center justify-end gap-3 mt-8 border-t border-gray-100 pt-5">
                                <Link 
                                    href={route('users.index')} 
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
