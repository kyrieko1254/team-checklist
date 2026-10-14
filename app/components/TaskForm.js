"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";

// 업무 입력 줄: 업무명, 담당자, 마감일
export default function TaskForm({ members, onAdd }) {
  const [title, setTitle] = useState("");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [message, setMessage] = useState("");

  const hasMembers = members.length > 0;
  // 선택했던 담당자가 삭제되었으면 선택하지 않은 것으로 본다
  const selectedAssigneeId = members.some((member) => member.id === assigneeId) ? assigneeId : "";

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle || !selectedAssigneeId || !dueDate) {
      setMessage("업무명, 담당자, 마감일을 모두 입력해 주세요.");
      return;
    }

    onAdd({ title: trimmedTitle, assigneeId: selectedAssigneeId, dueDate });
    // 같은 담당자·마감일로 연달아 넣기 쉽게 업무명만 비운다
    setTitle("");
    setMessage("");
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>업무 추가</h2>

      <form className={styles.formRow} onSubmit={handleSubmit}>
        <input
          className={`${styles.input} ${styles.titleInput}`}
          type="text"
          placeholder="업무명"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          aria-label="업무명"
        />
        <select
          className={styles.input}
          value={selectedAssigneeId}
          onChange={(event) => setAssigneeId(event.target.value)}
          disabled={!hasMembers}
          aria-label="담당자"
        >
          <option value="">담당자 선택</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        <input
          className={styles.input}
          type="date"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
          aria-label="마감일"
        />
        <button className={styles.primaryButton} type="submit" disabled={!hasMembers}>
          추가
        </button>
      </form>

      {!hasMembers && <p className={styles.message}>먼저 팀원을 등록해 주세요.</p>}
      {hasMembers && message && <p className={styles.message}>{message}</p>}
    </section>
  );
}
