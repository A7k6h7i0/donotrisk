"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { apiPost, apiUpload } from "@/lib/api";
import UploadCard from "@/components/UploadCard";
import WarrantyResult, { ExtractedWarranty } from "@/components/WarrantyResult";

type ExtractedResult = {
  extracted: ExtractedWarranty;
  matched_product: {
    id: string;
    name: string;
    brand: string;
    model_number: string;
    risk_score: number;
    risk_band: string;
  } | null;
  validation?: {
    is_valid: boolean;
    warnings: string[];
  };
  analysis?: WarrantyAnalysis;
};

type WarrantyAnalysis = {
  coverage: string;
  keyTerms: string[];
  exclusions: string[];
  riskLevel: string;
  claimRequirements: string[];
};

export default function ScannerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<ExtractedResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sourceType, setSourceType] = useState<"upload" | "url" | "camera">("upload");
  
  // Camera capture state
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  function clearAuth() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user_name");
    localStorage.removeItem("user_email");
  }

  // Camera functions
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      setCameraStream(stream);
      setShowCamera(true);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      setMessage("Unable to access camera. Please check permissions.");
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setShowCamera(false);
  }

  function capturePhoto() {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setCapturedImage(dataUrl);
        
        // Convert to File
        fetch(dataUrl)
          .then(res => res.blob())
          .then(blob => {
            const capturedFile = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            setFile(capturedFile);
          });
      }
    }
    stopCamera();
  }

  function retakePhoto() {
    setCapturedImage(null);
    startCamera();
  }

  async function extractFromFile() {
    if (!file) return setMessage("Please select a warranty file first.");
    setResult(null);
    setSourceType("upload");
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Please login to use scanner.");

    setLoading(true);
    setMessage("");
    try {
      // Use the new analyze endpoint that includes AI analysis
      const data = await apiUpload("/scans/analyze", file, token);
      setResult(data);
      setMessage("Warranty extraction and AI analysis complete.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("(401)")) {
        clearAuth();
        setMessage("Session expired. Login again to scan.");
      } else {
        setMessage(msg || "Extraction failed. Upload a clearer image/PDF.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function extractFromUrl() {
    const cleaned = url.trim();
    if (!cleaned) return setMessage("Please enter a valid image/PDF URL.");

    setResult(null);
    setSourceType("url");
    const token = localStorage.getItem("token");
    if (!token) return setMessage("Please login to use scanner.");

    setLoading(true);
    setMessage("");
    try {
      // For URL, we need to first download and then analyze
      // Since we don't have a URL analyze endpoint, we'll use the existing one and then call AI
      const data = await apiPost<ExtractedResult>("/scans/extract-url", { url: cleaned }, token);
      
      // Now analyze with AI
      try {
        const analysisData = await apiPost<{ analysis: WarrantyAnalysis }>("/scans/analyze-text", 
          { text: data.extracted?.raw_text || "" }, 
          token
        );
        setResult({ ...data, analysis: analysisData.analysis });
      } catch {
        // If AI analysis fails, just show OCR results
        setResult(data);
      }
      setMessage("Warranty extraction complete from URL.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("(401)")) {
        clearAuth();
        setMessage("Session expired. Login again to scan.");
      } else {
        setMessage(msg || "URL extraction failed. Use a direct public JPG/PNG/PDF link.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    if (!result?.extracted) return;

    const token = localStorage.getItem("token");
    if (!token) return setMessage("Please login to save warranty.");

    setSaving(true);
    setMessage("");

    try {
      const purchaseDate = result.extracted.purchase_date || new Date().toISOString().slice(0, 10);
      const months = Number((result.extracted.warranty_duration || "12").match(/\d+/)?.[0] || 12);
      const expiry = new Date(purchaseDate);
      expiry.setMonth(expiry.getMonth() + months);

      await apiPost(
        "/scans/save",
        {
          product_id: result.matched_product?.id || null,
          serial_number: result.extracted.serial_number || "",
          purchase_date: purchaseDate,
          expiry_date: expiry.toISOString().slice(0, 10),
          raw_extracted_text: result.extracted.raw_text || "",
          source_type: sourceType,
          extracted_data: result.extracted
        },
        token
      );

      setMessage("Warranty saved to dashboard.");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "";
      if (msg.includes("(401)")) {
        clearAuth();
        setMessage("Unauthorized. Login again.");
      } else {
        setMessage(msg || "Failed to save warranty.");
      }
    } finally {
      setSaving(false);
    }
  }

  const showLoginLink = useMemo(
    () => message.toLowerCase().includes("login") || message.toLowerCase().includes("unauthorized"),
    [message]
  );

  // Get risk color based on risk level
  function getRiskColor(riskLevel: string) {
    const lower = riskLevel.toLowerCase();
    if (lower.includes("low")) return "text-green-600 bg-green-50";
    if (lower.includes("high")) return "text-red-600 bg-red-50";
    return "text-amber-600 bg-amber-50";
  }

  return (
    <section className="space-y-5">
      <h1 className="font-display text-3xl">Warranty Scanner</h1>

      {/* Step indicator matching marketing content */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className={`rounded-xl p-4 text-center ${loading ? "bg-ink text-paper" : "bg-white border border-ink/10"}`}>
          <div className="text-2xl mb-2">📷</div>
          <h3 className="font-display text-lg">1. Scan Warranty</h3>
          <p className="text-sm opacity-80">Upload or photograph your warranty card</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${result?.analysis ? "bg-ink text-paper" : "bg-white border border-ink/10"}`}>
          <div className="text-2xl mb-2">🤖</div>
          <h3 className="font-display text-lg">2. AI Reads Terms</h3>
          <p className="text-sm opacity-80">AI analyzes warranty terms and conditions</p>
        </div>
        <div className={`rounded-xl p-4 text-center ${result?.analysis ? "bg-ink text-paper" : "bg-white border border-ink/10"}`}>
          <div className="text-2xl mb-2">⚠️</div>
          <h3 className="font-display text-lg">3. Exclusions Detected</h3>
          <p className="text-sm opacity-80">Hidden exclusions and risks are identified</p>
        </div>
      </div>

      {/* Camera Capture Section */}
      {showCamera ? (
        <div className="rounded-2xl border border-ink/10 bg-white p-4">
          <div className="relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full rounded-lg"
            />
          </div>
          <div className="mt-4 flex gap-3 justify-center">
            <button
              onClick={capturePhoto}
              className="rounded-lg bg-moss px-6 py-2 text-white"
            >
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="rounded-lg border border-ink/20 px-6 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : capturedImage ? (
        <UploadCard
          title="Camera Capture"
          description="Your captured warranty card image"
        >
          <div className="space-y-4">
            <img 
              src={capturedImage} 
              alt="Captured warranty" 
              className="w-full rounded-lg border border-ink/10"
            />
            <div className="flex gap-3">
              <button
                onClick={retakePhoto}
                className="rounded-lg border border-ink/20 px-4 py-2"
              >
                Retake Photo
              </button>
              <button
                onClick={extractFromFile}
                disabled={loading}
                className="rounded-lg bg-ink px-4 py-2 text-paper disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Analyze Warranty"}
              </button>
            </div>
          </div>
        </UploadCard>
      ) : null}

      {/* File Upload Section - Only show if not showing camera capture */}
      {!showCamera && !capturedImage && (
        <>
          <UploadCard
            title="Upload Warranty Card / Invoice"
            description="Supports JPG, PNG, and PDF. QR and barcode decoding is handled automatically during extraction."
          >
            <input
              type="file"
              className="w-full"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={extractFromFile}
                disabled={loading || !file}
                className="rounded-lg bg-ink px-4 py-2 text-paper disabled:opacity-50"
              >
                {loading ? "Analyzing..." : "Upload & Analyze"}
              </button>
              <button
                onClick={startCamera}
                disabled={loading}
                className="rounded-lg border border-ink/20 px-4 py-2"
              >
                📷 Capture with Camera
              </button>
            </div>
          </UploadCard>

          <UploadCard
            title="Scan From Image/PDF URL"
            description="Paste a direct public URL to warranty card image or invoice PDF."
          >
            <input
              className="w-full rounded-lg border border-ink/20 p-2"
              placeholder="https://example.com/warranty-card.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button
              className="mt-3 rounded-lg bg-ink px-4 py-2 text-paper disabled:opacity-50"
              onClick={extractFromUrl}
              disabled={loading}
            >
              {loading ? "Extracting..." : "Extract From URL"}
            </button>
          </UploadCard>
        </>
      )}

      {/* AI Analysis Results */}
      {result?.analysis && (
        <div className="rounded-2xl border border-ink/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl mb-4">AI Warranty Analysis</h2>
          
          {/* Risk Level Badge */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full mb-6 ${getRiskColor(result.analysis.riskLevel)}`}>
            <span className="font-semibold">Risk Level: {result.analysis.riskLevel}</span>
          </div>

          {/* Warranty Coverage */}
          <div className="mb-6">
            <h3 className="font-display text-lg text-ink mb-2">Warranty Coverage</h3>
            <p className="text-sm text-ink/80 whitespace-pre-wrap">{result.analysis.coverage}</p>
          </div>

          {/* Key Terms */}
          <div className="mb-6">
            <h3 className="font-display text-lg text-ink mb-2">Key Terms</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-ink/80">
              {result.analysis.keyTerms.map((term, index) => (
                <li key={index}>{term}</li>
              ))}
            </ul>
          </div>

          {/* Detected Exclusions */}
          <div className="mb-6">
            <h3 className="font-display text-lg text-red-700 mb-2">Detected Exclusions</h3>
            {result.analysis.exclusions.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm text-red-600">
                {result.analysis.exclusions.map((exclusion, index) => (
                  <li key={index}>{exclusion}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink/60">No specific exclusions detected</p>
            )}
          </div>

          {/* Claim Requirements */}
          <div className="mb-6">
            <h3 className="font-display text-lg text-ink mb-2">Claim Requirements</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-ink/80">
              {result.analysis.claimRequirements.map((req, index) => (
                <li key={index}>{req}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Extracted Warranty Data */}
      {result?.extracted ? (
        <WarrantyResult
          extracted={result.extracted}
          matchedProduct={result.matched_product}
          validation={result.validation || null}
          onSave={save}
          saving={saving}
        />
      ) : null}

      {message ? (
        <p className="text-sm">
          {message} {showLoginLink ? <Link href="/login" className="underline">Go to Login</Link> : null}
        </p>
      ) : null}
    </section>
  );
}
