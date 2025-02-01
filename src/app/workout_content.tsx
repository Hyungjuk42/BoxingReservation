import React, { useCallback } from "react";
import { useState, useEffect, useRef } from "react";

import {
  dbGetScheduleList,
  dbDeleteWorkoutSchedule,
  dbDeleteDefaultSchedule,
  dbDeleteDefaultWorkoutName,
  dbGetDefaultScheduleList,
  dbGetDefaultWorkoutName,
  dbDeleteOldDates,
} from "@/app/api/supabase_api";

import { Schedule } from "@/app/interfaces/interfaces";

import { getDateForm2Date } from "./reservation_content";
import Button from "@/app/components/ui/button_location";
import ReactCalendar from "@/app/components/ui/react_calendar";
import AddWorkoutBtn from "@/app/components/ui/add_workout_btn";
import AddWorkoutsBtn from "@/app/components/ui/add_workouts_btn";
import WorkoutManage from "./components/workout_manage";
import { locations } from "@/app/constants/data";

const getTime2Date = (dateString: string): string | null => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getTime2Time = (timeString: string): string | null => {
  if (!timeString) return null;
  const match = timeString.match(/^(\d{1,2}:\d{2})/);
  return match ? match[1] : null;
};

const WorkoutContent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedLocation, setSelectedLocation] = useState<number>(
    locations.length === 0 ? -1 : 0
  );

  const scheduleListRef = useRef<Array<Schedule>>([]);
  const defaultScheduleListRef = useRef<Array<Schedule>>([]);

  const [dayScheduleList, setDayScheduleList] = useState<Array<Schedule>>([]);

  const getDayScheduleList = useCallback(async () => {
    const res = await dbGetScheduleList(getDateForm2Date(selectedDate));
    if (res && !(res instanceof Error)) {
      scheduleListRef.current = res.sort((a, b) => {
        return (
          new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
        );
      });
    }
    setDayScheduleList(
      scheduleListRef.current.filter(
        (schedule: Schedule) => selectedLocation + 1 === schedule.location_id
      )
    );
  }, [selectedDate, selectedLocation]);

  const [dayDefaultScheduleList, setDayDefaultScheduleList] = useState<
    Array<Schedule>
  >([]);

  const [defaultScheduleListName, setDefaultScheduleListName] = useState<
    Array<Schedule>
  >([]);

  const getDefaultScheduleList = useCallback(async () => {
    const res = await dbGetDefaultScheduleList();
    if (res && !(res instanceof Error)) {
      defaultScheduleListRef.current = res.sort((a, b) => {
        return a.start_time > b.start_time
          ? 1
          : a.start_time < b.start_time
          ? -1
          : 0;
      });
    }
    setDayDefaultScheduleList(
      defaultScheduleListRef.current.filter(
        (schedule: Schedule) =>
          (selectedLocation ?? -1) + 1 === schedule.location_id
      )
    );
  }, [selectedLocation]);

  const getDefaultScheduleListName = useCallback(async () => {
    const res = await dbGetDefaultWorkoutName();
    if (res && !(res instanceof Error)) {
      setDefaultScheduleListName(res);
    }
  }, []);

  const deleteWorkoutsNReservationsBeforeMonths = async (months: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    await dbDeleteOldDates(
      "reservations",
      "reserved_at",
      getDateForm2Date(date)
    );
    await dbDeleteOldDates("workouts", "workout_date", getDateForm2Date(date));
  };

  useEffect(() => {
    getDefaultScheduleList();
    getDefaultScheduleListName();
    // Delete old data before 12 months
    deleteWorkoutsNReservationsBeforeMonths(12);
  }, [getDefaultScheduleList, getDefaultScheduleListName]);

  useEffect(() => {
    getDayScheduleList();
  }, [selectedDate, getDayScheduleList]);

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
      <div
        style={{ height: "calc(100vh - 6.5rem)" }}
        className="flex flex-col items-center w-1/3 px-4 my-4 border-r-2 border-solid border-gray-200 overflow-y-scroll no-scrollbar"
      >
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
      <div
        style={{ height: "calc(100vh - 6.5rem)" }}
        className="flex flex-col w-1/3 px-4 my-4 border-r-2 border-solid border-gray-200"
      >
        <WorkoutManage
          title="운동 스케줄"
          scheduleList={dayScheduleList}
          getTime={getTime2Date}
          height="calc(100vh - 12rem)"
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
            default={3}
          >
            운동 추가
          </AddWorkoutBtn>
        </WorkoutManage>
      </div>
      <div
        style={{ height: "calc(100vh - 6.5rem)" }}
        className="flex flex-col w-1/3 px-4 my-4 border-r-2 border-solid border-gray-200"
      >
        <WorkoutManage
          title="기본 운동 시간"
          scheduleList={dayDefaultScheduleList}
          getTime={getTime2Time}
          height="calc(50vh - 10rem)"
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
            default={2}
          >
            운동 시간 추가
          </AddWorkoutBtn>
        </WorkoutManage>
        <WorkoutManage
          title="기본 운동 이름"
          scheduleList={defaultScheduleListName}
          getTime={getTime2Time}
          height="calc(50vh - 10rem)"
          handleDeleteSchedule={(schedule: Schedule) => {
            dbDeleteDefaultWorkoutName(schedule.id).then((res) => {
              if (res) {
                setDefaultScheduleListName(
                  defaultScheduleListName.filter(
                    (defaultSchedule: Schedule) =>
                      defaultSchedule.id !== schedule.id
                  )
                );
              }
            });
          }}
        >
          <AddWorkoutBtn
            date={selectedDate}
            location={selectedLocation + 1}
            rerender={getDefaultScheduleListName}
            default={1}
          >
            운동 이름 추가
          </AddWorkoutBtn>
        </WorkoutManage>
        <AddWorkoutsBtn
          location={selectedLocation + 1}
          workouts={dayDefaultScheduleList}
          workoutName={defaultScheduleListName}
          rerender={getDayScheduleList}
        >
          운동 배치하기
        </AddWorkoutsBtn>
      </div>
    </div>
  );
};

export default WorkoutContent;
