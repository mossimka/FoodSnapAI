import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  TiSocialLinkedin,
  TiSocialInstagram,
} from 'react-icons/ti';
import { FaSquareXTwitter,  FaTiktok, FaThreads  } from "react-icons/fa6";
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
            <Link href="https://www.tiktok.com/@foodsnap_ai">< FaTiktok  /></Link>
            <Link href="https://www.instagram.com/foodsnap_ai/" target='_blank'><TiSocialInstagram /></Link>
            <Link href="https://x.com/FoodSnapAI" target='_blank'><FaSquareXTwitter /></Link>
            <Link href="https://www.linkedin.com/in/maxim-sarsekeyev-a133ba354/" target='_blank'><TiSocialLinkedin /></Link>
            <Link href="#" target='_blank'><FaThreads /></Link>
          </div>
        </div>

        <div className={Styles.footer_box_discover}>
          <h3 className='gradientText'>Explore</h3>
          <ul>
            <li>
              <Link href="/posted" className={Styles.link}>
                Browse Recipes
              </Link>
            </li>
            <li>
              <Link href="/generate" className={Styles.link}>
                Upload Recipe
              </Link>
            </li>
          </ul>
        </div>

        <div className={Styles.footer_box_help}>
          <h3 className='gradientText'>Help</h3>
          <ul>
            <li>
              <Link href="/faq" className={Styles.link}>
                FAQs
              </Link>
            </li>
            <li>
              <Link href="mailto:maksimsarsekeyev@gmail.com" className={Styles.link}>
                Contact Support
              </Link>
            </li>
            <li>
              <Link href="/privacy" className={Styles.link}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className={Styles.link}>
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
