import { Users, Clock, CheckCircle2 } from 'lucide-react'
import { valueDeliveredTriage } from '../data'

const iconMap = {
  users: Users,
  clock: Clock,
  checkCircle: CheckCircle2,
}

export default function ValueDeliveredRow() {
  return (
    <section className="panel">
      <h2 className="panel-title">Value Delivered (Last 7 Days)</h2>
      <div className="value-delivered-row">
        {valueDeliveredTriage.map((v) => {
          const Icon = iconMap[v.icon]
          return (
            <div className="value-delivered-item" key={v.label}>
              <div className="value-delivered-icon">
                <Icon size={20} strokeWidth={1.6} />
              </div>
              <div>
                <div className="value-delivered-value">{v.value}</div>
                <div className="value-delivered-label">{v.label}</div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
