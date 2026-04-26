import Divider from "@/components/divider";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Headline from "@/components/ui/headline";
import OrnamentLine from "@/components/ui/ornament-line";
import Text from "@/components/ui/text";
import { BRAND } from "@/constants/app";
import { CheckCircle, Download } from "lucide-react";

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
      <Headline className="text-center">
        <Text variant="h1">
          Download Client
        </Text>
        <Text variant="p">Get started in minutes</Text>
      </Headline>

      <Card className="mb-8 text-center">
        <CardContent>
          <Download className="text-gold mx-auto mb-6 h-16 w-16" />
          <Text variant="h3" as="h2" className="mb-2">
            {BRAND} Full Client
          </Text>
          <p className="text-muted-foreground mb-1">Version 0.97d - 1.8 GB</p>
          <p className="text-muted-foreground mb-6 text-sm">
            Last updated: March 2024
          </p>
          <Button className="flex-1" variant="default" asChild>
            <a href="#">
              <span>Download Now</span>
            </a>
          </Button>
        </CardContent>
      </Card>

      <Divider />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent>
            <Text variant="h3" className="mb-2">
              System Requirements
            </Text>
            <OrnamentLine className="my-4" />
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
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Text variant="h3" className="mb-2">Installation Guide</Text>
            <OrnamentLine className="my-4" />
            <div className="space-y-3">
              {steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="text-gold mt-0.5 h-5 w-5 shrink-0" />
                  <span className="text-foreground text-sm">{step}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DownloadPage;
