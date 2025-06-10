type UsageData = {
    place: string,
    startTime:string, 
    endTime: string, 
    user: string
}


const CustomTable = ({header, data}:{header:string[], data: UsageData[]}) => {
    return(
        <div className="w-full flex justify-center">
            <table className="w-full table-fixed">
                <thead className="bg-danuri-100">
                    <tr>
                        {
                            header.map((item) => (
                                <th className="font-normal p-[20px] text-danuri-text" key={item}>{item}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item) => (
                            <tr>
                                <td className="text-center text-danuri-text ">{item.place}</td>
                                <td className="text-center text-danuri-text">{item.startTime}</td>
                                <td className="text-center text-danuri-text p-[20px]">{item.endTime}</td>
                                <td className="text-center text-danuri-400 p-[10px]">{item.user}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            
        </div>
    )
}

export default CustomTable;