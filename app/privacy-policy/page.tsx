import React from 'react'

const page = () => {
  return (
    <div>
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p>
        Welcome to SocialBridge. Your privacy is important to us. This Privacy
        Policy explains how we collect, use, and protect your personal
        information.
      </p>
      <h2 className="text-2xl font-semibold mt-4">1. Information We Collect</h2>
      <p>We collect the following information when you use SocialBridge:</p>
      <ul className="list-disc ml-6">
        <li>Name and email address</li>
        <li>Profile information from connected social accounts</li>
        <li>Usage data and interactions within our platform</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-4">
        2. How We Use Your Information
      </h2>
      <p>Your data is used to:</p>
      <ul className="list-disc ml-6">
        <li>Provide authentication and login services</li>
        <li>Improve user experience and platform functionality</li>
        <li>Respond to user inquiries and support requests</li>
      </ul>
      <h2 className="text-2xl font-semibold mt-4">3. Data Security</h2>
      <p>
        We implement security measures to protect your data. However, no
        transmission over the internet is 100% secure.
      </p>
      <h2 className="text-2xl font-semibold mt-4">4. Third-Party Services</h2>
      <p>
        We may share your data with third-party authentication providers such as
        Facebook and LinkedIn.
      </p>
      <h2 className="text-2xl font-semibold mt-4">5. Data Deletion</h2>
      <p>
        If you wish to delete your data, please visit our
        <a href="/data-deletion" className="text-blue-500 underline">
          Data Deletion Page
        </a>
        .
      </p>
      <h2 className="text-2xl font-semibold mt-4">6. Contact Us</h2>
      <p>
        If you have any questions about our Privacy Policy, contact us at:
        support@socialbridge.com
      </p>
    </div>
  
    </div>
  )
}

export default page
