


export const OgImageTemplate = ({ title, subtitle, description }) => (
  <div
    style={{
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000000",
      backgroundImage: "linear-gradient(135deg, #000000 0%, #1a1a1a 100%)",
      position: "relative",
    }}
  >
    {/* Background accent shapes */}
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: "200px",
        height: "200px",
        background: "linear-gradient(135deg, #ff5f1f 0%, #ff5f1f20 100%)",
        clipPath: "polygon(100% 0%, 0% 0%, 100% 100%)",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "200px",
        height: "200px",
        background: "linear-gradient(135deg, #ff5f1f 0%, #ff5f1f20 100%)",
        clipPath: "polygon(0% 100%, 0% 0%, 100% 100%)",
      }}
    />

    {/* Main content */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        zIndex: 1,
      }}
    >
      {/* Title */}
      <h1
        style={{
          fontSize: "64px",
          fontWeight: "bold",
          color: "#ffffff",
          margin: "0 0 20px 0",
          textShadow: "0 0 20px rgba(255, 95, 31, 0.5)",
        }}
      >
        {title}
      </h1>

      {/* Subtitle */}
      <h2
        style={{
          fontSize: "32px",
          fontWeight: "600",
          color: "#ff5f1f",
          margin: "0 0 20px 0",
        }}
      >
        {subtitle}
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: "24px",
          color: "#cccccc",
          margin: "0 0 40px 0",
          maxWidth: "800px",
          lineHeight: "1.4",
        }}
      >
        {description}
      </p>

      {/* Website URL */}
      <div
        style={{
          fontSize: "18px",
          color: "#888888",
          border: "2px solid #ff5f1f",
          padding: "12px 24px",
          borderRadius: "8px",
          backgroundColor: "rgba(255, 95, 31, 0.1)",
        }}
      >
        mrashidi.me
      </div>
    </div>

    {/* Border accent */}
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "20px",
        right: "20px",
        bottom: "20px",
        border: "4px solid #ff5f1f",
        borderRadius: "12px",
        opacity: 0.3,
      }}
    />
  </div>
);
