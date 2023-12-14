import React, { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Toast from "react-native-toast-message";
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

const App = () => {
  return (
    <ThirdwebProvider
      activeChain="mumbai"
      clientId={process.env.EXPO_PUBLIC_TW_CLIENT_ID}
      supportedWallets={[
        metamaskWallet({ recommended: true }),
        rainbowWallet(),
        walletConnect({ recommended: true }),
        embeddedWallet({
          auth: {
            options: ["email", "google"],
            redirectUrl: "rnstarter://",
          },
        }),
        trustWallet(),
        localWallet(),
      ]}
    >
      <Toast />
      <AppInner />
    </ThirdwebProvider>
  );
};

const AppInner = () => {
  const isDarkMode = useColorScheme() === "dark";
  const [amount, setAmount] = useState("");

  const textStyles = {
    color: isDarkMode ? Colors.white : Colors.black,
    ...styles.heading,
  };

  const sdk = useSDK();

  const handleTransfer = async () => {
    if (!sdk) {
      Toast.show({
        type: "error",
        text1: "SDK Initialization",
        text2: "SDK not initialized. Please connect a wallet.",
      });
      return;
    }

    Toast.show({
      type: "info",
      text1: "Transaction Status",
      text2: "Sending transaction...",
      visibilityTime: 0,
      autoHide: false,
      position: "top",
    });

    try {
      const toAddress = "0xCafa93E9985793E2475bD58B9215c21Dbd421fD0"; // Hardcoded recipient address
      await sdk.wallet.transfer(toAddress, amount);
      Toast.hide();
      Toast.show({
        type: "success",
        text1: "Transaction Status",
        text2: "Transfer successful!",
      });
    } catch (error) {
      console.error("Transfer failed:", error);
      Toast.hide();
      Toast.show({
        type: "error",
        text1: "Transaction Status",
        text2: "Transfer failed. See console for details.",
      });
    }
  };

  return (
    <View style={styles.view}>
      <Text style={textStyles}>React Native thirdweb starter</Text>
      <TextInput
        style={styles.input}
        onChangeText={setAmount}
        value={amount}
        placeholder="Amount to Transfer"
        keyboardType="numeric"
      />
      <Button title="Transfer" onPress={handleTransfer} />
      <ConnectWallet />
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    color: "black", // Adjust color as needed
  },
});

export default App;
