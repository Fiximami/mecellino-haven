-- Align the protected role label with the application policy vocabulary.
-- This changes no participant, guardian, consent, or safeguarding records.

begin;

alter table private.role_assignments
  drop constraint role_assignments_role_check;

update private.role_assignments
set role = 'legal_guardian'
where role = 'guardian';

alter table private.role_assignments
  add constraint role_assignments_role_check check (
    role in (
      'participant',
      'legal_guardian',
      'approved_responsible_adult',
      'referrer',
      'mentor',
      'facilitator',
      'programme_operations',
      'safeguarding_lead',
      'restricted_caseworker',
      'system_administrator',
      'auditor'
    )
  );

commit;
