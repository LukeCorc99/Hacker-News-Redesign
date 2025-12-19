import { Page } from "@playwright/test";
import { SELECTORS, TEST_CREDENTIALS, WAITS } from "./fixtures";

export const navigateHome = async (page: Page) => {
  await page.goto("/");
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(WAITS.pageLoad);
};

export const loginUser = async (page: Page) => {
  const userBtn = page.getByTestId(SELECTORS.userMenu.testId);
  await userBtn.click();

  const loginBtn = page.getByTestId(SELECTORS.dropdownLogin.testId);
  await loginBtn.click();

  const usernameInput = page.getByTestId(SELECTORS.authUsername.testId);
  const passwordInput = page.getByTestId(SELECTORS.authPassword.testId);
  const submitBtn = page.getByTestId(SELECTORS.authSubmit.testId);

  await usernameInput.fill(TEST_CREDENTIALS.username);
  await passwordInput.fill(TEST_CREDENTIALS.password);
  await submitBtn.click();

  await page.waitForTimeout(WAITS.loginCompletion);
};

export const switchToFeed = async (page: Page, feedName: string) => {
  const feedButton = SELECTORS.feedButton(page);
  await feedButton.click();

  const option = page.locator('[role="option"]').filter({ hasText: feedName });
  await option.click();

  await page.waitForTimeout(WAITS.feedSwitch);
};

export const getPostCard = (page: Page, title: string) =>
  page.locator('[data-testid="post-card"]').filter({ hasText: title });

export const submitPost = async (
  page: Page,
  title: string,
  url?: string,
  text?: string,
) => {
  const submitBtn = page.getByTestId(SELECTORS.submit.testId);
  await submitBtn.click();

  const titleInput = page.getByTestId(SELECTORS.submitTitle.testId);
  await titleInput.fill(title);

  if (url) {
    const urlInput = page.getByTestId(SELECTORS.submitUrl.testId);
    await urlInput.fill(url);
  }

  if (text) {
    const textInput = page.getByTestId(SELECTORS.submitText.testId);
    await textInput.fill(text);
  }

  const submitPostBtn = page.getByTestId(SELECTORS.submitPost.testId);
  await submitPostBtn.click();
};

export const openAuthModal = async (page: Page) => {
  const userBtn = page.getByTestId(SELECTORS.userMenu.testId);
  await userBtn.click();

  const loginBtn = page.getByTestId(SELECTORS.dropdownLogin.testId);
  await loginBtn.click();
};

export const openRegisterModal = async (page: Page) => {
  const userBtn = page.getByTestId(SELECTORS.userMenu.testId);
  await userBtn.click();

  const registerBtn = page.getByTestId(SELECTORS.dropdownRegister.testId);
  await registerBtn.click();
};

export const fillAuthForm = async (
  page: Page,
  username: string,
  password: string,
  confirmPassword?: string,
) => {
  const usernameInput = page.getByTestId(SELECTORS.authUsername.testId);
  const passwordInput = page.getByTestId(SELECTORS.authPassword.testId);

  await usernameInput.fill(username);
  await passwordInput.fill(password);

  if (confirmPassword !== undefined) {
    const confirmPasswordInput = page.getByTestId(
      SELECTORS.authConfirmPassword.testId,
    );
    await confirmPasswordInput.fill(confirmPassword);
  }

  const submitBtn = page.getByTestId(SELECTORS.authSubmit.testId);
  await submitBtn.click();
};

export const closeOverlay = async (page: Page, position = { x: 0, y: 0 }) => {
  await page.click("body", { position });
};

export const setMobileViewport = async (page: Page) => {
  await page.setViewportSize({ width: 500, height: 720 });
  await page.waitForTimeout(WAITS.mobileSearch);
};

export const getMobileSearchInput = (page: Page) => {
  return page.locator(
    '[class*="mobileSearchWrapper"] input[placeholder="Search posts..."]',
  );
};
