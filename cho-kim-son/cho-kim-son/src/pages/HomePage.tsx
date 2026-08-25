import React, { useState, useEffect } from 'react';
import { Page, Icon, Sheet } from 'zmp-ui';
import { getUserInfo, getPhoneNumber } from 'zmp-sdk';
import { CATEGORIES } from '../data';
import { supabase } from '../utils/supabase';

export interface ProductItem {
    id: number;
    name: string;
    category: string;
    store: string;
    price: number;
    unit: string;
    rating: number;
    sold: number;
    badge?: string;
    image: string;
}

interface CartItem extends ProductItem {
    quantity: number;
}

// Dữ liệu sản phẩm dự phòng
const DEFAULT_PRODUCTS: ProductItem[] = [
    {
        id: 1,
        name: 'Cua Biển Cồn Nổi Tươi Sống (Loại 1)',
        category: 'haisan',
        store: 'Vựa Thủy Sản Kim Đông',
        price: 390000,
        unit: 'Kg',
        rating: 4.9,
        sold: 320,
        badge: 'Bắt trong ngày',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 2,
        name: 'Rượu Nếp Men Chuẩn Kim Sơn Hạ Thổ 45°',
        category: 'ruou',
        store: 'Rượu Kim Sơn Truyền Thống',
        price: 185000,
        unit: 'Chai 1L',
        rating: 5.0,
        sold: 1250,
        badge: 'Đặc sản OCOP',
        image: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 3,
        name: 'Túi Xách Cói Handmade Họa Tiết Đan Mây',
        category: 'langnghe',
        store: 'Làng Nghề Cói Phát Diệm',
        price: 165000,
        unit: 'Chiếc',
        rating: 4.8,
        sold: 89,
        badge: 'Thủ công mỹ nghệ',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80',
    },
    {
        id: 4,
        name: 'Gỏi Cá Nhệch Đóng Hộp Kèm Chẻo Gia Truyền',
        category: 'dacsan',
        store: 'Nhà Hàng Đặc Sản Vùng Biển',
        price: 250000,
        unit: 'Hộp 500g',
        rating: 4.9,
        sold: 410,
        badge: 'Món ngon nức tiếng',
        image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=400&q=80',
    },
];

