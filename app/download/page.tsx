import Divider from "@/components/divider";
import PageLayout from "@/components/page-layout";
import { BRAND } from "@/constants/app";
import { CheckCircle, Download, Monitor, Shield } from "lucide-react";
import Link from "next/link";

const requirements = [
  { label: "OS", value: "Windows 7 / 8 / 10 / 11" },
  { label: "CPU", value: "Pentium III 800MHz+" },
  { label: "RAM", value: "256 MB" },
  { label: "GPU", value: "DirectX 8.1 compatible" },
  { label: "Storage", value: "2 GB free space" },
  { label: "Network", value: "Broadband Internet" },
];

const steps = [
  "Download the full client using the button below",
  "Extract the archive to your desired location",
  "Run the game launcher as Administrator",
  "Create your account on the User Panel page",
  "Log in and start your adventure!",
];

const DownloadPage = () => {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="font-serif text-4xl md:text-5xl font-bold gold-gradient-text mb-4">
            Download Client
          </h1>
          <p className="text-muted-foreground text-lg">Get started in minutes</p>
        </div>

        {/* Download Button */}
        <div
          className="card-dark p-8 text-center mb-8 card-hover animate-fade-up animate-glow"
          style={{ animationDelay: "0.1s", animationFillMode: "backwards" }}
        >
          <Download className="w-16 h-16 mx-auto mb-6 text-gold" />
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            {BRAND} Full Client
          </h2>
          <p className="text-muted-foreground mb-1">Version 0.97d - 1.8 GB</p>
          <p className="text-muted-foreground text-sm mb-6">Last updated: March 2024</p>
          <Link href="#" className="btn-gold inline-flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Now
          </Link>
        </div>

        <Divider />

        <div className="grid md:grid-cols-2 gap-8">
          {/* System Requirements */}
          <div
            className="card-dark p-6 card-hover animate-fade-up"
            style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Monitor className="w-6 h-6 text-gold" />
              <h3 className="section-title">System Requirements</h3>
            </div>
            <div className="ornament-line mb-4" />
            <div className="space-y-3">
              {requirements.map((req) => (
                <div
                  key={req.label}
                  className="flex justify-between border-b border-border/50 pb-2"
                >
                  <span className="text-muted-foreground">{req.label}</span>
                  <span className="text-foreground">{req.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Guide */}
          <div
            className="card-dark p-6 card-hover animate-fade-up"
            style={{ animationDelay: "0.3s", animationFillMode: "backwards" }}
          >
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-gold" />
              <h3 className="section-title">Installation Guide</h3>
            </div>
            <div className="ornament-line mb-4" />
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle
                    className="w-5 h-5 shrink-0 mt-0.5 text-gold"
                  />
                  <span className="text-foreground text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default DownloadPage;
