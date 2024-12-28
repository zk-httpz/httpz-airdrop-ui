import type * as o1js from "o1js";
import type { FungibleToken, VaultContract } from "mina-httpz-token";
import { expose } from "comlink";
import { CHANNEL_NAME, CHANNEL_SIGNAL_INIT_SUCCESS } from "../common/constants.js";

let o1jsModule: typeof o1js;
let mina: typeof o1js.Mina;

let tokenContract: FungibleToken;
let vaultContract: VaultContract;

let channel: BroadcastChannel | null = null;
let initTokenDone = false;

const zkappWrapper = {
  initToken: async (
    minaEndpoint: string,
    tokenContractAddress: string,
    vaultContractAddress: string
  ) => {
    console.log("start initToken");

    if (initTokenDone) {
      return;
    }

    channel = new BroadcastChannel(CHANNEL_NAME);

    console.log("start load o1js");
    o1jsModule = await import("o1js");
    console.log("end load o1js");
    const { PublicKey, Mina } = o1jsModule;

    mina = Mina;

    let network = Mina.Network({
      networkId: "mainnet" as o1js.NetworkId,
      mina: minaEndpoint,
    });
    mina.setActiveInstance(network);

    console.log("start load mina-httpz-token");
    const { FungibleToken, VaultContract } = await import("mina-httpz-token");
    console.log("end load mina-httpz-token");

    tokenContract = new FungibleToken(PublicKey.fromBase58(tokenContractAddress));
    const tokenId = tokenContract.deriveTokenId();
    console.log("tokenId: ", tokenId.toString());
    vaultContract = new VaultContract(PublicKey.fromBase58(vaultContractAddress), tokenId);

    console.log("start compile TokenContract");
    const { verificationKey: tokenContractVk } = await FungibleToken.compile();
    console.log("tokenContract vk hash:", tokenContractVk.hash.toString());
    console.log("end compile TokenContract");

    console.log("start compile VaultContract");
    const { verificationKey: vaultContractVk } = await VaultContract.compile();
    console.log("vaultContract vk hash:", vaultContractVk.hash.toString());
    console.log("end compile VaultContract");

    channel.postMessage(CHANNEL_SIGNAL_INIT_SUCCESS);
    initTokenDone = true;

    console.log("end initToken");
  },

  checkInitTokenDone: () => {
    return initTokenDone;
  },

  updateEndpoint: async (minaEndpoint: string) => {
    console.log("start updateEndpoint");

    const { Mina } = o1jsModule;
    let network = Mina.Network({
      networkId: "mainnet" as o1js.NetworkId,
      mina: minaEndpoint,
    });
    mina.setActiveInstance(network);
    console.log("end updateEndpoint");
  },

  claimTokens: async (userAddress: string) => {
    console.log("start claimTokens");
    const { Mina, AccountUpdate, PublicKey, fetchAccount } = o1jsModule;
    const userPublicKey = PublicKey.fromBase58(userAddress);
    const tokenId = tokenContract.deriveTokenId();
    await fetchAccount({ publicKey: userAddress });
    await fetchAccount({ publicKey: tokenContract.address });
    await fetchAccount({ publicKey: vaultContract.address, tokenId });
    let tx = await Mina.transaction({ sender: userPublicKey, fee: 0.1 * 1e9 }, async () => {
      AccountUpdate.fundNewAccount(userPublicKey, 1);
      const userAU = await vaultContract.claim(userPublicKey);
      await tokenContract.approveAccountUpdates([vaultContract.self, userAU]);
    });
    await tx.prove();

    console.log("end claimTokens");

    return tx.toJSON();
  },
};

expose(zkappWrapper);

export type ZkappWrapper = typeof zkappWrapper;
