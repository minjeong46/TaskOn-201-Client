"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/Input";
import Button from "@/components/Button";

interface SignupFormProps {
    isVisible: boolean;
}

export default function SignupForm({ isVisible }: SignupFormProps) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("http://52.79.145.137/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    passwordCheck,
                }),
            });

            const data = await res.json();
            console.log("회원가입 결과?" + data);

            if (res.status === 201) {
                console.log("회원가입 성공");
            }
            if (res.status === 400) {
                console.log("비밀번호 확인", data);
            } else {
                console.log("회원가입 실패");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleKakaoLogin = () => {
        console.log("Kakao Login");
    };

    const handleEmailCheck = async () => {

        try {
            const res = await fetch(
                `http://52.79.145.137/api/auth/check-email?email=${encodeURIComponent(
                    email
                )}`
            );
            const data = await res.json();
            if (!res.ok) {
                console.log("이미 사용중인 이메일");
            }
            if (data.data.valid) {
                console.log("확인됐습니다.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div
                className={`flex items-center justify-center lg:justify-end p-6 sm:p-8 lg:pr-12 xl:pr-16 bg-white transition-all duration-700 ease-in-out absolute right-0 w-full lg:w-1/2 h-full overflow-y-auto ${
                    !isVisible
                        ? "opacity-0 pointer-events-none z-0"
                        : "opacity-100 pointer-events-auto z-40"
                }`}
            >
                <div className="w-full max-w-md px-2 sm:px-4 lg:px-0 py-4 sm:py-8">
                    <div className="pt-12 sm:mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray5 mb-2">
                            회원가입
                        </h1>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-3 sm:space-y-4"
                    >
                        <div className="flex gap-2 items-center">
                            <div className="flex-1">
                                <Input
                                    label="이메일"
                                    type="text"
                                    placeholder="이메일을 입력하세요"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    fullWidth
                                    required
                                />
                            </div>
                            <div className="pt-6">
                                <Button
                                    type="button"
                                    label="중복 확인"
                                    variant="primary"
                                    size="sm"
                                    onClick={handleEmailCheck}
                                    className="whitespace-nowrap"
                                />
                            </div>
                        </div>
                        <Input
                            label="이름"
                            type="text"
                            placeholder="이름을 입력하세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />

                        <Input
                            label="비밀번호"
                            type="password"
                            placeholder="비밀번호를 입력하세요"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            fullWidth
                            required
                        />

                        <Input
                            label="비밀번호 확인"
                            type="password"
                            placeholder="비밀번호를 다시 입력하세요"
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                            fullWidth
                            required
                            error={
                                passwordCheck && password !== passwordCheck
                                    ? "비밀번호가 일치하지 않습니다"
                                    : undefined
                            }
                        />

                        <div className="flex items-start gap-2 pt-2">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreedToTerms}
                                onChange={(e) =>
                                    setAgreedToTerms(e.target.checked)
                                }
                                className="mt-1 w-4 h-4 text-main bg-gray-100 border-gray-300 rounded focus:ring-main focus:ring-2"
                                required
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm text-gray4"
                            >
                                By signing up, I agree with{" "}
                                <span className="text-main font-medium cursor-pointer hover:underline">
                                    Terms of Use
                                </span>{" "}
                                &{" "}
                                <span className="text-main font-medium cursor-pointer hover:underline">
                                    Privacy Policy
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            label="Sign up"
                            variant="primary"
                            size="md"
                            fullWidth
                            className="mt-6"
                            disabled={!agreedToTerms}
                        />
                    </form>

                    <div className="mt-4 sm:mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray2"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-gray4">
                                    OR
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={handleKakaoLogin}
                                className="mt-6 max-w-xs hover:opacity-90 transition-opacity cursor-pointer"
                            >
                                <Image
                                    src="/kakao_login_large_wide.png"
                                    alt="카카오 로그인"
                                    width={300}
                                    height={90}
                                    className="w-full h-auto"
                                    priority
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
