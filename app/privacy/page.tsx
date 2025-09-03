import { Metadata } from "next";
import Link from "next/link";
import { Shield, Lock, Eye, Users, FileText, AlertCircle } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy & Complaints - CVG Family Law",
  description: "Privacy policy, data protection, and complaints procedure for CVG Family Law Ltd",
};

export default function PrivacyPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-warmgray-900">
              Privacy Policy & Complaints
            </h1>
            <p className="text-xl text-warmgray-600">
              Your privacy matters. Learn how we protect your information and how to raise concerns.
            </p>
          </div>
        </div>
      </section>

      {/* Privacy Policy */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-8 w-8 text-primary-600" />
                <h2 className="text-3xl font-bold text-warmgray-900">Privacy Policy</h2>
              </div>

              <div className="space-y-6 text-warmgray-700">
                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary-500" />
                    Data Controller
                  </h3>
                  <p>
                    CVG Family Law Ltd is the data controller for personal information collected through 
                    our services. We are registered with the Information Commissioner&apos;s Office and comply 
                    with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary-500" />
                    Information We Collect
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-6">
                    <li>Personal details (name, address, contact information)</li>
                    <li>Case-related information necessary for legal representation</li>
                    <li>Financial information for billing purposes</li>
                    <li>Communication records between you and our firm</li>
                    <li>Information from third parties relevant to your case</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary-500" />
                    How We Use Your Information
                  </h3>
                  <ul className="list-disc list-inside space-y-1 ml-6">
                    <li>To provide legal services and advice</li>
                    <li>To comply with legal and regulatory obligations</li>
                    <li>To manage our client relationships</li>
                    <li>To process payments and maintain accounts</li>
                    <li>To improve our services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary-500" />
                    Legal Basis for Processing
                  </h3>
                  <p>We process your data based on:</p>
                  <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                    <li>Your consent</li>
                    <li>Performance of our contract with you</li>
                    <li>Compliance with legal obligations</li>
                    <li>Our legitimate interests in running our practice</li>
                  </ul>
                </div>

                <div className="bg-warmgray-50 p-4 rounded-lg">
                  <p className="text-sm">
                    <strong>Data Retention:</strong> We retain your information for 7 years after your case 
                    concludes, in line with SRA requirements. Some information may be retained longer if 
                    required by law.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">Your Rights</h3>
                  <p className="mb-2">You have the right to:</p>
                  <ul className="list-disc list-inside space-y-1 ml-6">
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Request deletion (subject to legal requirements)</li>
                    <li>Object to processing</li>
                    <li>Data portability</li>
                    <li>Withdraw consent</li>
                  </ul>
                </div>

                <div className="border-t pt-6">
                  <p className="font-medium">To exercise your rights or for questions about our privacy practices:</p>
                  <p className="mt-2">
                    Email: <a href={`mailto:${siteConfig.email}`} className="text-primary-600 hover:underline">{siteConfig.email}</a><br />
                    Phone: <a href={`tel:${siteConfig.phone.replace(/\s/g, "")}`} className="text-primary-600 hover:underline">{siteConfig.phone}</a>
                  </p>
                </div>
              </div>
            </div>

            {/* Complaints Procedure */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertCircle className="h-8 w-8 text-secondary-600" />
                <h2 className="text-3xl font-bold text-warmgray-900">Complaints Procedure</h2>
              </div>

              <div className="space-y-6 text-warmgray-700">
                <p className="text-lg">
                  We are committed to providing excellent service. If you&apos;re not satisfied, 
                  we want to hear from you so we can put things right.
                </p>

                <div>
                  <h3 className="font-bold text-lg mb-3">How to Make a Complaint</h3>
                  
                  <div className="space-y-4">
                    <div className="bg-primary-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Step 1: Contact Us</h4>
                      <p className="text-sm mb-2">
                        Please raise your concerns with your case handler first. Most issues can be 
                        resolved quickly at this stage.
                      </p>
                      <p className="text-sm">
                        If you&apos;re not comfortable doing this, contact our complaints partner directly.
                      </p>
                    </div>

                    <div className="bg-primary-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Step 2: Formal Complaint</h4>
                      <p className="text-sm mb-2">
                        If the issue isn&apos;t resolved, please submit a formal complaint in writing to:
                      </p>
                      <address className="text-sm not-italic ml-4">
                        Complaints Partner<br />
                        CVG Family Law Ltd<br />
                        {siteConfig.address.street}<br />
                        {siteConfig.address.city}<br />
                        {siteConfig.address.county} {siteConfig.address.postcode}<br />
                        Email: {siteConfig.email}
                      </address>
                    </div>

                    <div className="bg-primary-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Step 3: Our Response</h4>
                      <p className="text-sm">
                        We will acknowledge your complaint within 7 days and provide a full response 
                        within 28 days. If we need more time, we&apos;ll explain why and keep you updated.
                      </p>
                    </div>

                    <div className="bg-secondary-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Step 4: Legal Ombudsman</h4>
                      <p className="text-sm mb-2">
                        If we cannot resolve your complaint within 8 weeks, or you&apos;re unhappy with 
                        our response, you can contact the Legal Ombudsman:
                      </p>
                      <address className="text-sm not-italic ml-4">
                        <strong>Legal Ombudsman</strong><br />
                        PO Box 6167<br />
                        Slough SL1 0EH<br />
                        Phone: 0300 555 0333<br />
                        Email: enquiries@legalombudsman.org.uk<br />
                        Website: www.legalombudsman.org.uk
                      </address>
                      <p className="text-xs mt-2 text-warmgray-600">
                        Note: You must contact the Legal Ombudsman within 6 months of our final response.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-bold text-lg mb-3">Our Commitment</h3>
                  <p>
                    We take all complaints seriously and use them to improve our services. 
                    Your complaint will be handled confidentially and will not affect the service 
                    you receive from us.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-600 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">Have Questions?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            We&apos;re here to help. Contact us for any privacy or service concerns.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-block"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}