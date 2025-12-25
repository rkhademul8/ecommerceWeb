import moment from "moment";

export const formatCsvData = (data: any[], headers: { label: string; key: string }[]) => {
  return data.map((entry) => {
    const formattedEntry: any = {};

    headers.forEach((header) => {
      const key = header.key;
      if (key === "createdDateTime") {
        formattedEntry[key] = entry[key] ? moment(entry[key]).format("DD-MMM-YYYY HH:mm") : "N/A";
      } else {
        formattedEntry[key] = entry[key] ?? "N/A";
      }
    });

    return formattedEntry;
  });
};