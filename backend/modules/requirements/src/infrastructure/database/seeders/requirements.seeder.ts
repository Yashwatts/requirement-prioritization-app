import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/postgresql';
import { Requirement } from '@modules/requirements/src/domain/requirement/requirement';
import { Domain } from '@modules/requirements/src/domain/requirement/domain/domain';
import { Institution } from '@modules/requirements/src/domain/requirement/institution/institution';
import { ImpactUsers } from '@modules/requirements/src/domain/requirement/impact-users/impact-users';
import { RequirementState } from '@modules/requirements/src/domain/requirement/enums/requirement-state.enum';
import { ComplexityEffort } from '@modules/requirements/src/domain/requirement/enums/complexity-effort.enum';
import { StudyModality } from '@modules/requirements/src/domain/requirement/enums/study-modality.enum';
import { RequirementType } from '@modules/requirements/src/domain/requirement/enums/requirement-type.enum';
import { UserImpactLevel } from '@modules/requirements/src/domain/requirement/enums/user-impact-level.enum';
import { ClientPriority } from '@modules/requirements/src/domain/requirement/enums/client-priority.enum';

const REQUIREMENT_TEMPLATES = [
  {
    name: 'Implement automated student grade notification system',
    description:
      'Allows students to receive real-time notifications via email and SMS whenever faculty publish exam scores.',
  },
  {
    name: 'Integration with international payment gateway for tuition',
    description:
      'Enables students worldwide to pay tuition in local currencies through Stripe and PayPal integrations.',
  },
  {
    name: 'Virtual classroom video recording and transcription service',
    description:
      'Automatically records lecture sessions and uses AI to generate synchronized text transcripts.',
  },
  {
    name: 'Automated diploma generation and digital signature',
    description:
      'Generates secure PDF degree certificates with cryptographic QR code validation.',
  },
  {
    name: 'Scholarship management and verification portal',
    description:
      'Streamlines applicant document submission and financial committee review workflows.',
  },
  {
    name: 'Campus access control system QR integration',
    description:
      'Allows registered students and visitors to scan dynamic mobile QR codes at university entrances.',
  },
  {
    name: 'Student academic history export in PDF format',
    description:
      'Generates official academic transcripts with watermarks and institution stamps.',
  },
  {
    name: 'Teacher workload distribution and scheduling module',
    description:
      'Optimizes course assignments and weekly teaching hour limits across faculty members.',
  },
  {
    name: 'Library digital repository search enhancement',
    description:
      'Implements full-text semantic search for research papers, books, and thesis archives.',
  },
  {
    name: 'Multilingual thesis evaluation management workflow',
    description:
      'Coordinates international peer reviewers and thesis jury scoring in Spanish and English.',
  },
  {
    name: 'Admissions lead tracking and CRM automated sync',
    description:
      'Connects marketing landing pages directly with university admissions counseling queues.',
  },
  {
    name: 'Online exam proctoring and identity verification',
    description:
      'Enables biometric webcam facial recognition and browser lockdown during midterm examinations.',
  },
  {
    name: 'Alumni networking and job placement directory',
    description:
      'Connects university graduates with hiring partner institutions and career mentor programs.',
  },
  {
    name: 'Course syllabus version control and approval workflow',
    description:
      'Allows department heads to review, edit, and approve annual syllabus curriculum revisions.',
  },
  {
    name: 'Financial aid application evaluation portal',
    description:
      'Centralizes socioeconomic evaluation forms and grant allocation spreadsheets.',
  },
  {
    name: 'University research project grant tracking',
    description:
      'Tracks budget expenditures, milestone reports, and deliverables for European grant projects.',
  },
  {
    name: 'Mobile responsive dashboard for student portal',
    description:
      'Overhauls dashboard UI with modern responsive layout for mobile phone and tablet users.',
  },
  {
    name: 'Bulk email notifications for enrollment deadlines',
    description:
      'Scheduled cron service sending reminders before tuition and course registration cutoffs.',
  },
  {
    name: 'Automated attendance tracking via virtual session logs',
    description:
      'Extracts student connection durations from Zoom and Teams webhooks to calculate attendance.',
  },
  {
    name: 'Integration of plagiarism detection API into submission portal',
    description:
      'Scans student assignments through Turnitin API upon submission and provides similarity scores.',
  },
  {
    name: 'Student feedback and professor evaluation survey',
    description:
      'End-of-term survey system gathering anonymous student reviews with analytics dashboards.',
  },
  {
    name: 'Double degree program credit equivalence calculator',
    description:
      'Calculates transferred credits between Latin American and European partner universities.',
  },
  {
    name: 'Internship agreement and company supervisor tracking',
    description:
      'Manages legal agreements with corporate internship sponsors and student log evaluations.',
  },
  {
    name: 'Virtual graduation ceremony live stream and RSVP portal',
    description:
      'Allows graduates to confirm participation, submit ceremony slides, and invite guests.',
  },
  {
    name: 'Digital student ID card with NFC capability',
    description:
      'Provides apple wallet and google wallet pass credentials for enrolled university students.',
  },
  {
    name: 'Emergency campus announcement SMS alert system',
    description:
      'Instant mass notification channel for weather closures, security alerts, and urgent notices.',
  },
  {
    name: 'Automated billing and invoice generation for corporate clients',
    description:
      'Generates compliant tax invoices for businesses sponsoring executive master degrees.',
  },
  {
    name: 'Online course prerequisite validation engine',
    description:
      'Prevents students from registering for advanced courses without passing foundational prerequisites.',
  },
  {
    name: 'Multi-institution shared resource catalog',
    description:
      'Enables inter-library loan and shared laboratory equipment booking across the university network.',
  },
  {
    name: 'Academic committee minutes and voting portal',
    description:
      'Digitizes faculty council minutes, agenda items, and secure voting records.',
  },
  {
    name: 'Language placement test automated scoring system',
    description:
      'Evaluates online English and Spanish proficiency tests and recommends student levels.',
  },
  {
    name: 'Virtual laboratory simulation environment integration',
    description:
      'Integrates interactive cloud-based science lab simulations into biology and chemistry courses.',
  },
  {
    name: 'Student mental health and counseling appointment scheduler',
    description:
      'Confidential appointment booking system connecting students with university counselors.',
  },
  {
    name: 'Faculty publication and citation metrics tracker',
    description:
      'Aggregates Scopus and Google Scholar citations for university accreditation reports.',
  },
  {
    name: 'Classroom audiovisual equipment maintenance tracker',
    description:
      'Tickets and preventive maintenance logging for projectors, microphones, and smartboards.',
  },
  {
    name: 'Student sports and extracurricular club registration',
    description:
      'Enables students to browse university clubs, sports teams, and register online.',
  },
  {
    name: 'Automated degree audit and graduation eligibility check',
    description:
      'Scans completed credits against graduation requirements to flag missing prerequisites.',
  },
  {
    name: 'Campus parking permit and vehicle license plate recognition',
    description:
      'Automates parking barrier opening and permit renewals via automated license cameras.',
  },
  {
    name: 'Online tutoring and peer mentoring session booking',
    description:
      'Allows struggling students to book 1-on-1 peer tutoring slots with top-performing seniors.',
  },
  {
    name: 'International student visa documentation checklist',
    description:
      'Guides foreign students through embassy paperwork, health insurance, and embassy filings.',
  },
  {
    name: 'University podcast and multimedia content hosting',
    description:
      'Central repository for educational podcasts, guest speaker lectures, and interview videos.',
  },
  {
    name: 'Corporate sponsorship and donation tracking ledger',
    description:
      'Records philanthropic donations, endowment funds, and named scholarship allocations.',
  },
  {
    name: 'Exam room seat assignment and barcode attendance',
    description:
      'Randomizes student exam seat placements to prevent cheating and scans exam answer sheets.',
  },
  {
    name: 'Academic calendar and holiday schedule synchronization',
    description:
      'Syncs university academic dates, reading periods, and holidays to student Google calendars.',
  },
  {
    name: 'Online lost and found reporting portal',
    description:
      'Allows campus security and students to post and search found belongings with photo verification.',
  },
  {
    name: 'Faculty sabbatical and research leave management',
    description:
      'Manages professor leave applications, research proposals, and replacement teaching staff.',
  },
  {
    name: 'Student cafeteria meal plan and dietary balance portal',
    description:
      'Pre-paid cafeteria credit management with daily menu allergen and nutrition details.',
  },
  {
    name: 'Online bookstore inventory and digital textbook licensing',
    description:
      'Coordinates digital textbook eBook license keys and physical book delivery pickups.',
  },
  {
    name: 'Campus shuttle bus live GPS tracking system',
    description:
      'Real-time map showing inter-campus bus locations and estimated arrival times.',
  },
  {
    name: 'Student dispute resolution and ombudsman ticketing',
    description:
      'Confidential grievances and formal appeal submission portal with SLA tracking.',
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

    const domainImpactRangeMap = new Map<string, ImpactUsers[]>();
    for (const impactUsersRecord of impactUsersList) {
      const domainImpactUsersList =
        domainImpactRangeMap.get(impactUsersRecord.domain_uuid) ?? [];
      domainImpactUsersList.push(impactUsersRecord);
      domainImpactRangeMap.set(
        impactUsersRecord.domain_uuid,
        domainImpactUsersList,
      );
    }

    const benefitedInstitutionNames = institutions
      .map((institution) => institution.name)
      .filter((institutionName) => institutionName !== 'Grupo Funiber');

    const domainNames = domains.map((domain) => domain.name);

    // Track used codes to prevent collisions
    const usedCodes = new Set<number>();
    const existingRequirements = await entityManager.find(
      Requirement,
      {},
      { fields: ['code'] },
    );
    for (const requirementRecord of existingRequirements) {
      usedCodes.add(requirementRecord.code);
    }

    const requirementsToPersist: Requirement[] = [];
    const countToCreate = Math.max(0, 50 - existingCount);

    for (
      let requirementIndex = 0;
      requirementIndex < countToCreate;
      requirementIndex++
    ) {
      const template =
        REQUIREMENT_TEMPLATES[requirementIndex % REQUIREMENT_TEMPLATES.length];

      // Generate unique 6-digit code
      let code = Math.floor(100000 + Math.random() * 900000);
      while (usedCodes.has(code)) {
        code = Math.floor(100000 + Math.random() * 900000);
      }
      usedCodes.add(code);

      // Select domain in charge
      const domainIndex = requirementIndex % domains.length;
      const domainInCharge = domains[domainIndex];

      // Select requesting institution
      const requestingInstitution =
        institutions[requirementIndex % institutions.length];

      // Random benefited institutions (1 to 4)
      const numBenefited = 1 + (requirementIndex % 4);
      const startIndex =
        (requirementIndex * 2) % benefitedInstitutionNames.length;
      const benefitedSlice: string[] = [];
      for (let offset = 0; offset < numBenefited; offset++) {
        const institutionName =
          benefitedInstitutionNames[
            (startIndex + offset) % benefitedInstitutionNames.length
          ];
        if (!benefitedSlice.includes(institutionName)) {
          benefitedSlice.push(institutionName);
        }
      }

      // Random collaborator & follower domains
      const collaboratorDomainNames: string[] = [];
      if (requirementIndex % 2 === 0) {
        collaboratorDomainNames.push(
          domainNames[(domainIndex + 1) % domainNames.length],
        );
      }
      if (requirementIndex % 4 === 0) {
        collaboratorDomainNames.push(
          domainNames[(domainIndex + 2) % domainNames.length],
        );
      }

      const followerDomainNames: string[] = [];
      if (requirementIndex % 3 === 0) {
        followerDomainNames.push(
          domainNames[(domainIndex + 3) % domainNames.length],
        );
      }

      const obligation = requirementIndex % 2 === 0;
      const existSolutionAlternative = requirementIndex % 3 === 0;
      const impactLevels = [
        UserImpactLevel.LOW,
        UserImpactLevel.MEDIUM,
        UserImpactLevel.HIGH,
        UserImpactLevel.VERY_HIGH,
      ];
      const targetImpactLevel =
        impactLevels[requirementIndex % impactLevels.length];

      // Find exact impact range from ImpactUsers table
      const domainImpactRanges =
        domainImpactRangeMap.get(domainInCharge.uuid) ?? [];
      const userImpactRange = domainImpactRanges.find(
        (availableRange) =>
          availableRange.impact_number_users_level === targetImpactLevel,
      );

      const requesterName = REQUESTERS[requirementIndex % REQUESTERS.length];
      const COMPLEXITIES = [
        ComplexityEffort.XS,
        ComplexityEffort.S,
        ComplexityEffort.M,
        ComplexityEffort.L,
        ComplexityEffort.XL,
      ];
      const MODALITIES = [
        StudyModality.VIRTUAL,
        StudyModality.PRESENCIAL,
        StudyModality.VIRTUAL_PRESENCIAL,
      ];
      const TYPES = [
        RequirementType.INTERNAL,
        RequirementType.EXTERNAL,
        RequirementType.CLIENT,
      ];

      const complexityAndEffort =
        COMPLEXITIES[requirementIndex % COMPLEXITIES.length];
      const studyModality = MODALITIES[requirementIndex % MODALITIES.length];
      const requirementType = TYPES[requirementIndex % TYPES.length];
      const requirementState =
        requirementIndex % 3 === 0
          ? RequirementState.FLOW
          : RequirementState.REGISTERED;

      const now = Date.now();
      const startDate = new Date(now - requirementIndex * 86400000 * 2);
      const endDate = new Date(now + (50 - requirementIndex) * 86400000 * 3);

      if (!userImpactRange) {
        throw new Error(
          `Impact user range not found for domain ${domainInCharge.name} and level ${targetImpactLevel}`,
        );
      }

      const requirement = Requirement.create({
        code,
        name: `${template.name} ${existingCount + requirementIndex + 1}`,
        description: template.description,
        requesting_institution_id: requestingInstitution.id,
        requested_by: [requesterName],
        benefited_institutions: benefitedSlice,
        obligation,
        exist_solution_alternative: existSolutionAlternative,
        study_modality: studyModality,
        impact_number_users_id: userImpactRange.id,
        impact: 10 + (requirementIndex % 30),
        client_priority:
          requirementIndex % 3 === 0
            ? ClientPriority.LOW
            : requirementIndex % 3 === 1
              ? ClientPriority.MEDIUM
              : ClientPriority.HIGH,
        complexity_and_effort: complexityAndEffort,
        domain_in_charge_id: domainInCharge.id,
        domains_collaborators: collaboratorDomainNames,
        followers_domains: followerDomainNames,
        status: requirementState,
        start_date: startDate,
        end_date: endDate,
        type: requirementType,
      });

      requirementsToPersist.push(requirement);
    }

    if (requirementsToPersist.length > 0) {
      await entityManager.persist(requirementsToPersist).flush();
    }
  }
}
