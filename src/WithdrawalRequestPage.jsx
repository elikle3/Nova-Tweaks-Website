import React, { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Mail, ShieldCheck } from 'lucide-react';
import { submitWithdrawalRequest } from './lib/api';

const DECLARATION_TEXT = [
  'Hiermit widerrufe ich den oben bezeichneten Vertrag.',
  'I hereby withdraw from the contract identified above.'
].join('\n');
const DECLARATION_VERSION = '2026-07-30';
const DECLARATION_CHECKSUM_SHA256 = 'ca551f2d3c35c1479a23846e43ae418d88cb68b54405bae89dd8614fccd00730';

function createSubmissionId() {
  if (typeof window.crypto?.randomUUID === 'function') {
    return window.crypto.randomUUID();
  }
  const bytes = new Uint8Array(16);
  window.crypto.getRandomValues(bytes);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (value) => value.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function formatError(error) {
  const code = String(error?.code || error?.message || '').toLowerCase();
  if (code.includes('too_many')) {
    return 'Zu viele Versuche. Bitte versuchen Sie es später erneut. / Too many attempts. Please try again later.';
  }
  if (code.includes('confirmation_delivery_failed')) {
    return 'Der Antrag wurde erfasst, aber die E-Mail konnte nicht sofort zugestellt werden. Bitte senden Sie denselben Antrag erneut. / The request was recorded, but email delivery failed. Please retry the same request.';
  }
  if (code.includes('submission_conflict')) {
    return 'Diese Übermittlungskennung wurde bereits mit anderen Angaben verwendet. Bitte laden Sie die Seite neu. / This submission identifier was already used with different details. Please reload the page.';
  }
  if (code.includes('invalid_withdrawal')) {
    return 'Bitte prüfen Sie alle Pflichtangaben. / Please check all required information.';
  }
  if (code.includes('declaration_version_mismatch')) {
    return 'Die Widerrufsfunktion wurde aktualisiert. Bitte laden Sie die Seite neu. / The withdrawal function was updated. Please reload the page.';
  }
  return 'Der Antrag konnte nicht übermittelt werden. Bitte versuchen Sie es erneut. / The request could not be submitted. Please try again.';
}

export default function WithdrawalRequestPage() {
  const [stage, setStage] = useState('form');
  const [consumerName, setConsumerName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contractReference, setContractReference] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [submissionId, setSubmissionId] = useState(() => createSubmissionId());
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formValid = useMemo(
    () => consumerName.trim().length >= 2
      && contactEmail.trim().length >= 5
      && contractReference.trim().length >= 3,
    [consumerName, contactEmail, contractReference]
  );

  function editDetails() {
    setStage('form');
    setConfirmed(false);
    setError('');
    setSubmissionId(createSubmissionId());
  }

  async function confirmWithdrawal() {
    if (!confirmed || !formValid || loading) return;
    setLoading(true);
    setError('');
    try {
      const response = await submitWithdrawalRequest({
        submissionId,
        consumerName: consumerName.trim(),
        contactEmail: contactEmail.trim(),
        contractReference: contractReference.trim(),
        declarationConfirmed: true,
        declarationVersion: DECLARATION_VERSION,
        declarationChecksumSha256: DECLARATION_CHECKSUM_SHA256
      });
      if (response.status === 'confirmation_pending') {
        setError('Die E-Mail-Bestätigung wird gerade versandt. Bitte versuchen Sie denselben Antrag gleich erneut. / Email confirmation is still being sent. Please retry the same request shortly.');
        return;
      }
      setResult(response);
      setStage('complete');
    } catch (submitError) {
      setError(formatError(submitError));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="withdrawal-request-page">
      <section className="section-inner withdrawal-request-shell" aria-labelledby="withdrawal-request-title">
        <div className="withdrawal-request-heading">
          <span className="eyebrow"><ShieldCheck size={16} /> Elektronische Widerrufsfunktion</span>
          <h1 id="withdrawal-request-title">Vertrag widerrufen</h1>
          <p>
            Über diese Funktion können Sie Ihren Widerruf elektronisch erklären. Nach erfolgreicher
            Übermittlung senden wir sofort eine Bestätigung mit Inhalt, Datum und Uhrzeit an die
            angegebene E-Mail-Adresse.
          </p>
          <p className="withdrawal-request-translation">
            Use this function to submit a contract withdrawal electronically. After successful
            submission, we immediately email you a durable confirmation containing the declaration,
            date and time.
          </p>
        </div>

        {stage === 'form' ? (
          <form
            className="withdrawal-request-card"
            onSubmit={(event) => {
              event.preventDefault();
              if (formValid) {
                setError('');
                setStage('review');
              }
            }}
          >
            <label>
              <span>Name / Full name</span>
              <input
                type="text"
                autoComplete="name"
                minLength={2}
                maxLength={120}
                required
                value={consumerName}
                onChange={(event) => setConsumerName(event.target.value)}
              />
            </label>
            <label>
              <span>Vertragsreferenz / Contract reference</span>
              <input
                type="text"
                autoComplete="off"
                minLength={3}
                maxLength={200}
                required
                value={contractReference}
                onChange={(event) => setContractReference(event.target.value)}
                aria-describedby="contract-reference-help"
              />
              <small id="contract-reference-help">
                Verwenden Sie vorzugsweise die Beleg-ID aus Ihrer Vertragsbestätigung. / Prefer the
                receipt ID from your contract confirmation.
              </small>
            </label>
            <label>
              <span>E-Mail für die Bestätigung / Confirmation email</span>
              <input
                type="email"
                autoComplete="email"
                maxLength={254}
                required
                value={contactEmail}
                onChange={(event) => setContactEmail(event.target.value)}
              />
            </label>
            <p className="withdrawal-request-privacy">
              Die Angaben werden ausschließlich zur Bearbeitung und zum Nachweis des Widerrufs
              verarbeitet. Details stehen in der <a href="/privacy">Datenschutzerklärung</a>.
            </p>
            <button className="btn btn-primary" type="submit" disabled={!formValid}>
              Angaben prüfen
            </button>
          </form>
        ) : null}

        {stage === 'review' ? (
          <section className="withdrawal-request-card" aria-live="polite">
            <h2>Angaben prüfen / Review</h2>
            <dl className="withdrawal-request-review">
              <div><dt>Name</dt><dd>{consumerName.trim()}</dd></div>
              <div><dt>Vertragsreferenz</dt><dd>{contractReference.trim()}</dd></div>
              <div><dt>Bestätigungs-E-Mail</dt><dd>{contactEmail.trim()}</dd></div>
            </dl>
            <div className="withdrawal-declaration">
              <strong>Widerrufserklärung / Withdrawal declaration</strong>
              <p>{DECLARATION_TEXT}</p>
            </div>
            <label className="withdrawal-confirmation-check">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(event) => setConfirmed(event.target.checked)}
              />
              <span>
                Ich bestätige, dass ich die oben angezeigte Widerrufserklärung jetzt übermitteln
                möchte. / I confirm that I want to submit the withdrawal declaration shown above.
              </span>
            </label>
            {error ? <p className="withdrawal-request-error" role="alert">{error}</p> : null}
            <div className="withdrawal-request-actions">
              <button className="btn btn-secondary" type="button" onClick={editDetails} disabled={loading}>
                <ArrowLeft size={16} /> Angaben ändern
              </button>
              <button className="btn btn-primary" type="button" onClick={confirmWithdrawal} disabled={!confirmed || loading}>
                {loading ? 'Wird übermittelt…' : 'Widerruf bestätigen'}
              </button>
            </div>
          </section>
        ) : null}

        {stage === 'complete' ? (
          <section className="withdrawal-request-card withdrawal-request-complete" aria-live="polite">
            <CheckCircle2 size={38} aria-hidden="true" />
            <h2>Widerruf eingegangen / Withdrawal received</h2>
            <p>
              Der Antrag ist eingegangen. Eine Bestätigung wurde an <strong>{contactEmail.trim()}</strong> versandt.
            </p>
            <p className="withdrawal-request-translation">
              Your request was received and a confirmation was sent to the email address above.
            </p>
            <dl className="withdrawal-request-review">
              <div><dt>Antrags-ID / Request ID</dt><dd>{result?.requestId || ''}</dd></div>
              <div><dt>Eingang / Received</dt><dd>{result?.receivedAt ? new Date(result.receivedAt).toISOString() : ''}</dd></div>
              <div><dt>E-Mail versandt / Email sent</dt><dd>{result?.confirmationSentAt ? new Date(result.confirmationSentAt).toISOString() : ''}</dd></div>
            </dl>
            <p className="withdrawal-request-privacy"><Mail size={15} /> Bitte bewahren Sie die Bestätigungs-E-Mail auf.</p>
          </section>
        ) : null}
      </section>
    </main>
  );
}
