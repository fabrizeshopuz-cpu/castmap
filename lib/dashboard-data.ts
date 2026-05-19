import {
  AlertTriangle,
  BarChart3,
  Bell,
  CalendarClock,
  CreditCard,
  GalleryVerticalEnd,
  HelpCircle,
  Layers3,
  LayoutDashboard,
  Library,
  Monitor,
  MonitorPlay,
  Moon,
  PlaySquare,
  Radio,
  ScanLine,
  Search,
  Settings,
  Shield,
  Sun,
  TerminalSquare,
  UserRound,
  UsersRound,
  Video,
  Wifi,
  type LucideIcon,
} from "lucide-react";

export type MetricTone = "violet" | "green" | "gold" | "blue" | "red";

export interface DashboardMetric {
  title: string;
  value: string;
  trend: string;
  helper: string;
  icon: LucideIcon;
  tone: MetricTone;
}

export interface ActivityItemData {
  title: string;
  text: string;
  time: string;
  role: string;
  icon: "upload" | "playlist" | "screen" | "alert";
  tone: Exclude<MetricTone, "gold">;
}

export interface MapMarkerData {
  city: string;
  value: number;
  tone: "green" | "gold" | "red";
  x: number;
  y: number;
}

export const sidebarItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "TV Qurilmalar", icon: MonitorPlay, href: "/devices" },
  { label: "Ekranlar", icon: Monitor, href: "/screens" },
  { label: "Media kutubxona", icon: Library, href: "/media-library" },
  { label: "Playlistlar", icon: GalleryVerticalEnd, href: "/playlists" },
  { label: "Jadval", icon: CalendarClock, href: "/schedules" },
  { label: "Kampaniyalar", icon: Radio, href: "/campaigns" },
  { label: "Analitika", icon: BarChart3, href: "/analytics" },
  { label: "Jonli monitoring", icon: ScanLine, href: "/live-monitoring" },
  { label: "APK boshqaruvi", icon: TerminalSquare, href: "/apk-management" },
  { label: "Ogohlantirishlar", icon: Bell, href: "/alerts" },
  { label: "Ilovalar va Widgetlar", icon: PlaySquare, href: "/widgets" },
  { label: "Foydalanuvchilar", icon: UsersRound, href: "/users" },
  { label: "Tarif va billing", icon: CreditCard, href: "/billing" },
  { label: "Sozlamalar", icon: Settings, href: "/settings" },
];

export const topbarActions = {
  searchIcon: Search,
  notificationIcon: Bell,
  helpIcon: HelpCircle,
  lightIcon: Sun,
  darkIcon: Moon,
};

export const metrics: DashboardMetric[] = [
  { title: "Jami ekranlar", value: "0", trend: "0%", helper: "hali ekran ulanmagan", icon: Monitor, tone: "violet" },
  { title: "Onlayn ekranlar", value: "0", trend: "0%", helper: "jami ekranlardan", icon: Wifi, tone: "green" },
  { title: "Joriy kampaniyalar", value: "0", trend: "0", helper: "yangi kampaniya yo'q", icon: Radio, tone: "gold" },
  { title: "Jami ko'rsatishlar", value: "0", trend: "0%", helper: "hisobotlar tozalangan", icon: Video, tone: "blue" },
  { title: "Ogohlantirishlar", value: "0", trend: "0 ta muhim", helper: "ogohlantirish yo'q", icon: AlertTriangle, tone: "red" },
];

export const impressions = [
  { day: "11 May", value: 0 },
  { day: "12 May", value: 0 },
  { day: "13 May", value: 0 },
  { day: "14 May", value: 0 },
  { day: "15 May", value: 0 },
  { day: "16 May", value: 0 },
  { day: "17 May", value: 0 },
];

export const deviceStatuses = [
  { label: "Onlayn", value: 0, color: "#56C66B" },
  { label: "Offline", value: 0, color: "#FF645A" },
  { label: "Nofaol", value: 0, color: "#94A3B8" },
  { label: "Xatolik", value: 0, color: "#D4AF37" },
];

export const topBranches: Array<{ name: string; value: number }> = [];

export const activityItems: ActivityItemData[] = [];

export const mapMarkers: MapMarkerData[] = [];

export const uiIcons = {
  Shield,
  UserRound,
};
