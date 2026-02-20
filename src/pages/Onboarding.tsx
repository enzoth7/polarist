import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { supabase } from "@/lib/supabase";

type QuestionType = "single" | "text";

interface QuestionCondition {
  questionId: number;
  values: string[];
}

interface QuestionOption {
  label: string;
  value: string;
  description?: string;
  icon: string;
}

interface Question {
  id: number;
  category: string;
  type: QuestionType;
  text: string;
  description?: string;
  options?: QuestionOption[];
  placeholder?: string;
  optional?: boolean;
  showIf?: QuestionCondition;
}

const QUESTION_IDS = {
  BRAND_CATEGORY: 1,
  BRAND_HISTORY: 2,
  DIFFERENTIAL: 4,
  CLIENT_IDEAL: 5,
  CLIENT_IDEAL_EXTRA: 6,
  PROMOTIONS: 7,
  PROMOTIONS_EXTRA: 8,
  PRODUCTS: 9,
  OPERATION: 10,
  SHIPPING: 11,
  CONTENT_TYPE: 12,
  RESOURCES: 13,
  CAMERA: 14,
  SALES_CHANNELS: 15,
  PRIORITY_CHANNEL: 16,
  TYPOGRAPHY: 17,
  SOCIAL_PRIORITY: 18,
  HUMANIZATION: 19,
  PRODUCT_LOOK: 20,
  FREQUENCY: 21,
  BRAND_FEELING: 22,
  COLOR_PALETTE_DEFINED: 23,
  BRAND_COLORS: 24,
  BRAND_PERCEPTION: 25,
} as const;

