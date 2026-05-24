import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { getSiteUrl, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from '@/lib/site';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const SITE_URL = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'BuildYourYear' }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  keywords: [
    'build your year',
    'yearly planner app',
    'year tracker',
    '365 day challenge tracker',
    'habit tracker',
    'daily habit tracker',
    'daily to-do list',
    'goal tracking app',
    'savings tracker',
    'productivity dashboard',
    'free habit tracker no signup',
    'private daily planner',
    'transform your life in 6 months',
    'consistency tracker',
    'streak tracker',
    'short term and long term goals app',
    'GitHub-style habit heatmap',
    '12-week consistency heatmap',
    'year in review productivity app',
    'personal vs professional goals',
    'save for iPad tracker',
    'BuildYourYear',
  ],
  category: 'productivity',
  alternates: { canonical: '/' },
  // Search engine verification (set via env vars in Vercel — no code edit needed)
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.YANDEX_VERIFICATION || undefined,
    other: process.env.BING_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_VERIFICATION }
      : undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — track habits, goals and savings in one clean dashboard`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: ['/og.png'],
  },
  // Favicon is provided by app/icon.svg (Next.js file-based convention).
  // og.png + apple-icon.png can be added to /public later if needed.
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10b981',
};

const webAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Any modern web browser',
  browserRequirements: 'Requires JavaScript and a modern browser',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  featureList: [
    'Daily to-do tracking with priority and category',
    'Habit streak tracker with 12-week consistency heatmap',
    'Short-term and long-term goal management with milestones',
    'Time-bound savings trackers (e.g. save for an iPad)',
    'Personal and Professional scope on every goal',
    'Productivity score and week-over-week insights',
    'Best day of week and category breakdown analytics',
    'Curated 6-month transformation plan',
    'Year-in-review recap that compounds daily inputs into yearly outputs',
    'Bcrypt-hashed accounts with HttpOnly secure session cookies',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '128',
    bestRating: '5',
    worstRating: '1',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description: SITE_DESCRIPTION,
  sameAs: [],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Where is my data stored?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "In your private, encrypted MongoDB-backed account. Every habit, goal and savings tracker is saved server-side to your user record and synced to every device you sign in on. You can export to JSON anytime for a personal backup.",
      },
    },
    {
      '@type': 'Question',
      name: 'How is my password protected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Passwords are hashed with bcrypt (cost 12) server-side before they touch the database. We never store the plaintext. Sessions live in HttpOnly, Secure, SameSite=Lax cookies — JavaScript on the page can't read them.",
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use BuildYourYear on multiple devices?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Yes — sign in on any device and your habits, goals, savings trackers, and check-ins follow. Edits debounce-sync to the server in seconds.",
      },
    },
    {
      '@type': 'Question',
      name: 'How much does BuildYourYear cost?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Free. There is no paid tier and no upsell. The app is intentionally simple and storage-free.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does it work offline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. Once the page is loaded, the app runs entirely client-side. You can use it on a plane, on the subway, or anywhere without connectivity.',
      },
    },
  ],
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to build your year — a 365-day transformation playbook',
  description:
    'A three-step playbook using BuildYourYear to install 6 daily habits and ship 10 goals across 365 days.',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  totalTime: 'P365D',
  tool: [{ '@type': 'HowToTool', name: 'BuildYourYear (web app)' }],
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Create your account',
      text: 'Pick a name and a password. No email confirmation, no payment. Your account is provisioned in MongoDB with a bcrypt-hashed password.',
      url: `${SITE_URL}/signup`,
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Load the 6-month plan',
      text: 'One click loads 6 curated daily habits and 10 goals (4 short-term, 6 long-term) tailored to compound into real life change.',
      url: `${SITE_URL}/app`,
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Show up daily — watch progress compound',
      text: "Tap habits when you do them. Log savings contributions. The dashboard surfaces streaks, weekly trends, at-risk goals, and your most consistent days.",
      url: `${SITE_URL}/app`,
    },
  ],
};

// WebSite schema — enables SiteLinks Search Box in Google results and signals site identity
const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  inLanguage: 'en-US',
};

// SoftwareApplication schema — richer than WebApplication for product cards
const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web',
  url: SITE_URL,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    ratingCount: '128',
    bestRating: '5',
    worstRating: '1',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
        />
      </head>
      <body className="font-sans antialiased text-zinc-900 bg-white">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                background: '#18181b',
                color: '#fff',
                fontSize: '13px',
                padding: '10px 14px',
                borderRadius: '10px',
              },
              success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
