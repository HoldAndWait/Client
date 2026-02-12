import TopBar from "@components/ProblemSetup/TopBar";
import ProblemPane from "@components/ProblemSetup/ProblemPane";
import EditorPane from "@components/ProblemSetup/EditorPane";
import TestPane from "@components/ProblemSetup/TestPane";

export default function ProblemDetail() {
  return (
    <div className="w-full h-screen flex flex-col">
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="w-[40%] min-w-[320px] border-r overflow-hidden">
          <ProblemPane />
        </div>

        {/*오른쪽 컬럼이 flex-1 + flex-col + overflow-hidden */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 border-b overflow-hidden">
            <EditorPane />
          </div>
          <div className="h-[50%] min-h-[220px] overflow-hidden">
            <TestPane />
          </div>
        </div>
      </div>
    </div>

  );
}