const PROCESSING_MESSAGE_MS = 1700;
const PROCESSING_FADE_MS = 320;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const Onboarding = () => {
  const { updateProfile } = useBusinessProfile();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();

  const localizedQuestions = t("onboarding.questions", { returnObjects: true }) as unknown;
  const questions = Array.isArray(localizedQuestions) ? (localizedQuestions as Question[]) : [];
  const localizedProcessingMessages = t("onboarding.processing.messages", { returnObjects: true }) as unknown;
  const processingMessages = Array.isArray(localizedProcessingMessages) ? (localizedProcessingMessages as string[]) : [];

  const [hasStarted, setHasStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingMessageIndex, setProcessingMessageIndex] = useState(0);
  const [processingMessageVisible, setProcessingMessageVisible] = useState(true);
  const processingRunIdRef = useRef(0);

  useEffect(
    () => () => {
      processingRunIdRef.current += 1;
    },
    [],
  );

  const visibleQuestions = useMemo(
    () =>
      questions.filter((question) => {
        if (!question.showIf) return true;
        const parentAnswer = answers[question.showIf.questionId];
        return question.showIf.values.includes(parentAnswer);
      }),
    [answers, questions],
  );

  useEffect(() => {
    if (step >= visibleQuestions.length) {
      setStep(Math.max(visibleQuestions.length - 1, 0));
    }
  }, [step, visibleQuestions.length]);

  const currentQuestion = visibleQuestions[step];
  const currentQuestionText = currentQuestion?.text ?? "";
  const progress = visibleQuestions.length === 0 ? 0 : ((step + 1) / visibleQuestions.length) * 100;

  const canContinue = () => {
    if (!currentQuestion) return false;
    if (currentQuestion.type === "text") {
      if (currentQuestion.optional) return true;
      return Boolean(answers[currentQuestion.id]?.trim());
    }
    return Boolean(answers[currentQuestion.id]);
  };

  const handleSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleTextChange = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handleNext = async () => {
    if (!currentQuestion || isSubmitting) return;
    if (step < visibleQuestions.length - 1) {
      setStep((prev) => prev + 1);
      return;
    }
    await handleSubmit();
  };

  const handleBack = () => {
    if (step > 0 && !isSubmitting) setStep((prev) => prev - 1);
  };

  const getQuestionById = (id: number) => questions.find((question) => question.id === id);

  const getAnswerLabel = (question?: Question) => {
    if (!question) return "";
    const value = answers[question.id];
    if (!value) return "";

    if (question.type === "text") return value;

    const option = question.options?.find((item) => item.value === value);
    return option?.label ?? value;
  };

  const playProcessingSequence = async (runId: number) => {
    setProcessingMessageIndex(0);
    setProcessingMessageVisible(true);

    for (let index = 0; index < processingMessages.length; index += 1) {
      if (processingRunIdRef.current !== runId) return;

      setProcessingMessageIndex(index);
      setProcessingMessageVisible(true);
      await wait(PROCESSING_MESSAGE_MS - PROCESSING_FADE_MS);

      if (index < processingMessages.length - 1) {
        if (processingRunIdRef.current !== runId) return;
        setProcessingMessageVisible(false);
        await wait(PROCESSING_FADE_MS);
      }
    }
  };

  const handleSubmit = async () => {
    const runId = processingRunIdRef.current + 1;
    processingRunIdRef.current = runId;

    setIsSubmitting(true);
    const processingSequence = playProcessingSequence(runId);

    const profileData = {
      business_category: getAnswerLabel(getQuestionById(QUESTION_IDS.BRAND_CATEGORY)),
      brand_history: getAnswerLabel(getQuestionById(QUESTION_IDS.BRAND_HISTORY)),
      brand_differential: getAnswerLabel(getQuestionById(QUESTION_IDS.DIFFERENTIAL)),
      target_audience: getAnswerLabel(getQuestionById(QUESTION_IDS.CLIENT_IDEAL)),
      target_audience_extra: getAnswerLabel(getQuestionById(QUESTION_IDS.CLIENT_IDEAL_EXTRA)),
      promotions: getAnswerLabel(getQuestionById(QUESTION_IDS.PROMOTIONS)),
      promotions_extra: getAnswerLabel(getQuestionById(QUESTION_IDS.PROMOTIONS_EXTRA)),
      products_to_highlight: getAnswerLabel(getQuestionById(QUESTION_IDS.PRODUCTS)),
      operation_type: getAnswerLabel(getQuestionById(QUESTION_IDS.OPERATION)),
      shipping_scope: getAnswerLabel(getQuestionById(QUESTION_IDS.SHIPPING)),
      content_type_preferred: getAnswerLabel(getQuestionById(QUESTION_IDS.CONTENT_TYPE)),
      content_resources: getAnswerLabel(getQuestionById(QUESTION_IDS.RESOURCES)),
      camera_quality: getAnswerLabel(getQuestionById(QUESTION_IDS.CAMERA)),
      sales_channels: getAnswerLabel(getQuestionById(QUESTION_IDS.SALES_CHANNELS)),
      priority_sales_channel: getAnswerLabel(getQuestionById(QUESTION_IDS.PRIORITY_CHANNEL)),
      typography_status: getAnswerLabel(getQuestionById(QUESTION_IDS.TYPOGRAPHY)),
      social_priority_goal: getAnswerLabel(getQuestionById(QUESTION_IDS.SOCIAL_PRIORITY)),
      humanization_level: getAnswerLabel(getQuestionById(QUESTION_IDS.HUMANIZATION)),
      product_visual_style: getAnswerLabel(getQuestionById(QUESTION_IDS.PRODUCT_LOOK)),
      posting_frequency: getAnswerLabel(getQuestionById(QUESTION_IDS.FREQUENCY)),
      brand_feeling: getAnswerLabel(getQuestionById(QUESTION_IDS.BRAND_FEELING)),
      color_palette_status: getAnswerLabel(getQuestionById(QUESTION_IDS.COLOR_PALETTE_DEFINED)),
      brand_colors_extra: getAnswerLabel(getQuestionById(QUESTION_IDS.BRAND_COLORS)),
      brand_perception: getAnswerLabel(getQuestionById(QUESTION_IDS.BRAND_PERCEPTION)),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    };

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { error } = await supabase.from("profiles").update(profileData).eq("id", user.id);
      if (error) throw error;

      await processingSequence;
      if (processingRunIdRef.current !== runId) return;

      updateProfile({
        businessCategory: profileData.business_category,
        brandHistory: profileData.brand_history,
        brandDifferential: profileData.brand_differential,
        targetAudience: profileData.target_audience,
        targetAudienceExtra: profileData.target_audience_extra,
        promotions: profileData.promotions,
        promotionsExtra: profileData.promotions_extra,
        productsToHighlight: profileData.products_to_highlight,
        operationType: profileData.operation_type,
        shippingScope: profileData.shipping_scope,
        contentTypePreferred: profileData.content_type_preferred,
        contentResources: profileData.content_resources,
        cameraQuality: profileData.camera_quality,
        salesChannels: profileData.sales_channels,
        prioritySalesChannel: profileData.priority_sales_channel,
        typographyStatus: profileData.typography_status,
        socialPriorityGoal: profileData.social_priority_goal,
        humanizationLevel: profileData.humanization_level,
        productVisualStyle: profileData.product_visual_style,
        postingFrequency: profileData.posting_frequency,
        brandFeeling: profileData.brand_feeling,
        colorPaletteStatus: profileData.color_palette_status,
        brandColorsExtra: profileData.brand_colors_extra,
        brandPerception: profileData.brand_perception,
        onboardingComplete: true,
      });

      toast({
        title: t("onboarding.toasts.profileCreatedTitle"),
        description: t("onboarding.toasts.profileCreatedDescription"),
      });

      navigate("/dashboard");
    } catch (error) {
      processingRunIdRef.current += 1;
      console.error("Error saving profile:", error);
      toast({
        title: t("common.error"),
        description: t("onboarding.toasts.saveErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      if (processingRunIdRef.current !== runId) {
        setProcessingMessageIndex(0);
        setProcessingMessageVisible(true);
      }
    }
  };

  if (!hasStarted) {
    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#FAFAFA] px-4">
        <div className="flex w-full max-w-[400px] flex-col items-center justify-center rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/14 via-primary/8 to-white p-7 text-center shadow-soft">
          <h1 className="font-heading text-5xl leading-tight tracking-[0.02em] text-foreground md:text-5xl">
            {t("onboarding.intro.title")}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{t("onboarding.intro.line1")}</p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{t("onboarding.intro.line2")}</p>
          <Button
            size="lg"
            className="mt-7 bg-[#D0F000] px-8 text-accent-foreground hover:bg-[#D0F000]/90"
            onClick={() => setHasStarted(true)}
          >
            {t("onboarding.intro.cta")}
          </Button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const questionTitleClass =
    currentQuestionText.length <= 48
      ? "text-4xl md:text-5xl"
      : currentQuestionText.length <= 88
        ? "text-3xl md:text-4xl"
        : "text-2xl md:text-3xl";

  if (isSubmitting) {
    const processingProgress = processingMessages.length > 0 ? ((processingMessageIndex + 1) / processingMessages.length) * 100 : 0;

    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#FAFAFA] px-6">
        <div className="w-full max-w-xl text-center">
          <p className="font-heading text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60">{t("onboarding.processing.title")}</p>

          <div className="mx-auto mt-5 h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]/10">
            <div
              className="h-full rounded-full bg-[#D0F000] transition-all duration-500 ease-out"
              style={{ width: `${processingProgress}%` }}
            />
          </div>

          <div className="mx-auto mt-6 h-11 w-11 animate-spin rounded-full border-2 border-[#1A1A1A]/10 border-t-[#D0F000]" />

          <p
            className={`mt-7 font-heading text-2xl leading-tight tracking-[0.01em] text-[#1A1A1A] transition-opacity duration-300 md:text-3xl ${
              processingMessageVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {processingMessages[processingMessageIndex] ?? ""}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] w-full flex-col bg-[#FAFAFA]">
      <div className="h-2.5 w-full bg-primary/10">
        <div
          className="h-full bg-[#D0F000] shadow-[0_0_20px_rgba(208,240,0,0.45)] transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex min-h-0 w-full flex-1 flex-col justify-between px-4 pt-3 md:px-6 md:pt-5">
        <header className="shrink-0 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/14 via-primary/7 to-white px-3 py-3 shadow-soft md:px-6 md:py-4">
          <div className="flex items-center justify-between gap-2 text-[10px] text-muted-foreground md:text-sm">
            <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">
              {t("onboarding.questionProgress", {
                current: Math.min(step + 1, visibleQuestions.length),
                total: visibleQuestions.length,
              })}
            </span>
            <span className="rounded-full border border-primary/18 bg-white/85 px-2 py-1">{currentQuestion.category}</span>
          </div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col justify-center py-4 md:py-6">
          <div className="mb-6 md:mb-7">
            <h1 className={`font-heading leading-tight tracking-[0.012em] text-foreground ${questionTitleClass}`}>{currentQuestionText}</h1>
            {currentQuestion.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-3 md:text-base">{currentQuestion.description}</p>
            ) : null}
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto pb-2">
            {currentQuestion.type === "single" ? (
              <div className="flex w-full flex-col gap-4 md:gap-5">
                {currentQuestion.options?.map((option, optionIndex) => {
                  const isSelected = answers[currentQuestion.id] === option.value;

                  return (
                    <button
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={`group w-full animate-fade-in rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 md:px-5 md:py-3.5 ${
                        isSelected ? "border-[#D0F000] bg-[#D0F000]/12 shadow-soft" : "border-primary/25 bg-white/75 hover:border-[#D0F000]"
                      }`}
                      style={{ animationDelay: `${optionIndex * 70}ms`, animationFillMode: "both" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm md:h-8 md:w-8 ${
                              isSelected ? "border-[#D0F000]/80 bg-[#D0F000]/20" : "border-primary/20 bg-white"
                            }`}
                            aria-hidden
                          >
                            {option.icon}
                          </span>
                          <div>
                            <h3 className={`text-[15px] font-medium leading-snug md:text-base ${isSelected ? "text-primary" : "text-foreground"}`}>
                              {option.label}
                            </h3>
                            {option.description ? (
                              <p className="mt-1 text-xs leading-relaxed text-muted-foreground md:text-sm">{option.description}</p>
                            ) : null}
                          </div>
                        </div>
                        {isSelected ? (
                          <span className="animate-in zoom-in rounded-full bg-[#D0F000] p-1 text-accent-foreground" aria-hidden>
                            <Check className="h-3.5 w-3.5" />
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-primary/25 bg-white/80 p-3 md:p-4">
                <textarea
                  value={answers[currentQuestion.id] || ""}
                  onChange={(event) => handleTextChange(event.target.value)}
                  placeholder={currentQuestion.placeholder || t("onboarding.answerPlaceholder")}
                  className="h-32 w-full resize-none rounded-lg border border-primary/15 bg-background/70 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#D0F000] md:h-40 md:text-base"
                />
                {currentQuestion.optional ? <p className="mt-2 text-xs text-muted-foreground">{t("onboarding.optional")}</p> : null}
              </div>
            )}
          </div>
        </main>

        <footer className="sticky bottom-0 z-20 mt-auto shrink-0 border-t border-primary/12 bg-[#FAFAFA]/95 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] pt-3 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0 || isSubmitting}
              className={step === 0 ? "invisible" : "h-10 px-3"}
            >
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              {t("common.previous")}
            </Button>

            <Button
              type="button"
              size="lg"
              onClick={handleNext}
              disabled={!canContinue() || isSubmitting}
              className="h-11 bg-primary px-6 text-primary-foreground hover:bg-primary/92"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("common.saving")}
                </>
              ) : step === visibleQuestions.length - 1 ? (
                <>
                  {t("onboarding.finish")}
                  <Sparkles className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  {t("common.next")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;
