export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}

export async function generateStaticParams() {
  return [];
}
