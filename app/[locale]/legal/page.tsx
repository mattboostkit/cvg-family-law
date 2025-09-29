import { Metadata } from "next";
import Link from "next/link";
import { Scale, Shield, FileCheck, Building, Award, BookOpen } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Legal & Regulatory Information - CVG Family Law",
  description: "Regulatory information, professional standards, and legal notices for CVG Family Law Ltd",
};

export default function LegalPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-warmgray-900">
              Legal & Regulatory Information
            </h1>
            <p className="text-xl text-warmgray-600">
              Transparency about our regulation, professional standards, and legal compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Regulatory Information */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            {/* SRA Regulation */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="h-8 w-8 text-primary-600" />
                <h2 className="text-3xl font-bold text-warmgray-900">Our Regulation</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-primary-50 p-6 rounded-lg">
                  <Shield className="h-10 w-10 text-primary-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">SRA Authorised</h3>
                  <p className="text-warmgray-600 mb-3">
                    CVG Family Law Ltd is authorised and regulated by the Solicitors Regulation Authority
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>SRA Number:</strong> {siteConfig.sra}</p>
                    <p>
                      <a 
                        href="https://www.sra.org.uk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        www.sra.org.uk
                      </a>
                    </p>
                  </div>
                </div>

                <div className="bg-secondary-50 p-6 rounded-lg">
                  <Building className="h-10 w-10 text-secondary-600 mb-3" />
                  <h3 className="font-bold text-lg mb-2">Company Registration</h3>
                  <p className="text-warmgray-600 mb-3">
                    Registered in England and Wales as a limited company
                  </p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Company No:</strong> {siteConfig.companyNo}</p>
                    <p><strong>Registered Office:</strong></p>
                    <address className="not-italic">
                      {siteConfig.address.street}<br />
                      {siteConfig.address.city}<br />
                      {siteConfig.address.county} {siteConfig.address.postcode}
                    </address>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-bold text-lg mb-3">Professional Standards</h3>
                <p className="text-warmgray-600 mb-4">
                  We adhere to the SRA Standards and Regulations, including:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>SRA Principles and Code of Conduct for Solicitors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>SRA Code of Conduct for Firms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>SRA Transparency Rules</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>SRA Accounts Rules</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Professional Indemnity */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-secondary-600" />
                <h2 className="text-3xl font-bold text-warmgray-900">Professional Indemnity Insurance</h2>
              </div>

              <p className="text-warmgray-600 mb-4">
                We maintain professional indemnity insurance in accordance with the SRA Indemnity Insurance Rules. 
                This provides protection for our clients in the unlikely event of a claim.
              </p>

              <div className="bg-warmgray-50 p-4 rounded-lg">
                <p className="text-sm text-warmgray-600">
                  <strong>Coverage:</strong> Our insurance meets the minimum coverage requirements set by the SRA, 
                  ensuring client protection up to £3 million per claim.
                </p>
              </div>

              <p className="text-sm text-warmgray-600 mt-4">
                Details of our insurers can be provided upon request.
              </p>
            </div>

            {/* Client Money */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-8 w-8 text-primary-600" />
                <h2 className="text-3xl font-bold text-warmgray-900">Client Money & Accounts</h2>
              </div>

              <div className="space-y-4 text-warmgray-700">
                <p>
                  We handle client money in strict accordance with the SRA Accounts Rules:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Client money is held separately from office money</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Regular reconciliations are performed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Annual accountant&apos;s reports are obtained as required</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Interest is paid on client money where applicable</span>
                  </li>
                </ul>

                <div className="bg-primary-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Note:</strong> We do not hold large sums of client money for extended periods. 
                    For property transactions or large settlements, we may use third-party managed accounts.
                  </p>
                </div>
              </div>
            </div>

            {/* Terms of Business */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="h-8 w-8 text-secondary-600" />
                <h2 className="text-3xl font-bold text-warmgray-900">Terms of Business</h2>
              </div>

              <div className="space-y-4 text-warmgray-700">
                <p>
                  Our standard terms of business are provided to all clients at the start of their matter. 
                  These cover:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600">•</span>
                      <span>Our duties to you</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600">•</span>
                      <span>Your responsibilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600">•</span>
                      <span>Fees and payment terms</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600">•</span>
                      <span>Confidentiality</span>
                    </li>
                  </ul>
                  
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600">•</span>
                      <span>Data protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600">•</span>
                      <span>Complaints procedure</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600">•</span>
                      <span>Limitation of liability</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary-600">•</span>
                      <span>Termination arrangements</span>
                    </li>
                  </ul>
                </div>

                <p className="text-sm text-warmgray-600 mt-4">
                  A copy of our standard terms is available upon request.
                </p>
              </div>
            </div>

            {/* Equality & Diversity */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Award className="h-8 w-8 text-primary-600" />
                <h2 className="text-3xl font-bold text-warmgray-900">Equality & Diversity</h2>
              </div>

              <div className="space-y-4 text-warmgray-700">
                <p>
                  CVG Family Law Ltd is committed to promoting equality and diversity in all of our dealings with 
                  clients, third parties, and employees.
                </p>
                
                <p>
                  We are committed to:
                </p>
                
                <ul className="space-y-2">
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Providing services without discrimination</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Making reasonable adjustments for clients with disabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Treating all individuals with dignity and respect</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <FileCheck className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Complying with the Equality Act 2010</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">Need More Information?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            If you have questions about our regulatory status or professional standards, we&apos;re here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
            >
              Call {siteConfig.phone}
            </a>
            <Link
              href="/contact"
              className="bg-primary-700 text-white px-8 py-4 rounded-md font-semibold hover:bg-primary-800 transition-colors inline-flex items-center justify-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}