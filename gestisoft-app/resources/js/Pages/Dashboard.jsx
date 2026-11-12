import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold leading-tight text-gray-800">
                            Dashboard
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Panel general del sistema GestiSoft
                        </p>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        v1.3 - Incremento 3
                    </span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-10">
                <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-200/80 p-8 text-center">
                        
                        {/* Insignia de estado */}
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 mb-6">
                            <svg className="w-4 h-4 text-amber-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                            </svg>
                            <span>Módulo de Analítica en Desarrollo</span>
                        </div>

                        {/* Título principal solicitado */}
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            En construcción: espere nuevas actualizaciones
                        </h3>

                        <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Los gráficos de rendimiento comercial, analítica de ventas y reportes avanzados se integrarán en el siguiente incremento del producto. Actualmente todas las operaciones de Punto de Venta, Arqueo de Cajas e Inventario se encuentran 100% disponibles.
                        </p>

                        {/* Logo institucional debajo del texto tal como se solicitó */}
                        <div className="my-8 flex justify-center">
                            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-100 shadow-xs">
                                <img
                                    src="/Logo_GestiSoft.png"
                                    alt="Logo GestiSoft"
                                    className="h-28 w-auto object-contain transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Accesos rápidos a los módulos funcionales del incremento actual */}
                        <div className="pt-6 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                                Accesos rápidos a módulos operativos
                            </p>
                            <div className="flex flex-wrap justify-center gap-3">
                                <Link
                                    href={route('pos.index')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 shadow-xs hover:shadow transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Ir a Punto de Venta (POS)</span>
                                </Link>

                                <Link
                                    href={route('cajas.index')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 shadow-xs transition-all"
                                >
                                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Auditoría de Cajas</span>
                                </Link>

                                <Link
                                    href={route('inventory.index')}
                                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-700 text-sm font-semibold hover:bg-gray-50 hover:border-gray-400 shadow-xs transition-all"
                                >
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span>Catálogo e Inventario</span>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
