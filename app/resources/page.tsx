import { Metadata } from "next";
import Link from "next/link";
import { FileText, Download, ExternalLink, BookOpen, Phone, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Resources - CVG Family Law",
  description: "Helpful resources, guides, and support services for family law matters in Tunbridge Wells, Kent.",
};

const guides = [
  {
    title: "Understanding No-Fault Divorce",
    description: "Complete guide to the new divorce process introduced in 2022",
    icon: FileText,
    downloadUrl: "#",
  },
  {
    title: "Child Arrangements Checklist",
    description: "What to consider when making arrangements for children",
    icon: FileText,
    downloadUrl: "#",
  },
  {
    title: "Financial Disclosure Guide",
    description: "How to complete Form E and gather financial information",
    icon: FileText,
    downloadUrl: "#",
  },
  {
    title: "Domestic Abuse Safety Plan",
    description: "Creating a safety plan for you and your children",
    icon: FileText,
    downloadUrl: "#",
  },
  {
    title: "Mediation Preparation",
    description: "How to prepare for family mediation sessions",
    icon: FileText,
    downloadUrl: "#",
  },
  {
    title: "Court Process Overview",
    description: "What to expect when going to family court",
    icon: FileText,
    downloadUrl: "#",
  },
];

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
      {
        name: "Gingerbread",
        phone: "0808 802 0925",
        description: "Support for single parent families",
        website: "https://www.gingerbread.org.uk/",
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
      {
        name: "Relate",
        phone: "0300 003 0396",
        description: "Relationship counselling and support",
        website: "https://www.relate.org.uk/",
      },
    ],
  },
  {
    category: "Financial Support",
    organizations: [
      {
        name: "Citizens Advice",
        phone: "0800 144 8848",
        description: "Free advice on benefits, debt, and money",
        website: "https://www.citizensadvice.org.uk/",
      },
      {
        name: "StepChange",
        phone: "0800 138 1111",
        description: "Free debt advice",
        website: "https://www.stepchange.org/",
      },
      {
        name: "Turn2us",
        phone: "0808 802 2000",
        description: "Help accessing welfare benefits and grants",
        website: "https://www.turn2us.org.uk/",
      },
    ],
  },
];

const legalTerms = [
  {
    term: "Conditional Order",
    definition: "The first decree in divorce proceedings (previously called decree nisi) confirming entitlement to divorce.",
  },
  {
    term: "Final Order",
    definition: "The final decree that legally ends the marriage (previously called decree absolute).",
  },
  {
    term: "Non-Molestation Order",
    definition: "A court order preventing someone from using or threatening violence, harassing, or intimidating you.",
  },
  {
    term: "Occupation Order",
    definition: "A court order deciding who can live in the family home.",
  },
  {
    term: "Parental Responsibility",
    definition: "Legal rights and responsibilities for a child, including decisions about education, medical treatment, and religion.",
  },
  {
    term: "Child Arrangements Order",
    definition: "Court order determining where a child lives and when they spend time with each parent.",
  },
  {
    term: "Form E",
    definition: "Financial statement form for disclosure of assets, income, and liabilities in divorce proceedings.",
  },
  {
    term: "Clean Break Order",
    definition: "Financial order preventing future financial claims between ex-spouses.",
  },
  {
    term: "Prohibited Steps Order",
    definition: "Court order preventing specific actions regarding children without court permission.",
  },
  {
    term: "Specific Issue Order",
    definition: "Court order resolving specific disputes about children's upbringing.",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Resources & Support
            </h1>
            <p className="text-xl text-gray-600">
              Helpful guides, support services, and legal information to help you 
              navigate family law matters with confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Downloadable Guides */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Free Guides & Checklists
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {guides.map((guide) => {
              const Icon = guide.icon;
              return (
                <div key={guide.title} className="bg-white rounded-lg shadow-md p-6">
                  <Icon className="h-10 w-10 text-primary-600 mb-4" />
                  <h3 className="text-lg font-bold mb-2">{guide.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{guide.description}</p>
                  <button className="text-primary-600 font-semibold inline-flex items-center gap-2 hover:text-primary-700">
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              These guides provide general information only. For advice specific to your 
              situation, please <Link href="/contact" className="text-primary-600 hover:underline">book a consultation</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Support Organizations */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Support Organizations
          </h2>
          
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded-lg mb-8 max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold">In immediate danger? Call 999</p>
                <p className="text-sm text-gray-700">
                  If you need urgent legal help, call us on {" "}
                  <a href={`tel:07984782713`} className="font-semibold underline">
                    07984 782 713
                  </a>
                </p>
              </div>
            </div>
          </div>
          
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
                        <a
                          href={`tel:${org.phone.replace(/\s/g, "")}`}
                          className="flex items-center gap-2 text-primary-600 hover:underline"
                        >
                          <Phone className="h-4 w-4" />
                          {org.phone}
                        </a>
                        <a
                          href={org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-primary-600 hover:underline"
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

      {/* Legal Glossary */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Legal Terms Explained
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-4">
                {legalTerms.map((item) => (
                  <div key={item.term} className="border-b border-gray-200 pb-4 last:border-0">
                    <h3 className="font-bold text-lg mb-1">{item.term}</h3>
                    <p className="text-gray-600">{item.definition}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-main text-center">
          <BookOpen className="h-12 w-12 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">
            Need Personalised Advice?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            While these resources are helpful, every situation is unique. Get expert advice 
            tailored to your specific circumstances.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-block"
          >
            Book Your Free Consultation
          </Link>
        </div>
      </section>
    </>
  );
}