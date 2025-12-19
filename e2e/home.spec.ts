import { test, expect } from "@playwright/test";
import {
  navigateHome,
  loginUser,
  switchToFeed,
  getPostCard,
  submitPost,
  openAuthModal,
  openRegisterModal,
  fillAuthForm,
  closeOverlay,
  setMobileViewport,
  getMobileSearchInput,
} from "./helpers";
import { TEST_CREDENTIALS, URLS, WAITS, SELECTORS } from "./fixtures";

test.describe("Post Management", () => {
  test.beforeEach(async ({ page }) => {
    await navigateHome(page);
  });

  test("user can submit a post successfully", async ({ page }) => {
    await loginUser(page);
    await submitPost(page, "New Frontend Framework", URLS.framework);

    const successMsg = page.locator("text=Post submitted successfully");
    await expect(successMsg).toBeVisible();
  });

  test("user can see their submitted post on new feed", async ({ page }) => {
    await loginUser(page);
    const postTitle = "React Performance Tips";

    await submitPost(page, postTitle, URLS.reactTips);
    await page.waitForTimeout(WAITS.feedSwitch);
    await switchToFeed(page, "New");
    await page.waitForTimeout(WAITS.feedSwitch);

    const userPost = getPostCard(page, postTitle);
    await expect(userPost).toBeVisible({ timeout: WAITS.postLoading });
    await expect(userPost).toContainText("by testuser");
  });

  test("user can edit their post successfully", async ({ page }) => {
    await loginUser(page);
    const originalTitle = "Original Post Title";
    const editedTitle = "Edited Post Title";

    await submitPost(page, originalTitle, URLS.original);
    await page.waitForTimeout(WAITS.editCompletion);
    await switchToFeed(page, "New");
    await page.waitForTimeout(WAITS.editCompletion);

    const userPost = getPostCard(page, originalTitle);
    await expect(userPost).toBeVisible({ timeout: WAITS.postLoading });

    const editBtn = userPost.locator('button[aria-label="Edit post"]');
    await editBtn.click();

    const titleInput = page.getByTestId(SELECTORS.submitTitle.testId);
    const urlInput = page.getByTestId(SELECTORS.submitUrl.testId);
    const saveBtn = page.getByTestId(SELECTORS.submitPost.testId);

    await titleInput.clear();
    await titleInput.fill(editedTitle);
    await urlInput.clear();
    await urlInput.fill(URLS.edited);
    await saveBtn.click();

    await page.waitForTimeout(WAITS.pageLoad);

    const editedPost = getPostCard(page, editedTitle);
    await expect(editedPost).toBeVisible({ timeout: WAITS.postLoading });
    await expect(editedPost).toContainText("by testuser");
  });

  test("user can delete their post successfully", async ({ page }) => {
    await loginUser(page);
    const postTitle = "Post to Delete Successfully";

    await submitPost(page, postTitle, URLS.deleteMe);
    await page.waitForTimeout(WAITS.feedSwitch);
    await switchToFeed(page, "New");
    await page.waitForTimeout(WAITS.feedSwitch);

    const userPost = getPostCard(page, postTitle);
    await expect(userPost).toBeVisible({ timeout: WAITS.postLoading });

    const deleteBtn = userPost.locator('button[aria-label="Delete post"]');
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    await deleteBtn.click();
    await page.waitForTimeout(WAITS.deleteCompletion);

    const deletedPost = getPostCard(page, postTitle);
    await expect(deletedPost).not.toBeVisible();
  });
});

test.describe("Header", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test.describe("User Menu - Logged Out", () => {
    test("should open dropdown when user menu clicked", async ({ page }) => {
      const userBtn = page.getByTestId(SELECTORS.userMenu.testId);
      await userBtn.click();

      const loginBtn = page.getByTestId(SELECTORS.dropdownLogin.testId);
      const registerBtn = page.getByTestId(SELECTORS.dropdownRegister.testId);

      await expect(loginBtn).toBeVisible();
      await expect(registerBtn).toBeVisible();
    });

    test("should close dropdown when clicking outside", async ({ page }) => {
      const userBtn = page.getByTestId(SELECTORS.userMenu.testId);
      await userBtn.click();

      let loginBtn = page.getByTestId(SELECTORS.dropdownLogin.testId);
      await expect(loginBtn).toBeVisible();

      await closeOverlay(page);

      loginBtn = page.getByTestId(SELECTORS.dropdownLogin.testId);
      await expect(loginBtn).not.toBeVisible();
    });
  });

  test.describe("Submit Post Button - Logged Out", () => {
    test("should open login modal when Submit Post clicked while logged out", async ({
      page,
    }) => {
      const submitBtn = page.getByTestId(SELECTORS.submit.testId);
      await submitBtn.click();

      const loginModal = page.locator("text=Login").first();
      await expect(loginModal).toBeVisible();
    });
  });

  test.describe("Login Flow", () => {
    test("should log in user and show Log out option", async ({ page }) => {
      await openAuthModal(page);
      await fillAuthForm(
        page,
        TEST_CREDENTIALS.username,
        TEST_CREDENTIALS.password,
      );

      await page.waitForTimeout(WAITS.loginCompletion);

      const userMenuBtn = page.getByTestId(SELECTORS.userMenu.testId);
      await userMenuBtn.click();

      const logoutBtn = page.getByTestId(SELECTORS.dropdownLogout.testId);
      await expect(logoutBtn).toBeVisible();
      await expect(logoutBtn).toContainText("Log out");
    });

    test("should show Submit Post modal after login from Submit Post button", async ({
      page,
    }) => {
      const submitBtn = page.getByTestId(SELECTORS.submit.testId);
      await submitBtn.click();

      await fillAuthForm(
        page,
        TEST_CREDENTIALS.username,
        TEST_CREDENTIALS.password,
      );

      await page.waitForTimeout(WAITS.loginCompletion);

      const submitPostModal = page.locator("text=Submit").first();
      await expect(submitPostModal).toBeVisible();
    });
  });
});

