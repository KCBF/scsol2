
import React from "react";
import { Link } from "react-router-dom";
import RoleToggle from "./RoleToggle";
import { useRole } from "@/context/RoleContext";
import SolanaWalletButton from "./SolanaWalletButton";

const Header: React.FC = () => {
  const { role } = useRole();
  
  return (
    <header className="relative w-full max-w-[1108px] flex flex-col md:flex-row items-center justify-between px-4 sm:px-8 rounded-[100px] bg-transparent md:px-0 py-0">
      {/* Logo */}
      <div className="flex min-h-[74px] flex-col overflow-hidden items-center justify-center w-full md:w-2/3">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/41eabf16-1325-4f4a-95ab-5d4c4f39e2e9.png" 
            alt="Cake Slice Logo" 
            className="w-8 h-8 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-800">VOCAKE</h1>
        </Link>
      </div>

      {/* Right section - Role Toggle and Connect Button */}
      <div className="flex justify-center md:justify-end items-center gap-4 w-full md:w-1/3">
        {role && <RoleToggle />}
        <SolanaWalletButton />
      </div>
    </header>
  );
};

export default Header;
