import axios from "axios";

// ১. Axios Instance তৈরি
const api = axios.create({
  // .env.local ফাইলে NEXT_PUBLIC_API_URL ভেরিয়েবলটি রাখতে হবে (যেমন: http://localhost:5000)
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000",

  // 🔥 সবচেয়ে গুরুত্বপূর্ণ: এটি true না করলে ব্রাউজার httpOnly কুকি সার্ভারে পাঠাবে না!
  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ২. Request Interceptor
api.interceptors.request.use(
  (config) => {
    // যেহেতু টোকেন কুকিতে আছে এবং লোডিং স্কেলিটন দিয়ে হবে,
    // তাই এখানে এক্সট্রা কোনো কোড লেখার প্রয়োজন নেই। সরাসরি config রিটার্ন করে দিলাম।
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ৩. Response Interceptor
api.interceptors.response.use(
  (response) => {
    // ডেটা ঠিকঠাক আসলে সরাসরি রিটার্ন করে দাও
    return response;
  },
  (error) => {
    // যদি ব্যাকএন্ড থেকে 401 (Unauthorized) বা টোকেন এক্সপায়ার এরর আসে
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or unauthorized. Redirecting...");

      // ক্লায়েন্ট সাইডে থাকলে ইউজারকে লগিন পেজে রিডাইরেক্ট করা
      if (typeof window !== "undefined") {
        window.location.href = "/login";
        // (বি.দ্র: window.location.href দিলে পেজটি হার্ড-রিলোড হয়,
        // যা আগের সব স্টেট বা গারবেজ ডেটা ক্লিয়ার করে ফ্রেশভাবে লগিন পেজে নেয়, তাই এটি নিরাপদ।)
      }
    }

    // অন্যান্য যেকোনো এরর (যেমন 404, 500) আগের মতোই রিজেক্ট হবে যেন কম্পোনেন্টে catch ব্লকে ধরা যায়
    return Promise.reject(error);
  },
);

export default api;
