import React from "react";
import AddWorkoutBtn from "./ui/add_workout_btn";

export default function WorkoutManage(props: {
  title: string;
  scheduleList: Array<any>;
  getTime: (str: string) => string | null;
  handleDeleteSchedule: (schedule: any) => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <h2 className="text-xl font-bold mb-4">{props.title}</h2>
      <div className="flex flex-1 flex-col justify-between">
        {props.scheduleList.length > 0 ? (
          <ul className="space-y-2">
            {props.scheduleList.map((schedule: any, index: number) => (
              <li
                key={index}
                className={`p-2 border border-solid rounded border-gray-300`}
              >
                <p className="font-semibold">
                  {props.getTime(schedule.start_time)}
                </p>
                <div className="flex justify-between items-center">
                  <p>{schedule.workout_name}</p>
                  <img
                    className="w-6 h-6 p-1 cursor-pointer"
                    onClick={() => props.handleDeleteSchedule(schedule)}
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
        {props.children}
      </div>
    </>
  );
}
