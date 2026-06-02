import React from 'react';
import {
  BadgeCheck,
  Clock3,
  Cookie,
  Database,
  FileText,
  Globe2,
  HardDrive,
  KeyRound,
  Lock,
  Mail,
  Receipt,
  Scale,
  Server,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

const APP_LOGO_SRC = new URL('./assets/logo.ico', import.meta.url).href;

const privacySections = [
  {
    id: 'privacy-at-a-glance',
    title: 'Privacy at a Glance',
    icon: ShieldCheck,
    summary: 'Core information, controller, data categories, purposes, and legal bases.',
    body: `
      <h3>General information</h3>
      <p>This Privacy Policy explains which personal data is processed when you visit our website, use a customer account, purchase Premium access, or use the related Nova Tweaks services.</p>
      <p>Personal data means any data that can identify you personally, for example your email address, username, account data, payment references, or technical usage data.</p>
      <p>This Privacy Policy applies to the website <strong>nova-tweaks.com</strong> and to the related API at <strong>api.nova-tweaks.com</strong>.</p>

      <h3>Who is responsible?</h3>
      <p>The controller responsible for data processing is:</p>
      <address>Elia Klemenz<br>Gernacher Straße 1<br>97509 Kolitzheim<br>Germany</address>
      <p>Email: <a href="mailto:info@nova-tweaks.com">info@nova-tweaks.com</a><br>Support: <a href="mailto:support@nova-tweaks.com">support@nova-tweaks.com</a><br>Contact: <a href="mailto:contact@nova-tweaks.com">contact@nova-tweaks.com</a></p>
      <p>The controller is the natural or legal person who, alone or jointly with others, determines the purposes and means of processing personal data.</p>

      <h3>Which data do we process?</h3>
      <p>Depending on how you use our website and services, we process in particular:</p>
      <ul>
        <li>technical access data, e.g. IP address, browser, operating system, time of access, and server log data</li>
        <li>account data, e.g. username, email address, password hash, account ID, verification status, and Premium status</li>
        <li>authentication and session data, e.g. session ID, refresh token hash, client type, expiry time, and revocation time</li>
        <li>security data, e.g. hashed IP address, hashed user agent, and security-relevant events</li>
        <li>payment and Premium references, e.g. Stripe Checkout Session ID, Payment Intent ID, price ID, amount, currency, and Premium activation</li>
        <li>device or installation identifiers in hashed form for license verification and limiting the permitted number of devices</li>
        <li>communication data if you contact us by email</li>
        <li>if applicable, a profile picture or avatar if you voluntarily add one to your customer account</li>
      </ul>

      <h3>What do we use your data for?</h3>
      <p>We process personal data in particular to:</p>
      <ul>
        <li>technically provide the website and API</li>
        <li>create and manage a customer account</li>
        <li>provide login, logout, password reset, and email verification</li>
        <li>sell, activate, and manage Premium access</li>
        <li>process payments through Stripe Checkout</li>
        <li>verify licenses and device limits</li>
        <li>detect misuse, unauthorized access, and security incidents</li>
        <li>process support and contact requests</li>
        <li>comply with statutory retention and documentation obligations</li>
      </ul>

      <h3>Legal bases</h3>
      <p>Depending on the purpose, processing is carried out on the basis of:</p>
      <ul>
        <li>Art. 6(1)(b) GDPR, where processing is necessary for the performance of a contract or for taking steps prior to entering into a contract</li>
        <li>Art. 6(1)(c) GDPR, where statutory obligations apply</li>
        <li>Art. 6(1)(f) GDPR, where we have a legitimate interest in security, abuse prevention, technical stability, and traceability</li>
        <li>Art. 6(1)(a) GDPR, where consent is required and has been obtained</li>
        <li>Section 25(2) TDDDG, where technically necessary cookies or comparable technologies are used</li>
      </ul>
    `
  },
  {
    id: 'hosting',
    title: 'Hosting and Technical Provision',
    icon: Server,
    summary: 'Hosting by Hetzner and technical access data.',
    body: `
      <p>Our website and API are hosted by the following provider:</p>
      <address>Hetzner Online GmbH<br>Industriestr. 25<br>91710 Gunzenhausen<br>Germany</address>
      <p>We use Hetzner for the reliable, secure, and stable provision of our website, API, and server infrastructure.</p>
      <p>When you access our website or API, technical data may be processed, in particular:</p>
      <ul>
        <li>IP address</li>
        <li>date and time of the request</li>
        <li>requested URL or API route</li>
        <li>referrer URL</li>
        <li>browser type and browser version</li>
        <li>operating system</li>
        <li>hostname of the accessing system</li>
        <li>transferred data volume</li>
        <li>HTTP status codes</li>
      </ul>
      <p>Processing is carried out on the basis of Art. 6(1)(f) GDPR. Our legitimate interest lies in the secure, stable, and error-free provision of our website and API.</p>
      <p>We have concluded a data processing agreement with Hetzner pursuant to Art. 28 GDPR.</p>
    `
  },
  {
    id: 'server-logs',
    title: 'Server Log Files and Security Logs',
    icon: Database,
    summary: 'Log data for operation, error analysis, and abuse detection.',
    body: `
      <p>When you visit our website and access our API, technical log data is processed automatically. This data is required to enable technical provision, error analysis, security, and abuse detection.</p>
      <p>The processed data may include:</p>
      <ul>
        <li>IP address</li>
        <li>time of the request</li>
        <li>browser and operating system</li>
        <li>accessed pages or API endpoints</li>
        <li>HTTP status codes</li>
        <li>technical error data</li>
        <li>security-relevant events, e.g. failed login attempts or suspicious requests</li>
      </ul>
      <p>This data is combined with other data sources only where necessary for security, error analysis, or abuse prevention.</p>
      <p>Processing is carried out on the basis of Art. 6(1)(f) GDPR. Our legitimate interest lies in technical stability, IT security, and protecting our services against misuse.</p>
      <p>Security events are generally stored for <strong>90 days</strong>, unless longer storage is necessary in an individual case to investigate an abuse case, enforce legal claims, or comply with statutory obligations.</p>
    `
  },
  {
    id: 'customer-account',
    title: 'Customer Account, Registration, and Account Area',
    icon: UserCheck,
    summary: 'Account data for registration, login, Premium access, and security.',
    body: `
      <p>A customer account is required to use certain Nova Tweaks features. During registration and account management, we process in particular:</p>
      <ul>
        <li>username</li>
        <li>email address</li>
        <li>password hash</li>
        <li>account ID</li>
        <li>verification status</li>
        <li>Premium status</li>
        <li>if applicable, profile picture or avatar</li>
        <li>timestamps of registration, changes, or deletion</li>
      </ul>
      <p>The password is not stored in plain text, but processed as a hash.</p>
      <p>Processing is carried out to create and manage the customer account, enable login, allow use of the Nova Tweaks services, manage Premium access, and communicate about security-relevant account actions.</p>
      <p>The legal basis is Art. 6(1)(b) GDPR. Where data is processed for security, abuse detection, or traceability, processing is additionally carried out on the basis of Art. 6(1)(f) GDPR.</p>
      <p>Account data is generally stored until the customer account is deleted, unless statutory retention obligations or legitimate interests in longer storage prevent deletion.</p>
    `
  },
  {
    id: 'login-sessions-cookie',
    title: 'Login, Sessions, and Authentication Cookie',
    icon: Cookie,
    summary: 'Technically necessary nova_refresh_token cookie for secure sessions.',
    body: `
      <p>For login and session management, we use technically necessary authentication and session mechanisms.</p>
      <p>The following data may be processed in particular:</p>
      <ul>
        <li>session ID</li>
        <li>refresh token hash</li>
        <li>client type</li>
        <li>hashed IP address</li>
        <li>hashed user agent</li>
        <li>session expiry time</li>
        <li>revocation or logout time</li>
      </ul>
      <p>To securely maintain login sessions, we use a technically necessary cookie named: <strong>nova_refresh_token</strong>.</p>
      <p>This cookie is used to recognize logged-in users and enable secure session renewal. It is required for using the customer account and login functions.</p>
      <p>Cookie properties:</p>
      <ul>
        <li>Name: <strong>nova_refresh_token</strong></li>
        <li>Purpose: login and session management</li>
        <li>Type: technically necessary first-party cookie</li>
        <li>Safeguards: HttpOnly, Secure in production, SameSite=Lax</li>
        <li>Storage duration: usually approx. 30 days</li>
      </ul>
      <p>Processing is carried out on the basis of Art. 6(1)(b) GDPR where it is necessary to provide login and customer account functionality. Processing is additionally carried out on the basis of Art. 6(1)(f) GDPR where it serves security, abuse prevention, and the integrity of our systems.</p>
      <p>The use of the technically necessary cookie is based on Section 25(2) TDDDG.</p>
    `
  },
  {
    id: 'email-verification-password-reset',
    title: 'Email Verification and Password Reset',
    icon: KeyRound,
    summary: 'Token hashes and expiry data for account security actions.',
    body: `
      <p>For email verification, password resets, and security-relevant account actions, we process in particular:</p>
      <ul>
        <li>email address</li>
        <li>account ID</li>
        <li>verification status</li>
        <li>server-side stored token hashes</li>
        <li>token expiry times</li>
        <li>time of request and use</li>
      </ul>
      <p>Plain-text tokens are not stored permanently. They are used exclusively to securely perform the respective action, such as email verification or password reset.</p>
      <p>Processing is carried out on the basis of Art. 6(1)(b) GDPR where it is necessary to provide the customer account. Processing is additionally carried out on the basis of Art. 6(1)(f) GDPR for security and abuse prevention.</p>
    `
  },
  {
    id: 'premium-access',
    title: 'Premium Access and Digital Services',
    icon: BadgeCheck,
    summary: 'Data for purchasing, activating, and managing digital Premium access.',
    body: `
      <p>Nova Tweaks allows the purchase of digital Premium access. To provide and manage Premium access, we process in particular:</p>
      <ul>
        <li>account ID</li>
        <li>email address</li>
        <li>Premium status</li>
        <li>activation time</li>
        <li>price ID</li>
        <li>payment status</li>
        <li>payment references</li>
        <li>if applicable, expiry or revocation information</li>
      </ul>
      <p>Processing is carried out for contract performance and provision of the purchased digital access on the basis of Art. 6(1)(b) GDPR.</p>
      <p>Where payment, booking, or documentation data must be retained due to statutory obligations, processing is carried out on the basis of Art. 6(1)(c) GDPR.</p>
    `
  },
  {
    id: 'stripe-checkout',
    title: 'Payment Processing via Stripe Checkout',
    icon: Receipt,
    summary: 'Stripe processes payment and transaction data for Premium purchases.',
    body: `
      <p>We use Stripe Checkout for payment processing.</p>
      <p>The provider is:</p>
      <address>Stripe Payments Europe, Limited<br>1 Grand Canal Street Lower<br>Grand Canal Dock<br>Dublin<br>Ireland</address>
      <p>and, where applicable, companies affiliated with Stripe, to the extent they are involved in payment processing.</p>
      <p>When you purchase Premium access, you are redirected to Stripe for payment processing or Stripe Checkout is integrated into the purchase process. The actual payment processing is carried out by Stripe.</p>
      <p>Stripe may process in particular the following data:</p>
      <ul>
        <li>name and contact details, where provided during checkout</li>
        <li>email address</li>
        <li>payment data</li>
        <li>invoice and transaction data</li>
        <li>payment status</li>
        <li>technical data for fraud prevention and security</li>
      </ul>
      <p>We ourselves store only the payment references required for Premium activation and traceability, in particular:</p>
      <ul>
        <li>Checkout Session ID</li>
        <li>Payment Intent ID</li>
        <li>price ID</li>
        <li>amount</li>
        <li>currency</li>
        <li>payment status</li>
        <li>Premium activation status</li>
      </ul>
      <p>Processing is carried out on the basis of Art. 6(1)(b) GDPR to carry out the purchase and provide Premium access.</p>
      <p>Where tax or commercial retention obligations apply, processing is carried out on the basis of Art. 6(1)(c) GDPR.</p>
      <p>Where data is processed for fraud prevention, abuse prevention, or traceability, processing is carried out on the basis of Art. 6(1)(f) GDPR.</p>
      <p>Stripe may also process personal data outside the European Union or the European Economic Area. Stripe provides its own privacy information, data processing agreements, and information on international data transfers for this purpose. Depending on the specific processing, Stripe may act as a processor, an independent controller, or jointly with affiliated companies.</p>
    `
  },
  {
    id: 'device-binding-license-check',
    title: 'Device Binding and License Verification',
    icon: HardDrive,
    summary: 'Hash-based device and installation identifiers for license checks.',
    body: `
      <p>For license verification and limiting the permitted number of devices, we process a hashed installation or device identifier.</p>
      <p>This is used to assign Premium access to an installation or device, check the permitted number of devices used, and prevent license misuse.</p>
      <p>The processed data may include in particular:</p>
      <ul>
        <li>hashed installation identifier</li>
        <li>hashed device identifier</li>
        <li>account ID</li>
        <li>Premium status</li>
        <li>time of activation or last check</li>
        <li>if applicable, an earlier legacy HWID if it is still present in existing records from older versions</li>
      </ul>
      <p>We do not use this data for advertising purposes and do not use it for tracking across third-party websites.</p>
      <p>Processing is carried out on the basis of Art. 6(1)(b) GDPR where it is necessary for license and contract performance.</p>
      <p>Where processing serves to protect against misuse, multiple use contrary to the license terms, or security purposes, it is additionally carried out on the basis of Art. 6(1)(f) GDPR.</p>
    `
  },
  {
    id: 'email-contact',
    title: 'Contact by Email',
    icon: Mail,
    summary: 'Processing contact and communication data for email requests.',
    body: `
      <p>If you contact us by email, we process the data you provide to handle your request.</p>
      <p>This may include in particular:</p>
      <ul>
        <li>email address</li>
        <li>name or username</li>
        <li>message content</li>
        <li>technical information you voluntarily provide</li>
        <li>time of the request</li>
        <li>communication history</li>
      </ul>
      <p>Contact options:</p>
      <ul>
        <li><a href="mailto:support@nova-tweaks.com">support@nova-tweaks.com</a></li>
        <li><a href="mailto:contact@nova-tweaks.com">contact@nova-tweaks.com</a></li>
        <li><a href="mailto:info@nova-tweaks.com">info@nova-tweaks.com</a></li>
      </ul>
      <p>Processing is carried out on the basis of Art. 6(1)(b) GDPR if your request relates to a contract, customer account, purchase, or pre-contractual measure.</p>
      <p>In all other cases, processing is carried out on the basis of Art. 6(1)(f) GDPR. Our legitimate interest lies in effectively handling requests.</p>
      <p>Contact requests are deleted when the purpose of storage no longer applies, unless statutory retention obligations or legitimate interests in further storage exist.</p>
    `
  },
  {
    id: 'transactional-emails',
    title: 'Transactional Emails',
    icon: Mail,
    summary: 'Necessary system and account emails via STRATO.',
    body: `
      <p>We send transactional emails that are required for using our service.</p>
      <p>These include in particular:</p>
      <ul>
        <li>email verification</li>
        <li>password reset</li>
        <li>security-relevant account notifications</li>
        <li>confirmation of account deletion</li>
        <li>if applicable, notices regarding Premium activation or payment-related processes</li>
      </ul>
      <p>No newsletter is sent.</p>
      <p>We use the following provider to send transactional emails:</p>
      <address>STRATO GmbH<br>Otto-Ostrowski-Straße 7<br>10249 Berlin<br>Germany</address>
      <p>In this context, email address, subject, content of the transactional message, sending time, and technical sending data are processed in particular.</p>
      <p>Processing is carried out on the basis of Art. 6(1)(b) GDPR where the emails are necessary to provide the customer account, perform the contract, or carry out security-relevant account processes.</p>
      <p>Where processing serves security, traceability, or abuse prevention, it is carried out on the basis of Art. 6(1)(f) GDPR.</p>
      <p>We have concluded a data processing agreement with STRATO GmbH pursuant to Art. 28 GDPR.</p>
    `
  },
  {
    id: 'cookies',
    title: 'Cookies and Comparable Technologies',
    icon: Cookie,
    summary: 'Only necessary cookies, no analytics or marketing cookies.',
    body: `
      <p>Our website uses cookies and comparable technologies only to the extent necessary for operating the website, the customer account, or authentication.</p>
      <p>In particular, we use the technically necessary cookie <strong>nova_refresh_token</strong>.</p>
      <p>This cookie is required for login and session management. Without this cookie, logged-in areas and certain account functions cannot be provided reliably.</p>
      <p>We do not use analytics or marketing cookies.</p>
      <p>In particular, according to the current status, we do not use:</p>
      <ul>
        <li>Google Analytics</li>
        <li>Matomo</li>
        <li>Plausible</li>
        <li>Meta Pixel</li>
        <li>TikTok Pixel</li>
        <li>Hotjar</li>
        <li>Microsoft Clarity</li>
        <li>other tracking or advertising pixels</li>
      </ul>
      <p>The legal basis for technically necessary cookies is Section 25(2) TDDDG. The processing of personal data in connection with technically necessary cookies is carried out on the basis of Art. 6(1)(b) GDPR and Art. 6(1)(f) GDPR.</p>
    `
  },
  {
    id: 'local-fonts',
    title: 'Local Fonts',
    icon: FileText,
    summary: 'Locally available system fonts without connections to Google Fonts servers.',
    body: `
      <p>We use locally available system fonts for the uniform display of our website.</p>
      <p>No fonts are loaded from external servers such as Google Fonts. Therefore, no connection to Google servers is established when the fonts are loaded.</p>
      <p>If external fonts or other external services are integrated in the future, this Privacy Policy will be updated accordingly and, where required, consent will be obtained.</p>
    `
  },
  {
    id: 'no-tracking-tools',
    title: 'No Analytics, Marketing, or Social Media Tracking Tools',
    icon: Lock,
    summary: 'No tracking, no social plugins, and no advertising pixels.',
    body: `
      <p>We currently do not use analytics or marketing tools.</p>
      <p>In particular, the following services are not used:</p>
      <ul>
        <li>Google Analytics</li>
        <li>Matomo</li>
        <li>Plausible</li>
        <li>Meta Pixel</li>
        <li>TikTok Pixel</li>
        <li>Hotjar</li>
        <li>Microsoft Clarity</li>
        <li>Google Ads Conversion Tracking</li>
        <li>affiliate tracking</li>
      </ul>
      <p>We also do not use social media plugins, Like buttons, or embedded social media feeds.</p>
      <p>If we link to external platforms such as Discord, these are only normal links. Merely visiting our website does not transfer data to Discord. Only when you actively click the link do you leave our website, and the privacy policies of the respective provider apply.</p>
    `
  },
  {
    id: 'no-external-embeds',
    title: 'No External Embeds',
    icon: Globe2,
    summary: 'No embeds from YouTube, Maps, Spotify, Twitch, or social feeds.',
    body: `
      <p>We currently do not use external embeds such as:</p>
      <ul>
        <li>YouTube</li>
        <li>Vimeo</li>
        <li>Google Maps</li>
        <li>Spotify</li>
        <li>Twitch</li>
        <li>social media feeds</li>
      </ul>
      <p>If such services are integrated in the future, this Privacy Policy will be updated accordingly and, where required, consent will be obtained.</p>
    `
  },
  {
    id: 'admin-audit-logs',
    title: 'Admin Audit Logs',
    icon: ShieldCheck,
    summary: 'Administrative actions may be logged for security and traceability.',
    body: `
      <p>Administrative actions may be logged for security, traceability, and abuse prevention.</p>
      <p>The following data may be processed in particular:</p>
      <ul>
        <li>admin account ID</li>
        <li>performed action</li>
        <li>affected record</li>
        <li>time of the action</li>
        <li>technical context data</li>
        <li>if applicable, hashed IP address or hashed user agent</li>
      </ul>
      <p>Processing is carried out on the basis of Art. 6(1)(f) GDPR. Our legitimate interest lies in the security, integrity, and traceability of administrative processes.</p>
      <p>Admin Audit Logs are generally stored for <strong>180 days</strong>, unless longer storage is necessary in an individual case to investigate an abuse case, enforce legal claims, or comply with statutory obligations.</p>
    `
  },
  {
    id: 'backups',
    title: 'Backups',
    icon: Database,
    summary: 'Backups for recovery, availability, and technical stability.',
    body: `
      <p>Backups may be created to secure our systems and data.</p>
      <p>Backups may contain personal data that is also processed in our production systems, in particular account data, payment references, license data, or log data.</p>
      <p>Backups serve data security, recovery, and the technical stability of our services.</p>
      <p>Processing is carried out on the basis of Art. 6(1)(f) GDPR. Our legitimate interest lies in ensuring the availability, integrity, and recoverability of our systems.</p>
      <p>Deleted data may still be present in backups for a limited period. Deleted backups are generally removed or overwritten within <strong>30 days</strong>, unless longer storage is necessary for technical, statutory, or security-relevant reasons.</p>
    `
  },
  {
    id: 'storage-duration',
    title: 'Storage Duration',
    icon: Clock3,
    summary: 'Storage only as long as required by purpose, contract, security, or law.',
    body: `
      <p>We store personal data only for as long as necessary for the respective purpose or as long as statutory retention obligations apply.</p>
      <p>Unless this Privacy Policy specifies a more specific storage period, the following periods apply in particular:</p>
      <ul>
        <li>account data: until account deletion</li>
        <li>password reset and verification tokens: until expiry or use, followed by cleanup</li>
        <li>refresh sessions: until expiry, revocation, or logout, followed by cleanup</li>
        <li>security events: generally 90 days</li>
        <li>Admin Audit Logs: generally 180 days</li>
        <li>deleted backups: generally within 30 days</li>
        <li>contact requests: until final processing, unless statutory obligations prevent deletion</li>
        <li>payment and Premium references: as long as required for contract performance, documentation, abuse prevention, or statutory obligations</li>
        <li>tax or commercial law relevant data: according to statutory retention obligations</li>
      </ul>
      <p>If you request deletion of your data, we will delete your personal data unless statutory retention obligations, contractual requirements, or legitimate reasons for further storage apply.</p>
    `
  },
  {
    id: 'recipients',
    title: 'Recipients of Personal Data',
    icon: Globe2,
    summary: 'Disclosure only to necessary service providers or legally required recipients.',
    body: `
      <p>As part of our business activities, personal data may be transferred to external service providers and recipients to the extent necessary for the respective purposes.</p>
      <p>Recipients may include in particular:</p>
      <ul>
        <li>hosting providers</li>
        <li>payment service providers</li>
        <li>email or SMTP providers</li>
        <li>IT service providers</li>
        <li>tax advisors or authorities, where legally required</li>
      </ul>
      <p>Disclosure takes place only where there is a legal basis, in particular for contract performance, due to statutory obligations, due to legitimate interests, or on the basis of a data processing agreement.</p>
    `
  },
  {
    id: 'data-processing-agreements',
    title: 'Data Processing Agreements',
    icon: FileText,
    summary: 'Processing agreements pursuant to Art. 28 GDPR for commissioned providers.',
    body: `
      <p>We use service providers that may process personal data on our behalf.</p>
      <p>Where required, we conclude data processing agreements with these service providers pursuant to Art. 28 GDPR.</p>
      <p>This applies in particular to:</p>
      <ul>
        <li>hosting providers</li>
        <li>email or SMTP providers</li>
        <li>if applicable, technical service providers</li>
      </ul>
      <p>For payment service providers such as Stripe, depending on the specific processing, there may be processing on behalf of the controller, independent controllership, or a mixed data protection role. The provider's respective contractual documents and privacy information are decisive.</p>
    `
  },
  {
    id: 'third-country-transfers',
    title: 'Data Transfers to Third Countries',
    icon: Globe2,
    summary: 'International transfers only with an appropriate legal basis.',
    body: `
      <p>Processing of personal data outside the European Union or the European Economic Area cannot be fully ruled out, in particular in the case of payment service providers or their affiliated companies.</p>
      <p>Where personal data is transferred to third countries, this takes place only if there is an appropriate legal basis, for example:</p>
      <ul>
        <li>an adequacy decision by the European Commission</li>
        <li>certification under the EU-U.S. Data Privacy Framework</li>
        <li>standard contractual clauses of the European Commission</li>
        <li>explicit consent</li>
        <li>necessity for contract performance</li>
      </ul>
      <p>Details can be found in the privacy information and contractual documents of the respective provider.</p>
    `
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    icon: Scale,
    summary: 'Access, rectification, erasure, restriction, portability, withdrawal, objection, and complaint.',
    body: `
      <p>Under the applicable statutory provisions, you have the following rights:</p>
      <ul>
        <li>right of access to the personal data stored by us</li>
        <li>right to rectification of inaccurate data</li>
        <li>right to erasure of personal data</li>
        <li>right to restriction of processing</li>
        <li>right to data portability</li>
        <li>right to withdraw consent granted</li>
        <li>right to object to certain processing</li>
        <li>right to lodge a complaint with a data protection supervisory authority</li>
      </ul>
      <p>If you would like to exercise your rights, you can contact us at any time at <a href="mailto:info@nova-tweaks.com">info@nova-tweaks.com</a>.</p>
    `
  },
  {
    id: 'withdrawal-of-consent',
    title: 'Withdrawal of Consent',
    icon: Scale,
    summary: 'Consent can be withdrawn at any time with effect for the future.',
    body: `
      <p>If processing is based on your consent, you may withdraw this consent at any time with effect for the future.</p>
      <p>The lawfulness of processing carried out before withdrawal remains unaffected.</p>
    `
  },
  {
    id: 'right-to-object',
    title: 'Right to Object under Art. 21 GDPR',
    icon: Scale,
    summary: 'Objection to processing based on legitimate interests and direct advertising.',
    body: `
      <p>If we process personal data on the basis of Art. 6(1)(f) GDPR, you have the right to object to this processing at any time on grounds relating to your particular situation.</p>
      <p>We will then no longer process the affected personal data unless we can demonstrate compelling legitimate grounds for processing that override your interests, rights, and freedoms, or the processing serves the establishment, exercise, or defense of legal claims.</p>
      <p>If personal data is processed for direct advertising purposes, you have the right to object at any time to processing for such advertising purposes.</p>
      <p>We currently do not send newsletters and do not carry out promotional direct contact by newsletter.</p>
    `
  },
  {
    id: 'ssl-tls',
    title: 'SSL/TLS Encryption',
    icon: Lock,
    summary: 'Website and API use HTTPS and SSL/TLS encryption.',
    body: `
      <p>Our website and API use HTTPS and SSL/TLS encryption.</p>
      <p>You can recognize an encrypted connection by the browser address bar beginning with "https://" and by the lock symbol being displayed.</p>
      <p>When SSL/TLS encryption is enabled, data you transmit to us cannot easily be read by third parties.</p>
    `
  },
  {
    id: 'advertising-emails',
    title: 'Objection to Advertising Emails',
    icon: Mail,
    summary: 'No use of published contact details for unsolicited advertising.',
    body: `
      <p>The use of contact details published as part of the imprint obligation or this Privacy Policy for sending advertising that has not been expressly requested is objected to.</p>
      <p>We reserve the right to take legal action in the event of unsolicited advertising information being sent, for example by spam emails.</p>
    `
  },
  {
    id: 'changes',
    title: 'Changes to This Privacy Policy',
    icon: FileText,
    summary: 'This Privacy Policy may be updated when services, providers, or legal requirements change.',
    body: `
      <p>We may update this Privacy Policy if our website, our services, providers used, or legal requirements change.</p>
      <p>The current version is available on our website.</p>
    `
  }
];

const quickFacts = [
  { icon: Cookie, label: 'Cookies', value: 'necessary only' },
  { icon: Lock, label: 'Tracking', value: 'no analytics tools' },
  { icon: Server, label: 'Hosting', value: 'Hetzner, Germany' },
  { icon: Receipt, label: 'Payment', value: 'Stripe Checkout' }
];

function PrivacyPolicyPage() {
  return (
    <main className="privacy-page">
      <section className="privacy-hero">
        <div className="section-inner privacy-hero-inner">
          <div className="privacy-hero-copy">
            <span className="eyebrow"><ShieldCheck size={14} />Privacy</span>
            <h1>Privacy Policy</h1>
            <p>
              Transparent, complete, and readable: this page explains which data Nova Tweaks processes,
              what it is used for, and which rights you have.
            </p>
            <div className="privacy-hero-meta">
              <span><BadgeCheck size={15} />GDPR</span>
              <span><Clock3 size={15} />Last updated: June 2, 2026</span>
              <span><Mail size={15} />info@nova-tweaks.com</span>
            </div>
          </div>

          <div className="privacy-hero-card" aria-label="Nova Tweaks privacy status">
            <img src={APP_LOGO_SRC} alt="" />
            <div>
              <span>Nova Tweaks</span>
              <strong>Privacy-first defaults</strong>
            </div>
            <p>No analytics cookies, no advertising pixels, and no external embeds according to the current status.</p>
          </div>
        </div>
      </section>

      <section className="privacy-overview" aria-label="Privacy quick overview">
        <div className="section-inner privacy-fact-grid">
          {quickFacts.map(({ icon: Icon, label, value }) => (
            <article className="privacy-fact" key={label}>
              <Icon size={20} />
              <span>{label}</span>
              <strong>{value}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="privacy-content-section">
        <div className="section-inner privacy-layout">
          <aside className="privacy-toc" aria-label="Table of contents">
            <div className="privacy-toc-card">
              <span className="privacy-toc-title">Contents</span>
              {privacySections.map((section, index) => (
                <a href={`#${section.id}`} key={section.id}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </a>
              ))}
            </div>
          </aside>

          <div className="privacy-policy">
            {privacySections.map(({ id, title, icon: Icon, summary, body }, index) => (
              <section className="privacy-article-section" id={id} key={id}>
                <div className="privacy-section-head">
                  <span className="privacy-section-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="privacy-section-icon"><Icon size={18} /></span>
                  <div>
                    <h2>{title}</h2>
                    <p>{summary}</p>
                  </div>
                </div>
                <div className="privacy-section-body" dangerouslySetInnerHTML={{ __html: body }} />
              </section>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default PrivacyPolicyPage;
