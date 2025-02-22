// D:\PH-Assignments\Job-Task\task-management\src\components\shared\Navbar.jsx

import React, { useState } from "react";
import { useAuth } from "../../AuthProvider";
import AuthModal from "../AuthModal";

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const profileImage = user?.photoURL || "/default-avatar.jpg"; 

  return (
    <div>
      <header className="bg-cyan-600 shadow px-5 lg:px-32">
        <div className="max-w-7xl mx-auto md:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">
              Task Board
            </h1>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onClick={toggleDropdown}
                  />
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <div className="py-2">
                        <span className="block px-4 py-2 text-gray-700">
                          {user.displayName}
                        </span>
                        <button
                          onClick={() => {
                            logout();
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Log out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <span>Log in</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>
      {isModalOpen && <AuthModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Navbar;
