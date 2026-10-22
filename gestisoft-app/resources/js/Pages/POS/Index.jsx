import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import Modal from '@/Components/Modal';

export default function Index({ auth }) {
    const { props } = usePage();
    const { errors: pageErrors, flash } = props;
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
    const [errorMsg, setErrorMsg] = useState(pageErrors?.checkout || null);
    const [successMsg, setSuccessMsg] = useState(flash?.success || null);
    
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null); // Ref para detectar clics fuera del buscador

    // Estado del Modal de Pago
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [amountReceived, setAmountReceived] = useState('');

    // Limpiar errores cuando cambia el prop flash
    useEffect(() => {
        setErrorMsg(pageErrors?.checkout || null);
        setSuccessMsg(flash?.success || null);
    }, [pageErrors, flash]);

    // Mantener el focus en el input de búsqueda si el modal está cerrado
    useEffect(() => {
        if (searchInputRef.current && !showPaymentModal) {
            searchInputRef.current.focus();
        }
    }, [showPaymentModal, cart]);

    // Atajos de teclado globales (Accesibilidad)
    useEffect(() => {
        const handleKeyDown = (e) => {
            // F8: Abrir modal de pago
            if (e.key === 'F8') {
                e.preventDefault();
                if (cart.length > 0 && !showPaymentModal) {
                    openPaymentModal();
                }
            }
            // F4: Enfocar buscador
            if (e.key === 'F4') {
                e.preventDefault();
                if (searchInputRef.current && !showPaymentModal) {
                    searchInputRef.current.focus();
                }
            }
            // Escape: Cerrar modal
            if (e.key === 'Escape' && showPaymentModal) {
                closePaymentModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [cart, showPaymentModal]);

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
    // En Chile, el precio suele incluir el IVA (19%). Calculamos el Neto y el IVA a partir del Total Bruto.
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
            setErrorMsg('Error al buscar el producto.');
        } finally {
            setIsSearching(false);
        }
    };

    const addToCart = (product) => {
        if (product.stock <= 0) {
            setErrorMsg(`El producto ${product.name} no tiene stock disponible.`);
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find(item => item.product_id === product.id);
            if (existingItem) {
                if (existingItem.quantity + 1 > product.stock) {
                    setErrorMsg(`Solo hay ${product.stock} unidades de ${product.name} en stock.`);
                    return prevCart;
                }
                return prevCart.map(item =>
                    item.product_id === product.id
                        ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
                        : item
                );
            }
            return [...prevCart, {
                product_id: product.id,
                sku: product.sku,
                name: product.name,
                price: product.price,
                quantity: 1,
                subtotal: product.price,
                max_stock: product.stock
            }];
        });
        
        setSearchQuery('');
        setSearchResults([]);
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.product_id !== productId));
    };

    const openPaymentModal = () => {
        if (cart.length === 0) return;
        setShowPaymentModal(true);
        setPaymentMethod('Efectivo');
        setAmountReceived('');
        setErrorMsg(null);
    };

    const closePaymentModal = () => {
        setShowPaymentModal(false);
    };

    const handleCheckout = () => {
        if (cart.length === 0) return;
        
        if (paymentMethod === 'Efectivo') {
            if (!amountReceived || parseInt(amountReceived) < totalCart) {
                setErrorMsg('El monto recibido debe ser mayor o igual al total a pagar.');
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
                setCart([]); // Vaciar carrito
                closePaymentModal();
            },
            onFinish: () => setCheckoutProcessing(false)
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 tracking-tight">Punto de Venta</h2>}
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

                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Columna Izquierda: Buscador y Carrito */}
                        <div className="w-full lg:w-2/3 flex flex-col gap-6">
                            
                            {/* Panel Buscador Ergonómico */}
                            <div 
                                ref={searchContainerRef}
                                className="bg-white p-4 sm:p-5 rounded-2xl shadow-xs border border-gray-200/80 relative"
                            >
                                <form onSubmit={handleSearch} className="relative">
                                    <label htmlFor="sku-search-input" className="sr-only">
                                        Buscar producto o escanear código de barras
                                    </label>
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-500">
                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="sku-search-input"
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Escanea el código de barras o busca por nombre..."
                                        className="block w-full pl-12 pr-14 py-3.5 text-base sm:text-lg border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50/60 hover:bg-white transition-all duration-200 placeholder:text-gray-400 text-gray-900"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        disabled={isSearching}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                        <kbd className="hidden sm:inline-flex items-center px-2 py-1 text-xs font-semibold text-gray-400 bg-gray-100 border border-gray-200 rounded-md">
                                            F4
                                        </kbd>
                                    </div>
                                    <button type="submit" className="hidden">Buscar</button>
                                </form>

                                {/* Resultados flotantes */}
                                {searchResults.length > 0 && (
                                    <div className="absolute z-20 w-full left-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
                                        <div className="p-2 divide-y divide-gray-100">
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 py-2">
                                                Resultados de búsqueda ({searchResults.length})
                                            </div>
                                            {searchResults.map(prod => (
                                                <button 
                                                    key={prod.id}
                                                    onClick={() => addToCart(prod)}
                                                    className="w-full text-left px-3.5 py-3 hover:bg-indigo-50/60 rounded-lg flex justify-between items-center transition-colors group"
                                                >
                                                    <div>
                                                        <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                                                            {prod.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                                                            <span className="font-mono">SKU: {prod.sku}</span>
                                                            <span>•</span>
                                                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                                                                prod.stock > 0 
                                                                    ? 'bg-emerald-50 text-emerald-700' 
                                                                    : 'bg-red-50 text-red-700'
                                                            }`}>
                                                                {prod.stock > 0 ? `Stock: ${prod.stock}` : 'Agotado'}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="text-lg font-bold text-indigo-600 tabular-nums">
                                                        ${prod.price.toLocaleString('es-CL')}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Panel Tabla Carrito */}
                            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 flex-1 overflow-hidden flex flex-col">
                                <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/40 flex justify-between items-center">
                                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                        <span>Carrito de Ventas</span>
                                        {cart.length > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                                {cart.reduce((a, b) => a + b.quantity, 0)} ítems
                                            </span>
                                        )}
                                    </h3>
                                    {cart.length > 0 && (
                                        <button 
                                            onClick={() => setCart([])}
                                            className="text-xs text-gray-400 hover:text-red-600 transition-colors font-medium"
                                        >
                                            Vaciar carrito
                                        </button>
                                    )}
                                </div>
                                <div className="overflow-x-auto flex-1">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead>
                                            <tr className="bg-gray-50/60">
                                                <th scope="col" className="px-5 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Producto</th>
                                                <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Cant.</th>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Unitario</th>
                                                <th scope="col" className="px-5 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Subtotal</th>
                                                <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-50">
                                            {cart.map((item) => (
                                                <tr key={item.product_id} className="hover:bg-indigo-50/20 transition-colors">
                                                    <td className="px-5 py-3.5 whitespace-nowrap">
                                                        <div className="font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-xs">{item.name}</div>
                                                        <div className="text-xs text-gray-400 font-mono mt-0.5">SKU: {item.sku}</div>
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap text-center">
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-sm font-bold bg-indigo-50 text-indigo-700 font-mono">
                                                            {item.quantity}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap text-right font-medium text-gray-500 hidden sm:table-cell tabular-nums">
                                                        ${item.price.toLocaleString('es-CL')}
                                                    </td>
                                                    <td className="px-5 py-3.5 whitespace-nowrap text-right font-bold text-gray-900 text-base tabular-nums">
                                                        ${item.subtotal.toLocaleString('es-CL')}
                                                    </td>
                                                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                                                        <button 
                                                            onClick={() => removeFromCart(item.product_id)}
                                                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                                                            title="Eliminar del carrito"
                                                            aria-label={`Eliminar ${item.name} del carrito`}
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {cart.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-400">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                                                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-base font-semibold text-gray-700">El carrito de venta está vacío</p>
                                                            <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                                                Escanea un código de barras o usa el buscador superior para agregar productos.
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Resumen y Cobro */}
                        <div className="w-full lg:w-1/3">
                            <div className="bg-white rounded-2xl shadow-xs border border-gray-200/80 overflow-hidden lg:sticky lg:top-6">
                                <div className="p-5 sm:p-6">
                                    <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-5">
                                        Resumen de la Transacción
                                    </h3>
                                    
                                    <div className="space-y-3 mb-6 text-sm">
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Unidades totales</span>
                                            <span className="font-semibold text-gray-900 tabular-nums">
                                                {cart.reduce((a, b) => a + b.quantity, 0)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Monto Neto</span>
                                            <span className="font-semibold text-gray-900 tabular-nums">
                                                ${neto.toLocaleString('es-CL')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>IVA (19%)</span>
                                            <span className="font-semibold text-gray-900 tabular-nums">
                                                ${iva.toLocaleString('es-CL')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bloque Destacado de Total a Pagar */}
                                    <div className="bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 border border-indigo-100 rounded-2xl p-4 sm:p-5 mb-6">
                                        <div className="flex justify-between items-baseline">
                                            <div>
                                                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Total a Pagar</span>
                                                <p className="text-[11px] text-gray-500 mt-0.5">IVA 19% incluido</p>
                                            </div>
                                            <span className="text-3xl sm:text-4xl font-black text-indigo-700 tabular-nums">
                                                ${totalCart.toLocaleString('es-CL')}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={openPaymentModal}
                                        disabled={cart.length === 0}
                                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2.5 transition-all duration-200 ${
                                            cart.length === 0 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow-md active:scale-[0.99]'
                                        }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span>Cobrar Venta [F8]</span>
                                    </button>
                                </div>
                                <div className="bg-gray-50/80 px-4 py-3 text-center border-t border-gray-100 flex items-center justify-center gap-3 text-xs text-gray-500">
                                    <span className="inline-flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 bg-white border border-gray-200 rounded shadow-xs">F4</kbd> Buscar
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="inline-flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 bg-white border border-gray-200 rounded shadow-xs">F8</kbd> Cobrar
                                    </span>
                                    <span className="text-gray-300">•</span>
                                    <span className="inline-flex items-center gap-1">
                                        <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-gray-700 bg-white border border-gray-200 rounded shadow-xs">Esc</kbd> Cerrar
                                    </span>
                                </div>
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
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                            Método de Pago
                        </label>
                        <select 
                            className="w-full border-gray-200 rounded-xl shadow-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-sm font-medium py-2.5"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option value="Efectivo">Efectivo</option>
                            <option value="Tarjeta de Débito">Tarjeta de Débito</option>
                            <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                            <option value="Transferencia">Transferencia</option>
                        </select>
                    </div>

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
                                    type="number"
                                    className="pl-8 w-full border-gray-200 rounded-xl shadow-xs focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-xl font-bold tabular-nums"
                                    value={amountReceived}
                                    onChange={(e) => setAmountReceived(e.target.value)}
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
                                {[5000, 10000, 20000].filter(val => val > totalCart).map(val => (
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
                            className={`w-2/3 py-3 rounded-xl font-bold text-white flex justify-center items-center gap-2 transition-all duration-200 text-sm ${
                                checkoutProcessing || (paymentMethod === 'Efectivo' && (!amountReceived || parseInt(amountReceived) < totalCart))
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 shadow-sm hover:shadow'
                            }`}
                        >
                            {checkoutProcessing ? 'Procesando venta...' : 'Confirmar Venta'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
