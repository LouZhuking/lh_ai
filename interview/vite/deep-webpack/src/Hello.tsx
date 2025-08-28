import React from 'react';
import avatar from './images/avatar.webp'
import book from './images/book.webp'
import { add, subtract, multiply, divide } from './math';
const Hello = () => {
  return (
    <>
      来咯来咯
      <img src={avatar} alt="" />
      <img src={book} alt="" />
    </>
  )
}

export default Hello;