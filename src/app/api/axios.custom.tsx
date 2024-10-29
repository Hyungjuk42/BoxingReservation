import { instance, holidayInstance } from "@/app/api/axios.instance";
import supabase from "@/utils/supabase";

const getNextMonth = (year: number, month: number) => {
  if (month === 12) {
    return `${year + 1}-01`;
  } else {
    return `${year}-${month + 1}`;
  }
};

export const dbGetScheduleList = async (date: string) => {
  try {
    const { data, error } = await supabase
      .from("workouts")
      .select()
      .eq("workout_date", date);
    // .gte("workout_date", `2024-10-28`)
    // .lt("workout_date", `2024-11-32`);
    console.log(data, error);
    return data;
  } catch (error) {
    return error;
  }
};

export const dbGetAttendanceList = async (id: string) => {
  try {
    const { data: reservationsData, error } = await supabase
      .from("reservations")
      .select("id, user_id, attendance")
      .eq("workout_id", id);

    if (!reservationsData) {
      return [];
    }

    const listData = await Promise.all(
      reservationsData.map(async (item) => {
        const { data: userData, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("id", item.user_id);

        return {
          name: userData?.[0].name,
          ...item,
        };
      })
    );
    console.log(listData);
    return listData;
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
