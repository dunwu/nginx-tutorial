import React from 'react';
import { Link } from 'react-router-dom';
import Error from './Error';

export default () => (
  <Error type="403" style={{ minHeight: 500, height: '80%' }} linkElement={Link} />
);
