interface CardDataProps {
  heading: string;
  value?: string;
  showSkeleton?: boolean;
}

export default function BasicInfoCard({ data }: { data: CardDataProps }) {
  const Card = (
    <div className="basic-info-card">
      <div className="basic-info-card-heading">{data.heading}</div>
      <div className="basic-info-card-value">{data.value}</div>
    </div>
  );

  return data.value ? Card : <></>;
}
