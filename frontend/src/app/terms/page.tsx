'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Scale, 
  Mail, 
  User,
  Shield,
  AlertTriangle,
  Copyright,
  Gavel,
  FileText,
  Users
} from 'lucide-react';
import Link from 'next/link';

import Styles from './terms.module.css';

interface TermsSection {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  content: React.ReactNode;
}

const termsSections: TermsSection[] = [
  {
    id: 'acceptance-of-terms',
    title: 'Acceptance of Terms',
    icon: FileText,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Agreement to Terms</h4>
        <p>
          By accessing and using FoodSnap AI, you accept and agree to be bound by the terms 
          and provision of this agreement. If you do not agree to abide by the above, 
          please do not use this service.
        </p>
        
        <h4>Age Requirements</h4>
        <ul>
          <li><strong>Minimum Age:</strong> You must be at least 13 years old to use our service</li>
          <li><strong>Parental Consent:</strong> Users under 18 require parental consent</li>
          <li><strong>Legal Capacity:</strong> You must have the legal capacity to enter into this agreement</li>
        </ul>
        
        <h4>Modifications to Terms</h4>
        <p>
          FoodSnap AI reserves the right to change these terms at any time. 
          Continued use of the service constitutes acceptance of modified terms.
        </p>
      </div>
    )
  },
  {
    id: 'service-description',
    title: 'Service Description',
    icon: Users,
    content: (
      <div className={Styles.sectionContent}>
        <h4>What We Provide</h4>
        <ul>
          <li><strong>AI Recipe Generation:</strong> Transform food photos into detailed recipes</li>
          <li><strong>Recipe Storage:</strong> Save and organize your generated recipes</li>
          <li><strong>Community Sharing:</strong> Share recipes with other users (optional)</li>
          <li><strong>Nutritional Information:</strong> Basic calorie and ingredient analysis</li>
        </ul>
        
        <h4>Service Limitations</h4>
        <ul>
          <li><strong>AI Accuracy:</strong> Recipe suggestions are AI-generated and may not be perfect</li>
          <li><strong>Availability:</strong> Service may be temporarily unavailable for maintenance</li>
          <li><strong>Beta Features:</strong> Some features may be experimental and subject to change</li>
        </ul>
        
        <h4>No Warranty</h4>
        <p>
          FoodSnap AI is provided &quot;as is&quot; without warranty of any kind. We do not guarantee 
          the accuracy, completeness, or usefulness of any recipe or nutritional information.
        </p>
      </div>
    )
  },
  {
    id: 'user-accounts',
    title: 'User Accounts',
    icon: User,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Account Creation</h4>
        <ul>
          <li><strong>Accurate Information:</strong> You must provide accurate and complete information</li>
          <li><strong>Account Security:</strong> You are responsible for maintaining account security</li>
          <li><strong>One Account:</strong> You may only create one account per person</li>
          <li><strong>Username Policy:</strong> Usernames must be appropriate and not offensive</li>
        </ul>
        
        <h4>Account Responsibilities</h4>
        <ul>
          <li><strong>Password Security:</strong> Keep your password secure and don&apos;t share it</li>
          <li><strong>Activity Monitoring:</strong> Monitor your account for unauthorized use</li>
          <li><strong>Immediate Notification:</strong> Report suspicious activity immediately</li>
        </ul>
        
        <h4>Account Termination</h4>
        <p>
          We reserve the right to suspend or terminate accounts that violate these terms. 
          You may delete your account at any time from the settings page.
        </p>
      </div>
    )
  },
  {
    id: 'user-content',
    title: 'User Content',
    icon: Copyright,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Content Ownership</h4>
        <ul>
          <li><strong>Your Photos:</strong> You retain ownership of all photos you upload</li>
          <li><strong>Generated Recipes:</strong> You own the recipes generated from your photos</li>
          <li><strong>Profile Information:</strong> You control your profile and account data</li>
        </ul>
        
        <h4>License to Use</h4>
        <ul>
          <li><strong>Service Operation:</strong> You grant us license to use your content to provide our service</li>
          <li><strong>AI Training:</strong> Anonymous data may be used to improve our AI (with consent)</li>
          <li><strong>Public Recipes:</strong> Public recipes may be displayed to other users</li>
        </ul>
        
        <h4>Content Standards</h4>
        <ul>
          <li><strong>Appropriate Content:</strong> Only upload food-related images</li>
          <li><strong>No Harmful Content:</strong> Don&apos;t upload content that could harm others</li>
          <li><strong>Respect Rights:</strong> Don&apos;t upload content that violates others&apos; rights</li>
        </ul>
      </div>
    )
  },
  {
    id: 'prohibited-uses',
    title: 'Prohibited Uses',
    icon: AlertTriangle,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Illegal Activities</h4>
        <ul>
          <li><strong>Unlawful Content:</strong> No illegal, harmful, or offensive content</li>
          <li><strong>Copyright Violation:</strong> Don&apos;t infringe on others&apos; intellectual property</li>
          <li><strong>Privacy Violations:</strong> Respect others&apos; privacy and personal information</li>
        </ul>
        
        <h4>Service Abuse</h4>
        <ul>
          <li><strong>No Spam:</strong> Don&apos;t send spam or unwanted communications</li>
          <li><strong>No Hacking:</strong> Don&apos;t attempt to breach our security systems</li>
          <li><strong>No Automation:</strong> Don&apos;t use bots or scripts to abuse our service</li>
          <li><strong>Fair Use:</strong> Use the service reasonably and don&apos;t overload our systems</li>
        </ul>
        
        <h4>Commercial Restrictions</h4>
        <ul>
          <li><strong>Personal Use:</strong> Service is for personal, non-commercial use</li>
          <li><strong>No Reselling:</strong> Don&apos;t resell or redistribute our service</li>
          <li><strong>Contact for Commercial Use:</strong> Contact us for commercial licensing</li>
        </ul>
      </div>
    )
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    icon: Copyright,
    content: (
      <div className={Styles.sectionContent}>
        <h4>FoodSnap AI Ownership</h4>
        <ul>
          <li><strong>Platform Technology:</strong> We own all rights to our AI technology and platform</li>
          <li><strong>Trademarks:</strong> &quot;FoodSnap AI&quot; and our logos are our trademarks</li>
          <li><strong>Copyrights:</strong> All software, designs, and content are protected by copyright</li>
        </ul>
        
        <h4>User Rights</h4>
        <ul>
          <li><strong>Limited License:</strong> You have a limited license to use our service</li>
          <li><strong>No Transfer:</strong> You cannot transfer or sublicense our technology</li>
          <li><strong>Termination:</strong> License terminates when you stop using our service</li>
        </ul>
        
        <h4>DMCA Compliance</h4>
        <p>
          We respect intellectual property rights. If you believe your copyright has been 
          infringed, please contact us with detailed information about the alleged infringement.
        </p>
      </div>
    )
  },
  {
    id: 'disclaimers',
    title: 'Disclaimers',
    icon: Shield,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Recipe Accuracy</h4>
        <ul>
          <li><strong>AI Limitations:</strong> Recipes are AI-generated and may not be accurate</li>
          <li><strong>Cooking Safety:</strong> Always use proper food safety practices</li>
          <li><strong>Dietary Restrictions:</strong> Verify ingredients for allergies and dietary needs</li>
          <li><strong>Nutrition Information:</strong> Nutritional data is estimated and may be inaccurate</li>
        </ul>
        
        <h4>No Professional Advice</h4>
        <ul>
          <li><strong>Not Medical Advice:</strong> Nothing on our service constitutes medical advice</li>
          <li><strong>Not Nutritional Advice:</strong> Consult professionals for dietary guidance</li>
          <li><strong>Use at Your Own Risk:</strong> You assume all risks when following our recipes</li>
        </ul>
        
        <h4>Service Availability</h4>
        <p>
          We strive for high availability but cannot guarantee uninterrupted service. 
          Maintenance, updates, and technical issues may cause temporary outages.
        </p>
        
        <div className={Styles.note}>
          <strong>Important:</strong> Always verify recipe ingredients and instructions. 
          We are not responsible for any adverse effects from following AI-generated recipes.
        </div>
      </div>
    )
  },
  {
    id: 'governing-law',
    title: 'Governing Law',
    icon: Gavel,
    content: (
      <div className={Styles.sectionContent}>
        <h4>Jurisdiction</h4>
        <p>
          These terms shall be interpreted and governed by the laws of the jurisdiction 
          where FoodSnap AI operates, without regard to conflict of law principles.
        </p>
        
        <h4>Dispute Resolution</h4>
        <ul>
          <li><strong>Contact First:</strong> Contact us directly to resolve issues</li>
          <li><strong>Good Faith:</strong> We will work in good faith to resolve disputes</li>
          <li><strong>Mediation:</strong> If direct resolution fails, we prefer mediation</li>
          <li><strong>Legal Action:</strong> Legal action as a last resort</li>
        </ul>
        
        <h4>Severability</h4>
        <p>
          If any provision of these terms is found to be unenforceable, 
          the remaining provisions will continue in full force and effect.
        </p>
        
        <h4>Entire Agreement</h4>
        <p>
          These terms constitute the entire agreement between you and FoodSnap AI 
          regarding use of the service.
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

export default function TermsPage() {
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
            <Scale size={48} />
          </div>
          <div>
            <h1 className={Styles.mainTitle}>
              <span className="gradientText">Terms & Conditions</span>
            </h1>
            <p className={Styles.subtitle}>Legal terms for using FoodSnap AI</p>
            <p className={Styles.lastUpdated}>Effective date: June 2025</p>
          </div>
        </div>
      </motion.div>

      {/* Introduction */}
      <motion.div className={Styles.introduction} variants={itemVariants}>
        <p>
          These Terms and Conditions (&quot;Terms&quot;) govern your use of FoodSnap AI operated by FoodSnap AI. 
          Please read these Terms carefully before using our service. By accessing or using our service, 
          you agree to be bound by these Terms.
        </p>
      </motion.div>

      {/* Table of Contents */}
      <motion.div className={Styles.tableOfContents} variants={itemVariants}>
        <h2 className={Styles.tocTitle}>Table of Contents</h2>
        <div className={Styles.tocList}>
          {termsSections.map((section, index) => {
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

      {/* Terms Sections */}
      <motion.div className={Styles.sectionsContainer} variants={itemVariants}>
        {termsSections.map((section, index) => {
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
            <h3>Questions About These Terms?</h3>
            <p>Contact us if you need clarification on any of these terms.</p>
          </div>
        </div>
        <div className={Styles.actionButtons}>
          <Link href="/privacy" className="button">
            View Privacy Policy
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