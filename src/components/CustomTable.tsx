import {
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
  flexRender,
} from "@tanstack/react-table";
import PageJump from "./pagination/PageJump";
import PaginationButton from "./pagination/PaginationButton";
import PageSizeSelector from "./pagination/PageSizeSelector";
import { IoIosCheckmark } from "react-icons/io";
import renderTableCell from "../utils/table/renderTableCell";

export type UsageData = Record<string, string | number | number[]>;

export type HeaderType = {
  name: string;
  id: string;
};

type CustomTable = {
  header: HeaderType[];
  data: UsageData[] | null;
  rowUpdate?: (row: UsageData, title?: string) => void | undefined;
  isDeleteMode?: boolean;
  changeSelectedRow?: ({ id }: { id: string | null }) => void;
  selectedRowId?: string;
};

const CustomTable = ({
  header,
  data,
  rowUpdate,
  isDeleteMode,
  changeSelectedRow,
  selectedRowId,
}: CustomTable) => {
  const columns: ColumnDef<UsageData>[] = header.map((item) => ({
    accessorKey: item.id,
    header: item.name,
    cell: ({ getValue, row }) => {
      const value = getValue() as string;
      const rowData = row.original;

      return renderTableCell({ item, rowData, value, header, rowUpdate });
    },
  }));

  const table = useReactTable({
    data: data ?? [],
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
              {isDeleteMode && <th className="p-[10px]"></th>}
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="text-sm font-medium p-[8px] px-4 overflow-hidden text-ellipsis"
                  // style={{ width: `${100 / headerGroup.headers.length}%` }}
                >
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
            <tr
              key={row.id}
              className={`${rowUpdate ? "cursor-pointer hover:bg-danuri-100" : undefined} border-b-1 border-gray-200`}
              onClick={() => {
                if (rowUpdate) rowUpdate(row.original, "수정");
              }}
            >
              {isDeleteMode && (
                <td className="p-[10px] pl-4">
                  <label className="relative" htmlFor="checkbox">
                    <input
                      name="checkbox"
                      className="cursor-pointer appearance-none w-[15px] h-[15px] border-1 rounded-sm border-gray-300 checked:border-danuri-500 checked:bg-danuri-500"
                      type="checkbox"
                      checked={row.original.id === selectedRowId}
                      onClick={(e) => e.stopPropagation()}
                      onChange={() => {
                        if (row.original.id === selectedRowId) {
                          // 이미 선택되어 있으면 해제
                          changeSelectedRow?.({ id: null });
                        } else {
                          // 아니면 선택
                          changeSelectedRow?.({ id: row.original.id as string });
                        }
                      }}
                    />
                    {row.original.id === selectedRowId && (
                      <IoIosCheckmark
                        onClick={(e) => {
                          e.stopPropagation();
                          if (row.original.id === selectedRowId) {
                            changeSelectedRow?.({ id: null });
                          } else {
                            changeSelectedRow?.({ id: row.original.id as string });
                          }
                        }}
                        className="absolute inset-0 cursor-pointer"
                        color="white"
                      />
                    )}
                  </label>
                </td>
              )}
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="p-[16px] pl-[20px] text-sm text-wrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={isDeleteMode ? header.length + 1 : header.length}>
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