test.describe("Post Feed", () => {
  test.beforeEach(async ({ page }) => {
    await navigateHome(page);
    await page.getByTestId(SELECTORS.postCard.testId).first().waitFor({
      timeout: WAITS.postLoading,
    });
  });

  test.describe("Feed Selection", () => {
    test("should display Top feed by default", async ({ page }) => {
      const feedButton = SELECTORS.feedButton(page);
      await expect(feedButton).toBeVisible();
      await expect(feedButton).toContainText("Top");

      const posts = page.locator('[data-testid="post-card"]');
      await expect(posts.first()).toBeVisible();
    });

    test("should change feeds when selected", async ({ page }) => {
      await switchToFeed(page, "New");

      const feedButton = SELECTORS.feedButton(page);
      await expect(feedButton).toContainText("New");

      const posts = page.locator('[data-testid="post-card"]');
      await expect(posts.first()).toBeVisible();
    });
  });

  test.describe("View Modes", () => {
    test("should switch to grid view when clicked", async ({ page }) => {
      const gridBtn = page.getByTestId(SELECTORS.viewGrid.testId);
      await gridBtn.click();

      await expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    });

    test("should maintain view mode when changing feeds", async ({ page }) => {
      const gridBtn = page.getByTestId(SELECTORS.viewGrid.testId);
      await gridBtn.click();

      await expect(gridBtn).toHaveAttribute("aria-pressed", "true");

      await switchToFeed(page, "New");
      await page
        .getByTestId(SELECTORS.postCard.testId)
        .first()
        .waitFor({ timeout: WAITS.postLoading });

      await expect(gridBtn).toHaveAttribute("aria-pressed", "true");
    });
  });

  test.describe("Post Display", () => {
    test("should display posts with all metadata", async ({ page }) => {
      const firstPost = page.getByTestId(SELECTORS.postCard.testId).first();
      await expect(firstPost).toBeVisible();

      const title = firstPost.locator("a").first();
      await expect(title).toBeVisible();
      await expect(title).toHaveAttribute("target", "_blank");

      await expect(firstPost).toContainText("points");
      await expect(firstPost).toContainText("by");
    });
  });

  test.describe("Search Functionality", () => {
    test.beforeEach(async ({ page }) => {
      await navigateHome(page);
      await page.getByTestId(SELECTORS.postCard.testId).first().waitFor({
        timeout: WAITS.postLoading,
      });
    });

    test("should search for posts and display results", async ({ page }) => {
      const searchInput = SELECTORS.searchInput(page);
      await searchInput.fill("React");
      await searchInput.press("Enter");

      await page.waitForTimeout(WAITS.pageLoad);

      const posts = page.locator('[data-testid="post-card"]');
      const firstPost = posts.first();
      await expect(firstPost).toBeVisible();

      const postText = await firstPost.textContent();
      expect(postText?.toLowerCase()).toContain("react");
    });

    test("should display no results message when search yields nothing", async ({
      page,
    }) => {
      const searchInput = SELECTORS.searchInput(page);
      await searchInput.fill("xyzabc123notarealpost");
      await searchInput.press("Enter");

      await page.waitForTimeout(3000);

      const emptyDiv = page.locator('[class*="empty"]');
      await expect(emptyDiv).toBeVisible({ timeout: WAITS.searchLoading });
      await expect(emptyDiv).toContainText("No stories found");
    });

    test("should paginate through search results", async ({ page }) => {
      const searchInput = SELECTORS.searchInput(page);
      await searchInput.fill("JavaScript");
      await searchInput.press("Enter");

      await page.waitForTimeout(WAITS.pageLoad);

      const nextBtn = page.locator("button").filter({ hasText: /^Next/ });

      if ((await nextBtn.count()) > 0 && (await nextBtn.isEnabled())) {
        const firstPagePost = page
          .getByTestId(SELECTORS.postCard.testId)
          .first();
        const firstPageText = await firstPagePost.textContent();

        await nextBtn.click();
        await page.waitForTimeout(WAITS.pageLoad);

        const secondPagePost = page
          .getByTestId(SELECTORS.postCard.testId)
          .first();
        const secondPageText = await secondPagePost.textContent();

        expect(firstPageText).not.toEqual(secondPageText);
      }
    });
  });
});

