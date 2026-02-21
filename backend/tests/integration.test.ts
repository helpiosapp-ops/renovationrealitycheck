import { describe, test, expect } from "bun:test";
import { api, authenticatedApi, signUpTestUser, expectStatus, connectWebSocket, connectAuthenticatedWebSocket, waitForMessage } from "./helpers";

describe("API Integration Tests", () => {
  // Shared state for chaining tests (e.g., created resource IDs, auth tokens)
  // let authToken: string;
  // let resourceId: string;

  describe("Room Analysis", () => {
    test("Analyze room with valid base64 image and manual room type", async () => {
      // Create a simple valid base64 encoded image (1x1 white pixel PNG)
      const validBase64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

      const res = await api("/api/analyze-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: validBase64Image,
          manualRoomType: "kitchen",
        }),
      });
      await expectStatus(res, 200);

      const data = await res.json();
      expect(data.roomType).toBeDefined();
      expect(data.scenarios).toBeDefined();
      expect(Array.isArray(data.scenarios)).toBe(true);
      expect(data.disclaimer).toBeDefined();
    }, { timeout: 30000 });

    test("Analyze room with valid base64 image without manual room type", async () => {
      const validBase64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

      const res = await api("/api/analyze-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: validBase64Image,
        }),
      });
      await expectStatus(res, 200);

      const data = await res.json();
      expect(data.roomType).toBeDefined();
      expect(data.scenarios).toBeDefined();
      expect(Array.isArray(data.scenarios)).toBe(true);
    }, { timeout: 30000 });

    test("Reject request without required imageBase64", async () => {
      const res = await api("/api/analyze-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          manualRoomType: "bathroom",
        }),
      });
      await expectStatus(res, 400);
    });

    test("Reject request with invalid manualRoomType enum value", async () => {
      const validBase64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";

      const res = await api("/api/analyze-room", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: validBase64Image,
          manualRoomType: "invalid-room-type",
        }),
      });
      await expectStatus(res, 400);
    });

    test("Analyze room with all valid manualRoomType enum values", async () => {
      const validBase64Image = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==";
      const roomTypes = ["kitchen", "bathroom", "living room", "bedroom"];

      for (const roomType of roomTypes) {
        const res = await api("/api/analyze-room", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            imageBase64: validBase64Image,
            manualRoomType: roomType,
          }),
        });
        await expectStatus(res, 200);

        const data = await res.json();
        expect(data.scenarios).toBeDefined();
        expect(Array.isArray(data.scenarios)).toBe(true);
        if (data.scenarios.length > 0) {
          const scenario = data.scenarios[0];
          expect(scenario.name).toBeDefined();
          expect(scenario.totalCostMin).toBeDefined();
          expect(scenario.totalCostMax).toBeDefined();
        }
      }
    }, { timeout: 120000 });
  });
});
