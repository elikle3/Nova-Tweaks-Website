import React, { useEffect, useState } from 'react';
import { FileText, Loader2, ShieldAlert } from 'lucide-react';
import { legalConfig } from './legalConfig';

const DOCUMENTS = {
  privacy: { title: 'Privacy information' },
  terms: { title: 'Terms and license conditions' },
  withdrawal: { title: 'Withdrawal information' },
  imprint: { title: 'Imprint' }
};

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');
}

function LegalDocumentPage({ type }) {
  const document = DOCUMENTS[type] || DOCUMENTS.terms;
  const version = legalConfig.versions[type] || '';
  const checksum = legalConfig.checksums[type] || '';
  const published = legalConfig.released && Boolean(version) && /^[a-f0-9]{64}$/.test(checksum);
  const [state, setState] = useState({ status: published ? 'loading' : 'blocked', content: '' });

  useEffect(() => {
    if (!published) {
      setState({ status: 'blocked', content: '' });
      return undefined;
    }
    const controller = new AbortController();
    setState({ status: 'loading', content: '' });
    fetch(`${legalConfig.apiUrl}/legal/documents/${type}/${encodeURIComponent(version)}`, {
      method: 'GET',
      credentials: 'omit',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    })
      .then(async (response) => {
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error('legal_document_unavailable');
        const content = typeof payload.content === 'string' ? payload.content : '';
        const actualChecksum = await sha256(content);
        if (
          payload.documentType !== type
          || payload.version !== version
          || payload.checksumSha256 !== checksum
          || actualChecksum !== checksum
        ) {
          throw new Error('legal_document_integrity_failed');
        }
        setState({ status: 'ready', content });
      })
      .catch((error) => {
        if (error?.name !== 'AbortError') {
          setState({ status: 'error', content: '' });
        }
      });
    return () => controller.abort();
  }, [checksum, published, type, version]);

  return (
    <main className="privacy-page">
      <section className="privacy-hero">
        <div className="section-inner privacy-hero-inner">
          <div className="privacy-hero-copy">
            <span className="eyebrow"><FileText size={14} />Legal document</span>
            <h1>{document.title}</h1>
            {published ? <p>Published version {version}</p> : <p>This document has not yet been legally reviewed and published.</p>}
          </div>
        </div>
      </section>
      <section className="privacy-content-section">
        <div className="section-inner">
          <article className="privacy-section-body">
            {state.status === 'loading' ? (
              <p><Loader2 size={20} className="spin" aria-hidden="true" /> Loading the verified document...</p>
            ) : null}
            {state.status === 'ready' ? (
              <div style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{state.content}</div>
            ) : null}
            {state.status === 'blocked' ? (
              <>
                <ShieldAlert size={24} aria-hidden="true" />
                <h2>Not available for production use</h2>
                <p>Account registration and Premium checkout remain technically disabled until this document is complete, versioned, checksummed and explicitly released.</p>
              </>
            ) : null}
            {state.status === 'error' ? (
              <>
                <ShieldAlert size={24} aria-hidden="true" />
                <h2>Document unavailable</h2>
                <p>The published document could not be loaded or its SHA-256 integrity check failed. No unverified fallback is displayed.</p>
              </>
            ) : null}
          </article>
        </div>
      </section>
    </main>
  );
}

export default LegalDocumentPage;
