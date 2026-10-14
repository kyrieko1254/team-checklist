import styles from "@/app/page.module.css";

const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];

// "2026-10-15" → "10/15 (수)"
// 문자열을 직접 쪼개서 만들어 시간대 때문에 날짜가 하루 밀리지 않게 한다
function formatDueDate(dueDate) {
  const [year, month, day] = dueDate.split("-").map(Number);
  const weekday = weekdayNames[new Date(year, month - 1, day).getDay()];
  return `${month}/${day} (${weekday})`;
}

// 업무 목록: 마감일이 빠른 순, 같으면 먼저 추가한 순
export default function TaskList({ tasks, members }) {
  const sortedTasks = [...tasks].sort(
    (a, b) => a.dueDate.localeCompare(b.dueDate) || a.createdAt.localeCompare(b.createdAt)
  );

  function getAssigneeName(assigneeId) {
    const member = members.find((item) => item.id === assigneeId);
    return member ? member.name : "(삭제된 팀원)";
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>업무 목록 ({tasks.length})</h2>

      {sortedTasks.length === 0 ? (
        <p className={styles.empty}>업무가 없습니다.</p>
      ) : (
        <ul className={styles.taskList}>
          {sortedTasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <span className={styles.taskTitle}>{task.title}</span>
              <span className={styles.taskAssignee}>{getAssigneeName(task.assigneeId)}</span>
              <span className={styles.taskDue}>{formatDueDate(task.dueDate)}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
