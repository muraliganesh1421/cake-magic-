"use client";

import { useState, useMemo, ChangeEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  CheckCircle2,
  MessageCircle,
  Calendar,
  Clock,
  MapPin,
  Send,
  HelpCircle,
} from "lucide-react";
import { buildWhatsAppLink, WhatsAppTemplates } from "@/config/site";

interface CustomCakeWizardProps {
  availableFlavours: string[];
}

export default function CustomCakeWizard({
  availableFlavours,
}: CustomCakeWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [occasion, setOccasion] = useState("Birthday");
  const [flavour, setFlavour] = useState(availableFlavours[0] || "Belgian Dark Chocolate");
  const [flavourSearch, setFlavourSearch] = useState("");
  const [size, setSize] = useState("1 kg");
  const [customSizeText, setCustomSizeText] = useState("");
  const [eggless, setEggless] = useState<boolean>(true);
  const [referenceImage, setReferenceImage] = useState<string>("");
  const [imageFileName, setImageFileName] = useState<string>("");
  const [cakeMessage, setCakeMessage] = useState("");
  const [deliveryType, setDeliveryType] = useState<"Pickup" | "Delivery">("Pickup");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerWhatsApp, setCustomerWhatsApp] = useState("");

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<{ id: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const occasionOptions = [
    "Birthday",
    "Anniversary",
    "Wedding",
    "Baby Shower",
    "Kids",
    "Corporate",
    "Other",
  ];

  const sizeOptions = ["250 g (Bento)", "500 g", "1 kg", "2 kg", "3 kg+", "Custom"];

  const filteredFlavours = useMemo(() => {
    if (!flavourSearch) return availableFlavours;
    return availableFlavours.filter((f) =>
      f.toLowerCase().includes(flavourSearch.toLowerCase())
    );
  }, [availableFlavours, flavourSearch]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Please upload an image smaller than 5MB.");
        return;
      }
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setReferenceImage("");
    setImageFileName("");
  };

  const finalSize = size === "Custom" ? customSizeText || "Custom size" : size;

  const validateCurrentStep = (): boolean => {
    setErrorMsg("");
    if (currentStep === 1 && !occasion) {
      setErrorMsg("Please select an occasion.");
      return false;
    }
    if (currentStep === 2 && !flavour) {
      setErrorMsg("Please select or specify a flavour.");
      return false;
    }
    if (currentStep === 3 && size === "Custom" && !customSizeText.trim()) {
      setErrorMsg("Please describe your custom size requirement.");
      return false;
    }
    if (currentStep === 7) {
      if (!deliveryDate) {
        setErrorMsg("Please pick your required celebration date.");
        return false;
      }
      if (deliveryType === "Delivery" && !address.trim()) {
        setErrorMsg("Please specify your delivery address in Rajahmundry.");
        return false;
      }
    }
    if (currentStep === 8) {
      if (!customerName.trim() || !customerPhone.trim()) {
        setErrorMsg("Please provide your name and phone number.");
        return false;
      }
      if (customerPhone.replace(/[^0-9]/g, "").length < 10) {
        setErrorMsg("Please enter a valid 10-digit mobile number.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, 9));
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setErrorMsg("");
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSubmitRequest = async () => {
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone: customerPhone,
          whatsapp: customerWhatsApp || customerPhone,
          occasion,
          flavour,
          size: finalSize,
          eggless,
          message: cakeMessage,
          referenceImage,
          deliveryDate,
          deliveryTime,
          deliveryType,
          address: deliveryType === "Delivery" ? address : "In-store pickup, Rajahmundry",
          notes,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedRequest(data);
      } else {
        const errorData = await res.json();
        setErrorMsg(errorData.error || "Unable to submit your request. Please try WhatsApp.");
      }
    } catch {
      setErrorMsg("Network error. Please try WhatsApp directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = WhatsAppTemplates.customCakeEnquiry({
    occasion,
    flavour,
    size: finalSize,
    eggless: eggless ? "Yes (100% Vegetarian)" : "Regular",
    theme: referenceImage ? "Custom Reference Design" : "Bespoke Artisanal",
    colour: "As per celebration theme",
    message: cakeMessage || "None",
    date: deliveryDate || "To be confirmed",
    deliveryType: deliveryType === "Delivery" ? `Delivery to ${address || "Rajahmundry"}` : "Store Pickup in Rajahmundry",
    notes: notes || undefined,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--accent-blush-light)] text-[var(--accent-blush-dark)] text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Bespoke Design Studio</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          Design Your Celebration Cake
        </h1>
        <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mt-1.5 max-w-lg mx-auto">
          Share your celebration vision in 9 easy steps. We&apos;ll confirm design availability and provide a tailored quote.
        </p>
      </div>

      {/* Progress Bar */}
      {!submittedRequest && (
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--foreground-muted)] mb-2">
            <span>
              STEP {currentStep} OF 9 &bull;{" "}
              {currentStep === 1 && "Occasion"}
              {currentStep === 2 && "Flavour"}
              {currentStep === 3 && "Size"}
              {currentStep === 4 && "Eggless Preference"}
              {currentStep === 5 && "Design Reference"}
              {currentStep === 6 && "Piping Inscription"}
              {currentStep === 7 && "Delivery Details"}
              {currentStep === 8 && "Your Contact"}
              {currentStep === 9 && "Review & Submit"}
            </span>
            <span>{Math.round((currentStep / 9) * 100)}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-[var(--surface-alt)] overflow-hidden border border-[var(--surface-border)]">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${(currentStep / 9) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Main Wizard Card */}
      <div className="bg-[var(--surface)] rounded-2xl border border-[var(--surface-border)] shadow-sm p-6 sm:p-8">
        {/* POST-SUBMISSION STATE */}
        {submittedRequest ? (
          <div className="text-center py-8 space-y-6 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--foreground-muted)]">
                Request ID: {submittedRequest.id}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
                Your request has been prepared.
              </h2>
              <p className="text-sm text-[var(--foreground-muted)] max-w-md mx-auto leading-relaxed">
                Cake Magic will review your design, verify baking availability for {deliveryDate}, and provide a custom quote.
              </p>
            </div>

            {/* Note on guarantee */}
            <div className="p-4 rounded-2xl bg-[var(--surface-alt)] border border-[var(--surface-border)] text-xs text-[var(--foreground-muted)] max-w-md mx-auto text-left space-y-1">
              <div className="font-bold text-[var(--foreground)] flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[var(--primary)]" />
                <span>Next Step: WhatsApp Confirmation</span>
              </div>
              <p>
                To speed up your design preview and receive a direct price quotation, continue your enquiry on WhatsApp now.
              </p>
            </div>

            {/* WhatsApp Direct Action */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
              <a
                href={buildWhatsAppLink(whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="tap-target flex-1 py-3 px-6 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4 text-[var(--accent-blush)]" />
                <span>Continue on WhatsApp</span>
              </a>

              <Link
                href="/cakes"
                className="tap-target py-3 px-6 rounded-xl border border-[var(--surface-border-strong)] text-sm font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)] transition-colors flex items-center justify-center"
              >
                Explore Catalogue
              </Link>
            </div>
          </div>
        ) : (
          /* STEP BY STEP FORM */
          <div className="space-y-6">
            {/* STEP 1: Occasion */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Step 1: What occasion is this cake for?
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Select the celebratory milestone you are commemorating in Rajahmundry.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {occasionOptions.map((occ) => (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`tap-target p-4 rounded-2xl border text-sm font-semibold transition-all text-center ${
                        occasion === occ
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm scale-102"
                          : "bg-[var(--surface-alt)] text-[var(--foreground)] border-[var(--surface-border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      {occ}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Flavour */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Step 2: Choose your cake flavour
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Pick from our freshly baked database flavours or search for your preference.
                </p>

                <input
                  type="text"
                  placeholder="Filter flavour (e.g. Chocolate, Biscoff, Velvet, Mango)..."
                  value={flavourSearch}
                  onChange={(e) => setFlavourSearch(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface-alt)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pt-1 pr-1">
                  {filteredFlavours.map((flv) => (
                    <button
                      key={flv}
                      type="button"
                      onClick={() => setFlavour(flv)}
                      className={`tap-target text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                        flavour === flv
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] font-semibold shadow-xs"
                          : "bg-[var(--surface)] text-[var(--foreground)] border-[var(--surface-border)] hover:bg-[var(--surface-alt)]"
                      }`}
                    >
                      <span>{flv}</span>
                      {flavour === flv && <Sparkles className="w-3.5 h-3.5 text-[var(--accent-blush)]" />}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                    Or specify a custom flavour combination:
                  </label>
                  <input
                    type="text"
                    value={flavour}
                    onChange={(e) => setFlavour(e.target.value)}
                    placeholder="e.g. Hazelnut Chocolate with Orange Curd"
                    className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Size */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Step 3: What size do you require?
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Select estimated weight or specify guest count for tiered structures.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {sizeOptions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`tap-target p-4 rounded-2xl border text-sm font-semibold transition-all text-center ${
                        size === s
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-sm"
                          : "bg-[var(--surface-alt)] text-[var(--foreground)] border-[var(--surface-border)] hover:border-[var(--primary)]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>

                {size === "Custom" && (
                  <div className="pt-2">
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                      Describe your size / guest requirements:
                    </label>
                    <input
                      type="text"
                      value={customSizeText}
                      onChange={(e) => setCustomSizeText(e.target.value)}
                      placeholder="e.g. 2-Tier for 40 guests, ~4 kg"
                      className="w-full text-xs p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Eggless */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Step 4: Do you prefer 100% Eggless?
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Our pure vegetarian eggless cakes are baked with identical fluffiness and rich texture.
                </p>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <button
                    type="button"
                    onClick={() => setEggless(true)}
                    className={`tap-target p-6 rounded-2xl border text-center transition-all ${
                      eggless === true
                        ? "bg-[var(--badge-eggless-bg)] text-[var(--badge-eggless-text)] border-[var(--badge-eggless-border)] shadow-md ring-2 ring-[var(--badge-eggless-border)]"
                        : "bg-[var(--surface-alt)] text-[var(--foreground)] border-[var(--surface-border)]"
                    }`}
                  >
                    <span className="block text-lg font-bold">Yes, 100% Eggless</span>
                    <span className="text-xs mt-1 block opacity-80">Pure vegetarian</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEggless(false)}
                    className={`tap-target p-6 rounded-2xl border text-center transition-all ${
                      eggless === false
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-md ring-2 ring-[var(--accent-blush)]"
                        : "bg-[var(--surface-alt)] text-[var(--foreground)] border-[var(--surface-border)]"
                    }`}
                  >
                    <span className="block text-lg font-bold">Regular</span>
                    <span className="text-xs mt-1 block opacity-80">With egg</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: Design Reference Upload */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Step 5: Share design reference (Optional)
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Upload a photo from Pinterest, Instagram, or a sketch of your desired cake.
                </p>

                {referenceImage ? (
                  <div className="relative rounded-2xl overflow-hidden border border-[var(--surface-border)] max-w-sm mx-auto aspect-square bg-[var(--surface-alt)]">
                    <Image
                      src={referenceImage}
                      alt="Uploaded reference"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-1.5 rounded-full bg-black/70 text-white hover:bg-black transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] p-2 rounded-lg text-center truncate">
                      {imageFileName || "Reference Image Loaded"}
                    </div>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-[var(--surface-border-strong)] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[var(--surface-alt)]/60 transition-colors">
                    <Upload className="w-8 h-8 text-[var(--primary)] mb-2" />
                    <span className="text-sm font-semibold text-[var(--foreground)]">
                      Click to upload photo
                    </span>
                    <span className="text-xs text-[var(--foreground-muted)] mt-1">
                      PNG, JPG up to 5MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}

                <div className="pt-2">
                  <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                    Design details or colour palette notes:
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Pastel lavender theme, gold foil touches, minimalist piping..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            )}

            {/* STEP 6: Cake Message */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Step 6: Inscription on the cake
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Enter the wording you would like piped onto the cake board or edible plaque.
                </p>
                <input
                  type="text"
                  value={cakeMessage}
                  onChange={(e) => setCakeMessage(e.target.value)}
                  placeholder="Happy 1st Birthday Ayaan..."
                  maxLength={50}
                  className="w-full text-sm p-3.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                />
                <span className="text-[11px] text-[var(--foreground-subtle)] block">
                  Leave blank if no message is desired.
                </span>
              </div>
            )}

            {/* STEP 7: Delivery Details */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Step 7: Delivery or Pickup in Rajahmundry
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  Let us know when and where you need the cake.
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDeliveryType("Pickup")}
                    className={`tap-target p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      deliveryType === "Pickup"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-xs"
                        : "bg-[var(--surface-alt)] text-[var(--foreground)] border-[var(--surface-border)]"
                    }`}
                  >
                    Store Pickup (Rajahmundry)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryType("Delivery")}
                    className={`tap-target p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      deliveryType === "Delivery"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-xs"
                        : "bg-[var(--surface-alt)] text-[var(--foreground)] border-[var(--surface-border)]"
                    }`}
                  >
                    Local Delivery
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                      Celebration Date *
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      value={deliveryTime}
                      onChange={(e) => setDeliveryTime(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                {deliveryType === "Delivery" && (
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                      Delivery Address in Rajahmundry *
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Door No, Street, Landmark, Area (e.g., Danavaipeta, Tilak Road, Morampudi)"
                      className="w-full text-xs p-2.5 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                )}
              </div>
            )}

            {/* STEP 8: Customer Details */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                  Step 8: Contact Information
                </h2>
                <p className="text-xs text-[var(--foreground-muted)]">
                  We use this strictly to confirm your design quote and send order updates.
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full text-xs p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                      Mobile Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full text-xs p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--foreground-muted)] mb-1">
                      WhatsApp Number (if different)
                    </label>
                    <input
                      type="tel"
                      value={customerWhatsApp}
                      onChange={(e) => setCustomerWhatsApp(e.target.value)}
                      placeholder="Leave blank if same as phone"
                      className="w-full text-xs p-3 rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: Review */}
            {currentStep === 9 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[var(--foreground)]">
                    Step 9: Review Your Cake Request
                  </h2>
                  <p className="text-xs text-[var(--foreground-muted)] mt-1">
                    Please review your selections before sending the request to Cake Magic.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-[var(--surface-alt)] border border-[var(--surface-border)] divide-y divide-[var(--surface-border)] text-xs space-y-2.5">
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--foreground-muted)]">Occasion:</span>
                    <span className="font-bold text-[var(--foreground)]">{occasion}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--foreground-muted)]">Flavour:</span>
                    <span className="font-bold text-[var(--foreground)]">{flavour}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--foreground-muted)]">Size:</span>
                    <span className="font-bold text-[var(--foreground)]">{finalSize}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--foreground-muted)]">Eggless:</span>
                    <span className="font-bold text-[var(--badge-eggless-text)]">
                      {eggless ? "Yes (100% Eggless)" : "No (Regular)"}
                    </span>
                  </div>
                  {cakeMessage && (
                    <div className="flex justify-between py-1">
                      <span className="text-[var(--foreground-muted)]">Piping Message:</span>
                      <span className="font-bold text-[var(--foreground)]">&ldquo;{cakeMessage}&rdquo;</span>
                    </div>
                  )}
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--foreground-muted)]">Date & Time:</span>
                    <span className="font-bold text-[var(--foreground)]">
                      {deliveryDate || "Not set"} {deliveryTime ? `@ ${deliveryTime}` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--foreground-muted)]">Fulfillment:</span>
                    <span className="font-bold text-[var(--foreground)]">
                      {deliveryType} {deliveryType === "Delivery" && address ? `(${address})` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[var(--foreground-muted)]">Contact:</span>
                    <span className="font-bold text-[var(--foreground)]">
                      {customerName} &bull; {customerPhone}
                    </span>
                  </div>
                  {referenceImage && (
                    <div className="flex justify-between py-1 items-center">
                      <span className="text-[var(--foreground-muted)]">Reference Photo:</span>
                      <span className="font-bold text-[var(--primary)]">Attached</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                  <strong>Important:</strong> Submitting this request does not automatically guarantee custom cake booking. Cake Magic will confirm design feasibility, schedule, and final quotation.
                </div>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* Step Navigation Buttons */}
            <div className="pt-4 border-t border-[var(--surface-border)] flex items-center justify-between gap-3">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="tap-target px-4 py-2.5 rounded-xl border border-[var(--surface-border-strong)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-alt)] transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 9 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="tap-target px-6 py-2.5 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitRequest}
                  className="tap-target px-7 py-3 rounded-xl bg-[var(--primary)] text-[var(--primary-foreground)] text-sm font-semibold hover:bg-[var(--primary-hover)] transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Sending..." : "Send Cake Request"}</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
