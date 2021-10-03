import React from 'react'
import { useMetamask } from "use-metamask"

/**
 * Wrapper that allows using metamask in ssr
 */
export default function useMetamaskWrapper() {
  const isWebBrowser = typeof window !== "undefined"
  if (isWebBrowser) {
    return useMetamask()
  } else {
    return {
      connect: async () => null,
      metaState: {}
    }
  }
}