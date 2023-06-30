import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from '@jest/globals';
import { render } from '@testing-library/react';
import { createStore } from 'redux';
import { Catalog } from '../../src/client/pages/Catalog';
import { Application } from '../../src/client/Application';
import events from '@testing-library/user-event';
import { CartApi, ExampleApi } from '../../src/client/api';
import { initStore } from '../../src/client/store';
import { ProductDetails } from '../../src/client/components/ProductDetails';

const basename = '/';

describe('Каталог:', () => {
  it('Если товар уже добавлен в корзину, в каталоге должно отображаться сообщение об этом', () => {
    const initialState = {
      products: [
        {
          id: 0,
          name: 'Incredible Table',
          price: 914,
        },
      ],
      details: {
        0: {
          id: 0,
          name: 'Incredible Table',
          description:
            'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
          price: 914,
          color: 'red',
          material: 'Metal',
        },
      },
      cart: { 0: { name: 'Incredible Table', count: 1, price: 914 } },
    };

    const store = createStore(() => initialState);

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <Catalog />
        </Provider>
      </BrowserRouter>
    );

    const { getByText } = render(application);

    expect(getByText('Item in cart')).not.toBe(null);
  });

  it('Если товар уже добавлен в корзину, на странице товара должно отображаться сообщение об этом', () => {
    const initialState = {
      products: [
        {
          id: 0,
          name: 'Incredible Table',
          price: 914,
        },
      ],
      details: {
        0: {
          id: 0,
          name: 'Incredible Table',
          description:
            'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
          price: 914,
          color: 'red',
          material: 'Metal',
        },
      },
      cart: { 0: { name: 'Incredible Table', count: 1, price: 914 } },
    };

    const store = createStore(() => initialState);

    const application = (
      <MemoryRouter initialEntries={['/catalog/0']}>
        <Provider store={store}>
          <Application />
        </Provider>
      </MemoryRouter>
    );

    const { getByText } = render(application);

    expect(getByText('Item in cart')).not.toBe(null);
  });

  it('Если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async () => {
    const api = new ExampleApi(basename);
    const cart = new CartApi();
    const store = initStore(api, cart);

    const initialState = {
      products: [
        {
          id: 0,
          name: 'Incredible Table',
          price: 914,
        },
      ],
      details: {
        0: {
          id: 0,
          name: 'Incredible Table',
          description:
            'Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals',
          price: 914,
          color: 'red',
          material: 'Metal',
        },
      },
    };

    const product = initialState.details[0];

    const application = (
      <BrowserRouter basename={basename}>
        <Provider store={store}>
          <ProductDetails product={product} />
        </Provider>
      </BrowserRouter>
    );

    const { getByText } = render(application);

    const productAddBtn = getByText('Add to Cart');

    await events.click(productAddBtn);
    await events.click(productAddBtn);

    expect(store.getState().cart[0].count).toBe(2);
  });
});
