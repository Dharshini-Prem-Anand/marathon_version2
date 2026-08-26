import {
  LayoutDashboard,
  Mail,
  FileText,
  CheckCircle2,
  Grid3x3,
  AlertTriangle,
  Layers,
  Users,
  BarChart3,
  Search,
  FileCheck2,
  BarChart2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { sidebarItems } from '../data'

const iconMap = {
  layoutDashboard: LayoutDashboard,
  mail: Mail,
  fileText: FileText,
  checkCircle: CheckCircle2,
  grid: Grid3x3,
  alertTriangle: AlertTriangle,
  layers: Layers,
  users: Users,
  barChart: BarChart3,
  search: Search,
  fileCheck: FileCheck2,
  barChart2: BarChart2,
  sparkles: Sparkles,
}

export default function Sidebar({ active, onSelect, collapsed, onToggleCollapse }) {
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      <nav className="sidebar-nav">
        {sidebarItems.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive = active === item.label
          return (
            <button
              key={item.label}
              className={`sidebar-item${isActive ? ' active' : ''}`}
              onClick={() => onSelect(item.label)}
              title={item.label}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{item.label}</span>
              {item.badge && !collapsed && <span className="sidebar-badge">{item.badge}</span>}
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button className="sidebar-collapse-btn" onClick={onToggleCollapse}>
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
