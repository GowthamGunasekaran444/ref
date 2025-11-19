Application URLs
Our application is deployed across three different environments. Each environment has its own dedicated application URL. The URLs for these environments are listed below:
•	Development Environment: [URL]
•	Staging / QA Environment: [URL]
•	Production Environment: [URL]
These environment-specific URLs allow users to access and validate the application in different stages of the development and release lifecycle.
________________________________________
2. Single Sign-On (SSO) Access
The Quality Risk Predictor (QRP) web application uses Single Sign-On (SSO) for secure authentication.
To successfully access the application through SSO, users must meet the following requirements:
•	The user must have a valid corporate email ID.
•	The user must be a member of the assigned Azure Active Directory (Azure AD) group associated with the application.
Once the user satisfies the above conditions, SSO authentication will allow seamless access to the application.
After the SSO login is completed, the user will be redirected to the QGPT landing page.
. Accessing the Quality Risk Predictor via QGPT
After SSO authentication, users first arrive on the QGPT Home Page.
To navigate from QGPT to Quality Risk Predictor (QRP):
1.	On the top header section of the QGPT page, locate the button labeled “Quality Risk Predictor”.
2.	Click this button to navigate directly into the QRP application.
This allows users to move seamlessly between QGPT and QRP using the built-in navigation options.
4. Navigation Between Screens
The Quality Risk Predictor (QRP) consists of two main screens:
•	Risk Overview
•	Risk Type Overview
4.1 Landing on the QRP Page
When users enter the QRP application through QGPT, the first page displayed is the Risk Overview page. This page contains four information cards, including:
•	Risk Supplier
•	Risk Compliance
•	Risk Performance
•	Overall Overview
For the three cards — Risk Supplier, Risk Compliance, and Risk Performance — a navigation button is available on the top-right corner of each card.
4.2 Navigating to the Risk Type Overview Page
When the user clicks the button on any of these cards, the application navigates to the corresponding Risk Type Overview page.
On the Risk Type Overview page, two toggle buttons are available:
•	Risk vs Trend
•	Risk Summary – Supplier
Selecting each toggle displays its respective chart and analytical view.
4.3 Navigating Back to the Previous Page
At the top of the page, a breadcrumb path is displayed (e.g., Risk Overview / Supplier).
•	When the user clicks on “Risk Overview” in the breadcrumb, the system navigates back to the previous Risk Overview page.
This provides intuitive navigation for switching between high-level and detailed views.
________________________________________
5. High-Level Functionality of the Quality Risk Predictor
The Quality Risk Predictor offers multiple analytical and visualization capabilities to help users assess risk at various levels.
5.1 Cascading Filters
A cascading dropdown system is provided with the following filter categories:
1.	Business Group
2.	Business Unit
3.	Country
4.	Plant
5.	Time Period
Users can select any combination of these filters and click Apply Filter.
Once applied, the system displays the overall risk overview based on:
•	Supplier Risk
•	Compliance Risk
•	Performance Risk
5.2 Risk Breakdown by Hierarchy Levels
Below the charts, users can explore granular insights by switching between hierarchical tabs:
•	Business Group
•	Business Unit
•	Country
•	Plant
For each tab:
•	Data is displayed using corollas-style charts or cards.
•	Items are shown in descending order of risk score.
•	Users can switch between Supplier, Compliance, and Performance risk types to view top contributors (e.g., top plants, top countries).
5.3 Overall Comparative Analysis
At the bottom of the page, an Overall Comparative Analysis table provides a consolidated view of risk data.
Users can click the Risk arrow button for any item (Supplier / Performance / Compliance) to view:
•	Trend analysis
•	Summary-level analysis
•	Multiple drill-down analytical views
This section helps users perform deeper, comparative evaluation across risk categories.

