. Application Overview
The QGPT application provides a streamlined user experience through its two primary interface sections: the Navigation Bar (Navbar) Section and the Chatbot Section. This overview explains the functional components available within each part of the UI, enabling users to efficiently explore and interact with the system.
________________________________________
2.1 Navigation Bar (Navbar) Section
The navbar is positioned on the left-hand side of the application and includes user-friendly UI controls and categorized feature access.
2.1.1 Header Controls
Located at the top-right corner of the navbar:
•	Expand/Collapse Button
Allows users to toggle the navbar visibility for a wider chat view or detailed navigation.
•	Search Button
Opens a Search Dialog Box, where users can:
o	View saved sessions categorized as:
	Today
	Last 7 Days
	Last 30 Days
o	Utilize a search input field to locate stored chat sessions by keyword.
2.1.2 Core Navigation Modules
The navbar contains three major functional sections:
1.	New Chat / Default Navbar View
o	Users can initiate a new chat session at any time by selecting the “New Chat” button.
2.	Define the Scope
o	Provides contextual filtering to enable targeted queries.
o	Filter options are provided using cascading dropdowns, including:
	Business Group / Business Unit
	Country
	Plant
	Time Frame
o	Supported predefined Time Frames:
	Last Month
	Last 3 Months
	Last 6 Months
	Yearly
o	Custom Time Range selection is available with Start Date and End Date inputs.
o	A Reset Filter button is available to clear all selected query filters instantly.
3.	Chat History
o	Displays all previously saved chat sessions organized into categories:
	Today
	Last 7 Days
	Last 30 Days
o	Selecting a chat entry loads the corresponding context into the chatbot window.
o	Each saved session supports:
	Rename
	Delete
2.1.3 Footer Information
The bottom section of the navbar displays authenticated user details:
•	Logged-in Username
•	Registered Email Address
Chatbot Application
The Chatbot Application represents the core interactive area of QGPT where users initiate queries, receive AI-generated responses, and visualize processed insights. The interface is designed with a focus on usability and efficient information exploration. It consists of three primary regions: the Header, the Visualization Section, and the Input Section.
________________________________________
**2.2.1 Chatbot Header
The header provides navigation and user-profile access features.
•	Quality Risk Predictor Navigation Button
Allows users to switch from the chatbot interface to the Quality Risk Predictor module.
•	User Profile Menu
Displays the logged-in user's:
o	Username
o	Logout option for session termination
________________________________________
2.2.2 Visualization Section (Response Window)
This is the main content area where queries and responses are displayed. It supports multiple response types and interaction features.
First-Time User Experience
When the application is launched initially:
•	Two suggested questions are displayed as clickable quick prompts.
•	Users may:
o	Select a suggested question, or
o	Enter their own query to begin a session
Users may also select previously saved chat sessions from the navbar history panel to retrieve stored conversation context.
Response Display Structure
Each chatbot response is presented with layered detail:
1.	Response Classification Chips
o	A tag representing response nature:
	Factual or Reasoning
o	A chip indicating API response time from GPT
2.	Response Content Display
o	Rendered in Markdown format for enhanced readability
o	Two display modes:
	Brief Summary (default view)
Concise high-level insight
	In-Depth Details
Expanded analytical explanation for deeper understanding
3.	Data Visualization Options (available when applicable to factual queries)
o	Table view — structured data output
o	SQL — underlying query logic used to extract data
o	Charts:
	Bar Chart
	Line Chart
Users may switch between visual modes using grouped toggle buttons.
4.	Response Action Controls
o	Copy Response to clipboard
o	Download Options:
	PDF
	Word Document
	CSV
o	Feedback Buttons:
	👍 (Like)
	👎 (Dislike)
Feedback is stored in the SQL Server database for quality monitoring and model improvement.
5.	Follow-Up Question Suggestions
o	Automatically generated based on prior conversation context
o	Designed to guide users toward deeper insights and continued exploration
________________________________________
**2.2.3 Input Section
Located at the bottom of the chatbot interface, this is where users interact with QGPT.
•	Text input box for entering questions or commands
•	Enter key submission triggers:
o	API communication with GPT service
o	Dynamic response rendering in the Visualization Section
This section ensures smooth conversational workflow while supporting continuous interaction cycles.

