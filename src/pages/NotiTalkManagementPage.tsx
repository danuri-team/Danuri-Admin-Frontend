import BannerButton from "../components/BannerButton";
import MainHeader from "../components/MainHeader";

const NotiTalkManagementPage = () => {
    return(
        <div className="w-full">
            <MainHeader />
            <BannerButton />
            <div className="flex-1 mr-[50px] ml-[50px] text-nowrap">
                <div className="mr-[20px] ml-[20px] mb-[30px] flex justify-between">
                    <div className="flex items-center">
                        <h1 className="text-xl font-bold">알림톡 템플릿 관리</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NotiTalkManagementPage;