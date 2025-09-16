import { Metadata } from "next";
import Link from "next/link";
import { Award, Users, Heart, Shield, ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us - CVG Family Law",
  description:
    "Learn how CVG Family Law supports families and survivors across Kent. Meet the founding partners, explore our values, and discover how we work.",
};

const storyHighlights = [
  {
    title: "Built for families navigating crisis",
    description:
      "CVG Family Law was created to give people experiencing domestic abuse, separation, or complex children matters a specialist team that blends technical excellence with human warmth.",
  },
  {
    title: "Kent roots, national expertise",
    description:
      "From our base in Tunbridge Wells we work with clients across Kent and the South East, drawing on years of experience in leading family practices and the higher courts.",
  },
  {
    title: "Trauma-informed support",
    description:
      "Every instruction is handled with safety planning, confidentiality, and survivor wellbeing front of mind. We coordinate closely with refuges, police, and therapists so you are never facing the process alone.",
  },
];

const teamMembers = [
  {
    name: "Cora",
    role: "Founding Partner & Domestic Abuse Specialist",
    focus:
      "Leads urgent injunctions, complex financial disputes, and strategic safety planning for survivors and children.",
    experience:
      "Former head of a regional family department with over a decade of litigation experience in the Family Court and High Court.",
    approach:
      "Calm, decisive representation that keeps clients informed and empowered at every stage.",
  },
  {
    name: "Bridget",
    role: "Founding Partner & Children Law Expert",
    focus:
      "Handles sensitive child arrangements, safeguarding applications, and cases involving coercive control.",
    experience:
      "Recognised for complex CAO proceedings and multi-agency domestic abuse work, with strong links to local support networks.",
    approach:
      "Compassionate advocacy that puts a child’s long-term stability and voice at the centre of decision-making.",
  },
];

const values = [
  {
    icon: Heart,
    title: "Compassion with clarity",
    description:
      "We listen first, translating complex legal steps into clear plans so you can make decisions with confidence.",
  },
  {
    icon: Shield,
    title: "Safety before everything",
    description:
      "Emergency protection orders, safe meeting arrangements, and discrete communication channels are built into every case plan.",
  },
  {
    icon: Users,
    title: "Child-centred outcomes",
    description:
      "We champion stable, nurturing arrangements and give children a protected voice throughout proceedings.",
  },
  {
    icon: Award,
    title: "Relentless standards",
    description:
      "Specialist accreditations, detailed preparation, and pragmatic problem-solving deliver results when it matters most.",
  },
];

const approachPillars = [
  {
    step: "1",
    title: "Listen & stabilise",
    detail:
      "Your first consultation focuses on immediate safety, urgent legal steps, and the practical support network around you.",
  },
  {
    step: "2",
    title: "Shape the strategy",
    detail:
      "We build a tailored roadmap covering protective injunctions, children issues, and financial planning with timelines you can rely on.",
  },
  {
    step: "3",
    title: "Advocate & adjust",
    detail:
      "Regular updates, proactive communication with professionals, and robust representation in negotiations or court.",
  },
  {
    step: "4",
    title: "Support beyond the order",
    detail:
      "Post-order check-ins, links to community resources, and clear next steps so you feel secure long after proceedings end.",
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
              The trusted legal partner for families across Kent
            </h1>
            <p className="text-xl text-gray-600">
              We are a modern, trauma-informed family law firm led by partners who have spent their careers protecting survivors, children, and financial security when relationships break down.
            </p>
          </div>
        </div>
      </section>

      <section id="story" className="section-padding">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our story</h2>
              <p className="text-gray-600 mb-4">
                CVG Family Law was founded to remove the disconnect between superb legal advice and the compassionate, practical support that families in crisis deserve. Having seen firsthand how domestic abuse survivors and parents can feel lost in the system, we designed a firm that acts quickly, communicates transparently, and walks every step with you.
              </p>
              <p className="text-gray-600">
                The name CVG reflects our founding partners and the values we share: care, vigilance, and grit. Today we continue to build a team and partner network who share that commitment to clarity, protection, and lasting change.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-primary-100">
              <ul className="space-y-5">
                {storyHighlights.map((item) => (
                  <li key={item.title}>
                    <h3 className="text-lg font-semibold text-warmgray-900 mb-1">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="team" className="section-padding bg-gray-50">
        <div className="container-main">
          <h2 className="text-3xl font-bold mb-2 text-center">Meet the founding partners</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-10">
            Two senior solicitors with complementary specialisms lead the practice. Together they combine urgent protective work, sophisticated financial settlements, and child-focused advocacy.
          </p>
          <div className="grid lg:grid-cols-2 gap-8">
            {teamMembers.map((member) => (
              <article key={member.name} className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-14 w-14 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{member.name}</h3>
                    <p className="text-primary-600 font-semibold">{member.role}</p>
                  </div>
                </div>
                <ul className="space-y-4 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span>{member.focus}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span>{member.experience}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-secondary-600 mt-0.5" />
                    <span>{member.approach}</span>
                  </li>
                </ul>
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
            Whether you need an emergency order or long-term planning, we follow a clear, transparent process so you always understand the next step.
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
