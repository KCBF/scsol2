import React from "react";
import { Link } from "react-router-dom";
import RoleToggle from "./RoleToggle";
import { useRole } from "@/context/RoleContext";
import SolanaWalletButton from "./SolanaWalletButton";

const Header: React.FC = () => {
  const { role } = useRole();
  
  return (
    <header className="relative w-full max-w-[1108px] flex flex-wrap md:flex-nowrap items-center justify-between px-4 sm:px-8 rounded-[100px] bg-transparent md:px-0 py-0 gap-4 md:gap-8">
      {/* Logo */}
      <div className="flex min-h-[74px] flex-row items-center justify-start w-full md:w-auto gap-3 md:gap-4">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/studycake.png" 
            alt="StudyCake Logo" 
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* Right section - Role Toggle and Connect Button */}
      <div className="flex flex-row flex-wrap md:flex-nowrap justify-center md:justify-end items-center gap-4 w-full md:w-auto">
        {role && <RoleToggle />}
        <div className="ml-0 md:ml-4 mt-4 md:mt-0">
          <SolanaWalletButton color="#A347E7" />
        </div>
      </div>
    </header>
  );
};

export default Header;
