"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { signIn } from "@/lib/signIn";
import Swal from "sweetalert2";
import useAuth from "@/hook/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { fetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Login Form Submit Handler
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);

      const result = await signIn(data.email, data.pin);

      if (result.success) {
        await fetchUser(); // Update Auth Context with new user data
        await Swal.fire({
          icon: "success",
          title: "লগইন সফল 🎉",
          text: result.data?.message || "স্বাগতম!",
        });

        router.push("/dashboard");
      } else {
        await Swal.fire({
          icon: "error",
          title: "লগইন ব্যর্থ হয়েছে",
          text: result.message,
        });
      }
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "ত্রুটি",
        text: "কোথাও কোনো সমস্যা হয়েছে!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = () => {
    console.log("Initiating Google Login...");
    // Add NextAuth (signIn('google')) or Firebase Google auth here
  };

  return (
    <main className="bg-background">
      <div className="pt-20 flex flex-col md:flex-row min-h-screen max-w-screen-2xl mx-auto">
        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-24">
          <div className="w-full max-w-md">
            <header className="mb-10 animate-fade-in-up">
              <h1 className="text-3xl font-bold mb-2 tracking-tight">
                স্বাগতম
              </h1>
              <p className="text-[#414754] text-sm">
                আপনার ব্যবসার ড্যাশবোর্ডে প্রবেশ করতে আপনার তথ্য দিন।
              </p>
            </header>

            <div className="animate-fade-in-up space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div className="space-y-1.5">
                  <Label className="uppercase text-[10px] font-bold tracking-widest text-[#414754]">
                    ইমেইল ঠিকানা
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

                {/* Secure Pin Field */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <Label className="uppercase text-[10px] font-bold tracking-widest text-[#414754]">
                      সিকিউর পিন
                    </Label>
                    <Link
                      href="/forgot-pin"
                      className="text-[11px] font-semibold text-[#005bbf] hover:underline underline-offset-4"
                    >
                      পিন ভুলে গেছেন?
                    </Link>
                  </div>
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 mt-4 bg-gradient-to-br from-[#005bbf] to-[#1a73e8] hover:opacity-90 rounded-full font-bold text-white shadow-lg transition-transform active:scale-[0.98]"
                >
                  {isLoading ? "লগইন হচ্ছে..." : "লগইন করুন"}
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

              {/* Registration Link */}
              <p className="text-center text-sm text-[#414754] pt-2">
                অ্যাকাউন্ট নেই?{" "}
                <Link
                  href="/register"
                  className="text-[#005bbf] font-semibold hover:underline underline-offset-4"
                >
                  এখানে নিবন্ধন করুন
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Marketing Section with Cartoon/PNG */}
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
              পুনরায় স্বাগতম
            </h2>
            <p className="text-sm text-[#414754] leading-relaxed mb-6">
              যেখান থেকে শেষ করেছিলেন, সেখান থেকেই শুরু করুন। আপনার হিসাবের
              খাতা, ইনভেন্টরি এবং বেচাকেনা নিরাপদে পরিচালনা করুন।
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
    </main>
  );
}
