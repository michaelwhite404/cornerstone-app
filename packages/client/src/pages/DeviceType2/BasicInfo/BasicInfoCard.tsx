interface CardDataProps {
  heading: string;
  value?: string;
  showSkeleton?: boolean;
}

export default function BasicInfoCard({ data }: { data: CardDataProps }) {
  const Card = (
    <div className="w-1/3 p-[15px]">
      <div className="font-medium mb-[5px]">{data.heading}</div>
      <div className="text-[#8f8f8f] break-words">{data.value}</div>
    </div>
  );

  return data.value ? Card : <></>;
}
