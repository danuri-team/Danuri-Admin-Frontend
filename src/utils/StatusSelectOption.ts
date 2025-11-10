export const selectStatusOption = (path: string, label: string) => {
  if (path === "/item") {
    return [
      { name: "이용가능", value: "AVAILABLE" },
      { name: "이용불가", value: "NOT_AVAILABLE" },
    ];
  } else if (path === "/rental") {
    return [
      { name: "미확인", value: "NOT_CONFIRMED" },
      { name: "반납됨", value: "RETURNED" },
      { name: "이용중", value: "IN_USE" },
    ];
  } else if (path === "/user" && label === "성별") {
    return [
      { name: "남", value: "MALE" },
      { name: "여", value: "FEMALE" },
    ];
  } else if (path === "/user" && label === "나이") {
    return [
      { name: "고등학생", value: "HIGH" },
      { name: "중학생", value: "MIDDLE" },
    ];
  } else if (path === "/admin") {
    return [
      { name: "예", value: "AVAILABLE" },
      { name: "아니오", value: "NOT_AVAILABLE" },
    ];
  }
};

export const changeEnumtoText = (status: string, path?: string) => {
  switch (status) {
    case "AVAILABLE":
      if (path === "/admin") {
        return "예";
      }
      return "이용가능";
    case "NOT_AVAILABLE":
      if (path === "/admin") {
        return "아니오";
      }
      return "이용불가";
    case "USE":
      return "이용중";
    case "NOT_USE":
      return "종료됨";
    case "NOT_CONFIRMED":
      return "미확인";
    case "RETURNED":
      return "반납됨";
    case "IN_USE":
      return "이용중";
    case "MALE":
      return "남";
    case "FEMALE":
      return "여";
    case "HIGH":
      return "고등학생";
    case "MIDDLE":
      return "중학생";
    default:
      return "알 수 없음";
  }
};
