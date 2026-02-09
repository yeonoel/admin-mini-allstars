import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate un prix en euros (EUR)
 * @param price - Prix à formater
 * @param currency - Devise (défaut: EUR)
 * @returns Prix formaté (ex: "1 234,56 €")
 */
export function formatPrice(price: number | string, options: { currency?: 'USD' | 'EUR', notation?: Intl.NumberFormatOptions['notation'] } = {}) {
  const { currency = 'EUR', notation = 'standard' } = options
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    notation,
    maximumFractionDigits: 2,
  }).format(numericPrice)
}

/**
 * Formate une date au format français court
 * @param date - Date à formater (string ISO ou Date object)
 * @returns Date formatée (ex: "15/12/2024")
 */
export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
};


/**
 * Formate un nombre avec séparateurs de milliers
 * @param num - Nombre à formater
 * @returns Nombre formaté (ex: "1 234 567")
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fr-FR').format(num);
};