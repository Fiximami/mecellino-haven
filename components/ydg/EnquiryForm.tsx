"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { publicRoutes } from "@/config/routes";
import { demoEnquiryNotice } from "@/config/site";
import { cn } from "@/lib/utils";

type Audience = "family" | "school" | "help" | "sponsor" | "mentor" | "event" | "lifestyle" | "amusement";
type ConsentBand = "10-17" | "18-25";
type FieldKey = "audience" | "name" | "phone" | "consentBand" | "guardian" | "message" | "consent";

const audienceOptions: { value: Audience; title: string; hint: string }[] = [
  {
    value: "family",
    title: "A young person or family",
    hint: "Questions about joining, cost, safety or dates",
  },
  {
    value: "school",
    title: "A school",
    hint: "Nominating students, partnership, timetable",
  },
  {
    value: "help",
    title: "I want help applying",
    hint: "Help to complete an application when intake opens",
  },
  {
    value: "sponsor",
    title: "A company or sponsor",
    hint: "Funding, hosting a supervised group visit",
  },
  {
    value: "mentor",
    title: "A mentor or facilitator",
    hint: "Volunteering — screening and training come first",
  },
  {
    value: "event",
    title: "An event enquiry",
    hint: "Youth or wider-audience events — not ticket sales",
  },
  {
    value: "lifestyle",
    title: "Lifestyle coaching",
    hint: "Personal development and life transitions",
  },
  {
    value: "amusement",
    title: "Amusement interest",
    hint: "Register interest or request mobile-amusement information",
  },
];

const fieldMeta: Record<
  FieldKey,
  { label: string; anchor: string; message: string }
> = {
  audience: {
    label: "Who are you?",
    anchor: "f-audience",
    message: "Please choose who you are.",
  },
  name: {
    label: "Your name",
    anchor: "f-name",
    message: "Please tell us your name.",
  },
  phone: {
    label: "Phone number",
    anchor: "f-phone",
    message: "Please check this phone number and enter at least 9 digits.",
  },
  consentBand: {
    label: "Programme consent band",
    anchor: "f-consent-band",
    message: "Please choose the programme consent band that applies.",
  },
  guardian: {
    label: "Parent or guardian",
    anchor: "f-guardian",
    message: "Please give the parent or guardian's name and phone.",
  },
  message: {
    label: "Your question",
    anchor: "f-message",
    message: "Please write your question.",
  },
  consent: {
    label: "Demonstration acknowledgement",
    anchor: "f-consent",
    message: "Please confirm that you understand this is a demonstration only.",
  },
};

function digitsOnly(value: string) {
  return value.replace(/\D/g, "");
}

