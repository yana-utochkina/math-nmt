import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import "./styles/styles.css";
import Image from "next/image";
import Link from "next/link";

//auth
import Providers from "./providers"; // <--- Import the Providers
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import SignOutButton from "@/components/SignOutButton";

export const metadata = {
  title: "Kitacademy",
  description: "Онлайн-тести НМТ",
  icons: {
    icon: "/tab-icon.png",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session  = await getServerSession(authOptions); // Get session data

  return (
    <html lang="en">
      <body className="d-flex flex-column min-vh-100">
        <Providers>
          {/* Верхній блок із назвою і реєстрацією */}
          <header className="container d-flex justify-content-between align-items-center py-3 border-bottom">
            {/* Назва проекту */}
            <div>
              <Link href="/" className="text-decoration-none text-primary fw-bold" style={{fontSize: "1.5rem"}}>
                <Image src="/kitacademy-logo-edited.png" alt="Kitacademy logo" width={200} height={50}/>
              </Link>
            </div>

            {/* Посилання для реєстрації/входу or logout button */}
            <div>
              {!session ? (
                  // If no session (user not logged in)
                  <Link className="text-primary me-3" href="/register">
                    Реєстрація/Увійти
                  </Link>
              ) : (
                  // If session exists (user logged in), show profile link and SignOutButton
                  <div>
                    <Link className="text-primary me-3" href="/user_profile">
                      Профіль
                    </Link>
                    <SignOutButton />
                  </div>


              )}
            </div>
          </header>

          {/* Основний вміст сторінки */}
          <main className="flex-grow-1">{children}</main>

          {/* Футер */}
          <footer className="py-4 bg-light border-top">
            <div className="container text-center">
              <p className="m-0 text-muted">
                Контакти:
                <br/>
                Email: helloworld_maths_NMT@gmail.com
                <br/>
                Telegram: @helloworld_maths_NMT
                <br/>© 2025 «Maths.ua».
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
