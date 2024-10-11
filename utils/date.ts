import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

type AllorStringArray = "All" | string[];

const startYear = 2021;

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

const getAllYears = (start: number, end: number): string[] => {
  return Array.from({ length: end - start + 1 }, (_, i) =>
    (start + i).toString()
  );
};

const prepareDateInputs = (
  months: AllorStringArray,
  years: AllorStringArray
) => {
  const currentYear = dayjs().year();
  const allMonths = Object.keys(monthOrder);
  const allYears = getAllYears(startYear, currentYear);

  const monthInput = months === "All" ? allMonths : months;
  const yearInput = years === "All" ? allYears : years;

  return { monthInput, yearInput };
};

export const processDate = (
  months: AllorStringArray,
  years: AllorStringArray
) => {
  if (months === "All" && years === "All") {
    return {
      from: dayjs.utc(`${startYear}-01-01`).startOf("day").toDate(),
      to: dayjs.utc().endOf("day").toDate(),
    };
  }

  const { monthInput, yearInput } = prepareDateInputs(months, years);

  const { earliestDate, latestDate } = yearInput.reduce(
    (acc, year) => {
      monthInput.forEach((month) => {
        const monthIndex = monthOrder[month];
        const startOfMonth = dayjs
          .utc(`${year}-${monthIndex}`)
          .startOf("day")
          .toDate();
        const endOfMonth = dayjs
          .utc(`${year}-${monthIndex}`)
          .endOf("month")
          .endOf("day")
          .toDate();

        if (!acc.earliestDate || startOfMonth < acc.earliestDate) {
          acc.earliestDate = startOfMonth;
        }

        if (!acc.latestDate || endOfMonth > acc.latestDate) {
          acc.latestDate = endOfMonth;
        }
      });

      return acc;
    },
    { earliestDate: null as Date | null, latestDate: null as Date | null }
  );

  return {
    from: earliestDate,
    to: latestDate,
  };
};

export const getLocalDate = (date: string | number | Date) => {
  const newDate = new Date(date);

  newDate.setMinutes(newDate.getMinutes() - newDate.getTimezoneOffset());

  return newDate;
};
