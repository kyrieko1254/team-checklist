import "./globals.css";

export const metadata = {
  title: "팀 업무 체크리스트",
  description: "이번 주 팀 업무를 한 화면에서 확인하는 체크리스트",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
