import React from 'react';
import { Page, Header, Box, Text, Icon } from 'zmp-ui';

const ProfilePage: React.FC = () => {
  return (
      <Page className="bg-[#f5f7fa] min-h-screen pb-24 select-none">
        {/* 1. Header */}
        <Header
            title="Tài Khoản"
            showBackIcon={false}
            className="bg-emerald-800 text-white font-bold"
        />

        {/* 2. Thẻ hồ sơ người dùng */}
        <div className="bg-gradient-to-br from-emerald-800 to-teal-700 text-white px-4 pt-4 pb-8 rounded-b-[24px] shadow-md">
          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl shadow-inner">
              👤
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-extrabold text-base">Khách Hàng Kim Sơn</h2>
                <span className="bg-amber-400 text-emerald-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                Thành viên
              </span>
              </div>
              <p className="text-xs text-emerald-100 opacity-90 mt-0.5">Ninh Bình, Việt Nam</p>
            </div>
          </div>
        </div>

        {/* 3. Thẻ thống kê nhanh */}
        <div className="px-4 -mt-5">
          <div className="bg-white rounded-2xl p-3 shadow-md border border-gray-100 grid grid-cols-3 divide-x divide-gray-100 text-center">
            <div>
              <p className="font-extrabold text-sm text-emerald-700">0</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Mã giảm giá</p>
            </div>
            <div>
              <p className="font-extrabold text-sm text-emerald-700">120</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Điểm tích lũy</p>
            </div>
            <div>
              <p className="font-extrabold text-sm text-emerald-700">3</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Đã mua</p>
            </div>
          </div>
        </div>

        {/* 4. Nhóm tiện ích mua sắm */}
        <div className="p-4 space-y-3">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            <button className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-sm font-bold">
                  📍
                </div>
                <span className="text-xs font-semibold text-gray-800">Sổ địa chỉ giao hàng</span>
              </div>
              <span className="text-gray-300 text-xs">›</span>
            </button>

            <button className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm font-bold">
                  🎁
                </div>
                <span className="text-xs font-semibold text-gray-800">Ưu đãi & Khuyến mãi chợ</span>
              </div>
              <span className="text-gray-300 text-xs">›</span>
            </button>
          </div>

          {/* 5. Khối dành cho Nhà Vườn / Hộ kinh doanh */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-3.5 border border-emerald-100 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🏪</div>
              <div>
                <p className="font-bold text-xs text-emerald-900">Bạn là nhà vườn / cơ sở sản xuất?</p>
                <p className="text-[10px] text-emerald-700 mt-0.5">Đăng ký mở gian hàng trên Chợ Số</p>
              </div>
            </div>
            <button className="bg-emerald-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow active:scale-95 transition-transform">
              Đăng ký
            </button>
          </div>

          {/* 6. Hỗ trợ & Thông tin chợ */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
            <button className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-bold">
                  📞
                </div>
                <span className="text-xs font-semibold text-gray-800">Hotline hỗ trợ Kim Sơn</span>
              </div>
              <span className="text-gray-400 text-xs font-semibold">1900 xxxx</span>
            </button>

            <button className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm font-bold">
                  ℹ️
                </div>
                <span className="text-xs font-semibold text-gray-800">Giới thiệu Chợ Số Kim Sơn</span>
              </div>
              <span className="text-gray-300 text-xs">›</span>
            </button>
          </div>
        </div>
      </Page>
  );
};

export default ProfilePage;