const HomePage: React.FC = () => {
    const [products, setProducts] = useState<ProductItem[]>(DEFAULT_PRODUCTS);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedCat, setSelectedCat] = useState('all');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchKey, setSearchKey] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Thông tin khách hàng đặt hàng
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerAddress, setCustomerAddress] = useState('');
    const [note, setNote] = useState('');

    // Tải sản phẩm từ Supabase (có Fallback)
    const loadProducts = async () => {
        try {
            setLoadingProducts(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });

            if (!error && data && data.length > 0) {
                setProducts(data);
            } else {
                setProducts(DEFAULT_PRODUCTS);
            }
        } catch (err) {
            console.error('Lỗi khi fetch sản phẩm Supabase:', err);
            setProducts(DEFAULT_PRODUCTS);
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        loadProducts();

        // Xin quyền Tên người dùng Zalo
        getUserInfo({
            success: (res) => {
                if (res?.userInfo?.name) setCustomerName(res.userInfo.name);
            },
            fail: (err) => console.log('Không lấy được tên Zalo:', err),
        });
    }, []);

    // Xin cấp quyền Số điện thoại Zalo
    const handleGetZaloPhone = () => {
        getPhoneNumber({
            success: (data) => {
                setCustomerPhone(data?.token || '0912345678');
            },
            fail: (err) => {
                console.log('Không lấy được SĐT Zalo:', err);
            },
        });
    };

    // Lọc sản phẩm theo danh mục và tìm kiếm
    const filteredProducts = products.filter((item) => {
        const matchCat = selectedCat === 'all' || item.category === selectedCat;
        const matchKey =
            item.name.toLowerCase().includes(searchKey.toLowerCase()) ||
            item.store.toLowerCase().includes(searchKey.toLowerCase());
        return matchCat && matchKey;
    });

    // Thêm vào giỏ hàng
    const handleAddToCart = (product: ProductItem) => {
        setCart((prev) => {
            const existing = prev.find((i) => i.id === product.id);
            if (existing) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    // Tăng / giảm số lượng trong giỏ
    const updateQuantity = (productId: number, delta: number) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    if (item.id === productId) {
                        const newQty = item.quantity + delta;
                        return newQty > 0 ? { ...item, quantity: newQty } : null;
                    }
                    return item;
                })
                .filter(Boolean) as CartItem[]
        );
    };

    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalCartPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Gửi đơn hàng vào bảng `orders` trên Supabase
    const handleCheckout = async () => {
        if (cart.length === 0 || isSubmitting) return;

        if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
            alert('Vui lòng nhập đầy đủ Tên, Số điện thoại và Địa chỉ nhận hàng!');
            return;
        }

        try {
            setIsSubmitting(true);
            const orderCode = 'KS-' + Math.floor(100000 + Math.random() * 900000);
            const itemsDetailText = cart
                .map((item) => `${item.name} (x${item.quantity} ${item.unit})`)
                .join('; ');

            const { error } = await supabase.from('orders').insert([
                {
                    order_code: orderCode,
                    customer_name: customerName,
                    customer_phone: customerPhone,
                    customer_address: customerAddress,
                    items_detail: itemsDetailText,
                    total_price: totalCartPrice,
                    status: 'delivering',
                    note: note || 'Giao hàng tận nơi',
                },
            ]);

            if (error) {
                alert('Lỗi lưu đơn hàng: ' + error.message);
            } else {
                alert(`🎉 Đặt hàng thành công!\nMã đơn: #${orderCode}\nNgười nhận: ${customerName}\nSĐT: ${customerPhone}`);
                setCart([]);
                setIsCartOpen(false);
            }
        } catch (err: any) {
            alert('Có lỗi xảy ra: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page className="bg-[#f5f7fa] min-h-screen pb-28 select-none">
            {/* Header */}
            <div className="bg-emerald-800 text-white flex items-center justify-between px-4 py-3 sticky top-0 z-30 shadow-md">
                <h1 className="font-extrabold text-base tracking-wide">CHỢ SỐ KIM SƠN</h1>
                <button
                    onClick={() => setIsCartOpen(true)}
                    className="relative bg-emerald-700 p-2 rounded-full active:scale-95 transition-transform"
                >
                    <span className="text-lg">🛒</span>
                    {totalCartCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-amber-400 text-emerald-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-emerald-800 animate-pulse">
              {totalCartCount}
            </span>
                    )}
                </button>
            </div>

            {/* Banner */}
            <div className="bg-amber-400 text-emerald-950 overflow-hidden py-1.5 px-2 border-b border-amber-500 flex items-center shadow-inner">
        <span className="bg-red-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded mr-2 shrink-0 animate-pulse">
          HOT
        </span>
                <div className="overflow-hidden whitespace-nowrap w-full">
                    <p className="font-bold text-xs">
                        🌾 CHÀO MỪNG ĐẾN VỚI SÀN ĐẶC SẢN & NÔNG SẢN KIM SƠN • GIAO HÀNG TẬN NƠI! 🦀🍶
                    </p>
                </div>
            </div>

            {/* Hero Card */}
            <div className="bg-gradient-to-br from-emerald-800 via-teal-700 to-emerald-900 text-white px-4 pt-4 pb-8 rounded-b-[24px] shadow-md">
        <span className="inline-block bg-amber-400/20 text-amber-300 text-[11px] px-2.5 py-0.5 rounded-full border border-amber-300/30 font-semibold mb-1">
          ✨ Nông Sản & Làng Nghề Vùng Biển
        </span>
                <h2 className="text-xl font-extrabold">Đặc Sản Kim Sơn Chính Gốc</h2>
                <p className="text-xs text-emerald-100 opacity-90 mt-0.5">Kết nối trực tiếp nhà vườn & cơ sở sản xuất</p>
            </div>

            {/* Search Input */}
            <div className="relative z-20 px-4 -mt-5">
                <div className="bg-white rounded-2xl p-2 shadow-md flex items-center border border-gray-100">
                    <Icon icon="zi-search" className="text-gray-400 ml-2 mr-1" />
                    <input
                        type="text"
                        placeholder="Tìm rượu nếp, chiếu cói, cua Cồn Nổi..."
                        value={searchKey}
                        onChange={(e) => setSearchKey(e.target.value)}
                        className="w-full text-sm outline-none px-2 py-1 text-gray-700 placeholder-gray-400 bg-transparent"
                    />
                </div>
            </div>

            {/* Danh mục */}
            <div className="mt-4 px-4">
                <div className="flex space-x-2.5 overflow-x-auto no-scrollbar py-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCat(cat.id)}
                            className={`flex items-center space-x-1 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                                selectedCat === cat.id
                                    ? 'bg-emerald-700 text-white shadow-md scale-105'
                                    : 'bg-white text-gray-600 border border-gray-100'
                            }`}
                        >
                            <span>{cat.icon}</span>
                            <span>{cat.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="px-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                    <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center">
                        <span className="w-1.5 h-4 bg-emerald-700 rounded-full mr-2 inline-block"></span>
                        Sản Phẩm ({filteredProducts.length})
                    </h2>
                    <button
                        onClick={loadProducts}
                        className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 active:scale-95 transition-transform"
                    >
                        ↻ Đồng bộ
                    </button>
                </div>

                {loadingProducts ? (
                    <div className="text-center py-12 text-gray-400 text-xs">Đang tải sản phẩm từ máy chủ...</div>
                ) : (
                    <div className="grid grid-cols-2 gap-3.5">
                        {filteredProducts.map((prod) => (
                            <div
                                key={prod.id}
                                className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between border border-gray-100"
                            >
                                <div className="relative h-32 w-full bg-gray-50">
                                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                                    {prod.badge && (
                                        <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                      {prod.badge}
                    </span>
                                    )}
                                </div>

                                <div className="p-2.5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-[10px] text-gray-400 truncate">🏪 {prod.store}</p>
                                        <h3 className="font-semibold text-xs text-gray-900 line-clamp-2 mt-1 h-8 leading-snug">
                                            {prod.name}
                                        </h3>
                                    </div>

                                    <div className="mt-2">
                                        <div className="flex items-center text-[10px] text-gray-500 mb-1 space-x-1">
                                            <span className="text-amber-500 font-bold">★ {prod.rating}</span>
                                            <span>• Đã bán {prod.sold}</span>
                                        </div>

                                        <div className="flex items-baseline space-x-1">
                      <span className="font-extrabold text-sm text-red-600">
                        {Number(prod.price).toLocaleString('vi-VN')}đ
                      </span>
                                            <span className="text-[10px] text-gray-400">/{prod.unit}</span>
                                        </div>

                                        <button
                                            onClick={() => handleAddToCart(prod)}
                                            className="w-full mt-2 bg-emerald-700 text-white py-1.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all"
                                        >
                                            + Thêm vào giỏ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Floating Bar Giỏ hàng */}
            {totalCartCount > 0 && (
                <div className="fixed bottom-20 left-4 right-4 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex justify-between items-center z-40 border border-emerald-700">
                    <div>
                        <p className="font-bold text-xs">Đã chọn {totalCartCount} món</p>
                        <p className="text-[11px] text-amber-300 font-bold">
                            {totalCartPrice.toLocaleString('vi-VN')} đ
                        </p>
                    </div>
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="bg-amber-400 text-emerald-950 px-3.5 py-1.5 rounded-xl font-bold text-xs shadow active:scale-95"
                    >
                        Xem giỏ & Đặt hàng →
                    </button>
                </div>
            )}

            {/* Sheet Giỏ hàng & Form thông tin */}
            <Sheet
                visible={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                autoHeight
                mask
                handler
            >
                <div className="p-4 bg-white select-none max-h-[85vh] overflow-y-auto pb-10">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                        <h3 className="font-extrabold text-sm text-gray-800">
                            🛒 Giỏ Hàng ({totalCartCount})
                        </h3>
                        <button
                            onClick={() => setCart([])}
                            className="text-xs text-red-500 font-semibold"
                        >
                            Xóa tất cả
                        </button>
                    </div>

                    <div className="divide-y divide-gray-100 max-h-40 overflow-y-auto my-2">
                        {cart.map((item) => (
                            <div key={item.id} className="py-2 flex items-center justify-between">
                                <div className="flex-1 pr-2">
                                    <p className="font-semibold text-xs text-gray-900 line-clamp-1">{item.name}</p>
                                    <p className="text-[11px] text-red-600 font-bold">
                                        {Number(item.price).toLocaleString('vi-VN')} đ
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, -1)}
                                        className="w-6 h-6 rounded bg-gray-100 font-bold text-xs"
                                    >
                                        -
                                    </button>
                                    <span className="font-bold text-xs">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, 1)}
                                        className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 font-bold text-xs"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form thông tin giao nhận */}
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                        <h4 className="text-xs font-bold text-gray-800">📍 Thông Tin Giao Nhận</h4>

                        <div>
                            <label className="text-[11px] text-gray-500 block mb-1">Họ tên người nhận *</label>
                            <input
                                type="text"
                                placeholder="VD: Lê Minh Đoàn"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none focus:border-emerald-600"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label className="text-[11px] text-gray-500">Số điện thoại *</label>
                                <button
                                    onClick={handleGetZaloPhone}
                                    className="text-[10px] text-blue-600 font-semibold"
                                >
                                    ⚡ Lấy từ Zalo
                                </button>
                            </div>
                            <input
                                type="tel"
                                placeholder="VD: 0912345678"
                                value={customerPhone}
                                onChange={(e) => setCustomerPhone(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none focus:border-emerald-600"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] text-gray-500 block mb-1">Địa chỉ nhận hàng *</label>
                            <input
                                type="text"
                                placeholder="VD: Xóm 4, Cồn Thoi, Kim Sơn, Ninh Bình"
                                value={customerAddress}
                                onChange={(e) => setCustomerAddress(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none focus:border-emerald-600"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] text-gray-500 block mb-1">Ghi chú giao hàng</label>
                            <input
                                type="text"
                                placeholder="VD: Giao trong giờ hành chính..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="w-full text-xs p-2 rounded-lg border border-gray-200 outline-none focus:border-emerald-600"
                            />
                        </div>
                    </div>

                    <div className="pt-3 border-t border-gray-100 mt-3">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-gray-500">Tổng thanh toán:</span>
                            <span className="text-base font-extrabold text-red-600">
                {totalCartPrice.toLocaleString('vi-VN')} đ
              </span>
                        </div>
                        <button
                            disabled={isSubmitting || cart.length === 0}
                            onClick={handleCheckout}
                            className="w-full bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Đang tạo đơn...' : 'Xác Nhận Đặt Hàng'}
                        </button>
                    </div>
                </div>
            </Sheet>
        </Page>
    );
};

export default HomePage;