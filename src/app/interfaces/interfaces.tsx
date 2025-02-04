export interface Schedule {
  id: string;
  start_time: string;
  workout_name: string;
  location_id: number;
}

export interface Attendee {
  id: string;
  user_id: string;
  name: string;
  attendance: boolean;
  first_date: Date | null;
  first_chk_in: boolean;
  registration: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}
