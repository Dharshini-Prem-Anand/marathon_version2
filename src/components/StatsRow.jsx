import {
  Mail,
  CheckCircle2,
  FileText,
  User,
  Copy,
  Clock,
  Target,
  List,
  AlertTriangle,
  ShieldCheck,
  PieChart,
  Search,
  Send,
  Sparkles,
  RefreshCw,
  XCircle,
  Briefcase,
  Calendar,
  Users,
} from 'lucide-react'

const iconMap = {
  mail: Mail,
  checkCircle: CheckCircle2,
  fileText: FileText,
  user: User,
  copy: Copy,
  clock: Clock,
  target: Target,
  list: List,
  alertTriangle: AlertTriangle,
  shield: ShieldCheck,
  pieChart: PieChart,
  search: Search,
  send: Send,
  sparkles: Sparkles,
  refresh: RefreshCw,
  xCircle: XCircle,
  briefcase: Briefcase,
  calendar: Calendar,
  users: Users,
}

export default function StatsRow({ stats }) {
  return (
    <div className="stats-row">
      {stats.map((s) => {
        const Icon = iconMap[s.icon]
        return (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-header">
              <div className={`stat-icon color-${s.valueColor}`}>
                <Icon size={16} strokeWidth={1.8} />
              </div>
              <span className="stat-label">{s.label}</span>
            </div>
            <div className={`stat-value color-${s.valueColor}`}>{s.value}</div>
            {s.target && <div className="stat-target">{s.target}</div>}
          </div>
        )
      })}
    </div>
  )
}
