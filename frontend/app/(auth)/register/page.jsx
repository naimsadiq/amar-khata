"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { signIn } from "@/lib/signIn";
import Navbar from "@/home/navbar/Navbar";
import Footer from "@/home/Footer";
import useAuth from "@/hook/useAuth";

export default function RegisterPage() {
  const router = useRouter();
  const { fetchUser } = useAuth();

  // States
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    email: "",
    pin: "",
  });
  const [timer, setTimer] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form for Registration
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // React Hook Form for OTP
  const {
    register: registerOtp,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm();

  // Timer Logic for Resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Registration Form Submit
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();

      if (response.ok) {
        setUserCredentials({ email: data.email, pin: data.pin });
        setIsOtpStep(true);
        setTimer(60);
      } else {
        Swal.fire(
          "নিবন্ধন ব্যর্থ হয়েছে",
          result.message || "কোথাও কোনো সমস্যা হয়েছে!",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "নেটওয়ার্ক সমস্যা",
        "অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করুন।",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Verification Submit
  const onOtpSubmit = async (data) => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userCredentials.email, otp: data.otp }),
        },
      );

      if (response.ok) {
        // SignIn logic after successful OTP verification
        const result = await signIn(userCredentials.email, userCredentials.pin);

        if (result.success) {
          await fetchUser(); // Update Auth Context with new user data
          await Swal.fire({
            icon: "success",
            title: "ওটিপি যাচাই সফল 🎉",
            text: "আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!",
          });

          router.push("/dashboard");
        } else {
          Swal.fire("লগইন ব্যর্থ হয়েছে", result.message, "error");
        }
      } else {
        Swal.fire(
          "ভুল ওটিপি",
          "আপনার দেওয়া কোডটি ভুল বা মেয়াদোত্তীর্ণ।",
          "error",
        );
      }
    } catch (error) {
      Swal.fire(
        "নেটওয়ার্ক সমস্যা",
        "অনুগ্রহ করে আপনার ইন্টারনেট সংযোগ চেক করুন।",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP Handler
  const handleResendCode = async () => {
    if (timer > 0 || isResending) return;

    try {
      setIsResending(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userCredentials.email }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "ওটিপি আবার পাঠানো হয়েছে!",
          showConfirmButton: false,
          timer: 3000,
        });
        setTimer(60);
      } else {
        Swal.fire(
          "ত্রুটি",
          data.message || "ওটিপি আবার পাঠাতে ব্যর্থ হয়েছে",
          "error",
        );
      }
    } catch (error) {
      Swal.fire("ত্রুটি", "ওটিপি পাঠানোর সময় নেটওয়ার্ক সমস্যা হয়েছে", "error");
    } finally {
      setIsResending(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    console.log("Initiating Google Login...");
    // Add NextAuth (signIn('google')) or Firebase Google auth here
  };

  return (
    <main className="bg-background">
      <Navbar></Navbar>
      <div className="pt-20 flex flex-col md:flex-row min-h-screen max-w-screen-2xl mx-auto">
        {/* Left Side: Dynamic Forms */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-24">
          <div className="w-full max-w-md">
            {!isOtpStep ? (
              /* ================== REGISTRATION FORM ================== */
              <>
                <header className="mb-10 animate-fade-in-up">
                  <h1 className="text-3xl font-bold mb-2 tracking-tight">
                    আপনার অ্যাকাউন্ট তৈরি করুন
                  </h1>
                  <p className="text-[#414754] text-sm">
                    ডিজিটাল কারিগরদের সাথে যুক্ত হয়ে নিখুঁতভাবে আপনার ব্যবসা
                    পরিচালনা করুন।
                  </p>
                </header>

                <div className="animate-fade-in-up space-y-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-[#414754]">
                        পুরো নাম
                      </Label>
                      <Input
                        placeholder="যেমন: আপনার নাম"
                        className={`bg-[#e5e8ee] border-none rounded-xl h-12 focus:ring-2 focus:ring-[#005bbf] ${errors.fullName ? "ring-2 ring-red-500" : ""}`}
                        {...register("fullName", {
                          required: "পুরো নাম দেওয়া আবশ্যক",
                        })}
                      />
                      {errors.fullName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    {/* Business Name (দোকানের নাম) */}
                    <div className="space-y-1.5">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-[#414754]">
                        দোকানের / ব্যবসার নাম
                      </Label>
                      <Input
                        placeholder="যেমন: মেসার্স এন্টারপ্রাইজ"
                        className={`bg-[#e5e8ee] border-none rounded-xl h-12 focus:ring-2 focus:ring-[#005bbf] ${errors.businessName ? "ring-2 ring-red-500" : ""}`}
                        {...register("businessName", {
                          required: "দোকানের নাম দেওয়া আবশ্যক",
                        })}
                      />
                      {errors.businessName && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.businessName.message}
                        </p>
                      )}
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="uppercase text-[10px] font-bold tracking-widest text-[#414754]">
                          মোবাইল নম্বর
                        </Label>
                        <Input
                          placeholder="+880"
                          className={`bg-[#e5e8ee] border-none rounded-xl h-12 focus:ring-2 focus:ring-[#005bbf] ${errors.phone ? "ring-2 ring-red-500" : ""}`}
                          {...register("phone", {
                            required: "মোবাইল নম্বর দেওয়া আবশ্যক",
                            pattern: {
                              value: /^[0-9+]+$/,
                              message: "সঠিক মোবাইল নম্বর দিন",
                            },
                          })}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <Label className="uppercase text-[10px] font-bold tracking-widest text-[#414754]">
                          ইমেইল
                        </Label>
                        <Input
                          type="email"
                          placeholder="name@business.com"
                          className={`bg-[#e5e8ee] border-none rounded-xl h-12 focus:ring-2 focus:ring-[#005bbf] ${errors.email ? "ring-2 ring-red-500" : ""}`}
                          {...register("email", {
                            required: "ইমেইল দেওয়া আবশ্যক",
                            pattern: {
                              value:
                                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                              message: "সঠিক ইমেইল ঠিকানা দিন",
                            },
                          })}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Single Pin Input */}
                    <div className="space-y-1.5">
                      <Label className="uppercase text-[10px] font-bold tracking-widest text-[#414754]">
                        সিকিউর পিন (৪ ডিজিট)
                      </Label>
                      <Input
                        type="password"
                        maxLength={4}
                        placeholder="••••"
                        className={`bg-[#e5e8ee] border-none rounded-xl h-12 text-center tracking-[0.5em] focus:ring-2 focus:ring-[#005bbf] ${errors.pin ? "ring-2 ring-red-500" : ""}`}
                        {...register("pin", {
                          required: "পিন দেওয়া আবশ্যক",
                          minLength: {
                            value: 4,
                            message: "অবশ্যই ৪ ডিজিটের হতে হবে",
                          },
                          maxLength: {
                            value: 4,
                            message: "অবশ্যই ৪ ডিজিটের হতে হবে",
                          },
                        })}
                      />
                      {errors.pin && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.pin.message}
                        </p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-14 mt-4 bg-gradient-to-br from-[#005bbf] to-[#1a73e8] hover:opacity-90 rounded-full font-bold text-white shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "নিবন্ধন হচ্ছে..." : "নিবন্ধন করুন"}
                    </Button>
                  </form>

                  {/* Divider */}
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-[#e5e8ee]"></div>
                    <span className="flex-shrink-0 px-4 text-[#414754] text-xs font-semibold uppercase tracking-widest bg-background">
                      অথবা এর মাধ্যমে চালিয়ে যান
                    </span>
                    <div className="flex-grow border-t border-[#e5e8ee]"></div>
                  </div>

                  {/* Google Login Button */}
                  {/* <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleLogin}
                    className="w-full h-14 bg-white border-2 border-[#e5e8ee] hover:bg-[#f8f9fa] hover:border-[#d1d5db] text-[#181c20] font-bold rounded-full shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 48 48"
                      className="w-5 h-5"
                    >
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                    গুগল (Google)
                  </Button> */}

                  {/* Login Link */}
                  <p className="text-center text-sm text-[#414754] pt-2">
                    আপনার কি আগে থেকেই অ্যাকাউন্ট আছে?{" "}
                    <Link
                      href="/login"
                      className="text-[#005bbf] font-semibold hover:underline underline-offset-4"
                    >
                      এখানে লগইন করুন
                    </Link>
                  </p>
                </div>
              </>
            ) : (
              /* ================== OTP VERIFICATION FORM ================== */
              <div className="animate-in fade-in zoom-in duration-500">
                <header className="mb-8">
                  <button
                    onClick={() => setIsOtpStep(false)}
                    className="flex items-center text-sm text-[#414754] hover:text-[#005bbf] mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    নিবন্ধনে ফিরে যান
                  </button>
                  <h1 className="text-3xl font-bold mb-2 tracking-tight">
                    আপনার ইমেইল যাচাই করুন
                  </h1>
                  <p className="text-[#414754] text-sm leading-relaxed">
                    আমরা একটি সিকিউর ওয়ান-টাইম পাসকোড (OTP) পাঠিয়েছি এই ইমেইলে:{" "}
                    <br />
                    <span className="font-semibold text-black">
                      {userCredentials.email}
                    </span>
                  </p>
                </header>

                <form
                  onSubmit={handleOtpSubmit(onOtpSubmit)}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] font-bold tracking-widest text-[#414754]">
                      ওটিপি (OTP) কোড দিন
                    </Label>
                    <Input
                      type="text"
                      maxLength={6}
                      placeholder="• • • • • •"
                      className={`bg-[#e5e8ee] border-none rounded-xl h-14 text-2xl text-center tracking-[1em] focus:ring-2 focus:ring-[#005bbf] ${otpErrors.otp ? "ring-2 ring-red-500" : ""}`}
                      {...registerOtp("otp", {
                        required: "ওটিপি দেওয়া আবশ্যক",
                        minLength: {
                          value: 6,
                          message: "ওটিপি ৬ ডিজিটের হতে হবে",
                        },
                        maxLength: {
                          value: 6,
                          message: "ওটিপি ৬ ডিজিটের হতে হবে",
                        },
                        pattern: {
                          value: /^[0-9]+$/,
                          message: "শুধুমাত্র সংখ্যা ব্যবহার করুন",
                        },
                      })}
                    />
                    {otpErrors.otp && (
                      <p className="text-red-500 text-xs mt-1 text-center">
                        {otpErrors.otp.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-14 bg-gradient-to-br from-[#005bbf] to-[#1a73e8] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-full shadow-lg"
                  >
                    {isLoading ? "যাচাই করা হচ্ছে..." : "অ্যাকাউন্ট যাচাই করুন"}
                  </Button>

                  <p className="text-center text-sm text-[#414754] pt-4">
                    কোড পাননি?{" "}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={timer > 0 || isResending}
                      className={`font-semibold transition-colors ${
                        timer > 0 || isResending
                          ? "text-gray-400 cursor-not-allowed"
                          : "text-[#005bbf] hover:underline underline-offset-4"
                      }`}
                    >
                      {isResending
                        ? "পাঠানো হচ্ছে..."
                        : timer > 0
                          ? `${timer} সেকেন্ড পর আবার পাঠান`
                          : "আবার কোড পাঠান"}
                    </button>
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Marketing Section */}
        <section className="hidden md:flex w-1/2 flex-col items-center justify-center p-8 lg:p-16">
          <div className="relative w-full max-w-md aspect-square mb-8 animate-fade-in-up">
            <img
              src="/images/form-image.png"
              alt="Business Management Illustration"
              className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700 ease-in-out"
            />
          </div>

          <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-slate-200 shadow-xl max-w-lg relative z-10 w-full">
            <h2 className="text-3xl font-extrabold mb-4 leading-tight text-[#005bbf]">
              আপনার ব্যবসাকে শক্তিশালী করুন
            </h2>
            <p className="text-sm text-[#414754] leading-relaxed mb-6">
              আপনার হিসাবের খাতা, ইনভেন্টরি এবং বেচাকেনা এক জায়গা থেকেই পরিচালনা
              করুন। ব্যবসার প্রসারে ডিজিটাল সমাধানের অভিজ্ঞতা নিন।
            </p>

            <div className="flex gap-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#e8f0fe] text-[#005bbf] rounded-full">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-[#181c20]">
                  ব্যাংকের মতো নিরাপত্তা
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#e8f0fe] text-[#005bbf] rounded-full">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-[#181c20]">
                  তাৎক্ষণিক তথ্য ও হিসাব
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer></Footer>
    </main>
  );
}
