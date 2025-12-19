# Hacker News Redesign

A modern redesign of the [Hacker News website](https://news.ycombinator.com/) using React, Vite and TypeScript. Find the website redesign here: (https://lukecorc99.github.io/HackerNewsAssignment/)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [Testing](#testing)
- [Notes/Assumptions](#notesassumptions)
- [Contributors](#contributors)

## Overview

This website redesign was built with the aim of presenting an improvement of the UI/UX of the original website through the use of modern web development technologies. The design aims to present user posts in a simple yet intuitive way, all while allowing the user to perform some of the original functionalities of the website such as post navigation, filtering, search, submission and management.

## Features

**1. Multiple Feed Types**
Browse through five different feed categories: Top, New, Ask HN, Show HN, and Jobs.

**2. Responsive Design**
Switch between list and grid view modes to suit your preference. Fully responsive design for desktop and mobile devices.

**3. Post Submission & Management**
Submit new posts and discussions. Edit or delete your own submissions. Posts are stored locally for persistence.

**4. User Authentication**
Register and log in with a simple authentication system. User sessions are managed locally.

**5. Search Functionality**
Search across posts in real-time with client-side filtering across up to 300 results.

**6. Pagination**
Navigate through posts with intuitive pagination controls supporting 30 posts per page.

**7. Comprehensive Testing**
Essential unit testing using Vitest and comprehensive end-to-end testing using Playwright.

## Tech Stack

- **Frontend Framework:** React 18 with TypeScript
- **State Management:** TanStack Query (React Query) for API data fetching
- **Styling:** CSS Modules for component-scoped styles
- **Testing:** Vitest for unit tests, Playwright for end-to-end tests
- **UI Components and Icons:** Radix UI (Select) for dropdown components, lucide-react for icons.
- **API:** Official Hacker News API (https://github.com/HackerNews/API)

# Architecture

The application follows a layered SPA architecture with clear separation of concerns: UI components handle rendering, Context API manages UI state, TanStack Query handles server state caching and pagination. Custom hooks combine Query with business logic, while a dedicated service layer abstracts API calls. TypeScript types are centralized for consistency across all layers.

## Installation

1. **Clone the repository:**

   ```
   git clone <repository-url>
   ```

2. **Navigate to the project directory:**

   ```
   cd hacker-news-assignment
   ```

3. **Install dependencies:**

   ```
   npm install
   ```

4. **Start the development server:**

   ```
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the port specified by Vite).

## Usage

1. **Browsing Posts**
   - Open the application and select a feed type from the dropdown (Top, New, Ask, Show, Jobs)
   - Posts are displayed in either list or grid view, toggled via the view mode buttons

2. **Searching**
   - Use the search bar to filter posts by title across the current feed
   - Search results are displayed with pagination

3. **User Submission**
   - Click "Submit Post" to open the submission modal
   - If not logged in, you'll be prompted to log in or register first
   - Fill in the title (required), URL (optional), and text (optional)
   - Submit your post to add it to the feed

4. **Authentication**
   - Click the user menu (top-right) to access login/register options
   - Create an account or log in.
   - Your session persists across browser sessions

5. **Managing Your Posts**
   - Your submitted posts appear at the top of the "New" feed
   - Click the edit or delete buttons on your posts to modify or remove them

## Testing

Within the root folder, run the unit test suite with:

```
npm run test
```

For end-to-end testing with Playwright:

```
npm run test:e2e
```

## Notes/Assumptions

**Technology Choices:**

- React 18 with TypeScript was chosen for type safety and rapid development. React 18 was used instead of React 19 due to widespread peer dependency conflicts in the ecosystem; many libraries and dependencies still declare compatibility only up to React 18, which caused CI/CD pipeline failures when attempting to use React 19.
- TanStack Query was chosen for automatic caching and state synchronization across components, rather than manual useState/useEffect boilerplate
- CSS Modules were chosen to leverage existing CSS knowledge, prioritizing focus on UX and correctness over exploring Tailwind CSS, although Tailwind CSS is a viable approach that would've been adopted if not for time constraints
- Vitest + React Testing Library was selected over Jest for superior Vite integration and faster test execution
- Playwright was chosen for E2E testing over Cypress due to better cross-browser support and React-optimized architecture

**Architectural Decisions:**

- Client-side localStorage is used for post persistence and user authentication rather than a backend server, suitable for this project's purpose of frontend demonstration
- Authentication is simplified (no password validation, registry tracking or backend verification) to demonstrate UI/UX flows rather than production-grade security
- The "Past" feed was omitted because the HackerNews API only returns the most recent 500 stories, making historical pagination impractical
- Search is implemented as client-side filtering rather than backend API integration, limiting results to 300 loaded items for performance

**User Features:**

- Users have the option to submit their own post, which are stored in localStorage and merged with API stories on the "new" feed.
- SessionStorage persists the selected feed type during a session (resets on browser close) while localStorage persists view mode and login state
- Post submissions support optional text fields that aren't displayed in the feed view; this feature was included to match HackerNews submission patterns

**Testing:**

- Unit tests focus on the API service layer and hook; QueryProvider component testing is omitted as it's a TanStack Query wrapper with no custom logic
- E2E tests are much more comprehensive than unit tests, using BDD-style test cases to cover user workflows (auth, navigation, post submission) rather than exhaustive UI coverage to avoid over-engineering
- Test coverage prioritizes critical user workflows and validation through E2E tests, while API failures and localStorage errors are covered by unit tests

## Contributors

Created by Luke Corcoran [@LukeCorc99](https://github.com/LukeCorc99)
