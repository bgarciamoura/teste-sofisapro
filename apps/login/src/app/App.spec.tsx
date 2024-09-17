import * as React from 'react';
import { render } from '@testing-library/react-native';

import Login from './index';

test('renders correctly', () => {
  const { getByTestId } = render(<Login />);
  expect(getByTestId('heading')).toHaveTextContent('Welcome');
});

