// DifficultyStars.tsx
// export function DifficultyStars({ difficulty }: { difficulty: number }) {
//     return (
//       <div className="flex items-center gap-1 text-sm">
//         {[...Array(5)].map((_, i) => (
//           <span key={i} className={i < difficulty ? "text-yellow-500" : "text-gray-300"}>
//             ★
//           </span>
//         ))}
//       </div>
//     );
//   }

// StatusBadge.tsx
import { Badge } from "@/components/ui/badge";
import { questionStatuses } from "@/enums/questionStatus";

export type Status = "approved" | "pending" | "rejected";

const statusColors = {
  "approved": "bg-green-100 text-green-800",
  "pending": "bg-yellow-100 text-yellow-800",
  "rejected": "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <Badge className={`${statusColors[status]} hover:${statusColors[status]}`}>
      {questionStatuses.find((s) => s.value === status)?.label}
    </Badge>
  );
}