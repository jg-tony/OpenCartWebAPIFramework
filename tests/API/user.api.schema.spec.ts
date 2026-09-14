//schema: type of response data
//third party -- ajv  --> node library for schema validation.
// npm install ajv

import { test, expect } from "../../src/fixtures/apifixture";
import Ajv from "ajv";

let TOKEN = process.env.AUTH_TOKEN;
let AUTH_HEADER = { Authorization: `Bearer ${TOKEN}` };

let ajv = new Ajv();

// define JSON Schema:
let userSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
    },
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    gender: {
      type: "string",
    },
    status: {
      type: "string",
    },
  },
  required: ["id", "name", "email", "gender", "status"],
};

let userArraysSchema = {
  type: "array",
  items: userSchema,
};

test("GET -- get a user", async ({ apiHelper }) => {
  let userData = {
    name: "schema test",
    email: `automation${Date.now()}@open.com`,
    gender: "male",
    status: "active",
  };
  //create a user
  let postResponse = await apiHelper.post("/public/v2/users", userData, AUTH_HEADER);
  let userId = postResponse.body.id;
  //get the user
  let getResponse = await apiHelper.get(`/public/v2/users/${userId}`, AUTH_HEADER);
  expect(getResponse.status).toBe(200);
  console.log(getResponse.body);
  //schema validation code
  let validate = ajv.compile(userSchema);

  let isSchemaValid = validate(getResponse.body);

  if (!isSchemaValid) {
    console.log("Schema errors: ", validate.errors);
  }
  expect(isSchemaValid).toBeTruthy();
});

test("GET -- get all users", async ({ apiHelper }) => {
  //get the user
  let getResponse = await apiHelper.get(`/public/v2/users`, AUTH_HEADER);
  expect(getResponse.status).toBe(200);
  console.log(getResponse.body);
  //schema validation code
  let validate = ajv.compile(userArraysSchema);

  let isSchemaValid = validate(getResponse.body);

  if (!isSchemaValid) {
    console.log("Schema errors: ", validate.errors);
  }
  expect(isSchemaValid).toBeTruthy();
});
