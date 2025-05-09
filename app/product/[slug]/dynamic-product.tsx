import { buttonVariants } from "@/components/ui/button";
import ButtonSkeleton from "@/components/ui/button-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { products } from "@/lib/products";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { formatUSD } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { showBuyNowFlag } from "@/lib/flags";
import AddToCartButton from "@/components/add-to-cart";
import BuyNowButton from "@/components/buy-now";
import { FlagValues } from "flags/react";
import { notFound } from "next/navigation";
import { get } from "@vercel/edge-config";

export const DynamicProduct = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;
  const product = products.filter((p) => p.slug === params.slug)[0];
  if (!product) {
    notFound();
  }

  return (
    <>
      <div className="grid md:grid-cols-5 gap-3">
        <div className="md:col-span-4">
          <Image
            alt={product.imageAlt}
            className="object-contain w-full rounded-lg overflow-hidden bg-slate-300"
            height="500"
            width="500"
            src={product.imageSrc}
          />
        </div>
      </div>
      <div className="grid gap-4 md:gap-10">
        <div className="md:flex items-start">
          <div className="grid gap-4">
            <h1 className="font-bold text-3xl lg:text-4xl">{product.title}</h1>
            <div>
              <p>{product.details}</p>
              <Suspense fallback={<Skeleton className="w-32 h-6 mt-2" />}>
                <Stock slug={params.slug} />
              </Suspense>
            </div>
            <div className="text-4xl font-bold ml-auto">
              {formatUSD(product.price)}
            </div>
          </div>
        </div>
        <div className="grid gap-4 md:gap-10">
          <div className="grid gap-2">
            <Label className="text-base" htmlFor="color">
              Color
            </Label>
            <RadioGroup
              className="flex items-center gap-2"
              defaultValue="black"
              id="color"
            >
              <Label
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100"
                htmlFor="color-black"
              >
                <RadioGroupItem id="color-black" value="black" />
                Black
              </Label>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label className="text-base" htmlFor="size">
              Size
            </Label>
            <RadioGroup
              className="flex items-center gap-2"
              defaultValue="m"
              id="size"
            >
              <Label
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100"
                htmlFor="size-xs"
              >
                <RadioGroupItem id="size-xs" value="xs" />
                XS
              </Label>
              <Label
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100"
                htmlFor="size-s"
              >
                <RadioGroupItem id="size-s" value="s" />S
              </Label>
              <Label
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100"
                htmlFor="size-m"
              >
                <RadioGroupItem id="size-m" value="m" />M
              </Label>
              <Label
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100"
                htmlFor="size-l"
              >
                <RadioGroupItem id="size-l" value="l" />L
              </Label>
              <Label
                className="border cursor-pointer rounded-md p-2 flex items-center gap-2 [&:has(:checked)]:bg-gray-100"
                htmlFor="size-xl"
              >
                <RadioGroupItem id="size-xl" value="xl" />
                XL
              </Label>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Suspense fallback={<ButtonSkeleton />}>
              <Purchase productId={product.id} />
            </Suspense>
            <Link
              href="/cart"
              prefetch={true}
              className={`w-full ${buttonVariants({ variant: "outline" })}`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

const Stock = async ({ slug }: { slug: string }) => {
  const stock = await get("stock");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (!stock || !(stock as Record<string, any>)[slug]) return;

  return (
    <p className="mt-2">
      Only {(stock as Record<string, any>)[slug]} left in stock!
    </p>
  );
};

export const DynamicProductSkeleton = async () => {
  return (
    <>
      <div className="grid md:grid-cols-5 gap-3">
        <div className="md:col-span-4">
          <Skeleton className="w-full h-96 rounded-lg" />
        </div>
      </div>
      <div className="grid gap-4 md:gap-10">
        <div className="md:flex items-start">
          <div className="grid gap-4">
            <Skeleton className="w-96 h-6" />
            <div></div>
            <div className="text-4xl font-bold ml-auto"></div>
          </div>
        </div>
        <div className="grid gap-4 md:gap-10">
          <div className="grid gap-2">
            <Skeleton className="w-20 h-6" />
          </div>
          <div className="grid gap-2">
            <Skeleton className="w-20 h-6" />
          </div>
          <div className="space-y-2">
            <ButtonSkeleton />
            <Link
              href="/cart"
              prefetch={true}
              className={`w-full ${buttonVariants({ variant: "outline" })}`}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

async function Purchase({ productId }: { productId: string }) {
  const showBuyNow = await showBuyNowFlag();
  const buttonText = showBuyNow?.buttonText || "Buy Now";
  return (
    <div className="flex flex-row w-full gap-1">
      <FlagValues values={{ [showBuyNowFlag.key]: showBuyNow }} />
      <AddToCartButton productId={productId} />
      {showBuyNow.enabled && <BuyNowButton text={buttonText} />}
    </div>
  );
}
