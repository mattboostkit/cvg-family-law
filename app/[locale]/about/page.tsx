import { Metadata } from "next";
import Link from "next/link";
import { Award, Users, Heart, Shield, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - CVG Family Law",
  description:
    "Learn how CVG Family Law supports families and survivors across Kent. Meet the founding partners, explore our values, and discover how we work.",
};

const storyCopy = [
  "CVG Family Law was founded by Cora Valentine-Goddard after more than two decades of specialist family law work in London and the South East. Having started her career in legal aid domestic abuse matters and later qualifying at Charles Russell Speechlys, Cora set up CVG to deliver outstanding advice with the empathy and accessibility that families in crisis deserve.",
  "The firm has grown from a freelance practice in 2020 into a dedicated team that combines urgent protective work, thoughtful children advice, and pragmatic financial solutions. Every instruction is handled with safety planning, clear communication, and a commitment to helping clients move toward a better tomorrow.",
];

const teamMembers = [
  {
    name: "Cora Valentine-Goddard",
    role: "Founder and Head of Family Law",
    bio: [
      "My career in family law started when I worked as a paralegal for a small firm doing predominately legal aid domestic abuse work more than 20 years ago. After qualifying as a family solicitor at top tier firm Charles Russell Speechlys in 2010, I practiced as an associate before taking time out to raise my children and complete mediation training. I later ran a niche family practice outside London and provided pro-bono advice through a domestic abuse and stalking charity. In 2020 I launched my own freelance practice so that clients who needed excellent advice but could not afford high private fees still had somewhere to turn. Realising demand was growing, I founded CVG Family Law in 2024 so we could help even more people with affordable, specialist support.",
      "I have two children of my own and three bonus children, so I understand how busy and challenging family life can be. Having lived through divorce and lengthy Children Act proceedings, I appreciate how overwhelming the process is but also know first-hand that a better tomorrow is possible. When I am not working you will find me with my family, travelling, reading, enjoying good food and music, and generally making the most of life.",
    ],
  },
  {
    name: "Holly Chandler",
    role: "Associate Solicitor",
    bio: [
      "I qualified as a family solicitor in 2016 and, after practising at two well-established firms in Eastbourne, joined CVG Family Law in March 2025. A training seat in corporate law gave me the chance to shadow counsel in the Family Court and that is when I knew this was the career for me. Since then I have acted for a wide range of private clients, with a particular focus on children arrangements and supporting survivors of domestic abuse through protective injunctions and every other issue that flows from separation. My work also covers matrimonial finance, unmarried couple disputes, and pre or post nuptial agreements, and I have developed a niche specialism in helping resolve pet ownership disputes.",
      "Outside the office I am a dancer and perform locally as well as further afield. I also teach dance classes, love living by the sea, and spend my free time with my partner and our husky, whether that is taking long walks, seeing live bands, or enjoying great food.",
    ],
  },
  {
    name: "Bridget Colver",
    role: "Business Manager and PA to Cora",
    bio: [
      "After 16 years working in media in London and a few years as a full-time parent, I joined Cora in December 2021 when the client base had grown and she needed administrative support to take the firm forward. While my background is not legal, I love organisation and detail, and wanted to return to work once both of my children were at school.",
      "My role keeps the day-to-day business running smoothly, from liaising with barristers and managing Cora's diary to issuing invoices each month. I support Cora and also help clients navigate what can be a daunting process at a difficult time.",
    ],
  },
];

const values = [
  {
    icon: Heart,
    title: "Compassion with clarity",
    description:
      "We listen first and turn complicated legal steps into actionable plans so you can make confident decisions.",
  },
  {
    icon: Shield,
    title: "Safety before everything",
    description:
      "Protective orders, safe communication channels, and discreet meetings are built into every case plan.",
  },
  {
    icon: Users,
    title: "Child-centred outcomes",
    description:
      "We champion secure, nurturing arrangements and make sure children's voices are heard throughout.",
  },
  {
    icon: Award,
    title: "Relentless standards",
    description:
      "Specialist accreditations, thorough preparation, and pragmatic problem-solving deliver the best possible results.",
  },
];

const approachPillars = [
  {
    step: "1",
    title: "Listen and stabilise",
    detail:
      "Your first consultation focuses on immediate safety, urgent legal steps, and the practical network around you.",
  },
  {
    step: "2",
    title: "Shape the strategy",
    detail:
      "We build a tailored roadmap covering protective injunctions, children issues, and financial planning with reliable timelines.",
  },
  {
    step: "3",
    title: "Advocate and adjust",
    detail:
      "You receive regular updates, proactive contact with professionals, and robust representation in negotiations or court.",
  },
  {
    step: "4",
    title: "Support beyond the order",
    detail:
      "Post-order check-ins, community connections, and clear next steps help you feel secure long after proceedings end.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white py-16">
        <div className="container-main">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm uppercase tracking-wide text-primary-600 font-semibold mb-3">
              About CVG Family Law
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Trusted family law specialists for Kent and the South East
            </h1>
            <p className="text-xl text-gray-600">
              We combine top-tier legal expertise with trauma-informed support so every client feels heard, protected, and guided toward a safer future.
            </p>
          </div>
        </div>
      </section>

      <section id="story" className="section-padding">
        <div className="container-main">
          <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold">Our story</h2>
            {storyCopy.map((paragraph) => (
              <p key={paragraph} className="text-gray-600 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="team" className="section-padding bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-10 text-center">Meet the team</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <article key={member.name} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 flex flex-col">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="text-primary-600 font-semibold">{member.role}</p>
                  </div>
                </div>
                <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                  {member.bio.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="values" className="section-padding">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-10 text-center">Guiding values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div key={value.title} className="text-center bg-white rounded-2xl shadow-md p-6">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="approach" className="section-padding bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-6 text-center">How we work with you</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
            Whether you need emergency protection or long-term planning, we follow a transparent process so you always know the next step.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {approachPillars.map((pillar) => (
              <div key={pillar.step} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold">
                    {pillar.step}
                  </span>
                  <h3 className="text-lg font-semibold">{pillar.title}</h3>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary-600 text-white section-padding">
        <div className="container-main text-center">
          <h2 className="text-3xl font-bold mb-4">Let&apos;s take the next step together</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Book a free 30-minute consultation and speak directly with a partner about the safest, most effective route forward.
          </p>
          <Link
            href="/contact"
            className="bg-white text-primary-600 px-8 py-4 rounded-md font-semibold hover:bg-gray-50 transition-colors inline-flex items-center gap-2"
          >
            Book your consultation
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
