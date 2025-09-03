"use client";

import { Metadata } from "next";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Phone, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/constants";

const faqCategories = [
  {
    title: "Divorce & Separation",
    questions: [
      {
        q: "How long does a divorce take in the UK?",
        a: "Under the new no-fault divorce law (since April 2022), the minimum time is 26 weeks (6 months) from application to final order. This includes a 20-week reflection period and a 6-week minimum wait between conditional and final orders."
      },
      {
        q: "Do I need to prove fault to get divorced?",
        a: "No. Since April 2022, you only need to state that the marriage has irretrievably broken down. There's no need to prove fault or blame your spouse."
      },
      {
        q: "What's the difference between a sole and joint divorce application?",
        a: "A sole application is made by one spouse, while a joint application is made together. Joint applications are often more amicable and can reduce costs, but both achieve the same outcome."
      },
      {
        q: "Can my spouse stop the divorce?",
        a: "Under the new law, your spouse cannot contest the divorce itself. They can only dispute the divorce in very limited circumstances, such as jurisdiction issues or if the marriage isn't legally valid."
      },
      {
        q: "What is a separation agreement?",
        a: "A separation agreement is a legal document that sets out how you'll divide assets, arrange child custody, and handle financial matters while separated but not divorced. It's not legally binding but courts usually uphold them if properly drafted."
      }
    ]
  },
  {
    title: "Financial Matters",
    questions: [
      {
        q: "How are assets divided in a divorce?",
        a: "The court considers factors including each party's needs, contributions, earning capacity, standard of living during marriage, and children's welfare. The starting point is often 50/50, but this varies based on circumstances."
      },
      {
        q: "Will I have to pay spousal maintenance?",
        a: "Spousal maintenance depends on factors like income disparity, length of marriage, and each party's needs. It's not automatic and is increasingly limited in duration to promote financial independence."
      },
      {
        q: "What happens to our pensions?",
        a: "Pensions are considered matrimonial assets. Options include pension sharing orders (splitting the pension), offsetting (trading pension for other assets), or pension attachment orders (paying a portion when drawn)."
      },
      {
        q: "Can I get financial help if I can't afford a lawyer?",
        a: "We offer flexible payment plans and free initial consultations. Legal aid is limited but may be available for domestic abuse cases. We can advise on your options during your consultation."
      },
      {
        q: "Do I need a financial order even if we agree?",
        a: "Yes, absolutely. Without a court-approved financial order, financial claims remain open indefinitely. Your ex-spouse could make claims years later, even after remarriage."
      }
    ]
  },
  {
    title: "Children & Custody",
    questions: [
      {
        q: "How is child custody determined?",
        a: "The court's paramount consideration is the child's welfare. They consider factors like the child's wishes (age-appropriate), needs, effect of changes, any risk of harm, and each parent's capability."
      },
      {
        q: "What's the difference between custody and access?",
        a: "These terms are outdated. We now use 'child arrangements orders' which determine who children live with (residence) and spend time with (contact). Both parents typically retain parental responsibility."
      },
      {
        q: "Can I stop my ex seeing our children?",
        a: "Only if there's genuine risk of harm. Courts strongly favor children maintaining relationships with both parents. Stopping contact without good reason could result in enforcement action against you."
      },
      {
        q: "At what age can children choose which parent to live with?",
        a: "There's no set age. Courts consider children's wishes based on age and maturity. Views of older children (typically 12+) carry more weight, but the child's welfare remains paramount."
      },
      {
        q: "Can I move abroad with my children?",
        a: "You need either the other parent's consent or court permission. The court considers factors like the impact on the child's relationship with the other parent and the reasons for the move."
      }
    ]
  },
  {
    title: "Domestic Abuse",
    questions: [
      {
        q: "What constitutes domestic abuse?",
        a: "Domestic abuse includes physical violence, emotional/psychological abuse, coercive control, financial abuse, sexual abuse, and online harassment. It's not just physical violence."
      },
      {
        q: "How quickly can I get a protection order?",
        a: "Non-molestation orders can be obtained within 24 hours in emergencies, sometimes without the abuser being present (ex-parte). The order typically lasts 6-12 months initially."
      },
      {
        q: "Will reporting abuse affect child custody?",
        a: "Courts take abuse allegations seriously and prioritize children's safety. Proven abuse can affect contact arrangements, potentially requiring supervised contact or no contact in severe cases."
      },
      {
        q: "I'm worried about costs - can I still get help?",
        a: "Yes. Legal aid may be available for domestic abuse cases. We also offer payment plans and will never turn away someone in danger due to financial concerns. Your safety is paramount."
      },
      {
        q: "Can I get help if the abuse isn't physical?",
        a: "Absolutely. Emotional abuse, coercive control, and financial abuse are taken just as seriously. Non-molestation orders cover all forms of abuse and harassment."
      }
    ]
  },
  {
    title: "Legal Process",
    questions: [
      {
        q: "Do I need to go to court?",
        a: "Not always. Many cases are resolved through negotiation or mediation. Court is typically a last resort when agreement cannot be reached or in urgent situations like domestic abuse."
      },
      {
        q: "What is mediation?",
        a: "Mediation is a process where a neutral third party helps you reach agreements about children, finances, and property. It's usually quicker and cheaper than court but isn't suitable for all cases, especially involving abuse."
      },
      {
        q: "How much will my divorce cost?",
        a: "Costs vary depending on complexity and whether you reach agreement. Our free consultation will provide a costs estimate. We offer transparent pricing and flexible payment plans."
      },
      {
        q: "What documents do I need?",
        a: "Basic documents include marriage certificate, financial statements, property documents, and children's details. We'll provide a full checklist during your consultation based on your specific situation."
      },
      {
        q: "Can I represent myself?",
        a: "Yes, but family law is complex. Even if representing yourself, a consultation can help you understand your rights and the process. We also offer limited scope representation for specific parts of your case."
      }
    ]
  }
];

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full py-4 px-6 text-left hover:bg-gray-50 transition-colors flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-gray-900">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Find answers to common questions about family law, divorce, and our services. 
              Can&apos;t find what you&apos;re looking for? Contact us for personalized advice.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding">
        <div className="container-main">
          <div className="max-w-5xl mx-auto">
            {/* Category Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 justify-center">
              {faqCategories.map((category, index) => (
                <button
                  key={category.title}
                  onClick={() => setActiveCategory(index)}
                  className={cn(
                    "px-4 py-2 rounded-md font-medium transition-colors",
                    activeCategory === index
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {category.title}
                </button>
              ))}
            </div>

            {/* Questions */}
            <div className="bg-white rounded-lg shadow-lg">
              {faqCategories[activeCategory].questions.map((item) => (
                <FAQItem key={item.q} question={item.q} answer={item.a} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="section-padding bg-gray-50">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Every situation is unique. Get personalized advice with our free 30-minute consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <MessageSquare className="h-5 w-5" />
                Book Free Consultation
              </Link>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="btn-outline inline-flex items-center justify-center gap-2"
              >
                <Phone className="h-5 w-5" />
                Call {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}