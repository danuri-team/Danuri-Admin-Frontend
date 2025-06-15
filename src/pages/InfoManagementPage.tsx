//import CustomInput from "../components/CustomInput";
import MainHeader from "../components/MainHeader";

const InfoManagementPage = () => {
    return(
        <div className="flex w-screen">
            <MainHeader />
            <div className="flex-1 m-[40px] mt-[60px] mb-[60px] flex flex-col">
                <div className="mb-[30px] flex items-center justify-between">
                    <h1 className="text-2xl font-bold">정보 관리</h1>
                </div>
                {/* <CustomInput label="기관 이름"/>
                <CustomInput label="관리자 전화번호"/>
                <CustomInput label="관리자 이메일"/> */}
            </div>
        </div>
    )
}

export default InfoManagementPage;