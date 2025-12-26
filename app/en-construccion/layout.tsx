/**
 * Construction Page Layout
 *
 * Hides the global header and footer for this standalone page.
 */
export default function EnConstruccionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style>{`
        header, footer { display: none !important; }
      `}</style>
      {children}
    </>
  );
}
