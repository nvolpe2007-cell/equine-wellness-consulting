/// <reference types="vite/client" />

declare module "*&picture" {
  import type { PictureData } from "@/components/ui/ResponsiveImage";
  const value: PictureData;
  export default value;
}

declare module "*?picture" {
  import type { PictureData } from "@/components/ui/ResponsiveImage";
  const value: PictureData;
  export default value;
}

declare module "*.mp4" {
  const src: string;
  export default src;
}
