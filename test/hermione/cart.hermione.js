const { assert } = require('chai');
const axios = require('axios');

let bug_id = '';

if (process.env.BUG_ID !== undefined) {
  bug_id = process.env.BUG_ID;
}

describe('Корзина:', async () => {
  it('Проверка при оформлении заказа', async ({ browser }) => {
    browser.setWindowSize(1920, 1080);
    await browser.url('http://localhost:3000/hw/store/catalog/0');

    const page = await browser.$('.Application');
    await page.waitForExist();

    await browser.$('.ProductDetails-AddToCart').click();

    await browser.url(`http://localhost:3000/hw/store/cart?bug_id=${bug_id}`);

    const cartName = await browser.$('.Form-Field_type_name');
    const cartPhone = await browser.$('.Form-Field_type_phone');
    const cartAddress = await browser.$('.Form-Field_type_address');

    await cartName.setValue('Vitaliy');
    await cartPhone.setValue('79999999999');
    await cartAddress.setValue('Address');

    await browser.$('.Form-Submit').click();

    const isNameInvalid = await cartName.getAttribute('class');
    const isPhoneInvalid = await cartPhone.getAttribute('class');

    assert.ok(!isNameInvalid.includes('is-invalid'), 'Ожидается, что Name валидный');
    assert.ok(!isPhoneInvalid.includes('is-invalid'), 'Ожидается, что Phone валидный');

    const orderCard = await browser.$('.Cart-SuccessMessage');
    assert.equal(await orderCard.isDisplayed(), true, 'Окно с заказом и номером должно появиться');

    const orderCardIsValid = await orderCard.getAttribute('class');
    assert.include(orderCardIsValid, 'alert-success', 'Окно с заказом должно иметь зеленый цвет');
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
