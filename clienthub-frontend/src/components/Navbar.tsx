import React, { useMemo, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import CurrencySelector from './CurrencySelector';

type NavItem = {
  to: string;
  label: string;
};

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const items = useMemo<NavItem[]>(
    () => [
      { to: '/dashboard', label: 'Дашборд' },
      { to: '/clients', label: 'Клиенты' },
      { to: '/calendar', label: 'Календарь' },
      ...(user?.role === 'admin' ? [{ to: '/admin', label: 'Админ' }] : []),
      { to: '/profile', label: 'Профиль' },
      { to: '/settings', label: 'Настройки' },
    ],
    [user?.role]
  );

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      'inline-flex items-center rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300',
      isActive
        ? 'bg-white/90 text-primary-600 shadow-md scale-105'
        : 'text-muted hover:bg-white/70 hover:text-app hover:scale-105',
    ].join(' ');

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
      },
    },
    visible: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  };

  const mobileItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.header
      className="surface sticky top-0 z-40 rounded-none border-x-0 border-t-0"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/dashboard" className="flex min-w-0 items-center gap-3 group">
          <motion.div
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-secondary-600 text-sm font-bold text-white shadow-glow-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            NP
          </motion.div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-app group-hover:text-primary transition-colors">
              Neuro Protocol
            </div>
            <div className="truncate text-xs text-muted">CRM workspace</div>
          </div>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          {items.map((item, index) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
            >
              <NavLink to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="hidden items-center gap-3 lg:flex"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <CurrencySelector />
          <ProfileDropdown />
        </motion.div>

        <motion.button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-app text-app lg:hidden hover:bg-surface transition-colors"
          aria-label="Открыть меню"
          aria-expanded={mobileOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            {mobileOpen ? (
              <motion.path
                d="M6 6l12 12M18 6L6 18"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            ) : (
              <motion.path
                d="M4 7h16M4 12h16M4 17h16"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </svg>
        </motion.button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mx-4 mb-4 rounded-2xl border border-app glass p-4 shadow-xl lg:hidden overflow-hidden"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <div className="grid gap-1">
              {items.map((item) => (
                <motion.div key={item.to} variants={mobileItemVariants}>
                  <NavLink
                    to={item.to}
                    className={linkClass}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-3 flex items-center justify-between gap-3 border-t border-app pt-3"
              variants={mobileItemVariants}
            >
              <CurrencySelector />
              <ProfileDropdown />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Navbar;
