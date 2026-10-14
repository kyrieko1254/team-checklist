"use client";

import { useEffect, useState } from "react";
import { loadMembers, loadTasks, saveMembers, saveTasks } from "@/app/lib/storage";
import TeamMembers from "./TeamMembers";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

// 체크리스트 전체: 팀원과 업무 목록을 들고, 바뀔 때마다 브라우저에 저장한다
// 이 컴포넌트는 브라우저에서만 그려지므로(ChecklistLoader 참고) 처음부터 저장소를 읽을 수 있다
export default function Checklist() {
  const [members, setMembers] = useState(loadMembers);
  const [tasks, setTasks] = useState(loadTasks);

  // 팀원 목록이 바뀌면 저장
  useEffect(() => {
    saveMembers(members);
  }, [members]);

  // 업무 목록이 바뀌면 저장
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  function addMember(name) {
    setMembers([...members, { id: crypto.randomUUID(), name }]);
  }

  // 팀원을 지워도 그 사람의 업무는 남긴다
  function deleteMember(memberId) {
    setMembers(members.filter((member) => member.id !== memberId));
  }

  function addTask({ title, assigneeId, dueDate }) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      assigneeId,
      dueDate,
      isDone: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  }

  // 완료 ↔ 미완료 전환
  function toggleTask(taskId) {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, isDone: !task.isDone } : task)));
  }

  function deleteTask(taskId) {
    setTasks(tasks.filter((task) => task.id !== taskId));
  }

  return (
    <>
      <TeamMembers members={members} onAdd={addMember} onDelete={deleteMember} />
      <TaskForm members={members} onAdd={addTask} />
      <TaskList tasks={tasks} members={members} onToggle={toggleTask} onDelete={deleteTask} />
    </>
  );
}
