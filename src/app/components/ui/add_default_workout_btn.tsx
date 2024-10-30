import { dbInsertWorkoutSchedule } from "@/app/api/axios.custom";
import React, { useState } from "react";

export default function AddWorkoutBtn(props: {
  date: Date;
  location: number | null;
  rerender: () => void;
  children: React.ReactNode;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    workout_name: "",
    start_time: "",
    duration: "",
    location_id: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const formList = [
    {
      id: "workout_name",
      type: "text",
      placeholder: "운동 이름",
    },
    {
      id: "start_time",
      type: "datetime-local",
      placeholder: "시작 시간",
    },
    {
      id: "duration",
      type: "number",
      placeholder: "운동 시간",
    },
    {
      id: "location_id",
      type: "radio",
      value: ["교대", "역삼", "선릉"],
      placeholder: "운동 지점",
    },
  ];

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newData = await dbInsertWorkoutSchedule({
      ...formData,
      workout_date: formData["start_time"].split("T")[0],
    });
    closeModal();
    props.rerender();
    console.log(newData);
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
                  if (form.type === "radio") {
                    return (
                      <div
                        key={formIdx}
                        className="flex items-center mb-2 py-1"
                      >
                        <label className="mr-4">{form.placeholder}</label>
                        {form.value?.map((location, idx) => (
                          <>
                            <input
                              key={`input-${idx}`}
                              type={form.type}
                              id={form.id}
                              name={form.id}
                              onChange={handleInputChange}
                              value={idx + 1}
                              required={true}
                            />
                            <label key={`label-${idx}`} className="mr-2">
                              {location}
                            </label>
                          </>
                        ))}
                      </div>
                    );
                  }
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
