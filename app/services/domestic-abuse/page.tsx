"use client";

import Link from "next/link";
import { Shield, Phone, AlertCircle, Heart, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export default function DomesticAbusePage() {
  return (
    <>
      {/* Emergency Banner */}
      <div className="bg-red-600 text-white px-4 py-6">
        <div className="container-main">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6" />
              <div>
                <p className="font-bold text-lg">In immediate danger? Call 999</p>
                <p className="text-sm opacity-90">For urgent legal advice: {siteConfig.phone}</p>
              </div>
            </div>
            <button
              onClick={() => {
                window.open("https://www.google.com", "_newtab");
                window.location.replace("https://www.google.com");
              }}
              className="bg-white text-red-600 px-6 py-2 rounded font-semibold hover:bg-red-50 transition-colors"
            >
              Quick Exit
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Domestic Abuse Support
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              You don&apos;t have to face this alone. We provide urgent, compassionate legal 
              support to protect you and your children from domestic abuse.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Call for Urgent Help
              </a>
              <Link
                href="/contact"
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                Book Confidential Consultation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Understanding Abuse */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Understanding Domestic Abuse
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-3xl mx-auto">
              Domestic abuse isn&apos;t just physical violence. It includes any behaviour used to 
              control, coerce, threaten, or intimidate a partner or family member.
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Physical Abuse</h3>
                <p className="text-gray-600">
                  Any form of physical violence including hitting, pushing, restraining, or 
                  threats of physical harm.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Emotional Abuse</h3>
                <p className="text-gray-600">
                  Verbal attacks, threats, isolation from friends and family, constant criticism, 
                  or humiliation.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Financial Abuse</h3>
                <p className="text-gray-600">
                  Controlling finances, preventing work, stealing money, or refusing access to 
                  joint accounts.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Coercive Control</h3>
                <p className="text-gray-600">
                  Pattern of controlling behaviour including monitoring, restricting freedom, or 
                  making threats.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Sexual Abuse</h3>
                <p className="text-gray-600">
                  Any non-consensual sexual activity or using sex as a weapon for power and 
                  control.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-3 text-primary-600">Digital Abuse</h3>
                <p className="text-gray-600">
                  Using technology to harass, stalk, or monitor including tracking devices or 
                  social media harassment.
                </p>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-secondary-50 rounded-lg">
              <p className="text-center text-lg">
                <strong>Remember:</strong> Abuse is never your fault, and you deserve to live 
                free from fear. We support victims of all genders and backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Protection */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Legal Protection Available
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Non-Molestation Orders</h3>
                    <p className="text-gray-600 mb-3">
                      Prevents your abuser from using or threatening violence, harassing, or 
                      intimidating you. Breach is a criminal offense with immediate arrest powers.
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Can be obtained within 24 hours in emergencies</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Protects you and your children</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Can include specific locations like home, work, or school</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Occupation Orders</h3>
                    <p className="text-gray-600 mb-3">
                      Decides who can live in the family home and can exclude your abuser, even 
                      if they own or rent the property.
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Secures safe housing for you and children</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Can regulate who enters the property</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">May include power of arrest for breaches</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <Shield className="h-8 w-8 text-primary-600 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-2">Prohibited Steps Orders</h3>
                    <p className="text-gray-600 mb-3">
                      Prevents specific actions regarding children, such as removing them from 
                      your care or taking them abroad.
                    </p>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Protects children from abduction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Can restrict contact with specific individuals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                        <span className="text-sm text-gray-600">Enforceable by police</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Support */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              How We Support You
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Immediate Action</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <p className="text-gray-600">Emergency appointments available same day</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <p className="text-gray-600">Court applications within 24 hours when needed</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary-600 mt-0.5" />
                    <p className="text-gray-600">Liaison with police and support services</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Ongoing Support</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <p className="text-gray-600">Confidential, judgment-free environment</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <p className="text-gray-600">Support through court proceedings</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <p className="text-gray-600">Referrals to counselling and support groups</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Additional Support Resources
            </h2>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-4">Emergency Contacts</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <strong>Emergency Services:</strong> 999
                    <p className="text-sm text-gray-600">Always call if in immediate danger</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <strong>National Domestic Abuse Helpline:</strong> 0808 2000 247
                    <p className="text-sm text-gray-600">24/7 confidential support</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <strong>Men&apos;s Advice Line:</strong> 0808 8010 327
                    <p className="text-sm text-gray-600">Support for male victims</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-0.5" />
                  <div>
                    <strong>Galop LGBT+ Domestic Abuse:</strong> 0800 999 5428
                    <p className="text-sm text-gray-600">Specialist LGBT+ support</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">
            Take the First Step to Safety
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            You deserve to live free from fear. Our specialist team is here to help you 
            take back control and protect yourself and your children.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Call Now for Help
            </a>
            <Link
              href="/contact"
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              Book Confidential Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}