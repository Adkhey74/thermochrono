/* eslint-disable react/no-unescaped-entities */
"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export default function CGVPage() {
  const { t } = useI18n()
  return (
    <main className="min-h-screen bg-background">
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <nav className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground" aria-label="Fil d'Ariane">
              <Link href="/" className="hover:text-foreground transition-colors">
                {(t("header.home") as string) ?? "Accueil"}
              </Link>
              <span aria-hidden>/</span>
              <span className="text-foreground font-medium">CGV</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-foreground">
              Conditions générales de vente
            </h1>
            <p className="text-muted-foreground mb-8">
              Les présentes conditions s'appliquent aux ventes conclues sur le site Thermo Chrono. En passant commande, vous acceptez ces conditions sans réserve.
            </p>

            <div className="prose prose-lg max-w-none space-y-8">
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Vendeur et champ d'application</h2>
                <div className="space-y-2 text-foreground/90">
                  <p><strong>Vendeur :</strong> Adil KHADICH (entrepreneur individuel)</p>
                  <p><strong>Siège :</strong> 13 rue Henri Verjus</p>
                  <p><strong>SIRET :</strong> 999 248 057 00013</p>
                  <p><strong>Contact :</strong> <a href="mailto:thermo.chronoo@gmail.com" className="text-primary hover:underline">thermo.chronoo@gmail.com</a></p>
                  <p className="mt-3">
                    Les présentes CGV régissent les ventes de produits proposés sur le site. Elles s'appliquent à tout acheteur, consommateur ou professionnel.
                  </p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Produits et prix</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Les produits proposés sont ceux qui figurent sur le site à la date de consultation. Les photographies et descriptions sont les plus fidèles possibles ; des variations mineures peuvent exister.</p>
                  <p>Les prix sont indiqués en euros TTC. Ils comprennent les éventuelles taxes applicables mais hors frais de livraison. Les frais de livraison sont indiqués avant validation de la commande (livraison offerte à partir de 50 € d'achat, sinon 3,99 €).</p>
                  <p>Le vendeur se réserve le droit de modifier ses prix à tout moment. Les commandes sont facturées aux prix en vigueur au moment de la validation.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Commandes</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>La commande est validée après confirmation du paiement. Un email de confirmation récapitulant la commande et l'adresse de livraison vous est envoyé.</p>
                  <p>Le vendeur se réserve le droit d'annuler toute commande en cas de problème de paiement, d'adresse anormale, de fraude ou d'erreur manifeste sur les quantités ou les prix.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Paiement</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Le paiement s'effectue en ligne par carte bancaire (Visa, Mastercard, CB), Apple Pay ou Google Pay, via la plateforme sécurisée Mollie.</p>
                  <p>La commande est débitée au moment de la validation. En cas de refus du paiement, la commande ne sera pas prise en compte.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Livraison</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Les produits sont expédiés sous 24 à 48 h ouvrées après validation du paiement. La livraison est assurée en 7 à 10 jours ouvrés en France métropolitaine (hors week-ends et jours fériés). Un email avec le suivi du colis vous est adressé.</p>
                  <p><strong>Frais de livraison :</strong> livraison offerte pour les commandes de 50 € et plus ; au-dessous de 50 €, des frais de 3,99 € s'appliquent.</p>
                  <p>En cas de retard ou de perte, le client doit informer le vendeur dans les meilleurs délais pour qu'une enquête soit ouverte auprès du transporteur.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Droit de rétractation (consommateurs)</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Conformément aux articles L.221-18 et suivants du Code de la consommation, vous disposez d'un délai de <strong>14 jours calendaires</strong> à compter de la réception du produit pour exercer votre droit de rétractation, sans avoir à justifier de motifs.</p>
                  <p>Pour exercer ce droit, notifiez-nous votre décision par email (thermo.chronoo@gmail.com). Les produits doivent être renvoyés dans leur état d'origine, non utilisés et dans leur emballage, à vos frais. Le remboursement sera effectué sous 14 jours suivant la réception des produits, par le même moyen de paiement que celui utilisé à l'achat.</p>
                  <p>En cas d'utilisation du produit au-delà de ce qu'il faut pour en vérifier la nature et le fonctionnement, une déduction pour dépréciation peut être appliquée.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Garantie et satisfait ou remboursé</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Nos produits bénéficient de la garantie légale de conformité (articles L.217-4 et suivants du Code de la consommation) et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).</p>
                  <p>En outre, nous proposons une <strong>garantie satisfait ou remboursé sous 30 jours</strong> : si le produit ne vous convient pas, contactez-nous pour organiser le retour et le remboursement.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Responsabilité</h2>
                <div className="space-y-2 text-foreground/90">
                  <p>La responsabilité du vendeur est limitée au montant de la commande. Il ne peut être tenu responsable des dommages indirects (manque à gagner, perte de données, etc.).</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Données personnelles</h2>
                <div className="space-y-2 text-foreground/90">
                  <p>Les données collectées pour le traitement des commandes et la livraison sont traitées conformément à notre politique de confidentialité. Consultez notre page <Link href="/confidentialite" className="text-primary hover:underline">Confidentialité</Link> pour plus d'informations.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">10. Droit applicable et litiges</h2>
                <div className="space-y-2 text-foreground/90">
                  <p>Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. Pour les consommateurs, les médiateurs de la consommation peuvent être saisis ; les coordonnées sont disponibles sur le site.</p>
                </div>
              </section>

              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">11. Contact</h2>
                <div className="space-y-4 text-foreground/90">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">
                        Email :{" "}
                        <a href="mailto:thermo.chronoo@gmail.com" className="text-primary hover:underline">
                          thermo.chronoo@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pour toute question relative à ces conditions ou à votre commande, vous pouvez nous contacter à l'adresse ci-dessus.
                  </p>
                </div>
              </section>
            </div>

            <p className="mt-10 text-sm text-muted-foreground">
              Dernière mise à jour : février 2025
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
