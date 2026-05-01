// 1. Import Dependencies
import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Make sure you have this utility function

// 2. Define Prop Types
interface NavItem {
  icon?: React.ReactNode;
  label: string;
  href: string;
  isSeparator?: boolean; // Optional separator for grouping items
}

interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

interface UserProfileSidebarProps {
  user: UserProfile;
  navItems: NavItem[];
  logoutItem: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  };
  settingsItem?: NavItem;
  onItemClick?: () => void;
  className?: string;
}

// 3. Define Animation Variants
const sidebarVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 15,
    },
  },
};

// 4. Create the Component
export const UserProfileSidebar = React.forwardRef<HTMLDivElement, UserProfileSidebarProps>(
  ({ user, navItems, logoutItem, settingsItem, onItemClick, className }, ref) => {
    return (
      <motion.aside
        ref={ref}
        className={cn(
          'flex h-full w-full max-w-xs flex-col rounded-xl border bg-[#F6F6F6] p-4 text-card-foreground shadow-sm',
          className
        )}
        style={{ fontFamily: "'Sequel Sans', 'Helvetica Neue', Arial, sans-serif" }}
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
        aria-label="User Profile Menu"
      >
        {/* User Info Header */}
        <motion.div variants={itemVariants} className="flex items-center space-x-4 p-2">
          <img
            src={user.avatarUrl}
            alt={`${user.name}'s avatar`}
            className="h-12 w-12 rounded-full object-cover"
          />
          <div className="flex flex-col truncate">
            <span className="font-semibold text-lg">{user.name}</span>
            <span className="text-sm text-muted-foreground truncate">{user.email}</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="my-4 border-t border-border" />

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1" role="navigation">
          {navItems.map((item, index) => (
            <React.Fragment key={index}>
              {item.isSeparator && <motion.div variants={itemVariants} className="h-6" />}
              <motion.div variants={itemVariants}>
                <Link
                  to={item.href}
                  onClick={onItemClick}
                  className="group flex items-center rounded-md px-3.5 py-3 text-base font-medium text-[#010101] transition-colors hover:bg-black/5"
                >
                  {item.icon && <span className="mr-3 h-5 w-5">{item.icon}</span>}
                  <span>{item.label}</span>
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              </motion.div>
            </React.Fragment>
          ))}
        </nav>

        {/* Bottom Actions */}
        <motion.div variants={itemVariants} className="mt-auto pt-6 space-y-1">
          {settingsItem && (
            <Link
              to={settingsItem.href}
              onClick={onItemClick}
              className="group flex w-full items-center rounded-md px-3.5 py-3 text-base font-bold text-[#010101] transition-colors hover:bg-black/5"
            >
              {settingsItem.icon && <span className="mr-3 h-5 w-5">{settingsItem.icon}</span>}
              <span>{settingsItem.label}</span>
              <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          )}
          <button
            onClick={() => {
              onItemClick?.();
              logoutItem.onClick();
            }}
            className="group flex w-full items-center rounded-md px-3.5 py-3 text-base font-bold text-destructive transition-colors hover:bg-destructive/10"
          >
            {logoutItem.icon && <span className="mr-3 h-5 w-5">{logoutItem.icon}</span>}
            <span>{logoutItem.label}</span>
          </button>
        </motion.div>
      </motion.aside>
    );
  }
);

UserProfileSidebar.displayName = 'UserProfileSidebar';
