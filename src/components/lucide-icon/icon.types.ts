import type * as icons from 'lucide'

// Extract icon names from lucide icons and convert to kebab-case
type IconNames = keyof typeof icons

// Transform PascalCase icon names to kebab-case
type PascalToKebab<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Uppercase<T>
    ? `-${Lowercase<T>}${PascalToKebab<U>}`
    : `${T}${PascalToKebab<U>}`
  : S

type CleanKebab<S extends string> = S extends `-${infer Rest}` ? Rest : S

/**
 * Type representing all available Lucide icon names in kebab-case format
 *
 * This type is automatically generated from the Lucide icons library
 * and ensures type safety when specifying icon names.
 */
export type LucideIconName = CleanKebab<PascalToKebab<IconNames>>
