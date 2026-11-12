import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Modal from '@/Components/Modal';

export default function Index({ auth, turnoActivo: initialTurnoActivo }) {
    const { props } = usePage();
    const { errors: pageErrors, flash } = props;

    // Estado del Turno de Caja (PBI-03)
    const [turnoActivo, setTurnoActivo] = useState(initialTurnoActivo || null);
    const [showAperturaModal, setShowAperturaModal] = useState(false);
    const [montoInicial, setMontoInicial] = useState('50000');
    const [openingProcessing, setOpeningProcessing] = useState(false);

    // Estado del Arqueo Ciego / Cierre de Caja
    const [showCierreModal, setShowCierreModal] = useState(false);
    const [montoDeclarado, setMontoDeclarado] = useState('');
    const [observacionesCierre, setObservacionesCierre] = useState('');
    const [closingProcessing, setClosingProcessing] = useState(false);

    // Estado del Resumen post-cierre
    const [resumenCierre, setResumenCierre] = useState(flash?.resumenCierre || null);
    const [showResumenModal, setShowResumenModal] = useState(Boolean(flash?.resumenCierre));

    // Sincronizar estado cuando cambian las props
    useEffect(() => {
        if (props.turnoActivo !== undefined) {
            setTurnoActivo(props.turnoActivo);
        }
    }, [props.turnoActivo]);

    useEffect(() => {
        if (flash?.resumenCierre) {
            setResumenCierre(flash.resumenCierre);
            setShowResumenModal(true);
        }
    }, [flash]);

    // Clave de almacenamiento aislada por negocio y por usuario autenticado
    const cartStorageKey = `gestisoft_pos_cart_${auth.user?.negocio_id || '0'}_${auth.user?.id || '0'}`;

    // Inicializar el carrito desde localStorage para que persista al cambiar de página o navegar por el menú
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem(cartStorageKey);
            return savedCart ? JSON.parse(savedCart) : [];
        } catch (error) {
            console.error('Error al recuperar el carrito desde localStorage:', error);
            return [];
        }
    });

    // Guardar el carrito automáticamente cada vez que cambie
    useEffect(() => {
        try {
            if (cart.length > 0) {
                localStorage.setItem(cartStorageKey, JSON.stringify(cart));
            } else {
                localStorage.removeItem(cartStorageKey);
            }
        } catch (error) {
            console.error('Error al guardar el carrito en localStorage:', error);
        }
    }, [cart, cartStorageKey]);

    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [checkoutProcessing, setCheckoutProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState(pageErrors?.checkout || pageErrors?.caja || null);
    const [successMsg, setSuccessMsg] = useState(flash?.success || null);

    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null); // Ref para detectar clics fuera del buscador
    const resultRefs = useRef([]); // Refs para navegación por teclado en la lista de resultados
    const montoInicialInputRef = useRef(null);
    const montoDeclaradoInputRef = useRef(null);
    const paymentButtonsRef = useRef([]);
    const amountReceivedInputRef = useRef(null);

    const METODOS_PAGO = [
        { id: 'Efectivo', label: 'Efectivo', icon: '💵', desc: 'Gaveta física' },
        { id: 'Débito', label: 'Débito', icon: '💳', desc: 'Tarjeta débito' },
        { id: 'Crédito', label: 'Crédito', icon: '💳', desc: 'Tarjeta crédito' },
        { id: 'Transferencia', label: 'Transferencia', icon: '📲', desc: 'Cta. bancaria' },
    ];

    // Estado del Modal de Pago
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [amountReceived, setAmountReceived] = useState('');

    // Limpiar errores cuando cambia el prop flash o pageErrors
    useEffect(() => {
        setErrorMsg(pageErrors?.checkout || pageErrors?.caja || null);
        setSuccessMsg(flash?.success || null);
    }, [pageErrors, flash]);

    // Mantener el focus en el input de búsqueda si los modales están cerrados
    useEffect(() => {
        if (searchInputRef.current && !showPaymentModal && !showAperturaModal && !showCierreModal && !showResumenModal) {
            searchInputRef.current.focus();
        }
    }, [showPaymentModal, showAperturaModal, showCierreModal, showResumenModal, cart]);

    // Atajos de teclado globales (Accesibilidad y ergonomía de mostrador)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // F2: Abrir turno de caja si está cerrada
            if (e.key === 'F2') {
                e.preventDefault();
                if (!turnoActivo && !showAperturaModal && !showCierreModal && !showPaymentModal) {
                    setShowAperturaModal(true);
                }
            }
            // F9: Cerrar caja / Arqueo ciego si está abierta
            if (e.key === 'F9') {
                e.preventDefault();
                if (turnoActivo && !showCierreModal && !showAperturaModal && !showPaymentModal) {
                    setShowCierreModal(true);
                }
            }
            // F8: Abrir modal de cobro/pago
            if (e.key === 'F8') {
                e.preventDefault();
                if (cart.length > 0 && turnoActivo && !showPaymentModal && !showAperturaModal && !showCierreModal) {
                    openPaymentModal();
                }
            }
            // F4: Enfocar buscador de SKU
            if (e.key === 'F4') {
                e.preventDefault();
                if (searchInputRef.current && !showPaymentModal && !showAperturaModal && !showCierreModal) {
                    searchInputRef.current.focus();
                }
            }
            // Escape: Cerrar modal activo
            if (e.key === 'Escape') {
                if (showPaymentModal) closePaymentModal();
                if (showAperturaModal) setShowAperturaModal(false);
                if (showCierreModal) setShowCierreModal(false);
                if (showResumenModal) setShowResumenModal(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cart, showPaymentModal, showAperturaModal, showCierreModal, showResumenModal, turnoActivo]);

    // Ocultar resultados de búsqueda al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const totalCart = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const ivaRate = 0.19;
    const neto = Math.round(totalCart / (1 + ivaRate));
    const iva = totalCart - neto;

    const change = amountReceived ? Math.max(0, parseInt(amountReceived) - totalCart) : 0;

    const handleSearch = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await axios.get(route('pos.search'), { params: { q: searchQuery } });
            const products = response.data;

            if (products.length === 1 && products[0].sku === searchQuery) {
                addToCart(products[0]);
                setSearchQuery('');
                setSearchResults([]);
            } else if (products.length > 0) {
                setSearchResults(products);
            } else {
                setErrorMsg('Producto no encontrado.');
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Error buscando producto:', error);
            setErrorMsg('Error al conectar con el servidor.');
        } finally {
            setIsSearching(false);
        }
    };

    const addToCart = (product) => {
        if (!turnoActivo) {
            setErrorMsg('Debe abrir un turno de caja antes de agregar productos al carrito.');
            setShowAperturaModal(true);
            return;
        }

        if (product.stock <= 0) {
            setErrorMsg(`El producto '${product.name}' se encuentra sin stock.`);
            return;
        }

        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product_id === product.id);
            if (existingItem) {
                if (existingItem.quantity + 1 > product.stock) {
                    setErrorMsg(`Stock máximo alcanzado para '${product.name}' (${product.stock} disponibles).`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, {
                    product_id: product.id,
                    sku: product.sku,
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    quantity: 1
                }];
            }
        });
        setSearchResults([]);
        setSearchQuery('');
        setErrorMsg(null);
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        const item = cart.find(i => i.product_id === productId);
        if (item && newQuantity > item.stock) {
            setErrorMsg(`Stock máximo alcanzado para '${item.name}' (${item.stock} disponibles).`);
            return;
        }

        setCart(prevCart =>
            prevCart.map(item =>
                item.product_id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
        setErrorMsg(null);
    };

    const removeFromCart = (productId) => {
        setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        localStorage.removeItem(cartStorageKey);
    };

    const openPaymentModal = () => {
        if (!turnoActivo) {
            setErrorMsg('Debe abrir un turno de caja antes de procesar ventas.');
            setShowAperturaModal(true);
            return;
        }

        if (cart.length === 0) return;
        setPaymentMethod('Efectivo');
        setAmountReceived(totalCart.toString());
        setShowPaymentModal(true);
        setTimeout(() => {
            paymentButtonsRef.current[0]?.focus();
        }, 50);
    };

    const handlePaymentButtonKeyDown = (e, idx) => {
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            const nextIdx = (idx + 1) % METODOS_PAGO.length;
            setPaymentMethod(METODOS_PAGO[nextIdx].id);
            paymentButtonsRef.current[nextIdx]?.focus();
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prevIdx = (idx - 1 + METODOS_PAGO.length) % METODOS_PAGO.length;
            setPaymentMethod(METODOS_PAGO[prevIdx].id);
            paymentButtonsRef.current[prevIdx]?.focus();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (paymentMethod === 'Efectivo') {
                amountReceivedInputRef.current?.focus();
                amountReceivedInputRef.current?.select();
            } else {
                const nextIdx = (idx + 1) % METODOS_PAGO.length;
                setPaymentMethod(METODOS_PAGO[nextIdx].id);
                paymentButtonsRef.current[nextIdx]?.focus();
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prevIdx = (idx - 1 + METODOS_PAGO.length) % METODOS_PAGO.length;
            setPaymentMethod(METODOS_PAGO[prevIdx].id);
            paymentButtonsRef.current[prevIdx]?.focus();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (paymentMethod === 'Efectivo') {
                amountReceivedInputRef.current?.focus();
                amountReceivedInputRef.current?.select();
            } else {
                handleCheckout();
            }
        }
    };

    const closePaymentModal = () => {
        setShowPaymentModal(false);
        setAmountReceived('');
    };

    const handleCheckout = () => {
        if (!turnoActivo) {
            setErrorMsg('Debe abrir un turno de caja antes de procesar ventas.');
            closePaymentModal();
            setShowAperturaModal(true);
            return;
        }

        if (paymentMethod === 'Efectivo') {
            const received = parseInt(amountReceived) || 0;
            if (received < totalCart) {
                setErrorMsg('El monto recibido no puede ser inferior al total de la compra.');
                return;
            }
        }

        setCheckoutProcessing(true);
        setErrorMsg(null);

        router.post(route('pos.checkout'), {
            items: cart,
            total: totalCart,
            neto: neto,
            iva: iva,
            payment_method: paymentMethod,
            amount_received: paymentMethod === 'Efectivo' ? amountReceived : null,
            change: paymentMethod === 'Efectivo' ? change : null
        }, {
            onSuccess: () => {
                clearCart();
                closePaymentModal();
            },
            onFinish: () => setCheckoutProcessing(false)
        });
    };

    // Manejo de Apertura de Caja (PBI-03)
    const handleAbrirCaja = (e) => {
        e.preventDefault();
        const monto = parseInt(montoInicial);
        if (isNaN(monto) || monto < 0) {
            setErrorMsg('El monto inicial debe ser un número entero mayor o igual a 0.');
            return;
        }

        setOpeningProcessing(true);
        setErrorMsg(null);

        router.post(route('caja.abrir'), {
            monto_inicial: monto
        }, {
            onSuccess: () => {
                setShowAperturaModal(false);
            },
            onError: (err) => {
                setErrorMsg(err.caja || err.monto_inicial || 'Error al abrir el turno de caja.');
            },
            onFinish: () => setOpeningProcessing(false)
        });
    };

    // Manejo de Arqueo Ciego / Cierre de Caja (PBI-03)
    const handleCerrarCaja = (e) => {
        e.preventDefault();
        const monto = parseInt(montoDeclarado);
        if (isNaN(monto) || monto < 0) {
            setErrorMsg('Debe ingresar el dinero físico contado en gaveta (número mayor o igual a 0).');
            return;
        }

        setClosingProcessing(true);
        setErrorMsg(null);

        router.post(route('caja.cerrar'), {
            monto_declarado: monto,
            observaciones: observacionesCierre
        }, {
            onSuccess: () => {
                setShowCierreModal(false);
                setMontoDeclarado('');
                setObservacionesCierre('');
            },
            onError: (err) => {
                setErrorMsg(err.caja || err.monto_declarado || 'Error al registrar el arqueo de caja.');
            },
            onFinish: () => setClosingProcessing(false)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="font-semibold text-2xl text-gray-800 tracking-tight">Punto de Venta</h2>
                        {turnoActivo ? (
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-xs">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Caja Abierta • Turno #{turnoActivo.id}
                                </span>
                                <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-2xs">
                                    <span className="text-[11px] text-indigo-500 font-semibold uppercase">Total Ventas:</span>
                                    <span className="tabular-nums font-black">${(turnoActivo.total_ventas || 0).toLocaleString('es-CL')}</span>
                                </span>
                            </div>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300 shadow-xs">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                Caja Cerrada
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {turnoActivo ? (
                            <button
                                type="button"
                                onClick={() => setShowCierreModal(true)}
                                className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-red-300 text-red-700 hover:bg-red-50 hover:border-red-400 font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
                                title="Realizar arqueo ciego y cerrar caja (F9)"
                            >
                                <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span>Cerrar Caja / Arqueo</span>
                                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-red-100 text-red-800 rounded font-mono font-bold">F9</kbd>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowAperturaModal(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
                                title="Abrir nuevo turno de caja (F2)"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                <span>Abrir Turno de Caja</span>
                                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-emerald-700 text-emerald-100 rounded font-mono font-bold">F2</kbd>
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="POS" />

            <div className="py-8 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Alertas Accesibles y Modernas (Screen Readers + High Contrast) */}
                    {errorMsg && (
                        <div
                            aria-live="assertive"
                            className="mb-6 bg-red-50/90 border border-red-200 text-red-900 px-4 py-3.5 rounded-xl shadow-xs flex items-center justify-between gap-3 animate-shake"
                            role="alert"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 text-red-700 rounded-lg shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-red-900">Atención en el Punto de Venta</p>
                                    <p className="text-sm text-red-700">{errorMsg}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setErrorMsg(null)}
                                className="text-red-400 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-100/50 transition-colors"
                                aria-label="Cerrar notificación de error"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {successMsg && (
                        <div
                            aria-live="polite"
                            className="mb-6 bg-emerald-50/90 border border-emerald-200 text-emerald-900 px-4 py-3.5 rounded-xl shadow-xs flex items-center justify-between gap-3"
                            role="alert"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg shrink-0">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-emerald-900">Operación Exitosa</p>
                                    <p className="text-sm text-emerald-700">{successMsg}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSuccessMsg(null)}
                                className="text-emerald-500 hover:text-emerald-800 p-1.5 rounded-lg hover:bg-emerald-100/50 transition-colors"
                                aria-label="Cerrar notificación de éxito"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Banner Bloqueante Informativo si la Caja está Cerrada */}
                    {!turnoActivo && (
                        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex items-start gap-3.5">
                                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl shrink-0 mt-0.5">
                                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">Caja Cerrada • Se requiere apertura de turno</h3>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        Para registrar ventas y emitir cobros en el sistema, declare el fondo inicial de efectivo (sencillo en gaveta) para iniciar su turno de trabajo.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowAperturaModal(true)}
                                className="shrink-0 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                </svg>
                                <span>Iniciar Turno de Caja (F2)</span>
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Columna Izquierda: Buscador y Carrito */}
                        <div className="w-full lg:w-2/3 flex flex-col gap-6">

                            {/* Panel Buscador Ergonómico */}
                            <div
                                ref={searchContainerRef}
                                className={`bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-200/80 relative ${!turnoActivo ? 'opacity-60 pointer-events-none' : ''}`}
                            >
                                <form onSubmit={handleSearch} className="relative">
                                    <label htmlFor="sku-search-input" className="sr-only">
                                        Buscar producto o escanear código de barras
                                    </label>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="sku-search-input"
                                        ref={searchInputRef}
                                        type="text"
                                        disabled={!turnoActivo}
                                        className="pl-11 pr-24 w-full border-gray-200 rounded-xl shadow-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium py-3 text-gray-800 placeholder-gray-400"
                                        placeholder={turnoActivo ? "Escanear SKU o escribir nombre del producto... [F4]" : "Caja cerrada: abra turno para buscar productos"}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyDown={(e) => {
                                            // Si hay resultados y el usuario presiona Tab o Flecha Abajo, mover foco al primer resultado
                                            if ((e.key === 'Tab' || e.key === 'ArrowDown') && searchResults.length > 0) {
                                                if (!e.shiftKey) {
                                                    e.preventDefault();
                                                    resultRefs.current[0]?.focus();
                                                }
                                            } else if (e.key === 'Escape') {
                                                e.preventDefault();
                                                setSearchResults([]);
                                            }
                                        }}
                                        autoComplete="off"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1.5">
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                tabIndex="-1"
                                                onClick={() => {
                                                    setSearchQuery('');
                                                    setSearchResults([]);
                                                    searchInputRef.current?.focus();
                                                }}
                                                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                                                aria-label="Limpiar búsqueda"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            tabIndex="-1"
                                            disabled={isSearching || !turnoActivo}
                                            className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold text-xs transition-colors shadow-xs"
                                        >
                                            {isSearching ? 'Buscando...' : 'Buscar'}
                                        </button>
                                    </div>
                                </form>

                                {/* Lista Desplegable de Resultados con Navegación Total por Teclado */}
                                {searchResults.length > 0 && (
                                    <ul
                                        className="absolute z-20 left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 max-h-64 overflow-y-auto divide-y divide-gray-100"
                                        role="listbox"
                                    >
                                        {searchResults.map((product, index) => (
                                            <li
                                                key={product.id}
                                                ref={(el) => (resultRefs.current[index] = el)}
                                                tabIndex={0}
                                                role="option"
                                                aria-selected={false}
                                                onClick={() => {
                                                    addToCart(product);
                                                    searchInputRef.current?.focus();
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' || e.key === ' ') {
                                                        e.preventDefault();
                                                        addToCart(product);
                                                        searchInputRef.current?.focus();
                                                    } else if (e.key === 'ArrowDown') {
                                                        e.preventDefault();
                                                        if (index < searchResults.length - 1) {
                                                            resultRefs.current[index + 1]?.focus();
                                                        }
                                                    } else if (e.key === 'ArrowUp') {
                                                        e.preventDefault();
                                                        if (index > 0) {
                                                            resultRefs.current[index - 1]?.focus();
                                                        } else {
                                                            searchInputRef.current?.focus();
                                                        }
                                                    } else if (e.key === 'Tab') {
                                                        if (e.shiftKey) {
                                                            if (index === 0) {
                                                                e.preventDefault();
                                                                searchInputRef.current?.focus();
                                                            }
                                                        } else {
                                                            if (index < searchResults.length - 1) {
                                                                e.preventDefault();
                                                                resultRefs.current[index + 1]?.focus();
                                                            }
                                                        }
                                                    } else if (e.key === 'Escape') {
                                                        e.preventDefault();
                                                        setSearchResults([]);
                                                        searchInputRef.current?.focus();
                                                    }
                                                }}
                                                className="p-3.5 hover:bg-indigo-50/70 focus:bg-indigo-100/90 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 cursor-pointer flex justify-between items-center transition-colors text-sm"
                                            >
                                                <div>
                                                    <span className="font-bold text-gray-800">{product.name}</span>
                                                    <div className="flex gap-2 text-xs text-gray-500 mt-0.5">
                                                        <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded">SKU: {product.sku}</span>
                                                        <span className={`font-semibold ${product.stock <= 5 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                                            Stock: {product.stock} un.
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold text-indigo-700 tabular-nums">
                                                        ${product.price.toLocaleString('es-CL')}
                                                    </span>
                                                    <span className="block text-[11px] text-gray-400">
                                                        <kbd className="hidden sm:inline font-mono font-bold bg-gray-100 px-1 py-0.5 rounded text-[10px] mr-1">Enter</kbd>
                                                        para agregar
                                                    </span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            {/* Tabla Interactiva de Ítems en el Carrito */}
                            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden flex flex-col">
                                <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-gray-800 text-base">Carrito de Compras</h3>
                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full tabular-nums">
                                            {cart.reduce((total, i) => total + i.quantity, 0)} ítems
                                        </span>
                                    </div>
                                    {cart.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={clearCart}
                                            className="text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 p-1"
                                            title="Vaciar todo el carrito"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Vaciar Carrito
                                        </button>
                                    )}
                                </div>

                                <div className="divide-y divide-gray-100 overflow-y-auto max-h-[420px]">
                                    {cart.length === 0 ? (
                                        <div className="p-12 text-center text-gray-400 flex flex-col items-center justify-center">
                                            <div className="w-16 h-16 mb-3 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                            </div>
                                            <p className="font-semibold text-gray-600 text-sm">El carrito de compras está vacío</p>
                                            <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                                {turnoActivo
                                                    ? 'Escanee un código de barras o use el buscador para añadir artículos a la venta.'
                                                    : 'Abra un turno de caja para comenzar a operar el punto de venta.'}
                                            </p>
                                        </div>
                                    ) : (
                                        cart.map((item) => (
                                            <div key={item.product_id} className="p-4 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                        <span className="font-mono">{item.sku}</span>
                                                        <span>•</span>
                                                        <span className="font-semibold text-gray-700 tabular-nums">
                                                            ${item.price.toLocaleString('es-CL')} c/u
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Controles de Cantidad Ergonómicos */}
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                                                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors text-sm"
                                                        aria-label="Disminuir cantidad"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center font-bold text-sm text-gray-800 tabular-nums">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                                                        className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold flex items-center justify-center transition-colors text-sm"
                                                        aria-label="Aumentar cantidad"
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                {/* Subtotal y Eliminar */}
                                                <div className="text-right shrink-0 min-w-[80px]">
                                                    <p className="font-bold text-indigo-700 text-sm tabular-nums">
                                                        ${(item.price * item.quantity).toLocaleString('es-CL')}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeFromCart(item.product_id)}
                                                        className="text-[11px] text-gray-400 hover:text-red-600 transition-colors mt-0.5"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Panel de Totales y Cobro */}
                        <div className="w-full lg:w-1/3 flex flex-col gap-6">

                            {/* Tarjeta de Resumen Financiero */}
                            <div className="bg-white p-5 rounded-2xl shadow-xs border border-gray-200/80 flex flex-col gap-4">
                                <h3 className="font-bold text-gray-800 text-base border-b border-gray-100 pb-3">
                                    Resumen de Transacción
                                </h3>

                                <div className="space-y-2.5 text-sm">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal Neto:</span>
                                        <span className="font-medium text-gray-900 tabular-nums">
                                            ${neto.toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>IVA (19%):</span>
                                        <span className="font-medium text-gray-900 tabular-nums">
                                            ${iva.toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
                                        <span className="font-bold text-gray-900 text-lg">Total a Pagar:</span>
                                        <span className="font-black text-2xl text-indigo-700 tabular-nums">
                                            ${totalCart.toLocaleString('es-CL')}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={openPaymentModal}
                                    disabled={cart.length === 0 || !turnoActivo}
                                    className={`w-full py-4 rounded-xl font-bold text-base flex justify-center items-center gap-2 transition-all duration-200 ${cart.length === 0 || !turnoActivo
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-lg active:scale-[0.99]'
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>Cobrar e Imprimir Ticket</span>
                                    <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs bg-indigo-700 text-indigo-100 rounded font-mono font-bold">F8</kbd>
                                </button>
                            </div>

                            {/* Tarjeta de Atajos Rápidos */}
                            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100 text-xs text-indigo-900">
                                <p className="font-bold uppercase tracking-wider text-indigo-800 mb-2 flex items-center gap-1.5">
                                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Atajos de Teclado del POS
                                </p>
                                <ul className="space-y-1.5">
                                    <li className="flex justify-between items-center">
                                        <span>Abrir Turno de Caja:</span>
                                        <kbd className="px-1.5 py-0.5 bg-white border border-indigo-200 rounded font-mono font-bold">F2</kbd>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Cerrar Turno / Arqueo:</span>
                                        <kbd className="px-1.5 py-0.5 bg-white border border-indigo-200 rounded font-mono font-bold">F9</kbd>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Foco en Buscador SKU:</span>
                                        <kbd className="px-1.5 py-0.5 bg-white border border-indigo-200 rounded font-mono font-bold">F4</kbd>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Abrir Modal de Cobro:</span>
                                        <kbd className="px-1.5 py-0.5 bg-white border border-indigo-200 rounded font-mono font-bold">F8</kbd>
                                    </li>
                                    <li className="flex justify-between items-center">
                                        <span>Cerrar Ventana / Cancelar:</span>
                                        <kbd className="px-1.5 py-0.5 bg-white border border-indigo-200 rounded font-mono font-bold">Esc</kbd>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal de Pago Accesible y Rápido */}
            <Modal show={showPaymentModal} onClose={closePaymentModal} maxWidth="md">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-5 pb-3 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Completar Cobro</h2>
                        <span className="text-xl font-black text-indigo-700 tabular-nums">
                            ${totalCart.toLocaleString('es-CL')}
                        </span>
                    </div>

                    <div className="mb-5">
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600">
                                Método de Pago
                            </label>
                            <span className="text-[11px] font-semibold text-indigo-600 flex items-center gap-1">
                                <span className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded text-[10px] font-mono">← →</span>
                                <span>Usa flechas para elegir</span>
                            </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                            {METODOS_PAGO.map((metodo, idx) => {
                                const selected = paymentMethod === metodo.id;
                                return (
                                    <button
                                        key={metodo.id}
                                        ref={(el) => (paymentButtonsRef.current[idx] = el)}
                                        type="button"
                                        onClick={() => {
                                            setPaymentMethod(metodo.id);
                                            paymentButtonsRef.current[idx]?.focus();
                                        }}
                                        onKeyDown={(e) => handlePaymentButtonKeyDown(e, idx)}
                                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs font-bold transition-all focus:outline-none ${
                                            selected
                                                ? 'bg-indigo-50/90 border-indigo-600 text-indigo-700 ring-2 ring-indigo-500/40 shadow-xs scale-[1.02]'
                                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
                                        }`}
                                    >
                                        <span className="text-2xl mb-1">{metodo.icon}</span>
                                        <span className="text-sm">{metodo.label}</span>
                                        <span className="text-[10px] text-gray-400 font-normal mt-0.5">{metodo.desc}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {paymentMethod !== 'Efectivo' && (
                        <div className="mb-5 bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2.5">
                                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                                    {paymentMethod === 'Débito' ? 'DB' : paymentMethod === 'Crédito' ? 'CR' : 'TF'}
                                </span>
                                <div>
                                    <p className="font-bold text-gray-900">Cobro electrónico por {paymentMethod}</p>
                                    <p className="text-xs text-gray-500">Monto exacto a procesar en terminal o cuenta</p>
                                </div>
                            </div>
                            <span className="text-lg font-black text-indigo-700 tabular-nums">
                                ${totalCart.toLocaleString('es-CL')}
                            </span>
                        </div>
                    )}

                    {paymentMethod === 'Efectivo' && (
                        <div className="mb-5 bg-gray-50/80 p-4 rounded-xl border border-gray-200/80">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                                Monto Recibido
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <span className="text-gray-400 font-bold">$</span>
                                </div>
                                <input
                                    ref={amountReceivedInputRef}
                                    type="number"
                                    className="pl-8 w-full border-gray-200 rounded-xl shadow-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-xl font-bold tabular-nums"
                                    value={amountReceived}
                                    onChange={(e) => setAmountReceived(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleCheckout();
                                        } else if (e.key === 'ArrowUp') {
                                            e.preventDefault();
                                            paymentButtonsRef.current[0]?.focus();
                                        }
                                    }}
                                    placeholder={totalCart}
                                    autoFocus
                                />
                            </div>

                            {/* Accesos rápidos de efectivo para el cajero */}
                            <div className="flex flex-wrap gap-2 mt-3">
                                <button
                                    type="button"
                                    onClick={() => setAmountReceived(totalCart.toString())}
                                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                                >
                                    Exacto (${totalCart.toLocaleString('es-CL')})
                                </button>
                                {[5000, 10000, 20000, 50000].filter(val => val > totalCart).map(val => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => setAmountReceived(val.toString())}
                                        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                                    >
                                        ${val.toLocaleString('es-CL')}
                                    </button>
                                ))}
                            </div>

                            <div className="mt-4 pt-3 border-t border-gray-200/60 flex justify-between items-center text-sm">
                                <span className="text-gray-600 font-medium">Vuelto a entregar:</span>
                                <span className={`text-xl font-black tabular-nums ${change > 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    ${change.toLocaleString('es-CL')}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            className="w-1/3 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm"
                            onClick={closePaymentModal}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={checkoutProcessing || (paymentMethod === 'Efectivo' && (!amountReceived || parseInt(amountReceived) < totalCart))}
                            className={`w-2/3 py-3 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all duration-200 text-sm ${checkoutProcessing || (paymentMethod === 'Efectivo' && (!amountReceived || parseInt(amountReceived) < totalCart))
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow'
                                }`}
                        >
                            {checkoutProcessing ? 'Procesando venta...' : 'Confirmar Venta'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal de Apertura de Turno de Caja (PBI-03 / AC-CAJA-01) */}
            <Modal show={showAperturaModal} onClose={() => setShowAperturaModal(false)} maxWidth="md">
                <form onSubmit={handleAbrirCaja} className="p-6">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                        <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Apertura de Turno de Caja</h2>
                            <p className="text-xs text-gray-500">Inicie su jornada declarando el fondo de sencillo en gaveta.</p>
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                            Monto Inicial en Efectivo (Fondo de Vuelto)
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <span className="text-gray-400 font-bold">$</span>
                            </div>
                            <input
                                ref={montoInicialInputRef}
                                type="number"
                                min="0"
                                required
                                className="pl-8 w-full border-gray-200 rounded-xl shadow-xs focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500 text-xl font-bold tabular-nums"
                                value={montoInicial}
                                onChange={(e) => setMontoInicial(e.target.value)}
                                placeholder="50000"
                                autoFocus
                            />
                        </div>

                        {/* Presets rápidos */}
                        <div className="flex flex-wrap gap-2 mt-3">
                            {[20000, 30000, 50000, 100000].map(val => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setMontoInicial(val.toString())}
                                    className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition-colors"
                                >
                                    ${val.toLocaleString('es-CL')}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            className="w-1/3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
                            onClick={() => setShowAperturaModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={openingProcessing || !montoInicial}
                            className={`w-2/3 py-2.5 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all text-sm ${openingProcessing || !montoInicial
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'
                                }`}
                        >
                            {openingProcessing ? 'Abriendo turno...' : 'Confirmar Apertura'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Arqueo Ciego / Cierre de Turno (PBI-03 / AC-CAJA-03 / AC-CAJA-04) */}
            <Modal show={showCierreModal} onClose={() => setShowCierreModal(false)} maxWidth="md">
                <form onSubmit={handleCerrarCaja} className="p-6">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                        <div className="p-2.5 bg-red-100 text-red-700 rounded-xl">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Arqueo y Cierre de Caja</h2>
                            <p className="text-xs text-gray-500">Arqueo Ciego: Declare el dinero físico contado en gaveta.</p>
                        </div>
                    </div>

                    {/* Explicación Pedagógica del Arqueo Ciego */}
                    <div className="mb-5 bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 text-xs text-blue-900 flex items-start gap-2.5">
                        <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>
                            <strong>Seguridad Contable:</strong> Cuente los billetes y monedas físicos en la caja. Por auditoría, el sistema calculará la diferencia y descuadre automáticamente al confirmar su declaración.
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                            Efectivo Total Contado en Gaveta
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <span className="text-gray-400 font-bold">$</span>
                            </div>
                            <input
                                ref={montoDeclaradoInputRef}
                                type="number"
                                min="0"
                                required
                                className="pl-8 w-full border-gray-200 rounded-xl shadow-xs focus:border-red-500 focus:ring-2 focus:ring-red-500 text-xl font-bold tabular-nums"
                                value={montoDeclarado}
                                onChange={(e) => setMontoDeclarado(e.target.value)}
                                placeholder="0"
                                autoFocus
                            />
                        </div>
                    </div>

                    <div className="mb-5">
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                            Observaciones de Cuadratura (Opcional)
                        </label>
                        <textarea
                            rows="2"
                            className="w-full border-gray-200 rounded-xl shadow-xs focus:border-red-500 focus:ring-2 focus:ring-red-500 text-xs text-gray-800"
                            placeholder="Detalle billetes rotos rechazados, compras menores de emergencia, etc."
                            value={observacionesCierre}
                            onChange={(e) => setObservacionesCierre(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            className="w-1/3 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors text-sm"
                            onClick={() => setShowCierreModal(false)}
                        >
                            Volver al POS
                        </button>
                        <button
                            type="submit"
                            disabled={closingProcessing || montoDeclarado === ''}
                            className={`w-2/3 py-2.5 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all text-sm ${closingProcessing || montoDeclarado === ''
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-red-600 hover:bg-red-700 shadow-xs'
                                }`}
                        >
                            {closingProcessing ? 'Registrando arqueo...' : 'Confirmar y Cerrar Turno'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Resumen y Ticket de Cierre de Caja (Audit Trail) */}
            <Modal show={showResumenModal} onClose={() => setShowResumenModal(false)} maxWidth="lg">
                {resumenCierre && (
                    <div className="p-6">
                        <div className="text-center pb-4 border-b border-gray-100">
                            <span className="inline-block p-3 rounded-full bg-indigo-50 text-indigo-700 mb-2">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            <h2 className="text-xl font-bold text-gray-900">Acta de Cierre de Caja</h2>
                            <p className="text-xs text-gray-500 mt-1">Turno #{resumenCierre.id} • {resumenCierre.fecha_cierre}</p>
                        </div>

                        {/* Indicador de Descuadre */}
                        <div className="my-5 p-4 rounded-xl text-center border">
                            {resumenCierre.diferencia === 0 ? (
                                <div className="bg-emerald-50/80 border-emerald-200 text-emerald-800 p-3 rounded-lg">
                                    <p className="font-bold text-base flex items-center justify-center gap-1.5 text-emerald-800">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Caja Cuadrada Exactamente
                                    </p>
                                    <p className="text-xs text-emerald-700 mt-0.5">El dinero contado coincide al 100% con lo esperado ($0 de diferencia).</p>
                                </div>
                            ) : resumenCierre.diferencia < 0 ? (
                                <div className="bg-red-50/80 border-red-200 text-red-900 p-3 rounded-lg">
                                    <p className="font-bold text-base flex items-center justify-center gap-1.5 text-red-900">
                                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        Descuadre: Faltante de Dinero
                                    </p>
                                    <p className="text-xl font-black text-red-700 mt-1 tabular-nums">
                                        -${Math.abs(resumenCierre.diferencia).toLocaleString('es-CL')}
                                    </p>
                                    <p className="text-xs text-red-600 mt-0.5">Falta dinero en la gaveta física respecto al total esperado.</p>
                                </div>
                            ) : (
                                <div className="bg-blue-50/80 border-blue-200 text-blue-900 p-3 rounded-lg">
                                    <p className="font-bold text-base flex items-center justify-center gap-1.5 text-blue-900">
                                        Descuadre: Sobrante de Dinero
                                    </p>
                                    <p className="text-xl font-black text-blue-700 mt-1 tabular-nums">
                                        +${resumenCierre.diferencia.toLocaleString('es-CL')}
                                    </p>
                                    <p className="text-xs text-blue-600 mt-0.5">Hay más dinero en gaveta del registrado por ventas.</p>
                                </div>
                            )}
                        </div>

                        {/* Desglose Contable */}
                        <div className="space-y-2 text-sm bg-gray-50/80 p-4 rounded-xl border border-gray-200/80">
                            <div className="flex justify-between text-gray-600">
                                <span>Fondo Inicial en Efectivo:</span>
                                <span className="font-semibold text-gray-800 tabular-nums">
                                    ${resumenCierre.monto_inicial.toLocaleString('es-CL')}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Ventas en Efectivo (+):</span>
                                <span className="font-semibold text-emerald-700 tabular-nums">
                                    ${resumenCierre.ventas_efectivo.toLocaleString('es-CL')}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Ventas en Débito (Digital):</span>
                                <span className="font-medium text-blue-700 tabular-nums">
                                    ${(resumenCierre.ventas_debito || 0).toLocaleString('es-CL')}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Ventas en Crédito (Digital):</span>
                                <span className="font-medium text-indigo-700 tabular-nums">
                                    ${(resumenCierre.ventas_credito || 0).toLocaleString('es-CL')}
                                </span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Ventas Transferencia (Digital):</span>
                                <span className="font-medium text-purple-700 tabular-nums">
                                    ${(resumenCierre.ventas_transferencia || 0).toLocaleString('es-CL')}
                                </span>
                            </div>
                            <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900">
                                <span>Total Esperado en Gaveta:</span>
                                <span className="text-base text-indigo-700 tabular-nums">
                                    ${resumenCierre.total_esperado.toLocaleString('es-CL')}
                                </span>
                            </div>
                            <div className="flex justify-between font-bold text-gray-900">
                                <span>Efectivo Físico Declarado:</span>
                                <span className="text-base text-gray-900 tabular-nums">
                                    ${resumenCierre.monto_declarado.toLocaleString('es-CL')}
                                </span>
                            </div>
                        </div>

                        {resumenCierre.observaciones && (
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg border text-xs text-gray-700">
                                <span className="font-bold block text-gray-800">Observaciones:</span>
                                <p className="mt-0.5 italic">{resumenCierre.observaciones}</p>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setShowResumenModal(false)}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-xs transition-colors"
                            >
                                Entendido / Finalizar Turno
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </AuthenticatedLayout>
    );
}
