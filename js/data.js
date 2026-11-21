/* Content for the Phishing Awareness module.
 * All brands, addresses and people in simulations are FICTIONAL.
 * Real cases are summarised from public reporting and labelled as such.
 * Loaded in the browser (window.PHISH_DATA) and in Node for tests (module.exports).
 */
const PHISH_DATA = {
  emails: [
    {
      id: "bank",
      title: "Email 1: “Account suspended”",
      intro: "A message arrives that claims to be from your bank (the fictional Pearl Bank, whose real website is pearlbank.co.ug). Tap every red flag you can find.",
      headers: [
        { label: "From", parts: [
          "Pearl Bank Security <",
          { t: "support@pearlbank-secure-alerts.com", f: "domain" },
          ">"
        ] },
        { label: "Subject", parts: [
          { t: "URGENT!!! Your account will be suspended in 24 hours", f: "subject" }
        ] }
      ],
      body: [
        [{ t: "Dear Valued Customer,", f: "greeting" }],
        ["We have noticed unusual activity and your ", { t: "accont has been temporarly limited", f: "spelling" }, "."],
        [{ t: "Failure to verify within 24 hours will lead to permanent closure of your account.", f: "threat" }],
        ["Click here to restore access: ", { t: "[ Verify My Account Now ] → http://pearlbank-verify-login.com/secure", f: "link" }],
        ["For your protection, also ", { t: "reply to this email with your PIN and the one-time code we send you.", f: "secrets" }],
        ["Attachment: ", { t: "Verification_Form.pdf.exe", f: "attachment" }]
      ],
      flags: {
        domain: { title: "Look-alike sender domain", why: "The real bank uses pearlbank.co.ug. Anyone can type “Pearl Bank Security” as the display name, so always check the actual address behind it." },
        subject: { title: "Urgency and alarm in the subject", why: "Scare tactics and a countdown push you to act before you think. Real banks rarely threaten suspension by email." },
        greeting: { title: "Generic greeting", why: "A bank that knows your account would normally use your name. “Dear Customer” suggests a bulk message." },
        spelling: { title: "Spelling mistakes", why: "Errors like “accont” and “temporarly” are common in bulk phishing. They are a clue, but not proof, because good phishing can be perfectly written." },
        threat: { title: "Threat of loss", why: "Fear of losing money or access is a classic pressure lever. Slow down and contact the bank through its official app or number." },
        link: { title: "Suspicious link", why: "The destination is a different domain from the bank’s and uses http, not https. Never log in through links in messages; type the address or use the official app." },
        secrets: { title: "Asks for PIN and one-time code", why: "No legitimate bank asks for your PIN or OTP by email, phone or SMS. Anyone who asks for them is trying to take over your account." },
        attachment: { title: "Dangerous attachment", why: "A “.pdf.exe” file is a program disguised as a document. Unexpected attachments, especially with double extensions, should never be opened." }
      }
    },
    {
      id: "it",
      title: "Email 2: “Password expires today”",
      intro: "This message claims to come from your company’s IT team (the fictional Acme Ltd, whose real domain is acme.com). Find the red flags.",
      headers: [
        { label: "From", parts: [
          "Acme IT Helpdesk <",
          { t: "helpdesk@acme-corp-helpdesk.com", f: "domain" },
          ">"
        ] },
        { label: "Subject", parts: ["Action required: password expiry notice"] }
      ],
      body: [
        ["Hi team,"],
        [{ t: "Your password expires today at 5:00 PM.", f: "deadline" }, " To keep access to your email and files, sign in below."],
        [{ t: "https://acme.com.password-renew.net/login", f: "link" }],
        [{ t: "This is confidential. Please do not discuss or forward this message to anyone.", f: "secrecy" }],
        [{ t: "Acme IT Helpdesk", f: "signature" }]
      ],
      flags: {
        domain: { title: "Look-alike sender domain", why: "The company’s real domain is acme.com. “acme-corp-helpdesk.com” is a different domain that anyone could register." },
        deadline: { title: "Artificial deadline", why: "A same-day deadline is designed to rush you. Real IT teams give notice and tell you how to check through official channels." },
        link: { title: "Domain hidden at the end of the link", why: "Read the address from the first single slash backwards. The real domain here is password-renew.net. “acme.com” is only a subdomain placed in front to fool you." },
        secrecy: { title: "Secrecy request", why: "Attackers ask you not to tell anyone so nobody can warn you. Real security notices can be shared and verified." },
        signature: { title: "Vague signature", why: "No name, phone number or ticket reference. A legitimate helpdesk message normally has contact details you can check independently." }
      }
    }
  ],

  urlGame: [
    { url: "https://login.pearlbank.co.ug/signin", legit: true, why: "The registered domain is pearlbank.co.ug. “login” is just a subdomain that the real owner controls." },
    { url: "https://pearlbank.co.ug.account-verify.xyz/login", legit: false, why: "Read from the first single slash backwards: the real domain is account-verify.xyz. “pearlbank.co.ug” is only decoration at the front." },
    { url: "https://pearlbank-co-ug.com/secure", legit: false, why: "Hyphens in place of dots create a completely different domain that imitates the bank." },
    { url: "https://www.pearlbank.co.ug/help/contact", legit: true, why: "Correct domain, HTTPS, and a normal help page path." },
    { url: "https://pear1bank.co.ug/login", legit: false, why: "The digit 1 replaces the letter l. Look-alike characters are a common trick, so read domains slowly." },
    { url: "https://bit.ly/pearl-login", legit: false, why: "A shortened link hides its destination. Never sign in through one. Type the bank’s address or use its app." },
    { url: "https://pearlbank.co.ug@secure-login.xyz", legit: false, why: "Everything before the @ is treated as a username. The browser actually goes to secure-login.xyz." },
    { url: "https://pearlbank.co.ug/personal/loans", legit: true, why: "Correct domain and a normal page path. Always still check the domain before entering any details." }
  ],

  tactics: [
    { id: "phishing", title: "Phishing", channel: "Email", levers: ["Urgency", "Fear", "Authority"],
      what: "Mass emails that imitate banks, delivery firms or employers to steal logins, money or to install malware.",
      example: "“Your parcel is on hold. Pay a small customs fee to release it.” The link leads to a fake payment page.",
      defence: "Check the sender’s real address, never use links in the message, and go to the company’s site or app yourself." },
    { id: "spear", title: "Spear phishing and whaling", channel: "Email", levers: ["Trust", "Authority"],
      what: "Targeted messages built from personal or company details. Whaling goes after executives and finance staff.",
      example: "An email naming your manager and a real project asks you to review a “shared document” that needs your password.",
      defence: "Be careful about what you post publicly, and confirm unusual requests by calling the person on a number you already have." },
    { id: "smishing", title: "Smishing", channel: "SMS and chat apps", levers: ["Urgency", "Greed"],
      what: "Phishing by text message or messaging app, often with a short link.",
      example: "“Your mobile money wallet will be blocked. Confirm your details here.”",
      defence: "Do not tap links in unexpected texts. Open the official app or dial the provider’s official number." },
    { id: "vishing", title: "Vishing", channel: "Phone call", levers: ["Authority", "Fear", "Urgency"],
      what: "Phone calls from someone pretending to be a bank, telecom, police officer or IT support.",
      example: "A caller says there is fraud on your account and asks for the code you just received to “cancel” it.",
      defence: "Hang up and call back using the number on your card or the official website. Never read out OTPs or PINs." },
    { id: "pretexting", title: "Pretexting", channel: "Any", levers: ["Trust", "Helpfulness"],
      what: "The attacker invents a believable story (new employee, auditor, supplier) to get information or access.",
      example: "“Hi, I’m from the auditors. I need the staff payroll list before the meeting.”",
      defence: "Verify identity through a separate, known channel before sharing anything, whatever the story is." },
    { id: "baiting", title: "Baiting", channel: "Physical or online", levers: ["Curiosity", "Greed"],
      what: "Leaving something tempting, such as an infected USB drive or a “free” download, for the victim to pick up.",
      example: "A USB drive labelled “Salary 2026” left in a car park.",
      defence: "Never plug in unknown devices. Hand them to IT or security." },
    { id: "tailgating", title: "Tailgating", channel: "In person", levers: ["Helpfulness", "Trust"],
      what: "Following an authorised person into a restricted area, often by looking friendly and carrying boxes.",
      example: "Someone with full hands asks you to hold the door to the server room.",
      defence: "Politely ask visitors to badge in or sign in at reception, and tell security if you are unsure." },
    { id: "bec", title: "Business email compromise (BEC)", channel: "Email", levers: ["Authority", "Urgency"],
      what: "Impersonating an executive or supplier to trick staff into paying a fake invoice or changing bank details.",
      example: "“I’m in a meeting and cannot talk. Please wire the payment today and keep this between us.”",
      defence: "Use call-back verification and dual approval for payments and any change of bank details." },
    { id: "mfa", title: "MFA fatigue (push bombing)", channel: "App notifications", levers: ["Fear", "Urgency"],
      what: "After stealing a password, the attacker triggers sign-in prompts again and again, hoping you approve one to make them stop.",
      example: "Fifteen “Approve sign-in?” prompts at midnight, followed by a message from “IT” asking you to accept.",
      defence: "Deny every prompt you did not start, then change your password and report it. Prefer passkeys or security keys." },
    { id: "quishing", title: "Quishing (QR code phishing)", channel: "QR codes", levers: ["Curiosity", "Urgency"],
      what: "Malicious QR codes in emails, posters or stickers that lead to fake login or payment pages.",
      example: "A sticker on a parking meter or a poster that says “Scan to pay”.",
      defence: "Treat QR codes like links. Check the address your phone shows before you open it, and avoid codes pasted over others." }
  ],

  levers: [
    { name: "Authority", text: "“I’m the CEO / bank / police.” We obey people who seem to be in charge." },
    { name: "Urgency", text: "“Within 24 hours.” Pressure leaves no time to think or verify." },
    { name: "Fear", text: "“Your account will be closed.” Fear shuts down careful thinking." },
    { name: "Curiosity", text: "A mystery attachment or lost USB drive begs to be opened." },
    { name: "Greed", text: "Prizes, refunds and bonuses that seem too good to be true." },
    { name: "Trust", text: "Familiar names, logos and colleagues lower our guard." },
    { name: "Helpfulness", text: "Most of us want to help someone who sounds stuck." }
  ],

  practices: {
    everyday: [
      { id: "e1", text: "Do not click links or open attachments you did not expect. Type the address or use the official app instead." },
      { id: "e2", text: "Check the sender’s real address and where a link actually goes before you act." },
      { id: "e3", text: "Verify requests for money, passwords or codes through a second, known channel (call back on a number you already have)." },
      { id: "e4", text: "Never share OTPs, PINs or passwords with anyone, including “bank staff” or “support”." },
      { id: "e5", text: "Turn on multi-factor authentication everywhere. Prefer authenticator apps, passkeys or security keys over SMS codes." },
      { id: "e6", text: "Use a password manager and a unique password for every account. It will not autofill on look-alike sites." },
      { id: "e7", text: "Keep your phone, computer, browser and apps up to date." },
      { id: "e8", text: "Think before oversharing job details, phone numbers and routines on public profiles." },
      { id: "e9", text: "Treat QR codes and shortened links like any other unknown link." }
    ],
    teams: [
      { id: "t1", text: "Make reporting easy and blame-free: one button or one address for suspicious messages." },
      { id: "t2", text: "Require call-back verification and two approvers for payments and bank-detail changes." },
      { id: "t3", text: "Set up SPF, DKIM and DMARC on your email domain to make spoofing harder." },
      { id: "t4", text: "Run short, regular awareness sessions and phishing simulations, and share the lessons." },
      { id: "t5", text: "Enforce multi-factor authentication and least-privilege access, especially for admins." },
      { id: "t6", text: "Control physical access: badges, visitor sign-in and a habit of challenging unknown people." }
    ],
    ifClicked: [
      "Stay calm and stop. Do not enter anything else. If you opened an attachment, disconnect the device from Wi-Fi and mobile data.",
      "From a different, trusted device, change the password of the affected account, and of any other account that uses the same password.",
      "Turn on or reset multi-factor authentication and sign out of all other sessions.",
      "Tell your IT or security team straight away. If money or mobile money is involved, contact your bank or provider immediately.",
      "Run a malware scan, and watch your accounts and statements for strange activity over the following weeks.",
      "Report the phishing attempt. In Uganda you can contact CERT.UG (cert.ug) and your service provider. Warn colleagues and friends so they do not fall for the same message."
    ]
  },

  cases: [
    { id: "rsa", year: 2011, title: "RSA SecurID breach", type: "Spear phishing",
      what: "Small groups of employees at security firm RSA received emails titled “2011 Recruitment plan” with an attached spreadsheet. Opening it exploited a flaw in Adobe Flash and gave attackers a foothold in the network.",
      impact: "Attackers stole information about the company’s SecurID authentication products, a serious blow for a security vendor.",
      lesson: "Even security professionals get targeted. Treat unexpected attachments with suspicion, keep software patched, and limit what one compromised machine can reach." },
    { id: "target", year: 2013, title: "Target payment-card breach", type: "Supplier compromise",
      what: "Investigators reported that attackers first compromised a heating and cooling contractor that worked with the retailer, then used the vendor’s network credentials to get into Target’s systems.",
      impact: "Around 40 million payment cards and tens of millions of customer records were exposed, according to Target’s own announcements.",
      lesson: "Your security depends on your suppliers too. Give outside vendors only the access they need and monitor it." },
    { id: "invoice", year: 2015, title: "Fake-invoice fraud against two tech giants", type: "Business email compromise",
      what: "A fraudster impersonated a real hardware supplier and sent convincing invoices, emails and contracts to staff at large US technology companies, which were later reported to be Google and Facebook.",
      impact: "The companies paid out more than 100 million US dollars in total. Most of it was recovered, and the man behind it pleaded guilty to wire fraud in 2019.",
      lesson: "Large companies fall for payment fraud too. Verify changes of bank details by calling a known contact, and require a second approver." },
    { id: "dnc", year: 2016, title: "Hack of a presidential campaign chairman’s email", type: "Credential phishing",
      what: "A campaign chairman received a spoofed “security alert” that urged him to change his password. The link, shortened to hide its destination, led to a fake Google sign-in page.",
      impact: "His email account was taken over and thousands of messages were later published online.",
      lesson: "Fake security alerts are a favourite trick. Do not use the link in the alert; go to the account yourself, and use hardware security keys where possible." },
    { id: "twitter", year: 2020, title: "Twitter employee phone phishing", type: "Vishing",
      what: "Attackers phoned Twitter employees pretending to be internal IT staff and directed them to a fake VPN login page, collecting their credentials.",
      impact: "High-profile accounts were taken over to promote a cryptocurrency scam, and the company’s internal tools were abused.",
      lesson: "Voice calls can be spoofed, and attackers will research staff first. Verify callers through an internal channel and protect admin tools with phishing-resistant MFA." },
    { id: "uber", year: 2022, title: "Uber breach via MFA fatigue", type: "MFA fatigue and pretexting",
      what: "An attacker with a contractor’s stolen password kept sending sign-in approval requests, then messaged the contractor on WhatsApp posing as Uber IT and told them to accept.",
      impact: "The contractor accepted, and the attacker gained access to internal systems and tools.",
      lesson: "Never approve a prompt you did not trigger, and report repeated prompts at once. Number-matching and security keys reduce this risk." }
  ],

  quizCategories: ["Email", "Websites", "Social engineering", "Best practices"],

  quiz: [
    { q: "An email from “IT Support” says your password expires in two hours and tells you to click a link to keep your account. What is the best response?",
      options: [
        "Click the link quickly so you are not locked out.",
        "Reply with your current password so IT can reset it.",
        "Do not use the link. Contact IT through a known channel such as the helpdesk number or the company portal.",
        "Forward the email to all your colleagues as a warning."
      ], answer: 2, category: "Email",
      explain: "Urgency plus a link is the classic pattern. Verify through a channel you already trust. Report the message instead of forwarding it around." },
    { q: "Which address is most likely the real login page of the bank whose website is pearlbank.co.ug?",
      options: [
        "https://pearlbank.co.ug.secure-login.xyz",
        "https://login.pearlbank.co.ug",
        "https://pearlbank-co-ug.com",
        "http://pearlbank.verify-account.net"
      ], answer: 1, category: "Websites",
      explain: "Read from the first single slash backwards. Only login.pearlbank.co.ug belongs to pearlbank.co.ug. In the others, the real owner is a different domain." },
    { q: "A website shows a padlock and https. What does this tell you?",
      options: [
        "The website is definitely genuine.",
        "The connection is encrypted, but the site could still be malicious.",
        "The government has approved the website.",
        "Your device cannot get a virus from this site."
      ], answer: 1, category: "Websites",
      explain: "HTTPS protects data in transit. Many phishing sites also use it, so it is not a sign of trust. Check the domain." },
    { q: "A caller says they are from your bank’s fraud team and asks you to read out the code you have just received by SMS to “cancel a suspicious transaction”. What should you do?",
      options: [
        "Read the code so the fraud is stopped.",
        "Ask them to confirm your account number first, then read it.",
        "Hang up and call the bank back on its official number.",
        "Send the code by chat instead of reading it out."
      ], answer: 2, category: "Social engineering",
      explain: "Banks never need your one-time code. That code is what lets the attacker approve a transaction or log in as you. Call back using the number on your card or the official site." },
    { q: "What makes spear phishing different from ordinary phishing?",
      options: [
        "It is sent to millions of random people.",
        "It only uses SMS.",
        "It is aimed at a specific person or group using personal or company details.",
        "It always contains an attachment."
      ], answer: 2, category: "Email",
      explain: "Spear phishing is tailored to the victim, which makes it more convincing and harder to spot." },
    { q: "You hover over a link in an email. The text says “www.pearlbank.co.ug” but the preview shows a very different address. What does this most likely mean?",
      options: [
        "A harmless display glitch.",
        "The link is probably deceptive, so do not click it.",
        "The bank uses several domains.",
        "Your browser is out of date."
      ], answer: 1, category: "Email",
      explain: "Link text can say anything. The real destination is what matters. On a phone, press and hold the link to preview it, or just do not use it." },
    { q: "You find a USB drive labelled “Salary 2026” in the car park. What should you do?",
      options: [
        "Plug it into your computer to find the owner.",
        "Plug it into an old computer instead.",
        "Do not plug it in. Hand it to IT or security.",
        "Take it home and scan it later."
      ], answer: 2, category: "Social engineering",
      explain: "This is baiting. Curiosity is the lever, and a USB drive can install malware as soon as it is connected." },
    { q: "Your CEO emails from a personal Gmail address. They are “in a meeting”, need an urgent payment sent to a new account, and ask you to keep it quiet. What is the right move?",
      options: [
        "Make the payment, since it is the CEO.",
        "Reply to the email and ask for confirmation.",
        "Verify by phoning the CEO on a known number and follow your payment-approval process.",
        "Ask a colleague to make the payment instead."
      ], answer: 2, category: "Social engineering",
      explain: "Authority, urgency and secrecy together are the hallmarks of business email compromise. Replying to the same email just reaches the attacker. Verify on a separate channel." },
    { q: "You clicked a link and typed your password into a page that now looks suspicious. What is the best first step?",
      options: [
        "Do nothing and hope for the best.",
        "Delete the email and forget about it.",
        "Change the password from a trusted device straight away, and tell IT or your provider.",
        "Restart your computer."
      ], answer: 2, category: "Best practices",
      explain: "Speed matters. Change the password (and any reused ones), enable MFA, sign out other sessions and report it. Deleting the email does not undo the exposure." },
    { q: "Which single step best protects your account if a phisher gets your password?",
      options: [
        "A slightly longer password.",
        "Antivirus software.",
        "Multi-factor authentication, ideally with an authenticator app, passkey or security key.",
        "Using a VPN."
      ], answer: 2, category: "Best practices",
      explain: "MFA means a stolen password alone is not enough. Passkeys and security keys resist phishing best. Never approve a prompt you did not start, because attackers try to wear people down with repeated requests." }
  ]
};

if (typeof window !== "undefined") {
  window.PHISH_DATA = PHISH_DATA; // top-level const is not a window property in browsers
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = PHISH_DATA;
}
