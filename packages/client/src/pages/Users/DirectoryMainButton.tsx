import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

export default function DirectoryMainButton(props: Props) {
  return (
    <div className="sm:absolute sm:top-[25px] sm:right-[25px] static">
      <PrimaryButton className="w-full sm:w-auto" text={props.text} onClick={props.onClick} />
    </div>
  );
}

interface Props {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
