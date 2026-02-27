import { useState } from 'react'
import { decrypt } from '../utils/cipher'
import './PlanGenerator.css'

export default function DecryptPage() {
  const [encrypted, setEncrypted] = useState('')
  const [decrypted, setDecrypted] = useState('')

  const handleDecrypt = () => {
    const out = decrypt(encrypted)
    setDecrypted(out || '(فشل فك التشفير أو نص فارغ)')
  }

  return (
    <div className="plan-generator-page">
      <div className="pg safe-area">
        <h1 className="pg-title">فك تشفير الأمر</h1>
        <p className="pg-subtitle">
          الصق النص المشفّر ثم اضغط فك التشفير لعرض الأمر.
        </p>

        <section className="pg-section">
          <h2 className="pg-heading">النص المشفّر</h2>
          <textarea
            className="pg-textarea"
            placeholder="الصق الكود المشفّر هنا..."
            value={encrypted}
            onChange={(e) => setEncrypted(e.target.value)}
            rows={4}
            dir="ltr"
          />
          <button type="button" className="pg-btn pg-btn-generate" onClick={handleDecrypt}>
            فك التشفير
          </button>
        </section>

        {decrypted && (
          <section className="pg-section pg-section-prompt decrypt-result">
            <h2 className="pg-heading">الأمر بعد فك التشفير</h2>
            <pre className="pg-prompt-text" dir="ltr">{decrypted}</pre>
          </section>
        )}

        <section className="pg-section" style={{ marginTop: '1.5rem' }}>
          <a href="#" className="pg-btn pg-btn-copy" style={{ textDecoration: 'none', display: 'inline-block' }}>
            العودة للرئيسية
          </a>
        </section>
      </div>
    </div>
  )
}
