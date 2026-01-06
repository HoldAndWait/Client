import MainLayout from "@layout/index";
import Community from "@pages/community/index";

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
        element: <Community />,
      },
    ],
  },
];

export default routerInfo;