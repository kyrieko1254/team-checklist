// 날짜 계산 도우미. 날짜는 모두 "YYYY-MM-DD" 문자열로 다룬다
// 같은 형식의 문자열은 글자 순서 비교만으로 날짜 앞뒤를 알 수 있다

const weekdayNames = ["일", "월", "화", "수", "목", "금", "토"];

// Date → "YYYY-MM-DD" (내 컴퓨터 시간 기준)
function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// 오늘 날짜
export function getTodayString() {
  return toDateString(new Date());
}

// 이번 주 일요일 날짜 (한 주는 월요일 시작, 일요일 끝)
export function getThisSundayString() {
  const date = new Date();
  const daysUntilSunday = (7 - date.getDay()) % 7;
  date.setDate(date.getDate() + daysUntilSunday);
  return toDateString(date);
}

// "2026-10-15" → "10/15 (수)"
// 문자열을 직접 쪼개서 만들어 시간대 때문에 날짜가 하루 밀리지 않게 한다
export function formatDueDate(dueDate) {
  const [year, month, day] = dueDate.split("-").map(Number);
  const weekday = weekdayNames[new Date(year, month - 1, day).getDay()];
  return `${month}/${day} (${weekday})`;
}
