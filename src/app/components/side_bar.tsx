"use client";

import React from "react";
import { useSectionContext } from "@/app/context/section_context";
import Image from "next/image";

interface SideBarBtnProps {
  section: string;
  text: string;
  iconSrc: string;
}

const SideBarBtn: React.FC<SideBarBtnProps> = (props: SideBarBtnProps) => {
  const { section, setSection } = useSectionContext();

  function handleSideBarClick(section: string) {
    setSection(section);
  }

  return (
    <li>
      <button
        onClick={() => handleSideBarClick(props.section)}
        className={`flex items-center text-left transition-colors w-full p-4 hover:text-primary-600
        ${
          section === props.section
            ? "font-bold text-primary-600"
            : "text-gray-600"
        }`}
      >
        <Image
          className="pr-2"
          src={
            section === props.section
              ? `/icon/${props.iconSrc}_primary.svg`
              : `/icon/${props.iconSrc}.svg`
          }
          alt="Icon"
          width={24}
          height={24}
        />
        <span className="hidden lg:block">{props.text}</span>
      </button>
    </li>
  );
};

const SideBar: React.FC = () => {
  const sideBarInfo = [
    {
      section: "reservation",
      text: "예약 관리",
      iconSrc: "calendar",
    },
    {
      section: "workout_management",
      text: "운동 관리",
      iconSrc: "muscle",
    },
    {
      section: "user_management",
      text: "유저 관리",
      iconSrc: "user2",
    },
    // {
    //   section: "setting",
    //   text: "설정",
    //   iconSrc: "setting",
    // },
  ];

  return (
    <aside className="w-16 xl:w-64 lg:w-40 bg-primary-100 xl:p-4 lg:p-2">
      <nav>
        <ul className="space-y-2">
          {sideBarInfo.map((info) => (
            <SideBarBtn
              key={info.section}
              section={info.section}
              text={info.text}
              iconSrc={info.iconSrc}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
