backend/
│
├── src/
│ ├── config/
│ │ ├── db.js
│ │ └── env.js
│ │
│ ├── modules/ # Feature-based structure (best practice)
│ │ ├── auth/
│ │ │ ├── auth.controller.js
│ │ │ ├── auth.service.js
│ │ │ ├── auth.routes.js
│ │ │ ├── auth.validation.js
│ │ │ └── auth.model.js
│ │ │
│ │ ├── business/
│ │ ├── user/
│ │ ├── inventory/
│ │ ├── transaction/
│ │ ├── billing/ # POS / invoice logic
│ │ ├── report/
│ │ └── staff/
│ │
│ ├── middlewares/
│ │ ├── auth.middleware.js
│ │ ├── error.middleware.js
│ │ └── upload.middleware.js
│ │
│ ├── utils/
│ │ ├── apiResponse.js
│ │ ├── generateToken.js
│ │ ├── calculateLedger.js
│ │ └── helpers.js
│ │
│ ├── routes/
│ │ └── index.js # All module routes combine
│ │
│ ├── app.js # Express app config
│ └── server.js # Server start
│
├── .env
├── package.json
└── README.md

আপনার সমস্যাগুলো সমাধানের জন্য আমি ৫টি কালেকশনের (Collection) একটি স্ট্যান্ডার্ড এবং প্রফেশনাল ডাটাবেজ স্কিমা (Mongoose/MongoDB স্টাইলে) তৈরি করে দিচ্ছি।

এই স্ট্রাকচার ফলো করলে জীবনেও আপনার স্টক, ডিউ ব্যালেন্স বা প্রফিট-লস রিপোর্টে কোনো গরমিল হবে না।

---

### ১. Products (পণ্য কালেকশন)

এখানে শুধু বর্তমান অবস্থা এবং সাধারণ তথ্য থাকবে।

```javascript
const productSchema = {
  name: String, // "বাসমতি চাল"
  category: String, // "চাল/ডাল"
  unit: String, // "কেজি"

  // এই দামগুলো শুধু ফর্মে অটো-ফিল হওয়ার জন্য
  currentBuyPrice: Number, // 80
  currentSellPrice: Number, // 90

  // স্টক হিসেব
  openingStock: Number, // 40 (সফটওয়্যার শুরুর দিনের স্টক)
  stockQuantity: Number, // 40 (এটা রানিং ব্যালেন্স, কিনলে বাড়বে, বেচলে কমবে)
  lowStockAlert: Number, // 10

  businessId: String, // "#15464"
  createdAt: Date,
  updatedAt: Date,
};
```

### ২. Parties (কাস্টমার ও সাপ্লায়ার কালেকশন)

এখানে কাস্টমার বা সাপ্লায়ারের প্রোফাইল থাকবে।

```javascript
const partySchema = {
  type: String, // "customer" অথবা "supplier"
  name: String, // "মেসার্স আলম ট্রেডার্স"
  phone: String, // "01933456789"
  address: String, // "নওগাঁ রোড"

  // ব্যালেন্স হিসেব
  openingBalance: Number, // 6000 (সফটওয়্যার শুরুর দিনের বকেয়া)
  currentDue: Number, // 6000 (এটা রানিং ব্যালেন্স, বাকি দিলে বাড়বে, টাকা দিলে কমবে)

  businessId: String,
  createdAt: Date,
  updatedAt: Date,
};
```

---

_(নিচের কালেকশনগুলো হলো আপনার মূল হিস্ট্রি বা ট্রানজেকশন)_

### ৩. Purchases (পণ্য ক্রয়ের ইনভয়েস - সাপ্লায়ারের থেকে)

আপনি যখন মাল কিনবেন তখন এখানে ডাটা সেভ হবে এবং প্রোডাক্টের স্টক ও সাপ্লায়ারের বাকি আপডেট হবে।

```javascript
const purchaseSchema = {
  invoiceNo: String, // "PUR-1001"
  supplierId: ObjectId, // (Party Collection এর ID)
  purchaseDate: Date, // কবে কিনেছেন

  // মালের লিস্ট (এটাই সবচেয়ে গুরুত্বপূর্ণ)
  items: [
    {
      productId: ObjectId, // প্রোডাক্টের ID
      quantity: Number, // 50 (কেজি)
      buyPriceAtPurchase: Number, // 82 (কেনার সময়কার দাম, প্রোডাক্টের দাম বাড়লেও এটা ৮২ ই থাকবে)
      totalLineAmount: Number, // 50 * 82 = 4100
    },
  ],

  // বিলের হিসাব
  subTotal: Number, // 4100
  discount: Number, // 100
  grandTotal: Number, // 4000
  paidAmount: Number, // 3000 (কত টাকা নগদে দিলেন)
  dueAmount: Number, // 1000 (কত বাকি থাকলো, এটা সাপ্লায়ারের currentDue তে যোগ হবে)

  businessId: String,
  createdAt: Date,
};
```

