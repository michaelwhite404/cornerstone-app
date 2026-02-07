import { buildStyles, CircularProgressbarWithChildren } from "react-circular-progressbar";
import { TicketPriority } from "../types/models";
import CircularProgressProvider from "./CircularProgressProvider";

const priorityMap = {
  URGENT: {
    pathColor: "red",
    length: 8,
    number: 4,
  },
  HIGH: {
    pathColor: "#ffaa67",
    length: 6,
    number: 3,
  },
  MEDIUM: {
    pathColor: "#29e7d2",
    length: 4,
    number: 2,
  },
  LOW: {
    pathColor: "#29c1e7",
    length: 2,
    number: 1,
  },
};

export default function PriorityCircle(props: PriorityCircleProps) {
  const priority = priorityMap[props.priority];
  return (
    <CircularProgressProvider valueStart={0} valueEnd={priority.length}>
      {(value) => (
        <CircularProgressbarWithChildren
          minValue={0}
          maxValue={8}
          value={value}
          strokeWidth={20}
          circleRatio={0.68}
          styles={{
            ...buildStyles({
              pathColor: priority.pathColor,
              trailColor: "#e5e5e5",
              rotation: 0.66,
            }),
          }}
        >
          <span style={{ color: priority.pathColor }}>{priority.number}</span>
        </CircularProgressbarWithChildren>
      )}
    </CircularProgressProvider>
  );
}
interface PriorityCircleProps {
  priority: TicketPriority;
}
