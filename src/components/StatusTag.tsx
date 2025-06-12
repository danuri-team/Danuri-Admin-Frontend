const valueChange:Record<string,string> = {
    'NOT_AVAILABLE':'이용불가',
    'AVAILABLE':'이용가능'
}

const StatusTag = ({value}:{value:string}) => {
    return(
        <div className={`${value.includes('NOT') ? 'text-danuri-text bg-gray-100' : 'text-danuri-400 bg-danuri-200'} text-xs rounded-sm w-fit p-[2px]`}>
            {valueChange[value]}
        </div>
    )
}

export default StatusTag;