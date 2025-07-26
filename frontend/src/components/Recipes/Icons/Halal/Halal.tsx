import React from 'react';
import Image from 'next/image';

import Styles from '../Icon.module.css'

const Halal = () => {
  return (
    <div className={`${Styles.iconDiv} ${Styles.tooltipContainer}`} data-tooltip="Halal">
        <Image className={Styles.icon} src="/images/halal.webp" alt="Halal" width={30} height={30} />
    </div>
  )
}

export default Halal;