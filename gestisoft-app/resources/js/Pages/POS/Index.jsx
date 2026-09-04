import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios'; 
import Modal from '@/Components/Modal';

export default function Index({ auth }) {
    const { props } = usePage();
    const { errors: pageErrors, flash } = props;
    
    const [cart, setCart] = useState([]);
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
                    
                    {/* Alertas */}
                    {errorMsg && (
                        <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-sm animate-pulse" role="alert">
                            <p className="font-bold">Error</p>
                            <p>{errorMsg}</p>
                        </div>
                    )}
                    {successMsg && (
                        <div className="mb-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-sm" role="alert">
                            <p className="font-bold">¡Éxito!</p>
                            <p>{successMsg}</p>
                        </div>
                    )}

                    <div className="flex flex-col lg:flex-row gap-6">
                        
                        {/* Columna Izquierda: Buscador y Carrito */}
                        <div className="w-full lg:w-2/3 flex flex-col gap-6">
                            
                            {/* Panel Buscador Premium */}
                            <div 
                                ref={searchContainerRef}
                                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 relative"
                            >
                                <form onSubmit={handleSearch} className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        placeholder="Escanea el código de barras o busca por nombre..."
                                        className="block w-full pl-12 pr-4 py-4 text-lg sm:text-xl border-gray-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all duration-300 shadow-inner"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        disabled={isSearching}
                                    />
                                    <button type="submit" className="hidden">Buscar</button>
                                </form>

                                {/* Resultados flotantes */}
                                {searchResults.length > 0 && (
                                    <div className="absolute z-10 w-full left-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-96 overflow-y-auto">
                                        <div className="p-2">
                                            <div className="text-xs font-semibold text-gray-500 uppercase px-4 py-2">Resultados de consulta</div>
                                            {searchResults.map(prod => (
                                                <button 
                                                    key={prod.id}
                                                    onClick={() => addToCart(prod)}
                                                    className="w-full text-left px-4 py-3 hover:bg-indigo-50 rounded-lg flex justify-between items-center transition-colors group"
                                                >
                                                    <div>
                                                        <div className="font-bold text-gray-900 group-hover:text-indigo-700">{prod.name}</div>
                                                        <div className="text-sm text-gray-500">SKU: {prod.sku} | Stock: <span className={prod.stock > 0 ? 'text-green-600' : 'text-red-500'}>{prod.stock}</span></div>
                                                    </div>
                                                    <div className="text-xl font-black text-indigo-600">${prod.price}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Panel Tabla Carrito */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                                <div className="px-4 sm:px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="text-lg font-bold text-gray-800">Carrito de Ventas</h3>
                                </div>
                                <div className="overflow-x-auto flex-1">
                                    <table className="min-w-full divide-y divide-gray-100">
                                        <thead>
                                            <tr>
                                                <th className="px-4 sm:px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-wider">Producto</th>
                                                <th className="px-4 sm:px-6 py-4 text-center text-xs font-black text-gray-400 uppercase tracking-wider">Cant.</th>
                                                <th className="px-4 sm:px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider hidden sm:table-cell">Precio</th>
                                                <th className="px-4 sm:px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-wider">Subtotal</th>
                                                <th className="px-4 sm:px-6 py-4"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-50">
                                            {cart.map((item) => (
                                                <tr key={item.product_id} className="hover:bg-indigo-50/30 transition-colors">
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-gray-900 truncate max-w-[150px] sm:max-w-xs">{item.name}</div>
                                                        <div className="text-xs text-gray-400">SKU: {item.sku}</div>
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-center font-semibold text-lg text-indigo-600">
                                                        x{item.quantity}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right font-medium text-gray-500 hidden sm:table-cell">
                                                        ${item.price}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right font-black text-gray-800 text-lg">
                                                        ${item.subtotal}
                                                    </td>
                                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right">
                                                        <button 
                                                            onClick={() => removeFromCart(item.product_id)}
                                                            className="text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {cart.length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-16 text-center text-gray-400">
                                                        <div className="flex flex-col items-center">
                                                            <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                            <p className="text-lg">El carrito está vacío</p>
                                                            <p className="text-sm mt-1">Escanea un producto para comenzar</p>
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
                            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden lg:sticky lg:top-6">
                                <div className="p-6 sm:p-8">
                                    <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-6">Resumen de Venta</h3>
                                    
                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Artículos Totales</span>
                                            <span className="font-bold text-gray-900">{cart.reduce((a, b) => a + b.quantity, 0)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>Monto Neto</span>
                                            <span className="font-bold text-gray-900">${neto}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-gray-600">
                                            <span>IVA (19%)</span>
                                            <span className="font-bold text-gray-900">${iva}</span>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-200 pt-6 mb-8">
                                        <div className="flex justify-between items-end">
                                            <span className="text-gray-500 text-xl font-medium">Total a Pagar</span>
                                            <span className="text-4xl sm:text-5xl font-black text-indigo-600">
                                                ${totalCart}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={openPaymentModal}
                                        disabled={cart.length === 0}
                                        className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all duration-300 ${
                                            cart.length === 0 
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/20 active:scale-95'
                                        }`}
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        Procesar Pago
                                    </button>
                                </div>
                                <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                                    <p className="text-xs text-gray-500">Operable por teclado. Presiona Enter en el buscador.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* Modal de Pago */}
            <Modal show={showPaymentModal} onClose={closePaymentModal} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Completar Pago</h2>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                        <select 
                            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                        <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Monto Recibido</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 font-bold">$</span>
                                </div>
                                <input
                                    type="number"
                                    className="pl-8 w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl font-bold"
                                    value={amountReceived}
                                    onChange={(e) => setAmountReceived(e.target.value)}
                                    placeholder={totalCart}
                                    autoFocus
                                />
                            </div>
                            
                            <div className="mt-4 flex justify-between items-center text-lg">
                                <span className="text-gray-600">Vuelto / Cambio:</span>
                                <span className={`font-black ${change > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                                    ${change}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-end mb-6 pt-4 border-t border-gray-200">
                        <span className="text-gray-600 font-medium">Total a cobrar:</span>
                        <span className="text-3xl font-black text-indigo-600">${totalCart}</span>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            className="w-1/3 py-3 bg-white border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                            onClick={closePaymentModal}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleCheckout}
                            disabled={checkoutProcessing || (paymentMethod === 'Efectivo' && (!amountReceived || parseInt(amountReceived) < totalCart))}
                            className={`w-2/3 py-3 rounded-xl font-black text-white flex justify-center items-center gap-2 transition-all duration-300 ${
                                checkoutProcessing || (paymentMethod === 'Efectivo' && (!amountReceived || parseInt(amountReceived) < totalCart))
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg'
                            }`}
                        >
                            {checkoutProcessing ? 'Procesando...' : 'Confirmar Pago'}
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
