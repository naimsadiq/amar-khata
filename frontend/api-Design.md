
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




---

### পর্ব ১: ডেটাবেস কালেকশন ডিজাইন (MongoDB)
আপনার অ্যাপের জন্য মূলত ৫টি প্রধান কালেকশন (Collections) লাগবে। 

**১. Users / Businesses (ইউজার/ব্যবসা):**
*   `_id`, `name`, `phone`, `pin`, `businessName`, `businessId` (আপনার আগের কাজ)।

**২. Parties (গ্রাহক এবং সাপ্লায়ার):**
যাদের কাছে মাল বেচবেন বা কিনবেন।
*   `businessId` (কোন ব্যবসার কাস্টমার), `name`, `type` (enum: 'CUSTOMER' বা 'SUPPLIER'), `phone`, `address`, `openingBalance` (শুরুর বকেয়া)।

**৩. Products (পণ্য/ইনভেন্টরি):**
*   `businessId`, `name`, `category`, `buyPrice`, `sellPrice`, `stockQuantity` (বর্তমান স্টক), `lowStockAlert` (কত পিস থাকলে স্টক ওয়ার্নিং দিবে, যেমন: ৫), `unit` (কেজি/লিটার/পিস)।

**৪. Transactions (লেনদেন / ক্যাশবুক):** 
এটি আপনার অ্যাপের **হার্ট**। যেকোনো টাকা আদান-প্রদান এখানে সেভ হবে।
*   `businessId`, `partyId` (কার সাথে লেনদেন, কাস্টমার না সাপ্লায়ার - null হতে পারে নগদ বিক্রির ক্ষেত্রে), `type` (enum: 'SALE', 'PURCHASE', 'PAYMENT_RECEIVED', 'PAYMENT_SENT'), `amount` (টাকার পরিমাণ), `paymentMethod` (নগদ/ব্যাংক), `date`, `description`।

**৫. Invoices / Bills (ইনভয়েস বা বিল - অপশনাল কিন্তু ভালো):**
যখন অনেকগুলো পণ্য একসাথে বিক্রি করবেন, তখন সেগুলোর ডিটেইলস রাখার জন্য।
*   `businessId`, `partyId`, `totalAmount`, `discount`, `paidAmount`, `dueAmount`, `items` (Array of objects - কোন পণ্য কত পিস), `date`।

---

### পর্ব ২: কোন API-এর কাজ আগে শুরু করবেন? (Work Sequence)

ড্যাশবোর্ডে ডাটা দেখানোর জন্য আগে ডাটাবেসে ডাটা ঢোকাতে হবে (Data Entry)। তাই নিচের সিকোয়েন্স অনুযায়ী API বানান:

#### 🟢 ধাপ ১: Foundation APIs (ভিত্তি তৈরি)
যেহেতু ইউজার লগিন/রেজিস্ট্রেশন হয়ে গেছে, তাই এই কাজগুলো আগে করুন:
1.  **Party API (গ্রাহক/সাপ্লায়ার):**
    *   `POST /api/parties` (নতুন গ্রাহক/সাপ্লায়ার যুক্ত করা)
    *   `GET /api/parties` (লিস্ট দেখা)
2.  **Product API (ইনভেন্টরি):**
    *   `POST /api/products` (নতুন মাল/পণ্য যোগ করা)
    *   `GET /api/products` (পণ্যের লিস্ট দেখা)

*(এই দুটো না থাকলে আপনি বিক্রি করতে পারবেন না, কারণ কার কাছে বেচবেন এবং কী বেচবেন সেটা ডাটাবেসে থাকতে হবে)।*

#### 🟡 ধাপ ২: Core Operations APIs (লেনদেন বা হিসাব)
এগুলো হলো আপনার ড্যাশবোর্ডের উপরের Quick Actions বাটনগুলো (নতুন বিক্রয়, টাকা পেলাম ইত্যাদি)।
1.  **Sales / Purchase API (কেনা-বেচা):**
    *   `POST /api/invoices` (বিল তৈরি করা। এতে একই সাথে Product-এর স্টক কমবে এবং Transactions-এ ডাটা সেভ হবে)।
2.  **Cashflow API (টাকা পেলাম/দিলাম):**
    *   `POST /api/transactions` (শুধু টাকা আদান-প্রদান। যেমন: বকেয়া শোধ করা)।

#### 🔴 ধাপ ৩: Dashboard APIs (সবশেষে ড্যাশবোর্ডের কাজ)
সব ডাটা যখন ডাটাবেসে ঢোকা শুরু করবে, তখন ড্যাশবোর্ডের API বানাবেন। ড্যাশবোর্ডের জন্য অনেকগুলো ছোট ছোট API না বানিয়ে, **১টি বা ২টি বড় API** বানানো ভালো, যা একসাথে অনেকগুলো ডাটা পাঠাবে।

যেমন: `GET /api/dashboard/summary` 

এই API এর ভেতরে আপনি MongoDB-এর **Aggregation Framework (`$match`, `$group`, `$sum`)** ব্যবহার করে ক্যালকুলেশন করবেন:

*   **মোট পাওনা / মোট দেনা:** `Parties` কালেকশনে কুয়েরি করে সব কাস্টমারের বর্তমান ব্যালেন্স যোগ করবেন।
*   **হাতে নগদ:** `Transactions` কালেকশনে গিয়ে `(Total IN - Total OUT)` ক্যালকুলেট করবেন।
*   **স্টক সতর্কতা:** `Products` কালেকশনে কুয়েরি করবেন `find({ stockQuantity: { $lte: 5 } })`।
*   **সাম্প্রতিক লেনদেন:** `Transactions` কালেকশন থেকে `sort({ date: -1 }).limit(5)` দিয়ে সর্বশেষ ৫টি লেনদেন আনবেন।
*   **শীর্ষ পণ্য:** `Invoices` কালেকশনের `items` অ্যারে থেকে গ্রুপ করে বের করবেন কোন পণ্য সবচেয়ে বেশি বিক্রি হয়েছে।

---

### আপনার জন্য আমার পরামর্শ (My Advice):

১. **আজকের কাজ:** সবার আগে **"নতুন গ্রাহক"** এবং **"ইনভেন্টরি (পণ্য যোগ)"**-এর API এবং ফ্রন্টএন্ড ফর্ম ইন্টিগ্রেশনের কাজ ধরুন। 
২. **কালকের কাজ:** ইনভেন্টরি থেকে ডাটা নিয়ে **"নতুন বিক্রয়" (POS/Billing)** এর কাজ ধরবেন।
৩. **পরশু দিনের কাজ:** ক্যাশবুকের লেনদেন (টাকা পেলাম/দিলাম)।
৪. **সবশেষ:** যখন দেখবেন আপনার ডাটাবেসে সুন্দর কাস্টমার, প্রোডাক্ট আর বিক্রির ডাটা চলে এসেছে, তখন ড্যাশবোর্ডের চার্ট এবং সামারি কার্ডের API লিখবেন।

এই নিয়মে এগোলে আপনি কোথাও আটকাবেন না এবং ডাটার ফ্লো একদম লজিক্যাল থাকবে।