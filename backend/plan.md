যখন "টাকা পেলাম" বা "টাকা দিলাম" বাটনে ক্লিক করা হবে, তখন শুধু ক্যাশবুক আপডেট করলেই হবে না, কার টাকা, কেন দিচ্ছে, তার বাকির খাতা—সব একসাথে আপডেট হতে হবে।
এই পুরো প্রক্রিয়াটি কীভাবে কাজ করবে এবং কী কী ইনপুট নিতে হবে, তা নিচে বিস্তারিত বুঝিয়ে দিচ্ছি:
১. "টাকা পেলাম / দিলাম" বাটনে ক্লিক করলে কী কী ইনপুট (Form Fields) নিবেন?
একটি পপ-আপ বা মডাল ওপেন হবে, সেখানে নিচের ফিল্ডগুলো থাকবে:
তারিখ (Date): আজকের তারিখ ডিফল্ট থাকবে, চাইলে ইউজার পরিবর্তন করতে পারবে।
লেনদেনের ধরন / খাত (Transaction Category): এটি সবচেয়ে গুরুত্বপূর্ণ! এখানে একটি ড্রপডাউন (Dropdown) থাকবে।
টাকা পাওয়ার ক্ষেত্রে অপশন: "কাস্টমার থেকে বকেয়া আদায়", "সরাসরি পণ্য বিক্রয়", "অন্যান্য আয়" ইত্যাদি।
টাকা দেওয়ার ক্ষেত্রে অপশন: "সাপ্লায়ারকে পেমেন্ট", "কর্মচারীর বেতন", "দোকান ভাড়া", "অন্যান্য খরচ" ইত্যাদি।
পার্টির নাম (Party Name - Customer/Supplier): (এটি শুধুমাত্র তখন ভিজিবল হবে, যখন ইউজার উপরের ক্যাটাগরিতে 'কাস্টমার' বা 'সাপ্লায়ার' সিলেক্ট করবে)। এখানে সার্চ করে কাস্টমার বা সাপ্লায়ারের নাম সিলেক্ট করতে হবে।
টাকার পরিমাণ (Amount): কত টাকা আদান-প্রদান হচ্ছে।
রেফারেন্স বা ইনভয়েস নং (Reference/Invoice No): (ঐচ্ছিক) কোন মেমোর টাকা দিচ্ছে তার নাম্বার।
বিস্তারিত বিবরণ (Note): মন্তব্য লেখার জায়গা।
২. কাস্টমারের কাছ থেকে বকেয়া টাকা পেলে ব্যাকএন্ডে কী কী আপডেট করবেন?
ধরুন, ইউজার ফর্ম পূরণ করল: ধরন- কাস্টমার বকেয়া আদায়, কাস্টমার- রহিম, টাকা- ৫০০।
ফর্ম সাবমিট হওয়ার পর আপনার ব্যাকএন্ড (Backend) কোডে ৩টি কাজ একসাথে করতে হবে:
কাজ ১ (ক্যাশবুক আপডেট): Cashbook_Transactions কালেকশনে একটি ডাটা ঢুকবে। (Type: IN, Amount: 500, Note: রহিমের কাছ থেকে বকেয়া আদায়)। এতে ড্যাশবোর্ডের আয় বেড়ে যাবে।
কাজ ২ (কাস্টমারের ব্যালেন্স আপডেট): আপনার Customers নামের যে কালেকশন আছে, সেখানে 'রহিম' এর ডাটা খুঁজবেন। তার প্রোফাইলে যদি total_due (মোট বাকি) ১৫০০ টাকা থাকে, সেখান থেকে এই ৫০০ টাকা মাইনাস করে total_due: 1000 করে আপডেট করে দিবেন।
কাজ ৩ (ইনভয়েস বা মেমো আপডেট - অ্যাডভান্সড): আপনি বলেছেন "কোন প্রোডাক্ট বাকি ছিল তা আপডেট করতে"। অ্যাকাউন্টিংয়ের ভাষায় প্রোডাক্ট অনুযায়ী বাকি মাইনাস হয় না, মাইনাস হয় ইনভয়েস (Invoice) বা মেমো অনুযায়ী।
রহিমের যদি দুটো মেমো বাকি থাকে (মেমো ১: ৩০০ টাকা, মেমো ২: ৪০০ টাকা)।
সে ৫০০ টাকা দিলে, সিস্টেম প্রথমে 'মেমো ১' এর ৩০০ টাকা পেইড (Paid) করে দিবে।
বাকি ২০০ টাকা দিয়ে 'মেমো ২' এর ৪০০ টাকা থেকে কমিয়ে সেটার ডিউ ২০০ টাকা করে দিবে (Partially Paid)।
৩. সাপ্লায়ারকে টাকা দিলে ব্যাকএন্ডে কী কী আপডেট করবেন?
ধরুন, ইউজার ফর্ম পূরণ করল: ধরন- সাপ্লায়ারকে পেমেন্ট, সাপ্লায়ার- করিম ট্রেডার্স, টাকা- ১০০০।
এখানেও ব্যাকএন্ডে ৩টি কাজ হবে:
কাজ ১ (ক্যাশবুক আপডেট): Cashbook_Transactions কালেকশনে ডাটা ঢুকবে। (Type: OUT, Amount: 1000, Note: করিম ট্রেডার্সকে পেমেন্ট)। এতে ড্যাশবোর্ডের খরচ বেড়ে যাবে এবং ক্যাশ কমে যাবে।
কাজ ২ (সাপ্লায়ারের ব্যালেন্স আপডেট): আপনার Suppliers কালেকশনে করিম ট্রেডার্সের প্রোফাইলে যে total_payable (আমরা কত টাকা পাবো) আছে, সেখান থেকে ১০০০ টাকা মাইনাস করে দিবেন।
কাজ ৩ (পারচেজ বিল আপডেট): আপনি করিম ট্রেডার্সের কাছ থেকে যে মাল কিনেছিলেন (Purchase Bills), সেগুলোর মধ্যে যেগুলোর টাকা বাকি আছে, আগের নিয়মে (পুরাতন বিল আগে ক্লিয়ার হবে) সেই বিলগুলোর স্ট্যাটাস 'Unpaid' থেকে 'Paid' বা 'Partial' করে দিবেন।
৪. সাধারণ খরচ বা আয় হলে কী করবেন?
যদি ইউজার 'দোকান ভাড়া' হিসেবে ২০০০ টাকা এন্ট্রি করে, তবে এটি খুব সহজ।
কারো প্রোফাইল আপডেট করার দরকার নেই।
শুধু Cashbook_Transactions কালেকশনে (Type: OUT, Category: Shop_Rent, Amount: 2000) এন্ট্রি করে দিবেন। ক্যাশবুক নিজে নিজেই ম্যানেজ হয়ে যাবে।
💡 ডেভেলপারের জন্য একটি স্পেশাল টিপস (Database Transaction):
যেহেতু আপনি একই ক্লিকে ২টি বা ৩টি কালেকশন আপডেট করছেন (ক্যাশবুক + কাস্টমার প্রোফাইল + ইনভয়েস), তাই আপনাকে ডেটাবেসের Transactions / Rollback সিস্টেম ব্যবহার করতে হবে।
ধরে নিন, ক্যাশবুক আপডেট হলো, কিন্তু ইন্টারনেট সমস্যার কারণে কাস্টমারের বাকিটা আপডেট হলো না। এতে বিশাল হিসেবে গড়মিল হবে। ডেটাবেস ট্রানজ্যাকশন ব্যবহার করলে, সবগুলো আপডেট একসাথে সাকসেসফুল হলে তবেই ডাটা সেভ হবে, নতুবা কোনোটিই সেভ হবে না। (MongoDB বা SQL সবটাতেই এই ফিচার আছে)।
সংক্ষেপে লজিকটি হলো: ফ্রন্টএন্ড থেকে শুধু ডাটা রিসিভ করবেন। ব্যাকএন্ডে ইফ-এলস (if-else) বা সুইচ (switch) কন্ডিশন দিয়ে চেক করবেন ক্যাটাগরি কী। কাস্টমার হলে কাস্টমারের লজিক চালাবেন, সাপ্লায়ার হলে সাপ্লায়ারের লজিক চালাবেন।


