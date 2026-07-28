import { createOpenGraphImage } from "@/lib/opengraph-image";

export const dynamic = "force-static";

export function GET() {
  return createOpenGraphImage();
}
