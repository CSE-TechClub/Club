const { google } = require("googleapis");

exports.handler = async function (event, context) {
  console.log("Function started");
  console.log("Event:", JSON.stringify(event, null, 2));

  // Add CORS headers for preflight requests
  if (event.httpMethod === "OPTIONS") {
    console.log("Handling OPTIONS request");
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: "",
    };
  }

  try {
    console.log("Starting calendar events fetch...");

    // Format the private key properly
    const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
      ? process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.replace(
          /\\n/g,
          "\n"
        ).replace(/"/g, "")
      : "";

    // Log environment variables (without sensitive data)
    console.log("Environment variables check:", {
      hasEmail: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasKey: !!privateKey,
      hasCalendarId: !!process.env.GOOGLE_CALENDAR_ID,
      keyLength: privateKey.length,
      keyStartsWith: privateKey.substring(0, 30),
      keyEndsWith: privateKey.substring(privateKey.length - 30),
    });

    console.log("Creating Google Auth client...");
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey,
      },
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    console.log("Creating Calendar client...");
    const calendar = google.calendar({ version: "v3", auth });

    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(now.getMonth() + 1);

    console.log("Fetching events for time range:", {
      from: now.toISOString(),
      to: oneMonthFromNow.toISOString(),
    });

    console.log("Making calendar API request...");
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID || "primary",
      timeMin: now.toISOString(),
      timeMax: oneMonthFromNow.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      maxResults: 100,
    });

    console.log(
      `Successfully fetched ${response.data.items?.length || 0} events`
    );

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: JSON.stringify(response.data.items || []),
    };
  } catch (error) {
    console.error("Error in getCalendarEvents:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack,
    });

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
      body: JSON.stringify({
        error: "Failed to fetch calendar events",
        details: error.message,
        code: error.code,
        status: error.status,
      }),
    };
  }
};