আপনার আগের আলোচনা অনুযায়ী, একটি পারফেক্ট অ্যাকাউন্টিং সিস্টেম তৈরি করার জন্য শুধুমাত্র একটি স্কিমা দিয়ে কাজ হবে না। ড্যাশবোর্ডের ফর্ম ("টাকা পেলাম / দিলাম") থেকে ডাটা নিয়ে ব্যাকএন্ডে রিলেশনাল ডাটাবেসের মতো কাজ করতে হবে। 

আমি নিচে **Mongoose (Node.js)** স্টাইলে স্কিমাগুলো তৈরি করে দিচ্ছি। আপনার মূলত ৩-৪ টি কালেকশন/স্কিমা লাগবে:

### ১. Cashbook Transaction Schema (ক্যাশবুক স্কিমা)
ড্যাশবোর্ডের ফর্ম থেকে ডাটা সরাসরি এই কালেকশনে এসে সেভ হবে। এটিই আপনার মূল ক্যাশবুক।

```javascript
const mongoose = require('mongoose');

const cashbookSchema = new mongoose.Schema({
  date: { 
    type: Date, 
    default: Date.now,
    required: true 
  },
  transactionType: { 
    type: String, 
    enum: ['IN', 'OUT'], // IN = টাকা পেলাম, OUT = টাকা দিলাম
    required: true 
  },
  category: {
    type: String,
    // লেনদেনের খাত। যেমন: কাস্টমার পেমেন্ট, সাপ্লায়ার পেমেন্ট, দোকান ভাড়া ইত্যাদি
    enum: ['Customer_Collection', 'Supplier_Payment', 'Direct_Sale', 'Rent', 'Salary', 'Other_Income', 'Other_Expense'],
    required: true
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0 
  },
  // partyId তে কাস্টমার বা সাপ্লায়ারের _id বসবে (যদি লেনদেন তাদের সাথে হয়)
  partyId: { 
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'partyModel', // ডাইনামিক রেফারেন্স (নিচের ফিল্ডের উপর নির্ভর করবে)
    default: null
  },
  // partyModel বলে দিবে উপরের আইডিটা কার (Customer নাকি Supplier)
  partyModel: {
    type: String,
    enum: ['Customer', 'Supplier'],
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Bank', 'Mobile_Banking'], // আপনার ক্যাশবুক শুধু 'Cash' এর জন্য হলে এটি ঐচ্ছিক
    default: 'Cash'
  },
  referenceNo: { 
    type: String, // মেমো বা রশিদ নম্বর (যদি থাকে)
    default: ''
  },
  note: { 
    type: String, // বিস্তারিত বিবরণ
    default: ''
  }
}, { timestamps: true });

module.exports = mongoose.model('CashbookTransaction', cashbookSchema);
```

