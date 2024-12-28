import type { ZkappWrapper } from "../worker/zkappWorker.js";
import type { Remote } from "comlink";
import { wrap } from "comlink";

let zkappService: Remote<ZkappWrapper> | null = null;
let zkappWorker: Worker | null = null;

// Define the response type for better type safety
interface AccountResponse {
  account: {
    publicKey: string;
    token: string;
    nonce: number;
    balance: { total: string };
    tokenSymbol: string;
    receiptChainHash: string;
    timing: {
      initialMinimumBalance: string;
      cliffTime: string;
      cliffAmount: string;
      vestingPeriod: string;
      vestingIncrement: string;
    };
    permissions: {
      editState: boolean;
      access: boolean;
      send: boolean;
      receive: boolean;
      setDelegate: boolean;
      setPermissions: boolean;
      setVerificationKey: {
        auth: boolean;
        txnVersion: string;
      };
      setZkappUri: boolean;
      editActionState: boolean;
      setTokenSymbol: boolean;
      incrementNonce: boolean;
      setVotingFor: boolean;
      setTiming: boolean;
    };
    delegateAccount: { publicKey: string };
    votingFor: string;
    zkappState: string[];
    verificationKey: {
      verificationKey: string;
      hash: string;
    };
    actionState: string[];
    provedState: boolean;
    zkappUri: string;
  };
}

export const useToken = () => {
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();
  const { appState, setNetworkConnected, setUnclaimed, setParticipants } = useStatus();

  const checkRPCEndpointIsOk = async (rpcEndpoint: string) => {
    console.log("checkRPCEndpointIsOk: start");
    const { data, error } = await fetchAccount(
      rpcEndpoint,
      config.public.vaultContractAddress,
      config.public.tokenId
    );
    if (error.value) {
      console.log(error.value);
      return false;
    }

    // check Network Connected
    if (data.value?.account.balance.total) {
      return true;
    }
    return false;
    console.log("checkRPCEndpointIsOk: end");
  };

  const updateSystemStatus = async () => {
    console.log("updateSystemStatus: start");
    const { data, error } = await fetchAccount(
      appState.value.minaEndpoint,
      config.public.vaultContractAddress,
      config.public.tokenId
    );
    if (error.value) {
      console.log(error.value);
    }

    // check Network Connected
    if (data.value?.account.balance.total) {
      setNetworkConnected(true);
      console.log("token symbol: ", data.value.account.tokenSymbol);
      console.log("network connected");
    }

    // check Unclaimed and Participants
    const vaultBalance = Number(data.value?.account.balance.total) / 1e9;
    setUnclaimed(vaultBalance);
    const participants = (appConfig.token.maxSupply - vaultBalance) / appConfig.token.claimLimit;
    setParticipants(participants);

    console.log("updateSystemStatus: end");
  };

  const initZkappService = async () => {
    console.log("useToken: start initTokenService");
    console.time("useToken: initTokenService");

    zkappWorker = new Worker(new URL("../worker/zkappWorker.ts", import.meta.url), {
      type: "module",
    });
    zkappService = wrap<ZkappWrapper>(zkappWorker!);

    // async
    zkappService.initToken(
      appState.value.minaEndpoint,
      config.public.tokenContractAddress,
      config.public.vaultContractAddress
    );

    console.timeEnd("useToken: initTokenService");
    console.log("useToken: end initTokenService");
  };

  const updateZkappEndpoint = async (minaEndpoint: string) => {
    await zkappService?.updateEndpoint(minaEndpoint);
  };

  const checkInitTokenDone = async () => {
    return await zkappService?.checkInitTokenDone();
  };

  const claimTokens = async (userAddress: string) => {
    return await zkappService?.claimTokens(userAddress);
  };

  const accountQuery = (publicKey: string, tokenId: string) => `{
    account(publicKey: "${publicKey}", token: "${tokenId}") {
      publicKey
      token
      nonce
      balance { total }
      tokenSymbol
      receiptChainHash
      timing {
        initialMinimumBalance
        cliffTime
        cliffAmount
        vestingPeriod
        vestingIncrement
      }
      permissions {
        editState
        access
        send
        receive
        setDelegate
        setPermissions
        setVerificationKey {
          auth
          txnVersion
        }
        setZkappUri
        editActionState
        setTokenSymbol
        incrementNonce
        setVotingFor
        setTiming
      }
      delegateAccount { publicKey }
      votingFor
      zkappState
      verificationKey {
        verificationKey
        hash
      }
      actionState
      provedState
      zkappUri
    }
  }
  `;

  const fetchAccount = async (rpcEndpoint: string, publicKey: string, tokenId?: string) => {
    if (!tokenId) {
      tokenId = "wSHV2S4qX9jFsLjQo8r1BsMLH2ZRKsZx6EJd1sbozGPieEC4Jf";
    }
    const query = accountQuery(publicKey, tokenId);

    return await useFetch<AccountResponse>(rpcEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
      transform: (response: any) => {
        if (!response?.data?.account) {
          throw new Error("Failed to fetch account data");
        }
        return response.data;
      },
    });
  };

  return {
    initZkappService,
    updateZkappEndpoint,
    fetchAccount,
    updateSystemStatus,
    claimTokens,
    checkInitTokenDone,
    checkRPCEndpointIsOk,
  };
};
