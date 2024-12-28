export const useWallet = () => {
  const isModalOpen = ref(false);
  const { success, error: showError } = useToast();
  const { setCurrAddress, appState, setClaimBtnDisabled } = useStatus();
  const { fetchAccount } = useToken();
  const config = useRuntimeConfig();
  const appConfig = useAppConfig();

  const openModal = () => {
    isModalOpen.value = true;
  };

  const closeModal = () => {
    isModalOpen.value = false;
  };

  const shareOnX = () => {
    const text = appConfig.shareOnX;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank");
  };

  const getTxnUrl = (txnHash: string) => {
    return `https://minascan.io/mainnet/tx/${txnHash}?type=zk-tx`;
  };

  // Handle network switch
  const handleNetworkSwitch = async () => {
    try {
      // 先获取当前网络
      const network = await (window as any).mina.requestNetwork();

      // 只有当不是 mainnet 时才切换
      if (network.networkID !== "mina:mainnet") {
        showError("Please switch to mainnet");
        await (window as any).mina.switchChain({ networkID: "mina:mainnet" });
      }
    } catch (err: any) {
      console.error("Failed to switch network:", err);
      if (err.code === 1002) {
        showError(
          "You rejected the request to switch to mainnet. Please allow network switch and try again"
        );
      } else if (err.code === 20005) {
        showError(
          "There is an ongoing network switch operation. Please wait for it to complete and try again"
        );
      } else {
        showError("Failed to switch network. Please check wallet connection and try again");
      }
    }
  };

  // Handle account changes
  const handleAccountsChanged = (accounts: string[]) => {
    if (Array.isArray(accounts) && accounts.length > 0) {
      setCurrAddress(accounts[0]);
    }
  };

  const connectWallet = async () => {
    try {
      if (!(window as any).mina) {
        window.open("https://www.aurowallet.com/", "_blank");
        return;
      }

      // Try to switch to mainnet first if needed
      await handleNetworkSwitch();

      // Connect wallet after successful network switch
      const accounts = await (window as any).mina.requestAccounts();
      handleAccountsChanged(accounts);
      if (appState.value.currAddress !== null) {
        success("Wallet connected successfully");
      }

      const { data } = await fetchAccount(
        appState.value.minaEndpoint,
        appState.value.currAddress!,
        config.public.tokenId
      );
      if (data.value && data.value.account.nonce) {
        showError("You are not eligible for this airdrop", true);
      } else {
        setClaimBtnDisabled(false);
        success("Congratulations! You are eligible for this airdrop");
      }
    } catch (err) {
      console.error("Failed to connect wallet:", err);
      showError("Failed to connect wallet. Please check wallet status and try again");
    }
  };

  const disconnectWallet = () => {
    setCurrAddress(null);
    success("Wallet disconnected successfully");
  };

  // Setup event listeners
  onMounted(() => {
    if ((window as any).mina) {
      (window as any).mina.on("chainChanged", handleNetworkSwitch);
      (window as any).mina.on("accountsChanged", handleAccountsChanged);
    }
  });

  return {
    isModalOpen,
    openModal,
    closeModal,
    connectWallet,
    disconnectWallet,
    getTxnUrl,
    shareOnX,
  };
};
