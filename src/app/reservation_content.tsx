import React from "react";
import { useState, useEffect, useRef } from "react";

import { format } from "date-fns";
import { ko } from "date-fns/locale";

import {
  dbGetScheduleList,
  dbGetAttendanceList,
  dbUpdateReservationsAttendance,
  dbUpdateReservationsFirstDate,
  dbUpdateReservationsRegistration,
} from "@/app/api/supabase_api";

import ButtonLoc from "@/app/components/ui/button_location";
import { Button } from "@/components/ui/button";
import ReactCalendar from "@/app/components/ui/react_calendar";

import { Attendee, Schedule } from "@/app/interfaces/interfaces";

import { locations } from "@/app/constants/data";

const getSortedAttendanceList = async (id: string) => {
  const idList = await dbGetAttendanceList(id);
  const newIdList = idList.sort((a, b) => {
    return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
  });
  return newIdList;
};

const getSortedDayScheduleList = (
  scheduleList: Array<Schedule>,
  locationId: number
) => {
  const filteredList = scheduleList.filter(
    (schedule: Schedule) => locationId + 1 === schedule.location_id
  );
  const sortedList = filteredList.sort((a, b) => {
    return a.start_time > b.start_time
      ? 1
      : a.start_time < b.start_time
      ? -1
      : 0;
  });
  return sortedList;
};

const getExpireDate = (date: Date) => {
  const expireDate = new Date(date);
  expireDate.setDate(expireDate.getDate() + 6);
  return expireDate;
};

const isExpiredDate = (date: Date | null) => {
  if (date === null) return false;
  const expireDate = getExpireDate(date);
  const today = new Date();
  const expireDateStr = getDateForm2Date(expireDate);
  const todayStr = getDateForm2Date(today);
  return expireDateStr < todayStr;
};

const getTime2Date = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

export const getDateForm2Date = (date: Date) => {
  return format(date, "yyyy-MM-dd", { locale: ko });
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
        getSortedDayScheduleList(scheduleListRef.current, selectedLocation)
      );
      setAttendance([]);
    })();
  }, [selectedDate, selectedLocation]);

  // useEffect(() => {
  //   setDayScheduleList(
  //     getSortedDayScheduleList(scheduleListRef.current, selectedLocation)
  //   );
  //   setAttendance([]);
  // }, [selectedLocation]);

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
        const idList = await getSortedAttendanceList(dayScheduleList[0].id);
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
          const idList = await getSortedAttendanceList(schedule.id);
          setAttendance(idList);
        })();
      }
    }
  };

  const toggleAttendance = (attendee: Attendee, index: number) => {
    let item = { ...attendee, attendance: !attendee.attendance };
    dbUpdateReservationsAttendance(item.id, item.attendance);
    if (item.first_date === null) {
      const first_date = new Date();
      item = { ...item, first_date: first_date };
      dbUpdateReservationsFirstDate(item.user_id, getDateForm2Date(first_date));
    }
    setAttendance([
      ...attendance.slice(0, index),
      item,
      ...attendance.slice(index + 1),
    ]);
  };

  const toggleRegistration = (attendee: Attendee, index: number) => {
    const res = confirm(
      `정말 ${attendee.registration ? "체험" : "정기"}권으로 변경하시겠습니까?`
    );
    if (res == false) return;
    const item = { ...attendee, registration: !attendee.registration };
    dbUpdateReservationsRegistration(item.user_id, item.registration);
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
              <ButtonLoc
                key={location}
                handleClick={() => setSelectedLocation(idx)}
                selected={locations[selectedLocation] === location}
              >
                {location}
              </ButtonLoc>
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
                style={{ marginTop: "0" }}
                className="flex justify-between items-center p-2 pt-0 m-0 border-b border-solid border-gray-200"
              >
                <div className="flex pt-2 items-center">
                  <span className="w-12">{attendee.name}</span>
                  <span
                    className={`text-sm ${
                      attendee.registration
                        ? "text-primary-800 font-semibold"
                        : "text-gray-800"
                    } pl-4`}
                  >
                    {attendee.registration ? (
                      "정기권"
                    ) : attendee.first_date ? (
                      <>
                        {`${getDateForm2Date(
                          getExpireDate(attendee.first_date)
                        )}`}
                        <span
                          className={`text-red-500 font-semibold ${
                            isExpiredDate(attendee.first_date) ? "" : "hidden"
                          }`}
                        >
                          (만료)
                        </span>
                      </>
                    ) : (
                      "시작 안함"
                    )}
                  </span>
                </div>
                <div className="flex flex-col">
                  <Button
                    variant="link"
                    size={"sm"}
                    className={`${
                      attendee.registration
                        ? "text-primary-800 font-semibold"
                        : "text-gray-500"
                    } w-16`}
                    onClick={() => toggleRegistration(attendee, index)}
                  >
                    {attendee.registration ? "정기" : "체험"}
                  </Button>
                  <Button
                    variant="outline"
                    size={"sm"}
                    onClick={() => toggleAttendance(attendee, index)}
                    className={`${
                      attendee.attendance
                        ? "border-primary-500"
                        : "border-gray-500"
                    } w-16`}
                  >
                    {attendee.attendance ? "출석 완" : "미출석"}
                  </Button>
                </div>
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
