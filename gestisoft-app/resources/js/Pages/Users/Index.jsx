import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, users }) {
    const { delete: destroy } = useForm();

    const deleteUser = (e, id) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de eliminar a este usuario? Esta acción no se puede deshacer.')) {
            destroy(route('users.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-xl text-gray-900 leading-tight">
                            Gestión de Empleados
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Administra los usuarios del sistema, sus credenciales y roles de acceso.
                        </p>
                    </div>
                    <Link href={route('users.create')}>
                        <PrimaryButton className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 shadow-sm transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Añadir Empleado
                        </PrimaryButton>
                    </Link>
                </div>
            }
        >
            <Head title="Usuarios y Empleados" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="bg-white border border-gray-200/80 overflow-hidden shadow-sm sm:rounded-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 border-b border-gray-200 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                        <th className="py-3.5 px-6">Usuario</th>
                                        <th className="py-3.5 px-6">Correo Electrónico</th>
                                        <th className="py-3.5 px-6">Rol de Acceso</th>
                                        <th className="py-3.5 px-6 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {users.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/80 transition-colors duration-150">
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200/70 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{user.name}</div>
                                                        {user.id === auth.user.id && (
                                                            <span className="text-[11px] font-semibold text-indigo-600">Tú (Sesión actual)</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-gray-600 whitespace-nowrap">
                                                {user.email}
                                            </td>
                                            <td className="py-4 px-6 whitespace-nowrap">
                                                {user.role === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                                        Administrador
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                                                        Cajero
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-right whitespace-nowrap">
                                                {user.id !== auth.user.id ? (
                                                    <form onSubmit={(e) => deleteUser(e, user.id)} className="inline">
                                                        <button
                                                            type="submit"
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Eliminar
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic">No modificable</span>
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
