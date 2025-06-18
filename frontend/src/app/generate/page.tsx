import { Generation } from '@/components/Generation/Generation';
import React from 'react'

import Styles from "./generate.module.css";

export default function GeneratePage() {
  return (
    <div className={Styles.generateSection}>
      <h2>Generate your new <strong className='gradientText'>delicious recipe!</strong></h2>
      <Generation />
    </div>
  );
}