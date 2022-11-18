import { Fragment } from 'react'
import { Link, useNavigate } from "react-router-dom";
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { auth } from '../config/firebase';
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import Logo from '../assets/logo.svg';
import CupLogo from '../assets/logo-cup.svg';

function isCurrent(route: String) { return window.location.pathname === route ? true : false; }

const navigation = [
  { name: 'Leaderboard', href: '/' },
  { name: 'Matches', href: '/matches' },
  { name: 'Rules',   href: '/rules' }
]

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

function logout() {
  signOut(auth).then(() => {
    // Something
  }).catch((error) => {
    // An error happened.
  });
}

const Navbar = () => {
  const user = useAuth()?.user;
  const userName = useAuth()?.userName;
  const navigate = useNavigate();
  
  return (
    <Disclosure as="nav" className="bg-gradient-to-r from-[#c6004c] to-[#7d1d50] fixed w-full z-20 top-0 left-0">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#810532] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img
                    className="block lg:hidden h-8 w-auto"
                    src={CupLogo}
                    alt="World Cup Pool"
                  />
                  <img
                    className="hidden lg:block h-8 w-auto"
                    src={Logo}
                    alt="World Cup Pool"
                  />
                </div>
                <div className="hidden sm:block sm:ml-6">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={classNames(
                          isCurrent(item.href) ? 'bg-[#65113e] text-white' : 'text-gray-300 hover:bg-[#810532] hover:text-white',
                          'px-3 py-2 rounded-md text-sm font-medium'
                        )}
                        aria-current={isCurrent(item.href) ? 'page' : undefined}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                {user && (
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src={user.photoURL || ''}
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/user/${userName}`}
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-[#450524]')}
                            >
                              My predictions
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={logout}
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm w-full text-left text-[#450524]')}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                )}
                {!user && (
                  <Link className="text-gray-300 hover:bg-[#810532] hover:text-white px-3 py-2 rounded-md text-sm font-medium" to="/signin">Sign In</Link>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href="#"
                  onClick={() => navigate(item.href)}
                  className={classNames(
                    isCurrent(item.href) ? 'bg-[#65113e] text-white' : 'text-gray-300 hover:bg-[#810532] hover:text-white',
                    'block px-3 py-2 rounded-md text-base font-medium'
                  )}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}

export default Navbar;
