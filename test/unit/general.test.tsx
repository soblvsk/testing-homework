import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { render, RenderResult } from '@testing-library/react';
import { CartApi, ExampleApi } from '../../src/client/api';
import { describe, it, expect } from '@jest/globals';
import { initStore } from '../../src/client/store';
import { Application } from '../../src/client/Application';

const basename = '/';
const api = new ExampleApi(basename);
const cart = new CartApi();
const store = initStore(api, cart);

describe('Общие требования:', () => {
  const application = (
    <BrowserRouter basename={basename}>
      <Provider store={store}>
        <Application />
      </Provider>
    </BrowserRouter>
  );

  let renderResult: RenderResult;

  beforeEach(() => {
    renderResult = render(application);
  });

  it('В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину', () => {
    const { getByTestId } = renderResult;

    expect(getByTestId('catalog').getAttribute('href')).toBe('/catalog');
    expect(getByTestId('delivery').getAttribute('href')).toBe('/delivery');
    expect(getByTestId('contacts').getAttribute('href')).toBe('/contacts');
    expect(getByTestId('cart').getAttribute('href')).toBe('/cart');
  });

  it('Название магазина в шапке должно быть ссылкой на главную страницу', () => {
    const { getByTestId } = renderResult;

    expect(getByTestId('home').getAttribute('href')).toBe('/');
  });
});
