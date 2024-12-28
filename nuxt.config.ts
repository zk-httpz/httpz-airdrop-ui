const addHeadersPlugin = () => ({
  name: "add-headers",
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Resource-Policy", "same-site");
      res.setHeader("Access-Control-Allow-Origin", "*");
      next();
    });
  },
});

export default defineNuxtConfig({
  ssr: false,

  css: ["~/assets/scss/main.scss"],

  imports: {
    autoImport: true,
  },

  compatibilityDate: "2024-12-10",

  vite: {
    worker: {
      format: "es",
    },
    build: {
      target: "esnext",
    },
    plugins: [addHeadersPlugin()],
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
        define: {
          global: "globalThis",
        },
      },
    },

    server: {
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Resource-Policy": "same-site",
        "Access-Control-Allow-Origin": "*",
      },
      fs: {
        allow: [".."],
      },
    },
    assetsInclude: ["**/*.svg", "**/*.png", "**/*.jpg", "**/*.gif"],

    css: {
      preprocessorOptions: {
        scss: {
          api: "modern",
          additionalData: `
            @use "~/assets/scss/_variables.scss" as *;
            @use "~/assets/scss/_mixins.scss" as *;
          `,
        },
      },
    },
  },

  nitro: {
    esbuild: {
      options: {
        target: "esnext",
      },
    },
    compressPublicAssets: true,
  },

  components: {
    dirs: [
      {
        path: "~/components",
        pathPrefix: false,
      },
      {
        path: "~/components/layout",
        prefix: "",
        pathPrefix: false,
      },
      {
        path: "~/components/status",
        pathPrefix: false,
      },
      {
        path: "~/components/token",
        pathPrefix: false,
      },
      {
        path: "~/components/airdrop",
        pathPrefix: false,
      },
      {
        path: "~/components/claim",
        pathPrefix: false,
      },
      {
        path: "~/components/settings",
        pathPrefix: false,
      },
      {
        path: "~/components/common",
        pathPrefix: false,
      },
    ],
  },

  runtimeConfig: {
    public: {
      tokenContractAddress:
        process.env.HTTPZ_TOKEN_CONTRACT_ADDRESS ||
        "B62qpN6sE9Bg9vzYVfs4ZBajgnv2sobb8fy76wZPB5vWM27s9GgtUTA",
      tokenId: process.env.HTTPZ_TOKEN_ID || "y96qmT865fCMGGHdKAQ448uUwqs7dEfqnGBGVrv3tiRKTC2hxE",
      vaultContractAddress:
        process.env.HTTPZ_VAULT_CONTRACT_ADDRESS ||
        "B62qoyZyFQx2RNHMUwhCRMC23JDW6WL6RTygcD8NMFDAmCnHfaC66Lb",
      minaEndpoint: process.env.MINA_ENDPOINT || "https://api.minascan.io/node/mainnet/v1/graphql",
      siteUrl: process.env.HTTPZ_SITE_URL || "https://claim.httpz.link",
    },
  },

  routeRules: {
    "/**": {
      headers: {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Resource-Policy": "same-site",
        "Access-Control-Allow-Origin": "*",
      },
    },
  },
});
