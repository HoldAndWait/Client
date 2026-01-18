import React from 'react';
import MyPageLoggedIn from "@pages/MyPage/MyPageLoggedIn";
import MyPageLoggedOut from "@pages/MyPage/MyPageLoggedOut";

// 임시
const useAuthMock = () => ({ user: null, isLoading: false});

const MyPageGate = () => {

  const { user, isLoading } = useAuthMock();

  if(isLoading){
    return(
      <div className="min-h-screen bg-blue-200">
        로딩중..
      </div>
    )
  }

  return user ? <MyPageLoggedIn user={user} /> : <MyPageLoggedOut/>;
};

export default MyPageGate;