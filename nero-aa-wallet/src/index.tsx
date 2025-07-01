// src/index.tsx
import React from 'react'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '@/App'
import {
  ClientProvider,
  ConfigProvider,
  MultiSendProvider,
  NFTProvider,
  PaymasterProvider,
  ScreenManagerProvider,
  SendProvider,
  SendUserOpProvider,
  SignatureProvider,
  TokenProvider,
  TransactionProvider,
  WrapWagmiProvider,
} from '@/contexts'
import { ToastContainer } from 'react-toastify';
import { useSignature, useAAtransfer, useSendUserOp, useConfig } from '@/hooks'
import '@rainbow-me/rainbowkit/styles.css'
import '@/index.css'
import "react-toastify/dist/ReactToastify.css";

// import { Web3AuthProvider } from "@web3auth/modal/react";
// import web3AuthContextConfig from './contexts/Web3AuthContext'
import { WalletConfig } from '@/types'
import { ToastProvider } from './components/ui/toast'

interface SocialWalletProps {
  config: WalletConfig
  zIndex?: number
  children?: React.ReactNode
  mode?: 'sidebar' | 'button'
}

export const SocialWallet: React.FC<SocialWalletProps> = ({
  config,
  zIndex = 9999,
  children,
  mode = 'sidebar',
}) => {
  const queryClient = new QueryClient()

  return (
    // <Web3AuthProvider config={web3AuthContextConfig}>
    <ConfigProvider config={config}>
      <WrapWagmiProvider>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider modalSize='compact'>
            <SignatureProvider>
              <ScreenManagerProvider>
                <PaymasterProvider>
                  <TokenProvider>
                    <NFTProvider>
                      <SendProvider>
                        <MultiSendProvider>
                          <ClientProvider>
                            <SendUserOpProvider>
                              <TransactionProvider>
                                <ToastProvider>
                                  <ToastContainer
                                    position="top-center"
                                    autoClose={5000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="light"
                                  />

                                  {children}
                                  <div style={{ position: 'relative', zIndex: zIndex }}>
                                    <App mode={mode} />
                                  </div>

                                </ToastProvider>
                              </TransactionProvider>
                            </SendUserOpProvider>
                          </ClientProvider>
                        </MultiSendProvider>
                      </SendProvider>
                    </NFTProvider>
                  </TokenProvider>
                </PaymasterProvider>
              </ScreenManagerProvider>
            </SignatureProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WrapWagmiProvider>
    </ConfigProvider>
    // </Web3AuthProvider>
  )
}

export { useAAtransfer, useSignature, useSendUserOp, useConfig }
