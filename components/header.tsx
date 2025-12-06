import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Package2Icon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-white">
      <Link
        className="flex items-center gap-2 font-semibold"
        prefetch={true}
        href="/"
      >
        <Package2Icon className="h-6 w-6" />
        <span className="">Acme Store</span>
      </Link>
      <nav className="flex items-center gap-4">
        <Button asChild className="pl-1">
          <Link
            target="_blank"
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fvercel-optimizely-experimentation%2Ftree%main&env=OPTIMIZELY_API_KEY,OPTIMIZELY_SDK_KEY,OPTIMIZELY_PROJECT_ID,FLAGS_SECRET&envDescription=Execute%20the%20following%20command%20to%20create%20a%20secret%3A%20node%20-e%20%22console.log(crypto.randomBytes(32).toString('base64url'))%22&project-name=vercel-optimizely-experimentation&repository-name=vercel-optimizely-experimentation&demo-title=Vercel%20Experimentation&demo-description=A%20Next.js%20project%20using%20Optimizely%20for%20experimentation&demo-url=https%3A%2F%2Fvercel.com%2Fvercel-optimizely-experimentation.vercel.app"
            className="flex flex-row justify-center items-center"
          >
            <Image
              className="h-8 w-8"
              width={32}
              height={32}
              src="/logo.svg"
              alt="Deploy with Vercel"
            />
            Deploy
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link
            target="_blank"
            className="space-x-2"
            href="https://github.com/vercel/vercel-optimizely-experimentation"
          >
            <GitHubLogoIcon className="h-5 w-5" />
            <span className="hidden sm:block">GitHub</span>
          </Link>
        </Button>
        <Link target="_blank" href="https://vercel.com">
          <Image className="h-7 w-fit" src="/vercel-logotype-dark.png" width={100} height={28} alt="Vercel Logo" />
        </Link>
      </nav>
    </header>
  );
}
