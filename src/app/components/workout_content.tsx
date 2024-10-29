import React from "react";
import { useState, useEffect, useRef } from "react";

import { dbGetScheduleList, dbGetAttendanceList } from "@/app/api/axios.custom";

import Button from "@/app/components/ui/button";
import ButtonSm from "@/app/components/ui/button_sm";
import ReactCalendar from "@/app/components/ui/react_calendar";

const getTime2Date = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getDateForm2Date = (date: Date) => {
  return date.toLocaleDateString("en-CA");
};

const locations = ["교대 잽트레이닝", "역삼 잽트레이닝", "선릉 잽트레이닝"];

const WorkoutContent: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedLocation, setSelectedLocation] = useState<number | null>(
    locations.length === 0 ? null : 0
  );

  const [loading, setLoading] = useState(true);

  const scheduleListRef = useRef([]);

  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      scheduleListRef.current = await dbGetScheduleList(
        getDateForm2Date(selectedDate)
      );
      setLoading(false);
    })();
  }, [selectedDate]);

  const dayScheduleList = scheduleListRef.current.filter(
    (schedule: any) => (selectedLocation ?? -1) + 1 === schedule.location_id
  );

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
        <h2 className="text-xl font-bold mb-4">운동 스케줄</h2>
        <div className="flex flex-1 flex-col justify-between">
          {scheduleListRef.current.length > 0 ? (
            <ul className="space-y-2">
              {dayScheduleList.map((schedule: any, index: number) => (
                <li
                  key={index}
                  className={`p-2 border border-solid rounded border-gray-300`}
                >
                  <p className="font-semibold">
                    {getTime2Date(new Date(schedule.start_time))}
                  </p>
                  <div className="flex justify-between items-center">
                    <p>{schedule.workout_name}</p>
                    <img
                      className="w-6 h-6 p-1 cursor-pointer"
                      onClick={() => console.log("click")}
                      src="icon/cancel.svg"
                    />
                  </div>
                  <p className="text-sm text-gray-500">
                    {schedule.duration}시간짜리 운동
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>선택된 날짜에 스케줄이 없습니다.</p>
          )}

          <ButtonSm handleClick={() => console.log("click")}>
            운동 추가
          </ButtonSm>
        </div>
      </div>
      <div className="w-1/3 px-4 my-4">
        <h2 className="text-xl font-bold mb-4">기본 시간대</h2>
      </div>
    </div>
  );
};

export default WorkoutContent;
