"use client";

import { useState } from "react";
import styles from "@/app/page.module.css";

// 팀원 이름 등록과 삭제
export default function TeamMembers({ members, onAdd, onDelete }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setMessage("이름을 입력해 주세요.");
      return;
    }
    if (members.some((member) => member.name === trimmedName)) {
      setMessage("이미 등록된 이름입니다.");
      return;
    }

    onAdd(trimmedName);
    setName("");
    setMessage("");
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.sectionTitle}>팀원 ({members.length})</h2>

      <form className={styles.formRow} onSubmit={handleSubmit}>
        <input
          className={styles.input}
          type="text"
          placeholder="팀원 이름"
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-label="팀원 이름"
        />
        <button className={styles.primaryButton} type="submit">
          팀원 추가
        </button>
      </form>
      {message && <p className={styles.message}>{message}</p>}

      {members.length > 0 && (
        <ul className={styles.memberList}>
          {members.map((member) => (
            <li key={member.id} className={styles.memberChip}>
              {member.name}
              <button
                className={styles.chipDelete}
                type="button"
                onClick={() => onDelete(member.id)}
                aria-label={`${member.name} 삭제`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
