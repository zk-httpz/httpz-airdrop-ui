export type AppState = {
  currAddress: string | null;
  minaEndpoint: string;
  participants: number | null;
  unclaimed: number | null;
  networkConnected: boolean | null;
  claimBtnDisabled: boolean;
};

export const useStatus = () => {
  const appState = useState<AppState>("appState", () => {
    return {
      currAddress: null,
      minaEndpoint: "",
      participants: null,
      unclaimed: null,
      networkConnected: null,
      claimBtnDisabled: true,
    };
  });

  const setCurrAddress = (address: string | null) => {
    appState.value.currAddress = address;
  };

  const setMinaEndpoint = (minaEndpoint: string) => {
    window.localStorage.setItem("minaEndpoint", minaEndpoint);
    appState.value.minaEndpoint = minaEndpoint;
  };

  const setParticipants = (participants: number | null) => {
    appState.value.participants = participants;
  };

  const setUnclaimed = (unclaimed: number | null) => {
    appState.value.unclaimed = unclaimed;
  };

  const setNetworkConnected = (networkConnected: boolean | null) => {
    appState.value.networkConnected = networkConnected;
  };

  const setClaimBtnDisabled = (claimBtnDisabled: boolean) => {
    appState.value.claimBtnDisabled = claimBtnDisabled;
  };

  return {
    appState,
    setCurrAddress,
    setMinaEndpoint,
    setParticipants,
    setUnclaimed,
    setNetworkConnected,
    setClaimBtnDisabled,
  };
};
