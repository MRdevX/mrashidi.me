export {
  Menu,
  X,
  Github,
  Search,
  Download,
  Send,
  ExternalLink,
  FileText,
  User,
  Mail,
  MessageSquare,
  BookOpen,
  FolderOpen,
  MessageCircle,
  Terminal,
  Globe,
  Loader2,
  User as UserIcon,
  Mail as MailIcon,
  MessageSquare as MessageIcon,
  FileText as FileTextIcon,
} from "lucide-react";

export const iconSizes = {
  xs: "w-3 h-3",
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
  xl: "w-8 h-8",
  "2xl": "w-10 h-10",
} as const;

export const iconColors = {
  primary: "text-orange-500",
  secondary: "text-gray-400",
  success: "text-green-500",
  error: "text-red-500",
  warning: "text-yellow-500",
  info: "text-blue-500",
} as const;
