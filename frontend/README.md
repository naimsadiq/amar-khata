This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.




frontend/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.jsx
│   │   │   └── register/page.jsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.jsx
│   │   │   ├── layout.jsx
│   │   │   └── components/
│   │   │
│   │   ├── parties/
│   │   ├── transactions/
│   │   ├── inventory/
│   │   ├── billing/
│   │   ├── reports/
│   │   ├── banking/
│   │   └── staff/
│   │
│   ├── components/            # Reusable UI components
│   │   ├── ui/                # shadcn/ui components
│   │   ├── shared/            # Navbar, Sidebar
│   │   └── forms/
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useBusiness.js
│   │   └── useDebounce.js
│   │
│   ├── lib/
│   │   ├── axios.js           # Axios instance
│   │   ├── react-query.js
│   │   └── utils.js
│   │
│   ├── store/                 # Zustand store
│   │   ├── authStore.js
│   │   ├── businessStore.js
│   │   └── cartStore.js
│   │
│   ├── services/              # API functions
│   │   ├── auth.service.js
│   │   ├── inventory.service.js
│   │   ├── transaction.service.js
│   │   └── billing.service.js
│   │
│   ├── types/ (optional if TS)
│   │
│   └── styles/
│
├── public/
├── package.json
└── README.md