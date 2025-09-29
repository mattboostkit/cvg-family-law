import { Metadata } from "next";
import Link from "next/link";
import { Heart, Shield, Users, Scale, BookOpen, CheckCircle, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Children Law Services - CVG Family Law",
  description: "Expert children law services including custody arrangements, child protection, and welfare proceedings. Putting children first in Tunbridge Wells, Kent.",
};

export default function ChildrenLawPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Children Law Services
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Protecting children&apos;s welfare and ensuring their voices are heard. We provide 
              expert legal representation in all matters concerning children.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Book Free Consultation
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                Call {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principle */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="h-16 w-16 text-secondary-600 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">
              Children&apos;s Welfare is Paramount
            </h2>
            <p className="text-lg text-gray-600">
              In all children proceedings, the court&apos;s primary consideration is the welfare 
              of the child. We ensure that children&apos;s best interests are at the heart of 
              every decision, working to create arrangements that provide stability, security, 
              and happiness for your children.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Our Children Law Services
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Users className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Child Arrangement Orders</h3>
              <p className="text-gray-600 mb-4">
                Determining where children live and how much time they spend with each parent. 
                We help create arrangements that work for everyone.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Living arrangements (residence)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Contact schedules</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Holiday and special occasion arrangements</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <Scale className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Parental Responsibility</h3>
              <p className="text-gray-600 mb-4">
                Helping unmarried fathers and step-parents obtain legal rights to make important 
                decisions about children&apos;s upbringing.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Parental responsibility agreements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Court applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Step-parent adoption</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <Shield className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Child Protection</h3>
              <p className="text-gray-600 mb-4">
                Urgent action to protect children from harm, including applications for protective 
                orders and working with social services.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Prohibited steps orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Specific issue orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Emergency protection</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <BookOpen className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Special Guardianship</h3>
              <p className="text-gray-600 mb-4">
                Supporting family members who wish to care for children when parents cannot, 
                including grandparents and other relatives.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Special guardianship orders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Kinship care arrangements</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Financial support applications</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Welfare Checklist */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              The Welfare Checklist
            </h2>
            <p className="text-lg text-gray-600 mb-8 text-center">
              Courts consider these factors when making decisions about children:
            </p>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-primary-600">1</span>
                  <div>
                    <h4 className="font-semibold mb-1">The child&apos;s wishes and feelings</h4>
                    <p className="text-gray-600">Considered according to age and understanding</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-primary-600">2</span>
                  <div>
                    <h4 className="font-semibold mb-1">Physical, emotional and educational needs</h4>
                    <p className="text-gray-600">Ensuring all aspects of the child&apos;s development are met</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-primary-600">3</span>
                  <div>
                    <h4 className="font-semibold mb-1">Effect of any change in circumstances</h4>
                    <p className="text-gray-600">Minimizing disruption to the child&apos;s life</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-primary-600">4</span>
                  <div>
                    <h4 className="font-semibold mb-1">Age, sex, and background</h4>
                    <p className="text-gray-600">Considering the child&apos;s individual characteristics</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-primary-600">5</span>
                  <div>
                    <h4 className="font-semibold mb-1">Risk of harm</h4>
                    <p className="text-gray-600">Protecting children from any form of abuse or neglect</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-primary-600">6</span>
                  <div>
                    <h4 className="font-semibold mb-1">Capability of parents and carers</h4>
                    <p className="text-gray-600">Assessing ability to meet the child&apos;s needs</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="text-2xl font-bold text-primary-600">7</span>
                  <div>
                    <h4 className="font-semibold mb-1">Range of court powers</h4>
                    <p className="text-gray-600">Considering all available options for the child&apos;s benefit</p>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="section-padding bg-secondary-50">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Our Child-Centered Approach
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Mediation First</h3>
                <p className="text-gray-600">
                  We encourage collaborative solutions through mediation, helping parents reach 
                  agreements that work for their children without the stress of court proceedings.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Voice of the Child</h3>
                <p className="text-gray-600">
                  We ensure children&apos;s wishes and feelings are heard and considered, working 
                  with child specialists when appropriate.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Swift Resolution</h3>
                <p className="text-gray-600">
                  We work efficiently to resolve matters quickly, minimizing uncertainty and 
                  disruption for children.
                </p>
              </div>
              
              <div className="bg-white rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Ongoing Support</h3>
                <p className="text-gray-600">
                  We provide continued guidance as arrangements evolve, helping families adapt 
                  to changing circumstances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domestic Abuse & Children */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Protecting Children from Domestic Abuse
            </h2>
            
            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-lg mb-8">
              <p className="text-gray-700">
                <strong>Children exposed to domestic abuse need special protection.</strong> We have 
                extensive experience in cases involving domestic violence and understand the complex 
                dynamics involved. We work to ensure safe contact arrangements and protect children 
                from further harm.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-8">
              <h3 className="text-xl font-bold mb-4">We can help with:</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Supervised contact arrangements</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Fact-finding hearings about abuse allegations</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Safety planning for handovers</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Working with Cafcass and social services</span>
                </li>
                <li className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-primary-600 mt-0.5" />
                  <span>Applications to prevent removal from the country</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-secondary-600 to-secondary-700 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">
            Put Your Children First
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Expert legal guidance to protect your children&apos;s welfare and secure their future. 
            Book a free consultation to discuss your situation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-secondary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center gap-2"
            >
              Book Free Consultation
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="bg-transparent text-white border-2 border-white px-8 py-4 rounded-md font-semibold hover:bg-white hover:text-secondary-600 transition-colors inline-flex items-center justify-center gap-2"
            >
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}