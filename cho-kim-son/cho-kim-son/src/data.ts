export interface Product {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    unit: string;
    image: string;
    store: string;
    category: string;
    rating: number;
    sold: number;
    badge?: string;
}

export const CATEGORIES = [
    { id: 'all', name: 'Tất cả', icon: '🧺' },
    { id: 'hai-san', name: 'Hải Sản Cồn Nổi', icon: '🦀' },
    { id: 'ruou', name: 'Rượu Nếp', icon: '🍶' },
    { id: 'coi', name: 'Cói Mỹ Nghệ', icon: '👜' },
    { id: 'nong-san', name: 'Nông Sản', icon: '🌾' },
];

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: 'Rượu Nếp Men Chuẩn Kim Sơn Hạ Thổ 45°',
        price: 185000,
        originalPrice: 220000,
        unit: 'Chai 1L',
        image: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=500',
        store: 'Rượu Kim Sơn Truyền Thống',
        category: 'ruou',
        rating: 5.0,
        sold: 340,
        badge: 'Đặc sản OCOP',
    },
    {
        id: 2,
        name: 'Cua Biển Cồn Nổi Tươi Sống (Loại 1)',
        price: 390000,
        originalPrice: 450000,
        unit: 'Kg',
        image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=500',
        store: 'Vựa Thủy Sản Kim Đông',
        category: 'hai-san',
        rating: 4.9,
        sold: 520,
        badge: 'Bắt trong ngày',
    },
    {
        id: 3,
        name: 'Túi Xách Cói Handmade Họa Tiết Đan Mây',
        price: 165000,
        originalPrice: 195000,
        unit: 'Chiếc',
        image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500',
        store: 'Làng Nghề Cói Phát Diệm',
        category: 'coi',
        rating: 4.8,
        sold: 180,
        badge: 'Thủ công',
    },
    {
        id: 4,
        name: 'Tôm Sú Biển Cồn Nổi Cấp Đông Sâu',
        price: 275000,
        originalPrice: 310000,
        unit: 'Hộp 1Kg',
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=500',
        store: 'Hải Sản Kim Tân',
        category: 'hai-san',
        rating: 4.9,
        sold: 290,
    },
];