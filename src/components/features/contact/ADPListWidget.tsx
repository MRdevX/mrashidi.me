import { ADPListWidget as ADPListWidgetType } from "./types";

interface ADPListWidgetProps {
  widget: ADPListWidgetType;
  className?: string;
}

export function ADPListWidget({ widget, className = "" }: ADPListWidgetProps) {
  const containerStyle = {
    height: widget.height,
    boxShadow: "rgba(142, 151, 158, 0.15) 0px 4px 19px 0px",
    borderRadius: "12px",
    overflow: "hidden" as const,
    width: "100%",
    maxWidth: widget.width || "100%",
    padding: widget.padding || "0px",
    border: "1px solid rgba(255, 165, 0, 0.1)",
    background: "rgba(255, 255, 255, 0.2)",
  };

  const darkContainerStyle = {
    ...containerStyle,
    background: "rgba(0, 0, 0, 0.2)",
  };

  return (
    <div className={`${className}`}>
      <div
        className="relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/10"
        style={containerStyle}
      >
        <div className="dark:hidden" style={containerStyle}>
          <iframe
            src={`https://adplist.org/widgets/${widget.src}`}
            title={widget.title}
            width="100%"
            height="100%"
            loading="lazy"
            style={{
              border: "0px",
              background: "transparent",
            }}
          />
        </div>
        <div className="hidden dark:block" style={darkContainerStyle}>
          <iframe
            src={`https://adplist.org/widgets/${widget.src}`}
            title={widget.title}
            width="100%"
            height="100%"
            loading="lazy"
            style={{
              border: "0px",
              background: "transparent",
            }}
          />
        </div>
        {/* Subtle glow effect */}
        <div className="absolute inset-0 pointer-events-none rounded-lg bg-gradient-to-r from-orange-500/5 via-transparent to-orange-500/5" />
      </div>
    </div>
  );
}
