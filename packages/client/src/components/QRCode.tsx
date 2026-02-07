export default function QRCode(props: QRCodeProps) {
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?data=${props.value}&size=1000x1000&margin=0`}
      alt={props.value}
      width={props.size}
      title={props.value}
    />
  );
}

interface QRCodeProps {
  size: number;
  value: string;
}
