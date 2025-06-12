import { Link } from "react-router-dom";
import { BsPersonFill } from "react-icons/bs";

const navList = [
    {name: '이용 현황', path: '/usage'},
    {name: '물품 관리', path: '/item'},
    {name: '정보 관리', path: '/info'},
    {name: '사용자 관리', path: '/user'},
    {name: '대여 관리', path: '/user'},
];

const MainHeader = () => {
    return(
        <div className="flex items-center justify-between h-[72px] border-b-1 border-gray-200 pl-[60px] pr-[60px] text-nowrap">
            <h1 className="text-2xl font-bold">다누리</h1>
            <div>
                {
                    navList.map((item) => (
                        <Link className="text-base font-semibold m-[20px]" to={item.path}>{item.name}</Link>
                    ))
                }
            </div>
            <div className="flex items-center text-sm font-medium w-[120px] gap-[10px]">
                <Link className="flex bg-gray-200 border-1 border-gray-300 rounded-full w-[25px] h-[25px] items-center justify-center" to={'/info'}><BsPersonFill size={20} color="white"/></Link>
                <Link className="flex border-1 border-gray-200 rounded-md p-[5px] w-[80px] justify-center" to={'/usage'}>대시보드</Link>
            </div>
        </div>
    )
}

export default MainHeader;