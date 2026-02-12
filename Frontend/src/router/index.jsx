import MainLayout from "@layout/index";
import CommunityListPage from "@pages/Community/CommunityListPage";
import CommunityWritePage from "@pages/Community/CommunityWritePage";
import CommunityDetailPage from "@pages/Community/CommunityDeatailPage";
import ProblemListPage from "@pages/Problems/ProblemListPage";
import ProblemDetailPage from "@pages/Problems/ProblemDetail";
import MyPage from "@pages/MyPage/MyPageGate";

const routerInfo = [
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
        path: "community/:postId",
        element: <CommunityDetailPage />,
      },
      {
        path: "problems",
        element: <ProblemListPage />,
      },
      {
        path: "problems/detail",
        element: <ProblemDetailPage />,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
    ],
  },
];

export default routerInfo;