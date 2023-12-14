import {
  ConnectWallet,
  embeddedWallet,
  localWallet,
  metamaskWallet,
  rainbowWallet,
  ThirdwebProvider,
  trustWallet,
  walletConnect,
  useSDK,
} from "@thirdweb-dev/react-native";
import React, { useState } from "react";
import { Button, StyleSheet, Text, useColorScheme, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";

const App = () => {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId={process.env.EXPO_PUBLIC_TW_CLIENT_ID}
      supportedWallets={[
        metamaskWallet({
          recommended: true,
        }),
        rainbowWallet(),
        walletConnect({
          recommended: true,
        }),
        embeddedWallet({
          auth: {
            // you need to enable EmbeddedWallets under your API Key in your thirdweb dashboard:
            // https://thirdweb.com/dashboard/settings/api-keys
            options: ["email", "google"],
            // you need to add this deeplink in your allowed `Redirect URIs` under your API Key in your thirdweb dashboard:
            // https://thirdweb.com/dashboard/settings/api-keys
            redirectUrl: "rnstarter://",
          },
        }),
        trustWallet(),
        localWallet(),
      ]}
    >
      <AppInner />
    </ThirdwebProvider>
  );
};

const AppInner = () => {
  const isDarkMode = useColorScheme() === "dark";
  const [transferStatus, setTransferStatus] = useState("");

  const textStyles = {
    color: isDarkMode ? Colors.white : Colors.black,
    ...styles.heading,
  };

  const sdk = useSDK();

  const handleTransfer = async () => {
    if (!sdk) {
      setTransferStatus("SDK not initialized. Please connect a wallet.");
      return;
    }

    try {
      const toAddress = "0xCafa93E9985793E2475bD58B9215c21Dbd421fD0"; // Replace with actual recipient address
      const amount = "0.01"; // Replace with the amount to transfer
      const data = await sdk.wallet.transfer(toAddress, amount);
      setTransferStatus("Transfer successful!");
    } catch (error) {
      console.error("Transfer failed:", error);
      setTransferStatus("Transfer failed. See console for details.");
    }
  };

  return (
    <View style={styles.view}>
      <Text style={textStyles}>React Native thirdweb starter</Text>
      <ConnectWallet />
      <Button title="Transfer" onPress={handleTransfer} />
      <Text>{transferStatus}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
    padding: 10,
  },
});

export default App;
