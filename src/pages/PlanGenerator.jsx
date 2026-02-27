import { useState, useMemo } from 'react'
import { PLAN_GENERATOR_HASH } from '../routes'
import { encrypt } from '../utils/cipher'
import './PlanGenerator.css'

const PLAN_OPTIONS = [
  { id: 'basic', name: 'BASIC' },
  { id: 'plus', name: 'PLUS' },
  { id: 'pro', name: 'PRO' },
]

const DURATION_OPTIONS = [
  { key: 'monthly', label: 'شهري', days: 31 },
  { key: '3months', label: '3 أشهر', days: 91 },
  { key: 'yearly', label: 'سنوي', days: 366 },
]

const DURATION_DAYS = { monthly: 31, '3months': 91, yearly: 366 }

const SUPPORT_WHATSAPP_URL = 'https://api.whatsapp.com/send?phone=970595696010'

function generateSecretCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function buildPrompt(admin, secretCode, plan, durationKey, ousers) {
  const durationNum = DURATION_DAYS[durationKey] ?? '<duration>'
  const parts = [
    'npm', 'run', 'create-user', '--',
    admin.username.trim() || '<OadminUsername>',
    admin.password.trim() ? '"***"' : '<OadminPassword>',
    secretCode || '<secretCode>',
    plan || '<plan>',
    String(durationNum),
  ]
  ousers.forEach((u, i) => {
    if (u.username.trim() || u.password || u.code) {
      parts.push(u.username.trim() || `<OuserUser${i + 1}>`)
      parts.push(u.password ? '"***"' : `<OuserPass${i + 1}>`)
      parts.push(u.code || `<OuserCode${i + 1}>`)
    }
  })
  return parts.join(' ')
}

