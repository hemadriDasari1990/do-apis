export const getMemberIds = (members: Array<{ [Key: string]: any }>) => {
  if (!members || !members?.length) {
    return [];
  }
  console.log("members", members);
  const newMembers: Array<string> = [];
  members.map((memberProxy: { [Key: string]: any }) => {
    newMembers.push(memberProxy?.member?._id);
  });
  return newMembers?.filter(
    (elem: string, index: number, self) =>
      self.findIndex((t: string) => {
        return t === elem;
      }) === index
  );
};
