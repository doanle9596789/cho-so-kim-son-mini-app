import React, { useEffect, useState } from 'react';
import { Page, Header } from 'zmp-ui';
import { supabase } from '../utils/supabase';

interface OrderItem {
  id: number;
  created_at: string;
  order_code: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items_detail: string;
  total_price: number;
  status: string;
  note?: string;
}

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
    } catch (e) {
      console.error('Lỗi tải đơn:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Cập nhật trạng thái đơn hàng trực tiếp lên Supabase
  const handleUpdateStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'delivering' ? 'completed' : 'delivering';
    const { error } = await supabase
        .from('orders')
        .update({ status: nextStatus })
        .eq('id', id);

    if (!error) {
      setOrders((prev) =>
          prev.map((o) => (o.id === id ? { ...o, status: nextStatus } : o))
      );
    } else {
      alert('Không cập nhật được trạng thái: ' + error.message);
    }
  };

  const filteredOrders = orders.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'delivering') return item.status === 'delivering';
    if (activeTab === 'completed') return item.status === 'completed';
    return true;
  });

  return (
      <Page className="bg-[#f5f7fa] min-h-screen pb-24 select-none">
        <Header
            title="Quản Lý Đơn Hàng"
            showBackIcon={false}
            className="bg-emerald-800 text-white font-bold"
        />

        {/* Tabs */}
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100 flex justify-around text-xs font-semibold py-2.5 shadow-sm">
          <button
              onClick={() => setActiveTab('all')}
              className={`pb-1 ${
                  activeTab === 'all'
                      ? 'text-emerald-700 border-b-2 border-emerald-700 font-bold'
                      : 'text-gray-500'
              }`}
          >
            Tất cả ({orders.length})
          </button>
          <button
              onClick={() => setActiveTab('delivering')}
              className={`pb-1 ${
                  activeTab === 'delivering'
                      ? 'text-emerald-700 border-b-2 border-emerald-700 font-bold'
                      : 'text-gray-500'
              }`}
          >
            Đang giao ({orders.filter((o) => o.status === 'delivering').length})
          </button>
          <button
              onClick={() => setActiveTab('completed')}
              className={`pb-1 ${
                  activeTab === 'completed'
                      ? 'text-emerald-700 border-b-2 border-emerald-700 font-bold'
                      : 'text-gray-500'
              }`}
          >
            Đã nhận ({orders.filter((o) => o.status === 'completed').length})
          </button>
        </div>

        {/* Danh sách */}
        <div className="p-3 space-y-3">
          <div className="flex justify-between items-center px-1">
            <span className="text-[11px] text-gray-500">Bảng điều khiển đơn Chợ Số Kim Sơn</span>
            <button
                onClick={fetchOrders}
                className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 active:scale-95"
            >
              ↻ Làm mới
            </button>
          </div>

          {loading ? (
              <div className="text-center text-xs text-gray-400 py-12">Đang tải đơn hàng...</div>
          ) : filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                  <div
                      key={order.id}
                      className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-100 flex flex-col space-y-2"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <div className="flex items-center space-x-1.5">
                        <span className="text-xs font-bold text-gray-800">Mã: #{order.order_code}</span>
                      </div>
                      <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              order.status === 'delivering'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                          }`}
                      >
                  {order.status === 'delivering' ? '⏳ Đang giao hàng' : '✓ Đã hoàn thành'}
                </span>
                    </div>

                    {/* Thông tin khách hàng */}
                    <div className="bg-gray-50 p-2.5 rounded-xl text-xs space-y-1 text-gray-700">
                      <p>👤 <strong>Khách hàng:</strong> {order.customer_name || 'Khách vãng lai'}</p>
                      <p>📞 <strong>SĐT:</strong> <a href={`tel:${order.customer_phone}`} className="text-blue-600 underline font-semibold">{order.customer_phone}</a></p>
                      <p>📍 <strong>Địa chỉ:</strong> {order.customer_address}</p>
                      {order.note && <p className="text-gray-500 italic">📝 Ghi chú: {order.note}</p>}
                    </div>

                    {/* Chi tiết món */}
                    <div className="py-1">
                      <p className="font-semibold text-xs text-gray-900 leading-snug">
                        🛍️ {order.items_detail}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        📅 {new Date(order.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>

                    {/* Thao tác */}
                    <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                      <div>
                        <span className="text-[11px] text-gray-500">Tổng: </span>
                        <span className="text-sm font-extrabold text-red-600">
                    {Number(order.total_price).toLocaleString('vi-VN')} đ
                  </span>
                      </div>
                      <button
                          onClick={() => handleUpdateStatus(order.id, order.status)}
                          className={`text-[11px] font-bold px-3 py-1.5 rounded-xl shadow active:scale-95 transition-all ${
                              order.status === 'delivering'
                                  ? 'bg-emerald-700 text-white'
                                  : 'bg-gray-200 text-gray-700'
                          }`}
                      >
                        {order.status === 'delivering' ? 'Chuyển Đã Giao ✓' : 'Đặt lại Đang giao'}
                      </button>
                    </div>
                  </div>
              ))
          ) : (
              <div className="text-center text-gray-400 text-xs py-16">
                <span className="text-4xl mb-2 block">📑</span>
                Chưa có đơn hàng nào
              </div>
          )}
        </div>
      </Page>
  );
};

export default OrderPage;