function quoteArg(s) {
  const str = String(s ?? '')
  if (/[\s"\\]/.test(str)) return `"${str.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
  return str
}

function buildPromptForCopy(admin, secretCode, plan, durationKey, ousers) {
  const durationNum = DURATION_DAYS[durationKey] ?? 31
  const parts = [
    'npm', 'run', 'create-user', '--',
    quoteArg(admin.username.trim() || 'OadminUsername'),
    quoteArg(admin.password.trim() || 'OadminPassword'),
    quoteArg(secretCode || '123456'),
    quoteArg(plan || 'basic'),
    String(durationNum),
  ]
  ousers.forEach((u, i) => {
    if (u.username.trim() || u.password || u.code) {
      parts.push(quoteArg(u.username.trim() || `OuserUser${i + 1}`))
      parts.push(quoteArg(u.password || `OuserPass${i + 1}`))
      parts.push(quoteArg(u.code || generateSecretCode()))
    }
  })
  return parts.join(' ')
}

export default function PlanGenerator() {
  const [selectedPlan, setSelectedPlan] = useState('basic')
  const [selectedDuration, setSelectedDuration] = useState('monthly')
  const [admin, setAdmin] = useState({ username: '', password: '' })
  const [secretCode, setSecretCode] = useState(() => generateSecretCode())
  const [ousers, setOusers] = useState([])
  const [copied, setCopied] = useState(false)

  const generateSecret = () => setSecretCode(generateSecretCode())

  const addOuser = () => {
    setOusers((prev) => [...prev, { username: '', password: '', code: generateSecretCode() }])
  }

  const removeOuser = (index) => {
    setOusers((prev) => prev.filter((_, i) => i !== index))
  }

  const updateOuser = (index, field, value) => {
    setOusers((prev) => prev.map((u, i) => (i === index ? { ...u, [field]: value } : u)))
  }

  const generateOuserCode = (index) => {
    setOusers((prev) => prev.map((u, i) => (i === index ? { ...u, code: generateSecretCode() } : u)))
  }

  const realPrompt = useMemo(
    () => buildPromptForCopy(admin, secretCode, selectedPlan, selectedDuration, ousers),
    [admin, secretCode, selectedPlan, selectedDuration, ousers]
  )

  const encryptedDisplay = useMemo(
    () => encrypt(realPrompt),
    [realPrompt]
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(encryptedDisplay)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_) {}
  }

  const whatsappSupportUrl = `${SUPPORT_WHATSAPP_URL}&text=${encodeURIComponent(encryptedDisplay)}`

  return (
    <div className="plan-generator-page">
      <nav className="top-nav">
        <div className="top-nav-inner">
          <a href="#">الرئيسية</a>
          <a href={PLAN_GENERATOR_HASH} className="nav-active">مولد الخطة</a>
        </div>
      </nav>

      <div className="pg safe-area">
        <h1 className="pg-title">مولد أمر الاشتراك</h1>
        <p className="pg-subtitle">
          اختر الباقة والمدة، أدخل بيانات المدير والرمز السري، ثم انسخ الأمر إلى الطرفية.
        </p>

        <section className="pg-section">
          <h2 className="pg-heading">اختر الباقة</h2>
          <div className="pg-plan-cards">
            {PLAN_OPTIONS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`pg-plan-card ${selectedPlan === p.id ? 'active' : ''} ${p.id}`}
                onClick={() => setSelectedPlan(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>
        </section>

        <section className="pg-section">
          <h2 className="pg-heading">مدة الاشتراك</h2>
          <div className="pg-duration">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                className={`duration-btn ${selectedDuration === d.key ? 'active' : ''}`}
                onClick={() => setSelectedDuration(d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>
        </section>

        <section className="pg-section">
          <h2 className="pg-heading">مدير المنظمة (Admin)</h2>
          <div className="pg-fields">
            <label className="pg-label">
              <span>اسم المستخدم</span>
              <input
                type="text"
                className="pg-input"
                placeholder="Admin Username"
                value={admin.username}
                onChange={(e) => setAdmin((a) => ({ ...a, username: e.target.value }))}
              />
            </label>
            <label className="pg-label">
              <span>كلمة المرور</span>
              <input
                type="password"
                className="pg-input"
                placeholder="Admin Password"
                value={admin.password}
                onChange={(e) => setAdmin((a) => ({ ...a, password: e.target.value }))}
              />
            </label>
          </div>
        </section>

        <section className="pg-section">
          <h2 className="pg-heading">الرمز السري (6 أرقام)</h2>
          <div className="pg-secret-row pg-secret-row-main">
            <input
              type="text"
              className="pg-input pg-input-code"
              value={secretCode}
              readOnly
              maxLength={6}
              dir="ltr"
            />
            <button type="button" className="pg-btn pg-btn-generate" onClick={generateSecret}>
              توليد رمز
            </button>
          </div>
        </section>

        <section className="pg-section">
          <div className="pg-heading-row">
            <h2 className="pg-heading">موظفون (User) — إضافي 20$ لكل موظف</h2>
            <button type="button" className="pg-btn pg-btn-add" onClick={addOuser}>
              + إضافة موظف
            </button>
          </div>
          <p className="pg-hint">الموظف ليس مديراً؛ يمكن تخصيص الصلاحيات لاحقاً من إعدادات التطبيق.</p>
          {ousers.map((u, i) => (
            <div key={i} className="pg-ouser-card">
              <span className="pg-ouser-num">موظف {i + 1}</span>
              <div className="pg-ouser-fields">
                <input
                  type="text"
                  className="pg-input"
                  placeholder={`User Username${i + 1}`}
                  value={u.username}
                  onChange={(e) => updateOuser(i, 'username', e.target.value)}
                />
                <input
                  type="password"
                  className="pg-input"
                  placeholder={`User Password${i + 1}`}
                  value={u.password}
                  onChange={(e) => updateOuser(i, 'password', e.target.value)}
                />
                <div className="pg-secret-row">
                  <input
                    type="text"
                    className="pg-input pg-input-code"
                    value={u.code}
                    readOnly
                    maxLength={6}
                    dir="ltr"
                  />
                  <button type="button" className="pg-btn pg-btn-small" onClick={() => generateOuserCode(i)}>
                    توليد
                  </button>
                </div>
              </div>
              <button type="button" className="pg-btn pg-btn-remove" onClick={() => removeOuser(i)}>
                حذف
              </button>
            </div>
          ))}
        </section>

        <section className="pg-section pg-section-prompt">
          <h2 className="pg-heading">الأمر المشفّر — انسخ والصق في التطبيق الآخر لفك التشفير</h2>
          <div className="pg-prompt-box">
            <pre className="pg-prompt-text" dir="ltr">{encryptedDisplay}</pre>
            <button type="button" className="pg-btn pg-btn-copy" onClick={handleCopy}>
              {copied ? 'تم النسخ!' : 'نسخ'}
            </button>
          </div>
          <a
            href={whatsappSupportUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="pg-btn pg-btn-whatsapp"
          >
            أرسل هذا للدعم للوصول إلى إشتراكك الجديد
          </a>
        </section>
      </div>
    </div>
  )
}
