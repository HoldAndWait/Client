export default function ProblemStatement() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-xl font-bold">#1330 두 수 비교하기</div>
        <div className="text-sm text-gray-500 mt-1">
          시간 제한 1초 · 메모리 제한 128MB · 정답률 32.49%
        </div>
      </div>

      <section>
        <div className="font-semibold mb-2">문제 설명</div>
        <p className="text-sm leading-6 text-gray-800">
          두 정수 A와 B가 주어졌을 때, A와 B를 비교하는 프로그램을 작성하시오.
        </p>
      </section>

      <section>
        <div className="font-semibold mb-2">제한 사항</div>
        <ul className="list-disc pl-5 text-sm leading-6 text-gray-800">
          <li>A, B &lt; 10,000</li>
        </ul>
      </section>

      <section>
        <div className="font-semibold mb-2">예제</div>
        <div className="space-y-2 text-sm">
          <div className="border rounded p-3">
            <div className="font-medium mb-1">테스트 케이스 1</div>
            <div>Input: A = 1, B = 2</div>
            <div>Output: &quot;&lt;&quot;</div>
          </div>

          <div className="border rounded p-3">
            <div className="font-medium mb-1">테스트 케이스 2</div>
            <div>Input: A = 2, B = 1</div>
            <div>Output: &quot;&gt;&quot;</div>
          </div>

          <div className="border rounded p-3">
            <div className="font-medium mb-1">테스트 케이스 3</div>
            <div>Input: A = 1, B = 1</div>
            <div>Output: &quot;==&quot;</div>
          </div>
        </div>
      </section>

      <div className="text-xs text-gray-400">출제자: FickleBoBo</div>
    </div>
  );
}
