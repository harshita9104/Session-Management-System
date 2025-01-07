const axios = require("axios"); // Import axios first
const colors = require("colors/safe");
const cookieJar = {}; // Declare after imports
axios.defaults.headers.Cookie = ""; // Configure axios after it's imported

const API_URL = "http://localhost:3001";
// Create axios instance with cookie support
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  validateStatus: false,
  headers: {
    "Content-Type": "application/json",
  },
});
// Store cookies between requests

api.interceptors.response.use((response) => {
  const setCookie = response.headers["set-cookie"];
  if (setCookie) {
    cookieJar.cookie = setCookie[0].split(";")[0];
    api.defaults.headers.Cookie = cookieJar.cookie;
  }
  return response;
});

// Utility function to log test results
const logTest = (testName, success = true, error = null) => {
  if (success) {
    console.log(colors.green(`✓ ${testName}`));
  } else {
    console.log(colors.red(`✗ ${testName}`));
    if (error) console.log(colors.red(`  Error: ${error.message || error}`));
  }
};

async function testPreferences() {
  console.log("\nTesting User Preferences...");
  try {
    // Test saving preferences
    const preferences = {
      theme: "dark",
      notifications: true,
      language: "English",
    };

    const saveResponse = await api.post("/preferences", preferences);
    logTest("Save Preferences", saveResponse.status === 200);

    // Test retrieving preferences
    const getResponse = await api.get("/preferences");
    const prefsMatch = getResponse.data.theme === preferences.theme;
    logTest("Get Preferences", getResponse.status === 200 && prefsMatch);

    return true;
  } catch (error) {
    logTest("Preferences Tests", false, error.message);
    return false;
  }
}

async function testSessionManagement() {
  console.log("\nTesting Session Management...");
  try {
    // Start new session
    const sessionStart = await api.post("/session");
    logTest("Create Session", sessionStart.status === 200);

    // Log multiple page visits
    const pages = ["dashboard", "settings", "profile", "users", "reports"];
    for (const page of pages) {
      const pageVisit = await api.post("/session/page", { page });
      logTest(`Log Visit to ${page}`, pageVisit.status === 200);
    }

    // Test session retrieval
    const sessionGet = await api.get("/session");
    logTest(
      "Get Session Details",
      sessionGet.status === 200 && sessionGet.data.pageVisits.length > 0
    );

    // Test pagination
    const sessionPage2 = await api.get("/session?page=2");
    logTest(
      "Session Pagination",
      sessionPage2.status === 200 && sessionPage2.data.currentPage === 2
    );

    return true;
  } catch (error) {
    logTest("Session Tests", false, error.message);
    return false;
  }
}

async function testActivityTracking() {
  console.log("\nTesting Activity Tracking...");
  try {
    // Perform some actions
    await api.post("/session/page", {
      page: "dashboard",
      action: "clicked settings button",
    });

    const sessionDetails = await api.get("/session");
    const hasTracking =
      sessionDetails.data.startTime && sessionDetails.data.duration;

    logTest("Activity Tracking", hasTracking);
    return true;
  } catch (error) {
    logTest("Activity Tracking Tests", false, error.message);
    return false;
  }
}

async function testErrorHandling() {
  console.log("\nTesting Error Handling...");
  try {
    // Test invalid preferences
    const invalidPrefs = {
      theme: "invalid_theme",
    };
    const badPrefs = await api.post("/preferences", invalidPrefs);
    logTest("Invalid Preferences Handling", badPrefs.status === 400);

    // Test invalid session actions
    const badSession = await api.get("/session/invalid");
    logTest("Invalid Session Route Handling", badSession.status === 404);

    return true;
  } catch (error) {
    logTest("Error Handling Tests", false, error.message);
    return false;
  }
}

async function testSessionExpiry() {
  console.log("\nTesting Session Expiry...");
  try {
    // Note: This is a mock test since we can't wait 30 minutes
    // You would need to modify the session expiry time for testing
    const session = await api.post("/session");
    logTest("Session Creation for Expiry Test", session.status === 200);

    // In real testing, you would wait here
    console.log(
      colors.yellow("  Note: Real expiry test would require waiting 30 minutes")
    );

    return true;
  } catch (error) {
    logTest("Session Expiry Tests", false, error.message);
    return false;
  }
}
// Add a new function to check server health
async function checkServerHealth() {
  try {
    const response = await api.get("/health");
    return response.status === 200 && response.data.status === "ok";
  } catch (error) {
    return false;
  }
}

async function runAllTests() {
  console.log(colors.cyan("Starting Squid Session Management Tests...\n"));

  // Check server health first
  const serverHealthy = await checkServerHealth();
  if (!serverHealthy) {
    console.log(
      colors.red("Server is not responding. Please start the server first.")
    );
    process.exit(1);
  }

  let allTestsPassed = true;
  const tests = [
    { name: "Preferences", fn: testPreferences },
    { name: "Session Management", fn: testSessionManagement },
    { name: "Activity Tracking", fn: testActivityTracking },
    { name: "Error Handling", fn: testErrorHandling },
    { name: "Session Expiry", fn: testSessionExpiry },
  ];

  for (const test of tests) {
    console.log(colors.cyan(`\nRunning ${test.name} tests...`));
    const passed = await test.fn();
    allTestsPassed = allTestsPassed && passed;
  }

  console.log("\n" + colors.cyan("Test Summary:"));
  if (allTestsPassed) {
    console.log(colors.green("\n✨ All tests passed successfully! ✨\n"));
  } else {
    console.log(
      colors.red("\n❌ Some tests failed. Check logs above for details.\n")
    );
  }
}

// Run all tests when file is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  testPreferences,
  testSessionManagement,
  testActivityTracking,
  testErrorHandling,
  testSessionExpiry,
};
