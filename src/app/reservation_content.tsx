import React from "react";
import { useState, useEffect, useRef } from "react";

import {
  dbGetScheduleList,
  dbGetAttendanceList,
  dbUpdateReservationsAttendance,
} from "@/app/api/supabase_api";

import Button from "@/app/components/ui/button";
import ButtonSm from "@/app/components/ui/button_sm";
import ReactCalendar from "@/app/components/ui/react_calendar";

import { Attendee, Schedule } from "@/app/interfaces/interfaces";

import { locations } from "@/app/constants/data";

const getTime2Date = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getDateForm2Date = (date: Date) => {
  return date.toLocaleDateString("en-CA");
};

const ReservationContent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedLocation, setSelectedLocation] = useState<number>(
    locations.length === 0 ? -1 : 0
  );

  const scheduleListRef = useRef<Array<Schedule>>([]);

  const [selectedSchedule, setSelectedSchedule] = useState<Schedule>({
    id: "",
    location_id: 0,
    start_time: "",
    workout_name: "",
  });

  const [dayScheduleList, setDayScheduleList] = useState<Array<Schedule>>([]);
  const [attendance, setAttendance] = useState<Array<Attendee>>([]);

  useEffect(() => {
    (async () => {
      const res = await dbGetScheduleList(getDateForm2Date(selectedDate));
      if (res && !(res instanceof Error)) {
        scheduleListRef.current = res;
      }
      setDayScheduleList(
        scheduleListRef.current.filter(
          (schedule: Schedule) => selectedLocation + 1 === schedule.location_id
        )
      );
      setAttendance([]);
    })();
  }, [selectedDate]);

  useEffect(() => {
    setDayScheduleList(
      scheduleListRef.current.filter(
        (schedule: Schedule) => selectedLocation + 1 === schedule.location_id
      )
    );
    setAttendance([]);
  }, [selectedLocation]);

  useEffect(() => {
    setSelectedSchedule(
      dayScheduleList[0] ?? {
        id: "",
        location_id: 0,
        start_time: "",
        workout_name: "",
      }
    );
    if (dayScheduleList.length > 0) {
      (async () => {
        const idList = await dbGetAttendanceList(dayScheduleList[0].id);
        setAttendance(idList);
      })();
    } else {
      setAttendance([]);
    }
  }, [dayScheduleList]);

  const handleSelectSchedule = (selectedSchedule: Schedule) => {
    setSelectedSchedule(selectedSchedule);
    if (dayScheduleList.length > 0) {
      const schedule = dayScheduleList.find(
        (schedule: Schedule) =>
          schedule.start_time === selectedSchedule.start_time
      );
      if (schedule) {
        (async () => {
          const idList = await dbGetAttendanceList(schedule.id);
          setAttendance(idList);
        })();
      }
    }
  };

  const toggleAttendance = (attendee: Attendee, index: number) => {
    const item = { ...attendee, attendance: !attendee.attendance };
    dbUpdateReservationsAttendance(item.id, item.attendance);
    setAttendance([
      ...attendance.slice(0, index),
      item,
      ...attendance.slice(index + 1),
    ]);
  };

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
        className="w-1/3 px-4 my-4 border-r-2 border-solid border-gray-200"
      >
        <h2 className="text-xl font-bold mb-4">운동 스케줄</h2>
        {scheduleListRef.current.length > 0 ? (
          <ul
            style={{ height: "calc(100vh - 9rem)" }}
            className="space-y-2 overflow-y-scroll no-scrollbar"
          >
            {dayScheduleList.map((schedule: Schedule, index: number) => (
              <li
                key={index}
                className={`p-2 border border-solid rounded cursor-pointer hover:bg-gray-100 ${
                  schedule.start_time === selectedSchedule.start_time
                    ? "border-primary-500 border-[2px]"
                    : "border-gray-300"
                }`}
                onClick={() => handleSelectSchedule(schedule)}
              >
                <p className="py-1 text-xl font-semibold">
                  {getTime2Date(new Date(schedule.start_time))}
                </p>
                <p className="text-lg">{schedule.workout_name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>선택된 날짜에 스케줄이 없습니다.</p>
        )}
      </div>
      <div className="w-1/3 px-4 my-4">
        <h2 className="text-xl font-bold mb-4">출석 관리</h2>
        {selectedSchedule ? (
          <ul
            style={{ height: "calc(100vh - 9rem)" }}
            className="space-y-2 overflow-y-scroll no-scrollbar"
          >
            {attendance.map((attendee: Attendee, index: number) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b border-solid border-gray-200"
              >
                <span>{attendee.name}</span>
                <ButtonSm
                  handleClick={() => toggleAttendance(attendee, index)}
                  clicked={attendee.attendance}
                >
                  {attendee.attendance ? "출석 완료" : "출석"}
                </ButtonSm>
              </li>
            ))}
          </ul>
        ) : (
          <p>스케줄을 선택하세요.</p>
        )}
      </div>
    </div>
  );
};

export default ReservationContent;
