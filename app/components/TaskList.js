import styles from "@/app/page.module.css";
import { formatDueDate, getThisSundayString, getTodayString } from "@/app/lib/date";

// 마감일이 빠른 순, 같으면 먼저 추가한 순
function compareTasks(a, b) {
  return a.dueDate.localeCompare(b.dueDate) || a.createdAt.localeCompare(b.createdAt);
}

// 업무를 지난 마감 / 이번 주 / 다음 주 이후 / 완료된 지난 업무로 나눈다
function groupTasks(tasks) {
  const today = getTodayString();
  const thisSunday = getThisSundayString();
  const groups = { overdue: [], thisWeek: [], later: [], pastDone: [] };

  [...tasks].sort(compareTasks).forEach((task) => {
    if (task.dueDate < today) {
      // 마감이 지났어도 완료한 업무는 밀린 일로 보지 않는다
      groups[task.isDone ? "pastDone" : "overdue"].push(task);
    } else if (task.dueDate <= thisSunday) {
      groups.thisWeek.push(task);
    } else {
      groups.later.push(task);
    }
  });

  return groups;
}

// 업무 목록: 묶음별로 보여 준다
export default function TaskList({ tasks, members }) {
  const groups = groupTasks(tasks);

  function getAssigneeName(assigneeId) {
    const member = members.find((item) => item.id === assigneeId);
    return member ? member.name : "(삭제된 팀원)";
  }

  function renderTasks(groupItems, isOverdue = false) {
    if (groupItems.length === 0) {
      return <p className={styles.empty}>업무가 없습니다.</p>;
    }

    return (
      <ul className={styles.taskList}>
        {groupItems.map((task) => (
          <li
            key={task.id}
            className={`${styles.taskItem} ${isOverdue ? styles.overdueItem : ""}`}
          >
            <span className={styles.taskTitle}>{task.title}</span>
            <span className={styles.taskAssignee}>{getAssigneeName(task.assigneeId)}</span>
            <span className={styles.taskDue}>{formatDueDate(task.dueDate)}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>업무 목록</h2>

      <div className={styles.group}>
        <h3 className={`${styles.groupTitle} ${styles.overdueTitle}`}>
          지난 마감 ({groups.overdue.length})
        </h3>
        {renderTasks(groups.overdue, true)}
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>이번 주 ({groups.thisWeek.length})</h3>
        {renderTasks(groups.thisWeek)}
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>다음 주 이후 ({groups.later.length})</h3>
        {renderTasks(groups.later)}
      </div>

      {/* 마감이 지났고 완료한 업무는 접어 둔다 (완료 체크 기능이 생기면 나타난다) */}
      {groups.pastDone.length > 0 && (
        <details className={styles.group}>
          <summary className={styles.groupTitle}>
            완료된 지난 업무 ({groups.pastDone.length})
          </summary>
          {renderTasks(groups.pastDone)}
        </details>
      )}
    </section>
  );
}
