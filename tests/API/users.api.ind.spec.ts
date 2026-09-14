import { test, expect } from "../../src/fixtures/apifixture";

const TOKEN = process.env.AUTH_TOKEN!;
const AUTH_HEADER = { Authorization: `Bearer ${TOKEN}` };

//helper - generic function - create a user

async function createUser(apiHelper: any) {
  let userData = {
    name: "Tony api",
    email: `tony_api_${Date.now()}@open.com`,
    gender: "male",
    status: "active",
  };

  let response = await apiHelper.post("/public/v2/users", userData, AUTH_HEADER);
  console.log(response.body);
  expect(response.status).toBe(201);

  return response.body;
}

//Test 1: create a user + verify : AAA

test("POST- create a user", async ({ apiHelper }) => {
  //create a user:
  let userResponse = await createUser(apiHelper);

  //get  the user
  let response = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
  expect(response.status).toBe(200);
  expect(response.body.name).toBe("Tony api");
  expect(response.body.id).toBe(userResponse.id);
});

//Test 2 : update a user test + verify
// POST ---> userid ---> PUT ---> GET /userid--verify
test("PUT, update a user", async ({ apiHelper }) => {
  let userResponse = await createUser(apiHelper);

  let userUpdatedData = {
    name: "Naveen API updated",
    status: "inactive",
  };
  //update the user
  let putRespone = await apiHelper.put(`/public/v2/users/${userResponse.id}`, userUpdatedData, AUTH_HEADER);
  expect(putRespone.status).toBe(200);
  expect(putRespone.body.name).toBe(userUpdatedData.name);
  expect(putRespone.body.status).toBe(userUpdatedData.status);

  //get call
  let getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
  expect(getResponse.status).toBe(200);
  console.log(getResponse.body);
  expect(getResponse.body.name).toBe(userUpdatedData.name);
  expect(getResponse.body.status).toBe(userUpdatedData.status);
});

//Delete call
// Post -- get userid > delete call with userid - get call to veriy

test("Delete - delete a user", async ({ apiHelper }) => {
  let postResponse = await createUser(apiHelper);
  console.log("new user id", postResponse.id);

  //delete call
  let deleteResponse = await apiHelper.delete(`/public/v2/users/${postResponse.id}`, AUTH_HEADER);
  expect(deleteResponse.status).toBe(204);

  //verify using get call
  let getResponse = await apiHelper.get(`/public/v2/users/${postResponse.id}`, AUTH_HEADER);
  expect(getResponse.status).toBe(404);
  expect(getResponse.body.message).toBe("Resource not found");
});
