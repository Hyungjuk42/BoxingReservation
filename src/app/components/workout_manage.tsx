import React from "react";
import Image from "next/image";
import { Schedule } from "@/app/interfaces/interfaces";

export default function WorkoutManage(props: {
  title: string;
  scheduleList: Array<Schedule>;
  getTime: (str: string) => string | null;
  handleDeleteSchedule: (schedule: Schedule) => void;
  height: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">{props.title}</h2>
      <div className="flex flex-1 flex-col justify-between">
        {props.scheduleList.length > 0 ? (
          <ul
            style={{ height: props.height }}
            className="space-y-2 overflow-y-scroll no-scrollbar"
          >
            {props.scheduleList.map((schedule: Schedule, index: number) => (
              <li
                key={index}
                className={`p-2 border border-solid rounded border-gray-300 flex justify-between items-center`}
              >
                <div>
                  <p className="text-xl font-semibold py-1">
                    {props.getTime(schedule.start_time)}
                  </p>
                  <p className="text-lg">{schedule.workout_name}</p>
                </div>
                <div className="flex justify-between items-center">
                  <Image
                    className="w-6 h-6 p-1 cursor-pointer"
                    onClick={() => props.handleDeleteSchedule(schedule)}
                    src="icon/cancel.svg"
                    width={24}
                    height={24}
                    alt="DeleteIcon"
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>선택된 날짜에 스케줄이 없습니다.</p>
        )}
        {props.children}
      </div>
    </>
  );
}
