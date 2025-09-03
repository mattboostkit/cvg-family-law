import { Metadata } from "next";
import Link from "next/link";
import { Calculator, Home, PiggyBank, TrendingUp, Scale, FileText, CheckCircle, ArrowRight, Heart } from "lucide-react";
import { siteConfig } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Financial Matters - CVG Family Law",
  description: "Expert financial settlement services for divorce and separation. Property division, pensions, maintenance, and high net worth cases in Tunbridge Wells, Kent.",
};

export default function FinancialPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Financial Matters & Settlements
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Securing your financial future through fair and comprehensive settlements. 
              We protect your interests while working towards practical solutions.
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

      {/* Key Message */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary-50 rounded-lg p-8 text-center">
              <Scale className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">
                Fair Financial Settlements for All
              </h2>
              <p className="text-lg text-gray-600">
                Whether you&apos;re dealing with high net worth assets or struggling with the cost of 
                living, we ensure you receive a fair settlement that protects your future financial 
                security and that of your children.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Financial Matters */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Financial Matters We Handle
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Home className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Property & Real Estate</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Family home division</li>
                <li>• Investment properties</li>
                <li>• Overseas property</li>
                <li>• Mortgages and equity</li>
                <li>• Transfer of ownership</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <PiggyBank className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Pensions & Retirement</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Pension sharing orders</li>
                <li>• Pension offsetting</li>
                <li>• State pensions</li>
                <li>• Private pensions</li>
                <li>• Retirement planning</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <TrendingUp className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Investments & Savings</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Bank accounts</li>
                <li>• Investment portfolios</li>
                <li>• ISAs and bonds</li>
                <li>• Cryptocurrency</li>
                <li>• Premium bonds</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <Calculator className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Income & Maintenance</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Spousal maintenance</li>
                <li>• Child maintenance</li>
                <li>• Income assessment</li>
                <li>• Earning capacity</li>
                <li>• Benefits consideration</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <FileText className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Business Interests</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Business valuations</li>
                <li>• Company shares</li>
                <li>• Director loans</li>
                <li>• Partnerships</li>
                <li>• Self-employment income</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <Scale className="h-10 w-10 text-primary-600 mb-4" />
              <h3 className="text-xl font-bold mb-3">Debts & Liabilities</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Joint debt division</li>
                <li>• Credit cards</li>
                <li>• Loans and overdrafts</li>
                <li>• Tax liabilities</li>
                <li>• Financial obligations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* High Net Worth */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              High Net Worth Divorce Specialists
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <p className="text-lg text-gray-600 mb-6">
                Complex financial situations require specialist expertise. We have extensive 
                experience handling high net worth divorces involving:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span>Multiple properties and international assets</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span>Complex investment portfolios</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span>Business ownership and shareholdings</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span>Trust funds and inherited wealth</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span>Pre and post-nuptial agreements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span>Tax planning and efficiency</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Discretion Assured:</strong> We understand the need for privacy and 
                  handle all high net worth cases with complete confidentiality and discretion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cost of Living Support */}
      <section className="section-padding bg-secondary-50">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Support During Cost of Living Challenges
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-lg text-gray-600 mb-6">
                We understand that financial pressures can make separation seem impossible. 
                We&apos;re here to help everyone, regardless of their financial situation.
              </p>
              
              <h3 className="text-xl font-bold mb-4">How We Help:</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Affordable Payment Plans</h4>
                    <p className="text-gray-600">Flexible payment options to spread legal costs</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Benefits Advice</h4>
                    <p className="text-gray-600">Guidance on entitlements and financial support available</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Emergency Financial Relief</h4>
                    <p className="text-gray-600">Applications for urgent maintenance pending settlement</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-secondary-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Housing Support</h4>
                    <p className="text-gray-600">Advice on keeping your home or finding alternative accommodation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Financial Process */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              The Financial Settlement Process
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Financial Disclosure</h3>
                  <p className="text-gray-600">
                    Both parties provide full disclosure of assets, income, and liabilities 
                    through Form E or voluntary disclosure.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Negotiation</h3>
                  <p className="text-gray-600">
                    We negotiate on your behalf to reach a fair settlement, considering needs, 
                    contributions, and future earning capacity.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Agreement or Court</h3>
                  <p className="text-gray-600">
                    If agreement is reached, we draft a consent order. If not, we represent 
                    you at Financial Dispute Resolution and final hearings.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Implementation</h3>
                  <p className="text-gray-600">
                    Once approved by the court, we help implement the order, including property 
                    transfers, pension sharing, and ongoing maintenance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factors Considered */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              Factors Courts Consider
            </h2>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <p className="text-gray-600 mb-6">
                Courts apply Section 25 factors when deciding financial settlements:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Income, earning capacity, property, and financial resources</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Financial needs, obligations, and responsibilities</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Standard of living during the marriage</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Ages and duration of marriage</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Physical or mental disabilities</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Contributions to the family</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Conduct (in exceptional cases)</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-primary-600 font-bold">•</span>
                  <span>Loss of benefits (like pensions)</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm font-semibold">
                  First consideration is always given to the welfare of children under 18.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">
            Secure Your Financial Future
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Get expert advice on achieving a fair financial settlement. We&apos;ll protect your 
            interests and help you move forward with confidence.
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