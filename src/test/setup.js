import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/sign-in' }),
  Link: ({ children, to, ...props }) => {
    const React = require('react')
    return React.createElement('a', { href: to, ...props }, children)
  },
}))

// Mock antd message
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd')
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
  }
})

// Mock APIs
vi.mock('../api/certificationsApi', () => ({
  createCertificationRequest: vi.fn(),
}))

vi.mock('../api/authApi', () => ({
  login: vi.fn(),
}))

// Mock context
vi.mock('../context/context', () => ({
  useAuth: () => ({
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
    error: null,
    user: null,
  }),
}))

// Basic global setup for tests
global.ResizeObserver = class ResizeObserver {
  constructor(cb) {
    this.cb = cb
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }], this)
  }
  unobserve() {}
  disconnect() {}
}