// import { holidayInstance } from "@/app/api/axios.instance";
import supabase from "@/utils/supabase";
import { Schedule } from "../interfaces/interfaces";

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

export const dbGetDefaultWorkoutName = async () => {
  const { data, error } = await supabase.from("default_workout_name").select();
  if (error) {
    return error;
  }
  return data;
};

export const dbDeleteReservation = async (id: string) => {
  const { data, error } = await supabase
    .from("reservations")
    .delete()
    .eq("id", id);
  if (error) {
    return false;
  }
  return true;
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
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("name, first_check_in_date, registration")
        .eq("id", item.user_id);

      if (!userData || userData?.length === 0 || userError) {
        dbDeleteReservation(item.id);
        return null;
      }
      const first_date = userData?.[0].first_check_in_date;
      return {
        name: userData?.[0].name,
        first_date: first_date ? new Date(first_date) : null,
        registration: userData?.[0].registration,
        ...item,
      };
    })
  );
  return listData.filter((item) => item !== null);
};

export const dbGetUserList = async () => {
  const { data, error } = await supabase.from("profiles").select();
  if (error) {
    return error;
  }
  return data;
};

export const dbGetDayWorkouts2Workouts = async (date: string) => {
  const { data, error } = await supabase
    .from("workouts")
    .select()
    .eq("workout_date", date);
  if (error) {
    return error;
  }
  return data;
};

export const dbGetOneDayWorkout2Workouts = async (date: string) => {
  const { data, error } = await supabase
    .from("workouts")
    .select("id")
    .eq("workout_date", date)
    .limit(1);
  if (error) {
    return error;
  }
  return data;
};

export const dbUpdateReservationsAttendance = async (
  id: string,
  attendance: boolean
) => {
  const { data, error } = await supabase
    .from("reservations")
    .update({ attendance: attendance })
    .eq("id", id);
  if (error) {
    return false;
  }
  return true;
};

export const dbUpdateReservationsFirstDate = async (
  user_id: string,
  first_check_in_date: string
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ first_check_in_date: first_check_in_date })
    .eq("id", user_id);
  if (error) {
    return false;
  }
  return true;
};

export const dbUpdateReservationsRegistration = async (
  user_id: string,
  registration: boolean
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update({ registration: registration })
    .eq("id", user_id);
  if (error) {
    return false;
  }
  return true;
};

export const dbDeleteWorkoutSchedule = async (id: string) => {
  const { data, error } = await supabase.from("workouts").delete().eq("id", id);
  if (error) {
    return false;
  }

  const { data: reservationsData, error: reservationsError } = await supabase
    .from("reservations")
    .delete()
    .eq("workout_id", id);
  if (reservationsError) {
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
    return false;
  }
  return true;
};

export const dbDeleteDefaultWorkoutName = async (id: string) => {
  const { data, error } = await supabase
    .from("default_workout_name")
    .delete()
    .eq("id", id);
  if (error) {
    return false;
  }
  return true;
};

export const dbDeleteUser = async (id: string) => {
  const { error } = await supabase.from("profiles").delete().eq("id", id);
  if (error) {
    return false;
  }
  return true;
};

export const dbDeleteOldDates = async (
  tableName: string,
  dateColumn: string,
  targetDate: string
) => {
  const { data, error } = await supabase
    .from(tableName)
    .delete()
    .lt(dateColumn, targetDate); // targetDate 이전의 데이터 삭제

  if (error) {
    console.error("Error deleting data:", error);
  } else {
    console.log("Successfully deleted data:", data);
  }
};

export const dbInsertWorkout2Workouts = async (newData: object) => {
  const { data, error } = await supabase.from("workouts").insert([newData]);
  if (error) {
    return error;
  }
  return data;
};

export const dbInsertDefaultWorkout2DefaultWorkouts = async (
  newData: object
) => {
  const { data, error } = await supabase
    .from("default_workouts")
    .insert([newData]);
  if (error) {
    return error;
  }
  return data;
};

export const dbInsertDefaultWorkoutName2DefaultWorkoutName = async (
  newData: object
) => {
  const { data, error } = await supabase
    .from("default_workout_name")
    .insert([newData]);
  if (error) {
    return error;
  }
  return data;
};

const generateDateRange = (startDate: string, endDate: string): string[] => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    // if Weekend, skip
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6)
      dates.push(currentDate.toISOString().split("T")[0]); // Format as yyyy-MM-dd
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

export const dbInsertDefaultWorkouts2Workouts = async (
  newData: {
    start_date: string;
    end_date: string;
    location_id: number;
  },
  workouts: Array<Schedule>,
  workoutName: Array<Schedule>
) => {
  const dateRange = generateDateRange(newData.start_date, newData.end_date);
  const workoutList = [];
  const { data: dateData } = await supabase
    .from("workouts")
    .select("workout_date")
    .lte("workout_date", newData.end_date)
    .gte("workout_date", newData.start_date)
    .eq("location_id", newData.location_id);

  const dayWorkouts: { [key: string]: boolean } = {};
  const rotateNum = workoutName?.length;
  if (dateData) {
    for (const item of dateData) {
      dayWorkouts[item.workout_date as string] = true;
    }
  }
  let i: number = -1;
  for (const date of dateRange) {
    if (dayWorkouts[date]) {
      continue;
    }
    for (const workout of workouts) {
      i++;
      if (i % rotateNum === 0) i = 0;
      const newWorkout = {
        ...workout,
        workout_name: workoutName[i].workout_name,
        workout_date: date,
        start_time: `${date}T${workout.start_time}`,
        location_id: newData.location_id,
      };
      if ("id" in newWorkout) delete (newWorkout as any).id;
      workoutList.push(newWorkout);
    }
  }
  const { data, error } = await supabase.from("workouts").insert(workoutList);
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
