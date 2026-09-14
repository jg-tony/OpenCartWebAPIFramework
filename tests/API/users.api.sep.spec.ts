import { test, expect } from "../../src/fixtures/apifixture";

const TOKEN = process.env.AUTH_TOKEN!;
const AUTH_HEADER = { Authorization: `Bearer ${TOKEN}` };

let userId: number;

test.describe.serial(" running e2e go rest crud api tests", () => {
  //GET test:
  test("GET API -- get all users", async ({ apiHelper }) => {
    let response = await apiHelper.get("/public/v2/users", AUTH_HEADER);

    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // post

  test("POST API -- create a user", async ({ apiHelper }) => {
    let userData = {
      name: "Tony api",
      email: `tony_api_${Date.now()}@open.com`,
      gender: "male",
      status: "active",
    };

    let response = await apiHelper.post("/public/v2/users", userData, AUTH_HEADER);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(userData.name);
    expect(response.body.email).toBe(userData.email);
    userId = response.body.id;
    console.log("Created user id :", userId);
  });

  //PUT CALL

  test("PUT API -- update user", async ({ apiHelper }) => {
    let userUpdatedData = {
      name: "Tony api updated",
      status: "inactive",
    };
    let response = await apiHelper.put(`/public/v2/users/${userId}`, userUpdatedData, AUTH_HEADER);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userUpdatedData.name);
    expect(response.body.status).toBe(userUpdatedData.status);
  });

  //Delete
  test("Delete API -- delete user", async ({ apiHelper }) => {
    let response = await apiHelper.delete(`/public/v2/users/${userId}`, AUTH_HEADER);
    expect(response.status).toBe(204);
  });
});
