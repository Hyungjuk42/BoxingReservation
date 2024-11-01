import React from "react";
import { useState, useEffect, useRef } from "react";

import {
  dbGetScheduleList,
  dbDeleteWorkoutSchedule,
  dbDeleteDefaultSchedule,
  dbGetDefaultScheduleList,
} from "@/app/api/supabase_api";

import { Schedule } from "@/app/interfaces/interfaces";

import Button from "@/app/components/ui/button";
import ReactCalendar from "@/app/components/ui/react_calendar";
import AddWorkoutBtn from "@/app/components/ui/add_workout_btn";
import AddWorkoutsBtn from "@/app/components/ui/add_workouts_btn";
import WorkoutManage from "./components/workout_manage";

const getTime2Date = (dateString: string): string | null => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getTime2Time = (timeString: string): string | null => {
  const match = timeString.match(/^(\d{1,2}:\d{2})/);
  return match ? match[1] : null;
};

const getDateForm2Date = (date: Date) => {
  return date.toLocaleDateString("en-CA");
};

const locations = ["교대 잽트레이닝", "역삼 잽트레이닝", "선릉 잽트레이닝"];

const WorkoutContent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedLocation, setSelectedLocation] = useState<number>(
    locations.length === 0 ? -1 : 0
  );

  const scheduleListRef = useRef<Array<Schedule>>([]);
  const defaultScheduleListRef = useRef<Array<Schedule>>([]);

  const [dayScheduleList, setDayScheduleList] = useState<Array<Schedule>>([]);

  const getDayScheduleList = async () => {
    const res = await dbGetScheduleList(getDateForm2Date(selectedDate));
    if (res && !(res instanceof Error)) {
      scheduleListRef.current = res;
    }
    setDayScheduleList(
      scheduleListRef.current.filter(
        (schedule: Schedule) => selectedLocation + 1 === schedule.location_id
      )
    );
  };

  const [dayDefaultScheduleList, setDayDefaultScheduleList] = useState<
    Array<Schedule>
  >([]);

  const getDefaultScheduleList = async () => {
    const res = await dbGetDefaultScheduleList();
    if (res && !(res instanceof Error)) {
      defaultScheduleListRef.current = res;
    }
    setDayDefaultScheduleList(
      defaultScheduleListRef.current.filter(
        (schedule: Schedule) =>
          (selectedLocation ?? -1) + 1 === schedule.location_id
      )
    );
  };

  useEffect(() => {
    getDefaultScheduleList();
  }, []);

  useEffect(() => {
    getDayScheduleList();
  }, [selectedDate]);

  useEffect(() => {
    setDayScheduleList(
      scheduleListRef.current.filter(
        (schedule: Schedule) => selectedLocation + 1 === schedule.location_id
      )
    );
    setDayDefaultScheduleList(
      defaultScheduleListRef.current.filter(
        (schedule: Schedule) =>
          (selectedLocation ?? -1) + 1 === schedule.location_id
      )
    );
  }, [selectedLocation]);

  return (
    <div className="flex h-full">
      <div className="flex flex-col items-center w-1/3 px-4 my-4 border-r-2 border-solid border-gray-200">
        <ReactCalendar date={selectedDate} setDate={setSelectedDate} />
        <div className="flex flex-col w-full items-center space-y-2">
          {selectedLocation !== null ? (
            locations.map((location, idx) => (
              <Button
                key={location}
                handleClick={() => setSelectedLocation(idx)}
                selected={locations[selectedLocation] === location}
              >
                {location}
              </Button>
            ))
          ) : (
            <h3 className="">추가된 도장 없음</h3>
          )}
        </div>
      </div>
      <div className="flex flex-col w-1/3 px-4 my-4 border-r-2 border-solid border-gray-200">
        <WorkoutManage
          title="운동 스케줄"
          scheduleList={dayScheduleList}
          getTime={getTime2Date}
          handleDeleteSchedule={(schedule) => {
            dbDeleteWorkoutSchedule(schedule.id).then((res) => {
              if (res) {
                scheduleListRef.current = scheduleListRef.current.filter(
                  (item: Schedule) => item.id !== schedule.id
                );
                setDayScheduleList(
                  scheduleListRef.current.filter(
                    (schedule: Schedule) =>
                      selectedLocation + 1 === schedule.location_id
                  )
                );
              }
            });
          }}
        >
          <AddWorkoutBtn
            date={selectedDate}
            location={selectedLocation + 1}
            rerender={getDayScheduleList}
            default={false}
          >
            운동 추가
          </AddWorkoutBtn>
        </WorkoutManage>
      </div>
      <div className="flex flex-col w-1/3 px-4 my-4 border-r-2 border-solid border-gray-200">
        <WorkoutManage
          title="기본 시간대"
          scheduleList={dayDefaultScheduleList}
          getTime={getTime2Time}
          handleDeleteSchedule={(schedule: Schedule) => {
            dbDeleteDefaultSchedule(schedule.id).then((res) => {
              if (res) {
                defaultScheduleListRef.current =
                  defaultScheduleListRef.current.filter(
                    (item: Schedule) => item.id !== schedule.id
                  );
                setDayDefaultScheduleList(
                  defaultScheduleListRef.current.filter(
                    (schedule: Schedule) =>
                      selectedLocation + 1 === schedule.location_id
                  )
                );
              }
            });
          }}
        >
          <AddWorkoutBtn
            date={selectedDate}
            location={selectedLocation + 1}
            rerender={getDefaultScheduleList}
            default={true}
          >
            운동 추가
          </AddWorkoutBtn>
        </WorkoutManage>
        <AddWorkoutsBtn
          location={selectedLocation + 1}
          rerender={getDefaultScheduleList}
          default={true}
        >
          운동 배치하기
        </AddWorkoutsBtn>
      </div>
    </div>
  );
};

export default WorkoutContent;
