import { DocumentTextIcon, CheckCircleIcon, PencilSquareIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { StatCard } from "../ui";

const PagesStats = ({ pages }) => {
  const publishedCount = pages.filter((p) => p.isPublished).length;
  const timestamps = pages.map((p) => new Date(p.createdAt || 0).getTime()).filter(Boolean);
  const lastCreated = timestamps.length
    ? new Date(Math.max(...timestamps)).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "—";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Total pages" value={pages.length} icon={DocumentTextIcon} />
      <StatCard label="Published" value={publishedCount} icon={CheckCircleIcon} tone="success" />
      <StatCard label="Drafts" value={pages.length - publishedCount} icon={PencilSquareIcon} tone="neutral" />
      <StatCard label="Last created" value={<span className="text-xl">{lastCreated}</span>} icon={CalendarIcon} tone="neutral" />
    </div>
  );
};

export default PagesStats;
