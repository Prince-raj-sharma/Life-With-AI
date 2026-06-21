const PDFProduct = require('../models/PDFProduct');

exports.getPDFs = async (req, res) => {
  try {
    const pdfs = await PDFProduct.find();
    res.json(pdfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPDFDetails = async (req, res) => {
  try {
    const pdf = await PDFProduct.findById(req.params.id);
    res.json(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPDF = async (req, res) => {
  try {
    const pdf = await PDFProduct.create(req.body);
    res.status(201).json(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePDF = async (req, res) => {
  try {
    const pdf = await PDFProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(pdf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePDF = async (req, res) => {
  try {
    await PDFProduct.findByIdAndDelete(req.params.id);
    res.json({ message: 'PDF deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
