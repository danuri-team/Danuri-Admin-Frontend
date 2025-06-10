import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

const PagenationButton = () => {
    return(
        <div className="">
            <button className="bg-danuri-100 p-[15px] rounded-md mr-[10px] cursor-pointer"><IoIosArrowBack /></button>
            <button className="bg-danuri-100 p-[15px] rounded-md cursor-pointer"><IoIosArrowForward /></button>
        </div>
    )
}

export default PagenationButton