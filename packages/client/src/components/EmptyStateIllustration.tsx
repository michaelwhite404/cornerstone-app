export default function EmptyStateIllustration(props: EmptyStateIllustrationProps) {
  const { imgSrc, text, xlWidth = "50%" } = props;
  return (
    <div className="flex justify-center w-full lg:absolute">
      <div className="flex align-center justify-center flex-col mt-8 py-5">
        <img
          className={`w-[80%] lg:w-[70%] xl:w-[${xlWidth}] opacity-70`}
          src={imgSrc}
          alt="Sick Leave"
        />
        <div className="lg:text-lg text-md font-medium text-center mt-2 text-gray-500">{text}</div>
      </div>
    </div>
  );
}

interface EmptyStateIllustrationProps {
  imgSrc: string;
  text: string;
  xlWidth?: string;
}
