import Cookies from 'js-cookie'
import { v4 as uuidv4 } from 'uuid'

const SESSION_KEY = 'nafay_session_id'
const SESSION_EXPIRY_DAYS = 365

export function getSessionId(): string {
  if (typeof window === 'undefined') return ''

  let sessionId = Cookies.get(SESSION_KEY)

  if (!sessionId) {
    sessionId = uuidv4()
    Cookies.set(SESSION_KEY, sessionId, { expires: SESSION_EXPIRY_DAYS })
  }

  return sessionId
}

export function clearSession(): void {
  Cookies.remove(SESSION_KEY)
}
