import { Link } from "react-router-dom";
import { BsPersonFill } from "react-icons/bs";
import { useState } from "react";

const navList = [
  { name: "계정", menu: [{ name: "유저", path: "/user" }] },
  {
    name: "자산",
    menu: [
      { name: "공간", path: "/space" },
      { name: "디바이스", path: "/machine" },
      { name: "아이템", path: "/item" },
    ],
  },
  {
    name: "내역",
    menu: [
      { name: "공간 이용", path: "/usage" },
      { name: "아이템 대여", path: "/rental" },
    ],
  },
];

const MainHeader = () => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState<string | null>(null);

  return (
    <nav
      className=" h-[72px] flex items-center justify-center border-b-1 border-gray-200 pl-[60px] pr-[60px] text-nowrap sticky top-0 bg-white z-1"
      role="navigation"
      aria-label="네비게이션"
    >
      <div className="flex-1 w-full max-w-360 flex items-center justify-between ">
        <Link to={"/usage"} aria-label="홈으로 이동">
          <h1 className="text-2xl font-bold">다누리</h1>
        </Link>
        <div className="flex">
          {navList.map((item) => (
            <div className="relative" key={item.name}>
              <p
                className="text-base font-semibold m-[20px] cursor-pointer"
                onBlur={() => setIsNavMenuOpen(null)}
                onClick={() => setIsNavMenuOpen(item.name)}
              >
                {item.name}
              </p>
              {isNavMenuOpen === item.name && (
                <div className="absolute left-[-120px] top-[80px] flex flex-col bg-white px-[32px] py-[19px] shadow-[-2px_-2px_4px_-1px_rgba(0,0,0,0.1),2px_2px_4px_-1px_rgba(0,0,0,0.1)]/7 rounded-[20px]">
                  {item.menu.map((menuItem) => (
                    <Link
                      key={menuItem.name}
                      className="text-base font-semibold py-[11px] w-[240px]"
                      to={menuItem.path}
                    >
                      {menuItem.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center text-sm font-medium w-[120px] gap-[10px]">
          <Link
            className="flex bg-gray-200 border-1 border-gray-300 rounded-full w-[25px] h-[25px] items-center justify-center"
            to={"/info"}
            aria-label="사용자 정보"
          >
            <BsPersonFill size={20} color="white" />
          </Link>
          <Link
            className="flex border-1 border-gray-200 rounded-md p-[5px] w-[80px] justify-center"
            to={"/usage"}
          >
            대시보드
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default MainHeader;
