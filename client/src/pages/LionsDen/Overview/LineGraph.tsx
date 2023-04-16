import { useRef } from "react";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { format } from "date-fns";
Chart.register(CategoryScale);

const getLabels = (sessions: Session[]) => {
  let currentMonth = sessions[0].date.getMonth();
  const formatDate = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
  return sessions.map((session, index) => {
    const date = session.date;
    const month = date.getMonth();
    if (!index) return formatDate(date);
    if (month === currentMonth) return "";
    currentMonth = month;
    return formatDate(date);
  });
};

const getCounts = (sessions: Session[]) => ({
  late: sessions.map((s) => s.lateCount),
  total: sessions.map((s) => s.totalCount),
});

const generateData = (sessions: Session[], counts: ReturnType<typeof getCounts>) => {
  return {
    labels: getLabels(sessions),
    datasets: [
      {
        label: "Users Gained",
        data: counts.total,
        backgroundColor: "rgba(5,102,195,0.2)",
        borderColor: "rgb(5,102,195)",
        borderWidth: 3,
        pointRadius: 0,
        pointHoverBorderWidth: 0,
        pointHoverBackgroundColor: "black",
        tension: 0.6,
        fill: true,
      },
      {
        data: counts.late,
        borderColor: "rgba(255,0,0,0.2)",
        backgroundColor: "rgba(255,0,0,0.1)",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverBorderWidth: 0,
        pointHoverBackgroundColor: "transparent",
        tension: 0.6,
        fill: true,
      },
    ],
  };
};

export default function LineGraph({ sessions }: LineGraphProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const counts = getCounts(sessions);
  // @ts-ignore
  const startText = `Last session: ${sessions.at(-1)?.totalCount} students`;
  return (
    <div className="py-3 px-6 rounded-lg">
      <div ref={ref} className="mb-3 h-5">
        {startText}
      </div>
      <div className="h-32">
        <Line
          height={200}
          options={{
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            hover: { mode: "index", intersect: false },
            interaction: { intersect: false, mode: "index" },
            scales: {
              x: { grid: { display: false }, ticks: { autoSkip: false } },
              y: { grid: { display: false }, display: false, max: Math.max(...counts.total) + 5 },
            },
            maintainAspectRatio: false,
          }}
          data={generateData(sessions, counts)}
          plugins={[
            {
              id: "hoverId", //typescript crashes without id
              afterDraw: function (chart: any) {
                if (chart.tooltip?._active?.length) {
                  if (ref.current) {
                    const data = sessions[chart.tooltip._active[0].index];
                    ref.current.innerHTML = `<b>Students: ${data.totalCount}</b> Late: ${
                      data.lateCount
                    } Date: ${format(data.date, "P")} `;
                  }
                  let x = chart.tooltip._active[0].element.x;
                  let yAxis = chart.scales.y;
                  let ctx = chart.ctx;
                  ctx.save();
                  ctx.beginPath();
                  ctx.moveTo(x, yAxis.top);
                  ctx.lineTo(x, yAxis.bottom);
                  ctx.lineWidth = 2;
                  ctx.strokeStyle = "black";
                  ctx.stroke();
                  ctx.restore();
                } else {
                  if (ref.current) {
                    ref.current.innerHTML = startText;
                  }
                }
              },
            },
          ]}
        />
      </div>
    </div>
  );
}

interface LineGraphProps {
  sessions: Session[];
}

interface Session {
  _id: string;
  date: Date;
  totalCount: number;
  lateCount: number;
}
