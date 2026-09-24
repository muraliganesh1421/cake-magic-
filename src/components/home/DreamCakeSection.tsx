"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  Sparkles,
  Upload,
  X,
  MessageCircle,
  RotateCcw,
  Check,
  ChevronDown,
  ArrowRight,
  Info,
  Calendar,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import {
  AVAILABLE_OCCASIONS,
  AVAILABLE_FLAVOURS,
  AVAILABLE_SIZES,
  AVAILABLE_STYLES,
  AVAILABLE_COLOUR_THEMES,
  DreamCakeInput,
  DreamCakeConcept,
  generateCakeConcept,
} from "@/lib/aiCakeService";
import { buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";

export default function DreamCakeSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [concept, setConcept] = useState<DreamCakeConcept | null>(null);

  // Form State
  const [occasion, setOccasion] = useState<string>("Birthday");
  const [flavour, setFlavour] = useState<string>(AVAILABLE_FLAVOURS[0]);
  const [size, setSize] = useState<string>(AVAILABLE_SIZES[1]); // 1 kg
  const [eggless, setEggless] = useState(true);
  const [styleTheme, setStyleTheme] = useState<string>(AVAILABLE_STYLES[0]);
  const [colourPreference, setColourPreference] = useState<string>("Black & Antique Gold");
  const [cakeMessage, setCakeMessage] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryType, setDeliveryType] = useState("Rajahmundry Delivery");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Please upload an image smaller than 5 MB.");
      return;
    }

    setImageFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setReferenceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setReferenceImage(null);
    setImageFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCreateConcept = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateCakeConcept({
        occasion,
        flavour,
        size,
        eggless,
        styleTheme,
        colourPreference,
        cakeMessage,
        referenceImage,
        deliveryDate,
        deliveryType,
        additionalNotes,
      });
      setConcept(generated);
      setIsGenerating(false);
    }, 600);
  };

  const handleReset = () => {
    setConcept(null);
  };

  const buildWhatsAppConceptUrl = (c: DreamCakeConcept) => {
    const message = WhatsAppTemplates.customCakeEnquiry({
      occasion: c.occasion,
      flavour: c.flavour,
      size: c.size,
      eggless: c.eggless ? "Yes (100% Vegetarian)" : "Regular",
      theme: c.theme,
      colour: c.colour,
      message: c.cakeMessage || "None",
      date: c.deliveryDate || "To be confirmed",
      deliveryType: c.deliveryType,
      notes: c.additionalNotes || (c.referenceImage ? "Reference image attached" : "None"),
    });

    return buildWhatsAppLink(message);
  };

  return (
    <section
      ref={sectionRef}
      id="dream-cake"
      className="py-16 md:py-24 bg-[var(--surface-alt)]/35 border-y border-[var(--surface-border)]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs uppercase tracking-[0.28em] font-semibold text-[var(--primary)] block">
            AI Cake Concept Studio
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight">
            CREATE YOUR DREAM CAKE
          </h2>

          <p className="text-sm sm:text-base text-[var(--foreground-muted)] max-w-lg mx-auto leading-relaxed">
            Tell us what you&apos;re imagining, add your inspiration, and create a personalized cake concept.
          </p>

          {!isOpen && !concept && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="tap-target px-7 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-xs inline-flex items-center gap-2 group"
              >
                <span>Design My Cake</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Customizer Container */}
        {(isOpen || concept) && (
          <div className="mt-10 bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] p-6 sm:p-8 md:p-10 shadow-sm transition-all">
            {!concept ? (
              /* --- Step 1: Input Form --- */
              <form onSubmit={handleCreateConcept} className="space-y-7">
                {/* 1. Occasion */}
                <div className="space-y-2">
                  <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                    1. What are you celebrating?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {AVAILABLE_OCCASIONS.map((occ) => {
                      const selected = occasion === occ;
                      return (
                        <button
                          key={occ}
                          type="button"
                          onClick={() => setOccasion(occ)}
                          className={`tap-target px-3 py-2.5 rounded-lg text-xs font-medium border text-center transition-all ${
                            selected
                              ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-xs"
                              : "bg-[var(--surface-alt)]/60 text-[var(--foreground)] border-[var(--surface-border)] hover:bg-[var(--surface-alt)]"
                          }`}
                        >
                          {occ}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Flavour */}
                <div className="space-y-2">
                  <label
                    htmlFor="cake-flavour"
                    className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]"
                  >
                    2. Choose a flavour
                  </label>
                  <div className="relative">
                    <select
                      id="cake-flavour"
                      value={flavour}
                      onChange={(e) => setFlavour(e.target.value)}
                      className="w-full appearance-none bg-[var(--surface-alt)]/50 border border-[var(--surface-border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] font-medium focus:outline-none focus:border-[var(--primary)] transition-colors pr-10"
                    >
                      {AVAILABLE_FLAVOURS.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 3. Style / Theme & Colour */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Style Theme */}
                  <div className="space-y-2">
                    <label
                      htmlFor="style-theme"
                      className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]"
                    >
                      3. Style / Theme
                    </label>
                    <div className="relative">
                      <select
                        id="style-theme"
                        value={styleTheme}
                        onChange={(e) => setStyleTheme(e.target.value)}
                        className="w-full appearance-none bg-[var(--surface-alt)]/50 border border-[var(--surface-border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] font-medium focus:outline-none focus:border-[var(--primary)] transition-colors pr-10"
                      >
                        {AVAILABLE_STYLES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Colour Preference */}
                  <div className="space-y-2">
                    <label
                      htmlFor="colour-pref"
                      className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]"
                    >
                      4. Colour Palette
                    </label>
                    <div className="relative">
                      <select
                        id="colour-pref"
                        value={colourPreference}
                        onChange={(e) => setColourPreference(e.target.value)}
                        className="w-full appearance-none bg-[var(--surface-alt)]/50 border border-[var(--surface-border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] font-medium focus:outline-none focus:border-[var(--primary)] transition-colors pr-10"
                      >
                        {AVAILABLE_COLOUR_THEMES.map((theme) => (
                          <option key={theme.label} value={theme.label}>
                            {theme.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 5. Size & Eggless Preference */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Size */}
                  <div className="space-y-2">
                    <label
                      htmlFor="cake-size"
                      className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]"
                    >
                      5. Cake Size
                    </label>
                    <div className="relative">
                      <select
                        id="cake-size"
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                        className="w-full appearance-none bg-[var(--surface-alt)]/50 border border-[var(--surface-border)] rounded-xl px-4 py-3 text-sm text-[var(--foreground)] font-medium focus:outline-none focus:border-[var(--primary)] transition-colors pr-10"
                      >
                        {AVAILABLE_SIZES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[var(--foreground-muted)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Eggless */}
                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                      6. Eggless Preference
                    </label>
                    <div className="grid grid-cols-2 gap-2 h-[46px]">
                      <button
                        type="button"
                        onClick={() => setEggless(true)}
                        className={`rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                          eggless
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                            : "bg-[var(--surface-alt)]/60 text-[var(--foreground)] border-[var(--surface-border)] hover:bg-[var(--surface-alt)]"
                        }`}
                      >
                        {eggless && <Check className="w-3.5 h-3.5" />}
                        <span>Yes (100% Veg)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEggless(false)}
                        className={`rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                          !eggless
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)]"
                            : "bg-[var(--surface-alt)]/60 text-[var(--foreground)] border-[var(--surface-border)] hover:bg-[var(--surface-alt)]"
                        }`}
                      >
                        {!eggless && <Check className="w-3.5 h-3.5" />}
                        <span>Regular</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 7. Reference Image (Camera, Gallery, Desktop Upload) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                      7. Upload Inspiration (Optional)
                    </label>
                    <span className="text-[11px] text-[var(--foreground-subtle)]">
                      Camera, gallery or file
                    </span>
                  </div>

                  {referenceImage ? (
                    <div className="relative inline-flex items-center gap-3 p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)]/40">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[var(--surface-border)]">
                        <Image
                          src={referenceImage}
                          alt="Reference preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="text-left pr-6">
                        <span className="block text-xs font-semibold text-[var(--foreground)] truncate max-w-[200px]">
                          {imageFileName || "Reference Image"}
                        </span>
                        <span className="text-[11px] text-[var(--foreground-muted)]">
                          Ready for concept review
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 p-1 rounded-full text-[var(--foreground-muted)] hover:text-red-600 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-[var(--surface-border-strong)] rounded-xl p-4 sm:p-5 text-center cursor-pointer hover:bg-[var(--surface-alt)]/40 transition-colors"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="flex items-center justify-center gap-2 text-[var(--foreground-muted)] mb-1.5">
                        <Camera className="w-5 h-5" />
                        <ImageIcon className="w-5 h-5" />
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-[var(--foreground)] block">
                        Upload cake photo or sketch
                      </span>
                      <span className="text-[11px] text-[var(--foreground-subtle)] block mt-0.5">
                        Take photo from camera, select from gallery, or upload from desktop
                      </span>
                    </div>
                  )}
                </div>

                {/* 8. Message, Date & Delivery */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Cake Message */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label
                      htmlFor="cake-msg"
                      className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]"
                    >
                      8. Cake Message
                    </label>
                    <input
                      id="cake-msg"
                      type="text"
                      value={cakeMessage}
                      onChange={(e) => setCakeMessage(e.target.value)}
                      placeholder="e.g. Happy Birthday Arjun"
                      maxLength={40}
                      className="w-full bg-[var(--surface-alt)]/50 border border-[var(--surface-border)] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>

                  {/* Delivery Date */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label
                      htmlFor="deliv-date"
                      className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]"
                    >
                      9. Preferred Date
                    </label>
                    <input
                      id="deliv-date"
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full bg-[var(--surface-alt)]/50 border border-[var(--surface-border)] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] transition-colors"
                    />
                  </div>

                  {/* Delivery / Pickup */}
                  <div className="space-y-1.5 sm:col-span-1">
                    <label
                      htmlFor="deliv-type"
                      className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]"
                    >
                      10. Delivery / Pickup
                    </label>
                    <div className="relative">
                      <select
                        id="deliv-type"
                        value={deliveryType}
                        onChange={(e) => setDeliveryType(e.target.value)}
                        className="w-full appearance-none bg-[var(--surface-alt)]/50 border border-[var(--surface-border)] rounded-xl px-3.5 py-3 text-xs sm:text-sm text-[var(--foreground)] font-medium focus:outline-none focus:border-[var(--primary)] transition-colors pr-8"
                      >
                        <option value="Rajahmundry Delivery">Rajahmundry Delivery</option>
                        <option value="Store Pickup">Store Pickup</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[var(--foreground-muted)] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* 11. Additional Notes */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="cake-notes"
                    className="block text-xs uppercase tracking-wider font-semibold text-[var(--foreground-muted)]"
                  >
                    11. Additional Notes
                  </label>
                  <textarea
                    id="cake-notes"
                    rows={2}
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Specific design ideas, dietary instructions, or topping preferences..."
                    className="w-full bg-[var(--surface-alt)]/50 border border-[var(--surface-border)] rounded-xl p-3.5 text-xs sm:text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--primary)] transition-colors resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="tap-target w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-[var(--accent-blush)]" />
                    <span>{isGenerating ? "Synthesizing Concept..." : "Create My Cake Concept"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] py-2"
                  >
                    Close Customizer
                  </button>
                </div>
              </form>
            ) : (
              /* --- Step 2: Concept Result --- */
              <div className="space-y-7 animate-fadeIn">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[var(--surface-border)]">
                  <div>
                    <span className="text-xs uppercase tracking-widest font-semibold text-[var(--primary)] block">
                      Custom Cake Design Concept
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)] mt-0.5">
                      YOUR CAKE CONCEPT
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="tap-target inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--primary)] self-start sm:self-auto"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Edit Design</span>
                  </button>
                </div>

                {/* Concept Breakdown Card */}
                <div className="bg-[var(--surface-alt)]/50 rounded-xl p-5 sm:p-6 border border-[var(--surface-border)] space-y-5">
                  <div>
                    <h4 className="font-serif text-lg sm:text-xl font-bold text-[var(--foreground)]">
                      {concept.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[var(--foreground-muted)] leading-relaxed mt-1.5">
                      {concept.designSummary}
                    </p>
                  </div>

                  {/* Attributes Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="bg-[var(--surface)] p-3 rounded-lg border border-[var(--surface-border)]">
                      <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                        Style / Theme
                      </span>
                      <span className="text-xs font-bold text-[var(--foreground)] mt-0.5 block truncate">
                        {concept.theme}
                      </span>
                    </div>

                    <div className="bg-[var(--surface)] p-3 rounded-lg border border-[var(--surface-border)]">
                      <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                        Flavour
                      </span>
                      <span className="text-xs font-bold text-[var(--foreground)] mt-0.5 block truncate">
                        {concept.flavour}
                      </span>
                    </div>

                    <div className="bg-[var(--surface)] p-3 rounded-lg border border-[var(--surface-border)]">
                      <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                        Size
                      </span>
                      <span className="text-xs font-bold text-[var(--foreground)] mt-0.5 block truncate">
                        {concept.size.split(" ")[0]}
                      </span>
                    </div>

                    <div className="bg-[var(--surface)] p-3 rounded-lg border border-[var(--surface-border)]">
                      <span className="block text-[10px] uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                        Colour Palette
                      </span>
                      <span className="text-xs font-bold text-[var(--foreground)] mt-0.5 block truncate">
                        {concept.colour}
                      </span>
                    </div>
                  </div>

                  {/* Detailed Specs */}
                  <div className="pt-2 border-t border-[var(--surface-border)] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--foreground-muted)] block">
                        Eggless Preference
                      </span>
                      <span className="text-xs font-semibold text-[var(--badge-eggless-text)]">
                        {concept.eggless ? "100% Vegetarian Eggless Sponge" : "Regular Patisserie Sponge"}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--foreground-muted)] block">
                        Date &amp; Handover
                      </span>
                      <span className="text-xs font-semibold text-[var(--foreground)]">
                        {concept.deliveryDate ? `${concept.deliveryDate} • ` : ""}
                        {concept.deliveryType}
                      </span>
                    </div>

                    {concept.cakeMessage && (
                      <div className="sm:col-span-2">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--foreground-muted)] block">
                          Inscription Message
                        </span>
                        <span className="italic font-serif font-medium text-[var(--primary)] text-sm">
                          &ldquo;{concept.cakeMessage}&rdquo;
                        </span>
                      </div>
                    )}

                    {concept.referenceImage && (
                      <div className="sm:col-span-2 flex items-center gap-3 pt-1">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-[var(--foreground-muted)]">
                          Inspiration Photo Attached:
                        </span>
                        <div className="relative w-10 h-10 rounded-md border border-[var(--surface-border)] overflow-hidden">
                          <Image
                            src={concept.referenceImage}
                            alt="Reference"
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Owner Confirmation Notice */}
                <div className="p-3.5 rounded-xl bg-[var(--surface-alt)] border border-[var(--surface-border)] flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-[var(--primary)] shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                    <strong className="text-[var(--foreground)] font-semibold">
                      Design concept only:
                    </strong>{" "}
                    Cake Magic will confirm final design availability, preparation schedule, and pricing.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <a
                    href={buildWhatsAppConceptUrl(concept)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tap-target flex-1 px-6 py-3.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-colors shadow-xs flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[var(--accent-blush)]" />
                    <span>Request This Cake</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleReset}
                    className="tap-target px-5 py-3.5 rounded-xl border border-[var(--surface-border-strong)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Edit Design</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
