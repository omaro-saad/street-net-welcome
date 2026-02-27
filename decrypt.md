# Decrypt tool – install in your app

Use this guide to add the decrypt tool to another app (or the same app) so you can turn the encrypted command back into the real terminal command.

---

## 1. Copy the cipher utility

Copy the file **`src/utils/cipher.js`** from this project into your target app. Keep the same path (e.g. `src/utils/cipher.js`) or adjust imports below.

**Important:** Do **not** change the `KEY` inside `cipher.js`. It must stay:

```js
const KEY = 'STREET_NET_CMD_KEY_V1'
```

The encrypt app (Plan Generator) and the decrypt app must use the same key.

---

## 2. Use the decrypt function

In the app where you want to decrypt:

```js
import { decrypt } from './utils/cipher'   // or your path to cipher.js

// Get encrypted string (e.g. from user paste)
const encryptedString = '...'  // base64-looking text from Plan Generator

const realCommand = decrypt(encryptedString)
// realCommand is the full npm command, e.g.:
// npm run create-user -- "admin" "pass" "123456" "basic" 31
```

- If decryption fails or input is invalid, `decrypt()` returns an empty string `''`.

---

## 3. Optional: minimal decrypt UI

Add a simple page or section:

1. A **textarea** for the user to paste the encrypted code.
2. A **button** “فك التشفير” (or “Decrypt”) that calls `decrypt(textareaValue)`.
3. A **read-only** area (e.g. `<pre>`) to show the decrypted command.

Example (React):

```jsx
import { useState } from 'react'
import { decrypt } from './utils/cipher'

export default function DecryptTool() {
  const [encrypted, setEncrypted] = useState('')
  const [decrypted, setDecrypted] = useState('')

  const handleDecrypt = () => {
    setDecrypted(decrypt(encrypted) || '(فشل فك التشفير)')
  }

  return (
    <div>
      <textarea
        value={encrypted}
        onChange={(e) => setEncrypted(e.target.value)}
        placeholder="الصق الكود المشفّر هنا..."
        rows={4}
      />
      <button onClick={handleDecrypt}>فك التشفير</button>
      {decrypted && <pre>{decrypted}</pre>}
    </div>
  )
}
```

---

## 4. Command shape after decryption

The decrypted string is a single line, for example:

```
npm run create-user -- "OadminUser" "OadminPass" "123456" "basic" 31
```

- **Duration is a number:** `31` = شهر، `91` = 3 أشهر، `366` = سنوي.
- Arguments may be quoted if they contain spaces.

User runs this in the terminal (copy from the decrypt output).

---

## 5. This app’s decrypt page (no links)

In this project, the decrypt UI is available at:

**`#decrypt`**  
e.g. `https://your-site.com/#decrypt`

There are no in-app links to it; open it by URL or bookmark. It uses the same `cipher.js` and the same key.

---

## 6. Full prompt for an AI / developer

You can give this to someone (or an AI) to implement the decrypt tool in another codebase:

---

**Prompt: add a decrypt tool for Street Net command**

1. Add a file **`utils/cipher.js`** (or equivalent) with:
   - A constant **`KEY = 'STREET_NET_CMD_KEY_V1'`**.
   - **`encrypt(plaintext)`**: encode plaintext to UTF-8 bytes, XOR each byte with the key (repeated), then Base64 encode. Return the Base64 string.
   - **`decrypt(ciphertext)`**: Base64 decode, XOR with the same key, UTF-8 decode. Return the plaintext; on error return `''`.

2. Implement decryption logic:
   - XOR with key: `out[i] = data[i] ^ key[i % key.length]`.
   - Base64: use `btoa`/`atob` with binary string (bytes as `String.fromCharCode` / `charCodeAt`).

3. In the app, add a small UI: textarea (paste encrypted string), button “Decrypt”, and a read-only area showing the result of `decrypt(pastedText)`. The result is the real terminal command (one line); user copies it and runs it in the terminal.

4. Duration in the command is numeric: 31 (month), 91 (3 months), 366 (year). Do not change the cipher key; it must match the app that encrypts.

---

End of guide.
