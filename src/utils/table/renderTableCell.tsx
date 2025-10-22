import type { HeaderType, UsageData } from "@/components/CustomTable";
import { format, isAfter, isBefore, set } from "date-fns";
import StatusTag from "@/components/StatusTag";
import { useNavigate } from "react-router-dom";

type RenderCell = {
  item: {
    id: string;
    name: string;
  };
  rowData: UsageData;
  value: string;
  header: HeaderType[];
  rowUpdate: ((row: UsageData, title?: string) => void | undefined) | undefined;
};

const headerDateNames = ["시작일", "종료일", "가입일", "추가일"];

const renderTableCell = ({ item, rowData, value, header, rowUpdate }: RenderCell) => {
  const navigate = useNavigate();

  if (item.name == "시작시간" || item.name === "종료시간") {
    const timeArray = rowData[item.id] as number[];
    const time = format(
      set(new Date(), {
        hours: timeArray[0],
        minutes: timeArray[1],
        seconds: timeArray[2] || 0,
      }),
      "HH:mm:ss"
    );
    return <p>{time}</p>;
  } else if (headerDateNames.includes(item.name ?? "")) {
    if (!value) return <p></p>;
    const date = format(new Date(value), "yyyy-MM-dd HH:mm:ss");
    return <p>{date}</p>;
  } else if (item.id === "status") {
    //상태 값 있을 때
    if (value) return <StatusTag value={value} />;

    //상태 값 없을 때 시간 비교
    if (header.some((h) => h.name === "시작일")) {
      const start = rowData["start_at"] as number;
      const end = rowData["end_at"] as number;
      const now = new Date();

      const statusValue =
        isAfter(now, new Date(start)) && isBefore(now, new Date(end)) ? "USE" : "NOT_USE";
      return <StatusTag value={statusValue} />;
    } else {
      const start = rowData["start_at"] as number[];
      const end = rowData["end_at"] as number[];

      const startTime = set(new Date(), {
        hours: start[0],
        minutes: start[1],
        seconds: start[2] || 0,
      });

      const endTime = set(new Date(), {
        hours: end[0],
        minutes: end[1],
        seconds: end[2] || 0,
      });
      const now = new Date();

      const statusValue =
        isAfter(now, new Date(startTime)) && isBefore(now, new Date(endTime))
          ? "AVAILABLE"
          : "NOT_AVAILABLE";
      return <StatusTag value={statusValue} />;
    }
  } else if (item.id === "sex") {
    const sex = value === "MALE" ? "남" : "여";
    return <p>{sex}</p>;
  } else if (item.id === "age") {
    let age;

    switch (value) {
      case "MIDDLE":
        age = "중학생";
        break;
      case "HIGH":
        age = "고등학생";
        break;
    }
    return <p>{age}</p>;
  } else if (item.id === "id" || item.id === "user_name" || item.id === "user_id") {
    const isUserName = item.id === "user_name" || item.id === "user_id";
    return (
      <p
        className={`${isUserName ? "cursor-pointer" : null} text-danuri-500`}
        {...(isUserName ? { onClick: () => navigate("/user") } : {})}
      >
        {value}
      </p>
    );
  } else if (item.id === "connect" && rowUpdate) {
    return (
      <button
        className="cursor-pointer rounded-[8px] text-danuri-500 border-danuri-500 border-1 text-[13px] px-[14px] py-[7px] "
        onClick={(e) => {
          e.stopPropagation();
          rowUpdate(rowData, "기기연결");
        }}
      >
        연결
      </button>
    );
  }
  return <p>{value}</p>;
};

export default renderTableCell;
