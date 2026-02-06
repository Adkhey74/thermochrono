"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
import { useI18n } from "@/lib/i18n/context"

export function Contact() {
  const { t } = useI18n()
  
  return (
    <section className="py-24 bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="text-sm font-semibold text-primary">{t("header.contact")}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            {t("contact.title")}
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {t("contact.description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Formulaire de contact */}
          <Card className="border border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-foreground mb-2">{t("contact.quoteRequest")}</CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {t("contact.quoteRequestDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-foreground">
                      {t("contact.firstName")}
                    </label>
                    <Input id="firstName" placeholder={t("contact.firstNamePlaceholder") as string} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-foreground">
                      {t("contact.lastName")}
                    </label>
                    <Input id="lastName" placeholder={t("contact.lastNamePlaceholder") as string} className="h-11" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground">
                    {t("contact.email")}
                  </label>
                  <Input id="email" type="email" placeholder={t("contact.emailPlaceholder") as string} className="h-11" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
                    {t("contact.phone")}
                  </label>
                  <Input id="phone" type="tel" placeholder={t("contact.phonePlaceholder") as string} className="h-11" />
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="block text-sm font-semibold text-foreground">
                    {t("contact.serviceType")}
                  </label>
                  <select 
                    id="service" 
                    className="w-full h-11 px-3 py-2 border border-input bg-background rounded-lg text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
                  >
                    <option value="">{t("contact.selectService")}</option>
                    <option value="aeroport">{t("reservation.serviceTypes.aeroport")}</option>
                    <option value="ville">{t("reservation.serviceTypes.ville")}</option>
                    <option value="express">{t("reservation.serviceTypes.express")}</option>
                    <option value="forfait">{t("reservation.serviceTypes.forfait")}</option>
                    <option value="medical">{t("reservation.serviceTypes.medical")}</option>
                    <option value="ski">{t("reservation.serviceTypes.ski")}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-foreground">
                    {t("contact.message")}
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder={t("contact.messagePlaceholder") as string} 
                    rows={5}
                    className="resize-none"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold h-12" size="lg">
                  {t("contact.sendRequest")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Informations de contact */}
          <div className="space-y-6">
            <Card className="border border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">{t("contact.contactInfo")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                  <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t("contact.phoneTitle")}</h3>
                    <p className="text-foreground font-medium">09 52 47 36 25</p>
                    <p className="text-foreground font-medium">06 58 68 65 48</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("contact.phoneAvailability")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                  <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t("contact.emailTitle")}</h3>
                    <p className="text-foreground font-medium">contact@hern-taxi.fr</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("contact.emailResponse")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                  <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t("contact.serviceArea")}</h3>
                    <p className="text-foreground font-medium">{t("contact.serviceAreaDesc")}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("contact.serviceRadius")}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 border border-primary/10 hover:bg-primary/10 transition-colors">
                  <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{t("contact.availability")}</h3>
                    <p className="text-foreground font-medium">{t("contact.availabilityDesc")}</p>
                    <p className="text-sm text-muted-foreground mt-1">{t("contact.availabilityDetails")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-foreground">{t("contact.expressReservation")}</CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {t("contact.expressReservationDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 font-semibold h-12">
                  <Phone className="mr-2 h-5 w-5" />
                  {t("contact.callNow")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
