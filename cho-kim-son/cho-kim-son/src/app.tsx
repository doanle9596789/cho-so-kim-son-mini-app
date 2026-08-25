import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App, ZMPRouter, SnackbarProvider, Text, Box, BottomNavigation, Icon } from 'zmp-ui';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import HomePage from '@/pages/HomePage';
import ScholarshipPage from '@/pages/ScholarshipPage';
import CategoryPage from '@/pages/CategoryPage';
import ProfilePage from '@/pages/ProfilePage';
import ShortcutsPage from '@/pages/ShortcutsPage';
import DepartmentDetailPage from '@/pages/DepartmentDetailPage';
import NewsDetailPage from '@/pages/NewsDetailPage';
import SchedulePage from '@/pages/SchedulePage';
import { navigateTab, getNavigationDirection } from '@/utils/navigation';
import Header from '@/components/Header';
import { PATHS, PATH_TO_TAB } from '@/constants/paths';

const queryClient = new QueryClient();

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const direction = getNavigationDirection();
  const activeTab = PATH_TO_TAB[location.pathname] || 'home';

  const handleTabChange = (key: string): void => {
    navigateTab(navigate, activeTab, key);
  };

  return (
      <div className="flex flex-col h-screen">
        {!PATH_TO_TAB[location.pathname] ? <div></div> : <Header variant="logo" />}
        <TransitionGroup
            className={`page-transition-group flex-1 ${
                direction === 'forward' ? 'slide-forward' : 'slide-backward'
            }`}
        >
          <CSSTransition key={location.pathname} classNames="page" timeout={300}>
            <Routes location={location}>
              <Route path={PATHS.HOME} element={<HomePage />} />
              <Route path={PATHS.SCHOLARSHIP} element={<ScholarshipPage />} />
              <Route path={PATHS.CATEGORY} element={<CategoryPage />} />
              <Route path={PATHS.PROFILE} element={<ProfilePage />} />
              <Route path={PATHS.SHORTCUTS} element={<ShortcutsPage />} />
              <Route path={PATHS.DEPARTMENT_DETAIL} element={<DepartmentDetailPage />} />
              <Route path={PATHS.NEWS_DETAIL} element={<NewsDetailPage />} />
              <Route path={PATHS.SCHEDULE} element={<SchedulePage />} />
              <Route
                  path="*"
                  element={
                    <Box p={4}>
                      <Text>Page Not Found</Text>
                    </Box>
                  }
              />
            </Routes>
          </CSSTransition>
        </TransitionGroup>

        {/* Menu đáy Chợ Số Kim Sơn */}
        {PATH_TO_TAB[location.pathname] && (
            <BottomNavigation
                fixed
                activeKey={activeTab}
                onChange={handleTabChange}
                className="z-50 bg-white border-t border-gray-200 shadow-lg"
            >
              <BottomNavigation.Item
                  key="home"
                  label="Trang chủ"
                  icon={<Icon icon="zi-home" />}
                  activeIcon={<Icon icon="zi-home" className="text-emerald-700" />}
              />
              <BottomNavigation.Item
                  key="category"
                  label="Gian hàng"
                  icon={<Icon icon="zi-more-grid" />}
                  activeIcon={<Icon icon="zi-more-grid" className="text-emerald-700" />}
              />
              <BottomNavigation.Item
                  key="scholarship"
                  label="Đơn mua"
                  icon={<Icon icon="zi-inbox" />}
                  activeIcon={<Icon icon="zi-inbox" className="text-emerald-700" />}
              />
              <BottomNavigation.Item
                  key="profile"
                  label="Cá nhân"
                  icon={<Icon icon="zi-user" />}
                  activeIcon={<Icon icon="zi-user" className="text-emerald-700" />}
              />
            </BottomNavigation>
        )}
      </div>
  );
};

const MyApp: React.FC = () => {
  return (
      <QueryClientProvider client={queryClient}>
        <App>
          <SnackbarProvider>
            <ZMPRouter>
              <AnimatedRoutes />
            </ZMPRouter>
          </SnackbarProvider>
        </App>
      </QueryClientProvider>
  );
};

export default MyApp;