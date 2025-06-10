type UsageData = Record<string, string>;

type HeaderType = {
    name: string,
    id: string
}


const CustomTable = ({header, data}:{header:HeaderType[], data: UsageData[]}) => {
    return(
        <div className="w-full flex justify-center">
            <table className="w-full table-fixed">
                <thead className="bg-danuri-100">
                    <tr>
                        {
                            header.map((item) => (
                                <th className="font-normal p-[20px] text-danuri-text" key={item.id}>{item.name}</th>
                            ))
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.map((item) => (
                            <tr>
                                {
                                    header.map((i) => (
                                        <td className={`${i.id === 'user' ? 'text-danuri-400' :'text-danuri-text'} text-center p-[20px]`}>{item[i.id]}</td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            
        </div>
    )
}

export default CustomTable;