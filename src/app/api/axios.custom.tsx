import { instance, holidayInstance } from "@/app/api/axios.instance";
import supabase from "@/utils/supabase";

const getNextMonth = (year: number, month: number) => {
  if (month === 12) {
    return `${year + 1}-01`;
  } else {
    return `${year}-${month + 1}`;
  }
};

export const axiosGetScheduleList = async (year: number, month: number) => {
  try {
    const response = await instance.get("/rest/v1/workouts", {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        workout_date: [
          `gte.${year}-${month}-01`,
          `lt.${getNextMonth(year, month)}-01`,
        ],
      },
    });
    return response.data;
    // const { data, error } = await supabase
    //   .from("workouts")
    //   .select()
    //   .gte("workout_date", `${startDate}-01`)
    //   .lt("workout_date", `${endDate}-01`);
    // console.log(data, error);
  } catch (error) {
    return error;
  }
};

export const axiosGetHolidayList = async () => {
  let queryParams =
    "?" +
    encodeURIComponent("serviceKey") +
    "=" +
    process.env.NEXT_PUBLIC_HOLIDAY_API_KEY;
  queryParams +=
    "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /**/
  queryParams +=
    "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("30"); /**/
  queryParams +=
    "&" + encodeURIComponent("solYear") + "=" + encodeURIComponent("2019"); /**/
  queryParams +=
    "&" + encodeURIComponent("solMonth") + "=" + encodeURIComponent("02"); /**/
  try {
    const response = await holidayInstance.get(queryParams);
    console.log(response);
    return response;
  } catch (error) {
    return error;
  }
};
