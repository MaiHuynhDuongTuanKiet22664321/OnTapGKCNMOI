const { dynamodb } = require("../utils/aws-helper");
const { v4: uuidv4 } = require("uuid");

const tableName = "Subjects";

const SubjectModel = {

  // CREATE
  async createSubject(subjectData) {
    if (!subjectData || !subjectData.name) {
      throw new Error("Invalid subject data");
    }

    const id = uuidv4();

    const params = {
      TableName: tableName,
      Item: {
        id,
        name: subjectData.name,
        type: subjectData.type || "",
        semester: subjectData.semester || "",
        faculty: subjectData.faculty || "",
        image: subjectData.image || ""
      },
      ConditionExpression: "attribute_not_exists(id)"
    };

    try {
      await dynamodb.put(params).promise();
      return { id, ...subjectData };
    } catch (error) {
      if (error.code === "ConditionalCheckFailedException") {
        throw new Error("Subject already exists");
      }
      console.error("Create subject error:", error);
      throw error;
    }
  },

  // GET ALL
  async getSubjects() {
    try {
      const params = { TableName: tableName };
      const data = await dynamodb.scan(params).promise();
      return data.Items || [];
    } catch (error) {
      console.error("Get subjects error:", error);
      throw new Error("Failed to fetch subjects");
    }
  },

  // GET ONE
  async getOneSubject(subjectId) {
    if (!subjectId) throw new Error("Subject ID is required");

    try {
      const params = {
        TableName: tableName,
        Key: { id: subjectId }
      };

      const data = await dynamodb.get(params).promise();

      if (!data.Item) {
        throw new Error("Subject not found");
      }

      return data.Item;

    } catch (error) {
      console.error("Get subject error:", error);
      throw error;
    }
  },

  // UPDATE
  async updateSubject(subjectId, subjectData) {
    if (!subjectId) throw new Error("Subject ID is required");

    const params = {
      TableName: tableName,
      Key: { id: subjectId },
      UpdateExpression:
        "SET #n=:name, #t=:type, #s=:semester, #f=:faculty, #i=:image",
      ExpressionAttributeNames: {
        "#n": "name",
        "#t": "type",
        "#s": "semester",
        "#f": "faculty",
        "#i": "image"
      },
      ExpressionAttributeValues: {
        ":name": subjectData.name,
        ":type": subjectData.type,
        ":semester": subjectData.semester,
        ":faculty": subjectData.faculty,
        ":image": subjectData.image
      },
      ConditionExpression: "attribute_exists(id)",
      ReturnValues: "ALL_NEW"
    };

    try {
      const result = await dynamodb.update(params).promise();
      return result.Attributes;

    } catch (error) {

      if (error.code === "ConditionalCheckFailedException") {
        throw new Error("Subject not found");
      }

      console.error("Update subject error:", error);
      throw error;
    }
  },

  // DELETE
  async deleteSubject(subjectId) {

    if (!subjectId) throw new Error("Subject ID is required");

    const params = {
      TableName: tableName,
      Key: { id: subjectId },
      ConditionExpression: "attribute_exists(id)"
    };

    try {
      await dynamodb.delete(params).promise();
      return { id: subjectId };

    } catch (error) {

      if (error.code === "ConditionalCheckFailedException") {
        throw new Error("Subject not found");
      }

      console.error("Delete subject error:", error);
      throw error;
    }
  }

};

module.exports = SubjectModel;