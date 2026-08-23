import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind class names safely. `clsx` resolves conditionals and
 * `tailwind-merge` removes conflicting utilities (e.g. keeping the last
 * `px-*` when several are passed). Used by every styled component.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
