import Divider from "@/components/divider";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import Headline from "@/components/ui/headline";
import OrnamentLine from "@/components/ui/ornament-line";
import Text from "@/components/ui/text";
import { BRAND } from "@/constants/app";
import { CheckCircle, Download, Monitor, Shield } from "lucide-react";

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
      <div className="mx-auto max-w-5xl px-4">
        {/* Header */}
        <Headline className="text-center">
          <Text variant="h1" className="text-center">
            Download Client
          </Text>
          <Text variant="p">Get started in minutes</Text>
        </Headline>

        {/* Download Button */}
        <div className="card-dark card-hover animate-glow mb-8 p-8 text-center">
          <Download className="text-gold mx-auto mb-6 h-16 w-16" />
          <h2 className="text-foreground mb-2 font-serif text-2xl font-bold">
            {BRAND} Full Client
          </h2>
          <p className="text-muted-foreground mb-1">Version 0.97d - 1.8 GB</p>
          <p className="text-muted-foreground mb-6 text-sm">
            Last updated: March 2024
          </p>
          <Button className="flex-1" variant="default" asChild>
            <a href="#">
              <span>Download Now</span>
            </a>
          </Button>
        </div>

        <Divider />

        <div className="grid gap-8 md:grid-cols-2">
          {/* System Requirements */}
          <div className="card-dark card-hover p-6">
            <div className="mb-6 flex items-center gap-3">
              <Monitor className="text-gold h-6 w-6" />
              <h3 className="section-title">System Requirements</h3>
            </div>
            <OrnamentLine className="mb-4" />
            <div className="space-y-3">
              {requirements.map((req) => (
                <div
                  key={req.label}
                  className="border-border/50 flex justify-between border-b pb-2"
                >
                  <span className="text-muted-foreground">{req.label}</span>
                  <span className="text-foreground">{req.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Installation Guide */}
          <div className="card-dark card-hover p-6">
            <div className="mb-6 flex items-center gap-3">
              <Shield className="text-gold h-6 w-6" />
              <h3 className="section-title">Installation Guide</h3>
            </div>
            <OrnamentLine className="mb-4" />
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-gold mt-0.5 h-5 w-5 shrink-0" />
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
