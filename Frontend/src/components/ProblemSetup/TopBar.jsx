export default function TopBar({ onRun, onSubmit, isBusy, busyLabel }) {
  return (
    <header className="w-full border-b bg-white">
      <div className="h-[56px] px-4 flex items-center gap-0">
        <button className="h-10 px-4 border rounded-sm text-sm font-medium">
          로고 (현재 이 줄 아무 기능 없음)
        </button>

        <div className="flex-1" />

        {/* 실행 / 제출 */}
        <div className="h-10 flex border rounded-sm overflow-hidden">
          <button
            className={`px-4 text-sm font-medium hover:bg-gray-50 ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onRun}
            disabled={isBusy}
            title={isBusy ? busyLabel : "실행"}
          >
            {isBusy && busyLabel?.startsWith("실행") ? "실행 중..." : "실행"}
          </button>
          <div className="w-px bg-gray-300" />
          <button
            className={`px-4 text-sm font-medium hover:bg-gray-50 ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={onSubmit}
            disabled={isBusy}
            title={isBusy ? busyLabel : "제출"}
          >
            {isBusy && busyLabel?.startsWith("제출") ? "제출 중..." : "제출"}
          </button>
        </div>

        <div className="ml-3 text-xs text-gray-500 min-w-[110px]">
          {isBusy ? busyLabel : ""}
        </div>

        {/* 우측 메뉴 */}
        <div className="ml-auto h-10 flex border rounded-sm overflow-hidden">
          <button className="px-4 text-sm font-medium hover:bg-gray-50">스톱워치</button>
          <div className="w-px bg-gray-300" />
          <button className="px-4 text-sm font-medium hover:bg-gray-50">메모</button>
          <div className="w-px bg-gray-300" />
          <button className="px-4 text-sm font-medium hover:bg-gray-50">설정</button>
          <div className="w-px bg-gray-300" />
          <button className="px-4 text-sm font-medium hover:bg-gray-50">프로필</button>
        </div>
      </div>
    </header>
  );
}
