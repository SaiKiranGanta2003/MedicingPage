const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Document = require("/models/document"); // Assuming the Document model exists
const User = require('../models/user'); // Assuming the User model exists

// Middleware for parsing JSON
router.use(express.json());

// Upload a Document
router.post('https://saikiranganta2003.github.io/adminPageing/documents', async (req, res) => {
  const { title, file, reviewers, approvers } = req.body;

  try {
    // Validate file
    if (!file) {
      return res.status(400).json({ error: 'Document file is required' });
    }

    // Validate reviewers and approvers
    const reviewersList = await User.find({ email: { $in: reviewers } });
    const approversList = await User.find({ email: { $in: approvers } });

    if (reviewersList.length !== reviewers.length) {
      return res.status(400).json({ error: 'Some reviewers are invalid' });
    }

    if (approversList.length !== 1) {
      return res.status(400).json({ error: 'There must be exactly one approver' });
    }

    // Create new document
    const newDocument = new Document({
      title,
      file, // Replace with file storage URL if applicable
      reviewers: reviewersList.map(user => user._id),
      approver: approversList[0]._id,
      status: 'Pending',
      comments: [],
      signatures: [],
    });

    await newDocument.save();

    res.status(201).json({
      message: 'Document uploaded successfully',
      document: newDocument,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Document Status
router.post('/update-status', async (req, res) => {
  const { documentId, status, comment, signature } = req.body;

  try {
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    // Only the approver can update the status
    if (req.user._id.toString() !== document.approver.toString()) {
      return res.status(403).json({ error: 'You are not authorized to approve/reject this document' });
    }

    // Update status, comments, and signatures
    document.status = status;
    if (comment) document.comments.push({ user: req.user._id, comment });
    if (signature) document.signatures.push(signature);

    await document.save();

    res.status(200).json({
      message: 'Document status updated successfully',
      document,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Document Tracking
router.get('/tracking', async (req, res) => {
  try {
    const documents = await Document.find().populate('reviewers approver', 'email role');

    const documentTracking = documents.map(doc => ({
      title: doc.title,
      status: doc.status,
      reviewers: doc.reviewers.map(reviewer => ({
        email: reviewer.email,
        role: reviewer.role,
        status: doc.signatures.includes(reviewer._id) ? 'Signed' : 'Pending',
        comments: doc.comments.filter(comment => comment.user.toString() === reviewer._id.toString()),
      })),
      approver: {
        email: doc.approver.email,
        role: doc.approver.role,
        status: doc.status === 'Approved' ? 'Approved' : 'Pending',
      },
    }));

    res.status(200).json({ documentTracking });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get Document by ID
router.get('/:documentId', async (req, res) => {
  const { documentId } = req.params;

  try {
    const document = await Document.findById(documentId).populate('reviewers approver', 'email role');

    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    res.status(200).json({ document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
