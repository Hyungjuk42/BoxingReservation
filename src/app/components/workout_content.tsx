import React from "react";
import { useState, useEffect, useRef } from "react";

import {
  dbGetScheduleList,
  dbDeleteWorkoutSchedule,
  dbDeleteDefaultSchedule,
  dbGetDefaultScheduleList,
} from "@/app/api/axios.custom";

import Button from "@/app/components/ui/button";
import ButtonSm from "@/app/components/ui/button_sm";
import ReactCalendar from "@/app/components/ui/react_calendar";
import AddWorkoutBtn from "@/app/components/ui/add_workout_btn";

const getTime2Date = (date: Date) => {
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

  const [selectedLocation, setSelectedLocation] = useState<number | null>(
    locations.length === 0 ? null : 0
  );

  const scheduleListRef = useRef([]);
  const defaultScheduleListRef = useRef([]);

  const [dayScheduleList, setDayScheduleList] = useState([]);

  const getDayScheduleList = async () => {
    scheduleListRef.current = await dbGetScheduleList(
      getDateForm2Date(selectedDate)
    );
    setDayScheduleList(
      scheduleListRef.current.filter(
        (schedule: any) => (selectedLocation ?? -1) + 1 === schedule.location_id
      )
    );
  };

  const dayDefaultScheduleList = defaultScheduleListRef.current?.filter(
    (schedule: any) => (selectedLocation ?? -1) + 1 === schedule.location_id
  );

  useEffect(() => {
    (async () => {
      defaultScheduleListRef.current = await dbGetDefaultScheduleList();
      console.log(defaultScheduleListRef.current);
    })();
  }, []);

  useEffect(() => {
    getDayScheduleList();
  }, [selectedDate]);

  useEffect(() => {
    setDayScheduleList(
      scheduleListRef.current.filter(
        (schedule: any) => (selectedLocation ?? -1) + 1 === schedule.location_id
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
                      onClick={() => {
                        dbDeleteWorkoutSchedule(schedule.id).then((res) => {
                          if (res) {
                            scheduleListRef.current =
                              scheduleListRef.current.filter(
                                (item: any) => item.id !== schedule.id
                              );
                            setDayScheduleList(
                              scheduleListRef.current.filter(
                                (schedule: any) =>
                                  (selectedLocation ?? -1) + 1 ===
                                  schedule.location_id
                              )
                            );
                          }
                        });
                      }}
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

          <AddWorkoutBtn
            date={selectedDate}
            location={(selectedLocation ?? -1) + 1}
            rerender={getDayScheduleList}
          >
            운동 추가
          </AddWorkoutBtn>
        </div>
      </div>
      <div className="w-1/3 px-4 my-4">
        <h2 className="text-xl font-bold mb-4">기본 시간대</h2>
        <div className="flex flex-1 flex-col justify-between">
          {defaultScheduleListRef.current.length > 0 ? (
            <ul className="space-y-2">
              {dayDefaultScheduleList.map((schedule: any, index: number) => (
                <li
                  key={index}
                  className={`p-2 border border-solid rounded border-gray-300`}
                >
                  <p className="font-semibold">
                    {getTime2Time(schedule.start_time)}
                  </p>
                  <div className="flex justify-between items-center">
                    <p>{schedule.workout_name}</p>
                    <img
                      className="w-6 h-6 p-1 cursor-pointer"
                      onClick={() => {
                        dbDeleteDefaultSchedule(schedule.id).then((res) => {
                          if (res) {
                            defaultScheduleListRef.current =
                              defaultScheduleListRef.current.filter(
                                (item: any) => item.kd !== schedule.id
                              );
                          }
                        });
                      }}
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
            <p>기본 스케줄이 없습니다.</p>
          )}
          <AddWorkoutBtn rerender={getDayScheduleList}>
            시간대 추가
          </AddWorkoutBtn>
        </div>
      </div>
    </div>
  );
};

export default WorkoutContent;
