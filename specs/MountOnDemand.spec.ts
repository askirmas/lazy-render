import puppeteer, { Browser, Page } from 'puppeteer'

let browser: Browser
, page: Page

beforeAll(async done => {
  browser = await puppeteer.launch({
    headless: true
  })
  page = (await browser.pages())[0];
  return done()
})
afterAll(() => browser.close())

describe('index', () => {
  beforeAll(async done => {
    await page.goto(`file://${process.cwd()}/out/MountOnDemand.html`, {waitUntil: "domcontentloaded"})
    return done()
  })
  it('no children', () => expect(
      page.$$eval('.works .child', ({length}) => length)
  ).resolves.toBe(0))
  it('check', async () => {
    const input = await page.$('input')
    if (!input)
      return expect(input).not.toBe(null)
    return expect(input.click()).resolves.toBe(undefined)
  })
  it('all children are visible', () => expect(
    page.waitForSelector('.dn > .child')
    .then(() =>
      page.$$eval('.child', ({length}) => length)
    )
  ).resolves.toBe(3))
})
