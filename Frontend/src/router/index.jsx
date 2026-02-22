import MainLayout from "@layout/index";
import HomePage from "@pages/Home";
import RankingPage from "@pages/Ranking/MainRanking";
import ArchivePage from "@pages/ArchivePage/MainArchive";
import CommunityListPage from "@pages/Community/CommunityListPage";
import CommunityWritePage from "@pages/Community/CommunityWritePage";
import CommunityEditPage from "@pages/Community/CommunityEditPage";
import CommunityDetailPage from "@pages/Community/CommunityDetailPage";
import ProblemListPage from "@pages/Problems/ProblemListPage";
import ProblemDetailPage from "@pages/Problems/ProblemDetail";
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
        element: <HomePage/>,
      },
      {
        path: "ranking",
        element: <RankingPage/>,
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
        path: "problems/detail",
        element: <ProblemDetailPage />,
      },
      {
        path: "archive",
        element: <ArchivePage/>,
      },
      {
        path: "mypage",
        element: <MyPage />,
      },
    ],
  },
];

export default routerInfo;