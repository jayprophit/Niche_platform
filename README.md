# Niche Platform - Integrated Multi-Feature Web Platform

A comprehensive web application integrating e-commerce, e-learning, social media, job marketplace, blogging, blockchain, and AI features into a single cohesive platform.

## Overview

Niche Platform is a modern, full-stack web application that combines multiple traditionally separate services into one unified experience. It provides users with seamless access to diverse functionality while sharing user accounts, data, and content across features.

## Key Features

### Social Media
- Features from Facebook, Twitter/X, Instagram, Pinterest, YouTube, Telegram
- Activity feeds, profiles, and connections
- Groups and communities with management tools
- Real-time messaging and notifications
- Content sharing and engagement
- Age-restricted access (13+ for chat rooms)

### E-Commerce
- Product listings and categories
- Shopping cart and checkout process
- Enhanced product pages with technical specifications
- Interactive media viewers (rotate, zoom, 3D view)
- CAD file previews and multimedia demos
- Digital product delivery

### E-Learning
- Course creation and management
- Student enrollment and progress tracking
- Certificate generation and verification
- Quizzes, assignments, and assessments
- Integration with job marketplace for skills

### Job Marketplace
- Job listings and applications
- CV generation from certificates
- Fair compensation system with minimum standards
- Freelance contracts and project management
- Business accounts for employers

### Blogging Platform
- Article creation and publishing
- Categories, tags, and search
- Comments and engagement
- Media embedding
- Social sharing

### Communication Tools
- Chat rooms with age restrictions
- Video conferencing
- Community spaces
- Direct messaging

### Additional Features
- Blockchain integration for transactions
- AI-powered recommendations and assistance
- Gamification system with achievements and rewards
- Business account tiers with advanced features
- External platform linking and profile integration

## Technical Stack

- **Frontend**: React, Next.js, Material UI, TailwindCSS
- **Backend**: Node.js, Express, Next.js API routes
- **Database**: MongoDB (NoSQL), PostgreSQL (SQL)
- **State Management**: Redux Toolkit
- **Authentication**: NextAuth.js, JWT
- **Real-time Features**: Socket.IO
- **Blockchain**: Ethereum, Web3.js

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Project Structure

The project follows a modular architecture with clear separation of concerns:

```
/src
  /app                # Next.js app router and pages
  /components         # Reusable UI components
  /features           # Feature-specific components and logic
  /core               # Core platform services
  /modules            # Business modules
  /lib                # Utility libraries
  /types              # TypeScript type definitions
  /utils              # Utility functions
  /styles             # Global styles
  /contracts          # Smart contracts
  /database           # Database models and connections
  /api                # API endpoints
```

## Cross-Platform Support

The platform is designed to work seamlessly across:
- Desktop web browsers
- Mobile web browsers
- Mobile apps (via responsive web or native wrappers)
- Tablet devices

## Age Restrictions and Consent

The platform implements comprehensive age verification and parental consent systems:
- Age verification for users under 13
- Parental consent for purchases
- Age-restricted chat rooms (13+)
- Content filtering based on age
