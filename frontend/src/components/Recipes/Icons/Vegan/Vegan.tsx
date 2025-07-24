import React from 'react';
import Image from 'next/image';

import Styles from '../Icon.module.css';

const Vegan = () => {
  return (
    <div className={`${Styles.iconDiv} ${Styles.tooltipContainer}`} data-tooltip="Vegan">
        <Image className={Styles.icon} src="/images/vegan.png" alt="Vegan" width={30} height={30} />
    </div>
  )
}

export default Vegan;