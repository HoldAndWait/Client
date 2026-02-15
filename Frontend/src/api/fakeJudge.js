let runTick = 0;
let lastSourceCode = "";

function extractReturnString(javaCode) {
  // 아주 단순한 테스트용(진짜 파서는 아님)
  // return "abc"; 형태에서 abc만 추출
  const m = javaCode.match(/return\s+"([^"]*)"\s*;/);
  return m ? m[1] : "(no return string found)";
}

export async function fakeRunStart({ sourceCode } ={}) {
  runTick = 0;
  lastSourceCode = sourceCode ?? "";
  await new Promise((r) => setTimeout(r, 200));
  return { runId: 1 };
}

export async function fakeRunStatus() {
  runTick += 1;
  await new Promise((r) => setTimeout(r, 150));

  if (runTick < 3) {
    return { status: "RUNNING" };
  }

  const out = extractReturnString(lastSourceCode);

  return {
    status: "DONE",
    list: [
      { tcNo: 1, result: "WA", actualOutput: out, expectedOutput: "3", input: "1 2" },
      { tcNo: 2, result: "WA", actualOutput: out, expectedOutput: "30", input: "10 20" },
    ],
  };
}
