import React from "react";
import { useState, useEffect } from "react";
import { dbDeleteUser, dbGetUserList } from "./api/supabase_api";
import { User } from "@/app/interfaces/interfaces";

import DeleteButtonSm from "@/app/components/ui/delete_button_sm";
import { Button } from "@/components/ui/button";

const UserContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<Array<User>>([]);

  const getCurrentUser = async () => {
    const userList = (await dbGetUserList()) as Array<User>;
    setUsers(userList);
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-bold mb-4">유저 정보</h2>
      <input
        className="mb-4 space-y-2"
        placeholder="유저 검색"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <ul
        style={{ height: "calc(100vh - 12rem)" }}
        className="space-y-2 overflow-y-scroll no-scrollbar"
      >
        {filteredUsers.map((user) => (
          <li
            key={user.id}
            className="p-2 border border-solid border-gray-300 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p>email: {user.email}</p>
              <p>전화번호: {user.phone}</p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                dbDeleteUser(user.id).then((res) => {
                  if (res) {
                    setUsers(users.filter((item) => item.id !== user.id));
                  }
                });
              }}
            >
              계정 삭제
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserContent;
