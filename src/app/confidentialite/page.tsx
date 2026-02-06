/* eslint-disable react/no-unescaped-entities */
"use client"

import { Mail, Shield, Database } from "lucide-react"

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-foreground">
              Politique de confidentialité
            </h1>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Introduction */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">1. Introduction</h2>
                </div>
                <div className="space-y-3 text-foreground/90">
                  <p>
                    La présente politique de confidentialité décrit la manière dont Adil KHADICH (entrepreneur individuel,
                    exploitant le site Thermo Chrono) collecte, utilise et protège vos données personnelles lorsque vous
                    utilisez notre boutique en ligne.
                  </p>
                  <p>
                    Nous nous engageons à respecter votre vie privée et à protéger vos données conformément au Règlement
                    général sur la protection des données (RGPD) et à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée.
                  </p>
                </div>
              </section>

              {/* Données collectées */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Database className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">2. Données personnelles collectées</h2>
                </div>
                <div className="space-y-3 text-foreground/90">
                  <p>Lors de l'utilisation de notre boutique en ligne, les données suivantes peuvent être collectées :</p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Données liées à la commande et au paiement :</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Nom et prénom</li>
                      <li>Adresse email</li>
                      <li>Adresse de livraison / facturation</li>
                      <li>Numéro de téléphone (si fourni)</li>
                      <li>Données de paiement (traitées directement par Stripe ; nous ne stockons pas les numéros de carte)</li>
                    </ul>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Données techniques et de navigation :</h3>
                    <ul className="list-disc pl-6 space-y-1">
                      <li>Contenu du panier et préférence de langue (stockage local sur votre appareil)</li>
                      <li>Adresse IP, type de navigateur (liés à l'hébergement et au paiement)</li>
                    </ul>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Les données de paiement (carte bancaire, Apple Pay, etc.) sont collectées et traitées par Stripe.
                    Nous ne recevons pas ni ne conservons les numéros de carte.
                  </p>
                </div>
              </section>

              {/* Finalité */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Finalité de la collecte</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Vos données sont utilisées pour :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Exécution des commandes :</strong> traitement des achats, livraison, facturation</li>
                    <li><strong>Paiement :</strong> sécurisation des transactions via Stripe</li>
                    <li><strong>Relation client :</strong> réponses à vos questions, suivi des commandes</li>
                    <li><strong>Obligations légales et comptables :</strong> conservation des pièces et données requises par la loi</li>
                  </ul>
                  <p className="mt-4">
                    <strong>Nous ne vendons ni ne louons vos données personnelles à des tiers à des fins commerciales.</strong>
                  </p>
                </div>
              </section>

              {/* Base légale */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Base légale du traitement</h2>
                <div className="space-y-3 text-foreground/90">
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Exécution du contrat :</strong> traitement nécessaire pour la vente et la livraison des produits</li>
                    <li><strong>Obligations légales :</strong> facturation, comptabilité, conservation des preuves</li>
                    <li><strong>Consentement :</strong> lorsque vous acceptez explicitement un traitement (ex. newsletter, si applicable)</li>
                  </ul>
                </div>
              </section>

              {/* Conservation */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Durée de conservation</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Vos données sont conservées :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Données de commande et facturation :</strong> durée légale et comptable (notamment 10 ans pour les pièces comptables)</li>
                    <li><strong>Données de contact (demandes, réclamations) :</strong> le temps nécessaire au traitement, puis selon obligations légales</li>
                  </ul>
                </div>
              </section>

              {/* Destinataires */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Destinataires des données</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Vos données peuvent être transmises à :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Adil KHADICH (titulaire du site) :</strong> traitement des commandes et relation client</li>
                    <li><strong>Stripe :</strong> traitement des paiements (carte, Apple Pay, etc.). Stripe agit en tant que sous-traitant et est soumis à des obligations de confidentialité et de sécurité</li>
                    <li><strong>Hébergeur du site :</strong> pour le fonctionnement technique du site (hébergeur indiqué dans les mentions légales)</li>
                  </ul>
                  <p className="mt-4">
                    Nous ne transmettons pas vos données à des tiers à des fins publicitaires ou de revente.
                  </p>
                </div>
              </section>

              {/* Sécurité */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-foreground">7. Sécurité des données</h2>
                </div>
                <div className="space-y-3 text-foreground/90">
                  <p>Nous mettons en œuvre des mesures pour protéger vos données contre l'accès non autorisé, la perte ou la divulgation, notamment :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Connexion au site en HTTPS</li>
                    <li>Paiements sécurisés via Stripe (données de carte non stockées sur nos serveurs)</li>
                    <li>Accès aux données personnelles limité aux personnes autorisées</li>
                  </ul>
                </div>
              </section>

              {/* Vos droits */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Vos droits</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Conformément au RGPD, vous disposez notamment des droits suivants :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Droit d'accès :</strong> obtenir une copie des données vous concernant</li>
                    <li><strong>Droit de rectification :</strong> faire corriger des données inexactes ou incomplètes</li>
                    <li><strong>Droit à l'effacement :</strong> demander la suppression de vos données (sous réserve des obligations légales)</li>
                    <li><strong>Droit à la limitation du traitement</strong> et <strong>droit à la portabilité</strong></li>
                    <li><strong>Droit d'opposition :</strong> vous opposer à certains traitements</li>
                  </ul>
                  <p className="mt-4">Pour exercer ces droits, contactez-nous à l'adresse indiquée dans les mentions légales ou ci-dessous.</p>
                  <p className="mt-4">Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).</p>
                </div>
              </section>

              {/* Cookies et stockage local */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Cookies et stockage local</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>
                    Ce site utilise un <strong>stockage local</strong> (localStorage) sur votre appareil pour :
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Le contenu de votre panier (produits et quantités)</li>
                    <li>Votre préférence de langue (français / anglais)</li>
                  </ul>
                  <p>
                    Ces données restent sur votre appareil et ne sont pas envoyées à un serveur d'analyse. Nous n'utilisons
                    pas de cookies de suivi publicitaire ou d'analyse tiers sans votre consentement.
                  </p>
                </div>
              </section>

              {/* Modifications */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">10. Modifications</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>
                    Nous nous réservons le droit de modifier cette politique de confidentialité. Toute modification sera
                    publiée sur cette page avec la date de mise à jour. Nous vous encourageons à la consulter régulièrement.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">11. Contact</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>
                    Pour toute question relative à cette politique ou au traitement de vos données personnelles :
                  </p>
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Email :</p>
                        <a href="mailto:contact@boutique.fr" className="text-primary hover:underline">
                          contact@boutique.fr
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Nous nous engageons à répondre à votre demande dans un délai d'un mois maximum.
                  </p>
                </div>
              </section>

              {/* Dernière mise à jour */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">12. Dernière mise à jour</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>La présente politique de confidentialité a été mise à jour le 02/02/2026.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
