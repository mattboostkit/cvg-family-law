import { Metadata } from "next";
import Link from "next/link";
import { ResourceLibrary } from "@/components/ResourceLibrary";
import { BookOpen, Phone, AlertCircle, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources - CVG Family Law",
  description: "Comprehensive resource library with downloadable guides, safety planning tools, and legal information for domestic abuse victims and family law matters.",
};

const supportOrganizations = [
  {
    category: "Domestic Abuse Support",
    organizations: [
      {
        name: "National Domestic Abuse Helpline",
        phone: "0808 2000 247",
        description: "24/7 confidential support for women",
        website: "https://www.nationaldahelpline.org.uk/",
      },
      {
        name: "Men's Advice Line",
        phone: "0808 8010 327",
        description: "Support for male victims of domestic abuse",
        website: "https://mensadviceline.org.uk/",
      },
      {
        name: "Galop",
        phone: "0800 999 5428",
        description: "Support for LGBT+ victims of domestic abuse",
        website: "https://galop.org.uk/",
      },
      {
        name: "Refuge",
        phone: "0808 2000 247",
        description: "Support services and emergency accommodation",
        website: "https://www.refuge.org.uk/",
      },
    ],
  },
  {
    category: "Children & Family Support",
    organizations: [
      {
        name: "Cafcass",
        phone: "0300 456 4000",
        description: "Children and Family Court Advisory Service",
        website: "https://www.cafcass.gov.uk/",
      },
      {
        name: "NSPCC",
        phone: "0808 800 5000",
        description: "Help for adults concerned about a child",
        website: "https://www.nspcc.org.uk/",
      },
      {
        name: "Childline",
        phone: "0800 1111",
        description: "Support for children and young people",
        website: "https://www.childline.org.uk/",
      },
    ],
  },
  {
    category: "Mental Health & Wellbeing",
    organizations: [
      {
        name: "Samaritans",
        phone: "116 123",
        description: "24/7 emotional support",
        website: "https://www.samaritans.org/",
      },
      {
        name: "Mind",
        phone: "0300 123 3393",
        description: "Mental health support and information",
        website: "https://www.mind.org.uk/",
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Resource Library
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Access comprehensive guides, safety planning tools, and legal information
              designed to help victims of domestic abuse navigate their situation safely.
            </p>

            {/* Emergency Notice */}
            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-8 max-w-2xl mx-auto">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <p className="font-semibold text-red-800">In immediate danger? Call 999</p>
                  <p className="text-sm text-red-700">
                    For urgent legal help, call our 24/7 emergency line:{" "}
                    <a href="tel:07984782713" className="font-semibold underline">
                      07984 782 713
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resource Library */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ResourceLibrary />
        </div>
      </section>

      {/* Additional Support Services */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Additional Support Services
          </h2>

          <div className="space-y-8 max-w-5xl mx-auto">
            {supportOrganizations.map((category) => (
              <div key={category.category}>
                <h3 className="text-2xl font-bold mb-4">{category.category}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {category.organizations.map((org) => (
                    <div key={org.name} className="bg-white rounded-lg shadow-md p-6">
                      <h4 className="font-bold mb-2">{org.name}</h4>
                      <p className="text-gray-600 text-sm mb-3">{org.description}</p>
                      <div className="space-y-2">
                        {org.phone && (
                          <a
                            href={`tel:${org.phone.replace(/\s/g, "")}`}
                            className="flex items-center gap-2 text-blue-600 hover:underline"
                          >
                            <Phone className="h-4 w-4" />
                            {org.phone}
                          </a>
                        )}
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Visit website
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Need Personalised Legal Advice?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            While these resources provide valuable information, every situation is unique.
            Get expert legal advice tailored to your specific circumstances.
          </p>
          <div className="space-x-4">
            <Link
              href="/contact"
              className="bg-white text-blue-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-block"
            >
              Book Free Consultation
            </Link>
            <a
              href="tel:07984782713"
              className="border-2 border-white text-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-block"
            >
              Call Emergency Line
            </a>
          </div>
        </div>
      </section>
    </>
  );
}