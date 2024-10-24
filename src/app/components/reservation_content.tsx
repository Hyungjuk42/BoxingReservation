import React from "react";
import { useState, useEffect, useRef } from "react";

import { axiosGetScheduleList } from "@/app/api/axios.custom";

import Button from "@/app/components/ui/button";
import ButtonSm from "@/app/components/ui/button_sm";
import ReactCalendar from "@/app/components/ui/react_calendar";

const ReservationContent: React.FC = () => {
  const locations = ["교대 잽트레이닝", "역삼 잽트레이닝", "선릉 잽트레이닝"];
  const schedules: Record<string, any> = {
    "선릉 잽트레이닝": [
      { time: "10:00", duration: 1, attendees: ["이승기", "아이유"] },
      { time: "15:00", duration: 1, attendees: ["박보검", "수지"] },
    ],
    "교대 잽트레이닝": [
      { time: "09:00", duration: 1, attendees: ["조인성", "고소영"] },
      { time: "14:00", duration: 1, attendees: ["원빈", "이나영"] },
    ],
    "역삼 잽트레이닝": [
      { time: "11:00", duration: 1, attendees: ["장동건", "고현정"] },
      { time: "16:00", duration: 1, attendees: ["현빈", "손예진"] },
    ],
  };

  const [selectedLocation, setSelectedLocation] = useState<string | null>(
    locations.length === 0 ? null : locations[0]
  );

  const daySchedules = schedules[selectedLocation ?? ""];

  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(
    daySchedules?.length === 0 ? null : daySchedules[0].time
  );

  const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({});

  const [loading, setLoading] = useState(true);

  const [date, setDate] = useState(new Date());

  const scheduleListRef = useRef<any>({});

  useEffect(() => {
    (async () => {
      const currentYear = date.getFullYear();
      const currentMonth = date.getMonth() + 1;
      console.log(currentYear, currentMonth);
      if (!scheduleListRef.current[`${currentYear}-${currentMonth}`]) {
        setLoading(true);
        const response = await axiosGetScheduleList(currentYear, currentMonth);
        scheduleListRef.current[`${currentYear}-${currentMonth}`] = response;
        console.log(response);
        setLoading(false);
      }
    })();
  }, [date.getFullYear(), date.getMonth() + 1]);

  useEffect(() => {
    if (loading) return;

    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth() + 1;

    const schedulesPerDate = scheduleListRef.current[
      `${currentYear}-${currentMonth}`
    ].filter((schedule: any) => {
      return schedule.workout_date === date.toLocaleDateString("en-CA");
    });

    console.log(schedulesPerDate);
  }, [date, loading]);

  const handleSelectSchedule = (time: string) => {
    setSelectedSchedule(time);
    if (daySchedules) {
      const schedule = daySchedules.find(
        (schedule: any) => schedule.time === time
      );
      if (schedule) {
        const newAttendance: { [key: string]: boolean } = {};
        schedule.attendees.forEach((attendee: string) => {
          newAttendance[attendee] = false;
        });
        setAttendance(newAttendance);
      }
    }
  };

  const toggleAttendance = (attendee: string) => {
    setAttendance((prevState) => ({
      ...prevState,
      [attendee]: !prevState[attendee],
    }));
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-col items-center w-1/3 px-4 my-4 border-r-2 border-solid border-gray-200">
        <ReactCalendar date={date} setDate={setDate} />
        {"달력 들어갈 자리"}
        <div className="flex flex-col w-full items-center space-y-2">
          {selectedLocation ? (
            locations.map((location) => (
              <Button
                key={location}
                handleClick={() => setSelectedLocation(location)}
                selected={selectedLocation === location}
              >
                {location}
              </Button>
            ))
          ) : (
            <h3 className="">추가된 도장 없음</h3>
          )}
        </div>
      </div>
      <div className="w-1/3 px-4 my-4 border-r-2 border-solid border-gray-200">
        <h2 className="text-xl font-bold mb-4">운동 스케줄</h2>
        {daySchedules.length > 0 ? (
          <ul className="space-y-2">
            {daySchedules &&
              daySchedules.map((schedule: any, index: number) => (
                <li
                  key={index}
                  className={`p-2 border border-solid rounded cursor-pointer hover:bg-gray-100 ${
                    selectedSchedule === schedule.time
                      ? "border-primary-500 border-[2px]"
                      : "border-gray-300"
                  }`}
                  onClick={() => handleSelectSchedule(schedule.time)}
                >
                  <p className="font-semibold">{schedule.time}</p>
                  <p>{selectedLocation}</p>
                  <p className="text-sm text-gray-500">
                    {schedule.duration}시간짜리 운동
                  </p>
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
          <ul className="space-y-2">
            {daySchedules &&
              daySchedules
                .find((schedule: any) => schedule.time === selectedSchedule)
                ?.attendees.map((attendee: any, index: number) => (
                  <li
                    key={index}
                    className="flex justify-between items-center p-2 border-b border-solid border-gray-200"
                  >
                    <span>{attendee}</span>
                    <ButtonSm
                      handleClick={() => toggleAttendance(attendee)}
                      clicked={attendance[attendee]}
                    >
                      {attendance[attendee] ? "출석 완료" : "출석"}
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
