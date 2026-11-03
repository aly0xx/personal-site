import { expect, test, type Page } from "@playwright/test"

function collectErrors(page: Page) {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text())
  })
  return errors
}

async function expectNoPageOverflow(page: Page) {
  // A phone zooms out to fit wide content, which grows innerWidth along with it.
  expect(await page.evaluate(() => window.innerWidth)).toBe(page.viewportSize()?.width)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
}

test("homepage keeps its original content", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1, name: "Aly Hassan Youssef" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Some things about me:" })).toBeVisible()
  await expect(page.getByRole("heading", { name: "Some of the things I'm interested in:" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Teach Me Gcse" })).toHaveAttribute("href", "https://www.teachmegcse.com")
  await expectNoPageOverflow(page)
})

test("the site uses its colours, not plain white", async ({ page }) => {
  await page.goto("/")
  const styles = await page.evaluate(() => ({
    background: getComputedStyle(document.body).backgroundColor,
    band: getComputedStyle(document.body, "::before").backgroundImage,
    title: getComputedStyle(document.querySelector("h1") as Element).color,
    link: getComputedStyle(document.querySelector("main a") as Element).color,
  }))
  expect(styles.background).toBe("rgb(247, 240, 225)")
  expect(styles.band).toContain("linear-gradient")
  expect(styles.title).toBe("rgb(30, 89, 69)")
  expect(styles.link).toBe("rgb(178, 64, 31)")
})

test("the reading list shows every book, newest first, with covers loaded", async ({ page }) => {
  const errors = collectErrors(page)
  await page.goto("/reading")
  const titles = page.locator(".book-title")
  await expect(titles).toHaveCount(17)
  await expect(titles.first()).toHaveText("The Fever Code")
  await expect(page.locator(".shelf-book")).toHaveCount(17)

  const firstThumb = page.locator("img.book-thumb").first()
  await firstThumb.scrollIntoViewIfNeeded()
  await expect.poll(() => firstThumb.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)

  await expectNoPageOverflow(page)
  expect(errors).toEqual([])
})

test("clicking a spine opens the book, clicking again puts it back", async ({ page }) => {
  await page.goto("/reading")
  const book = page.getByRole("button", { name: /^Liftoff by Eric Berger/ })
  const cover = book.locator(".shelf-cover")
  const coverAngle = () =>
    cover.evaluate((el) => {
      const matrix = new DOMMatrix(getComputedStyle(el).transform)
      return Math.round((Math.acos(matrix.m11) * 180) / Math.PI)
    })

  await expect.poll(coverAngle).toBe(90)

  await book.click()
  await expect(page).toHaveURL(/\/reading\/liftoff$/)
  await expect(book).toHaveAttribute("aria-pressed", "true")
  await expect.poll(coverAngle).toBe(30)
  await expect(page.locator(".book-title")).toHaveCount(1)
  await expect(page).toHaveTitle("Liftoff | Books")

  await book.click()
  await expect(page).toHaveURL(/\/reading$/)
  await expect(book).toHaveAttribute("aria-pressed", "false")
  await expect.poll(coverAngle).toBe(90)
  await expect(page.locator(".book-title")).toHaveCount(17)
})

test("a book's own URL loads with that book open", async ({ page }) => {
  await page.goto("/reading/wright")
  await expect(page.getByRole("button", { name: /^The Wright Brothers/ })).toHaveAttribute("aria-pressed", "true")
  await expect(page.getByRole("heading", { name: "Summary" })).toBeVisible()
  await expectNoPageOverflow(page)
})

test("the open book is scrolled into view on the shelf", async ({ page }) => {
  await page.goto("/reading/wool")
  const open = page.locator('.shelf-book[data-open="true"]')
  await expect(open).toBeInViewport({ ratio: 0.9 })
})

test("Junglekeeper and 1984 use their real covers", async ({ page }) => {
  await page.goto("/reading/junglekeeper")
  await expect(page.locator("img.book-thumb")).toHaveAttribute("src", "/covers/junglekeeper.jpg")
  await page.goto("/reading/1984")
  await expect(page.locator("img.book-thumb")).toHaveAttribute("src", "/covers/1984.jpg")
})

test("search filters the reading list", async ({ page }) => {
  await page.goto("/reading")
  await page.getByPlaceholder("Search books...").fill("howey")
  await expect(page.locator(".book-title")).toHaveText(["Shift", "Wool"])
  await page.getByPlaceholder("Search books...").fill("zzzz")
  await expect(page.getByText("No results")).toBeVisible()
})

test("the shelf ends at its last book, with no empty space to scroll into", async ({ page }) => {
  await page.goto("/reading")
  const row = page.locator(".shelf-row")
  await row.evaluate((el) => el.scrollTo({ left: el.scrollWidth }))
  const gap = await row.evaluate((el) => {
    const last = el.querySelector(".shelf-book:last-child") as Element
    return Math.round(el.getBoundingClientRect().right - last.getBoundingClientRect().right)
  })
  expect(gap).toBeLessThanOrEqual(0)
})

test("the shelf arrow slides the shelf", async ({ page, isMobile }) => {
  test.skip(isMobile, "Phones swipe the shelf directly")
  await page.goto("/reading")
  const row = page.locator(".shelf-row")
  await expect(page.locator(".shelf-arrow-left")).toHaveCount(0)
  const arrow = page.getByRole("button", { name: "Scroll the shelf right" })
  await arrow.hover()
  await page.mouse.down()
  await expect.poll(() => row.evaluate((el) => el.scrollLeft)).toBeGreaterThan(50)
  await page.mouse.up()
  await expect(page.getByRole("button", { name: "Scroll the shelf left" })).toBeVisible()
})

test("a spine can be opened from the keyboard", async ({ page, isMobile }) => {
  test.skip(isMobile, "No keyboard on a phone")
  await page.goto("/reading")
  await page.getByRole("button", { name: /^The Fever Code/ }).focus()
  await page.keyboard.press("Enter")
  await expect(page).toHaveURL(/\/reading\/fever-code$/)
})

test("the library lists every book and can be searched", async ({ page }) => {
  await page.goto("/library")
  await expect(page.locator(".library .shelf-book")).toHaveCount(143)
  await expectNoPageOverflow(page)
  await page.getByPlaceholder("Search books...").fill("tolkien")
  await expect(page.locator(".library .shelf-book")).toHaveCount(4)
  await expectNoPageOverflow(page)
})

test("clicking a library book shows its cover, and only one stays open", async ({ page }) => {
  await page.goto("/library")
  const hobbit = page.getByRole("button", { name: /^The Hobbit by/ })
  const shoeDog = page.getByRole("button", { name: /^Shoe Dog by/ })

  await hobbit.click()
  await expect(hobbit).toHaveAttribute("aria-pressed", "true")
  const image = hobbit.locator(".shelf-cover img")
  await expect(image).toHaveAttribute("src", /the-hobbit/)
  await expect.poll(() => image.evaluate((img: HTMLImageElement) => img.naturalWidth)).toBeGreaterThan(0)
  await expect.poll(() =>
    hobbit.locator(".shelf-cover").evaluate((el) => Math.round((Math.acos(new DOMMatrix(getComputedStyle(el).transform).m11) * 180) / Math.PI))
  ).toBe(30)
  await page.screenshot({ path: test.info().outputPath("library-open.png") })

  await shoeDog.click()
  await expect(shoeDog).toHaveAttribute("aria-pressed", "true")
  await expect(hobbit).toHaveAttribute("aria-pressed", "false")

  await shoeDog.click()
  await expect(shoeDog).toHaveAttribute("aria-pressed", "false")
})

test("opening a library book only moves books on its own row", async ({ page }) => {
  await page.goto("/library")
  const rows = page.locator(".library .shelf-row")
  const layout = () =>
    page.locator(".library .shelf-row").evaluateAll((elements) =>
      elements.map((row) => ({
        top: Math.round(row.getBoundingClientRect().top + window.scrollY),
        books: [...row.querySelectorAll(".shelf-book")].map((book) => book.getAttribute("aria-label")),
        lefts: [...row.querySelectorAll(".shelf-book")].map((book) => Math.round(book.getBoundingClientRect().left)),
      }))
    )

  const before = await layout()
  // The last book on a row has the furthest to slide to stay in view.
  const book = rows.nth(2).locator(".shelf-book").last()
  await book.click()
  await page.waitForTimeout(1200)
  const after = await layout()

  expect(after.map((row) => [row.top, row.books])).toEqual(before.map((row) => [row.top, row.books]))
  expect(after.filter((_, i) => i !== 2).map((row) => row.lefts)).toEqual(before.filter((_, i) => i !== 2).map((row) => row.lefts))
  await expect(book.locator(".shelf-cover")).toBeInViewport({ ratio: 0.99 })
  await expectNoPageOverflow(page)

  await book.click()
  await page.waitForTimeout(1200)
  expect(await layout()).toEqual(before)
})

test("library spines take their colour from the book's cover", async ({ page }) => {
  await page.goto("/library")
  const book = page.getByRole("button", { name: /^Shoe Dog by/ })
  // The Shoe Dog cover is almost all red.
  const [red, green] = await book.locator(".shelf-spine").evaluate((el) => {
    const [r, g] = getComputedStyle(el).backgroundColor.match(/\d+/g)!.map(Number)
    return [r, g]
  })
  expect(red).toBeGreaterThan(green + 80)
})

test("every library cover file exists", async ({ page, request }) => {
  await page.goto("/library")
  const sources = await page.locator(".library img").evaluateAll((images) => images.map((img) => img.getAttribute("src")))
  expect(sources.length).toBeGreaterThan(120)
  for (const src of new Set(sources)) {
    expect((await request.get(src as string)).status(), String(src)).toBe(200)
  }
})

test("a book with no cover image falls back to a typed cover", async ({ page }) => {
  await page.goto("/library")
  const book = page.getByRole("button", { name: /^Some Stephen Hawking books/ })
  await book.click()
  await expect(book.locator(".typed-cover")).toContainText("Some Stephen Hawking books")
})

test("the deep dives links reach their page", async ({ page }) => {
  await page.goto("/")
  await page.locator("main").getByRole("link", { name: "deep dives" }).click()
  await expect(page).toHaveURL(/\/deep-dives$/)
  await expect(page.getByRole("heading", { level: 1, name: "Deep Dives" })).toBeVisible()
  await expect(page.locator('nav:visible a[aria-current="page"]')).toHaveText("Deep Dives")
  await expectNoPageOverflow(page)
})

test("navigation marks the current page", async ({ page }) => {
  await page.goto("/library")
  await expect(page.locator('nav:visible a[aria-current="page"]')).toHaveText("Library")
  await page.locator("nav:visible").getByRole("link", { name: "Reading" }).click()
  await expect(page).toHaveURL(/\/reading$/)
  await expect(page.locator('nav:visible a[aria-current="page"]')).toHaveText("Reading")
})

test("screenshots for visual review", async ({ page }, info) => {
  for (const [name, path] of [["home", "/"], ["reading", "/reading"], ["book", "/reading/siddhartha"], ["library", "/library"]]) {
    await page.goto(path)
    await page.waitForTimeout(900)
    await page.screenshot({ path: info.outputPath(`${name}.png`) })
  }
})
