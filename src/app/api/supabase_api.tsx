import { holidayInstance } from "@/app/api/axios.instance";
import supabase from "@/utils/supabase";

export const dbGetScheduleList = async (date: string) => {
  const { data, error } = await supabase
    .from("workouts")
    .select()
    .eq("workout_date", date);
  if (error) {
    return error;
  }
  return data;
};

export const dbGetDefaultScheduleList = async () => {
  const { data, error } = await supabase.from("default_workouts").select();
  if (error) {
    return error;
  }
  return data;
};

export const dbGetAttendanceList = async (id: string) => {
  const { data: reservationsData, error } = await supabase
    .from("reservations")
    .select("id, user_id, attendance")
    .eq("workout_id", id);

  if (!reservationsData || error) {
    return [];
  }

  const listData = await Promise.all(
    reservationsData.map(async (item) => {
      const { data: userData } = await supabase
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
};

export const dbGetUserList = async () => {
  const { data, error } = await supabase.from("profiles").select();
  if (error) {
    return error;
  }
  return data;
};

export const dbDeleteWorkoutSchedule = async (id: string) => {
  console.log(id);
  const { data, error } = await supabase.from("workouts").delete().eq("id", id);
  if (error) {
    console.log(data);
    return false;
  }

  const { data: reservationsData, error: reservationsError } = await supabase
    .from("reservations")
    .delete()
    .eq("workout_id", id);
  if (reservationsError) {
    console.log(reservationsData);
    return false;
  }
  return true;
};

export const dbDeleteDefaultSchedule = async (id: string) => {
  const { data, error } = await supabase
    .from("default_workouts")
    .delete()
    .eq("id", id);
  if (error) {
    console.log(data);
    return false;
  }
  return true;
};

export const dbDeleteUser = async (id: string) => {
  const { data, error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) {
    console.log(data);
    return false;
  }
  return true;
};

export const dbInsertWorkoutSchedule = async (newData: object) => {
  const { data, error } = await supabase.from("workouts").insert([newData]);
  if (error) {
    return error;
  }
  return data;
};

export const dbInsertDefaultWorkoutSchedule = async (newData: object) => {
  const { data, error } = await supabase
    .from("default_workouts")
    .insert([newData]);
  if (error) {
    return error;
  }
  return data;
};

// export const axiosGetHolidayList = async () => {
//   let queryParams =
//     "?" +
//     encodeURIComponent("serviceKey") +
//     "=" +
//     process.env.NEXT_PUBLIC_HOLIDAY_API_KEY;
//   queryParams +=
//     "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1"); /**/
//   queryParams +=
//     "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("30"); /**/
//   queryParams +=
//     "&" + encodeURIComponent("solYear") + "=" + encodeURIComponent("2019"); /**/
//   queryParams +=
//     "&" + encodeURIComponent("solMonth") + "=" + encodeURIComponent("02"); /**/
//   try {
//     const response = await holidayInstance.get(queryParams);
//     console.log(response);
//     return response;
//   } catch (error) {
//     return error;
//   }
// };
