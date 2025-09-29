import { Metadata } from "next";
import Link from "next/link";
import { Shield, Heart, Users, Calculator, ArrowRight, Phone } from "lucide-react";
import { services, siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Our Services - CVG Family Law",
  description: "Expert family law services including domestic abuse support, children law, divorce proceedings, and financial settlements in Tunbridge Wells, Kent.",
};

const iconMap = {
  Shield,
  Heart,
  Users,
  Calculator,
};

export default function ServicesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Family Law Services
            </h1>
            <p className="text-xl text-gray-600">
              Comprehensive legal support for all family matters, with specialist 
              expertise in domestic abuse and children&apos;s welfare.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding">
        <div className="container-main">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {services.map((service) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap];
              return (
                <div
                  key={service.href}
                  className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">{service.title}</h2>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    {service.features && (
                      <div className="mb-6">
                        <h3 className="font-semibold mb-3">Key Areas:</h3>
                        <ul className="space-y-2">
                          {service.features.slice(0, 4).map((feature) => (
                            <li key={feature} className="flex items-start gap-2">
                              <ArrowRight className="h-4 w-4 text-primary-600 mt-0.5" />
                              <span className="text-sm text-gray-600">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <Link
                      href={service.href}
                      className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
                    >
                      Learn more about {service.title.toLowerCase()}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Choose CVG Family Law?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">25+</div>
              <h3 className="text-xl font-semibold mb-2">Years Combined Experience</h3>
              <p className="text-gray-600">
                Extensive expertise in all areas of family law
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">96%</div>
              <h3 className="text-xl font-semibold mb-2">Success Rate</h3>
              <p className="text-gray-600">
                Proven track record of positive outcomes
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
              <p className="text-gray-600">
                Available when you need us most
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-12 text-center">
            How We Work With You
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Initial Consultation</h3>
                  <p className="text-gray-600">
                    Free 30-minute consultation to understand your situation and discuss 
                    how we can help. No obligations, just honest advice.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Tailored Strategy</h3>
                  <p className="text-gray-600">
                    We develop a personalised approach based on your specific circumstances, 
                    priorities, and desired outcomes.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Expert Representation</h3>
                  <p className="text-gray-600">
                    We handle all legal aspects of your case, keeping you informed at every 
                    stage and fighting for your best interests.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">Resolution & Support</h3>
                  <p className="text-gray-600">
                    We work towards the best possible outcome and continue to support you 
                    through implementation and beyond.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">
            Get Expert Legal Advice Today
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Whatever your family law needs, we&apos;re here to help with compassion, 
            expertise, and dedication.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Book Free Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              <Phone className="h-5 w-5" />
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}