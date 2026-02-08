import MainLayout from "@layout/index";
import CommunityListPage from "@pages/Community/CommunityListPage";
import CommunityWritePage from "@pages/Community/CommunityWritePage";
import CommunityEditPage from "@pages/Community/CommunityEditPage";
import CommunityDetailPage from "@pages/Community/CommunityDetailPage";
import ProblemListPage from "@pages/Problems/ProblemListPage";
import MyPage from "@pages/MyPage/MyPageGate";
import AuthCallbackPage from "@pages/AuthCallbackPage";

const routerInfo = [
  { 
    path: "auth/callback", 
    element: <AuthCallbackPage /> 
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <div className="p-10 text-2xl">홈 화면입니다!</div>,
      },
      {
        path: "community",
        element: <CommunityListPage />,
      },
      {
        path: "communitywrite",
        element: <CommunityWritePage />,
      },
      {
        path: "community/:postId/edit",
        element: <CommunityEditPage />,
      },
      {
        path: "community/:postId",
        element: <CommunityDetailPage />,
      },
      {
        path: "problems",
        element: <ProblemListPage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
    ],
  },
];

export default routerInfo;