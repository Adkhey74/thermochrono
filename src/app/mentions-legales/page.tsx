/* eslint-disable react/no-unescaped-entities */
"use client"

import { Mail } from "lucide-react"

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-foreground">
              Mentions légales
            </h1>

            <div className="prose prose-lg max-w-none space-y-8">
              {/* Éditeur du site */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">1. Éditeur du site</h2>
                <div className="space-y-2 text-foreground/90">
                  <p><strong>Forme juridique :</strong> Entrepreneur individuel (auto-entrepreneur)</p>
                  <p><strong>Dénomination :</strong> Adil KHADICH</p>
                  <p><strong>Siège social :</strong> 13 rue Henri Verjus</p>
                  <p><strong>SIREN :</strong> 999 248 057</p>
                  <p><strong>SIRET du siège :</strong> 999 248 057 00013</p>
                  <p><strong>Inscrite (Insee) le :</strong> 31/12/2025</p>
                  <p><strong>Immatriculée au RNE (INPI)</strong></p>
                  <p><strong>N° TVA intracommunautaire :</strong> FR20 999 248 057</p>
                  <p><strong>Activité principale (NAF/APE) :</strong> Programmation informatique — Code 62.01Z</p>
                  <p><strong>Activité principale (NAF 2025) :</strong> Activités de programmation informatique (62.10Y)</p>
                  <p><strong>Date de création :</strong> 31/12/2025</p>
                  <p><strong>Effectif :</strong> Unité non employeuse (pas de salarié)</p>
                </div>
              </section>

              {/* Directeur de publication */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">2. Directeur de publication</h2>
                <div className="space-y-2 text-foreground/90">
                  <p><strong>Nom :</strong> Adil KHADICH</p>
                  <p><strong>Fonction :</strong> Titulaire de l'entreprise (entrepreneur individuel)</p>
                </div>
              </section>

              {/* Contact */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">3. Contact</h2>
                <div className="space-y-4 text-foreground/90">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold">Email :</p>
                      <a href="mailto:contact@boutique.fr" className="text-primary hover:underline">
                        contact@boutique.fr
                      </a>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Pour toute question relative au site ou à vos commandes, vous pouvez nous contacter à l'adresse ci-dessus.
                  </p>
                </div>
              </section>

              {/* Hébergeur */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">4. Hébergement</h2>
                <div className="space-y-2 text-foreground/90">
                  <p><strong>Hébergeur :</strong> [À compléter — nom de l'hébergeur]</p>
                  <p><strong>Adresse :</strong> [À compléter — adresse de l'hébergeur]</p>
                  <p className="text-sm text-muted-foreground mt-4">
                    Conformément à l'article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.
                  </p>
                </div>
              </section>

              {/* Propriété intellectuelle */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">5. Propriété intellectuelle</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>
                    L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur
                    et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les
                    documents téléchargeables et les représentations iconographiques et photographiques.
                  </p>
                  <p>
                    La reproduction de tout ou partie de ce site sur un support électronique ou autre est formellement
                    interdite sauf autorisation expresse du directeur de publication.
                  </p>
                  <p>
                    La reproduction des textes de ce site sur un support papier est autorisée, notamment dans un cadre
                    pédagogique, sous réserve du respect des trois conditions suivantes :
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>gratuité de la diffusion</li>
                    <li>respect de l'intégrité des documents reproduits (pas de modification ni altération)</li>
                    <li>citation claire et lisible de la source (nom du site et URL)</li>
                  </ul>
                </div>
              </section>

              {/* Protection des données personnelles */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">6. Protection des données personnelles</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>
                    Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au Règlement
                    général sur la protection des données (RGPD), vous disposez d'un droit d'accès, de rectification,
                    de suppression et d'opposition aux données personnelles vous concernant.
                  </p>
                  <p>
                    <strong>Données collectées :</strong> Dans le cadre de la boutique en ligne (commandes, panier,
                    création de compte le cas échéant), peuvent être collectés : nom, prénom, adresse email, adresse
                    postale, numéro de téléphone et données de paiement (traitement sécurisé par Stripe).
                  </p>
                  <p>
                    <strong>Finalité :</strong> Ces données sont collectées pour traiter vos commandes, vous contacter
                    et respecter les obligations légales et comptables.
                  </p>
                  <p>
                    <strong>Conservation :</strong> Les données sont conservées pour la durée nécessaire aux obligations
                    légales et comptables (notamment 10 ans pour les pièces comptables).
                  </p>
                  <p>
                    <strong>Vos droits :</strong> Vous pouvez exercer vos droits en nous contactant à l'adresse email
                    indiquée dans la section Contact. Vous disposez également du droit d'introduire une réclamation
                    auprès de la CNIL.
                  </p>
                  <p>
                    Pour plus d'informations, consultez notre
                    <a href="/confidentialite" className="text-primary hover:underline ml-1">
                      politique de confidentialité
                    </a>.
                  </p>
                </div>
              </section>

              {/* Responsabilité */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">7. Responsabilité</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>
                    Les informations contenues sur ce site sont fournies à titre indicatif. L'éditeur s'efforce de les
                    maintenir à jour mais ne peut garantir l'absence d'inexactitudes ou d'omissions.
                  </p>
                  <p>
                    L'éditeur ne pourra être tenu responsable des dommages directs ou indirects résultant de l'accès
                    ou de l'utilisation du site. Les liens hypertextes vers d'autres sites ne sauraient engager sa responsabilité.
                  </p>
                </div>
              </section>

              {/* Droit applicable */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">8. Droit applicable</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>
                    Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord
                    amiable, les tribunaux français seront seuls compétents.
                  </p>
                </div>
              </section>

              {/* Dernière mise à jour */}
              <section className="bg-card border border-border rounded-xl p-6 sm:p-8 shadow-sm">
                <h2 className="text-2xl font-bold mb-4 text-foreground">9. Dernière mise à jour</h2>
                <div className="space-y-3 text-foreground/90">
                  <p>Les présentes mentions légales ont été mises à jour le 02/02/2026.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
