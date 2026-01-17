# AJEET LIGHTS - E-Commerce Frontend

A modern, responsive e-commerce website for lighting products built with React and Vite.

## Features

- 🏠 **Home Page**: Hero section, featured products, special offers
- 📦 **Products Page**: Browse products with category filtering
- 🛒 **Shopping Cart**: Add/remove items, quantity management
- 👤 **User Profile**: Login/Register, order history, wishlist
- 📱 **Fully Responsive**: Optimized for mobile, tablet, and desktop
- 🎨 **Modern UI**: Clean design with smooth animations
- ⚡ **Fast**: Built with Vite for optimal performance

## Project Structure

```
src/
├── components/
│   ├── Header/
│   ├── Footer/
│   ├── ProductCard/
│   └── AdminPanel/
├── pages/
│   ├── Home/
│   ├── About/
│   ├── Products/
│   ├── Cart/
│   └── Profile/
├── context/
│   ├── CartContext.jsx
│   └── UserContext.jsx
├── data/
│   └── products.js
├── App.jsx
├── main.jsx
└── index.css
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Key Changes from Original

1. ✅ **Separated into Components**: Converted monolithic HTML into reusable React components
2. ✅ **Removed Order Section**: Order link removed from navigation as requested
3. ✅ **Fully Responsive**: Enhanced mobile and tablet support with better breakpoints
4. ✅ **State Management**: Used React Context API for cart and user management
5. ✅ **Modern Routing**: Implemented React Router for navigation
6. ✅ **Better Organization**: Separated CSS files for each component

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Context API** - State management
- **CSS3** - Styling
- **Font Awesome** - Icons
- **Google Fonts** - Typography

## Responsive Breakpoints

- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## License

All Rights Reserved - AJEET LIGHTS © 2023