export function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [audience, setAudience] = useState<Audience | "">("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [consentBand, setConsentBand] = useState<ConsentBand | "">("");
  const [guardian, setGuardian] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [invalidFields, setInvalidFields] = useState<FieldKey[]>([]);

  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const audienceFirstRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const consentBandFirstRef = useRef<HTMLInputElement>(null);
  const guardianRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);

  const showConsentBand = audience === "family" || audience === "help";
  const showGuardian = showConsentBand && consentBand === "10-17";

  const focusFieldControl = (field: FieldKey) => {
    const scrollTargetId = fieldMeta[field].anchor;

    switch (field) {
      case "audience":
        audienceFirstRef.current?.focus();
        break;
      case "name":
        nameRef.current?.focus();
        break;
      case "phone":
        phoneRef.current?.focus();
        break;
      case "consentBand":
        consentBandFirstRef.current?.focus();
        break;
      case "guardian":
        guardianRef.current?.focus();
        break;
      case "message":
        messageRef.current?.focus();
        break;
      case "consent":
        consentRef.current?.focus();
        break;
    }

    document.getElementById(scrollTargetId)?.scrollIntoView({ block: "nearest" });
  };

  const handleErrorLinkClick = (
    field: FieldKey,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    focusFieldControl(field);
  };

  const validate = () => {
    const nextInvalid: FieldKey[] = [];

    if (!audience) nextInvalid.push("audience");
    if (!name.trim()) nextInvalid.push("name");
    if (digitsOnly(phone).length < 9) nextInvalid.push("phone");
    if (showConsentBand && !consentBand) nextInvalid.push("consentBand");
    if (showGuardian && !guardian.trim()) nextInvalid.push("guardian");
    if (!message.trim()) nextInvalid.push("message");
    if (!consent) nextInvalid.push("consent");

    setInvalidFields(nextInvalid);
    return nextInvalid.length === 0;
  };

  const isInvalid = (field: FieldKey) => invalidFields.includes(field);

  useEffect(() => {
    if (invalidFields.length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [invalidFields]);

  useEffect(() => {
    if (submitted) {
      successRef.current?.focus();
    }
  }, [submitted]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setInvalidFields([]);
    setAudience("");
    setName("");
    setPhone("");
    setEmail("");
    setConsentBand("");
    setGuardian("");
    setMessage("");
    setConsent(false);
  };

  if (submitted) {
    return (
      <div
        ref={successRef}
        className="ydg-form ydg-success"
        tabIndex={-1}
        role="status"
        aria-live="polite"
      >
        <span className="ydg-demo-tag">Demonstration only — nothing was sent</span>
        <h2 className="ydg-h2 mt-3">Demonstration complete</h2>
        <p className="mt-2.5 text-[15px] text-[var(--ink-2)]">
          {demoEnquiryNotice} No reference number was generated because nothing was transmitted or retained.
        </p>
        <ul className="ydg-tick mt-[18px]">
          <li>This walkthrough shows how the form will look and behave when live intake is approved.</li>
          <li>Recruitment and live application intake remain closed in this milestone.</li>
          <li>A monitored contact channel will be published only after product-owner verification.</li>
        </ul>
        <div className="ydg-btnrow mt-[18px]">
          <button type="button" className="ydg-btn ydg-btn-ghost" onClick={resetForm}>
            Try the demonstration again
          </button>
          <Link href={publicRoutes.ydg} className="ydg-btn ydg-btn-primary">
            Back to YDG
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="ydg-notice ydg-notice-divert mb-[18px]">
        <span className="ydg-notice-ic">!</span>
        <div>
          <b>Demonstration only — nothing is transmitted or retained.</b> {demoEnquiryNotice}
        </div>
      </div>

      <form className="ydg-form" noValidate onSubmit={onSubmit}>
        <div className="ydg-notice ydg-notice-divert mb-[18px]">
          <span className="ydg-notice-ic">!</span>
          <div>
            <b>If a child is in immediate danger, contact emergency services first.</b> Organisation safeguarding
            reporting routes are not open in this milestone. Read programme safeguarding information on the{" "}
            <Link href={publicRoutes.parents} className="font-semibold text-[var(--mh-cyan)]">
              parents and safeguarding page
            </Link>
            .
          </div>
        </div>

        {invalidFields.length > 0 ? (
          <div
            ref={errorSummaryRef}
            className="ydg-errsum"
            role="alert"
            tabIndex={-1}
            aria-labelledby="enq-err-title"
          >
            <h3 id="enq-err-title" className="ydg-h3 text-[var(--err)]">
              Please check {invalidFields.length === 1 ? "1 thing" : `${invalidFields.length} things`} before
              continuing
            </h3>
            <ul>
              {invalidFields.map((field) => (
                <li key={field}>
                  <a href={`#${fieldMeta[field].anchor}`} onClick={(event) => handleErrorLinkClick(field, event)}>
                    {fieldMeta[field].message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div id="f-audience" className={cn("ydg-field", isInvalid("audience") && "bad")}>
          <span id="audience-label">
            Who are you? <span className="ydg-req">Required</span>
          </span>
          <div
            className={cn("ydg-choices", isInvalid("audience") && "bad")}
            role="radiogroup"
            aria-labelledby="audience-label"
            aria-invalid={isInvalid("audience") || undefined}
            aria-describedby={isInvalid("audience") ? "e-audience" : undefined}
          >
            {audienceOptions.map((option, index) => (
              <label
                className={cn("ydg-choice", audience === option.value && "sel")}
                key={option.value}
              >
                <input
                  ref={index === 0 ? audienceFirstRef : undefined}
                  type="radio"
                  name="audience"
                  value={option.value}
                  checked={audience === option.value}
                  onChange={() => setAudience(option.value)}
                />
                <span>
                  <b>{option.title}</b>
                  <span>{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
          {isInvalid("audience") ? (
            <p className="ydg-errmsg" id="e-audience">
              {fieldMeta.audience.message}
            </p>
          ) : null}
        </div>

        <div id="f-name" className={cn("ydg-field", isInvalid("name") && "bad")}>
          <label htmlFor="enq-name">
            Your name <span className="ydg-req">Required</span>
          </label>
          <input
            ref={nameRef}
            id="enq-name"
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={isInvalid("name") || undefined}
            aria-describedby={isInvalid("name") ? "e-name" : undefined}
          />
          {isInvalid("name") ? (
            <p className="ydg-errmsg" id="e-name">
              {fieldMeta.name.message}
            </p>
          ) : null}
        </div>

        <div id="f-phone" className={cn("ydg-field", isInvalid("phone") && "bad")}>
          <label htmlFor="enq-phone">
            Phone number <span className="ydg-req">Required</span>
          </label>
          <p className="hint" id="enq-phone-hint">
            Ghanaian mobile numbers are fine in any format. In this demonstration, the number is not stored or used.
          </p>
          <input
            ref={phoneRef}
            id="enq-phone"
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            aria-invalid={isInvalid("phone") || undefined}
            aria-describedby={
              isInvalid("phone") ? "enq-phone-hint e-phone" : "enq-phone-hint"
            }
          />
          {isInvalid("phone") ? (
            <p className="ydg-errmsg" id="e-phone">
              {fieldMeta.phone.message}
            </p>
          ) : null}
        </div>

        <div className="ydg-field">
          <label htmlFor="enq-email">
            Email <span className="ydg-opt">Optional</span>
          </label>
          <p className="hint">You do not need an email address to register interest when live intake opens.</p>
          <input
            id="enq-email"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        {showConsentBand ? (
          <div id="f-consent-band" className={cn("ydg-field", isInvalid("consentBand") && "bad")}>
            <span id="consent-band-label">
              Which programme consent band applies? <span className="ydg-req">Required</span>
            </span>
            <p className="hint" id="consent-band-hint">
              We do not ask for date of birth in this demonstration. Education stage is recorded separately when live
              intake opens — it is not inferred from age alone.
            </p>
            <div
              className={cn("ydg-choices", isInvalid("consentBand") && "bad")}
              role="radiogroup"
              aria-labelledby="consent-band-label"
              aria-describedby={
                isInvalid("consentBand") ? "consent-band-hint e-consent-band" : "consent-band-hint"
              }
              aria-invalid={isInvalid("consentBand") || undefined}
            >
              <label className={cn("ydg-choice", consentBand === "10-17" && "sel")}>
                <input
                  ref={consentBandFirstRef}
                  type="radio"
                  name="consentBand"
                  value="10-17"
                  checked={consentBand === "10-17"}
                  onChange={() => setConsentBand("10-17")}
                />
                <span>
                  <b>Ages 10–17</b>
                  <span>
                    A parent or legal guardian gives programme consent, and the young person gives their own separate
                    assent. They may withdraw at any time.
                  </span>
                </span>
              </label>
              <label className={cn("ydg-choice", consentBand === "18-25" && "sel")}>
                <input
                  type="radio"
                  name="consentBand"
                  value="18-25"
                  checked={consentBand === "18-25"}
                  onChange={() => setConsentBand("18-25")}
                />
                <span>
                  <b>Ages 18–25</b>
                  <span>
                    The participant gives their own legal consent. A parent, guardian or approved responsible adult
                    also gives programme acknowledgement — it never overrides the participant&apos;s consent or right to
                    withdraw.
                  </span>
                </span>
              </label>
            </div>
            {consentBand === "18-25" ? (
              <div className="ydg-notice mt-2">
                <span className="ydg-notice-ic">i</span>
                <div>
                  Where a Safeguarding Lead has approved an exception, an approved responsible adult may act in place of
                  a parent or guardian. Photography and video permission stays separate and optional.
                </div>
              </div>
            ) : null}
            {isInvalid("consentBand") ? (
              <p className="ydg-errmsg" id="e-consent-band">
                {fieldMeta.consentBand.message}
              </p>
            ) : null}
          </div>
        ) : null}

        {showGuardian ? (
          <div id="f-guardian" className={cn("ydg-field", isInvalid("guardian") && "bad")}>
            <label htmlFor="enq-guardian">
              Parent or legal guardian&apos;s name and phone <span className="ydg-req">Required</span>
            </label>
            <p className="hint" id="enq-guardian-hint">
              Ages 10–17 cannot take part without an adult who is legally responsible for them.
            </p>
            <input
              ref={guardianRef}
              id="enq-guardian"
              type="text"
              name="guardian"
              value={guardian}
              onChange={(event) => setGuardian(event.target.value)}
              aria-invalid={isInvalid("guardian") || undefined}
              aria-describedby={
                isInvalid("guardian") ? "enq-guardian-hint e-guardian" : "enq-guardian-hint"
              }
            />
            {isInvalid("guardian") ? (
              <p className="ydg-errmsg" id="e-guardian">
                {fieldMeta.guardian.message}
              </p>
            ) : null}
          </div>
        ) : null}

        <div id="f-message" className={cn("ydg-field", isInvalid("message") && "bad")}>
          <label htmlFor="enq-message">
            Your question <span className="ydg-req">Required</span>
          </label>
          <textarea
            ref={messageRef}
            id="enq-message"
            name="message"
            maxLength={800}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-invalid={isInvalid("message") || undefined}
            aria-describedby={isInvalid("message") ? "enq-message-hint e-message" : "enq-message-hint"}
          />
          <p className="hint" id="enq-message-hint">
            {message.length}/800 characters
          </p>
          <div className="ydg-notice mt-2">
            <span className="ydg-notice-ic">!</span>
            <div>
              Please do not write health, safety or other private information here. If we need it, we will ask you for
              it privately and securely when live intake opens.
            </div>
          </div>
          {isInvalid("message") ? (
            <p className="ydg-errmsg" id="e-message">
              {fieldMeta.message.message}
            </p>
          ) : null}
        </div>

        <div id="f-consent" className={cn("ydg-field", isInvalid("consent") && "bad")}>
          <label className={cn("ydg-choice border border-[var(--line-2)]", consent && "sel")}>
            <input
              ref={consentRef}
              id="enq-consent"
              type="checkbox"
              checked={consent}
              onChange={(event) => setConsent(event.target.checked)}
              aria-invalid={isInvalid("consent") || undefined}
              aria-describedby={
                isInvalid("consent") ? "consent-hint e-consent" : "consent-hint"
              }
            />
            <span>
              <b>
                I understand this is a demonstration only <span className="ydg-req">Required</span>
              </b>
              <span id="consent-hint">
                Nothing I enter here is transmitted, stored or reviewed in this milestone.
              </span>
            </span>
          </label>
          {isInvalid("consent") ? (
            <p className="ydg-errmsg" id="e-consent">
              {fieldMeta.consent.message}
            </p>
          ) : null}
        </div>

        <div className="ydg-notice ydg-notice-privacy">
          <span className="ydg-notice-ic">🔒</span>
          <div>
            <b>How this demonstration treats information.</b> In this milestone, no data leaves your browser. When live
            enquiry handling is approved, a full privacy notice will be published before any submission is accepted.
          </div>
        </div>

        <div className="ydg-btnrow mt-4">
          <button type="submit" className="ydg-btn ydg-btn-primary">
            Show demonstration result
          </button>
        </div>
        <p className="ydg-fine mt-3.5">
          An enquiry is not an application, and it does not give you priority for a place. Live intake remains closed.
        </p>
      </form>
    </>
  );
}
