import { randomUUID } from "node:crypto";
import { test, expect } from "../../src/fixtures/apifixture";
import { ApiHelper } from "../../src/api/ApiHelper";

/**
 * GoRest "Users" API - CRUD suite.
 *
 * This file intentionally re-implements users.api.ind.spec.ts to show the
 * kind of structure/hygiene an experienced SDET applies to API tests.
 * Concepts called out inline as they appear:
 *   1. Fail fast on missing config
 *   2. Typed API contracts instead of `any`
 *   3. A data builder/factory for test data
 *   4. AAA (Arrange-Act-Assert) + test.step() for readable reports
 *   5. Independent, self-cleaning tests (safe under full parallelism)
 *   6. Asserting via a fresh GET instead of trusting the mutating response
 *   7. Negative-path coverage, not just the happy path
 */

// ---------------------------------------------------------------------------
// 1. Fail fast: if AUTH_TOKEN is missing, every test would otherwise fail
//    downstream with a confusing 401. Throwing here at module-load time gives
//    one clear error instead of N noisy ones.
// ---------------------------------------------------------------------------
const TOKEN = process.env.AUTH_TOKEN;
if (!TOKEN) {
  throw new Error("AUTH_TOKEN is not set - check config/.env.<ENV>");
}
const AUTH_HEADER = { Authorization: `Bearer ${TOKEN}` };
const USERS_ENDPOINT = "/public/v2/users";

// ---------------------------------------------------------------------------
// 2. Typed contracts: describing the request/response shape catches typos
//    (e.g. "genderr") at compile time and gives autocomplete everywhere,
//    which is why createUser() below is typed with ApiHelper instead of `any`.
// ---------------------------------------------------------------------------
interface UserPayload {
  name: string;
  email: string;
  gender: "male" | "female";
  status: "active" | "inactive";
}

interface User extends UserPayload {
  id: number;
}

// ---------------------------------------------------------------------------
// 3. Data builder: one place that knows what a "valid user" looks like.
//    Tests ask for overrides only when a scenario needs to differ, so the
//    contract only has to be updated in one spot if the API changes.
//    randomUUID() (built into Node, no extra dependency) keeps emails unique
//    even when tests run in parallel workers - Date.now() can collide there.
// ---------------------------------------------------------------------------
function buildUserPayload(overrides: Partial<UserPayload> = {}): UserPayload {
  return {
    name: "Tony API",
    email: `tony_api_${randomUUID()}@open.com`,
    gender: "male",
    status: "active",
    ...overrides,
  };
}

// Arrange helper, kept outside the test body so each test's own Act/Assert
// stays focused on the thing it's actually verifying.
async function createUser(apiHelper: ApiHelper, overrides: Partial<UserPayload> = {}): Promise<User> {
  const payload = buildUserPayload(overrides);
  const response = await apiHelper.post(USERS_ENDPOINT, payload, AUTH_HEADER);
  expect(response.status, "precondition: user must be created before the test can proceed").toBe(201);
  return response.body as User;
}

test.describe("GoRest Users API - CRUD", () => {
  // -------------------------------------------------------------------------
  // 5. Self-cleaning tests: track whatever a test created and remove it in
  //    afterEach, regardless of pass/fail. This is what keeps tests
  //    "independent" (the .ind in the original filename) - each test owns
  //    its own data and leaves no residue for the next one, which matters a
  //    lot against a shared/rate-limited public API like GoRest.
  // -------------------------------------------------------------------------
  let createdUserId: number | undefined;

  test.afterEach(async ({ apiHelper }) => {
    if (createdUserId !== undefined) {
      await apiHelper.delete(`${USERS_ENDPOINT}/${createdUserId}`, AUTH_HEADER);
      createdUserId = undefined;
    }
  });

  test("creates a user and the created data is retrievable via GET", async ({ apiHelper }) => {
    // Arrange
    const created = await createUser(apiHelper);
    createdUserId = created.id; // hand off to afterEach for cleanup

    // Act + Assert, wrapped in test.step so the HTML/Allure report reads like
    // a spec instead of a wall of assertions.
    await test.step("GET by id returns the same user that was created", async () => {
      const response = await apiHelper.get(`${USERS_ENDPOINT}/${created.id}`, AUTH_HEADER);

      expect(response.status).toBe(200);
      // toMatchObject: assert only the fields this test cares about, so the
      // test doesn't break if GoRest adds unrelated fields to the response.
      expect(response.body).toMatchObject({
        id: created.id,
        name: created.name,
        email: created.email,
      });
    });
  });

  test("updates a user's name and status via PUT", async ({ apiHelper }) => {
    const created = await createUser(apiHelper);
    createdUserId = created.id;

    const updates = { name: "Tony API Updated", status: "inactive" as const };

    await test.step("PUT applies the update and echoes it back", async () => {
      const response = await apiHelper.put(`${USERS_ENDPOINT}/${created.id}`, updates, AUTH_HEADER);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updates);
    });

    await test.step("a fresh GET confirms the update was actually persisted", async () => {
      // 6. Never assert only on the mutating call's own response - it could
      //    theoretically echo the request back without having saved it.
      //    Re-fetching proves the state change stuck server-side.
      const response = await apiHelper.get(`${USERS_ENDPOINT}/${created.id}`, AUTH_HEADER);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updates);
    });
  });

  test("deletes a user and the resource becomes unreachable", async ({ apiHelper }) => {
    const created = await createUser(apiHelper);
    // Deliberately not assigning createdUserId here: this test deletes the
    // record itself as part of the Act step, so there's nothing left for
    // afterEach to clean up. Setting it anyway would just cause a harmless
    // extra DELETE call against an already-deleted id.

    await test.step("DELETE removes the user", async () => {
      const response = await apiHelper.delete(`${USERS_ENDPOINT}/${created.id}`, AUTH_HEADER);
      expect(response.status).toBe(204);
    });

    await test.step("GET on the deleted id now returns 404", async () => {
      const response = await apiHelper.get(`${USERS_ENDPOINT}/${created.id}`, AUTH_HEADER);
      expect(response.status).toBe(404);
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Negative-path coverage: a suite that only proves the happy path works
  //    hasn't proven the API validates its input. Verified against the live
  //    API before writing this assertion (POST with a malformed email
  //    reliably returns 422 with a field-level error array).
  // ---------------------------------------------------------------------------
  test("rejects user creation when the email is not a valid email address", async ({ apiHelper }) => {
    const payload = buildUserPayload({ email: "not-an-email" });

    const response = await apiHelper.post(USERS_ENDPOINT, payload, AUTH_HEADER);

    expect(response.status).toBe(422);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "email" })])
    );
  });
});
