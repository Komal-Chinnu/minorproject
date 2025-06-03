const Resort = require('../models/Resort');

// Get all resorts
exports.getAllResorts = async (req, res) => {
  try {
    const resorts = await Resort.find({});
    res.status(200).json(resorts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new resort
exports.createResort = async (req, res) => {
  try {
    const resort = new Resort(req.body);
    await resort.save();
    res.status(201).json(resort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get resort by ID
exports.getResortById = async (req, res) => {
  try {
    const resort = await Resort.findById(req.params.id);
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }
    res.status(200).json(resort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update resort by ID
exports.updateResort = async (req, res) => {
  try {
    const resort = await Resort.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }
    res.status(200).json(resort);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete resort by ID
exports.deleteResort = async (req, res) => {
  try {
    const resort = await Resort.findByIdAndDelete(req.params.id);
    if (!resort) {
      return res.status(404).json({ message: 'Resort not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search resorts by title or destination
exports.searchResorts = async (req, res) => {
  try {
    const { destination, title } = req.query;
    let resorts;

    if (destination) {
      // Search both title and location fields for the destination input
      resorts = await Resort.find({
        $or: [
          { location: { $regex: destination, $options: 'i' } },
          { title: { $regex: destination, $options: 'i' } }
        ]
      });
    } else if (title) {
      resorts = await Resort.find({
        title: { $regex: title, $options: 'i' }
      });
    } else {
      resorts = await Resort.find({});
    }

    res.status(200).json(resorts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
