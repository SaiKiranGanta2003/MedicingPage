const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail',  // You can change this to any other service (e.g., SendGrid, Mailgun)
  auth: {
    user: process.env.EMAIL_USER,  // Your email address from which emails will be sent
    pass: process.env.EMAIL_PASS,  // Your email password (or app password for Gmail)
  },
});

// Function to send email to reviewers
const sendReviewEmail = (reviewerEmail, documentLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: reviewerEmail,
    subject: 'Document Review Request',
    text: `Hello Sir/Madam, 

    We have a request for reviewing the document. Please review the document at the following link: ${documentLink}.
    
    If everything is correct, please sign. Otherwise, feel free to leave a comment.
    
    Regards,
    Medicing Enterprises`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending review email:', error);
    } else {
      console.log('Review email sent:', info.response);
    }
  });
};

// Function to send email to approvers
const sendApproveEmail = (approverEmail, documentLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: approverEmail,
    subject: 'Document Approval Request',
    text: `Hello Sir/Madam,

    We have a request for approving the document. Please review and approve/reject the document at the following link: ${documentLink}.
    
    If everything is correct, please approve the document. If not, please reject it.
    
    Regards,
    Medicing Enterprises`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending approval email:', error);
    } else {
      console.log('Approval email sent:', info.response);
    }
  });
};

// Function to send email notifications for document upload
const sendDocumentUploadNotification = (reviewers, approvers, documentLink) => {
  reviewers.forEach((reviewer) => {
    sendReviewEmail(reviewer.email, documentLink);
  });

  approvers.forEach((approver) => {
    sendApproveEmail(approver.email, documentLink);
  });
};

// Function to resend email if document has comments (in case of rejection or comments from reviewers)
const resendEmails = (reviewers, approvers, documentLink) => {
  reviewers.forEach((reviewer) => {
    sendReviewEmail(reviewer.email, documentLink);
  });

  approvers.forEach((approver) => {
    sendApproveEmail(approver.email, documentLink);
  });
};

module.exports = {
  sendReviewEmail,
  sendApproveEmail,
  sendDocumentUploadNotification,
  resendEmails,
};


// const express = require('express');
// const router = express.Router();

// router.post('/send', (req, res) => {
//     const { email, message } = req.body;

//     // Simulated email sending logic
//     console.log(`Sending email to ${email}: ${message}`);
//     res.json({ message: 'Notification sent successfully' });
// });

// module.exports = router;
