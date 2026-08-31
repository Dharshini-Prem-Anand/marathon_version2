import { Search, Menu, CircleHelp, ChevronDown, Bell } from 'lucide-react'
import sapLogo from '../../images/sap-logo-png_seeklogo-465583.png'
import marathonLogo from '../../images/images.jpg'

export default function TopBar({ onToggleSidebar, title, personaSelector, searchPlaceholder = 'Search in: "Apps"', roleSelector }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="icon-btn" aria-label="Toggle sidebar" onClick={onToggleSidebar}>
          <Menu size={20} />
        </button>
<img src={sapLogo} alt="SAP Logo" className="sap-logo" />        <h1 className="topbar-title">{title}</h1>
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
  <img src={marathonLogo} alt="Marathon Logo" className="marathon-logo-image" />
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
