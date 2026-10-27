import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { Requirement } from '@modules/requirements/src/domain/requirement/requirement';
import { Domain } from '@modules/requirements/src/domain/requirement/domain/domain';
import { Institution } from '@modules/requirements/src/domain/requirement/institution/institution';
import { ImpactUsers } from '@modules/requirements/src/domain/requirement/impact-users/impact-users';
import { RequirementState } from '@modules/requirements/src/domain/requirement/enums/requirement-state.enum';

const REQUIREMENT_TEMPLATES = [
  {
    name: 'Implement automated student grade notification system',
    desc: 'Allows students to receive real-time notifications via email and SMS whenever faculty publish exam scores.',
  },
  {
    name: 'Integration with international payment gateway for tuition',
    desc: 'Enables students worldwide to pay tuition in local currencies through Stripe and PayPal integrations.',
  },
  {
    name: 'Virtual classroom video recording and transcription service',
    desc: 'Automatically records lecture sessions and uses AI to generate synchronized text transcripts.',
  },
  {
    name: 'Automated diploma generation and digital signature',
    desc: 'Generates secure PDF degree certificates with cryptographic QR code validation.',
  },
  {
    name: 'Scholarship management and verification portal',
    desc: 'Streamlines applicant document submission and financial committee review workflows.',
  },
  {
    name: 'Campus access control system QR integration',
    desc: 'Allows registered students and visitors to scan dynamic mobile QR codes at university entrances.',
  },
  {
    name: 'Student academic history export in PDF format',
    desc: 'Generates official academic transcripts with watermarks and institution stamps.',
  },
  {
    name: 'Teacher workload distribution and scheduling module',
    desc: 'Optimizes course assignments and weekly teaching hour limits across faculty members.',
  },
  {
    name: 'Library digital repository search enhancement',
    desc: 'Implements full-text semantic search for research papers, books, and thesis archives.',
  },
  {
    name: 'Multilingual thesis evaluation management workflow',
    desc: 'Coordinates international peer reviewers and thesis jury scoring in Spanish and English.',
  },
  {
    name: 'Admissions lead tracking and CRM automated sync',
    desc: 'Connects marketing landing pages directly with university admissions counseling queues.',
  },
  {
    name: 'Online exam proctoring and identity verification',
    desc: 'Enables biometric webcam facial recognition and browser lockdown during midterm examinations.',
  },
  {
    name: 'Alumni networking and job placement directory',
    desc: 'Connects university graduates with hiring partner institutions and career mentor programs.',
  },
  {
    name: 'Course syllabus version control and approval workflow',
    desc: 'Allows department heads to review, edit, and approve annual syllabus curriculum revisions.',
  },
  {
    name: 'Financial aid application evaluation portal',
    desc: 'Centralizes socioeconomic evaluation forms and grant allocation spreadsheets.',
  },
  {
    name: 'University research project grant tracking',
    desc: 'Tracks budget expenditures, milestone reports, and deliverables for European grant projects.',
  },
  {
    name: 'Mobile responsive dashboard for student portal',
    desc: 'Overhauls dashboard UI with modern responsive layout for mobile phone and tablet users.',
  },
  {
    name: 'Bulk email notifications for enrollment deadlines',
    desc: 'Scheduled cron service sending reminders before tuition and course registration cutoffs.',
  },
  {
    name: 'Automated attendance tracking via virtual session logs',
    desc: 'Extracts student connection durations from Zoom and Teams webhooks to calculate attendance.',
  },
  {
    name: 'Integration of plagiarism detection API into submission portal',
    desc: 'Scans student assignments through Turnitin API upon submission and provides similarity scores.',
  },
  {
    name: 'Student feedback and professor evaluation survey',
    desc: 'End-of-term survey system gathering anonymous student reviews with analytics dashboards.',
  },
  {
    name: 'Double degree program credit equivalence calculator',
    desc: 'Calculates transferred credits between Latin American and European partner universities.',
  },
  {
    name: 'Internship agreement and company supervisor tracking',
    desc: 'Manages legal agreements with corporate internship sponsors and student log evaluations.',
  },
  {
    name: 'Virtual graduation ceremony live stream and RSVP portal',
    desc: 'Allows graduates to confirm participation, submit ceremony slides, and invite guests.',
  },
  {
    name: 'Digital student ID card with NFC capability',
    desc: 'Provides apple wallet and google wallet pass credentials for enrolled university students.',
  },
  {
    name: 'Emergency campus announcement SMS alert system',
    desc: 'Instant mass notification channel for weather closures, security alerts, and urgent notices.',
  },
  {
    name: 'Automated billing and invoice generation for corporate clients',
    desc: 'Generates compliant tax invoices for businesses sponsoring executive master degrees.',
  },
  {
    name: 'Online course prerequisite validation engine',
    desc: 'Prevents students from registering for advanced courses without passing foundational prerequisites.',
  },
  {
    name: 'Multi-institution shared resource catalog',
    desc: 'Enables inter-library loan and shared laboratory equipment booking across the university network.',
  },
  {
    name: 'Academic committee minutes and voting portal',
    desc: 'Digitizes faculty council minutes, agenda items, and secure voting records.',
  },
  {
    name: 'Language placement test automated scoring system',
    desc: 'Evaluates online English and Spanish proficiency tests and recommends student levels.',
  },
  {
    name: 'Virtual laboratory simulation environment integration',
    desc: 'Integrates interactive cloud-based science lab simulations into biology and chemistry courses.',
  },
  {
    name: 'Student mental health and counseling appointment scheduler',
    desc: 'Confidential appointment booking system connecting students with university counselors.',
  },
  {
    name: 'Faculty publication and citation metrics tracker',
    desc: 'Aggregates Scopus and Google Scholar citations for university accreditation reports.',
  },
  {
    name: 'Classroom audiovisual equipment maintenance tracker',
    desc: 'Tickets and preventive maintenance logging for projectors, microphones, and smartboards.',
  },
  {
    name: 'Student sports and extracurricular club registration',
    desc: 'Enables students to browse university clubs, sports teams, and register online.',
  },
  {
    name: 'Automated degree audit and graduation eligibility check',
    desc: 'Scans completed credits against graduation requirements to flag missing prerequisites.',
  },
  {
    name: 'Campus parking permit and vehicle license plate recognition',
    desc: 'Automates parking barrier opening and permit renewals via automated license cameras.',
  },
  {
    name: 'Online tutoring and peer mentoring session booking',
    desc: 'Allows struggling students to book 1-on-1 peer tutoring slots with top-performing seniors.',
  },
  {
    name: 'International student visa documentation checklist',
    desc: 'Guides foreign students through embassy paperwork, health insurance, and embassy filings.',
  },
  {
    name: 'University podcast and multimedia content hosting',
    desc: 'Central repository for educational podcasts, guest speaker lectures, and interview videos.',
  },
  {
    name: 'Corporate sponsorship and donation tracking ledger',
    desc: 'Records philanthropic donations, endowment funds, and named scholarship allocations.',
  },
  {
    name: 'Exam room seat assignment and barcode attendance',
    desc: 'Randomizes student exam seat placements to prevent cheating and scans exam answer sheets.',
  },
  {
    name: 'Academic calendar and holiday schedule synchronization',
    desc: 'Syncs university academic dates, reading periods, and holidays to student Google calendars.',
  },
  {
    name: 'Online lost and found reporting portal',
    desc: 'Allows campus security and students to post and search found belongings with photo verification.',
  },
  {
    name: 'Faculty sabbatical and research leave management',
    desc: 'Manages professor leave applications, research proposals, and replacement teaching staff.',
  },
  {
    name: 'Student cafeteria meal plan and dietary balance portal',
    desc: 'Pre-paid cafeteria credit management with daily menu allergen and nutrition details.',
  },
  {
    name: 'Online bookstore inventory and digital textbook licensing',
    desc: 'Coordinates digital textbook eBook license keys and physical book delivery pickups.',
  },
  {
    name: 'Campus shuttle bus live GPS tracking system',
    desc: 'Real-time map showing inter-campus bus locations and estimated arrival times.',
  },
  {
    name: 'Student dispute resolution and ombudsman ticketing',
    desc: 'Confidential grievances and formal appeal submission portal with SLA tracking.',
  },
];

