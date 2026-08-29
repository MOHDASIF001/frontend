import React from 'react';

export const metadata = {
  title: "Privacy Policy - Twin Brothers Holidays",
  description: "Privacy policy and client data guidelines at Twin Brothers Holidays.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <div className="container-fluid privacy-hero-section">
        <div className="container">
          <h1 className="privacy-hero-title">Privacy <span>Policy</span></h1>
          <p>Your privacy is important to us</p>
        </div>
      </div>

      <div className="container privacy-content-section py-5">
        <div className="row">
          <div className="col-lg-10 mx-auto bg-white p-4 border rounded shadow-sm">
            <p className="text-muted">At <strong>Twin Brothers Holidays</strong>, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Twin Brothers Holidays and how we use it.</p>

            <p className="text-muted">If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">Information We Collect</h2>
            <p className="text-muted">The personal information that you are asked to provide, and the reasons why you are asked to provide it, will be made clear to you at the point we ask you to provide your personal information.</p>
            <p className="text-muted">If you contact us directly, we may receive additional information about you such as your name, email address, phone number, the contents of the message and/or attachments you may send us, and any other information you may choose to provide.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">How We Use Your Information</h2>
            <p className="text-muted">We use the information we collect in various ways, including to:</p>
            <ul className="text-muted pl-4">
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you for customer support, service updates, and marketing</li>
              <li>Send you emails or notification alerts</li>
              <li>Find and prevent fraudulent activities</li>
            </ul>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">Log Files</h2>
            <p className="text-muted">Twin Brothers Holidays follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">Cookies and Web Beacons</h2>
            <p className="text-muted">Like any other website, Twin Brothers Holidays uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">Third Party Privacy Policies</h2>
            <p className="text-muted">Twin Brothers Holidays's Privacy Policy does not apply to other advertisers or websites. Thus, we are advising you to consult the respective Privacy Policies of these third-party ad servers for more detailed information.</p>

            <h2 className="fw-bold fs-4 mt-4 mb-3 text-dark">Consent</h2>
            <p className="text-muted">By using our website, you hereby consent to our Privacy Policy and agree to its terms.</p>
          </div>
        </div>
      </div>
    </>
  );
}
