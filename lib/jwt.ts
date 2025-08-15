import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret"

export function signJwt(payload: object, options?: jwt.SignOptions) {
  return jwt.sign(payload, JWT_SECRET, { ...(options || {}), expiresIn: "7d" })
}

export function verifyJwt(token: string): any | null {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    console.error("❌ JWT Verification failed:", error)
    return null
  }
}
