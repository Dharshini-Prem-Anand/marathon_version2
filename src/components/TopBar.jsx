import { Search, Menu, CircleHelp, ChevronDown, Bell } from 'lucide-react'
import SapLogo from './SapLogo'
import MarathonMark from './MarathonMark'

export default function TopBar({ onToggleSidebar, title, personaSelector, searchPlaceholder = 'Search in: "Apps"', roleSelector }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
        <SapLogo />
        <h1 className="topbar-title">{title}</h1>
      </div>

      <div className="topbar-search">
        <Search size={16} className="search-icon" />
        <input type="text" placeholder={searchPlaceholder} readOnly />
      </div>

      <div className="topbar-right">
        {roleSelector && (
          <select className="topbar-role-select" defaultValue={roleSelector.value} onChange={() => {}}>
            {roleSelector.options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        )}
        {personaSelector && (
          <div className="topbar-persona">
            <label>{personaSelector.label}:</label>
            <select defaultValue={personaSelector.value} onChange={() => {}}>
              {personaSelector.options.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}
        <div className="marathon-logo">
          <MarathonMark size={26} />
          <span className="marathon-word">Marathon</span>
        </div>
        <button className="icon-btn" aria-label="Help">
          <CircleHelp size={19} />
        </button>
        <button className="icon-btn" aria-label="Notifications">
          <Bell size={19} />
        </button>
        <button className="user-profile">
          <span className="avatar avatar-blue">JS</span>
          <span className="user-profile-name">John Smith</span>
          <ChevronDown size={15} />
        </button>
      </div>
    </header>
  )
}
