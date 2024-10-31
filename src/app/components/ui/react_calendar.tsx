import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "@/app/components/ui/react_calendar.css";

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const ReactCalendar = (props: {
  date: Date;
  setDate: (value: Date) => void;
}) => {
  const handleChange = (value: Value) => {
    if (value instanceof Date) {
      props.setDate(value);
    }
  };

  return (
    <Calendar
      onChange={handleChange}
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
