import { useEffect, useState } from "react";
import { getMyUser } from "@api/users";
import ProfileSection from "@pages/MyPage/sections/ProfileSection";

const MyPageLoggedIn = () => {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const fetchMe = async () => {
    setLoading(true);
    setErrMsg("");
    try {
      const res = await getMyUser();
      setMe(res.data);
    } catch (e) {
      setErrMsg(
        e?.response?.data?.message ??
          `내 정보 조회 실패 (status=${e?.response?.status ?? "?"})`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  if (loading) return <div className="p-8">내 정보 불러오는 중...</div>;
  if (errMsg) return <div className="p-8 text-red-500">{errMsg}</div>;
  if (!me) return <div className="p-8">유저 정보가 없습니다.</div>;

  return (
    <div>
      <div className="bg-white rounded-2xl shadow p-8">
        <ProfileSection user={me} canEdit onUpdated={fetchMe} />
      </div>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-7 space-y-6"></div>
        <div className="col-span-12 lg:col-span-5 space-y-6"></div>
      </div>
    </div>
  );
};

export default MyPageLoggedIn;
