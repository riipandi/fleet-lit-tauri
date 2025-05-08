import type { LucideIcon } from './icon.component'

declare global {
  interface HTMLElementTagNameMap {
    'lucide-icon': LucideIcon
  }
}

export * from './icon.component'
export * from './icon.types'
