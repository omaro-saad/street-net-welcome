/**
 * Simple symmetric cipher for command encryption.
 * Use the same KEY in both apps (encrypt app + decrypt app).
 * Copy this file to the other app to decrypt.
 */
const KEY = 'STREET_NET_CMD_KEY_V1'

function keyBytes() {
  return new TextEncoder().encode(KEY)
}

function xorBytes(data, key) {
  const out = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i] ^ key[i % key.length]
  }
  return out
}

function base64EncodeBytes(bytes) {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

function base64DecodeToBytes(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function encrypt(plaintext) {
  const key = keyBytes()
  const data = new TextEncoder().encode(plaintext)
  const xored = xorBytes(data, key)
  return base64EncodeBytes(xored)
}

export function decrypt(ciphertext) {
  try {
    const key = keyBytes()
    const data = base64DecodeToBytes(ciphertext.trim())
    const xored = xorBytes(data, key)
    return new TextDecoder().decode(xored)
  } catch (e) {
    return ''
  }
}
