import { LDCHeader } from "@/components/organisms/ldc-header";
import { LDCFooter } from "@/components/organisms/ldc-footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LDCHeader />
      {children}
      <LDCFooter />
    </>
  );
}
