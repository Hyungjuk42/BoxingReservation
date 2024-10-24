import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/app/components/ui/react_calendar.css";

const ReactCalendar = (props: {
  date: Date;
  setDate: (value: Date) => void;
}) => {
  return (
    <Calendar
      onChange={props.setDate}
      value={props.date}
      className="mb-16 transition"
      tileClassName={({ date }) => {
        if (date.getDay() === 0) {
          return "holiday";
        } else if (date.getDay() === 6) {
          return "saturday";
        }
        return "";
      }}
      locale="en-US"
    />
  );
};

export default ReactCalendar;
