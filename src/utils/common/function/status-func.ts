export const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "pending";
    case "KAM_APPROVED":
      return "kam_approved";
    case "ACC_APPROVED":
      return "acc_approved";
    case "rejected":
      return "rejected";
    case "CANCELLED":
      return "cancelled";
    default:
      return "default";
  }
};
