The **Cortex Backend** is the intelligent, headless API core of the CMS, designed for high **scalability** and **decoupling** content from presentation. Its main functions are:

1.  **Content Management:** Handling all CRUD operations for posts, authors, and media.
2.  **Authentication:** Securing all endpoints and managing user roles.

It uses a modular architecture, defines key entities (Post, Author, Insight Metric), and exposes dedicated API endpoints for content and insights. It is designed for containerized deployment using environment variables for configuration.
