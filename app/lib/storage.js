// 브라우저 저장소(localStorage)에 팀원과 업무를 저장하고 불러오는 함수들

const membersKey = "teamChecklist.members";
const tasksKey = "teamChecklist.tasks";

// 저장된 배열을 읽는다. 값이 없거나 깨져 있으면 빈 배열을 돌려준다
function loadList(key) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

// 배열을 문자열로 바꿔 저장한다. 저장 공간이 막혀 있어도 화면이 멈추지 않게 한다
function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // 저장에 실패해도 화면은 계속 쓸 수 있게 둔다
  }
}

export function loadMembers() {
  return loadList(membersKey);
}

export function saveMembers(members) {
  saveList(membersKey, members);
}

export function loadTasks() {
  return loadList(tasksKey);
}

export function saveTasks(tasks) {
  saveList(tasksKey, tasks);
}
