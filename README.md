# Session-Management-System
created  a session management system from scratch for Squid, an app that personalizes the user experience by securely storing user preferences and managing session data.
Objective:
Design and implement a session management system for Squid, an app that personalizes the user experience by securely storing user preferences and managing session data.

# Scenario
Squid is a content management app where users can save their preferences (e.g., theme, notification settings) and track their browsing activity during a session. This assignment focuses on managing user sessions and preferences using cookies and server-side sessions.

# Requirements
1. User Preferences
Users should be able to save and retrieve their preferences.
Preferences to store:
Theme: dark or light.
Notifications: enabled or disabled.
Language: e.g., English, Spanish, etc.
Store preferences in cookies so they persist across browser sessions.
2. Session Tracking
Maintain a server-side session to track user activity during a session, including:
Pages visited: Store the list of page IDs or names.
Session start time.
Session duration.
Use Express-session (or a similar library) to manage sessions.
3. Endpoints
Create the following API endpoints:
# User Preferences:
POST /preferences: Save user preferences.
Example Request: { "theme": "dark", "notifications": "enabled", "language": "English" }
GET /preferences: Retrieve saved preferences.
# Session Management:
POST /session: Start a new session (initialize).
GET /session: Fetch session details (e.g., pages visited, start time, duration).
POST /session/page: Log a page visit during the session.
Example Request: { "page": "dashboard" }
DELETE /session: End the current session.
System Behavior
# Session Management:
Sessions should expire after 30 minutes of inactivity.
Use MongoDB or an in-memory store like Redis for session storage.
Handle both authenticated users and guests:
For authenticated users, sync session data with their user profile in MongoDB.
For guests, only use session storage.
# Secure Preferences:
Save preferences in cookies with the following configurations:
HttpOnly: Prevent client-side JavaScript access.
Secure: Enable only in production environments over HTTPS.
SameSite: Restrict third-party cookie access.
# Error Handling:
Return appropriate HTTP status codes for errors (e.g., 400 Bad Request, 401 Unauthorized).
Validate request bodies for required fields.

# Cross-Device Syncing:
For authenticated users, sync preferences and session data across devices.
# Activity Tracking:
Include a mechanism to log and retrieve user actions during a session (e.g., "clicked on Settings," "opened Dashboard").
Pagination: Paginate page visit logs in the session response for sessions with many page visits.
