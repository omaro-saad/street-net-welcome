export default function NotFound() {
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <span className="not-found-code">404</span>
        <h1>الصفحة غير موجودة</h1>
        <p>لم نتمكن من العثور على الصفحة المطلوبة.</p>
        <a href="#" className="hero-cta hero-cta-primary not-found-btn">
          العودة للرئيسية
        </a>
      </div>
    </div>
  )
}