---

### ২. Customer Schema (কাস্টমার স্কিমা)
কাস্টমারের তথ্য এবং তার মোট বাকির হিসাব রাখার জন্য।

```javascript
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  address: { type: String },
  // এই ফিল্ডটি সবচেয়ে গুরুত্বপূর্ণ। কাস্টমার টাকা দিলে এটি মাইনাস হবে, বাকিতে মাল নিলে প্লাস হবে।
  totalDue: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
```

---

### ৩. Supplier Schema (সাপ্লায়ার স্কিমা)
সাপ্লায়ারের তথ্য এবং আপনি তাদের কত টাকা দিবেন তার হিসাব।

```javascript
const supplierSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPerson: { type: String },
  phone: { type: String, required: true },
  // আপনি কত টাকা পাবেন/দিবেন তার হিসাব। সাপ্লায়ারকে টাকা দিলে এটি মাইনাস হবে।
  totalPayable: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
```

---

### ৪. Sale Invoice Schema (বিক্রয় মেমো স্কিমা) - *ঐচ্ছিক কিন্তু স্ট্যান্ডার্ড*
আপনি যে বলেছিলেন, "কোন প্রোডাক্ট বাকি ছিল তা আপডেট করতে", সেটার জন্য প্রতিটি বিক্রয়ের একটি ইনভয়েস স্কিমা থাকা লাগে।

```javascript
const saleInvoiceSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true, unique: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  date: { type: Date, default: Date.now },
  
  // প্রোডাক্টের লিস্ট
  products: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    price: { type: Number }
  }],

  totalAmount: { type: Number, required: true }, // মোট বিল
  paidAmount: { type: Number, default: 0 },      // কত টাকা দিয়েছে
  dueAmount: { type: Number, required: true },   // কত টাকা বাকি (totalAmount - paidAmount)
  
  status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Unpaid'
  }
}, { timestamps: true });

module.exports = mongoose.model('SaleInvoice', saleInvoiceSchema);
```

---

### 💡 ব্যাকএন্ডে (Controller) স্কিমাগুলো যেভাবে একসাথে কাজ করবে:

যখন কেউ ড্যাশবোর্ড থেকে **"টাকা পেলাম"** বাটনে ক্লিক করে ফর্ম সাবমিট করবে (ধরুন একজন কাস্টমার ১০০০ টাকা দিল):

আপনার `backend API` বা `Controller` এ নিচের কাজগুলো ধাপে ধাপে করতে হবে:

1. **CashbookTransaction.create()** কল করে ক্যাশবুকে ১০০০ টাকার একটি `IN` এন্ট্রি সেভ করবেন।
2. **Customer.findByIdAndUpdate()** কল করে সেই কাস্টমারের আইডিতে গিয়ে তার `totalDue` থেকে ১০০০ টাকা কমিয়ে দিবেন। `($inc: { totalDue: -1000 })`
3. *(যদি ইনভয়েস ট্র্যাকিং করেন)* **SaleInvoice.find({ customerId: id, status: { $ne: 'Paid' } })** দিয়ে তার বকেয়া মেমোগুলো খুঁজে বের করবেন এবং একটি একটি করে মেমোর `dueAmount` কমিয়ে `paidAmount` বাড়িয়ে দিবেন, যতক্ষণ না ১০০০ টাকা শেষ হয়।

এই ৩টি কাজ সফলভাবে সম্পন্ন হলেই আপনার ড্যাশবোর্ডের "নেট ব্যালেন্স" বেড়ে যাবে এবং কাস্টমারের বাকির খাতা স্বয়ংক্রিয়ভাবে আপডেট হয়ে যাবে!