const REQUESTERS = [
  'Dr. Carlos Mendoza',
  'María Elena Gómez',
  'Ing. Roberto Silva',
  'Dra. Patricia Morales',
  'Lic. Fernando Ruiz',
  'Sofía Hernandez',
  'Alejandro Torres',
  'Lucía Fernandez',
  'Dr. Javier Ortiz',
  'Carmen Ramos',
];

export class RequirementsSeeder extends Seeder {
  async run(entityManager: EntityManager): Promise<void> {
    const existingCount = await entityManager.count(Requirement, {});
    if (existingCount >= 50) {
      return;
    }

    const domains = await entityManager.find(Domain, {});
    const institutions = await entityManager.find(Institution, {});
    const impactUsersList = await entityManager.find(ImpactUsers, {});

    if (domains.length === 0 || institutions.length === 0) {
      return;
    }

    // Map domain uuid to available impact users tiers
    const domainTierMap = new Map<string, ImpactUsers[]>();
    for (const item of impactUsersList) {
      const list = domainTierMap.get(item.domain_uuid) ?? [];
      list.push(item);
      domainTierMap.set(item.domain_uuid, list);
    }

    const benefitedInstitutionNames = institutions
      .map((i) => i.name)
      .filter((name) => name !== 'Grupo Funiber');

    const domainNames = domains.map((d) => d.name);

    // Track used codes to prevent collisions
    const usedCodes = new Set<number>();
    const existingReqs = await entityManager.find(
      Requirement,
      {},
      { fields: ['code'] },
    );
    for (const r of existingReqs) {
      usedCodes.add(r.code);
    }

    const toPersist: Requirement[] = [];
    const countToCreate = Math.max(0, 50 - existingCount);

    for (let i = 0; i < countToCreate; i++) {
      const template = REQUIREMENT_TEMPLATES[i % REQUIREMENT_TEMPLATES.length];

      // Generate unique 6-digit code
      let code = Math.floor(100000 + Math.random() * 900000);
      while (usedCodes.has(code)) {
        code = Math.floor(100000 + Math.random() * 900000);
      }
      usedCodes.add(code);

      // Select domain in charge
      const domainIndex = i % domains.length;
      const domainInCharge = domains[domainIndex];

      // Select requesting institution
      const requestingInst = institutions[i % institutions.length];

      // Random benefited institutions (1 to 4)
      const numBenefited = 1 + (i % 4);
      const startIdx = (i * 2) % benefitedInstitutionNames.length;
      const benefitedSlice: string[] = [];
      for (let b = 0; b < numBenefited; b++) {
        const name =
          benefitedInstitutionNames[
            (startIdx + b) % benefitedInstitutionNames.length
          ];
        if (!benefitedSlice.includes(name)) {
          benefitedSlice.push(name);
        }
      }

      // Random collaborator & follower domains
      const collabDomains: string[] = [];
      if (i % 2 === 0) {
        collabDomains.push(domainNames[(domainIndex + 1) % domainNames.length]);
      }
      if (i % 4 === 0) {
        collabDomains.push(domainNames[(domainIndex + 2) % domainNames.length]);
      }

      const followerDomains: string[] = [];
      if (i % 3 === 0) {
        followerDomains.push(
          domainNames[(domainIndex + 3) % domainNames.length],
        );
      }

      const obligation = i % 2 === 0;
      const existAlternative = i % 3 === 0;
      const impactNumberUsersId = ((i % 4) + 1) as 1 | 2 | 3 | 4;

      // Find exact tier from ImpactUsers table
      const domainTiers = domainTierMap.get(domainInCharge.uuid) ?? [];
      const tier = domainTiers.find(
        (t) => t.impact_number_users_level === impactNumberUsersId,
      );

      const requesterName = REQUESTERS[i % REQUESTERS.length];
      const complexity = (i % 5) + 1;
      const modality = (i % 3) + 1;
      const reqType = (i % 3) + 1;
      const status =
        i % 3 === 0 ? RequirementState.FLOW : RequirementState.REGISTERED;

      const now = Date.now();
      const startDate = new Date(now - i * 86400000 * 2);
      const endDate = new Date(now + (50 - i) * 86400000 * 3);

      const requirement = Requirement.create({
        name: `${template.name} ${existingCount + i + 1}`,
        description: template.desc,
        requesting_institution_id: requestingInst.id,
        requested_by: [requesterName],
        benefited_institutions: benefitedSlice,
        obligation,
        exist_solution_alternative: existAlternative,
        study_modality: modality,
        impact_number_users_id: tier?.id ?? impactNumberUsersId,
        impact_users_tier: tier ?? null,
        complexity_and_effort: complexity,
        domain_in_charge_id: domainInCharge.id,
        domains_collaborators: collabDomains,
        followers_domains: followerDomains,
        status,
        start_date: startDate,
        end_date: endDate,
        type: reqType,
      });

      requirement.code = code;
      toPersist.push(requirement);
    }

    if (toPersist.length > 0) {
      await entityManager.persist(toPersist).flush();
    }
  }
}
