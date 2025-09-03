import { Metadata } from "next";
import Link from "next/link";
import { Award, Users, Heart, Shield, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - CVG Family Law",
  description: "Meet Cora and Bridget, the founders of CVG Family Law. Learn about our approach to family law and our commitment to helping families through difficult times.",
};

const teamMembers = [
  {
    name: "Cora",
    role: "Senior Partner & Family Law Specialist",
    image: "/team/cora.jpg",
    bio: "With over 15 years of experience in family law, Cora brings deep expertise and compassion to every case. She specializes in complex financial matters and high-net-worth divorces, while maintaining a strong commitment to domestic abuse advocacy.",
    qualifications: [
      "Resolution Accredited Specialist - Domestic Abuse",
      "Collaborative Law Practitioner",
      "Children Law Accreditation",
      "Member of the Law Society Family Law Panel",
    ],
  },
  {
    name: "Bridget",
    role: "Partner & Children Law Expert",
    image: "/team/bridget.jpg",
    bio: "Bridget has dedicated her career to protecting children's welfare in family proceedings. With particular expertise in domestic abuse cases, she works tirelessly to ensure the safety and best interests of children are paramount in all decisions.",
    qualifications: [
      "Children Law Specialist",
      "Domestic Abuse Advocate",
      "Mediation Accredited",
      "Member of Resolution",
    ],
  },
];

const values = [
  {
    icon: Heart,
    title: "Compassion First",
    description: "We understand the emotional challenges of family breakdown and provide supportive, empathetic guidance through every step.",
  },
  {
    icon: Shield,
    title: "Protection & Safety",
    description: "Specializing in domestic abuse cases, we prioritize your safety and work swiftly to secure necessary protections.",
  },
  {
    icon: Users,
    title: "Child-Focused",
    description: "Children's welfare is paramount in everything we do. We ensure their voices are heard and their needs are met.",
  },
  {
    icon: Award,
    title: "Expert Excellence",
    description: "With specialist accreditations and years of experience, we provide expert legal advice you can trust.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Your Legal Team
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              At CVG Family Law, we&apos;re not just solicitors – we&apos;re your 
              advocates, supporters, and guides through life&apos;s most challenging moments.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="mb-4">
                CVG Family Law was founded by Cora and Bridget with a simple yet powerful vision: 
                to provide exceptional family law services that combine legal expertise with genuine 
                compassion and understanding.
              </p>
              <p className="mb-4">
                Based in the heart of Tunbridge Wells, Kent, we&apos;ve built our practice on the 
                belief that every family deserves access to high-quality legal support during their 
                most difficult times. Our passion for domestic abuse advocacy and children&apos;s 
                welfare drives everything we do.
              </p>
              <p>
                We understand that family law matters are deeply personal. That&apos;s why we take 
                a forward-thinking, contemporary approach that puts your needs first, offering 
                practical solutions and emotional support alongside expert legal guidance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Members */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Founding Partners</h2>
          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {teamMembers.map((member) => (
              <div key={member.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
                  <p className="text-primary-600 font-semibold mb-4">{member.role}</p>
                  <p className="text-gray-600 mb-6">{member.bio}</p>
                  <div>
                    <h4 className="font-semibold mb-3">Qualifications & Accreditations:</h4>
                    <ul className="space-y-2">
                      {member.qualifications.map((qual) => (
                        <li key={qual} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                          <span className="text-sm text-gray-600">{qual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="section-padding">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Approach</h2>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary-600">1.</span> Personal & Caring
                  </h3>
                  <p className="text-gray-600 ml-6">
                    We take the time to understand your unique situation and provide tailored 
                    advice that addresses your specific needs and concerns.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary-600">2.</span> Clear Communication
                  </h3>
                  <p className="text-gray-600 ml-6">
                    We explain complex legal matters in plain English, ensuring you understand 
                    your options and can make informed decisions.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary-600">3.</span> Solution-Focused
                  </h3>
                  <p className="text-gray-600 ml-6">
                    We work towards practical, achievable solutions that minimize conflict and 
                    promote the best outcomes for all involved, especially children.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <span className="text-primary-600">4.</span> Day-by-Day Support
                  </h3>
                  <p className="text-gray-600 ml-6">
                    We guide you through each step of the process, providing consistent support 
                    and regular updates on your case progress.
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
            Let&apos;s Work Together
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Take the first step towards resolving your family law matters with 
            compassionate, expert support.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            Book Your Free Consultation
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}