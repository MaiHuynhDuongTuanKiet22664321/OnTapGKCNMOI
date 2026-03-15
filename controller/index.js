const SubjectModel = require("../models/subject"); 
const { uploadFile } = require("../service/file.service"); 
const { validatePayload, validateUpdate } = require("../utils/validate");
const Controller = {};

// GET ALL
Controller.get = async (req, res) => {
  try {
    const subjects = await SubjectModel.getSubjects();
    res.render("index", { subjects });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting subjects");
  }
};

// GET ONE
Controller.getOne = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).send("Invalid id");

    const subject = await SubjectModel.getOneSubject(id);

    if (!subject) {
      return res.status(404).send("Subject not found");
    }

    res.render("edit", { subject });

  } catch (error) {
    console.error(error);
    res.status(500).send("Error getting subject");
  }
};

// CREATE
Controller.post = async (req, res) => {
  try {

    const errors = validatePayload(req.body);
    if (errors) {
      return res.status(400).send(errors.join(", "));
    }

    const { name, type, semester, faculty } = req.body;
    const image = req.file || null;

    let imageUrl = null;

    if (image) {
      imageUrl = await uploadFile(image);
    }

    await SubjectModel.createSubject({
      name,
      type,
      semester,
      faculty,
      image: imageUrl
    });

    res.redirect("/subjects");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating subject");
  }
};

// UPDATE
Controller.put = async (req, res) => {
  try {

    const { id } = req.params;
    if (!id) return res.status(400).send("Invalid id");

    const errors = validateUpdate(req.body);
    if (errors) {
      return res.status(400).send(errors.join(", "));
    }

    const { name, type, semester, faculty, oldImage } = req.body;
    const image = req.file;

    let imageUrl = oldImage;

    if (image) {
      imageUrl = await uploadFile(image);
    }

    await SubjectModel.updateSubject(id, {
      name,
      type,
      semester,
      faculty,
      image: imageUrl
    });

    res.redirect("/subjects");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating subject");
  }
};

// DELETE
Controller.delete = async (req, res) => {
  try {

    const { id } = req.params;
    if (!id) return res.status(400).send("Invalid id");

    const existSubject = await SubjectModel.getOneSubject(id);

    if (!existSubject) {
      return res.status(404).send("Subject not found");
    }

    await SubjectModel.deleteSubject(id);

    res.redirect("/subjects");

  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting subject");
  }
};

module.exports = Controller;