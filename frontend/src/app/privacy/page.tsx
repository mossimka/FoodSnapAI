'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Shield, 
  Mail, 
  Eye,
  Lock,
  UserCheck,
  Database,
  Settings,
  FileText
} from 'lucide-react';
import Link from 'next/link';

import Styles from './privacy.module.css';

interface PrivacySection {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  content: React.ReactNode;
}

const privacySections: PrivacySection[] = [
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    icon: Database,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Personal Information</h4>
        <ul>
          <li><strong>Account Information:</strong> Username, email address, and profile picture</li>
          <li><strong>Food Photos:</strong> Images you upload to generate recipes</li>
          <li><strong>Generated Recipes:</strong> AI-generated recipes based on your photos</li>
          <li><strong>Profile Settings:</strong> Privacy preferences and account settings</li>
        </ul>
        
        <h4>Automatically Collected Information</h4>
        <ul>
          <li><strong>Usage Data:</strong> How you interact with our service (with your consent)</li>
          <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers</li>
          <li><strong>Cookies:</strong> Essential cookies for functionality and optional analytics cookies</li>
        </ul>
      </div>
    )
  },
  {
    id: 'how-we-use-information',
    title: 'How We Use Your Information',
    icon: Settings,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Primary Uses</h4>
        <ul>
          <li><strong>Service Provision:</strong> Generate recipes from your food photos using AI</li>
          <li><strong>Account Management:</strong> Maintain your account and preferences</li>
          <li><strong>Recipe Storage:</strong> Save and organize your generated recipes</li>
          <li><strong>Community Features:</strong> Enable sharing of public recipes</li>
        </ul>
        
        <h4>Service Improvement</h4>
        <ul>
          <li><strong>AI Training:</strong> Improve recipe accuracy (anonymous data only)</li>
          <li><strong>Analytics:</strong> Understand usage patterns to enhance user experience</li>
          <li><strong>Support:</strong> Provide customer service and technical support</li>
        </ul>
      </div>
    )
  },
  {
    id: 'information-sharing',
    title: 'Information Sharing',
    icon: UserCheck,
    content: (
      <div className={Styles.sectionContent}>
        <h4>What We Share</h4>
        <ul>
          <li><strong>Public Recipes:</strong> Only recipes you choose to make public are visible to other users</li>
          <li><strong>Legal Requirements:</strong> We may disclose information when required by law</li>
          <li><strong>Service Providers:</strong> Limited data sharing with trusted service providers (cloud storage, analytics)</li>
        </ul>
        
        <h4>What We Don&apos;t Share</h4>
        <ul>
          <li><strong>No Sales:</strong> We never sell your personal information to third parties</li>
          <li><strong>No Marketing:</strong> We don&apos;t share your data for marketing purposes</li>
          <li><strong>Private Recipes:</strong> Private recipes remain completely private</li>
        </ul>
      </div>
    )
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: Lock,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Security Measures</h4>
        <ul>
          <li><strong>Encryption:</strong> All data is encrypted in transit and at rest</li>
          <li><strong>Access Control:</strong> Strict access controls limit who can view your data</li>
          <li><strong>Regular Audits:</strong> We conduct regular security assessments</li>
          <li><strong>Secure Infrastructure:</strong> Data stored on secure, monitored servers</li>
        </ul>
        
        <h4>Your Role</h4>
        <ul>
          <li><strong>Strong Passwords:</strong> Use unique, strong passwords for your account</li>
          <li><strong>Account Security:</strong> Keep your login credentials secure</li>
          <li><strong>Report Issues:</strong> Contact us immediately if you notice suspicious activity</li>
        </ul>
      </div>
    )
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    icon: Eye,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Data Access & Control</h4>
        <ul>
          <li><strong>Access:</strong> Request access to all data we have about you</li>
          <li><strong>Correction:</strong> Update or correct your personal information</li>
          <li><strong>Deletion:</strong> Delete your account and all associated data</li>
          <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
        </ul>
        
        <h4>Privacy Controls</h4>
        <ul>
          <li><strong>Recipe Visibility:</strong> Control whether your recipes are public or private</li>
          <li><strong>Analytics:</strong> Opt out of analytics tracking at any time</li>
          <li><strong>Communications:</strong> Control what emails you receive from us</li>
        </ul>
        
        <p className={Styles.note}>
          <strong>How to Exercise Your Rights:</strong> Contact us at maksimsarsekeyev@gmail.com 
          or use the settings page to manage your preferences.
        </p>
      </div>
    )
  },
  {
    id: 'cookies-tracking',
    title: 'Cookies & Tracking',
    icon: Settings,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Essential Cookies</h4>
        <ul>
          <li><strong>Authentication:</strong> Keep you logged in securely</li>
          <li><strong>Preferences:</strong> Remember your settings and preferences</li>
          <li><strong>Security:</strong> Protect against fraud and abuse</li>
        </ul>
        
        <h4>Optional Cookies</h4>
        <ul>
          <li><strong>Analytics:</strong> Help us understand how you use our service</li>
          <li><strong>Performance:</strong> Monitor and improve site performance</li>
        </ul>
        
        <p className={Styles.note}>
          You can manage your cookie preferences through our cookie consent banner 
          or by contacting us directly.
        </p>
      </div>
    )
  },
  {
    id: 'contact-information',
    title: 'Contact Information',
    icon: Mail,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Privacy Questions</h4>
        <p>
          If you have any questions about this Privacy Policy or how we handle your data, 
          please contact us:
        </p>
        
        <div className={Styles.contactInfo}>
          <div className={Styles.contactMethod}>
            <Mail size={20} />
            <div>
              <strong>Email:</strong> maksimsarsekeyev@gmail.com
            </div>
          </div>
        </div>
        
        <h4>Response Time</h4>
        <p>
          We aim to respond to all privacy-related inquiries within 30 days. 
          For urgent matters, please indicate this in your subject line.
        </p>
      </div>
    )
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function PrivacyPage() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      // Auto-expand the section when scrolling to it
      if (!expandedSections.includes(sectionId)) {
        setExpandedSections(prev => [...prev, sectionId]);
      }
    }
  };

  return (
    <motion.div 
      className={Styles.wrapper}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div className={Styles.header} variants={itemVariants}>
        <div className={Styles.headerContent}>
          <div className={Styles.headerIcon}>
            <Shield size={48} />
          </div>
          <div>
            <h1 className={Styles.mainTitle}>
              <span className="gradientText">Privacy Policy</span>
            </h1>
            <p className={Styles.subtitle}>How we protect and handle your information</p>
            <p className={Styles.lastUpdated}>Last updated: June 2025</p>
          </div>
        </div>
      </motion.div>

      {/* Introduction */}
      <motion.div className={Styles.introduction} variants={itemVariants}>
        <p>
          At FoodSnap AI, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, and protect your information when you use our service. By using FoodSnap AI, you agree 
          to the collection and use of information in accordance with this policy.
        </p>
      </motion.div>

      {/* Table of Contents */}
      <motion.div className={Styles.tableOfContents} variants={itemVariants}>
        <h2 className={Styles.tocTitle}>Table of Contents</h2>
        <div className={Styles.tocList}>
          {privacySections.map((section, index) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={Styles.tocItem}
              >
                <Icon size={16} />
                <span>{index + 1}. {section.title}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Privacy Sections */}
      <motion.div className={Styles.sectionsContainer} variants={itemVariants}>
        {privacySections.map((section, index) => {
          const isExpanded = expandedSections.includes(section.id);
          const Icon = section.icon;
          
          return (
            <motion.div
              key={section.id}
              id={section.id}
              className={Styles.section}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <button
                className={`${Styles.sectionHeader} ${isExpanded ? Styles.expanded : ''}`}
                onClick={() => toggleSection(section.id)}
                aria-expanded={isExpanded}
              >
                                  <div className={Styles.sectionTitle}>
                    <div className={Styles.sectionIcon}>
                      <Icon size={24} />
                    </div>
                    <span className={Styles.sectionNumber}>{index + 1}.</span>
                    <span className={Styles.sectionTitleText}>{section.title}</span>
                  </div>
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={20} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className={Styles.sectionBody}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {section.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Footer Actions */}
      <motion.div className={Styles.footerActions} variants={itemVariants}>
        <div className={Styles.actionContent}>
          <div className={Styles.actionIcon}>
            <FileText size={32} />
          </div>
          <div>
            <h3>Questions or Concerns?</h3>
            <p>Contact us about this Privacy Policy or your data rights.</p>
          </div>
        </div>
        <div className={Styles.actionButtons}>
          <Link href="/terms" className="button">
            View Terms & Conditions
          </Link>
          <Link href="mailto:maksimsarsekeyev@gmail.com" className="button">
            <Mail size={18} />
            Contact Support
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
} 