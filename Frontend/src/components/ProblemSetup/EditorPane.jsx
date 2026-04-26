import Editor from "@monaco-editor/react";

export default function EditorPane({
  lang,
  onChangeLang,
  code,
  onChangeCode,
  showHeader = true,
}) {
  return (
    <div className="h-full flex flex-col">
      {/* header */}
      {showHeader && (
        <div className="h-[44px] px-3 flex items-center gap-2 border-b bg-white">
          <div className="text-sm font-medium">에디터</div>

          <select
            value={lang}
            onChange={(e) => onChangeLang(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="java">Java 11</option>
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript</option>
          </select>

        </div>
      )}

      {/* editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={lang}
          value={code}
          onChange={(v) => onChangeCode(v ?? "")}
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
