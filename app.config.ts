export default defineAppConfig({
  name: "Httpz Token Airdrop",
  description: "Claim your $Httpz tokens - A community-driven token on Mina Protocol",
  siteUrl: "claim.httpz.link",
  twitterHandle: "@zk_httpz",
  twitterUrl: "https://x.com/zk_httpz",
  theme: {
    colors: {
      primary: "#00FF88",
      primaryHover: "#00FF9D",
      background: "#0D1117",
      secondary: "#161B22",
      text: {
        primary: "#FFFFFF",
        secondary: "#8B949E",
      },
    },
    fonts: {
      heading: "Montserrat",
      body: "Inter",
      code: "JetBrains Mono",
    },
    borderRadius: {
      default: "8px",
      large: "12px",
    },
  },
  token: {
    name: "Httpz",
    symbol: "$Httpz",
    description: "A community-driven token on Mina Protocol",
    maxSupply: 22000000,
    claimLimit: 2200,
  },
  shareOnX: `$Httpz AIRDROP is coming!
I just claimed 2,200 $Httpz @zk_httpz.

Check your eligibility at https://claim.httpz.link
#httpz  #MinaProtocol`,
});
