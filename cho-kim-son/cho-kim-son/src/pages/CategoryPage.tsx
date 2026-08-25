import React, { useState } from 'react';
import { Page, Header } from 'zmp-ui';
import { supabase } from '../utils/supabase';

const CategoryPage: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('haisan');
    const [store, setStore] = useState('');
    const [price, setPrice] = useState('');
    const [unit, setUnit] = useState('Kg');
    const [badge, setBadge] = useState('Chính gốc Kim Sơn');
    const [image, setImage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmitProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !store.trim() || !price || !image.trim()) {
            alert('Vui lòng điền đầy đủ: Tên đặc sản, Tên gian hàng, Giá bán và Link ảnh!');
            return;
        }

        try {
            setIsSubmitting(true);
            const { error } = await supabase.from('products').insert([
                {
                    name: name.trim(),
                    category,
                    store: store.trim(),
                    price: Number(price),
                    unit: unit.trim() || 'Món',
                    rating: 5.0,
                    sold: 0,
                    badge: badge.trim() || 'Hàng mới',
                    image: image.trim(),
                },
            ]);

            if (error) {
                alert('Lỗi đăng sản phẩm: ' + error.message);
            } else {
                alert('🎉 Đăng bán thành công! Sản phẩm đã xuất hiện trên Trang chủ Chợ Số Kim Sơn.');
                setName('');
                setStore('');
                setPrice('');
                setImage('');
            }
        } catch (err: any) {
            alert('Đã xảy ra lỗi: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page className="bg-[#f5f7fa] min-h-screen pb-24 select-none">
            <Header
                title="Kênh Người Bán Kim Sơn"
                showBackIcon={false}
                className="bg-emerald-800 text-white font-bold"
            />

            <div className="p-4">
                {/* Hướng dẫn */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-4 shadow-sm">
                    <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                        <span className="text-base">📢</span>
                        <span>Đăng Bán Nông Đặc Sản Miễn Phí</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
                        Dành cho nhà vườn, hộ sản xuất tại Kim Sơn đưa nông sản, hải sản, rượu nếp lên sàn kết nối trực tiếp với khách mua.
                    </p>
                </div>

                {/* Form nhập thông tin */}
                <form
                    onSubmit={handleSubmitProduct}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3"
                >
                    <h3 className="font-extrabold text-xs text-gray-800 uppercase tracking-wide">
                        Thông Tin Đặc Sản Đăng Bán
                    </h3>

                    <div>
                        <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                            Tên đặc sản / sản phẩm *
                        </label>
                        <input
                            type="text"
                            placeholder="VD: Cua Biển Cồn Nổi Tươi Sống"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Danh mục ngành hàng
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 bg-white"
                            >
                                <option value="haisan">🦀 Hải Sản Cồn Nổi</option>
                                <option value="ruou">🍶 Rượu Nếp Kim Sơn</option>
                                <option value="langnghe">🧺 Làng Nghề Cói</option>
                                <option value="dacsan">🌾 Đặc Sản OCOP</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Đơn vị tính
                            </label>
                            <input
                                type="text"
                                placeholder="VD: Kg, Chai 1L, Hộp"
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Giá bán (VNĐ) *
                            </label>
                            <input
                                type="number"
                                placeholder="VD: 390000"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600 font-bold text-red-600"
                            />
                        </div>

                        <div>
                            <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                                Huy hiệu / Điểm nổi bật
                            </label>
                            <input
                                type="text"
                                placeholder="VD: Đánh bắt trong ngày, OCOP"
                                value={badge}
                                onChange={(e) => setBadge(e.target.value)}
                                className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                            Tên cơ sở / Hộ kinh doanh / Nhà vườn *
                        </label>
                        <input
                            type="text"
                            placeholder="VD: Vựa Hải Sản Kim Đông"
                            value={store}
                            onChange={(e) => setStore(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                        />
                    </div>

                    <div>
                        <label className="text-[11px] font-semibold text-gray-600 block mb-1">
                            Link hình ảnh sản phẩm (URL) *
                        </label>
                        <input
                            type="text"
                            placeholder="https://images.unsplash.com/..."
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="w-full text-xs p-2.5 rounded-xl border border-gray-200 outline-none focus:border-emerald-600"
                        />
                        {image && (
                            <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-md active:scale-95 transition-all mt-4 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Đang tải lên Supabase...' : '🚀 Đăng Bán Sản Phẩm Ngay'}
                    </button>
                </form>
            </div>
        </Page>
    );
};

export default CategoryPage;