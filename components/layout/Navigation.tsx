"use client";

import React, { Fragment, type RefObject } from "react";
import Link from "next/link";
import { Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

interface NavigationProps {
  onMenuClick?: () => void;
  showMenuButton?: boolean;
  menuButtonRef?: RefObject<HTMLButtonElement>;
  isSidebarOpen?: boolean;
}

export default function Navigation({
  onMenuClick,
  showMenuButton = true,
  menuButtonRef,
  isSidebarOpen = false,
}: NavigationProps) {
  return (
    <nav
      className="bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 sticky top-0 z-40"
      aria-label="Primary navigation"
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {showMenuButton && (
              <button
                ref={menuButtonRef}
                type="button"
                onClick={onMenuClick}
                aria-controls="primary-sidebar"
                aria-expanded={isSidebarOpen}
                aria-label="Toggle navigation menu"
                className="lg:hidden p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}
            <Link href="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500" />
              <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">App</span>
            </Link>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8" role="search">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-neutral-400" />
              </div>
              <input
                type="text"
                aria-label="Search the app"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="View notifications"
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <BellIcon className="h-6 w-6" />
            </button>

            <Menu as="div" className="relative">
              <Menu.Button
                type="button"
                aria-label="Account menu"
                className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <UserCircleIcon className="h-6 w-6" />
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active
                              ? "bg-neutral-100 dark:bg-neutral-700"
                              : "text-neutral-700 dark:text-neutral-300"
                          } block px-4 py-2 text-sm`}
                        >
                          Your Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active
                              ? "bg-neutral-100 dark:bg-neutral-700"
                              : "text-neutral-700 dark:text-neutral-300"
                          } block px-4 py-2 text-sm`}
                        >
                          Settings
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={`${
                            active
                              ? "bg-neutral-100 dark:bg-neutral-700"
                              : "text-neutral-700 dark:text-neutral-300"
                          } block px-4 py-2 text-sm`}
                        >
                          Sign out
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
}
