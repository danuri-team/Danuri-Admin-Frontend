import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex h-screen">
      <div className="w-sm h-[400px] m-auto">
        <h1 className="text-3xl font-semibold mb-[50px]">페이지를 찾을 수 없습니다.</h1>
        <Link className="text-danuri-500 underline" to={"/auth/login"}>
          로그인으로 돌아가기
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
