"use client";

import React from "react";

import TopNavBar from "@/app/components/top_nav_bar";
import SideBar from "@/app/components/side_bar";

import ReservationContent from "@/app/reservation_content";
import {
  useSectionContext,
  SectionContextProvider,
} from "@/app/context/section_context";
import { axiosGetHolidayList } from "@/app/api/supabase_api";
import WorkoutContent from "@/app/workout_content";

function renderWorkoutManagementContent() {
  return <>Workout Management</>;
}

function renderUserManagementContent() {
  return <>User Management</>;
}

function renderSettingsContent() {
  return <>Settings</>;
}

const Home: React.FC = () => {
  const { section, setSection } = useSectionContext();

  return (
    <div className="flex flex-col h-screen">
      <TopNavBar />
      <div className="flex flex-1">
        <SideBar />
        <div className="flex-1">
          {section === "reservation" && <ReservationContent />}
          {section === "workout_management" && <WorkoutContent />}
          {section === "user_management" && renderUserManagementContent()}
          {section === "setting" && renderSettingsContent()}
        </div>
      </div>
    </div>
  );
};

const HomeWrapper: React.FC = () => {
  return (
    <SectionContextProvider>
      <Home />
    </SectionContextProvider>
  );
};

export default HomeWrapper;
