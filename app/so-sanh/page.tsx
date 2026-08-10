import { CompareTable } from "../components/CompareTable";
import { Header } from "../components/Header";

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ xe?: string }> }) {
  const { xe } = await searchParams;
  return <main><Header/><CompareTable initial={xe ? xe.split(",") : []}/><footer><span>VINFAST EXPLORER</span><span>Dữ liệu cập nhật 07.2026</span></footer></main>;
}