### ৪. Sales (পণ্য বিক্রয়ের ইনভয়েস - কাস্টমারের কাছে)

মাল বিক্রির সময় এই স্কিমা ব্যবহার হবে। **প্রফিট-লস হিসাব করার ম্যাজিকটা এখানেই।**

```javascript
const saleSchema = {
  invoiceNo: String, // "INV-2001"
  customerId: ObjectId, // (Party Collection এর ID, walk-in কাস্টমার হলে null বা "Cash Customer")
  saleDate: Date,

  // মালের লিস্ট
  items: [
    {
      productId: ObjectId,
      quantity: Number, // 10 (কেজি)
      sellPriceAtSale: Number, // 95 (বিক্রির সময়কার দাম)
      buyPriceAtSale: Number, // 80 (বিক্রির সময় ওই প্রোডাক্টের কেনা দাম কত ছিল? এটা সেভ রাখলে প্রফিট বের করা একদম সহজ)
      totalLineAmount: Number, // 10 * 95 = 950
    },
  ],

  // বিলের হিসাব
  subTotal: Number, // 950
  discount: Number, // 50
  grandTotal: Number, // 900
  paidAmount: Number, // 900
  dueAmount: Number, // 0 (বাকি থাকলে কাস্টমারের currentDue তে যোগ হবে)

  businessId: String,
  createdAt: Date,
};
```

### ৫. Payments / Ledger (টাকা আদান-প্রদান কালেকশন)

সাপ্লায়ারকে আগের বকেয়া টাকা পরিশোধ করলে বা কাস্টমার আগের বাকি টাকা দিলে এই টেবিলে এন্ট্রি হবে।

```javascript
const paymentSchema = {
  partyId: ObjectId, // কাস্টমার বা সাপ্লায়ারের ID
  paymentType: String, // "Received" (টাকা পেলাম) অথবা "Paid" (টাকা দিলাম)
  amount: Number, // 5000
  paymentMethod: String, // "Cash", "Bank", "Bkash"
  date: Date,

  // কিসের টাকা?
  purpose: String, // "OpeningBalance", "SaleDueCollection", "PurchaseDuePayment"
  referenceId: String, // যদি কোনো ইনভয়েসের বিপরীতে টাকা দেয়, তবে তার InvoiceNo
  note: String, // "আলম সাহেবকে নগদে ৫০০০ টাকা দেওয়া হলো"

  businessId: String,
  createdAt: Date,
};
```

---

### এই স্কিমা দিয়ে কিভাবে কাজ করবেন? (Workflow):

১. **প্রথমবার প্রোডাক্ট অ্যাড করার সময়:**
ফর্মে দিলেন `Opening Stock = 40`।

- **Products** টেবিলে `stockQuantity = 40` সেভ হবে।

২. **নতুন মাল কেনার সময় (Purchase):**
ফর্মে সাপ্লায়ার সিলেক্ট করে ৫০ কেজি মাল কিনলেন।

- **Purchases** টেবিলে একটা বিল তৈরি হবে।
- ব্যাকএন্ড কোড দিয়ে **Products** টেবিলে `stockQuantity = 40 + 50 = 90` করে দিবেন।
- প্রোডাক্টের নতুন কেনা দাম যদি বাড়ে, তবে Products টেবিলে `currentBuyPrice` আপডেট করে দিবেন।

৩. **মাল বিক্রির সময় (Sale):**

- **Sales** টেবিলে বিল তৈরি হবে। বিলের ভেতরে `sellPriceAtSale` এবং `buyPriceAtSale` সেভ থাকবে।
- ব্যাকএন্ড কোড দিয়ে **Products** টেবিলে `stockQuantity = 90 - 10 = 80` করে দিবেন।

৪. **প্রফিট / লস রিপোর্ট দেখার সময়:**
আপনাকে আর প্রোডাক্ট টেবিলে যেতে হবে না। আপনি শুধু **Sales** টেবিল থেকে নির্দিষ্ট মাসের ডাটা টানবেন।
`Profit = (sellPriceAtSale - buyPriceAtSale) * quantity - discount`
যেহেতু বিক্রির সময়কার কেনা দাম এবং বেচা দাম দুটোই বিলে সেভ করা আছে, তাই আজকে প্রোডাক্টের দাম পরিবর্তন হলেও গত মাসের রিপোর্টে কোনো প্রভাব পড়বে না!

৫. **সাপ্লায়ার/কাস্টমারের লেজার রিপোর্ট:**
**Payments** টেবিল এবং **Sales/Purchases** টেবিল মিলিয়ে দেখালেই একদম পারফেক্ট লেজার বা খতিয়ান তৈরি হয়ে যাবে।

এই স্ট্রাকচারটি ফলো করে আপনি প্রজেক্ট শুরু করতে পারেন। ইনভেন্টরি ম্যানেজমেন্টের জন্য এটি একটি পরীক্ষিত (Tested) স্কিমা আর্কিটেকচার।
