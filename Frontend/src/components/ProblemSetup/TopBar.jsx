export default function TopBar({ onRun, onSubmit, isBusy, busyLabel }) {
  const runBusy = isBusy && busyLabel?.startsWith("실행");
  const submitBusy = isBusy && busyLabel?.startsWith("제출");

  const btnBase =
    "h-10 px-4 text-sm font-semibold text-smu-navy transition-colors";
  const disabled = isBusy ? "opacity-50 cursor-not-allowed" : "";
  const hoverable = isBusy ? "" : "hover:bg-smu-base";

  return (
    <header className="w-full border-b border-smu-gray/20 bg-white">
      <div className="h-[56px] px-4 flex items-center gap-0">
        {/* Logo */}
        <button className="h-10 px-4 rounded-lg border border-smu-gray/25 bg-smu-base text-sm font-semibold text-smu-black hover:bg-white transition-colors">
          로고 (현재 이 줄 아무 기능 없음)
        </button>

        <div className="flex-1" />

        {/* 실행 / 제출 */}
        <div className="h-10 flex overflow-hidden rounded-lg border border-smu-gray/25 bg-white">
          <button
            className={[
              btnBase,
              hoverable,
              disabled,
              runBusy ? "bg-smu-neonlime/20 text-smu-black" : "",
            ].join(" ")}
            onClick={onRun}
            disabled={isBusy}
            title={isBusy ? busyLabel : "실행"}
          >
            {runBusy ? "실행 중..." : "실행"}
          </button>

          <div className="w-px bg-smu-gray/20" />

          <button
            className={[
              btnBase,
              hoverable,
              disabled,
              submitBusy ? "bg-smu-neonlime/20 text-smu-black" : "",
            ].join(" ")}
            onClick={onSubmit}
            disabled={isBusy}
            title={isBusy ? busyLabel : "제출"}
          >
            {submitBusy ? "제출 중..." : "제출"}
          </button>
        </div>

        {/* Busy label */}
        <div className="ml-3 min-w-[110px]">
          {isBusy ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-smu-gray/25 bg-smu-base px-3 py-1 text-xs font-medium text-smu-navy">
              <span className="inline-block h-2 w-2 rounded-full bg-smu-neonlime" />
              {busyLabel}
            </span>
          ) : (
            <span className="text-xs text-smu-gray">&nbsp;</span>
          )}
        </div>

        {/* 우측 메뉴 */}
        <div className="ml-auto h-10 flex overflow-hidden rounded-lg border border-smu-gray/25 bg-white">
          <TopBarMenuButton>스톱워치</TopBarMenuButton>
          <div className="w-px bg-smu-gray/20" />
          <TopBarMenuButton>메모</TopBarMenuButton>
          <div className="w-px bg-smu-gray/20" />
          <TopBarMenuButton>설정</TopBarMenuButton>
          <div className="w-px bg-smu-gray/20" />
          <TopBarMenuButton>북마크</TopBarMenuButton>
        </div>
      </div>
    </header>
  );
}

function TopBarMenuButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-10 px-4 text-sm font-semibold text-smu-navy transition-colors hover:bg-smu-base"
    >
      {children}
    </button>
  );
}