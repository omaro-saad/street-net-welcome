import { useState } from 'react'
import { PLAN_GENERATOR_HASH } from '../routes'
import { useInView } from '../hooks/useInView'

const ABOUT_BOXES_COUNT = 3
const ABOUT_BOXES = [
  { title: 'إدارة متكاملة', text: 'لوحة تحكم واحدة لإدارة جميع إحتياجات الشبكة الخاصة بك. مع تخصيص مستخدمين وصلاحيات خاصة !' },
  { title: 'حفظ بياناتك', text: 'تستطيع في برنامج مدير شبكتك الحصول على نسخة امنة من بياناتك لزيادة الأمان' },
  { title: 'لمزودي الخدمة', text: 'مصمم خصيصاً لأصحاب الشبكات ومزودي الخدمة الصغرى والمتوسطة لتنظيم شبكات الإنترنت.' },
]

const DEFAULT_FEATURES = [
  { id: 1, title: 'المشتركين', desc: 'إدارة المشتركين وبياناتهم واشتراكاتهم' },
  { id: 2, title: 'الموزعين', desc: 'إدارة الموزعين وتوزيع الخدمة' },
  { id: 3, title: 'خطوط الشبكة', desc: 'عرض وإدارة خطوط الشبكة والتحكم فيها' },
  { id: 4, title: 'الخريطة', desc: 'عرض الشبكة والمواقع على الخريطة' },
  { id: 5, title: 'الحزم والباقات', desc: 'إدارة باقات الاشتراك والعروض' },
  { id: 6, title: 'الأجهزة', desc: 'تسجيل وإدارة أجهزة المشتركين' },
  { id: 7, title: 'الموظفين', desc: 'إدارة الموظفين والصلاحيات' },
  { id: 8, title: 'المالية والحسابات', desc: 'المحاسبة والإيرادات والمصروفات' },
]

const USD_TO_NIS = 3.3
const formatNIS = (usd) => `${Math.round(usd * USD_TO_NIS)} شيكل`

const DURATIONS = [
  { key: 'monthly', label: 'شهري' },
  { key: '3months', label: '3 أشهر' },
  { key: 'yearly', label: 'سنوي' },
]

