// 백엔드 DataType(smu-core-api) 21종 -> 언어별(Java/Python/C++) 시그니처 매핑
// 문제마다 다른 functionName/parameters/returnType을 실제로 반영한 코드 템플릿을 생성한다.
// worker-api(smu-worker-api CodeGenerator.java)가 실행 시 감싸는 드라이버 코드의 타입 규칙과 맞춰뒀다.

const JAVA_BASE_TYPES = {
  INT: "int",
  LONG: "long",
  BOOLEAN: "boolean",
  CHAR: "char",
  DOUBLE: "double",
  STRING: "String",
};

const JAVA_SCALAR_DEFAULTS = {
  int: "0",
  long: "0L",
  boolean: "false",
  char: "' '",
  double: "0.0",
};

const PYTHON_BASE_TYPES = {
  INT: "int",
  LONG: "int",
  BOOLEAN: "bool",
  CHAR: "str",
  DOUBLE: "float",
  STRING: "str",
};

const CPP_BASE_TYPES = {
  INT: "int",
  LONG: "long long",
  BOOLEAN: "bool",
  CHAR: "char",
  DOUBLE: "double",
  STRING: "string",
};

function parseShape(dataType) {
  if (dataType?.endsWith("_3D_ARRAY")) {
    return { base: dataType.slice(0, -"_3D_ARRAY".length), dimensions: 3 };
  }
  if (dataType?.endsWith("_2D_ARRAY")) {
    return { base: dataType.slice(0, -"_2D_ARRAY".length), dimensions: 2 };
  }
  if (dataType?.endsWith("_ARRAY")) {
    return { base: dataType.slice(0, -"_ARRAY".length), dimensions: 1 };
  }
  return { base: dataType, dimensions: 0 };
}

function javaType(dataType) {
  const { base, dimensions } = parseShape(dataType);
  return JAVA_BASE_TYPES[base] + "[]".repeat(dimensions);
}

function javaDefaultReturn(dataType) {
  const { base, dimensions } = parseShape(dataType);
  if (dimensions > 0 || base === "STRING") return "null";
  return JAVA_SCALAR_DEFAULTS[JAVA_BASE_TYPES[base]] ?? "null";
}

function pythonType(dataType) {
  const { base, dimensions } = parseShape(dataType);
  let type = PYTHON_BASE_TYPES[base];
  for (let i = 0; i < dimensions; i++) type = `List[${type}]`;
  return type;
}

function cppType(dataType) {
  const { base, dimensions } = parseShape(dataType);
  let type = CPP_BASE_TYPES[base];
  for (let i = 0; i < dimensions; i++) type = `vector<${type}>`;
  return type;
}

function usesPythonList(problem) {
  return (
    problem.parameters.some((p) => parseShape(p.type).dimensions > 0) ||
    parseShape(problem.returnType).dimensions > 0
  );
}

function generateJavaTemplate({ functionName, parameters, returnType }) {
  const params = parameters
    .map((p) => `${javaType(p.type)} ${p.name}`)
    .join(", ");

  return `class Solution {
    public ${javaType(returnType)} ${functionName}(${params}) {
        return ${javaDefaultReturn(returnType)};
    }
}`;
}

function generatePythonTemplate(problem) {
  const { functionName, parameters, returnType } = problem;
  const params = parameters
    .map((p) => `${p.name}: ${pythonType(p.type)}`)
    .join(", ");
  const importLine = usesPythonList(problem) ? "from typing import List\n\n\n" : "";

  return `${importLine}class Solution:
    def ${functionName}(self, ${params}) -> ${pythonType(returnType)}:
        pass`;
}

function generateCppTemplate({ functionName, parameters, returnType }) {
  const params = parameters
    .map((p) => `${cppType(p.type)} ${p.name}`)
    .join(", ");

  return `class Solution {
public:
    ${cppType(returnType)} ${functionName}(${params}) {
        return {};
    }
};`;
}

// problem: ProblemResponse(functionName, parameters:[{name,type}], returnType) — 로딩 전이면 null
export function buildCodeTemplates(problem) {
  if (!problem?.functionName || !problem?.parameters || !problem?.returnType) {
    return null;
  }
  return {
    java: generateJavaTemplate(problem),
    python: generatePythonTemplate(problem),
    cpp: generateCppTemplate(problem),
  };
}
