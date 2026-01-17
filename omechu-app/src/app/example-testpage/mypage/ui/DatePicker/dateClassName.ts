
import { isBefore, isSameMonth, startOfMonth } from "date-fns";
import DatePicker from "react-datepicker";

<DatePicker
  ...
  dayClassName={(date) => {
    const start = startOfMonth(viewMonth);

    if (isBefore(date, start)) {
      return "dp-prev-month";
    }

    if (!isSameMonth(date, viewMonth)) {
      return "dp-next-month";
    }

    return "";
  }}
/>