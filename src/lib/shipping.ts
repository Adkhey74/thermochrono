/**
 * Règle des frais de livraison :
 * - Commande < 50 € → frais de 3,99 €
 * - Commande ≥ 50 € → livraison gratuite
 */

export const SHIPPING_THRESHOLD_EUR = 50
export const SHIPPING_FEE_EUR = 3.99

/**
 * Montant des frais de livraison en euros (après remise).
 * @param amountAfterDiscount Montant de la commande après réduction (en €)
 */
export function getShippingFee(amountAfterDiscount: number): number {
  return amountAfterDiscount < SHIPPING_THRESHOLD_EUR ? SHIPPING_FEE_EUR : 0
}
