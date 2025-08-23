export interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "new" | "read" | "replied" | "resolved"
  createdAt: string
  updatedAt: string
}

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ContactResponse {
  message: string
  contactId?: string
  error?: string
  details?: string[]
}

export interface ContactListResponse {
  contacts: Contact[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
