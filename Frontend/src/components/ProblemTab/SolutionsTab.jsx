export default function SolutionsTab() {
  return (
    <div className="space-y-3">
      <div className="font-semibold">정답 코드</div>
      <pre className="text-xs bg-gray-900 text-gray-100 rounded p-3 overflow-auto">
{`import java.util.*;

public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    int A = sc.nextInt();
    int B = sc.nextInt();

    if (A > B) System.out.println(">");
    else if (A < B) System.out.println("<");
    else System.out.println("==");
  }
}`}
      </pre>
    </div>
  );
}
