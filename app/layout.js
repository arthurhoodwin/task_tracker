import './globals.css'

export const metadata = { title: "Трекер задач" };
export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}