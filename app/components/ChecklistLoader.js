"use client";

import dynamic from "next/dynamic";
import styles from "@/app/page.module.css";

// 저장된 데이터는 브라우저에만 있으므로, 체크리스트는 서버에서 미리 그리지 않고 브라우저에서만 그린다
const Checklist = dynamic(() => import("./Checklist"), {
  ssr: false,
  loading: () => <p className={styles.empty}>불러오는 중…</p>,
});

export default function ChecklistLoader() {
  return <Checklist />;
}
