import { useState } from "react";
import Editor from "@monaco-editor/react";

export default function EditorPane() {
  const [lang, setLang] = useState("java");
  const [code, setCode] = useState(
    `class Solution {
  public String solution(int A, int B) {
    return "";
  }
}`
  );

  return (
    <div className="h-full flex flex-col">
      {/* header */}
      <div className="h-[44px] px-3 flex items-center gap-2 border-b bg-white">
        <div className="text-sm font-medium">에디터</div>
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="java">Java 11</option>
          <option value="python">Python 3</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button className="ml-2 px-3 py-1.5 text-sm border rounded hover:bg-gray-50">
          실행
        </button>
      </div>

      {/* editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={lang}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            tabSize: 2,
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>
    </div>
  );
}
