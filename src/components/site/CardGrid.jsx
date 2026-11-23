/**
 * <CardGrid> — responsive grid where every card in a row has the same height.
 *
 *   <CardGrid columns={{ sm: 2, lg: 3 }}>…cards…</CardGrid>
 *
 * Class names are listed literally so Tailwind keeps them in the build.
 */
import { cn } from "./cn";

const COLS = {
  base: { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3" },
  sm: { 1: "sm:grid-cols-1", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3", 4: "sm:grid-cols-4" },
  md: { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" },
  lg: { 1: "lg:grid-cols-1", 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5", 6: "lg:grid-cols-6" },
};

/**
 * @param {object} props
 * @param {{base?:number, sm?:number, md?:number, lg?:number}} [props.columns={ sm: 2, lg: 3 }]
 * @param {string} [props.gap="gap-6 lg:gap-8"]
 * @param {boolean} [props.equalHeight=true]
 */
export default function CardGrid({
  columns = { sm: 2, lg: 3 },
  gap = "gap-6 lg:gap-8",
  equalHeight = true,
  className,
  children,
}) {
  const cols = [
    COLS.base[columns.base ?? 1],
    columns.sm && COLS.sm[columns.sm],
    columns.md && COLS.md[columns.md],
    columns.lg && COLS.lg[columns.lg],
  ];
  return <div className={cn("grid", ...cols, equalHeight && "auto-rows-fr", gap, className)}>{children}</div>;
}
