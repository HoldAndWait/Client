import MyPageLoggedIn from "@pages/MyPage/MyPageLoggedIn";
import MyPageLoggedOut from "@pages/MyPage/MyPageLoggedOut";
import useAuth from "@hooks/useAuth";

const MyPageGate = () => {
  const { isAuthed, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-200">
        로딩중..
      </div>
    );
  }

  return isAuthed ? <MyPageLoggedIn /> : <MyPageLoggedOut />;
};

export default MyPageGate;
