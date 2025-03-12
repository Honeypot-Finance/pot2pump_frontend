import { Token } from "@/services/contract/token";

export type DedicatedPot2Pump = {
  tokenAddress: string;
  token: Token;
  logoURI: string;
  bannerURI?: string;
  description?: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  discord?: string;
};

export const dedicatedPot2pumps: DedicatedPot2Pump[] = [
  {
    tokenAddress: "0x5c43a5fef2b056934478373a53d1cb08030fd382",
    token: Token.getToken({
      address: "0x5c43a5fef2b056934478373a53d1cb08030fd382",
    }),
    logoURI: "/images/icons/tokens/berally.png",
    bannerURI: "/images/banner/berally-banner.png",
    description: "Berally is a token on the Berachain network.",
    website: "https://berally.com",
    telegram: "https://t.me/berally",
    twitter: "https://x.com/berally",
    discord: "https://discord.com/berally",
  },
];
