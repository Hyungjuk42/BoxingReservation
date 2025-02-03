import {
  dbInsertDefaultWorkout2DefaultWorkouts,
  dbInsertDefaultWorkoutName2DefaultWorkoutName,
  dbInsertWorkout2Workouts,
} from "@/app/api/supabase_api";
import React, { useState } from "react";

import { getDateForm2Date } from "@/app/reservation_content";

export default function AddWorkoutBtn(props: {
  date: Date;
  location: number | null;
  rerender: () => void;
  default: number;
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    workout_name?: string;
    start_time?: string;
  }>({});

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const formList = [];

  if (props.default & 1) {
    formList.push({
      id: "workout_name",
      type: "text",
      placeholder: "운동 이름",
    });
  }
  if (props.default & 2) {
    formList.push({
      id: "start_time",
      type: "time",
      placeholder: "시작 시간",
    });
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (props.default === 2) {
      const newData = {
        ...formData,
        location_id: props.location,
      };
      console.log(newData);
      await dbInsertDefaultWorkout2DefaultWorkouts(newData);
    } else if (props.default === 1) {
      delete formData.start_time;
      await dbInsertDefaultWorkoutName2DefaultWorkoutName(formData);
    } else if (props.default === 3) {
      const workout_date = getDateForm2Date(props.date);
      const start_time = `${workout_date}T${formData.start_time}`;
      const newData = {
        ...formData,
        workout_date: workout_date,
        start_time: start_time,
        location_id: props.location,
      };
      await dbInsertWorkout2Workouts(newData);
    }
    closeModal();
    props.rerender();
  }

  if (props.location === null) {
    return <></>;
  }

  return (
    <>
      <button
        onClick={openModal}
        className={`px-2 py-2 bg-black text-white border-black rounded-sm text-center transition-colors border border-solid`}
      >
        {props.children}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">운동 추가하기</h2>
            <>
              <form onSubmit={handleSubmit} className="flex flex-col p-2">
                {formList.map((form, formIdx) => {
                  return (
                    <div key={formIdx} className="flex items-center mb-2">
                      <label className="mr-4">{form.placeholder}</label>
                      <input
                        className="p-1"
                        id={form.id}
                        name={form.id}
                        type={form.type}
                        onChange={handleInputChange}
                        placeholder={form.placeholder}
                        required={true}
                      />
                    </div>
                  );
                })}
                <div className="flex">
                  <button
                    type="submit"
                    className="px-4 py-2 mr-2 text-white bg-primary-600 rounded hover:bg-primary-700"
                  >
                    Submit
                  </button>
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-6 00"
                  >
                    Close Modal
                  </button>
                </div>
              </form>
            </>
          </div>
        </div>
      )}
    </>
  );
}
