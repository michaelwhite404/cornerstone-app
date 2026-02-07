interface TextOverLineProps {
  text?: string;
  color?: string;
}

export default function TextOverLine({ text, color = "#bcc3d0" }: TextOverLineProps) {
  const divStyles: React.CSSProperties = {
    borderBottom: `1px solid ${color}`,
    margin: "1rem 0",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    color,
  };

  const spanStyles: React.CSSProperties = {
    position: "relative",
    backgroundColor: "white",
    top: 9,
    padding: "0 0.5rem",
  };

  return (
    <div style={divStyles}>
      <span style={spanStyles}>{text}</span>
    </div>
  );
}
