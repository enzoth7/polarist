import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Loader2, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  section?: number;
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
  PRODUCT_LOOK: 20,
  FREQUENCY: 21,
  COLOR_PALETTE_DEFINED: 23,
  BRAND_COLORS: 24,
  BRAND_PERCEPTION: 25,
} as const;

const PROCESSING_MESSAGE_MS = 1700;
const PROCESSING_FADE_MS = 320;
const SECTION_TRANSITION_MS = 1800;
const COMPLETION_SCREEN_MS = 2000;

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
  const localizedSectionTransitions = t("onboarding.sectionTransition.messages", { returnObjects: true }) as unknown;
  const sectionTransitionMessages = Array.isArray(localizedSectionTransitions) ? (localizedSectionTransitions as string[]) : [];
  const localizedSections = t("onboarding.sections", { returnObjects: true }) as unknown;
  const sections =
    localizedSections && typeof localizedSections === "object" ? (localizedSections as Record<string, { name: string }>) : {};

  const [hasStarted, setHasStarted] = useState(false);
  const [brandNameStepComplete, setBrandNameStepComplete] = useState(false);
  const [brandNameInput, setBrandNameInput] = useState("");
  const [contactStepComplete, setContactStepComplete] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    instagram: "",
    website: "",
    whatsapp: "",
  });
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSectionTransitioning, setIsSectionTransitioning] = useState(false);
  const [sectionTransitionIndex, setSectionTransitionIndex] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [processingMessageIndex, setProcessingMessageIndex] = useState(0);
  const [processingMessageVisible, setProcessingMessageVisible] = useState(true);
  const processingRunIdRef = useRef(0);
  const sectionTransitionRunIdRef = useRef(0);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      processingRunIdRef.current += 1;
    },
    [],
  );

  useEffect(
    () => () => {
      if (autoAdvanceTimeoutRef.current !== null) {
        window.clearTimeout(autoAdvanceTimeoutRef.current);
        autoAdvanceTimeoutRef.current = null;
      }
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
  const contactHasValue = Boolean(contactInfo.instagram.trim() || contactInfo.website.trim() || contactInfo.whatsapp.trim());
  const totalSections = Math.max(Object.keys(sections).length, 3);
  const currentSection = currentQuestion?.section ?? 1;
  const isLastQuestion = step >= visibleQuestions.length - 1;

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
    if (autoAdvanceTimeoutRef.current !== null) {
      window.clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    const nextAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(nextAnswers);
    const nextVisibleQuestions = questions.filter((question) => {
      if (!question.showIf) return true;
      const parentAnswer = nextAnswers[question.showIf.questionId];
      return question.showIf.values.includes(parentAnswer);
    });
    const nextIsLast = step >= Math.max(nextVisibleQuestions.length - 1, 0);
    if (currentQuestion.type === "single" && !nextIsLast && !isSubmitting) {
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        autoAdvanceTimeoutRef.current = null;
        void handleNext();
      }, 500);
    }
  };

  const handleTextChange = (value: string) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const playSectionTransition = async (nextStep: number, nextSection: number) => {
    const runId = sectionTransitionRunIdRef.current + 1;
    sectionTransitionRunIdRef.current = runId;
    setSectionTransitionIndex(Math.max(nextSection - 1, 0));
    setIsSectionTransitioning(true);
    await wait(SECTION_TRANSITION_MS);
    if (sectionTransitionRunIdRef.current !== runId) return;
    setIsSectionTransitioning(false);
    setStep(nextStep);
  };

  const handleNext = async () => {
    if (!currentQuestion || isSubmitting || isSectionTransitioning) return;
    if (autoAdvanceTimeoutRef.current !== null) {
      window.clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (step < visibleQuestions.length - 1) {
      const nextQuestion = visibleQuestions[step + 1];
      const nextSection = nextQuestion?.section ?? currentSection;
      if (nextSection !== currentSection) {
        await playSectionTransition(step + 1, nextSection);
        return;
      }
      setStep((prev) => prev + 1);
      return;
    }
    await handleSubmit();
  };

  const handleBack = () => {
    if (autoAdvanceTimeoutRef.current !== null) {
      window.clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
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
    setShowCompletion(false);
    const processingSequence = playProcessingSequence(runId);

  const profileData = {
      business_name: brandNameInput.trim(),
      contact_instagram: contactInfo.instagram.trim() || null,
      contact_website: contactInfo.website.trim() || null,
      contact_whatsapp: contactInfo.whatsapp.trim() || null,
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
      product_visual_style: getAnswerLabel(getQuestionById(QUESTION_IDS.PRODUCT_LOOK)),
      posting_frequency: getAnswerLabel(getQuestionById(QUESTION_IDS.FREQUENCY)),
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
        businessName: brandNameInput.trim(),
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
        productVisualStyle: profileData.product_visual_style,
        postingFrequency: profileData.posting_frequency,
        colorPaletteStatus: profileData.color_palette_status,
        brandColorsExtra: profileData.brand_colors_extra,
        brandPerception: profileData.brand_perception,
        onboardingComplete: true,
      });

      toast({
        title: t("onboarding.toasts.profileCreatedTitle"),
        description: t("onboarding.toasts.profileCreatedDescription"),
      });

      setShowCompletion(true);
      await wait(COMPLETION_SCREEN_MS);
      if (processingRunIdRef.current !== runId) return;
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

  if (showCompletion) {
    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#FAFAFA] px-6 dark:bg-background">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-500 md:h-32 md:w-32"
          >
            <motion.svg width="60" height="60" viewBox="0 0 52 52" fill="none">
              <motion.path
                d="M14 27 L23 36 L38 19"
                stroke="white"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
              />
            </motion.svg>
          </motion.div>
          <p className="mt-5 text-lg font-medium text-[#1A1A1A] dark:text-white md:text-xl">{t("onboarding.processing.complete")}</p>
        </motion.div>
      </div>
    );
  }

  if (isSubmitting) {
    const processingProgress = processingMessages.length > 0 ? ((processingMessageIndex + 1) / processingMessages.length) * 100 : 0;

    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#FAFAFA] px-6 dark:bg-background">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-xl text-center"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-[#1A1A1A]/60 dark:text-white/60">{t("onboarding.processing.title")}</p>

          <div className="mx-auto mt-5 h-2 w-full overflow-hidden rounded-full bg-[#1A1A1A]/10">
            <div
              className="h-full rounded-full bg-[#D0F000] transition-all duration-500 ease-out"
              style={{ width: `${processingProgress}%` }}
            />
          </div>

          <motion.div
            className="mx-auto mt-6 h-11 w-11 rounded-full border-2 border-[#1A1A1A]/10 border-t-[#D0F000]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
          />

          <motion.p
            className="mt-7 text-2xl leading-tight tracking-[0.01em] text-[#1A1A1A] dark:text-white md:text-3xl"
            animate={{ opacity: processingMessageVisible ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {processingMessages[processingMessageIndex] ?? ""}
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (isSectionTransitioning) {
    const transitionMessage =
      sectionTransitionMessages[sectionTransitionIndex] ?? sections[String(sectionTransitionIndex + 1)]?.name ?? "";

    return (
      <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-[#FAFAFA] px-6 dark:bg-background">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="text-center">
          <motion.div
            className="mx-auto h-12 w-12 rounded-full border-2 border-[#1A1A1A]/10 border-t-[#D0F000]"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          />
          <p className="mt-6 text-lg text-foreground md:text-xl">{transitionMessage}</p>
        </motion.div>
      </div>
    );
  }

  if (!currentQuestion && hasStarted && contactStepComplete) return null;

  const questionTitleClass =
    currentQuestionText.length <= 48
      ? "text-2xl md:text-3xl"
      : currentQuestionText.length <= 88
        ? "text-xl md:text-2xl"
        : "text-lg md:text-xl";

  const stage = !hasStarted ? "intro" : !brandNameStepComplete ? "brandName" : !contactStepComplete ? "contact" : "questions";

  return (
    <div className="min-h-[100dvh] w-full bg-[#FAFAFA] dark:bg-background">
      <AnimatePresence mode="wait">
        {stage === "intro" ? (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4"
          >
            <div className="flex w-full max-w-[440px] flex-col items-center justify-center rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/14 via-primary/8 to-white p-7 text-center shadow-soft dark:to-white/5 sm:max-w-[560px] md:max-w-[760px] md:p-10">
              <h1 className="whitespace-nowrap font-heading text-[clamp(1.9rem,7.2vw,3rem)] leading-tight tracking-[0.01em] text-foreground md:tracking-[0.02em]">
                {t("onboarding.intro.title")}
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">{t("onboarding.intro.line2")}</p>
              <Button
                size="lg"
                className="mt-7 bg-[#D0F000] px-8 text-accent-foreground hover:bg-[#D0F000]/90"
                onClick={() => setHasStarted(true)}
              >
                {t("onboarding.intro.cta")}
              </Button>
            </div>
          </motion.div>
        ) : stage === "brandName" ? (
          <motion.div
            key="brandName"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="animate-fade-in min-h-[100dvh] w-full bg-background"
          >
            <div className="flex min-h-[100dvh] flex-col items-center justify-center px-6">
              <div className="w-full max-w-md space-y-6">
                <div className="flex items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setHasStarted(false)}
                    aria-label={t("common.back")}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-heading font-bold text-foreground">{t("onboarding.brandName.title")}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{t("onboarding.brandName.description")}</p>
                </div>
                <Input
                  value={brandNameInput}
                  onChange={(event) => setBrandNameInput(event.target.value)}
                  placeholder={t("onboarding.brandName.placeholder")}
                  className="bg-card text-center text-lg"
                  autoFocus
                />
                <Button
                  className="w-full"
                  onClick={() => setBrandNameStepComplete(true)}
                  disabled={!brandNameInput.trim()}
                >
                  {t("common.continue")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : stage === "contact" ? (
          <motion.div
            key="contact"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex min-h-[100dvh] w-full flex-col items-center justify-center px-4"
          >
            <div className="flex w-full max-w-[520px] flex-col rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/14 via-primary/8 to-white p-7 text-left shadow-soft dark:to-white/5 md:p-9">
              <p className="text-xs uppercase tracking-[0.25em] text-[#1A1A1A]/60">{t("onboarding.contact.kicker")}</p>
              <h1 className="mt-3 text-3xl leading-tight tracking-[0.01em] text-foreground md:text-4xl">
                {t("onboarding.contact.title")}
              </h1>
              <p className="mt-3 text-lg font-medium leading-relaxed text-primary md:text-xl">
                {t("onboarding.contact.description")}
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <label className="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/55">
                  <span>{t("onboarding.contact.instagramLabel")}</span>
                  <input
                    value={contactInfo.instagram}
                    onChange={(event) => setContactInfo((prev) => ({ ...prev, instagram: event.target.value }))}
                    placeholder={t("onboarding.contact.instagramPlaceholder")}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="h-11 w-full rounded-lg border border-primary/15 bg-background/70 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#D0F000] md:text-base"
                  />
                </label>

                <label className="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/55">
                  <span>{t("onboarding.contact.websiteLabel")}</span>
                  <input
                    type="url"
                    inputMode="url"
                    value={contactInfo.website}
                    onChange={(event) => setContactInfo((prev) => ({ ...prev, website: event.target.value }))}
                    placeholder={t("onboarding.contact.websitePlaceholder")}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className="h-11 w-full rounded-lg border border-primary/15 bg-background/70 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#D0F000] md:text-base"
                  />
                </label>

                <label className="flex flex-col gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A]/55">
                  <span>{t("onboarding.contact.whatsappLabel")}</span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={contactInfo.whatsapp}
                    onChange={(event) => setContactInfo((prev) => ({ ...prev, whatsapp: event.target.value }))}
                    placeholder={t("onboarding.contact.whatsappPlaceholder")}
                    className="h-11 w-full rounded-lg border border-primary/15 bg-background/70 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#D0F000] md:text-base"
                  />
                </label>
              </div>

              <div className="mt-6 flex items-center justify-between gap-2">
                <Button type="button" variant="ghost" onClick={() => setBrandNameStepComplete(false)} className="h-10 px-3">
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  {t("common.previous")}
                </Button>
                <Button
                  type="button"
                  size="lg"
                  onClick={() => {
                    setContactStepComplete(true);
                    void playSectionTransition(0, 1);
                  }}
                  disabled={!contactHasValue}
                  className="h-11 bg-primary px-6 text-primary-foreground hover:bg-primary/92"
                >
                  {t("onboarding.contact.cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ) : currentQuestion ? (
          <motion.div
            key="questions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex min-h-[100dvh] w-full flex-col bg-[#FAFAFA] font-body dark:bg-background"
          >
            <div className="flex items-center gap-2 px-4 pt-8 md:px-6 md:pt-5">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="cursor-pointer p-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              ) : null}
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-primary/10">
                <div
                  className="h-full bg-[#D0F000] shadow-[0_0_20px_rgba(208,240,0,0.45)] transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="px-4 pt-2 text-xs text-[#1A1A1A]/60 dark:text-white/60 md:px-6">
              {t("onboarding.sectionProgress", { current: currentSection, total: totalSections })}
            </div>

            <div className="flex min-h-0 w-full flex-1 flex-col justify-between px-4 pt-3 md:px-6 md:pt-5">
              <header className="shrink-0 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/14 via-primary/7 to-white px-3 py-3 shadow-soft dark:to-white/5 md:px-6 md:py-4">
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

              <main className="flex min-h-0 flex-1 flex-col py-4 md:py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="flex min-h-0 flex-1 flex-col"
                  >
                    <div className="flex min-h-0 flex-1 flex-col">
                      <div className="shrink-0 pt-20 md:pt-9">
                        <div className="mx-auto max-w-[560px] text-center">
                          <h1 className={`leading-tight tracking-[0.012em] text-[#1A1A1A] dark:text-white ${questionTitleClass}`}>{currentQuestionText}</h1>
                          {currentQuestion.description ? (
                            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-3 md:text-base">
                              {currentQuestion.description}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-auto shrink-0 w-full pb-10">
                        <div className="w-full max-h-[50vh] overflow-y-auto">
                          {currentQuestion.type === "single" ? (
                            <div className="flex w-full flex-col gap-4 md:gap-5">
                              {currentQuestion.options?.map((option, optionIndex) => {
                                const isSelected = answers[currentQuestion.id] === option.value;

                                return (
                                  <motion.button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    animate={{ scale: isSelected ? 1.02 : 1 }}
                                    transition={{ duration: 0.12 }}
                                    className={`group w-full animate-fade-in rounded-xl border-2 px-4 py-3 text-left transition-all duration-200 md:px-5 md:py-3.5 ${isSelected
                                        ? "border-[#D0F000] bg-[#D0F000]/12 shadow-soft"
                                        : "border-primary/25 bg-white/75 hover:border-[#D0F000] dark:bg-white/10"
                                      }`}
                                    style={{ animationDelay: `${optionIndex * 70}ms`, animationFillMode: "both" }}
                                  >
                                    <div className="flex items-center justify-between gap-3">
                                      <div className="flex items-center gap-3">
                                        <span
                                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-sm md:h-8 md:w-8 ${isSelected ? "border-[#D0F000]/80 bg-[#D0F000]/20" : "border-primary/20 bg-white dark:bg-white/10"
                                            }`}
                                          aria-hidden
                                        >
                                          {option.icon}
                                        </span>
                                        <div>
                                          <h3
                                            className={`text-[15px] font-medium leading-snug md:text-base ${isSelected ? "text-primary" : "text-[#1A1A1A] dark:text-white"
                                              }`}
                                          >
                                            {option.label}
                                          </h3>
                                          {option.description ? (
                                            <p className="mt-1 text-xs leading-relaxed text-[#1A1A1A]/70 dark:text-white/70 md:text-sm">{option.description}</p>
                                          ) : null}
                                        </div>
                                      </div>
                                      {isSelected ? (
                                        <span className="animate-in zoom-in rounded-full bg-[#D0F000] p-1 text-accent-foreground" aria-hidden>
                                          <Check className="h-3.5 w-3.5" />
                                        </span>
                                      ) : null}
                                    </div>
                                  </motion.button>
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
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </main>

              {currentQuestion.type === "text" || isLastQuestion ? (
                <footer className="sticky bottom-5 z-20 mt-auto shrink-0 border-t border-primary/12 bg-[#FAFAFA]/95 pb-[calc(env(safe-area-inset-bottom)+0.9rem)] pt-3 backdrop-blur-sm dark:bg-background/95">
                  <div className="flex items-center justify-end gap-2">
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
                      ) : isLastQuestion ? (
                        <>
                          {t("onboarding.finish")}
                          <Sparkles className="ml-2 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          {t("onboarding.continue")}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </footer>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;


