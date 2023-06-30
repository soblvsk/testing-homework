const { assert } = require('chai');
const axios = require('axios');

let bug_id = '';

if (process.env.BUG_ID !== undefined) {
  bug_id = process.env.BUG_ID;
}

describe('Корзина:', async () => {
  it('При оформление заказа должно появиться зеленое окно', async ({ browser }) => {
    browser.setWindowSize(1920, 1080);
    await browser.url(`http://localhost:3000/hw/store/catalog/0?bug_id=${bug_id}`);

    const page = await browser.$('.Application');
    await page.waitForExist();

    await browser.$('.ProductDetails-AddToCart').click();

    await browser.url(`http://localhost:3000/hw/store/cart?bug_id=${bug_id}`);

    await browser.$('.Form-Field_type_name').setValue('Vitaliy');
    await browser.$('.Form-Field_type_phone').setValue('79999999999');
    await browser.$('.Form-Field_type_address').setValue('Address');
    await browser.$('.Form-Submit').click();

    await browser.$('.Cart').waitForExist();

    await browser.assertView('plainCart', '.Cart', {
      screenshotDelay: 1000,
      compositeImage: false,
    });
  });

  it('При оформление заказа должно вернуть правильный id заказа', async () => {
    const formData = {
      name: 'Vitaliy',
      phone: '79999999999',
      address: 'Address',
    };

    const cart = {
      0: { id: 0, name: 'Incredible Table', price: 914, count: 3 },
      1: { id: 1, name: 'Rustic Mouse', price: 691, count: 3 },
    };

    const order = {
      form: formData,
      cart: cart,
    };

    const response = await axios.post(`http://localhost:3000/hw/store/api/checkout?bug_id=${bug_id}`, order);
    const orderId = response.data.id;

    assert.ok(
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].includes(orderId),
      'При оформлении заказа, должен вернуться orderId не с большим количеством цифр',
    );
  });
});
