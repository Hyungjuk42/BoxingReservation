import {
  dbInsertDefaultWorkouts2Workouts,
  dbDeleteOldDates,
} from "@/app/api/supabase_api";
import { getDateForm2Date } from "@/app/reservation_content";
import { Schedule } from "@/app/interfaces/interfaces";
import React, { useState } from "react";

const deleteWorkoutsNReservationsBeforeMonths = async (months: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  await dbDeleteOldDates("reservations", "reserved_at", getDateForm2Date(date));
  await dbDeleteOldDates("workouts", "workout_date", getDateForm2Date(date));
};

export default function AddWorkoutsBtn(props: {
  location: number;
  workouts: Array<Schedule>;
  workoutName: Array<Schedule>;
  rerender: () => void;
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    start_date: "",
    end_date: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const formList = [
    {
      id: "start_date",
      type: "date",
      placeholder: "시작 날짜",
    },
    {
      id: "end_date",
      type: "date",
      placeholder: "끝 날짜",
    },
  ];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newData = {
      ...formData,
      location_id: props.location,
    };
    dbInsertDefaultWorkouts2Workouts(
      newData,
      props.workouts,
      props.workoutName
    );
    // Delete old data before 12 months
    deleteWorkoutsNReservationsBeforeMonths(6);
    closeModal();
    props.rerender();
  }

  if (props.location < 0) {
    return <></>;
  }

  return (
    <>
      <button
        onClick={openModal}
        className={`px-2 py-2 mt-2 bg-black text-white border-black rounded-sm text-center transition-colors border border-solid`}
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
                    <div
                      key={formIdx}
                      className="flex items-center justify-between mb-2"
                    >
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
