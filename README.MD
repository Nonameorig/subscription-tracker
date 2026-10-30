# 📊 Subscription Tracker

A lightweight, fully client-side web application for tracking recurring payments and subscriptions. Built with a focus on mobile-first UX and a clean, modern interface.

No backend, no databases, no external libraries. All data is stored locally in the user's browser (`localStorage`), ensuring privacy and instant performance.

## ✨ Features

- **Manual Input**: Add service name, amount, currency, and next billing date.
- **Multi-Currency**: Supports USD, EUR, RUB, KZT, BYN. Totals are calculated separately for each currency (no exchange rate conversion).
- **Smart Sorting**: Upcoming payments are always displayed at the top.
- **Visual Statuses**: Badges for "Today", "Tomorrow", "Overdue", and days remaining with color indicators.
- **Localization (i18n)**: Full support for English and Russian. Translations are separated into JSON files.
- **Auto-Save**: Data is instantly saved to the browser's local storage.

## 🛠 Tech Stack

- **HTML5**: Semantic markup, responsive layout.
- **CSS3**: CSS Variables, Flexbox, CSS Grid, media queries. No frameworks (pure CSS).
- **Vanilla JavaScript**: DOM manipulation, `localStorage`, `fetch` API for loading translations, `Intl.NumberFormat` for currency and date formatting.

## 🚀 How to Run Locally

Due to the use of `fetch` to load JSON translation files, browsers may block requests when opening the file directly (`file://`).

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/subscription-tracker.git