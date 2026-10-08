import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import DangerButton from '@/Components/DangerButton';

export default function Index({ auth, users }) {
    const { delete: destroy } = useForm();

    const deleteUser = (e, id) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de eliminar a este usuario?')) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Empleados (Usuarios)</h2>}
        >
            <Head title="Usuarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Personal del Negocio</h3>
                        <Link href={route('users.create')}>
                            <PrimaryButton className="bg-indigo-600 hover:bg-indigo-700">
                                + Añadir Empleado
                            </PrimaryButton>
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="py-3 px-4 font-semibold text-gray-600">Nombre</th>
                                        <th className="py-3 px-4 font-semibold text-gray-600">Email</th>
                                        <th className="py-3 px-4 font-semibold text-gray-600">Rol</th>
                                        <th className="py-3 px-4 font-semibold text-gray-600 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                            <td className="py-3 px-4">{user.name}</td>
                                            <td className="py-3 px-4 text-gray-500">{user.email}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {user.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                {user.id !== auth.user.id && (
                                                    <form onSubmit={(e) => deleteUser(e, user.id)} className="inline">
                                                        <DangerButton type="submit">Eliminar</DangerButton>
                                                    </form>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
