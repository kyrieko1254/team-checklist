"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";
import { formatDueDate, getThisSundayString, getTodayString } from "@/app/lib/date";

// 완료하지 않은 업무가 위, 그다음 마감일이 빠른 순, 같으면 먼저 추가한 순
function compareTasks(a, b) {
  return (
    Number(a.isDone) - Number(b.isDone) ||
    a.dueDate.localeCompare(b.dueDate) ||
    a.createdAt.localeCompare(b.createdAt)
  );
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

// 완료하지 않은 업무 수
function countRemaining(groupItems) {
  return groupItems.filter((task) => !task.isDone).length;
}

// 업무 목록: 묶음별로 보여 주고, 완료 체크와 삭제를 받는다
export default function TaskList({ tasks, members, onToggle, onDelete }) {
  // 삭제 확인 중인 업무 id
  const [confirmingId, setConfirmingId] = useState(null);
  const groups = groupTasks(tasks);

  function getAssigneeName(assigneeId) {
    const member = members.find((item) => item.id === assigneeId);
    return member ? member.name : "(삭제된 팀원)";
  }

  function handleDelete(taskId) {
    onDelete(taskId);
    setConfirmingId(null);
  }

  function renderTasks(groupItems, isOverdue = false) {
    if (groupItems.length === 0) {
      return <p className={styles.empty}>업무가 없습니다.</p>;
    }

    return (
      <ul className={styles.taskList}>
        {groupItems.map((task) => {
          const itemClassName = [
            styles.taskItem,
            isOverdue ? styles.overdueItem : "",
            task.isDone ? styles.doneItem : "",
          ].join(" ");

          return (
            <li key={task.id} className={itemClassName}>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={task.isDone}
                onChange={() => onToggle(task.id)}
                aria-label={`${task.title} 완료`}
              />
              <span className={styles.taskTitle}>{task.title}</span>
              <span className={styles.taskAssignee}>{getAssigneeName(task.assigneeId)}</span>
              <span className={styles.taskDue}>{formatDueDate(task.dueDate)}</span>

              {confirmingId === task.id ? (
                <span className={styles.confirmBox}>
                  삭제할까요?
                  <button
                    className={styles.dangerButton}
                    type="button"
                    onClick={() => handleDelete(task.id)}
                  >
                    삭제
                  </button>
                  <button
                    className={styles.textButton}
                    type="button"
                    onClick={() => setConfirmingId(null)}
                  >
                    취소
                  </button>
                </span>
              ) : (
                <button
                  className={styles.textButton}
                  type="button"
                  onClick={() => setConfirmingId(task.id)}
                >
                  삭제
                </button>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>업무 목록</h2>

      <div className={styles.group}>
        <h3 className={`${styles.groupTitle} ${styles.overdueTitle}`}>
          지난 마감 ({countRemaining(groups.overdue)})
        </h3>
        {renderTasks(groups.overdue, true)}
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>이번 주 ({countRemaining(groups.thisWeek)})</h3>
        {renderTasks(groups.thisWeek)}
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>다음 주 이후 ({countRemaining(groups.later)})</h3>
        {renderTasks(groups.later)}
      </div>

      {/* 마감이 지났고 완료한 업무는 접어 둔다 */}
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
