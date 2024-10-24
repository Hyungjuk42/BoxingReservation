import React from "react";

export default function TopNavBar() {
  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-white border-b-2 border-solid border-gray-200">
      <div>
        <img className="h-14" src="/logo/logo.jpg"></img>
      </div>
      <div>
        <img className="h-10" src="/icon/user.svg"></img>
      </div>
    </nav>
  );
}
