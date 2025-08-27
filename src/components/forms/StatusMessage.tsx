interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

interface StatusMessageProps {
  status: SubmitStatus;
}

export function StatusMessage({ status }: StatusMessageProps) {
  if (!status.type) {
    return null;
  }

  return (
    <div
      className={`mb-6 p-4 rounded-md ${
        status.type === "success"
          ? "bg-green-900/20 text-green-400 border border-green-500/30"
          : "bg-red-900/20 text-red-400 border border-red-500/30"
      }`}
      role="alert"
    >
      {status.message}
    </div>
  );
}
