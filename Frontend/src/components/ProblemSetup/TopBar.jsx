export default function TopBar() {
  return (
    <header className="w-full border-b bg-white">
      <div className="h-[56px] px-4 flex items-center gap-0">
        {/* 로고 */}
        <button className="h-10 px-4 border rounded-sm text-sm font-medium">
          로고 (현재 이 줄 아무 기능 없음)
        </button>

        {/* 가운데 큰 빈 영역 */}
        <div className="flex-1" />

        {/* 실행 / 제출 */}
        <div className="h-10 flex border rounded-sm overflow-hidden">
          <button className="px-4 text-sm font-medium hover:bg-gray-50">
            실행
          </button>
          <div className="w-px bg-gray-300" />
          <button className="px-4 text-sm font-medium hover:bg-gray-50">
            제출
          </button>
        </div>

        {/* 우측 메뉴 */}
        <div className="ml-auto h-10 flex border rounded-sm overflow-hidden">
          <button className="px-4 text-sm font-medium hover:bg-gray-50">
            스톱워치
          </button>
          <div className="w-px bg-gray-300" />
          <button className="px-4 text-sm font-medium hover:bg-gray-50">
            메모
          </button>
          <div className="w-px bg-gray-300" />
          <button className="px-4 text-sm font-medium hover:bg-gray-50">
            설정
          </button>
          <div className="w-px bg-gray-300" />
          <button className="px-4 text-sm font-medium hover:bg-gray-50">
            프로필
          </button>
        </div>
      </div>
    </header>
  );
}
