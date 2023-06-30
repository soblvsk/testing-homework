import { describe, expect, it } from '@jest/globals';
import { initStore } from '../../src/client/store';
import { ExampleApi } from '../../src/client/api';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Cart } from '../../src/client/pages/Cart';
import React from 'react';
import { render } from '@testing-library/react';
import events from '@testing-library/user-event';
import { createStore } from 'redux';
import { Application } from '../../src/client/Application';

const basename = '/';

describe('Корзина:', () => {
  it('В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', () => {
    const initialState = {
      cart: {
        0: { id: 0, name: 'Incredible Table', price: 914, count: 3 },
        1: { id: 1, name: 'Rustic Mouse', price: 691, count: 3 },
      },
    };

    const store = createStore(() => initialState);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Application />
        </Provider>
      </BrowserRouter>
    );

    const { getByTestId } = render(application);
    const cartLink = getByTestId('cart').textContent;
    const uniqueProductCount = Object.keys(initialState.cart).length;
    expect(cartLink).toBe(`Cart (${uniqueProductCount})`);
  });

  it('В корзине должна отображаться таблица с добавленными в нее товарами', () => {
    const initialState = {
      cart: {
        0: { id: 0, name: 'Incredible Table', price: 914, count: 1 },
        1: { id: 1, name: 'Rustic Mouse', price: 691, count: 1 },
      },
    };

    const store = createStore(() => initialState);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    const { getByTestId } = render(application);

    Object.keys(initialState.cart).forEach((row) => {
      const item = getByTestId(`${row}`);

      expect(item).toBeTruthy();
    });
  });

  it('Для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', () => {
    const initialState = {
      cart: {
        0: { id: 0, name: 'Incredible Table', price: 914, count: 1 },
        1: { id: 1, name: 'Rustic Mouse', price: 691, count: 1 },
      },
    };

    const store = createStore(() => initialState);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    const { getByText, queryAllByText } = render(application);

    const cartItems = Object.values(initialState.cart);
    let totalOrderPrice = 0;

    cartItems.forEach((item, index) => {
      const productCartName = getByText(item.name, { selector: '.Cart-Name' });
      expect(productCartName).not.toBe(null);

      const productCartPrice = getByText(`$${item.price}`, { selector: '.Cart-Price' });
      expect(productCartPrice).not.toBe(null);

      const productCartCount = queryAllByText(item.count, { selector: '.Cart-Count' });
      expect(productCartCount[index]).not.toBe(null);

      const productCartTotal = getByText(`$${item.price * item.count}`, { selector: '.Cart-Total' });
      expect(productCartTotal).not.toBe(null);

      totalOrderPrice += item.price * item.count;
    });

    const productOrderPrice = getByText(`$${totalOrderPrice}`, { selector: '.Cart-OrderPrice' });
    expect(productOrderPrice).not.toBe(null);
  });

  it('В корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async () => {
    const cart = {
      getState: () => ({
        0: { id: 0, name: 'Incredible Table', price: 914, count: 1 },
        1: { id: 1, name: 'Rustic Mouse', price: 691, count: 1 },
      }),
      setState: () => {},
    };

    const api = new ExampleApi(basename);
    const store = initStore(api, cart);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    const { getByTestId } = render(application);

    const cartClearBtn = getByTestId('clear');
    expect(cartClearBtn).not.toBe(null);

    await events.click(cartClearBtn);

    expect(Object.values(store.getState().cart).length).toBe(0);
  });

  it('Если корзина пустая, должна отображаться ссылка на каталог товаров', () => {
    const initialState = {
      cart: {},
    };

    const store = createStore(() => initialState);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Cart />
        </Provider>
      </BrowserRouter>
    );

    const { getByTestId } = render(application);
    const catalogLink = getByTestId('emptyLink').getAttribute('href');
    expect(catalogLink).toBe('/catalog');
  });
});
