import { useSelector } from "react-redux"
import type { RootState } from "../redux/store"
import { Link } from "react-router-dom";

const NotFoundPage = () => {
    const authState = useSelector((state:RootState)=>state.auth);
    const accessToken = authState.access_token;
    return (
        <div className="flex h-screen">
            <div className="w-sm h-[400px] m-auto">
                <h1 className="text-3xl font-semibold mb-[50px]">페이지를 찾을 수 없습니다.</h1>
                {
                    accessToken ?
                        <Link className="text-danuri-500 underline" to={'/usage'}>이용현황으로 돌아가기</Link> 
                        : <Link className="text-danuri-500 underline" to={'/auth/login'}>로그인으로 돌아가기</Link>
                }
            </div>
        </div>
    )
}

export default NotFoundPage;