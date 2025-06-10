import { NavLink } from "react-router-dom";

const navList = [
    {name: '이용 현황', path: '/'},
    {name: '물품 관리', path: '/item'},
    {name: '정보 관리', path: '/info'},
    {name: '사용자 관리', path: '/user'},
];

const SideNav = () => {
    return(
        <div className="flex flex-col w-2xs p-[50px] pt-[100px] h-screen border-r border-gray-200">
            {
                navList.map((item) => (
                    <NavLink className={({isActive}) => `${isActive ? 'text-danuri-400 bg-danuri-200' : 'text-black bg-white'} w-full h-[50px] rounded-md flex items-center p-[12px] text-lg mb-[20px] font-semibold`} to={item.path}>{item.name}</NavLink>
                ))
            }
        </div>
    )
}

export default SideNav;