import "./globals.css";
import Header from "./components/Header";  // Change ici le chemin

export const metadata = {
  title: "Gestion Étudiants",
  description: "App de gestion d'étudiants avec Next.js + FastAPI",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
