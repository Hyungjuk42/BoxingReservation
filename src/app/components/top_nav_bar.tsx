import React from "react";
import Image from "next/image";

export default function TopNavBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b-2 border-solid border-gray-200">
      <div>
        <Image
          width={120}
          height={40}
          className="h-14"
          src="/logo/logo.jpg"
          alt="Logo"
        />
      </div>
      <div>
        <Image
          width={40}
          height={40}
          className="h-10"
          src="/icon/user.svg"
          alt="UserIcon"
        />
      </div>
    </nav>
  );
}
