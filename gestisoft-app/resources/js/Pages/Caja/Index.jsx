import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, turnos, filters, metrics, cajeros = [] }) {
    const [filtroFecha, setFiltroFecha] = useState(filters.fecha || '');
    const [filtroEstado, setFiltroEstado] = useState(filters.estado || '');
    const [filtroCajero, setFiltroCajero] = useState(filters.user_id || '');

    // Estado del modal de auditoría y transacciones
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modalImprimir, setModalImprimir] = useState(false);
    const [incluirDetalleBoletas, setIncluirDetalleBoletas] = useState(false);
    const [turnoSeleccionado, setTurnoSeleccionado] = useState(null);
    const [transacciones, setTransacciones] = useState([]);
    const [cargandoTransacciones, setCargandoTransacciones] = useState(false);
    const [boletaExpandida, setBoletaExpandida] = useState(null);

    const aplicarFiltros = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const params = {};
        if (filtroFecha) params.fecha = filtroFecha;
        if (filtroEstado) params.estado = filtroEstado;
        if (filtroCajero) params.user_id = filtroCajero;
        router.get(route('cajas.index'), params, { preserveState: true });
    };

    const limpiarFiltros = () => {
        setFiltroFecha('');
        setFiltroEstado('');
        setFiltroCajero('');
        router.get(route('cajas.index'), {}, { preserveState: true });
    };

    const setFechaHoy = () => {
        const today = new Date().toISOString().split('T')[0];
        setFiltroFecha(today);
        const params = { fecha: today };
        if (filtroEstado) params.estado = filtroEstado;
        if (filtroCajero) params.user_id = filtroCajero;
        router.get(route('cajas.index'), params, { preserveState: true });
    };

    const setFechaAyer = () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        const yesterday = d.toISOString().split('T')[0];
        setFiltroFecha(yesterday);
        const params = { fecha: yesterday };
        if (filtroEstado) params.estado = filtroEstado;
        if (filtroCajero) params.user_id = filtroCajero;
        router.get(route('cajas.index'), params, { preserveState: true });
    };

    const verDetalleTurno = async (turnoId) => {
        setModalAbierto(true);
        setCargandoTransacciones(true);
        setTurnoSeleccionado(null);
        setTransacciones([]);
        setBoletaExpandida(null);

        try {
            const res = await fetch(`/cajas/${turnoId}/transacciones`);
            if (!res.ok) throw new Error('Error al consultar transacciones');
            const data = await res.json();
            setTurnoSeleccionado(data.turno);
            setTransacciones(data.ventas || []);
        } catch (error) {
            console.error('Error cargando transacciones:', error);
        } finally {
            setCargandoTransacciones(false);
        }
    };

    const formatMoney = (val) => '$' + Number(val || 0).toLocaleString('es-CL');

    const calcularTotalVentas = (t) => {
        if (!t) return 0;
        const efectivo = Number(t.monto_ventas_efectivo || 0);
        const debito = Number(t.monto_ventas_debito || 0);
        const credito = Number(t.monto_ventas_credito || 0);
        const transf = Number(t.monto_ventas_transferencia || 0);
        const legacy = (!t.monto_ventas_debito && !t.monto_ventas_credito) ? Number(t.monto_ventas_tarjeta || 0) : 0;
        return efectivo + debito + credito + transf + legacy;
    };

    const getPaymentBadge = (method) => {
        const m = (method || '').toLowerCase().trim();
        if (m === 'efectivo' || m === 'cash') {
            return {
                label: 'Efectivo',
                className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: '💵',
                isCash: true,
            };
        }
        if (m === 'débito' || m === 'debito' || m === 'debit') {
            return {
                label: 'Débito',
                className: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: '💳',
                isCash: false,
            };
        }
        if (m === 'crédito' || m === 'credito' || m === 'credit') {
            return {
                label: 'Crédito',
                className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                icon: '💳',
                isCash: false,
            };
        }
        if (m === 'tarjeta' || m === 'card') {
            return {
                label: 'Tarjeta',
                className: 'bg-cyan-50 text-cyan-700 border-cyan-200',
                icon: '💳',
                isCash: false,
            };
        }
        if (m === 'transferencia' || m === 'transfer') {
            return {
                label: 'Transferencia',
                className: 'bg-purple-50 text-purple-700 border-purple-200',
                icon: '📲',
                isCash: false,
            };
        }
        return {
            label: method || 'Efectivo',
            className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            icon: '💵',
            isCash: true,
        };
    };

    const renderBadgeDiferencia = (turno) => {
        if (turno.estado === 'abierto') {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                    En curso
                </span>
            );
        }

        const diff = Number(turno.diferencia || 0);
        if (diff === 0) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Cuadrada ($0)
                </span>
            );
        } else if (diff < 0) {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                    Faltante ({formatMoney(diff)})
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    Sobrante (+{formatMoney(diff)})
                </span>
            );
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h2 className="font-bold text-xl text-gray-800 leading-tight">
                            Control y Auditoría de Cajas
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">
                            Historial de turnos, arqueos ciegos y desglose de boletas por medio de pago
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Auditoría de Cajas" />

            <div className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

                    {/* Tarjeta Hero Principal: Total Ventas Consolidado del Negocio */}
                    <div className="bg-[#123764] text-white p-5 rounded-2xl shadow-sm border border-[#0d2747] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-2xl shrink-0">
                                📊
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold uppercase tracking-wider text-sky-200">
                                        Total Facturado {metrics.is_filtered ? '(Período Filtrado)' : 'Consolidado'}
                                    </p>
                                    {metrics.is_filtered && (
                                        <span className="text-[10px] bg-sky-400/20 text-sky-100 font-semibold px-2 py-0.5 rounded-full border border-sky-300/30">
                                            Filtro Activo
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-blue-100 font-medium mt-0.5">
                                    Suma consolidada de todas las ventas del negocio (Efectivo gaveta + Débito + Crédito + Transferencias)
                                </p>
                            </div>
                        </div>
                        <div className="sm:text-right">
                            <p className="text-3xl sm:text-4xl font-black tracking-tight tabular-nums text-white">
                                {formatMoney(metrics.total_ventas_general)}
                            </p>
                            <span className="inline-block mt-0.5 text-xs font-semibold bg-white/15 text-white px-3 py-0.5 rounded-full border border-white/20">
                                {metrics.total_turnos} turno{metrics.total_turnos === 1 ? '' : 's'} considerado{metrics.total_turnos === 1 ? '' : 's'}
                            </span>
                        </div>
                    </div>

                    {/* Tarjetas Secundarias de Desglose por Medio de Pago y Estado */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Turnos Totales</p>
                            <p className="text-2xl font-extrabold text-gray-900 mt-1">{metrics.total_turnos}</p>
                            <span className="text-[11px] text-gray-400">Registrados</span>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Turnos Abiertos</p>
                            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{metrics.turnos_abiertos}</p>
                            <span className="text-[11px] text-emerald-600/80 font-semibold">En operación</span>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1">
                                <span>💵</span> Efectivo
                            </p>
                            <p className="text-lg font-extrabold text-gray-900 mt-1 tabular-nums">{formatMoney(metrics.total_efectivo)}</p>
                            <span className="text-[11px] text-gray-400">En gaveta física</span>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1">
                                <span>💳</span> Débito
                            </p>
                            <p className="text-lg font-extrabold text-gray-900 mt-1 tabular-nums">{formatMoney(metrics.total_debito || 0)}</p>
                            <span className="text-[11px] text-gray-400">POS electrónico</span>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1">
                                <span>💳</span> Crédito
                            </p>
                            <p className="text-lg font-extrabold text-gray-900 mt-1 tabular-nums">{formatMoney(metrics.total_credito || 0)}</p>
                            <span className="text-[11px] text-gray-400">POS electrónico</span>
                        </div>

                        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-xs">
                            <p className="text-[11px] font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1">
                                <span>📲</span> Transferencia
                            </p>
                            <p className="text-lg font-extrabold text-gray-900 mt-1 tabular-nums">{formatMoney(metrics.total_transferencia || 0)}</p>
                            <span className="text-[11px] text-gray-400">Cta. Bancaria</span>
                        </div>
                    </div>

                    {/* Filtros de Búsqueda con Acceso Rápido por Fecha y Cajero */}
                    <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs">
                        <form onSubmit={aplicarFiltros} className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[220px]">
                                <div className="flex items-center justify-between mb-1">
                                    <label className="block text-xs font-semibold text-gray-600">
                                        Fecha de Apertura
                                    </label>
                                    <div className="flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={setFechaHoy}
                                            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md transition-colors"
                                        >
                                            Hoy
                                        </button>
                                        <button
                                            type="button"
                                            onClick={setFechaAyer}
                                            className="text-[11px] font-semibold text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-md transition-colors"
                                        >
                                            Ayer
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type="date"
                                    value={filtroFecha}
                                    onChange={(e) => setFiltroFecha(e.target.value)}
                                    className="w-full text-sm rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-xs"
                                />
                            </div>

                            <div className="w-48">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Estado del Turno
                                </label>
                                <select
                                    value={filtroEstado}
                                    onChange={(e) => setFiltroEstado(e.target.value)}
                                    className="w-full text-sm rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-xs"
                                >
                                    <option value="">Todos los Estados</option>
                                    <option value="abierto">Abiertos</option>
                                    <option value="cerrado">Cerrados</option>
                                </select>
                            </div>

                            <div className="w-52">
                                <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Cajero / Responsable
                                </label>
                                <select
                                    value={filtroCajero}
                                    onChange={(e) => setFiltroCajero(e.target.value)}
                                    className="w-full text-sm rounded-xl border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-xs"
                                >
                                    <option value="">Todos los Cajeros</option>
                                    {cajeros.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 shadow-xs transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Filtrar</span>
                                </button>

                                {(filtroFecha || filtroEstado || filtroCajero) && (
                                    <button
                                        type="button"
                                        onClick={limpiarFiltros}
                                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                                    >
                                        Limpiar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Tabla de Turnos con Desglose por Medio de Pago */}
                    <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100 text-left text-sm">
                                <thead className="bg-gray-50/75">
                                    <tr>
                                        <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Turno</th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Cajero</th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Apertura</th>
                                        <th className="px-4 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wider">Cierre</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Fondo</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-bold text-emerald-700 uppercase tracking-wider">Efectivo</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Débito</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-bold text-indigo-700 uppercase tracking-wider">Crédito</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-bold text-purple-700 uppercase tracking-wider">Transf.</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">Total Ventas</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">Esperado</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Declarado</th>
                                        <th className="px-4 py-3.5 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Cuadre</th>
                                        <th className="px-4 py-3.5 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {turnos.data && turnos.data.length > 0 ? (
                                        turnos.data.map((t) => (
                                            <tr key={t.id} className="hover:bg-indigo-50/20 transition-colors">
                                                <td className="px-4 py-4 whitespace-nowrap font-mono text-xs font-bold text-gray-700">
                                                    #{String(t.id).padStart(4, '0')}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                                                            {(t.user?.name || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-semibold text-gray-900 text-xs">{t.user?.name || 'Usuario'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">
                                                    {new Date(t.fecha_apertura).toLocaleString('es-CL', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-xs text-gray-600">
                                                    {t.fecha_cierre ? (
                                                        new Date(t.fecha_cierre).toLocaleString('es-CL', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                                            Abierto
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-gray-800 tabular-nums text-xs">
                                                    {formatMoney(t.monto_inicial)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-emerald-700 tabular-nums text-xs">
                                                    {formatMoney(t.monto_ventas_efectivo)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-blue-700 tabular-nums text-xs">
                                                    {formatMoney(t.monto_ventas_debito || 0)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-indigo-700 tabular-nums text-xs">
                                                    {formatMoney(t.monto_ventas_credito || 0)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-purple-700 tabular-nums text-xs">
                                                    {formatMoney(t.monto_ventas_transferencia || 0)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right font-bold text-gray-900 tabular-nums text-xs">
                                                    {formatMoney(calcularTotalVentas(t))}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right font-bold text-gray-900 tabular-nums text-xs">
                                                    {formatMoney(t.total_esperado)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right font-semibold text-gray-700 tabular-nums text-xs">
                                                    {t.estado === 'cerrado' ? formatMoney(t.monto_declarado) : '—'}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-center text-xs">
                                                    {renderBadgeDiferencia(t)}
                                                </td>
                                                <td className="px-4 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => verDetalleTurno(t.id)}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                                                    >
                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        <span>Ver Boletas</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="14" className="px-6 py-12 text-center text-sm text-gray-400">
                                                <div className="flex flex-col items-center">
                                                    <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    <p className="font-semibold text-gray-700">No se encontraron turnos de caja</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">Los turnos se crearán automáticamente a medida que los cajeros abran caja en el POS.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Paginación */}
                        {turnos.links && turnos.links.length > 3 && (
                            <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
                                <div>
                                    Mostrando {turnos.from || 0} a {turnos.to || 0} de {turnos.total || 0} turnos
                                </div>
                                <div className="flex gap-1">
                                    {turnos.links.map((link, idx) => (
                                        <button
                                            key={idx}
                                            disabled={!link.url}
                                            onClick={() => link.url && router.visit(link.url, { preserveState: true })}
                                            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-indigo-600 text-white'
                                                    : link.url
                                                    ? 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    : 'text-gray-300 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Modal de Detalle de Turno y Boletas */}
            {modalAbierto && !modalImprimir && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
                        
                        {/* Cabecera del Modal */}
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                                    #{turnoSeleccionado ? String(turnoSeleccionado.id).padStart(3, '0') : '...'}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                        Auditoría de Turno y Desglose de Ventas
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Cajero: <span className="font-semibold text-gray-800">{turnoSeleccionado?.cajero}</span> | Apertura: {turnoSeleccionado?.fecha_apertura}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setModalAbierto(false)}
                                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Cuerpo del Modal */}
                        <div className="p-6 overflow-y-auto space-y-6 flex-1">
                            {cargandoTransacciones ? (
                                <div className="py-16 text-center text-gray-400">
                                    <svg className="w-8 h-8 animate-spin mx-auto text-indigo-600 mb-3" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                                    </svg>
                                    <p className="text-sm font-semibold text-gray-600">Cargando desglose de boletas y medios de pago...</p>
                                </div>
                            ) : turnoSeleccionado ? (
                                <>
                                    {/* Resumen Financiero Completo del Turno: Efectivo, Débito, Crédito, Transferencia */}
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            Balance por Medio de Pago
                                        </h4>
                                        <div className={`grid grid-cols-2 sm:grid-cols-3 ${turnoSeleccionado.monto_ventas_tarjeta_legacy > 0 ? 'lg:grid-cols-6' : 'lg:grid-cols-5'} gap-2.5 bg-gray-50/80 p-3.5 rounded-2xl border border-gray-200/80`}>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase">Fondo Inicial</p>
                                                <p className="text-base font-extrabold text-gray-900 mt-0.5 tabular-nums">{formatMoney(turnoSeleccionado.monto_inicial)}</p>
                                                <span className="text-[10px] text-gray-400">Apertura</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                                                <p className="text-[10px] font-bold text-emerald-700 uppercase flex items-center gap-1">
                                                    <span>💵</span> Efectivo
                                                </p>
                                                <p className="text-base font-extrabold text-emerald-700 mt-0.5 tabular-nums">{formatMoney(turnoSeleccionado.monto_ventas_efectivo)}</p>
                                                <span className="text-[10px] text-emerald-600">Ingreso a gaveta</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                                                <p className="text-[10px] font-bold text-blue-700 uppercase flex items-center gap-1">
                                                    <span>💳</span> Débito
                                                </p>
                                                <p className="text-base font-extrabold text-blue-700 mt-0.5 tabular-nums">{formatMoney(turnoSeleccionado.monto_ventas_debito)}</p>
                                                <span className="text-[10px] text-blue-600">Tarjeta débito</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                                                <p className="text-[10px] font-bold text-indigo-700 uppercase flex items-center gap-1">
                                                    <span>💳</span> Crédito
                                                </p>
                                                <p className="text-base font-extrabold text-indigo-700 mt-0.5 tabular-nums">{formatMoney(turnoSeleccionado.monto_ventas_credito)}</p>
                                                <span className="text-[10px] text-indigo-600">Tarjeta crédito</span>
                                            </div>
                                            {turnoSeleccionado.monto_ventas_tarjeta_legacy > 0 && (
                                                <div className="bg-white p-3 rounded-xl border border-cyan-200 shadow-2xs">
                                                    <p className="text-[10px] font-bold text-cyan-700 uppercase flex items-center gap-1">
                                                        <span>💳</span> Tarjeta
                                                    </p>
                                                    <p className="text-base font-extrabold text-cyan-700 mt-0.5 tabular-nums">{formatMoney(turnoSeleccionado.monto_ventas_tarjeta_legacy)}</p>
                                                    <span className="text-[10px] text-cyan-600">Transacción anterior</span>
                                                </div>
                                            )}
                                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                                                <p className="text-[10px] font-bold text-purple-700 uppercase flex items-center gap-1">
                                                    <span>📲</span> Transf.
                                                </p>
                                                <p className="text-base font-extrabold text-purple-700 mt-0.5 tabular-nums">{formatMoney(turnoSeleccionado.monto_ventas_transferencia)}</p>
                                                <span className="text-[10px] text-purple-600">Bancaria directa</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tarjeta Destacada Total Ventas (Color sólido corporativo GestiSoft, máximo contraste) */}
                                    <div className="bg-[#123764] text-white p-4 sm:p-5 rounded-2xl shadow-sm border border-[#0d2747] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-2xl shrink-0">
                                                💰
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-sky-200">
                                                    Total Ventas
                                                </p>
                                                <p className="text-xs text-blue-100 font-medium">
                                                    {turnoSeleccionado.estado === 'abierto'
                                                        ? 'Total acumulado en tiempo real (todos los medios de pago)'
                                                        : 'Facturación total del turno'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="sm:text-right">
                                            <p className="text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-white">
                                                {formatMoney(turnoSeleccionado.total_ventas || calcularTotalVentas(turnoSeleccionado))}
                                            </p>
                                            <span className="inline-block mt-0.5 text-[11px] font-semibold bg-white/15 text-white px-2.5 py-0.5 rounded-full border border-white/25">
                                                {transacciones.length} transacción{transacciones.length === 1 ? '' : 'es'} registrada{transacciones.length === 1 ? '' : 's'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Conciliación y Arqueo Físico de Gaveta */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-indigo-50/40 p-4 rounded-2xl border border-indigo-100/70">
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-500 uppercase">Total Esperado en Gaveta</p>
                                            <p className="text-lg font-black text-indigo-900 mt-0.5 tabular-nums">{formatMoney(turnoSeleccionado.total_esperado)}</p>
                                            <p className="text-[11px] text-gray-500">Fondo Inicial + Ventas Efectivo</p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-bold text-gray-500 uppercase">Monto Físico Declarado</p>
                                            <p className="text-lg font-black text-gray-900 mt-0.5 tabular-nums">
                                                {turnoSeleccionado.estado === 'cerrado' ? formatMoney(turnoSeleccionado.monto_declarado) : 'En curso'}
                                            </p>
                                            <p className="text-[11px] text-gray-500">Conteo ciego del cajero</p>
                                        </div>

                                        <div>
                                            <p className="text-[11px] font-bold text-gray-500 uppercase">Resultado de Cuadre</p>
                                            <div className="mt-1">
                                                {turnoSeleccionado.estado === 'cerrado' ? (
                                                    Number(turnoSeleccionado.diferencia || 0) === 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                                                            ✓ Cuadrada ($0)
                                                        </span>
                                                    ) : Number(turnoSeleccionado.diferencia || 0) < 0 ? (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-red-100 text-red-800 border border-red-300">
                                                            ⚠ Faltante ({formatMoney(turnoSeleccionado.diferencia)})
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-800 border border-blue-300">
                                                            + Sobrante (+{formatMoney(turnoSeleccionado.diferencia)})
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-200 text-gray-700">
                                                        Turno Abierto
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {turnoSeleccionado.observaciones && (
                                        <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-amber-900">
                                            <span className="font-bold">Observaciones del Cajero:</span> {turnoSeleccionado.observaciones}
                                        </div>
                                    )}

                                    {/* Lista de Boletas/Ventas */}
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="text-sm font-bold text-gray-900">
                                                Boletas Emitidas en este Turno ({transacciones.length})
                                            </h4>
                                            <span className="text-xs text-gray-500">
                                                Haz clic en una boleta para ver sus artículos
                                            </span>
                                        </div>

                                        {transacciones.length === 0 ? (
                                            <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200 text-xs text-gray-500">
                                                No se registraron ventas en este turno.
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {transacciones.map((venta) => {
                                                    const expandida = boletaExpandida === venta.id;
                                                    const paymentBadge = getPaymentBadge(venta.payment_method_normalized || venta.payment_method);

                                                    return (
                                                        <div
                                                            key={venta.id}
                                                            className="border border-gray-200 rounded-xl overflow-hidden hover:border-indigo-300 transition-colors"
                                                        >
                                                            <button
                                                                type="button"
                                                                onClick={() => setBoletaExpandida(expandida ? null : venta.id)}
                                                                className="w-full px-4 py-3 bg-white flex items-center justify-between text-left hover:bg-gray-50/80 transition-colors"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className="font-mono text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                                                                        Boleta #{String(venta.id).padStart(5, '0')}
                                                                    </div>
                                                                    <span className="text-xs text-gray-500">
                                                                        {venta.hora}
                                                                    </span>
                                                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${paymentBadge.className}`}>
                                                                        <span>{paymentBadge.icon}</span>
                                                                        <span>{paymentBadge.label}</span>
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-sm font-extrabold text-gray-900 tabular-nums">
                                                                        {formatMoney(venta.total)}
                                                                    </span>
                                                                    <svg
                                                                        className={`w-4 h-4 text-gray-400 transition-transform ${expandida ? 'rotate-180 text-indigo-600' : ''}`}
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </div>
                                                            </button>

                                                            {/* Desglose de Ítems de la Boleta */}
                                                            {expandida && (
                                                                <div className="px-4 py-3 bg-gray-50/80 border-t border-gray-100 text-xs">
                                                                    <div className="mb-2 flex items-center justify-between text-gray-500 font-medium">
                                                                        <span>Detalle de Artículos:</span>
                                                                        {paymentBadge.isCash && venta.amount_received && (
                                                                            <span>
                                                                                Recibido: {formatMoney(venta.amount_received)} | Vuelto: {formatMoney(venta.change)}
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                    <table className="w-full text-left">
                                                                        <thead>
                                                                            <tr className="text-gray-400 font-bold border-b border-gray-200/60 pb-1">
                                                                                <th className="py-1">Producto</th>
                                                                                <th className="py-1 text-center">Cant.</th>
                                                                                <th className="py-1 text-right">P. Unit</th>
                                                                                <th className="py-1 text-right">Subtotal</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody className="divide-y divide-gray-100">
                                                                            {venta.detalles.map((d) => (
                                                                                <tr key={d.id} className="text-gray-700">
                                                                                    <td className="py-1.5 font-medium">{d.product_name}</td>
                                                                                    <td className="py-1.5 text-center font-mono">{d.quantity}</td>
                                                                                    <td className="py-1.5 text-right font-mono">{formatMoney(d.price)}</td>
                                                                                    <td className="py-1.5 text-right font-bold font-mono text-gray-900">{formatMoney(d.subtotal)}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            ) : null}
                        </div>

                        {/* Pie del Modal */}
                        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <button
                                    type="button"
                                    onClick={() => setModalImprimir(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#123764] hover:bg-[#0d2747] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow transition-all"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    <span>Imprimir Acta de Turno</span>
                                </button>
                            </div>

                            <button
                                type="button"
                                onClick={() => setModalAbierto(false)}
                                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-semibold rounded-xl transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Modal de Impresión / Acta Oficial de Arqueo de Turno */}
            {modalImprimir && turnoSeleccionado && (
                <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:fixed print:inset-0">
                    <style dangerouslySetInnerHTML={{ __html: `
                        @media print {
                            body * {
                                visibility: hidden !important;
                            }
                            #documento-acta-impresion, #documento-acta-impresion * {
                                visibility: visible !important;
                            }
                            #documento-acta-impresion {
                                position: absolute !important;
                                left: 0 !important;
                                top: 0 !important;
                                width: 100% !important;
                                margin: 0 !important;
                                padding: 24px !important;
                                background: white !important;
                                color: black !important;
                                box-shadow: none !important;
                                border: none !important;
                            }
                            .no-imprimir {
                                display: none !important;
                            }
                        }
                    `}} />

                    <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden print:max-h-none print:shadow-none print:border-none print:rounded-none">
                        
                        {/* Barra de control superior (No se imprime) */}
                        <div className="no-imprimir px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">🖨️</span>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900">
                                        Vista Previa de Acta de Cierre y Arqueo
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Documento oficial de control de gaveta y conciliación
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-gray-200 shadow-2xs hover:bg-gray-50">
                                    <input
                                        type="checkbox"
                                        checked={incluirDetalleBoletas}
                                        onChange={(e) => setIncluirDetalleBoletas(e.target.checked)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span>Incluir anexo de boletas ({transacciones.length})</span>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => window.print()}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    <span>Imprimir / Guardar PDF</span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setModalImprimir(false)}
                                    className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 flex items-center justify-center transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Documento Imprimible */}
                        <div id="documento-acta-impresion" className="p-6 sm:p-8 overflow-y-auto space-y-5 text-gray-900 bg-white">
                            
                            {/* Encabezado Formal con Nombre de la Empresa */}
                            <div className="flex items-center justify-between border-b-2 border-gray-900 pb-4">
                                <div className="flex items-center gap-3.5">
                                    <img
                                        src="/Logo_GestiSoft.png"
                                        alt="Logo"
                                        className="h-12 w-auto object-contain"
                                    />
                                    <div>
                                        <h1 className="text-xl font-black tracking-tight text-gray-900 uppercase">
                                            {turnoSeleccionado.negocio_nombre || auth.user?.negocio?.name || 'Empresa'}
                                        </h1>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="inline-block px-3 py-1 bg-gray-100 border border-gray-300 rounded-lg text-xs font-black uppercase tracking-wider">
                                        TURNO #{String(turnoSeleccionado.id).padStart(3, '0')}
                                    </span>
                                    <p className="text-[11px] text-gray-500 mt-1">
                                        Emisión: {new Date().toLocaleDateString('es-CL')} {new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="text-center py-1">
                                <h2 className="text-sm sm:text-base font-black uppercase tracking-wide text-gray-900">
                                    Acta de Cierre de Caja y Arqueo de Fondos
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Constancia de entrega de valores y conciliación física de gaveta
                                </p>
                            </div>

                            {/* Metadatos del Turno */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                                <div>
                                    <span className="text-gray-500 block font-semibold">Cajero Responsable:</span>
                                    <span className="font-bold text-gray-900">{turnoSeleccionado.cajero || turnoSeleccionado.user?.name || 'Cajero'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block font-semibold">Apertura:</span>
                                    <span className="font-bold text-gray-900">{turnoSeleccionado.fecha_apertura}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block font-semibold">Cierre:</span>
                                    <span className="font-bold text-gray-900">{turnoSeleccionado.fecha_cierre || 'Turno Abierto (Arqueo Parcial)'}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block font-semibold">Estado:</span>
                                    <span className={`font-black uppercase ${turnoSeleccionado.estado === 'cerrado' ? 'text-gray-800' : 'text-emerald-700'}`}>
                                        {turnoSeleccionado.estado}
                                    </span>
                                </div>
                            </div>

                            {/* Tabla de Medios de Pago */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    1. Balance Financiero por Medio de Pago
                                </h3>
                                <table className="w-full text-xs border border-gray-300 rounded-lg overflow-hidden">
                                    <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-300">
                                        <tr>
                                            <th className="py-2 px-3 text-left">Concepto / Canal de Ingreso</th>
                                            <th className="py-2 px-3 text-left">Destino de los Fondos</th>
                                            <th className="py-2 px-3 text-right">Monto Recaudado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <tr>
                                            <td className="py-2 px-3 font-semibold text-gray-700">Fondo Inicial de Apertura</td>
                                            <td className="py-2 px-3 text-gray-500">Gaveta física (Sencillo de caja)</td>
                                            <td className="py-2 px-3 text-right font-mono font-bold text-gray-800">{formatMoney(turnoSeleccionado.monto_inicial)}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-3 font-semibold text-emerald-800">Ventas en Efectivo</td>
                                            <td className="py-2 px-3 text-gray-500">Gaveta física (Ingreso en billetes/monedas)</td>
                                            <td className="py-2 px-3 text-right font-mono font-bold text-emerald-700">{formatMoney(turnoSeleccionado.monto_ventas_efectivo)}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-3 font-semibold text-blue-800">Ventas con Tarjeta Débito</td>
                                            <td className="py-2 px-3 text-gray-500">Terminal POS electrónico bancario</td>
                                            <td className="py-2 px-3 text-right font-mono font-bold text-blue-700">{formatMoney(turnoSeleccionado.monto_ventas_debito)}</td>
                                        </tr>
                                        <tr>
                                            <td className="py-2 px-3 font-semibold text-indigo-800">Ventas con Tarjeta Crédito</td>
                                            <td className="py-2 px-3 text-gray-500">Terminal POS electrónico bancario</td>
                                            <td className="py-2 px-3 text-right font-mono font-bold text-indigo-700">{formatMoney(turnoSeleccionado.monto_ventas_credito)}</td>
                                        </tr>
                                        {turnoSeleccionado.monto_ventas_tarjeta_legacy > 0 && (
                                            <tr>
                                                <td className="py-2 px-3 font-semibold text-cyan-800">Ventas Tarjeta (Anterior)</td>
                                                <td className="py-2 px-3 text-gray-500">Transacción anterior POS</td>
                                                <td className="py-2 px-3 text-right font-mono font-bold text-cyan-700">{formatMoney(turnoSeleccionado.monto_ventas_tarjeta_legacy)}</td>
                                            </tr>
                                        )}
                                        <tr>
                                            <td className="py-2 px-3 font-semibold text-purple-800">Ventas por Transferencia</td>
                                            <td className="py-2 px-3 text-gray-500">Cuenta corriente / Abono directo</td>
                                            <td className="py-2 px-3 text-right font-mono font-bold text-purple-700">{formatMoney(turnoSeleccionado.monto_ventas_transferencia)}</td>
                                        </tr>
                                        <tr className="bg-gray-100/90 font-black text-gray-900 border-t-2 border-gray-400">
                                            <td className="py-2 px-3 uppercase text-xs" colSpan={2}>
                                                TOTAL FACTURADO EN VENTAS DEL TURNO
                                            </td>
                                            <td className="py-2 px-3 text-right font-mono text-sm">
                                                {formatMoney(turnoSeleccionado.total_ventas || calcularTotalVentas(turnoSeleccionado))}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Arqueo y Conciliación Física */}
                            <div>
                                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    2. Conciliación y Arqueo Físico de Gaveta (Efectivo)
                                </h3>
                                <div className="grid grid-cols-3 gap-3 p-3.5 bg-gray-50 rounded-xl border border-gray-300 text-xs">
                                    <div>
                                        <span className="text-gray-500 block font-semibold">Total Esperado en Gaveta</span>
                                        <span className="text-base font-black text-gray-900 font-mono mt-0.5 block">
                                            {formatMoney(turnoSeleccionado.total_esperado)}
                                        </span>
                                        <span className="text-[10px] text-gray-500">Fondo Inicial + Ventas Efectivo</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block font-semibold">Monto Físico Declarado</span>
                                        <span className="text-base font-black text-gray-900 font-mono mt-0.5 block">
                                            {turnoSeleccionado.estado === 'cerrado' ? formatMoney(turnoSeleccionado.monto_declarado) : 'En curso'}
                                        </span>
                                        <span className="text-[10px] text-gray-500">Conteo ciego de billetes/monedas</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500 block font-semibold">Resultado de Cuadre</span>
                                        <div className="mt-1">
                                            {turnoSeleccionado.estado === 'cerrado' ? (
                                                Number(turnoSeleccionado.diferencia || 0) === 0 ? (
                                                    <span className="inline-block px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md font-black text-xs">
                                                        ✓ CUADRADA ($0)
                                                    </span>
                                                ) : Number(turnoSeleccionado.diferencia || 0) < 0 ? (
                                                    <span className="inline-block px-2.5 py-1 bg-red-100 text-red-800 border border-red-300 rounded-md font-black text-xs">
                                                        ⚠ FALTANTE ({formatMoney(turnoSeleccionado.diferencia)})
                                                    </span>
                                                ) : (
                                                    <span className="inline-block px-2.5 py-1 bg-blue-100 text-blue-800 border border-blue-300 rounded-md font-black text-xs">
                                                        + SOBRANTE (+{formatMoney(turnoSeleccionado.diferencia)})
                                                    </span>
                                                )
                                            ) : (
                                                <span className="inline-block px-2.5 py-1 bg-gray-200 text-gray-700 rounded-md font-semibold text-xs">
                                                    Turno Abierto
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Observaciones */}
                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                                <span className="font-bold text-gray-700">Observaciones del Cajero:</span>{' '}
                                <span className="text-gray-600">
                                    {turnoSeleccionado.observaciones || 'Sin observaciones registradas al momento del cierre.'}
                                </span>
                            </div>

                            {/* Resumen Operativo */}
                            <div className="flex items-center justify-between text-xs text-gray-500 py-1">
                                <span>
                                    <strong className="text-gray-800">Comprobantes emitidos:</strong> {transacciones.length} boleta{transacciones.length === 1 ? '' : 's'} en el turno.
                                </span>
                                <span>
                                    Documento generado desde módulo de Auditoría GestiSoft.
                                </span>
                            </div>

                            {/* Anexo opcional de boletas (Solo si el checkbox está activo) */}
                            {incluirDetalleBoletas && transacciones.length > 0 && (
                                <div className="pt-2 border-t border-gray-300">
                                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Anexo: Listado Detallado de Boletas Emitidas ({transacciones.length})
                                    </h3>
                                    <table className="w-full text-[11px] border border-gray-200">
                                        <thead className="bg-gray-100 text-gray-700 font-bold">
                                            <tr>
                                                <th className="py-1 px-2 text-left">N° Boleta</th>
                                                <th className="py-1 px-2 text-left">Hora</th>
                                                <th className="py-1 px-2 text-left">Medio de Pago</th>
                                                <th className="py-1 px-2 text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {transacciones.map((v) => {
                                                const b = getPaymentBadge(v.payment_method);
                                                return (
                                                    <tr key={v.id}>
                                                        <td className="py-1 px-2 font-mono font-bold">Boleta #{String(v.id).padStart(5, '0')}</td>
                                                        <td className="py-1 px-2 text-gray-500">{v.hora || (v.created_at ? new Date(v.created_at).toLocaleTimeString('es-CL') : '—')}</td>
                                                        <td className="py-1 px-2 font-medium">{b.label}</td>
                                                        <td className="py-1 px-2 text-right font-mono font-bold">{formatMoney(v.total)}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Bloque de Firmas y Responsabilidades */}
                            <div className="pt-8 mt-6 border-t-2 border-dashed border-gray-300">
                                <p className="text-[11px] text-gray-500 text-center mb-8 italic">
                                    "Por la presente se certifica la exactitud del conteo de gaveta y la entrega de los fondos recaudados en el turno de caja correspondiente."
                                </p>
                                <div className="grid grid-cols-2 gap-12">
                                    <div className="text-center">
                                        <div className="border-t border-gray-900 pt-2 w-4/5 mx-auto">
                                            <p className="text-xs font-bold text-gray-900">
                                                {turnoSeleccionado.cajero || turnoSeleccionado.user?.name || 'Cajero Responsable'}
                                            </p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                Firma y RUT Cajero
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                Entrega de fondos
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <div className="border-t border-gray-900 pt-2 w-4/5 mx-auto">
                                            <p className="text-xs font-bold text-gray-900">
                                                Administrador / Supervisor
                                            </p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">
                                                Firma y RUT Receptor
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-0.5">
                                                Recepción conforme y auditoría
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
