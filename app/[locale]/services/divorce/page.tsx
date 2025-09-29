import { Metadata } from "next";
import Link from "next/link";
import { Users, FileText, Calendar, Heart, CheckCircle, Info, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Divorce & Separation Services - CVG Family Law",
  description: "Compassionate divorce and separation services. No-fault divorce, joint applications, and financial settlements in Tunbridge Wells, Kent.",
};

export default function DivorcePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Divorce & Separation Services
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Guiding you through divorce with dignity, respect, and compassion. We help you 
              navigate this challenging time while protecting your interests and your future.
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

      {/* No-Fault Divorce */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <div className="bg-secondary-50 rounded-lg p-8 mb-12">
              <h2 className="text-3xl font-bold mb-4 text-center">
                No-Fault Divorce: A New Era
              </h2>
              <p className="text-lg text-gray-600 text-center mb-6">
                Since April 2022, divorce law in England and Wales has changed significantly. 
                You no longer need to blame your spouse or wait years to divorce.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h3 className="font-semibold mb-2">No Blame Required</h3>
                  <p className="text-sm text-gray-600">Simply state the marriage has broken down</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h3 className="font-semibold mb-2">Joint Applications</h3>
                  <p className="text-sm text-gray-600">Apply together for a more amicable process</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar className="h-6 w-6 text-secondary-600" />
                  </div>
                  <h3 className="font-semibold mb-2">6 Month Timeline</h3>
                  <p className="text-sm text-gray-600">Minimum period for reflection and planning</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divorce Process */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              The Divorce Process Explained
            </h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Application Stage</h3>
                    <p className="text-gray-600 mb-3">
                      Submit the divorce application (sole or joint). The court issues proceedings 
                      and serves papers on your spouse if sole application.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 1-2 weeks</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">20-Week Reflection Period</h3>
                    <p className="text-gray-600 mb-3">
                      A mandatory waiting period to reflect on the decision, make practical 
                      arrangements, and consider reconciliation if appropriate.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 20 weeks minimum</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Conditional Order</h3>
                    <p className="text-gray-600 mb-3">
                      Apply for the conditional order (previously decree nisi). The court confirms 
                      you&apos;re entitled to divorce but you&apos;re not divorced yet.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 2-4 weeks</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Final Order</h3>
                    <p className="text-gray-600 mb-3">
                      Apply for the final order (previously decree absolute) after 6 weeks. 
                      This legally ends your marriage.
                    </p>
                    <p className="text-sm text-gray-500">Timeline: 6 weeks minimum after conditional order</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-6 bg-primary-50 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-6 w-6 text-primary-600 mt-0.5" />
                <div>
                  <p className="font-semibold mb-2">Important Note:</p>
                  <p className="text-gray-600">
                    The minimum total time from application to final order is approximately 26 weeks 
                    (6 months), assuming no complications or delays.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Divorce */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Divorce Application Options
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Sole Application</h3>
                <p className="text-gray-600 mb-4">
                  One party applies for divorce. The other spouse is notified and has the 
                  opportunity to respond but cannot contest the divorce itself.
                </p>
                <h4 className="font-semibold mb-3">Best for:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span className="text-sm">When one party is reluctant to divorce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span className="text-sm">Limited communication between parties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span className="text-sm">Need to proceed without cooperation</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-2xl font-bold mb-4">Joint Application</h3>
                <p className="text-gray-600 mb-4">
                  Both parties apply together, demonstrating mutual agreement to divorce. 
                  Generally more amicable and can reduce costs.
                </p>
                <h4 className="font-semibold mb-3">Best for:</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span className="text-sm">Mutual agreement to divorce</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span className="text-sm">Desire for amicable proceedings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span className="text-sm">Cost-effective approach</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial & Children */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              Resolving Finances & Children Arrangements
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-bold mb-4">Financial Settlement</h3>
              <p className="text-gray-600 mb-6">
                Divorce doesn&apos;t automatically settle financial matters. We help negotiate 
                and formalize financial agreements covering:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Property and home ownership</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Pension sharing orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Savings and investments</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Spousal maintenance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Business interests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-5 w-5 text-primary-600 mt-0.5" />
                    <span>Debt responsibilities</span>
                  </li>
                </ul>
              </div>
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm">
                  <strong>Important:</strong> Always seek legal advice before finalizing your 
                  divorce to ensure financial matters are properly resolved.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Children Arrangements</h3>
              <p className="text-gray-600 mb-6">
                If you have children, you&apos;ll need to agree on:
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Living Arrangements</h4>
                    <p className="text-sm text-gray-600">Where children will live and when</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Contact Schedule</h4>
                    <p className="text-sm text-gray-600">Time spent with each parent</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Financial Support</h4>
                    <p className="text-sm text-gray-600">Child maintenance arrangements</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Important Decisions</h4>
                    <p className="text-sm text-gray-600">Education, medical care, and religion</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separation Option */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Judicial Separation: An Alternative
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-lg text-gray-600 mb-6">
                If you&apos;re not ready for divorce but need formal separation, judicial separation 
                may be appropriate. This allows you to:
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span>Live separately with court recognition</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span>Divide finances and property</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span>Make arrangements for children</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <span>Remain legally married</span>
                </li>
              </ul>
              <p className="text-gray-600">
                This option is often chosen for religious reasons or where parties need time 
                before making final decisions about divorce.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">
            Navigate Divorce with Confidence
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get compassionate, expert guidance through your divorce. We&apos;re here to protect 
            your interests and help you move forward.
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
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}