test.describe("Auth Validation", () => {
  test.beforeEach(async ({ page }) => {
    await navigateHome(page);
  });

  test("should show error when submitting form with empty username", async ({
    page,
  }) => {
    await openAuthModal(page);

    const passwordInput = page.getByTestId(SELECTORS.authPassword.testId);
    const submitBtn = page.getByTestId(SELECTORS.authSubmit.testId);

    await passwordInput.fill(TEST_CREDENTIALS.password);
    await submitBtn.click();

    const errorMsg = page.locator("text=Username is required");
    await expect(errorMsg).toBeVisible();
  });

  test("should show error when submitting form with empty password", async ({
    page,
  }) => {
    await openAuthModal(page);

    const usernameInput = page.getByTestId(SELECTORS.authUsername.testId);
    const submitBtn = page.getByTestId(SELECTORS.authSubmit.testId);

    await usernameInput.fill(TEST_CREDENTIALS.username);
    await submitBtn.click();

    const errorMsg = page.locator("text=Password is required");
    await expect(errorMsg).toBeVisible();
  });

  test("should show error when register passwords do not match", async ({
    page,
  }) => {
    await openRegisterModal(page);

    await fillAuthForm(page, "newuser", "password123", "differentpassword");

    const errorMsg = page.locator("text=Passwords do not match");
    await expect(errorMsg).toBeVisible();
  });

  test("should show error when register password is too short", async ({
    page,
  }) => {
    await openRegisterModal(page);

    await fillAuthForm(page, "newuser", "pass", "pass");

    const errorMsg = page.locator(
      "text=Password must be at least 6 characters",
    );
    await expect(errorMsg).toBeVisible();
  });
});

test.describe("Post Submission Validation", () => {
  test.beforeEach(async ({ page }) => {
    await navigateHome(page);
  });

  test("should show error when submitting post without title", async ({
    page,
  }) => {
    await loginUser(page);

    const submitBtn = page.getByTestId(SELECTORS.submit.testId);
    await submitBtn.click();

    const submitPostBtn = page.getByTestId(SELECTORS.submitPost.testId);
    await submitPostBtn.click();

    const errorMsg = page.locator("text=Title is required");
    await expect(errorMsg).toBeVisible();
  });

  test("should show error when title is less than 3 characters", async ({
    page,
  }) => {
    await loginUser(page);

    const submitBtn = page.getByTestId(SELECTORS.submit.testId);
    await submitBtn.click();

    const titleInput = page.getByTestId(SELECTORS.submitTitle.testId);
    const submitPostBtn = page.getByTestId(SELECTORS.submitPost.testId);

    await titleInput.fill("ab");
    await submitPostBtn.click();

    const errorMsg = page.locator("text=Title must be at least 3 characters");
    await expect(errorMsg).toBeVisible();
  });

  test("should show error when neither URL nor text is provided", async ({
    page,
  }) => {
    await loginUser(page);

    const submitBtn = page.getByTestId(SELECTORS.submit.testId);
    await submitBtn.click();

    const titleInput = page.getByTestId(SELECTORS.submitTitle.testId);
    const submitPostBtn = page.getByTestId(SELECTORS.submitPost.testId);

    await titleInput.fill("Valid Title");
    await submitPostBtn.click();

    const errorMsg = page.locator("text=Please provide either a URL or text");
    await expect(errorMsg).toBeVisible();
  });

  test("should show error when URL is invalid", async ({ page }) => {
    await loginUser(page);

    const submitBtn = page.getByTestId(SELECTORS.submit.testId);
    await submitBtn.click();

    const titleInput = page.getByTestId(SELECTORS.submitTitle.testId);
    const urlInput = page.getByTestId(SELECTORS.submitUrl.testId);
    const submitPostBtn = page.getByTestId(SELECTORS.submitPost.testId);

    await titleInput.fill("Valid Title");
    await urlInput.fill("not-a-valid-url");
    await submitPostBtn.click();

    const errorMsg = page.locator("text=Please enter a valid URL");
    await expect(errorMsg).toBeVisible();
  });

  test("should submit post with text but no URL", async ({ page }) => {
    await loginUser(page);
    await submitPost(
      page,
      "Text Only Post",
      undefined,
      "This is a discussion post without a URL",
    );

    const successMsg = page.locator("text=Post submitted successfully");
    await expect(successMsg).toBeVisible();
  });
});

