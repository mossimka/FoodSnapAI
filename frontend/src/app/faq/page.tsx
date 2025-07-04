'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Search as SearchIcon, 
  HelpCircle, 
  Mail, 
  MessageCircle,
  Users,
  Settings,
  Zap,
  Camera
} from 'lucide-react';
import Link from 'next/link';

import Styles from './faq.module.css';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'getting-started' | 'recipes' | 'account' | 'technical';
  keywords: string[];
}

const faqData: FAQItem[] = [
  {
    id: 'what-is-foodsnap',
    question: 'What is FoodSnap AI?',
    answer: 'FoodSnap AI is an innovative web application that uses advanced artificial intelligence to recognize food from photos and generate detailed recipes. Simply upload a photo of any dish, and our AI will identify the ingredients and provide you with a step-by-step recipe to recreate it.',
    category: 'getting-started',
    keywords: ['foodsnap', 'ai', 'app', 'what is', 'about']
  },
  {
    id: 'how-recognition-works',
    question: 'How does food recognition work?',
    answer: 'Our AI uses computer vision technology to analyze your food photos. It identifies individual ingredients, estimates quantities, and recognizes cooking methods. The system has been trained on thousands of food images and recipes to provide accurate results.',
    category: 'getting-started',
    keywords: ['recognition', 'ai', 'computer vision', 'how', 'works']
  },
  {
    id: 'is-free',
    question: 'Is FoodSnap AI free to use?',
    answer: 'Yes! FoodSnap AI is completely free to use. You can upload photos, generate recipes, and save your favorites without any cost. We believe in making cooking accessible to everyone.',
    category: 'getting-started',
    keywords: ['free', 'cost', 'pricing', 'money']
  },
  {
    id: 'need-account',
    question: 'Do I need to create an account?',
    answer: 'While you can try FoodSnap AI without an account, creating one allows you to save your recipes, make them public to share with others, and access your recipe history. It only takes a few seconds to sign up!',
    category: 'getting-started',
    keywords: ['account', 'signup', 'registration', 'login']
  },
  
  // Recipes
  {
    id: 'recipe-accuracy',
    question: 'How accurate are the generated recipes?',
    answer: 'Our AI provides highly accurate recipes based on visual analysis of your food. However, since cooking involves personal taste and technique, we recommend treating our recipes as a starting point and adjusting ingredients and methods to your preference.',
    category: 'recipes',
    keywords: ['accuracy', 'quality', 'reliable', 'good']
  },
  {
    id: 'save-recipes',
    question: 'Can I save recipes for later?',
    answer: 'Yes! Once you create an account, you can save any generated recipe to your profile. You can also make your recipes public to share with the FoodSnap community or keep them private for personal use.',
    category: 'recipes',
    keywords: ['save', 'bookmark', 'favorite', 'keep']
  },
  {
    id: 'public-private',
    question: 'How do I make recipes public or private?',
    answer: 'When you generate a recipe, you can choose to publish it publicly or keep it private. Public recipes appear in the community feed where other users can discover them. Private recipes are only visible to you in your profile.',
    category: 'recipes',
    keywords: ['public', 'private', 'share', 'visibility']
  },
  {
    id: 'edit-recipes',
    question: 'Can I edit generated recipes?',
    answer: 'Currently, recipes are generated automatically based on your photo. However, you can copy the recipe text and modify it as needed. We\'re working on adding direct editing features in future updates.',
    category: 'recipes',
    keywords: ['edit', 'modify', 'change', 'update']
  },
  {
    id: 'not-recognized',
    question: 'What if the AI doesn\'t recognize my food?',
    answer: 'If the AI has trouble recognizing your food, try taking a clearer photo with good lighting, or upload a different angle. Make sure the food is the main focus of the image. Our AI is constantly learning and improving!',
    category: 'recipes',
    keywords: ['not recognized', 'error', 'failed', 'wrong']
  },
  
  // Account
  {
    id: 'create-account',
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the navigation menu and fill out the registration form. You can also sign up using your Google account for faster registration. Once registered, you can start saving and sharing recipes immediately.',
    category: 'account',
    keywords: ['create', 'signup', 'register', 'new account']
  },
  {
    id: 'change-profile-picture',
    question: 'How do I change my profile picture?',
    answer: 'Go to your Settings page and click on your current profile picture. You can upload a new image from your device. Make sure the image is clear and represents you well, as it will be visible to other users if you share recipes publicly.',
    category: 'account',
    keywords: ['profile picture', 'avatar', 'photo', 'change']
  },
  {
    id: 'delete-account',
    question: 'How do I delete my account?',
    answer: 'To delete your account, go to Settings and scroll down to the "Delete Account" section. This action is permanent and will remove all your recipes and data. Please make sure to backup any recipes you want to keep before deleting.',
    category: 'account',
    keywords: ['delete', 'remove', 'cancel', 'close account']
  },
  {
    id: 'data-storage',
    question: 'What data do you store?',
    answer: 'We store your basic profile information (username, email, profile picture), your uploaded food photos, and generated recipes. We never share your personal data with third parties and you can delete your account at any time.',
    category: 'account',
    keywords: ['data', 'privacy', 'storage', 'information']
  },
  
  // Technical
  {
    id: 'image-formats',
    question: 'What image formats are supported?',
    answer: 'We support the most common image formats including JPG, JPEG, PNG, and WebP. For best results, use high-quality images with good lighting and make sure the food is clearly visible.',
    category: 'technical',
    keywords: ['formats', 'jpg', 'png', 'webp', 'image types']
  },
  {
    id: 'image-not-uploading',
    question: 'Why is my image not uploading?',
    answer: 'Common issues include: file size too large (max 10MB), unsupported format, or poor internet connection. Try compressing your image or using a different format. If problems persist, try refreshing the page.',
    category: 'technical',
    keywords: ['upload', 'error', 'not working', 'failed']
  },
  {
    id: 'report-bug',
    question: 'How do I report a bug?',
    answer: 'If you encounter any issues, please contact our support team at maksimsarsekeyev@gmail.com with details about the problem, including what you were doing when it occurred and any error messages you saw.',
    category: 'technical',
    keywords: ['bug', 'report', 'issue', 'problem']
  },
  {
    id: 'mobile-app',
    question: 'Is there a mobile app?',
    answer: 'FoodSnap AI is a web application that works perfectly on mobile browsers. You can add it to your home screen for an app-like experience. We may develop native mobile apps in the future based on user demand.',
    category: 'technical',
    keywords: ['mobile', 'app', 'android', 'ios']
  }
];

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'getting-started', label: 'Getting Started', icon: Zap },
  { id: 'recipes', label: 'Recipes', icon: Camera },
  { id: 'account', label: 'Account', icon: Users },
  { id: 'technical', label: 'Technical', icon: Settings }
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

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const filteredFAQs = useMemo(() => {
    return faqData.filter(faq => {
      const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSelectedCategory('all');
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
        <motion.div className={Styles.headerContent}>
          <HelpCircle className={Styles.headerIcon} />
          <div>
            <h1 className={Styles.mainTitle}>
              <span className="gradientText">Frequently Asked Questions</span>
            </h1>
            <p className={Styles.subtitle}>Find answers to common questions about FoodSnap AI</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Search Section */}
      <motion.div className={Styles.searchSection} variants={itemVariants}>
        <div className={Styles.searchContainer}>
          <SearchIcon className={Styles.searchIcon} />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={Styles.searchInput}
          />
          {searchQuery && (
            <button onClick={clearSearch} className={Styles.searchClear}>
              ×
            </button>
          )}
        </div>
      </motion.div>

      {/* Categories */}
      <motion.div className={Styles.categories} variants={itemVariants}>
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <motion.button
              key={category.id}
              className={`${Styles.categoryButton} ${selectedCategory === category.id ? Styles.active : ''}`}
              onClick={() => setSelectedCategory(category.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Icon size={18} />
              {category.label}
            </motion.button>
          );
        })}
      </motion.div>

      {/* FAQ Items */}
      <motion.div className={Styles.faqContainer} variants={itemVariants}>
        {filteredFAQs.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredFAQs.map(faq => {
              const isExpanded = expandedItems.includes(faq.id);
              
              return (
                <motion.div
                  key={faq.id}
                  className={Styles.faqItem}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                >
                  <button
                    className={`${Styles.faqQuestion} ${isExpanded ? Styles.expanded : ''}`}
                    onClick={() => toggleExpanded(faq.id)}
                    aria-expanded={isExpanded}
                  >
                    <span className={Styles.questionText}>{faq.question}</span>
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
                        className={Styles.faqAnswer}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className={Styles.answerContent}>
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        ) : (
          <motion.div className={Styles.noResults} variants={itemVariants}>
            <MessageCircle size={48} className={Styles.noResultsIcon} />
            <h3>No questions found</h3>
            <p>Try adjusting your search or selecting a different category.</p>
            <button onClick={clearSearch} className="button">
              Clear Search
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Contact Section */}
      <motion.div className={Styles.contactSection} variants={itemVariants}>
        <div className={Styles.contactContent}>
          <Mail className={Styles.contactIcon} />
          <div>
            <h3>Still have questions?</h3>
            <p>Can&apos;t find what you&apos;re looking for? We&apos;re here to help!</p>
          </div>
        </div>
        <Link href="mailto:maksimsarsekeyev@gmail.com" className="button">
          <Mail size={18} />
          Contact Support
        </Link>
      </motion.div>
    </motion.div>
  );
} 