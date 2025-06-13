import { getCoreRowModel, getPaginationRowModel, useReactTable, type ColumnDef, flexRender } from '@tanstack/react-table';
import StatusTag from './StatusTag';
import PageJump from './PageJump';
import PaginationButton from './PaginationButton';
import PageSizeSelector from './PageSizeSelector';
import dayjs from 'dayjs';

export type UsageData = Record<string, string | number>;

type HeaderType = {
    name: string,
    id: string
}

const CustomTable = ({header, data}:{header:HeaderType[], data: UsageData[]}) => {
    const columns:ColumnDef<UsageData>[] = header.map((item) => ({
        accessorKey: item.id,
        header: item.name,
        cell: ({getValue, row}) => {
            const value = getValue() as string;
            const rowData = row.original;

            if(item.id === 'status'){
                if(value) return <StatusTag value={value}/>
                else {
                    const start = rowData['start_at'];
                    const end = rowData['end_at'];
                    const now = dayjs();

                    const statusValue = now.isAfter(dayjs(start)) && now.isBefore(dayjs(end)) ? 'USE' : 'NOT_USE';
                    return <StatusTag value={statusValue}/>
                }
            } 
            else if(item.id === 'sex'){
                const sex = value === 'MALE' ? '남' : '여'
                return <p>{sex}</p>
            }
            else if(item.id === 'age'){
                let age;

                switch(value){
                    case 'MIDDLE': 
                        age ='중학생'
                        break
                    case 'HIGH':
                        age ='고등학생'
                        break
                }
                return <p>{age}</p>
            }
            return <p>{value}</p>
        },
    }))
    
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    return(
        <div className='flex-1 border-1 border-gray-200 rounded-xl overflow-hidden mb-[50px]'>
            <table className='w-full border-collapse table-fixed'>
                <thead>
                    {
                        table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className='border-b-1 border-gray-200 bg-gray-100 text-left'>
                                {
                                    headerGroup.headers.map((header) => (
                                        <th key={header.id} className='text-sm font-medium p-[10px]'>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody>
                    {
                        table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className='border-b-1 border-gray-200'>
                                {
                                    row.getVisibleCells().map((cell) =>(
                                        <td key={cell.id} className='p-[10px] text-sm'>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={header.length}>
                            <div className='flex justify-between items-center p-[10px]'>
                                <PageSizeSelector table={table}/>
                                <PaginationButton table={table}/>
                                <PageJump table={table}/>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default CustomTable;