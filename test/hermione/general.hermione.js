const { assert } = require('chai');

let bug_id = '';

if (process.env.BUG_ID !== undefined) {
  bug_id = process.env.BUG_ID;
}

describe('Общие требования:', async () => {
  const windowSizes = [1399, 1199, 991, 767, 575];
  windowSizes.forEach((w) => adaptivePage(w));
  function adaptivePage(width) {
    it(`Адаптивная верстка при ширине экрана ${width + 1}`, async ({ browser }) => {
      const puppeteer = await browser.getPuppeteer();
      const [page] = await puppeteer.pages();

      await page.goto('http://localhost:3000/hw/store');
      await page.setViewport({ width: width, height: 1080 });

      await page.waitForSelector('.Application', { timeout: 2000 });

      await browser.assertView(`plain${width + 1}`, '.Application', {
        screenshotDelay: 100,
      });
    });
  }

  it('На ширине меньше 576px навигационное меню должно скрываться за гамбургер', async ({ browser }) => {
    await browser.setWindowSize(575, 500);
    await browser.url(`http://localhost:3000/hw/store?bug_id=${bug_id}`);

    const page = await browser.$('.Application');
    await page.waitForExist();

    const appToggler = await browser.$('.Application-Toggler');
    const appMenu = await browser.$('.Application-Menu');

    assert.equal(await appToggler.isDisplayed(), true, 'Гамбургер должен появиться');
    assert.equal(await appMenu.isDisplayed(), false, 'Навигационное меню должно скрыться');
  });

  it('При выборе элемента из меню "гамбургера", меню должно закрываться', async ({ browser }) => {
    await browser.setWindowSize(575, 500);
    await browser.url(`http://localhost:3000/hw/store?bug_id=${bug_id}`);

    const page = await browser.$('.Application');
    await page.waitForExist();

    const appToggler = await browser.$('.Application-Toggler');
    const appMenu = await browser.$('.Application-Menu');

    assert.equal(await appToggler.isDisplayed(), true, 'Гамбургер должен появиться');

    await appToggler.click();
    assert.equal(await appMenu.isDisplayed(), true, 'Меню должно открыться при клике на гамбургер');

    await appMenu.click();
    assert.equal(await appMenu.isDisplayed(), false, 'Меню должно закрыться при выборе элемента');
  });
});
