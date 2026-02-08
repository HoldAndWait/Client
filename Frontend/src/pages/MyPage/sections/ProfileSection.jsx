import { useEffect, useMemo, useState } from "react";
import {
  putEmail,
  deleteEmail,
  putNickname,
  checkNicknameAvailability,
  putGithubUrl,
  deleteGithubUrl,
  putTechblogUrl,
  deleteTechblogUrl,
} from "@api/users";

const normalize = (v) => (v ?? "").trim();

const FieldRow = ({ label, children }) => (
  <div className="flex items-center gap-3 text-sm">
    <div className="w-24 text-gray-500">{label}</div>
    <div className="flex-1">{children}</div>
  </div>
);

const LinkOrDisabled = ({ href, text }) => {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-smu-navy hover:underline"
      >
        {text}
      </a>
    );
  }
  return <span className="text-gray-400">{text}</span>;
};

export default function ProfileSection({ user, canEdit = false, onUpdated }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // 닉네임 중복 체크 관련
  const [nickCheck, setNickCheck] = useState({ status: "idle", msg: "" });
  // idle | checking | ok | bad

  // ✅ 백엔드에 githubUrl이 없더라도, GitHub OAuth면 username이 github login일 가능성 높음
  // (정확한 필드명이 따로 있으면 여기를 바꿔주면 됨)
  const computedGithubUrl = useMemo(() => {
    const direct = user?.githubUrl ?? user?.github_url;
    if (direct) return direct;
    const login = user?.githubLogin ?? user?.github_login ?? user?.username;
    return login ? `https://github.com/${login}` : "";
  }, [user]);

  const [form, setForm] = useState({
    nickname: "",
    email: "",
    githubUrl: "",
    techblogUrl: "",
  });

  // user가 바뀌면 폼 초기화
  useEffect(() => {
    setForm({
      nickname: user?.nickname ?? user?.username ?? "",
      email: user?.email ?? "",
      githubUrl: user?.githubUrl ?? computedGithubUrl ?? "",
      techblogUrl: user?.techblogUrl ?? user?.blogUrl ?? "",
    });
    setNickCheck({ status: "idle", msg: "" });
    setErrMsg("");
  }, [user, computedGithubUrl]);

  const close = () => {
    setOpen(false);
    setErrMsg("");
    setNickCheck({ status: "idle", msg: "" });
  };

  const setField = (k) => (e) => {
    const v = e.target.value;
    setForm((prev) => ({ ...prev, [k]: v }));
    if (k === "nickname") setNickCheck({ status: "idle", msg: "" });
  };

  const runNicknameCheck = async () => {
    const nickname = normalize(form.nickname);
    if (!nickname) {
      setNickCheck({ status: "bad", msg: "닉네임을 입력해주세요." });
      return;
    }
    setNickCheck({ status: "checking", msg: "확인 중..." });
    try {
      const res = await checkNicknameAvailability(nickname);
      // ⚠️ 응답 형태가 boolean인지 {available:true}인지 몰라서 둘 다 대응
      const available =
        res.data === true ||
        res.data?.available === true ||
        res.data?.isAvailable === true;

      if (available) setNickCheck({ status: "ok", msg: "사용 가능한 닉네임입니다." });
      else setNickCheck({ status: "bad", msg: "이미 사용 중인 닉네임입니다." });
    } catch (e) {
      setNickCheck({ status: "bad", msg: "중복 확인 실패" });
    }
  };

  const save = async () => {
    setSaving(true);
    setErrMsg("");

    try {
      const next = {
        nickname: normalize(form.nickname),
        email: normalize(form.email),
        githubUrl: normalize(form.githubUrl),
        techblogUrl: normalize(form.techblogUrl),
      };

      const prev = {
        nickname: normalize(user?.nickname ?? user?.username),
        email: normalize(user?.email),
        githubUrl: normalize(user?.githubUrl ?? computedGithubUrl),
        techblogUrl: normalize(user?.techblogUrl ?? user?.blogUrl),
      };

      const tasks = [];

      // 닉네임 PUT (변경 시)
      if (next.nickname && next.nickname !== prev.nickname) {
        // 원하면 여기서 nickCheck ok일 때만 저장하도록 제한 가능
        tasks.push(putNickname(next.nickname));
      }

      // 이메일: 비면 DELETE, 아니면 PUT (변경 시)
      if (next.email !== prev.email) {
        if (next.email) tasks.push(putEmail(next.email));
        else tasks.push(deleteEmail());
      }

      // github-url: 비면 DELETE, 아니면 PUT (변경 시)
      if (next.githubUrl !== prev.githubUrl) {
        if (next.githubUrl) tasks.push(putGithubUrl(next.githubUrl));
        else tasks.push(deleteGithubUrl());
      }

      // techblog-url: 비면 DELETE, 아니면 PUT (변경 시)
      if (next.techblogUrl !== prev.techblogUrl) {
        if (next.techblogUrl) tasks.push(putTechblogUrl(next.techblogUrl));
        else tasks.push(deleteTechblogUrl());
      }

      if (tasks.length === 0) {
        close();
        return;
      }

      await Promise.all(tasks);

      // ✅ 저장 성공 → 부모에서 다시 me 조회해서 동기화
      await onUpdated?.();
      close();
    } catch (e) {
      setErrMsg(
        e?.response?.data?.message ??
          `저장 실패 (status=${e?.response?.status ?? "?"})`
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex gap-10">
      {/* 프로필 이미지 */}
      <div className="w-36 h-36 rounded-full bg-gray-300 shrink-0 overflow-hidden">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : null}
      </div>

      {/* 표시 영역 */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">
            {user?.nickname ?? user?.username ?? "USER"}
          </h2>

          {canEdit && (
            <button
              onClick={() => setOpen(true)}
              className="text-gray-500 hover:text-black"
              aria-label="프로필 수정"
              title="프로필 수정"
            >
              ✏️
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <FieldRow label="email">
            {user?.email ? (
              <span className="text-gray-700">{user.email}</span>
            ) : (
              <span className="text-gray-400">미등록</span>
            )}
          </FieldRow>

          <FieldRow label="github">
            <LinkOrDisabled href={computedGithubUrl} text="github 바로가기" />
          </FieldRow>

          <FieldRow label="tech blog">
            <LinkOrDisabled href={user?.techblogUrl ?? user?.blogUrl} text="tech blog 바로가기" />
          </FieldRow>
        </div>
      </div>

      {/* 편집 모달 */}
      {canEdit && open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">프로필 수정</h3>
              <button onClick={close} className="text-gray-500 hover:text-black">
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500 mb-1">닉네임</div>
                <div className="flex gap-2">
                  <input
                    value={form.nickname}
                    onChange={setField("nickname")}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="닉네임"
                  />
                  <button
                    onClick={runNicknameCheck}
                    className="px-3 py-2 rounded-lg border hover:bg-gray-50 text-sm"
                    disabled={nickCheck.status === "checking"}
                  >
                    {nickCheck.status === "checking" ? "확인중" : "중복확인"}
                  </button>
                </div>
                {nickCheck.status !== "idle" && (
                  <div
                    className={`mt-1 text-xs ${
                      nickCheck.status === "ok" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {nickCheck.msg}
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">이메일</div>
                <input
                  value={form.email}
                  onChange={setField("email")}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="example@email.com (비우면 삭제)"
                />
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">GitHub URL</div>
                <input
                  value={form.githubUrl}
                  onChange={setField("githubUrl")}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="https://github.com/username (비우면 삭제)"
                />
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Tech Blog URL</div>
                <input
                  value={form.techblogUrl}
                  onChange={setField("techblogUrl")}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="https://... (비우면 삭제)"
                />
              </div>

              {errMsg && <div className="text-sm text-red-500">{errMsg}</div>}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={close}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
                disabled={saving}
              >
                취소
              </button>
              <button
                onClick={save}
                className="px-4 py-2 rounded-lg bg-smu-black text-white hover:text-smu-neonlime disabled:opacity-50"
                disabled={saving}
              >
                {saving ? "저장중..." : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
