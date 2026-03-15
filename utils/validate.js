const nameRegex = /^[\p{L}0-9\s]+$/u;
const typeRegex = /^[\p{L}0-9\s]+$/u;
const semesterRegex = /^[0-9]+$/;
const facultyRegex = /^[\p{L}\s]+$/u;
const checkEmpty = payload => {
  // Kiểm tra xem payload có thuộc tính nào bị rỗng (loại bỏ khoảng trắng)
  const { name = "", type = "", semester = "", faculty = "" } = payload || {};
  if (!String(name).trim() || !String(type).trim() || !String(semester).trim() || !String(faculty).trim()) {
    return true;
  }
  return false;
};

module.exports = {
  validatePayload: payload => {
    const { name, type, semester, faculty } = payload;
    const errors = [];

    if (checkEmpty(payload)) {
      errors.push("All fields are required");
    }

    if (!nameRegex.test(name)) {
      errors.push("Name must be a string");
    }

    if (!typeRegex.test(type)) {
      errors.push("Type must be a string");
    }

    if (!semesterRegex.test(String(semester))) {
      errors.push("Semester must be a number");
    }

    if (!facultyRegex.test(faculty)) {
      errors.push("Faculty must be a string");
    }

    if (errors?.length > 0) {
      return errors;
    }

    return null;
  },

  validateUpdate: payload => {
    const { name, type, semester, faculty } = payload;

    const errors = [];
    if (name && !nameRegex.test(name)) {
      errors.push("Name must be a string");
    }

    if (type && !typeRegex.test(type)) {
      errors.push("Type must be a string");
    }

    if (faculty && !facultyRegex.test(faculty)) {
      errors.push("Faculty must be a string");
    }

    if (semester && !semesterRegex.test(semester)) {
      errors.push("Semester must be a number");
    }

    if (errors.length > 0) {
      return errors;
    }

    return null;
  },
};
