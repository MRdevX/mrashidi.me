import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

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

  const getIcon = () => {
    switch (status.type) {
      case "success":
        return <CheckCircle className="w-5 h-5" />;
      case "error":
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  return (
    <div
      className={`mb-6 p-4 rounded-md flex items-start space-x-3 ${
        status.type === "success"
          ? "bg-green-900/20 text-green-400 border border-green-500/30"
          : "bg-red-900/20 text-red-400 border border-red-500/30"
      }`}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1">
        <p className="font-medium">{status.type === "success" ? "Success!" : "Error"}</p>
        <p className="text-sm mt-1">{status.message}</p>
      </div>
    </div>
  );
}
