import { useEffect, useMemo, useState } from "react";
import api from "@api/api";
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

const LinkOrDisabled = ({ href, text }) => {
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[var(--color-smu-navy)] font-semibold hover:text-[var(--color-smu-black)] transition"
      >
        {text} <span className="opacity-60">↗</span>
      </a>
    );
  }
  return <span className="text-[var(--color-smu-gray)]">{text}</span>;
};

function Badge({ tone = "gray", children }) {
  const cls =
    tone === "ok"
      ? "bg-[var(--color-smu-neonlime)] text-[var(--color-smu-black)]"
      : tone === "bad"
      ? "bg-red-50 text-red-600 border border-red-200"
      : tone === "info"
      ? "bg-[var(--color-smu-base)] text-[var(--color-smu-navy)] border border-gray-100"
      : "bg-white text-[var(--color-smu-gray)] border border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

function ActionButton({
  variant = "ghost",
  disabled,
  onClick,
  children,
  title,
}) {
  const base =
    "px-3 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";
  const cls =
    variant === "primary"
      ? "bg-[var(--color-smu-navy)] text-[var(--color-smu-base)] hover:bg-[var(--color-smu-neonlime)] hover:text-[var(--color-smu-black)]"
      : variant === "danger"
      ? "bg-white border border-red-200 text-red-600 hover:bg-red-50"
      : "bg-white border border-gray-200 text-[var(--color-smu-navy)] hover:border-[var(--color-smu-navy)] hover:bg-[var(--color-smu-base)]";
  return (
    <button
      type="button"
      className={`${base} ${cls}`}
      disabled={disabled}
      onClick={onClick}
      title={title}
    >
      {children}
    </button>
  );
}

function FieldRow({ label, children, right }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-16 text-xs text-[var(--color-smu-gray)]">{label}</div>
        <div className="text-sm text-[var(--color-smu-black)] truncate">
          {children}
        </div>
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export default function ProfileSection({ user, canEdit = false, onUpdated }) {
  // githubUrl 없더라도 GitHub OAuth면 username이 github login일 가능성
  const computedGithubUrl = useMemo(() => {
    const direct = user?.githubUrl ?? user?.github_url;
    if (direct) return direct;
    const login = user?.githubLogin ?? user?.github_login ?? user?.username;
    return login ? `https://github.com/${login}` : "";
  }, [user]);

  const initial = useMemo(
    () => ({
      nickname: user?.nickname ?? user?.username ?? "",
      email: user?.email ?? "",
      githubUrl: user?.githubUrl ?? computedGithubUrl ?? "",
      techblogUrl: user?.techblogUrl ?? user?.blogUrl ?? "",
    }),
    [user, computedGithubUrl]
  );

  const [editKey, setEditKey] = useState(null);
  const [draft, setDraft] = useState({
    nickname: "",
    email: "",
    githubUrl: "",
    techblogUrl: "",
  });

  const [saving, setSaving] = useState({
    nickname: false,
    email: false,
    githubUrl: false,
    techblogUrl: false,
  });

  const [msg, setMsg] = useState({
    nickname: { tone: "gray", text: "" },
    email: { tone: "gray", text: "" },
    githubUrl: { tone: "gray", text: "" },
    techblogUrl: { tone: "gray", text: "" },
  });

  // 닉네임 중복 체크
  const [nickCheck, setNickCheck] = useState({ status: "idle", msg: "" });
  // idle | checking | ok | bad

  useEffect(() => {
    setDraft(initial);
    setEditKey(null);
    setMsg({
      nickname: { tone: "gray", text: "" },
      email: { tone: "gray", text: "" },
      githubUrl: { tone: "gray", text: "" },
      techblogUrl: { tone: "gray", text: "" },
    });
    setNickCheck({ status: "idle", msg: "" });
  }, [initial]);

  const startEdit = (k) => {
    setEditKey(k);
    setMsg((prev) => ({ ...prev, [k]: { tone: "gray", text: "" } }));
    if (k === "nickname") setNickCheck({ status: "idle", msg: "" });
  };

  const cancelEdit = (k) => {
    setDraft((prev) => ({ ...prev, [k]: initial[k] ?? "" }));
    setEditKey(null);
    setMsg((prev) => ({ ...prev, [k]: { tone: "gray", text: "" } }));
    if (k === "nickname") setNickCheck({ status: "idle", msg: "" });
  };

  const setField = (k) => (e) => {
    const v = e.target.value;
    setDraft((prev) => ({ ...prev, [k]: v }));
    setMsg((prev) => ({ ...prev, [k]: { tone: "gray", text: "" } }));
    if (k === "nickname") setNickCheck({ status: "idle", msg: "" });
  };

  const withSaving = async (k, fn) => {
    setSaving((p) => ({ ...p, [k]: true }));
    setMsg((p) => ({ ...p, [k]: { tone: "info", text: "저장 중..." } }));
    try {
      await fn();
      await onUpdated?.();
      setMsg((p) => ({ ...p, [k]: { tone: "ok", text: "저장 완료" } }));
      setEditKey(null);
    } catch (e) {
      setMsg((p) => ({
        ...p,
        [k]: {
          tone: "bad",
          text:
            e?.response?.data?.message ??
            `실패 (status=${e?.response?.status ?? "?"})`,
        },
      }));
    } finally {
      setSaving((p) => ({ ...p, [k]: false }));
    }
  };

  const runNicknameCheck = async () => {
    const nickname = normalize(draft.nickname);

    if (!nickname) {
      setNickCheck({ status: "bad", msg: "닉네임을 입력해주세요." });
      return;
    }

    setNickCheck({ status: "checking", msg: "확인 중..." });

    try {
      await checkNicknameAvailability(nickname);

      setNickCheck({ status: "ok", msg: "사용 가능" });
    } catch (e) {
      if (e?.response?.status === 409) {
        setNickCheck({ status: "bad", msg: "이미 사용 중" });
        return;
      }

      setNickCheck({ status: "bad", msg: "중복 확인 실패" });
    }
  };

  // ===== actions =====
  const saveNickname = async () => {
    const next = normalize(draft.nickname);
    const prev = normalize(initial.nickname);

    if (!next) {
      setMsg((p) => ({
        ...p,
        nickname: { tone: "bad", text: "닉네임을 입력해주세요." },
      }));
      return;
    }
    if (next === prev) {
      setMsg((p) => ({
        ...p,
        nickname: { tone: "info", text: "변경 사항 없음" },
      }));
      setEditKey(null);
      return;
    }
    if (nickCheck.status !== "ok") {
      setMsg((p) => ({
        ...p,
        nickname: { tone: "bad", text: "중복확인을 완료해주세요." },
      }));
      return;
    }

    await withSaving("nickname", async () => {
      await putNickname(next);
    });
  };

  const saveEmail = async () => {
    const next = normalize(draft.email);
    const prev = normalize(initial.email);

    if (next === prev) {
      setMsg((p) => ({ ...p, email: { tone: "info", text: "변경 사항 없음" } }));
      setEditKey(null);
      return;
    }

    await withSaving("email", async () => {
      if (next) await putEmail(next);
      else await deleteEmail();
    });
  };

  const deleteEmailOnly = async () => {
    if (!initial.email) {
      setMsg((p) => ({ ...p, email: { tone: "info", text: "삭제할 값 없음" } }));
      return;
    }
    await withSaving("email", async () => {
      await deleteEmail();
    });
  };

  const saveGithub = async () => {
    const next = normalize(draft.githubUrl);
    const prev = normalize(initial.githubUrl);

    if (next === prev) {
      setMsg((p) => ({
        ...p,
        githubUrl: { tone: "info", text: "변경 사항 없음" },
      }));
      setEditKey(null);
      return;
    }

    await withSaving("githubUrl", async () => {
      if (next) await putGithubUrl(next);
      else await deleteGithubUrl();
    });
  };

  const deleteGithubOnly = async () => {
    if (!normalize(initial.githubUrl)) {
      setMsg((p) => ({
        ...p,
        githubUrl: { tone: "info", text: "삭제할 값 없음" },
      }));
      return;
    }
    await withSaving("githubUrl", async () => {
      await deleteGithubUrl();
    });
  };

  const saveTechblog = async () => {
    const next = normalize(draft.techblogUrl);
    const prev = normalize(initial.techblogUrl);

    if (next === prev) {
      setMsg((p) => ({
        ...p,
        techblogUrl: { tone: "info", text: "변경 사항 없음" },
      }));
      setEditKey(null);
      return;
    }

    await withSaving("techblogUrl", async () => {
      if (next) await putTechblogUrl(next);
      else await deleteTechblogUrl();
    });
  };

  const deleteTechblogOnly = async () => {
    if (!normalize(initial.techblogUrl)) {
      setMsg((p) => ({
        ...p,
        techblogUrl: { tone: "info", text: "삭제할 값 없음" },
      }));
      return;
    }
    await withSaving("techblogUrl", async () => {
      await deleteTechblogUrl();
    });
  };

  const displayName = user?.nickname ?? user?.username ?? "USER";

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-5">
      {/* header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          {/* avatar (smaller) */}
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-[var(--color-smu-base)] border border-gray-100 shrink-0">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-[var(--color-smu-gray)] font-semibold">
                USER
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-2xl bg-[var(--color-smu-neonlime)] opacity-70" />
          </div>

          {/* name + quick links */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-[var(--color-smu-black)] truncate">
                {displayName}
              </h2>
              {msg.nickname.text ? (
                <Badge tone={msg.nickname.tone}>{msg.nickname.text}</Badge>
              ) : null}
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <LinkOrDisabled href={computedGithubUrl} text="github 바로가기" />
              <span className="text-[var(--color-smu-gray)]">·</span>
              <LinkOrDisabled
                href={user?.techblogUrl ?? user?.blogUrl}
                text="tech blog 바로가기"
              />
            </div>
          </div>
        </div>

        {/* small hint badge */}
        <Badge tone="info">Profile</Badge>
      </div>

      <div className="mt-4 border-t border-gray-100" />

      {/* compact fields */}
      <div className="mt-2">
        {/* Nickname */}
        <FieldRow
          label="nick"
          right={
            canEdit && editKey !== "nickname" ? (
              <ActionButton onClick={() => startEdit("nickname")}>수정</ActionButton>
            ) : null
          }
        >
          {editKey === "nickname" && canEdit ? (
            <div className="w-full">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  value={draft.nickname}
                  onChange={setField("nickname")}
                  className="
                    w-full rounded-xl px-3 py-2 text-sm
                    border border-gray-200 bg-white outline-none
                    focus:border-[var(--color-smu-navy)]
                    focus:ring-2 focus:ring-[var(--color-smu-navy)]/10
                    transition
                  "
                  placeholder="닉네임"
                />
                <ActionButton
                  onClick={runNicknameCheck}
                  disabled={nickCheck.status === "checking" || saving.nickname}
                >
                  {nickCheck.status === "checking" ? "확인중" : "중복확인"}
                </ActionButton>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <div className="text-xs">
                  {nickCheck.status !== "idle" ? (
                    nickCheck.status === "ok" ? (
                      <span className="text-[var(--color-smu-navy)] font-semibold">
                        {nickCheck.msg}
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold">
                        {nickCheck.msg}
                      </span>
                    )
                  ) : (
                    <span className="text-[var(--color-smu-gray)]">
                      중복확인 후 저장
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <ActionButton
                    onClick={() => cancelEdit("nickname")}
                    disabled={saving.nickname}
                  >
                    취소
                  </ActionButton>
                  <ActionButton
                    variant="primary"
                    onClick={saveNickname}
                    disabled={saving.nickname}
                  >
                    저장
                  </ActionButton>
                </div>
              </div>
            </div>
          ) : (
            <span className="font-semibold">
              {initial.nickname || (
                <span className="text-[var(--color-smu-gray)]">미등록</span>
              )}
            </span>
          )}
        </FieldRow>

        {/* Email */}
        <FieldRow
          label="email"
          right={
            canEdit && editKey !== "email" ? (
              <div className="flex gap-2">
                <ActionButton onClick={() => startEdit("email")}>
                  등록/변경
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={deleteEmailOnly}
                  disabled={saving.email}
                >
                  삭제
                </ActionButton>
              </div>
            ) : null
          }
        >
          {editKey === "email" && canEdit ? (
            <div className="w-full">
              <input
                value={draft.email}
                onChange={setField("email")}
                className="
                  w-full rounded-xl px-3 py-2 text-sm
                  border border-gray-200 bg-white outline-none
                  focus:border-[var(--color-smu-navy)]
                  focus:ring-2 focus:ring-[var(--color-smu-navy)]/10
                  transition
                "
                placeholder="example@email.com (비우면 삭제)"
              />

              <div className="mt-2 flex items-center justify-end gap-2">
                {msg.email.text ? <Badge tone={msg.email.tone}>{msg.email.text}</Badge> : null}
                <ActionButton onClick={() => cancelEdit("email")} disabled={saving.email}>
                  취소
                </ActionButton>
                <ActionButton variant="primary" onClick={saveEmail} disabled={saving.email}>
                  저장
                </ActionButton>
              </div>
            </div>
          ) : (
            <span className="text-[var(--color-smu-black)]">
              {initial.email ? (
                <span className="font-semibold">{initial.email}</span>
              ) : (
                <span className="text-[var(--color-smu-gray)]">미등록</span>
              )}
              {msg.email.text ? (
                <span className="ml-2">
                  <Badge tone={msg.email.tone}>{msg.email.text}</Badge>
                </span>
              ) : null}
            </span>
          )}
        </FieldRow>

        {/* GitHub URL */}
        <FieldRow
          label="github"
          right={
            canEdit && editKey !== "githubUrl" ? (
              <div className="flex gap-2">
                <ActionButton onClick={() => startEdit("githubUrl")}>
                  등록/변경
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={deleteGithubOnly}
                  disabled={saving.githubUrl}
                >
                  삭제
                </ActionButton>
              </div>
            ) : null
          }
        >
          {editKey === "githubUrl" && canEdit ? (
            <div className="w-full">
              <input
                value={draft.githubUrl}
                onChange={setField("githubUrl")}
                className="
                  w-full rounded-xl px-3 py-2 text-sm
                  border border-gray-200 bg-white outline-none
                  focus:border-[var(--color-smu-navy)]
                  focus:ring-2 focus:ring-[var(--color-smu-navy)]/10
                  transition
                "
                placeholder="https://github.com/username (비우면 삭제)"
              />

              <div className="mt-2 flex items-center justify-between gap-2">
                <LinkOrDisabled href={normalize(draft.githubUrl)} text="미리보기" />
                <div className="flex items-center gap-2">
                  {msg.githubUrl.text ? (
                    <Badge tone={msg.githubUrl.tone}>{msg.githubUrl.text}</Badge>
                  ) : null}
                  <ActionButton
                    onClick={() => cancelEdit("githubUrl")}
                    disabled={saving.githubUrl}
                  >
                    취소
                  </ActionButton>
                  <ActionButton
                    variant="primary"
                    onClick={saveGithub}
                    disabled={saving.githubUrl}
                  >
                    저장
                  </ActionButton>
                </div>
              </div>
            </div>
          ) : (
            <span>
              {normalize(initial.githubUrl) ? (
                <LinkOrDisabled href={initial.githubUrl} text="github 바로가기" />
              ) : (
                <span className="text-[var(--color-smu-gray)]">미등록</span>
              )}
              {msg.githubUrl.text ? (
                <span className="ml-2">
                  <Badge tone={msg.githubUrl.tone}>{msg.githubUrl.text}</Badge>
                </span>
              ) : null}
            </span>
          )}
        </FieldRow>

        {/* Tech Blog URL */}
        <FieldRow
          label="blog"
          right={
            canEdit && editKey !== "techblogUrl" ? (
              <div className="flex gap-2">
                <ActionButton onClick={() => startEdit("techblogUrl")}>
                  등록/변경
                </ActionButton>
                <ActionButton
                  variant="danger"
                  onClick={deleteTechblogOnly}
                  disabled={saving.techblogUrl}
                >
                  삭제
                </ActionButton>
              </div>
            ) : null
          }
        >
          {editKey === "techblogUrl" && canEdit ? (
            <div className="w-full">
              <input
                value={draft.techblogUrl}
                onChange={setField("techblogUrl")}
                className="
                  w-full rounded-xl px-3 py-2 text-sm
                  border border-gray-200 bg-white outline-none
                  focus:border-[var(--color-smu-navy)]
                  focus:ring-2 focus:ring-[var(--color-smu-navy)]/10
                  transition
                "
                placeholder="https://... (비우면 삭제)"
              />

              <div className="mt-2 flex items-center justify-between gap-2">
                <LinkOrDisabled href={normalize(draft.techblogUrl)} text="미리보기" />
                <div className="flex items-center gap-2">
                  {msg.techblogUrl.text ? (
                    <Badge tone={msg.techblogUrl.tone}>{msg.techblogUrl.text}</Badge>
                  ) : null}
                  <ActionButton
                    onClick={() => cancelEdit("techblogUrl")}
                    disabled={saving.techblogUrl}
                  >
                    취소
                  </ActionButton>
                  <ActionButton
                    variant="primary"
                    onClick={saveTechblog}
                    disabled={saving.techblogUrl}
                  >
                    저장
                  </ActionButton>
                </div>
              </div>
            </div>
          ) : (
            <span>
              {normalize(initial.techblogUrl) ? (
                <LinkOrDisabled href={initial.techblogUrl} text="tech blog 바로가기" />
              ) : (
                <span className="text-[var(--color-smu-gray)]">미등록</span>
              )}
              {msg.techblogUrl.text ? (
                <span className="ml-2">
                  <Badge tone={msg.techblogUrl.tone}>{msg.techblogUrl.text}</Badge>
                </span>
              ) : null}
            </span>
          )}
        </FieldRow>
      </div>

      {!canEdit && (
        <div className="mt-3 text-xs text-[var(--color-smu-gray)]">
          * 이 섹션은 읽기 전용입니다.
        </div>
      )}
    </div>
  );
}