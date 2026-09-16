import {
  onboardingConsentFoundation,
  onboardingConsentStepsFor,
  type OnboardingConsentAudience,
} from "@/lib/consent/onboarding-foundation";

type OnboardingConsentFoundationProps = {
  audience: OnboardingConsentAudience;
};

export function OnboardingConsentFoundation({ audience }: OnboardingConsentFoundationProps) {
  const steps = onboardingConsentStepsFor(audience);

  return (
    <section
      data-consent-foundation={onboardingConsentFoundation.status}
      data-consent-collection={onboardingConsentFoundation.collection}
      aria-label="Onboarding consent foundation (dormant)"
      className="ydg-stack"
    >
      <p className="ydg-fine">
        This consent step belongs inside a future registration or onboarding flow. It is not a global pop-up and it
        does not collect, store or submit personal data.
      </p>

      {audience === "under_18" ? (
        <>
          <h2 className="ydg-h3">Parent or legal-guardian programme consent</h2>
          <p className="text-[15px] text-[var(--ink-2)]">
            Required. A parent or legal guardian must give programme consent before a person under 18 can take part.
            Alternative responsible-adult exceptions remain safeguarding-controlled and are not self-service.
          </p>
          <h2 className="ydg-h3">Participant assent</h2>
          <p className="text-[15px] text-[var(--ink-2)]">
            Required and separate. The participant must give their own assent in addition to adult programme consent.
          </p>
        </>
      ) : (
        <>
          <h2 className="ydg-h3">Participant legal consent</h2>
          <p className="text-[15px] text-[var(--ink-2)]">
            Mandatory. An adult participant gives their own legal consent. Guardian or responsible-adult legal consent
            is skipped.
          </p>
          <h2 className="ydg-h3">Organisational acknowledgement</h2>
          <p className="text-[15px] text-[var(--ink-2)]">
            Required. A parent, guardian or approved responsible adult still gives programme acknowledgement. It never
            overrides the participant&apos;s consent or right to withdraw.
          </p>
        </>
      )}

      <h2 className="ydg-h3">Media consent</h2>
      <p className="text-[15px] text-[var(--ink-2)]">
        Separate and optional. Refusing photography or video permission does not affect programme eligibility.
      </p>
      <p className="sr-only">
        {steps.participantLegalConsent} {steps.organisationalAcknowledgement} {steps.mediaConsent.optional ? "optional media" : ""}
      </p>
    </section>
  );
}
