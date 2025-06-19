import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import StatusTag from "./StatusTag";
import PageJump from "./PageJump";
import PaginationButton from "./PaginationButton";
import PageSizeSelector from "./PageSizeSelector";
import { format, isAfter, isBefore, set } from "date-fns";

export type UsageData = Record<string, string | number | number[]>;

type HeaderType = {
  name: string;
  id: string;
};

const CustomTable = ({ header, data }: { header: HeaderType[]; data: UsageData[]|null }) => {

  if(!data)return;
  
  const columns: ColumnDef<UsageData>[] = header.map((item) => ({
    accessorKey: item.id,
    header: item.name,
    cell: ({ getValue, row }) => {
      const value = getValue() as string;
      const rowData = row.original;

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
      } 
      else if (item.name === '시작일' || item.name === '종료일'){
        if(!value)return <p></p>
        const date = format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
        return <p>{date}</p>
      }      
      else if (item.id === "status") {
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
      }
      return <p>{value}</p>;
    },
  }));

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  

  return (
    <div className="flex-1 border-1 border-gray-200 rounded-xl overflow-hidden mb-[50px]">
      <table className="w-full border-collapse table-fixed">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="border-b-1 border-gray-200 bg-gray-100 text-left">
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="text-sm font-medium p-[10px]">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-b-1 border-gray-200">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-[10px] text-sm text-wrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={header.length}>
              <div className="flex justify-between items-center p-[10px]">
                <PageSizeSelector table={table} />
                <PaginationButton table={table} />
                <PageJump table={table} />
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default CustomTable;