test.describe("Modal Closure", () => {
  test.beforeEach(async ({ page }) => {
    await navigateHome(page);
  });

  test("should close auth modal when close button is clicked", async ({
    page,
  }) => {
    await openAuthModal(page);

    const closeBtn = page.getByTestId(SELECTORS.closeAuthModal.testId);
    await closeBtn.click();

    const authModal = page.getByTestId(SELECTORS.closeAuthModal.testId);
    await expect(authModal).not.toBeVisible();
  });

  test("should close submit modal when close button is clicked", async ({
    page,
  }) => {
    await loginUser(page);

    const submitBtn = page.getByTestId(SELECTORS.submit.testId);
    await submitBtn.click();

    const closeBtn = page.getByTestId(SELECTORS.closeSubmitModal.testId);
    await closeBtn.click();

    const submitModal = page.getByTestId(SELECTORS.closeSubmitModal.testId);
    await expect(submitModal).not.toBeVisible();
  });

  test("should close auth modal when clicking outside overlay", async ({
    page,
  }) => {
    await openAuthModal(page);
    await closeOverlay(page);

    const authModal = page.getByTestId(SELECTORS.closeAuthModal.testId);
    await expect(authModal).not.toBeVisible();
  });
});

test.describe("Mobile Search", () => {
  test.beforeEach(async ({ page }) => {
    await navigateHome(page);
  });

  test("should toggle mobile search on small screens", async ({ page }) => {
    await setMobileViewport(page);
    await page.waitForTimeout(1000);

    const mobileSearchToggle = page.getByTestId(
      SELECTORS.mobileSearchToggle.testId,
    );
    await expect(mobileSearchToggle).toBeVisible();

    await mobileSearchToggle.click();

    const mobileSearchInput = getMobileSearchInput(page);
    await expect(mobileSearchInput).toBeFocused();
  });
});

test.describe("Feed Navigation and Persistence", () => {
  test.beforeEach(async ({ page }) => {
    await navigateHome(page);
  });

  test("should navigate through different feeds and load content", async ({
    page,
  }) => {
    const feedButton = SELECTORS.feedButton(page);
    await feedButton.waitFor();
    await page.getByTestId(SELECTORS.postCard.testId).first().waitFor({
      timeout: WAITS.postLoading,
    });

    const feeds = ["New", "Ask", "Show", "Jobs"];

    for (const feed of feeds) {
      await feedButton.click();
      const option = page.locator('[role="option"]').filter({ hasText: feed });
      await option.click();

      await page.waitForTimeout(WAITS.feedSwitch);

      try {
        await page
          .getByTestId(SELECTORS.postCard.testId)
          .first()
          .waitFor({ timeout: WAITS.postLoading });
        await expect(feedButton).toContainText(feed);
      } catch {
        const emptyState = page.locator('[class*="empty"]');
        const hasEmptyState = await emptyState.isVisible().catch(() => false);
        if (!hasEmptyState) {
          throw new Error(`Failed to load ${feed} feed`);
        }
      }
    }
  });
});

test.describe("Pagination", () => {
  test.beforeEach(async ({ page }) => {
    await navigateHome(page);
    await page.getByTestId(SELECTORS.postCard.testId).first().waitFor({
      timeout: WAITS.postLoading,
    });
  });

  test("should paginate through regular feed results", async ({ page }) => {
    const nextBtn = page.locator("button").filter({ hasText: /^Next/ });
    const previousBtn = page.locator("button").filter({ hasText: /^Previous/ });

    const isNextEnabled = await nextBtn.isEnabled();

    if (isNextEnabled) {
      const firstPagePost = page.getByTestId(SELECTORS.postCard.testId).first();
      const firstPageText = await firstPagePost.textContent();

      await nextBtn.click();
      await page.waitForTimeout(WAITS.paginationDelay);

      const secondPagePost = page
        .getByTestId(SELECTORS.postCard.testId)
        .first();
      const secondPageText = await secondPagePost.textContent();

      expect(firstPageText).not.toEqual(secondPageText);

      const isPreviousEnabled = await previousBtn.isEnabled();
      expect(isPreviousEnabled).toBe(true);

      await previousBtn.click();
      await page.waitForTimeout(WAITS.paginationDelay);

      const backToFirstPost = page
        .getByTestId(SELECTORS.postCard.testId)
        .first();
      const backToFirstText = await backToFirstPost.textContent();

      expect(backToFirstText).toEqual(firstPageText);
    }
  });
});
