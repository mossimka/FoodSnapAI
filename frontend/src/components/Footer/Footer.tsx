'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  TiSocialFacebook,
  TiSocialLinkedin,
  TiSocialYoutube,
  TiSocialInstagram,
  TiSocialTwitter,
} from 'react-icons/ti';
import { RiSendPlaneFill } from 'react-icons/ri';

import Styles from './Footer.module.css';
import { images } from '../../../public/images/index';

export const Footer = () => {

  return (
    <footer className={Styles.footer}>
      <div className={Styles.footer_box}>
        <div className={Styles.footer_box_social}>
          <Image
            src={images.logo}
            alt="Recipe logo"
            height={60}
            width={60}
            className={Styles.footer_box_social_img}
          />
          <p>
            Discover, cook, and share your favorite recipes with food lovers around the world.
            Join the cooking revolution!
          </p>

          <div className={Styles.footer_social}>
            <a href="#"><TiSocialFacebook /></a>
            <a href="#"><TiSocialInstagram /></a>
            <a href="#"><TiSocialTwitter /></a>
            <a href="#"><TiSocialYoutube /></a>
            <a href="#"><TiSocialLinkedin /></a>
          </div>
        </div>

        <div className={Styles.footer_box_discover}>
          <h3 className='gradientText'>Explore</h3>
          <ul>
            <li>
              <Link href="#" className={Styles.link}>
                Browse Recipes
              </Link>
            </li>
            <li>
              <Link href="#" className={Styles.link}>
                Upload Recipe
              </Link>
            </li>
          </ul>
        </div>

        <div className={Styles.footer_box_help}>
          <h3 className='gradientText'>Help</h3>
          <ul>
            <li>
              <Link href="#" className={Styles.link}>
                FAQs
              </Link>
            </li>
            <li>
              <Link href="#" className={Styles.link}>
                Contact Support
              </Link>
            </li>
            <li>
              <Link href="#" className={Styles.link}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className={Styles.link}>
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div className={Styles.subscribe}>
          <h3 className='gradientText'>Subscribe</h3>
          <div className={Styles.subscribe_box}>
            <input type="email" placeholder="Will come soon..." />
            <RiSendPlaneFill className={Styles.subscribe_box_send} />
          </div>
          <div className={Styles.subscribe_box_info}>
            <p>Get fresh recipes and cooking tips delivered to your inbox weekly!</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
