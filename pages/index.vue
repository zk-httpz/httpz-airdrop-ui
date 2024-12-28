<template>
  <div class="page-home">
    <div class="container">
      <!-- System Status Section -->
      <section class="status-section">
        <h2 class="section-title">System Status</h2>
        <div class="status-grid">
          <NetworkStatus />
          <ParticipantStatus />
          <UnclaimedStatus />
        </div>
      </section>

      <!-- Airdrop Interface Section -->
      <section class="interface-section">
        <h2 class="section-title">Airdrop Panel</h2>
        <div class="terminal-container">
          <TokenInfo />
          <!-- <AirdropProgress /> -->
          <ClaimInterface @claim="handleClaim" />
        </div>
      </section>
    </div>

    <BaseModal v-model="showSuccessModal" show-close-button :close-on-overlay-click="false">
      <SuccessModal :txn-url="currentTxnUrl" />
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { CHANNEL_NAME, CHANNEL_SIGNAL_INIT_SUCCESS } from "../common/constants.js";

const { updateSystemStatus, initZkappService, checkInitTokenDone, claimTokens } = useToken();
const { error: showError, loading, remove } = useToast();
const config = useRuntimeConfig();

const { appState, setClaimBtnDisabled } = useStatus();
const { getTxnUrl } = useWallet();

const showSuccessModal = ref(false);
const currentTxnUrl = ref('');

onMounted(async () => {
  console.log("index-onMounted: start");

  const minaEndpoint = window.localStorage.getItem("minaEndpoint");
  if (minaEndpoint) {
    appState.value.minaEndpoint = minaEndpoint;
  } else {
    appState.value.minaEndpoint = config.public.minaEndpoint;
  }

  await updateSystemStatus();
  await initZkappService();

  console.log("index-onMounted: end");
});

let loadingId: number;

const handleClaim = async () => {
  console.log("handleClaim: start");
  setClaimBtnDisabled(true);
  loadingId = loading("Proving your claim... It may take a few minutes.", false);

  try {
    const userAddress = appState.value.currAddress!;

    let startClaim = false;
    const channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = async event => {
      console.log("handleClaim: onmessage");
      console.log("event: ", event);
      try {
        if (event.data === CHANNEL_SIGNAL_INIT_SUCCESS) {
          if (!startClaim) {
            console.log("handleClaim: onmessage: startClaim");
            startClaim = true;
            // process claim
            const txJson = await claimTokens(userAddress);
            console.log("onMessage-proving txJson: ", txJson);
            remove(loadingId);
            loadingId = loading("Waiting for the transaction to be signed and broadcast...", false);
            const sendRes = await window.mina?.sendTransaction({
              transaction: txJson,
              feePayer: {
                fee: 0.1,
                memo: "claim httpz token",
              },
            });
            const txnUrl = getTxnUrl(sendRes.hash);
            console.log("txnUrl: ", txnUrl);

            currentTxnUrl.value = txnUrl!;
            showSuccessModal.value = true;

            channel.close();
            remove(loadingId);
            console.log("handleClaim: onmessage: claim done");
          }
        }
      } catch (error: any) {
        console.error(error);
        setClaimBtnDisabled(false);
        remove(loadingId);
        showError("Event: Failed to claim tokens", true);
        showError(error.message, true);
      }
      console.log("handleClaim: onmessage: end");
    };

    const initTokenDone = await checkInitTokenDone();
    if (!initTokenDone) {
      console.log("handleClaim: initTokenDone: false, exit");
      return;
    }
    if (!startClaim) {
      console.log("handleClaim: startClaim");
      startClaim = true;

      console.log("handleClaim: initTokenDone: true, start proving");
      const txJson = await claimTokens(userAddress);
      console.log("proving txJson: ", txJson);
      remove(loadingId);
      loadingId = loading("Waiting for the transaction to be signed and broadcast...", false);
      const sendRes = await window.mina?.sendTransaction({
        transaction: txJson,
        feePayer: {
          fee: 0.1,
          memo: "claim httpz token",
        },
      });
      const txnUrl = getTxnUrl(sendRes.hash);
      console.log("txnUrl: ", txnUrl);

      currentTxnUrl.value = txnUrl!;
      showSuccessModal.value = true;

      channel.close();
      remove(loadingId);
      console.log("handleClaim: end");
    }
  } catch (error: any) {
    console.error(error);
    setClaimBtnDisabled(false);
    remove(loadingId);
    showError("Failed to claim tokens", true);
    showError(error.message, true);
  }
};
</script>

<style lang="scss" scoped>
.page-home {
  padding: 2rem 0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-heading);
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  font-size: 1.25rem;

  .icon {
    width: 20px;
    height: 20px;
  }
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
  }

  @include mobile {
    grid-template-columns: 1fr;
  }
}

.terminal-container {
  @include glass-card;
  background: rgba($color-background, 0.95);
  border: 1px solid rgba($color-primary, 0.1);
  padding: 0;
  overflow: hidden;
}
</style>