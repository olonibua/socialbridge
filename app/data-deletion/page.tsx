import React from 'react'

const page = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Data Deletion Policy</h1>
      <p>
        You have the right to request the deletion of your personal data from
        SocialBridge. If you would like to remove your data, please follow the
        instructions below:
      </p>
      <h2 className="text-2xl font-semibold mt-4">
        How to Request Data Deletion
      </h2>
      <p>To delete your data, you can:</p>
      <ul className="list-disc ml-6">
        <li>Go to your account settings and select 'Delete Account'.</li>
        <li>
          Email us at support@socialbridge.com with the subject 'Data Deletion
          Request'.
        </li>
      </ul>
      <h2 className="text-2xl font-semibold mt-4">Processing Time</h2>
      <p>
        Data deletion requests will be processed within 7 business days. You
        will receive a confirmation email once your data has been removed.
      </p>
      <h2 className="text-2xl font-semibold mt-4">Contact Us</h2>
      <p>
        If you have any questions regarding data deletion, contact us at:
        support@socialbridge.com
      </p>
    </div>
  
  )
}

export default page