const PLANS = [
  {
    id: 'basic',
    name: 'BASIC',
    features: [
      'المشتركين: مفعّل (15)',
      'الموزعين: مفعّل (7)',
      'الخطوط: مفعّل (3)',
      'الخريطة: غير متاحة',
      'الباقات: 2 مشترك + 2 موزّع',
      'الأجهزة: غير متاحة',
      'الموظفين: مفعّل (5)',
      'المالية: يدوي 30، تلقائي غير محدود',
      'الإعدادات: مفعّلة',
    ],
    prices: [
      { periodKey: 'monthly', usd: 5 },
      { periodKey: '3months', usd: 16 },
      { periodKey: 'yearly', usd: 50 },
    ],
  },
  {
    id: 'plus',
    name: 'PLUS',
    badge: 'Best Plan',
    features: [
      'المشتركين: مفعّل (30)',
      'الموزعين: مفعّل (20)',
      'الخطوط: مفعّل (6)',
      'الخريطة: مفعّل (10 عقدة/خط)',
      'الباقات: 8 + 8',
      'الأجهزة: مفعّل (5 مخازن)',
      'الموظفين: مفعّل (9)',
      'المالية: يدوي 60، تلقائي غير محدود',
      'الإعدادات: مفعّلة',
    ],
    prices: [
      { periodKey: 'monthly', usd: 10 },
      { periodKey: '3months', usd: 28 },
      { periodKey: 'yearly', usd: 110 },
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    badge: 'Most Wanted',
    features: [
      'المشتركين: غير محدود',
      'الموزعين: غير محدود',
      'الخطوط: غير محدود',
      'الخريطة: غير محدود',
      'الباقات: غير محدود',
      'الأجهزة: غير محدود',
      'الموظفين: غير محدود',
      'المالية: غير محدود',
      'الإعدادات: مفعّلة',
    ],
    prices: [
      { periodKey: 'monthly', usd: 25 },
      { periodKey: '3months', usd: 70 },
      { periodKey: 'yearly', usd: 270 },
    ],
  },
]

const APP_URL = 'https://street-net-manager.vercel.app/'
const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=%2B970595696010&text&type=phone_number&app_absent=0'
const CONTACT = {
  email: 'omarssakaik@gmail.com',
  phone: '+970595696010',
  whatsapp: WHATSAPP_URL,
  adminName: 'Omar Saad Skaik',
}

export default function HomePage() {
  const [selectedDuration, setSelectedDuration] = useState('monthly')
  const aboutBoxesToShow = ABOUT_BOXES.slice(0, Math.max(0, ABOUT_BOXES_COUNT))
  const [aboutRef, aboutInView] = useInView()
  const [featuresRef, featuresInView] = useInView()
  const [subsRef, subsInView] = useInView()
  const [contactRef, contactInView] = useInView()

  const getPriceForPlan = (plan) => {
    const p = plan.prices.find((pr) => pr.periodKey === selectedDuration)
    return p ? { usd: p.usd, nis: formatNIS(p.usd) } : null
  }

  return (
    <>
      <nav className="top-nav">
        <div className="top-nav-inner">
          <a href="#">الرئيسية</a>
          <a href="#about">من نحن</a>
          <a href="#features">المميزات</a>
          <a href="#subscriptions">الباقات</a>
          <a href="#contact">تواصل</a>
          <a href={PLAN_GENERATOR_HASH}>مولد الخطة</a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-shapes">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span className="blob" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </div>
        <div className="hero-content safe-area">
          <div className="hero-card">
            <h1>أهلاً بك في برنامج مدير شبكتك</h1>
            <p className="hero-desc">
              مدير شبكتك نظام متكامل لإدارة شبكات الإنترنت بذكاء وتنظيم، مصمم خصيصاً لأصحاب
              الشبكات ومزودي الخدمة الصغرى والمتوسطة والمتقدمة. لوحة تحكم واحدة لإدارة شبكتك.
            </p>
            <div className="hero-ctas">
              <a href="#subscriptions" className="hero-cta hero-cta-primary">اشترك الآن</a>
              <a href={APP_URL} target="_blank" rel="noopener noreferrer" className="hero-cta hero-cta-secondary">
                لديك حساب ؟ سجل الدخول
              </a>
            </div>
          </div>
        </div>
      </section>

      <section ref={aboutRef} className={`section ${aboutInView ? 'in-view' : ''}`} id="about">
        <div className="safe-area">
          <h2 className="section-title">من نحن</h2>
          <p className="section-subtitle">نقدم حلاً متكاملاً لإدارة شبكتك بكل سهولة وموثوقية.</p>
          <div className="about-inner">
            {aboutBoxesToShow.length > 0 && (
              <div className="about-boxes">
                {aboutBoxesToShow.map((box, i) => (
                  <div key={i} className="about-box">
                    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>{box.title}</h3>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{box.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section ref={featuresRef} className={`section ${featuresInView ? 'in-view' : ''}`} id="features">
        <div className="safe-area">
          <h2 className="section-title">مميزات التطبيق</h2>
          <p className="section-subtitle">كل ما تحتاجه لإدارة شبكتك في مكان واحد.</p>
          <div className="features-grid">
            {DEFAULT_FEATURES.map((f) => (
              <div key={f.id} className="feature-card">
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={subsRef} className={`section ${subsInView ? 'in-view' : ''}`} id="subscriptions">
        <div className="safe-area">
          <h2 className="section-title">باقات الاشتراك</h2>
          <div className="duration-trigger">
            {DURATIONS.map((d) => (
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
          <div className="subscriptions-inner">
            <div className="plans-grid">
              {PLANS.map((plan) => {
                const price = getPriceForPlan(plan)
                return (
                  <div
                    key={plan.id}
                    className={`plan-card ${plan.id === 'pro' ? 'pro' : ''} ${plan.id === 'plus' ? 'plus' : ''}`}
                  >
                    {plan.badge && <span className="plan-badge">{plan.badge}</span>}
                    <h3>{plan.name}</h3>
                    {price && (
                      <div className="plan-price-block">
                        <span className="plan-price-usd">${price.usd}</span>
                        <span className="plan-price-nis">{price.nis}</span>
                      </div>
                    )}
                    <ul className="plan-features">
                      {plan.features.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
            <div className="plan-custom">
              <div className="plan-custom-inner">
                <h3>باقة مخصصة</h3>
                <p>احتياجاتك أكبر؟ نعدّ لك باقة مخصصة تناسب حجم شبكتك وأهدافك. تواصل معنا عبر واتساب.</p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="hero-cta hero-cta-secondary">
                  اطلب عرضاً
                </a>
              </div>
            </div>
            <div className="have-plan-now">
              <a href={PLAN_GENERATOR_HASH} className="have-plan-now-link">
                احصل على نسخة من اشتراكك من هنا !
              </a>
            </div>
          </div>
        </div>
      </section>

      <section ref={contactRef} className={`section ${contactInView ? 'in-view' : ''}`} id="contact">
        <div className="safe-area">
          <h2 className="section-title">تواصل معنا</h2>
          <div className="contact-inner">
            <div className="contact-cards">
              <a href={`mailto:${CONTACT.email}`} className="contact-card">
                <span className="contact-icon" aria-hidden>✉</span>
                <span className="contact-label">البريد الإلكتروني</span>
                <span className="contact-value">{CONTACT.email}</span>
              </a>
              <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="contact-card contact-card-whatsapp">
                <span className="contact-icon" aria-hidden>💬</span>
                <span className="contact-label">واتساب / الهاتف</span>
                <span className="contact-value">{CONTACT.phone}</span>
              </a>
              <div className="contact-card contact-card-dev">
                <span className="contact-icon" aria-hidden>👤</span>
                <span className="contact-label">المطور</span>
                <span className="contact-value">{CONTACT.adminName}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} برنامج مدير شبكتك. جميع الحقوق محفوظة.</p>
        <p style={{ marginTop: '0.35rem', fontSize: '0.85rem' }}>مدير شبكتك — Omar Saad Skaik</p>
      </footer>
    </>
  )
}
