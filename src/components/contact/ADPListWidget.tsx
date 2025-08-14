import { ADPListWidget as ADPListWidgetType } from "./types";

interface ADPListWidgetProps {
  widget: ADPListWidgetType;
  className?: string;
}

export default function ADPListWidget({ widget, className = "" }: ADPListWidgetProps) {
  const containerStyle = {
    height: widget.height,
    boxShadow: "rgba(142, 151, 158, 0.15) 0px 4px 19px 0px",
    borderRadius: "16px",
    overflow: "hidden" as const,
    width: "100%",
    maxWidth: widget.width || "650px",
    padding: widget.padding || "0px",
  };

  return (
    <div className={`flex justify-center ${className}`}>
      <section style={containerStyle}>
        <iframe
          src={`https://adplist.org/widgets/${widget.src}`}
          title={widget.title}
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: "0px" }}
        />
      </section>
    </div>
  );
}
