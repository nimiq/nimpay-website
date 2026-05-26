<script setup lang="ts">
definePageMeta({ layout: false })

useHead({
  title: 'Privacy Policy — Nimiq Pay',
  style: [
    {
      // Strip app.vue theme + UnoCSS preflight so this page renders with pure
      // user-agent defaults (matches original /privacy-policy). Auto-removed on leave.
      innerHTML: [
        'html,body,#__nuxt{background:#fff!important;color:#000!important;color-scheme:light!important;font-family:"Times New Roman",Times,serif!important}',
        '.privacy-ua,.privacy-ua *{all:revert}',
        '.privacy-ua,.privacy-ua *{font-family:"Times New Roman",Times,serif}',
        '.privacy-ua{padding:0 24px;max-width:960px;margin:0 auto}',
        '@media(min-width:768px){.privacy-ua{padding:0 48px}}',
        '.privacy-ua code{font-family:monospace}',
      ].join(''),
    },
  ],
})
</script>

<template>
  <div class="privacy-ua">
    <h1>Welcome to Nimiq Pay</h1>
    <p>Provided by Nimiq Network Ltd. ("we," "us," "our," or the "Company").</p>
    <p>Safeguarding the privacy and safety of our users is of paramount importance to us. This Privacy Policy elucidates our practices regarding the collection, use, and protection of personal data through the Nimiq Pay App. We are committed to adhering to stringent data protection laws, including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA)/California Privacy Rights Act (CPRA), Personal Information Protection and Electronic Documents Act (PIPEDA), and others, ensuring the highest standard of privacy and security.</p>

    <h2>Personal Data We Collect</h2>
    <ul>
      <li>Account Information: This includes your name, email, and password. We recommend using strong, unique passwords for added security.</li>
      <li>Payment Information: We collect billing addresses, phone numbers, and payment methods for secure transactions. Payment information is encrypted and processed through trusted payment gateways.</li>
      <li>Records and Financial Information: Such as, bank account and routing numbers, credit and debit card information, amount you send or request, other financial information.</li>
      <li>Usage Data: Information about your interactions with our app and services is anonymized whenever possible to protect your identity.</li>
      <li>Communication Data: Messages, feedback, and inquiries shared with us are treated with the utmost confidentiality.</li>
    </ul>
    <p>We obtain this data directly from you, through automated technologies, and from third-party sources when necessary.</p>

    <h3>We may collect Personal Information to:</h3>
    <ul>
      <li>Provide our Services</li>
      <p>This encompasses facilitating your transactions, whether it be sending, receiving, or requesting money, initiating payments, adding funds to your account, settling bills, managing purchases, displaying your profile, and presenting your account and payment details. It also involves executing transactions, verifying your identity and contact details, authenticating your account or profile access, and ensuring the accuracy and currency of your financial information.</p>
      <li>Enhance and Optimize Our Services</li>
      <p>This involves ongoing efforts to develop innovative products and features, conduct customer analysis, administer our services, and conduct internal operations such as troubleshooting, data analysis, testing, research, and statistical analysis. These activities are geared towards improving the overall functionality, efficiency, and user experience of our services.</p>
      <li>Promote Our Services</li>
      <p>
        We may utilize Personal Information to promote and market our services, which may include collaborating with partners to offer similar services and promoting our partnerships and affiliated merchants. The use of Personal Information is intended to enhance our understanding of your interests, allowing us to tailor our promotional efforts to better suit your preferences. We will NOT share, sell or use your Personal Information for any purposes beyond improving or enhancing the App experience. We do not sell Personal Information to third parties for money or share your personal information for cross context behavioral advertising, including any sensitive personal information.
        <br>
        However, we will disclose your Personal Information with third parties to help us provide services, protect our customers from risk and fraud, market our products, and comply with legal obligations.
      </p>
      <li>Communicate with you</li>
      <p>We may contact you when you need us, such as answering a question you sent to our customer service team.</p>
      <li>Comply with Laws</li>
      <p>To comply with applicable laws and rules and enforce our agreements with you and other people who use our services.</p>
      <li>Process information about your contacts</li>
      <p>To make it easy for you to find and connect them, improve payment accuracy and suggest connections with people you may know.</p>
      <li>Establish a Linked Account</li>
      <p>This involves connecting your account with a third-party account or platform, such as a social media account or a financial institution, particularly in the context of your involvement in open banking.</p>
    </ul>

    <h2>What are Cookies?</h2>
    <p>
      Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and enhance your user experience. Cookies can also provide information to website owners about how users interact with their websites.
      <br><br>
      Cookies are utilized for optimal functionality and user experience. They assist in remembering preferences and tracking app usage. Users have the option to manage cookie settings through their browser.
    </p>

    <h3>Types of Cookies We Use</h3>
    <p>We use the following types of cookies:</p>
    <ul>
      <li>Essential Cookies</li>
      <p>These cookies are necessary for the website to function properly. They enable you to navigate our website and use its features.</p>
      <li>Analytical/Performance Cookies</li>
      <p>These cookies allow us to recognize and count the number of visitors to our website and understand how visitors move around. This helps us improve the way our website works.</p>
      <li>Functionality Cookies</li>
      <p>These cookies enhance your experience by remembering choices you make, such as your language preferences.</p>
      <li>Targeting/Advertising Cookies</li>
      <p>These cookies are used to deliver advertisements relevant to you. They also limit the number of times you see an ad and help measure the effectiveness of advertising campaigns.</p>
    </ul>

    <h2>Third-Party Cookies</h2>
    <p>We may use third-party services that may set cookies on our behalf to provide certain features or functionalities. These third parties may include analytics services, advertising networks, and social media platforms. Please note that we do not have control over these third-party cookies.</p>

    <h2>Retention &amp; Deletion</h2>
    <p>Personal Data is retained only as long as necessary for the purposes outlined. We follow strict protocols for securely deleting or anonymizing personal data when it's no longer needed.</p>
    <p>You have the right to request the deletion of your personal data in accordance with applicable laws. To exercise this right, please refer to the "Your Rights for Your Personal Data" section of our privacy policy.</p>

    <h2>Your Rights for Your Personal Data</h2>
    <p>
      Your rights to access, correction, deletion, and restriction to use or share your Personal Information.
      <br><br>
      Under applicable data protection law, you have certain rights to how your Personal Information is collected, stored, used and shared.
      <br><br>
      We recognize the importance of your ability to control the use of your Personal Information and provide several ways for you to exercise your rights to access (right to know), correction, deletion (erasure), and to restrict certain information (right to opt out of sharing and right to limit use and disclosure of sensitive personal information).
      <br><br>
      We will not deny you services, charge you different prices, or provide you with a different level of service solely for exercising your privacy rights.
    </p>
    <ul>
      <li>Right to Know</li>
      <p>You have the right to know what personal information is collected about you, the sources of that information, the purposes for which it is collected, and the third parties with whom it is shared.</p>
      <li>Right to Delete</li>
      <p>You can request the deletion of your personal information held by businesses.</p>
      <li>Right to Correct Inaccurate Personal Information</li>
      <p>You have the right to request correction of inaccurate personal information collected by businesses.</p>
      <li>Right to Access</li>
      <p>You have the right to request information that has been collected about you over the past 12 months.</p>
    </ul>
    <p>California also offers a right to opt out of "Selling" and "Sharing" Personal Information. Global Privacy Control setting is a browser setting that notifies website owners of users' privacy preferences regarding selling or sharing their personal information. We do not respond to these settings because we do not sell or share data.</p>

    <h3>How do you exercise your rights?</h3>
    <p>If you, or an authorized agent, want to exercise any of your rights relating to your personal information, contact us or submit your request from <a href="mailto:info@nimiq.com">info@nimiq.com</a></p>
    <p>To ensure the security and privacy of your information, if you or an authorized agent submit a request, we will initiate an identity verification process before responding. We may request information necessary to reasonably confirm your identity, comparing the details provided against our internal business records. If we are unable to verify your identity, regrettably, we won't be able to fulfill your request. In the event of a denial, whether partial or complete, you have the right to appeal. We will furnish you with details about the appeals process in such instances.</p>

    <h2>Do We Disclose Personal Information, and why?</h2>
    <p>We do not sell Personal Information to third parties for money or share your personal information for cross-context behavioral advertising, including any sensitive personal information.</p>
    <p>However, we will disclose your Personal Information with third parties to help us provide services, protect our customers from risk and fraud, market our products, and comply with legal obligations.</p>
    <p>
      In addition, we may disclose Personal Information with:
      <br><br>
      Authorities, when accompanied by a subpoena or other legal documentation that requires us to respond. Such authorities include courts, governments, law enforcement, and regulators. We may also be required to provide other third parties information about your use of our Services, for example to comply with card association rules, to investigate or enforce violations of our user agreement or to prevent physical harm or illegal activity.
      <br><br>
      Other financial institutions, to jointly offer a product, such as credit, cashback, etc.
      <br><br>
      Card networks and payment processors, to facilitate payment processing or to add cards to your electronic wallet.
      <br><br>
      Connected Accounts: This includes social media accounts that you have requested us to link, as well as instances where you link an account with another bank, financial institution, card account, or aggregator as part of your engagement in open banking. This connection allows us to verify the adequacy of funds and confirm your ownership of the account.
    </p>

    <h2>How Long is Your Personal Information Retained?</h2>
    <p>We keep personal information for a duration necessary or permissible based on the purpose for which it was collected and in accordance with relevant laws.</p>
    <p>Personal Information utilized for the ongoing relationship between you and us is preserved for the duration of the relationship, plus an additional 10 years, unless an extended period is required, such as:</p>
    <ul>
      <li>Adherence to legal obligations or compliance with applicable laws, including those under bankruptcy laws and Anti-Money Laundering (AML) obligations.</li>
      <li>Necessity for litigation, investigations, audit and compliance practices, or safeguarding against legal claims.</li>
    </ul>
    <p>Biometric data is retained for as long as required or permitted based on the purpose of collection, and no more than 3 years after the closure of your account, unless otherwise mandated by applicable law.</p>

    <h2>How We Safeguard Your Personal Information:</h2>
    <p>
      We employ a comprehensive approach to protect your Personal Information, incorporating technical, physical, and administrative security measures. These measures are specifically designed to reasonably safeguard your information from loss, misuse, unauthorized access, disclosure, and alteration. Our security protocols encompass the use of firewalls, data encryption, strict physical access controls to our data centers, and robust authorization controls for information access.
      <br><br>
      While we are committed to ensuring the security of our systems and services, it's essential for you to play a role in securing and preserving the privacy of your password(s) and account/Connect profile registration information. Additionally, please verify that the Personal Information we hold about you is accurate and up-to-date.
      <br><br>
      It's important to note that we cannot assume responsibility for the protection of Personal Information shared with a third party based on a linked account connection that you have authorized. Your diligence in managing linked account connections is crucial for the security of shared information in such instances.
    </p>

    <h2>Merger or Acquisition</h2>
    <p>In events like mergers or acquisitions, personal data may be transferred, ensuring the continuity of privacy protections under a new policy.</p>

    <h2>Children's Privacy</h2>
    <p>Our Services are not intended for individuals under the age of 16 or those not legally permitted to use them. We consciously refrain from collecting information, including Personal Information, from such individuals. In the event that we become aware of inadvertently collecting Personal Information from someone ineligible to use our Services, we will promptly delete it, unless there exists a legal obligation requiring us to retain such data.</p>

    <h2>Changes</h2>
    <p>This Privacy Policy may be updated periodically. Users will be notified of significant changes and prompted to review and accept the updated terms.</p>

    <h2>Contact Us</h2>
    <p>For inquiries or requests regarding your data, please contact us through the details provided in this section.</p>

    <h2>Note on Sensitive Personal Data</h2>
    <p>We explicitly state that we do not collect any sensitive or personal information beyond what is necessary for the functioning of our app and services.</p>

    <h2>California Privacy Notice of Collection</h2>
    <p>Under the laws of California and certain other US states, we are required to provide you with the following additional information about: (1) the purpose for which we use each category of "personal information" we collect; and (2) the categories of third parties to which we (a) disclose such personal information for a business purpose, (b) "share" personal information for "cross-context behavioral advertising," and/or (c) "sell" such personal information.</p>
    <p>Under California law, "sharing" is defined as the targeting of advertising to a consumer based on that consumer's personal information obtained from the consumer's activity across websites, and "selling" is defined as the disclosure of personal information to third parties in exchange for monetary or other valuable consideration. We do not sell or share your Personal Information, including any Sensitive Personal Information. We also do not sell or share and have no actual knowledge that we have sold or shared any Personal Information of anyone under 16 years of age.</p>

    <code>(1) the purpose for which we use each category of "personal information" we collect; and (2) the categories of third parties to which we (a) disclose such personal information for a business purpose, (b) "share" personal information for "cross-context behavioral advertising," and/or (c) "sell" such personal information.</code>
  </div>
</template>
