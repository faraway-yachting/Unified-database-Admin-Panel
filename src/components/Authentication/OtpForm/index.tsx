"use client";

import React, { ChangeEvent, useState, useEffect } from "react";
import Image from "next/image";
import Button from "@/common/Button";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useVerifyOtpMutation, useResendOtpMutation, getAuthErrorMessage } from "@/lib/api/auth";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface FormValues {
    otp: string[];
}

const OtpVerificationForm: React.FC = () => {

    const verifyOtpMutation = useVerifyOtpMutation();
    const resendOtpMutation = useResendOtpMutation();
    const [resendTimer, setResendTimer] = useState(0);
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            otp: ["", "", "", ""],
        },
        validate: (values) => {
            const errors: Partial<Record<keyof FormValues, string | undefined>> = {};
            if (values.otp.some((digit) => digit === "")) {
                errors.otp = "Please enter all OTP digits.";
            }
            return errors;
        },
        onSubmit: async (values, { resetForm, setSubmitting, setFieldError }) => {
            const otpString = values.otp.join("");
            const storedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
            if (!storedEmail) {
                setFieldError("otp", "Email not found. Please try again.");
                return;
            }

            try {
                const result = await verifyOtpMutation.mutateAsync({
                    email: storedEmail,
                    otp: otpString,
                });
                const message = (result as { message?: string })?.message;
                toast.success(message ?? "Verified", {
                    onClose: () => router.push("/resetPassword"),
                });
                resetForm();
            } catch (err) {
                const errorMessage = err != null ? getAuthErrorMessage(err) : "Invalid OTP.";
                toast.error(errorMessage);
                resetOtpInputs();
            } finally {
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

    const handleOtpChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        if (value.length <= 1 && /^[0-9]*$/.test(value)) {
            const newOtp = [...formik.values.otp];
            newOtp[index] = value;
            formik.setFieldValue("otp", newOtp);
            if (value && index < newOtp.length - 1) {
                (document.getElementById(`otp-input-${index + 1}`) as HTMLInputElement)?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && !formik.values.otp[index]) {
            if (index > 0) {
                (document.getElementById(`otp-input-${index - 1}`) as HTMLInputElement)?.focus();
            }
        }
    };

    const resetOtpInputs = () => {
        formik.setFieldValue("otp", ["", "", "", ""]);
        (document.getElementById("otp-input-0") as HTMLInputElement)?.focus();
    };


    const handleResendOtp = async () => {
        const storedEmail = typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
        if (!storedEmail) {
            toast.error("Email not found. Please go back and enter email again.");
            return;
        }
        try {
            setResendTimer(120);
            resetOtpInputs();
            formik.setErrors({});

            const result = await resendOtpMutation.mutateAsync({ email: storedEmail });
            const message = (result as { message?: string })?.message;
            toast.success(message ?? "OTP sent");
        } catch (err) {
            const errorMessage = err != null ? getAuthErrorMessage(err) : "Something went wrong";
            toast.error(errorMessage);
        }
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <form onSubmit={formik.handleSubmit}>
                <div className="px-6 sm:px-10 xl:px-12 space-y-5">
                    <div className="flex flex-col gap-4">
                        <Image 
                        src="/images/logo.png" 
                        alt="logo" 
                        width={552} 
                        height={210} 
                        className="w-[15rem] h-auto" 
                        priority
                    />
                        <h2 className="text-[#1E1E1E] text-[19px] font-bold font-plusjakarta">Anchor Your Dreams</h2>
                        <h2 className="text-[#012A50] text-[24px] font-bold font-plusjakarta">
                            OTP Verification
                        </h2>
                        <p className="text-[14px] font-normal text-[#888888] font-plusjakarta">
                            Enter the one-time password (OTP) sent to your email to complete your verification. This ensures a secure and seamless experience on our platform.
                        </p>
                    </div>
                    {formik.errors.otp && <p className="text-[#FF4234] text-center">{formik.errors.otp}</p>}
                    <label htmlFor="" className="text-[#012A50] font-plusjakarta font-bold text-[14px] mb-[15px] block">Enter OTP</label>
                    <div className="space-y-3 sm:px-6 xl:px-16">
                        <div className="flex justify-center gap-3 sm:gap-4">
                            {formik.values.otp.map((value, index) => (
                                <input
                                    key={index}
                                    id={`otp-input-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={value}
                                    onChange={(e) => handleOtpChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    onBlur={formik.handleBlur}
                                    className={`w-11 h-11 sm:w-[46px] sm:h-[46px] text-center text-3xl shadow-lg text-[#1E1E1E] font-medium border rounded-lg outline-none font-plusjakarta ${formik.errors.otp ? "border-[#FF4234]" : "border-[#E7E7E7]"
                                        }`}
                                    style={{ boxShadow: "0px 1px 2px 0px #1018280D" }}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>
                        <p className="text-center text-[14px] font-semibold text-[#B0B0B0] font-plusjakarta">
                            Didn&apos;t receive OTP?{" "}{" "}
                            <button type="button"
                                onClick={handleResendOtp}
                                className={`${resendTimer > 0 ? "cursor-not-allowed text-[#1E1E1E]" : "underline cursor-pointer text-[#009AFF]"}`}
                                disabled={resendTimer > 0}
                            >
                                {resendTimer > 0 ? `Resend OTP in ${resendTimer}s` : "Resend OTP"}
                            </button>{" "}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            className={`w-full ${formik.isSubmitting ? "bg-[#C3974C]" : "bg-[#001B48]"}`}
                            disabled={formik.isSubmitting}
                        >
                            {formik.isSubmitting ? "Sending..." : "Next"}
                        </Button>
                        <p className="text-[14px] font-medium text-[#B0B0B0]">
                            If you don&apos;t receive the email within a minute, please check your
                            spam folder or try again.
                        </p>
                    </div>
                </div>
            </form>
        </>
    );
};

export default OtpVerificationForm;