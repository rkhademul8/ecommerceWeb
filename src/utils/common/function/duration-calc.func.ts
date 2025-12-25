import moment from "moment";

export const durationCalc = (minutes: number): string => {
  const duration = moment.duration(minutes, "minutes");
  const days = Math.floor(duration.asDays());
  const hours = duration.hours();
  const remainingMinutes = duration.minutes();

  if (days > 0) {
    return `${days}d ${hours}h ${remainingMinutes}m`;
  } else {
    return `${hours}h ${remainingMinutes}m`;
  }
};
