import { test, expect, request } from "@playwright/test";

let AUTH_TOKEN = { Authorization: "Bearer 47d389f84f07d1359c5f46a4e1f2ffe37860c8c0309f12ad8a52d02c2eaa8ca1" };

test("get user test", async ({ request }) => {
  let response = await request.get("https://gorest.co.in/public/v2/users", {
    headers: AUTH_TOKEN,
  });

  // console.log("response", response);

  let jsonBody = await response.json();
  console.log(jsonBody);
  console.log(response.status());
  console.log(response.statusText());
});

test("create a user test", async ({ request }) => {
  let userData = {
    name: "Tony",
    email: `tony_${Date.now()}@open.com`,
    gender: "male",
    status: "active",
  };

  let response = await request.post("https://gorest.co.in/public/v2/users", {
    headers: AUTH_TOKEN,
    data: userData, //JS object to JSON is called serialization
  });

  let jsonBody = await response.json();
  console.log(jsonBody);

  console.log(response.status());
  console.log(response.statusText());
  expect.soft(response.status()).toBe(201);
  expect.soft(response.statusText()).toBe("Created");
});

test("update a user", async ({ request }) => {
  let userData = {
    name: "Tony101",
    email: `tony_${Date.now()}@open.com`,
    gender: "male",
    status: "active",
  };

  let response = await request.put("https://gorest.co.in/public/v2/users/8613466", {
    headers: AUTH_TOKEN,
    data: userData,
  });

  let jsonBody = await response.json();

  console.log(jsonBody);

  console.log(response.status());
  console.log(response.statusText());
});

test("Delete a user", async ({ request }) => {
  let response = await request.delete("https://gorest.co.in/public/v2/users/8613466", {
    headers: AUTH_TOKEN,
  });

  console.log(response.status());
  console.log(response.statusText());
});
