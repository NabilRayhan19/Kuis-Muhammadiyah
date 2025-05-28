import "./globals.css";
import localFont from "next/font/local";
import ThemeProvider from "@/components/providers/theme-provider";
import Header from "@/components/molecules/header";
import ImageBackground from "@/components/atoms/image-background";
import MaxWidthWrapper from "@/components/atoms/max-width-wrapper";

const rubik = localFont({
  src: "../../public/assets/fonts/Rubik-VariableFont_wght.ttf",
  display: "swap",
});

export const metadata = {
  title: "Unismuh-quiz",
  description: "Kuis ke-muhammadiyaan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={rubik.className}>
        <ThemeProvider>
          <div className="bg-white dark:bg-dark-blue xs:py-10 md:py-12 w-full h-full min-h-screen transition relative">

            <ImageBackground />
            <MaxWidthWrapper className="flex justify-end xs:mb-10 lg:mb-2 xs:px-5 md:px-0">
              <Header />
            </MaxWidthWrapper>

            <main className="h-full xl:h-auto flex items-center justify-center xl:mt-16 2xl:mt-32">{children}</main>
          </div>
          );

        </ThemeProvider>
      </body>
    </html>
  );
}