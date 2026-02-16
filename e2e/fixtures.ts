import { Page } from "@playwright/test";

export const TEST_CREDENTIALS = {
  username: "testuser",
  password: "password123",
};

export const SELECTORS = {
  userMenu: { testId: "user-menu" },
  submit: { testId: "submit" },
  dropdownLogin: { testId: "dropdown-login" },
  dropdownRegister: { testId: "dropdown-register" },
  dropdownLogout: { testId: "dropdown-logout" },
  authUsername: { testId: "auth-username" },
  authPassword: { testId: "auth-password" },
  authConfirmPassword: { testId: "auth-confirm-password" },
  authSubmit: { testId: "auth-submit" },
  submitTitle: { testId: "submit-title" },
  submitUrl: { testId: "submit-url" },
  submitText: { testId: "submit-text" },
  submitPost: { testId: "submit-post" },
  closeAuthModal: { testId: "close-auth-modal" },
  closeSubmitModal: { testId: "close-submit-modal" },
  postCard: { testId: "post-card" },
  mobileSearchToggle: { testId: "mobile-search-toggle" },
  viewGrid: { testId: "view-grid" },
  viewList: { testId: "view-list" },
  feedButton: (page: Page) => page.locator('button[aria-label="Choose feed"]'),
  searchInput: (page: Page) =>
    page.locator('input[placeholder="Search posts..."]'),
  mobileSearchInput: (page: Page) =>
    page.locator('input[placeholder="Search posts..."]'),
};

export const WAITS = {
  pageLoad: 2000,
  loginCompletion: 2000,
  feedSwitch: 2000,
  editCompletion: 4000,
  deleteCompletion: 1000,
  mobileSearch: 1000,
  paginationDelay: 1500,
  postLoading: 15000,
  searchLoading: 10000,
};

export const URLS = {
  framework: "https://example.com/framework",
  reactTips: "https://example.com/react-tips",
  original: "https://example.com/original",
  edited: "https://example.com/edited",
  deleteMe: "https://example.com/deleteme",
};
