const combineDuplicateBaggage = (baggageDataArray: any) => {
  const uniqueData: any = [];
  baggageDataArray.forEach((item: any) => {
    const existingEntry = uniqueData.find(
      (entry: any) => entry.passengerType === item.passengerType
    );
    if (!existingEntry) {
      uniqueData.push({ ...item });
    }
  });
  return uniqueData;
};

export default combineDuplicateBaggage;
