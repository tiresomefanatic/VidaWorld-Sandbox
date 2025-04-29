import dayjs from "dayjs";

const dateUtils = {
  getFormatedDate: (date, dateFormat) => {
    const formattedDate =
      date && dateFormat ? dayjs(date).format(dateFormat) : date;
    return formattedDate;
  },
  formatSelectedDate: (date) => {
    date = date.split("/");
    return date[2] + "-" + date[1] + "-" + date[0];
  },

  calcDeliveryDate: (date) => {
    //If they want only working days to be calculated

    // function checkWorkingDays(startDate, numWorkdays) {
    //   // Initialize variables
    //   let currentDate = new Date(startDate);
    //   let workdaysAdded = 0;

    //   function isWeekend(date) {
    //     const day = date.getDay();
    //     return (day === 0 || day === 6); // 0 = Sunday, 6 = Saturday
    //   }

    //   // Loop through each day and count workdays until we reach numWorkdays
    //   while (workdaysAdded < numWorkdays) {
    //     // Move to the next day
    //     currentDate.setDate(currentDate.getDate() + 1);

    //     // Check if the current day is a weekday and not a weekend
    //     if (!isWeekend(currentDate)) {
    //       workdaysAdded++;
    //     }
    //   }

    //   return currentDate;
    // }

    const currentDate = date || new Date();

    // Calculate 15 days from now
    const futureDate = new Date(
      currentDate.getTime() + 15 * 24 * 60 * 60 * 1000
    );

    // Format the future date as mmm/dd (e.g., Jun/01)
    const formattedFutureDate = futureDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });

    return formattedFutureDate;
  }
};

export default dateUtils;
