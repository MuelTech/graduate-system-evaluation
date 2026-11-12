"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { apiClientRequest } from "@/lib/api.client";
import { setActiveEvaluationRole } from "@/lib/evaluation-session";
import { PageGuideTrigger } from "@/components/evaluation/page-guide-overlay";
import {
  GraduationCap,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  Info,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

const stepTitles = [
  "Verify Your Applicant ID",
  "Personal Information",
  "Program Selection",
  "Create Your Password",
];

interface ProgramsResponse {
  graduatePrograms: { id: string; programName: string; programType: string }[];
  undergraduatePrograms: { id: string; programName: string }[];
}

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    applicantId: "APP-2026-0142",
    firstName: "Maria Lourdes",
    lastName: "Villanueva",
    email: "mlgvillanueva@gmail.com",
    cellphone: "0917-555-0142",
    dateOfBirth: "1996-08-14",
    programId: "prog-maed-as",
    programType: "Masters",
    undergraduateProgramId: "ugrad-bsed",
    password: "SamplePassword123!",
    confirmPassword: "SamplePassword123!",
  });

  const [isLoaded, setIsLoaded] = useState(false);

  const [graduateProgramsList, setGraduateProgramsList] = useState<
    { id: string; programName: string; programType: string }[]
  >([]);

  const [undergraduateProgramsList, setUndergraduateProgramsList] = useState<
    { id: string; programName: string }[]
  >([]);

  useEffect(() => {
    const draft = localStorage.getItem("registrationDraft");
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setTimeout(() => {
          if (parsed.step !== undefined) setStep(parsed.step);
          if (parsed.formData) {
            setFormData((prev) => ({
              ...prev,
              ...parsed.formData,
            }));
          }
          setIsLoaded(true);
        }, 0);
      } catch {
        setTimeout(() => setIsLoaded(true), 0);
      }
    } else {
      setTimeout(() => setIsLoaded(true), 0);
    }

    const fetchPrograms = async () => {
      try {
        const data = (await apiClientRequest("/programs")) as ProgramsResponse;
        if (data?.graduatePrograms) {
          setGraduateProgramsList(data.graduatePrograms);
        }
        if (data?.undergraduatePrograms) {
          setUndergraduateProgramsList(data.undergraduatePrograms);
        }
      } catch (err) {
        console.error("Failed to fetch programs", err);
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "registrationDraft",
        JSON.stringify({ step, formData }),
      );
    }
  }, [step, formData, isLoaded]);

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateStep = (currentStep: number) => {
    switch (currentStep) {
      case 0:
        if (!formData.applicantId.trim()) {
          setError("Applicant ID is required.");
          return false;
        }
        break;
      case 1:
        if (!formData.firstName.trim()) {
          setError("First Name is required.");
          return false;
        }
        if (!formData.lastName.trim()) {
          setError("Last Name is required.");
          return false;
        }
        if (!formData.email.trim()) {
          setError("Email Address is required.");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError("Please enter a valid email address.");
          return false;
        }
        if (!formData.cellphone.trim()) {
          setError("Cellphone Number is required.");
          return false;
        }
        if (!formData.dateOfBirth.trim()) {
          setError("Date of Birth is required.");
          return false;
        }
        break;
      case 2:
        if (!formData.programId) {
          setError("Intended Program is required.");
          return false;
        }
        if (!formData.undergraduateProgramId) {
          setError("Prerequisite Program is required.");
          return false;
        }
        break;
      case 3:
        if (!formData.password) {
          setError("Password is required.");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError("Passwords do not match.");
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateStep(3)) {
      return;
    }

    setIsSubmitting(true);

    try {
      await apiClientRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      localStorage.removeItem("registrationDraft");
      setIsSubmitted(true);
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col justify-between bg-[#FFF8F0] px-4 py-8 text-[#333333]">
        <div className="mx-auto flex w-full max-w-lg items-center justify-between">
          <Link
            href="/"
            className="text-sm font-medium text-gray-600 transition-colors hover:text-[#e02b20]"
          >
            ← Back to Home
          </Link>
          <PageGuideTrigger label="Page Guide" />
        </div>

        <div className="mx-auto my-6 w-full max-w-lg">
          <Card className="border-gray-200/80 bg-white shadow-xl">
            <CardContent className="pt-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <h2 className="mb-2 text-2xl font-bold text-[#333333]">
                Registration Complete
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Your applicant account has been created successfully.
              </p>

              <Alert className="mb-6 border-amber-200 bg-amber-50/70">
                <Info className="h-4 w-4 text-amber-600" />
                <AlertDescription>
                  <p className="mb-3 text-sm font-bold text-[#333333]">
                    What happens next:
                  </p>
                  <div className="space-y-3">
                    {[
                      "Schedule your entrance examination through your Applicant Portal.",
                      "Take the exam on your scheduled date.",
                      "If you pass, complete your enrollment to get your Certificate of Registration (COR).",
                      "Upload your COR in the Applicant Portal for verification.",
                      "Once verified, you will receive your Graduate Student credentials.",
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#e02b20] text-xs font-bold text-white">
                          {i + 1}
                        </div>
                        <p className="text-left text-sm text-gray-600">
                          {item}
                        </p>
                      </div>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>

              <div className="space-y-2.5">
                <Button
                  type="button"
                  onClick={() => {
                    setActiveEvaluationRole("applicant");
                    router.push("/applicant/dashboard");
                  }}
                  className="w-full bg-[#e02b20] font-semibold text-white hover:bg-[#c62828]"
                >
                  Continue to Applicant Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link
                  href="/login"
                  className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-[#333333] transition-colors hover:border-[#e02b20]/40 hover:bg-[#e02b20]/5 hover:text-[#e02b20]"
                >
                  Back to Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center text-xs text-gray-500">
          Eulogio &ldquo;Amang&rdquo; Rodriguez Institute of Science and Technology · Graduate School
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#FFF8F0] px-4 py-8 text-[#333333]">
      <div className="mx-auto flex w-full max-w-lg items-center justify-between">
        <Link
          href="/"
          className="text-sm font-medium text-gray-600 transition-colors hover:text-[#e02b20]"
        >
          ← Back to Home
        </Link>
        <PageGuideTrigger label="Page Guide" />
      </div>

      <div className="mx-auto my-6 w-full max-w-lg">
        <Card className="border-gray-200/80 bg-white shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e02b20]/10">
              <GraduationCap className="h-9 w-9 text-[#e02b20]" />
            </div>
            <CardTitle className="text-lg font-bold text-[#333333]">
              EARIST Graduate School
            </CardTitle>
            <CardDescription className="text-gray-500">
              Graduate School Admission Registration
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step Progress */}
            <div className="mb-8" data-guide="register-stepper">
              <div className="mb-3 flex items-center justify-between">
                {[0, 1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                        s === step
                          ? "bg-[#e02b20] text-white ring-4 ring-[#e02b20]/15"
                          : s < step
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s < step ? "✓" : s + 1}
                    </div>
                    {s < 3 && (
                      <div
                        className={`h-1 w-12 transition-colors sm:w-20 ${
                          s < step ? "bg-emerald-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-center text-sm font-bold text-[#333333]">
                {stepTitles[step]}
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} data-guide="register-form">
              {/* Step 0: Applicant ID */}
              {step === 0 && (
                <div className="space-y-5">
                  <Alert className="border-amber-200 bg-[#FFF8F0]">
                    <Info className="h-4 w-4 text-[#e02b20]" />
                    <AlertDescription className="text-xs text-gray-700">
                      You must have an <strong>Applicant ID</strong> to
                      register. For evaluation purposes, a sample Applicant ID (
                      <code>APP-2026-0142</code>) is pre-filled below.
                    </AlertDescription>
                  </Alert>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                      Applicant ID <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={formData.applicantId}
                      onChange={(e) =>
                        updateForm("applicantId", e.target.value)
                      }
                      placeholder="Enter your Applicant ID"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 1: Personal Info */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          updateForm("firstName", e.target.value)
                        }
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateForm("lastName", e.target.value)}
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      placeholder="your.email@gmail.com"
                      required
                    />
                    <p className="mt-1.5 text-xs text-gray-500">Gmail only</p>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                      Cellphone Number <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      value={formData.cellphone}
                      onChange={(e) => updateForm("cellphone", e.target.value)}
                      placeholder="09XX-XXX-XXXX"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        updateForm("dateOfBirth", e.target.value)
                      }
                      required
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Program Selection */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#333333]">
                      Program Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["Masters", "Doctoral"].map((type) => (
                        <Button
                          key={type}
                          type="button"
                          variant={
                            formData.programType === type
                              ? "default"
                              : "outline"
                          }
                          onClick={() => {
                            updateForm("programType", type);
                            updateForm("programId", "");
                            updateForm("undergraduateProgramId", "");
                          }}
                          className={
                            formData.programType === type
                              ? "bg-[#e02b20] text-white hover:bg-[#c62828]"
                              : "border-gray-200"
                          }
                        >
                          {type}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {(() => {
                    const mastersPrograms = graduateProgramsList.filter(
                      (p) => p.programType === "MASTERS",
                    );
                    const doctoralPrograms = graduateProgramsList.filter(
                      (p) => p.programType === "DOCTORAL",
                    );

                    const isDoctoral = formData.programType === "Doctoral";
                    const intendedProgramList = isDoctoral
                      ? doctoralPrograms
                      : mastersPrograms;
                    const prerequisiteProgramList = isDoctoral
                      ? mastersPrograms
                      : undergraduateProgramsList;

                    const intendedProgramLabel = isDoctoral
                      ? "Intended Doctorate Program"
                      : "Intended Masters Program";
                    const prerequisiteProgramLabel = isDoctoral
                      ? "Masters Program"
                      : "Undergraduate Program";
                    const prerequisitePlaceholder = isDoctoral
                      ? "Select your masters course (or closest equivalent)"
                      : "Select your undergraduate course";

                    return (
                      <>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                            {intendedProgramLabel}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.programId}
                            onChange={(e) =>
                              updateForm("programId", e.target.value)
                            }
                            required
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-[#e02b20] focus:ring-2 focus:ring-[#e02b20]/20 focus:outline-none"
                          >
                            <option value="">Select a program</option>
                            {intendedProgramList.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.programName}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                            {prerequisiteProgramLabel}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.undergraduateProgramId}
                            onChange={(e) =>
                              updateForm(
                                "undergraduateProgramId",
                                e.target.value,
                              )
                            }
                            required
                            className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-[#e02b20] focus:ring-2 focus:ring-[#e02b20]/20 focus:outline-none"
                          >
                            <option value="">{prerequisitePlaceholder}</option>
                            {prerequisiteProgramList.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.programName}
                              </option>
                            ))}
                          </select>
                          <p className="mt-1.5 text-xs text-gray-500">
                            Used for Program Alignment Check.{" "}
                            {isDoctoral &&
                              "If you graduated from another school, select the closest equivalent program."}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Step 3: Account Setup */}
              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => updateForm("password", e.target.value)}
                        placeholder="Create a password"
                        required
                        className="pr-10 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-[#e02b20]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#333333]">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          updateForm("confirmPassword", e.target.value)
                        }
                        placeholder="Confirm your password"
                        required
                        className="pr-10 [&::-ms-clear]:hidden [&::-ms-reveal]:hidden"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 transition-colors hover:text-[#e02b20]"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between">
                {step > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setStep(step - 1);
                      setError("");
                    }}
                    className="text-gray-600"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={() => {
                      if (validateStep(step)) {
                        setStep(step + 1);
                        setError("");
                      }
                    }}
                    className="bg-[#e02b20] text-white hover:bg-[#c62828]"
                  >
                    Continue
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#e02b20] font-semibold text-white hover:bg-[#c62828] disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
                  </Button>
                )}
              </div>
            </form>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">or</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <Link
              href="/login"
              className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-gray-200 bg-white py-2.5 text-sm font-semibold text-[#333333] transition-colors hover:border-[#e02b20]/40 hover:bg-[#e02b20]/5 hover:text-[#e02b20]"
            >
              Already registered? Sign in
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="text-center text-xs text-gray-500">
        Eulogio &ldquo;Amang&rdquo; Rodriguez Institute of Science and Technology · Graduate School
      </div>
    </div>
  );
}
