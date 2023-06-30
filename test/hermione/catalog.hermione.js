const { assert } = require('chai');
const axios = require('axios');

let bug_id = '';

if (process.env.BUG_ID !== undefined) {
  bug_id = process.env.BUG_ID;
}

describe('Каталог:', async () => {
  it('В каталоге должны отображаться товары, список которых приходит с сервера | Для каждого товара в каталоге отображается название, цена и ссылка на страницу с подробной информацией о товаре', async ({
    browser,
  }) => {
    browser.setWindowSize(1920, 1080);
    const response = await axios.get(`http://localhost:3000/hw/store/api/products?bug_id=${bug_id}`);
    const products = response.data;

    assert.equal(products.length > 0, true, 'С сервера должен прийти список товаров');

    await browser.url(`http://localhost:3000/hw/store/catalog?bug_id=${bug_id}`);

    for (let i = 0; i < 2; i++) {
      const item = await browser.$('.Catalog > .row:nth-child(2) > div[data-testid="' + i.toString() + '"]');

      const productName = item.$('.ProductItem-Name');
      const productPrice = item.$('.ProductItem-Price');
      const productDetails = item.$('.ProductItem-DetailsLink');

      assert.equal(
        (await productName.getText()) === `${products[i].name}`,
        true,
        'Название товара должно совпадать с данными на сервере',
      );
      assert.equal(
        (await productPrice.getText()) === `$${products[i].price}`,
        true,
        'Цена товара должна совпадать с данными на сервере',
      );
      assert.equal(
        (await productDetails.getAttribute('href')) === `/hw/store/catalog/${products[i].id}`,
        true,
        'Ссылка на страницу товара должна быть верной',
      );
    }
  });

  it('На странице с подробной информацией отображаются: название товара, его описание, цена, цвет, материал и кнопка "добавить в корзину"', async function ({
    browser,
  }) {
    browser.setWindowSize(1920, 1080);

    for (let i = 0; i < 2; i++) {
      const response = await axios.get(
        `http://localhost:3000/hw/store/api/products/${i.toString()}?bug_id=${bug_id}`,
      );

      const product = response.data;

      await browser.url(`http://localhost:3000/hw/store/catalog/${i.toString()}?bug_id=${bug_id}`);
      const item = await browser.$('.Product');
      const productName = await item.$('.ProductDetails-Name');
      const productPrice = await item.$('.ProductDetails-Price');
      const productDescr = await item.$('.ProductDetails-Description');
      const productColor = await item.$('.ProductDetails-Color');
      const productMaterial = await item.$('.ProductDetails-Material');
      const productAddBtn = await item.$('.ProductDetails-AddToCart');

      assert.equal(
        (await productName.getText()) === product.name,
        true,
        'Название товара должно совпадать с данными на сервере',
      );

      assert.equal(
        (await productDescr.getText()) === product.description,
        true,
        'Описание товара должно совпадать с данными на сервере',
      );

      assert.equal(
        (await productPrice.getText()) === '$' + product.price.toString(),
        true,
        'Цена товара должно совпадать с данными на сервере',
      );

      assert.equal(
        (await productColor.getText()).toString().toLowerCase() === product.color.toString().toLowerCase(),
        true,
        'Цвет товара должен совпадать с данными на сервере',
      );

      assert.equal(
        (await productMaterial.getText()).toString().toLowerCase() ===
          product.material.toString().toLowerCase(),
        true,
        'Цвет товара должен совпадать с данными на сервере',
      );

      assert.equal(
        (await productAddBtn.getText()) === 'Add to Cart',
        true,
        'Не правильный текст в кнопке "Добавить в корзину"',
      );
    }
  });

  it('На странице с подробной информацией отображается большой размер кнопки "добавить в корзину" ', async ({
    browser,
  }) => {
    browser.setWindowSize(1920, 1080);
    await browser.url(`http://localhost:3000/hw/store/catalog/0?bug_id=${bug_id}`);

    const page = await browser.$('.Application');
    await page.waitForExist();

    await browser.assertView('plainProduct', '.ProductDetails-AddToCart', {
      screenshotDelay: 1000,
      compositeImage: false,
    });
  });

  it('Содержимое корзины должно сохраняться между перезагрузками страницы', async ({ browser }) => {
    await browser.setWindowSize(1920, 1080);

    await browser.url(`http://localhost:3000/hw/store/catalog/0?bug_id=${bug_id}`);

    const page = await browser.$('.Application');
    await page.waitForExist();

    const appButton = await browser.$('.ProductDetails-AddToCart');
    await appButton.click();

    await browser.url(`http://localhost:3000/hw/store/cart?bug_id=${bug_id}`);

    const appCartNameBefore = await browser.$('.Cart-Table');
    browser.refresh();
    const appCartNameAfter = await browser.$('.Cart-Table');

    assert.equal(
      await appCartNameBefore.getText(),
      await appCartNameAfter.getText(),
      'Содержимое корзины должно сохраниться после перезагрузки',
    );
  });
});
