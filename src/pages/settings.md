---
title: Core settings
metaTitle: Core settings | Bakstag
description: Learn about core settings
---

Core settings are configured during the initialization phase of the OTC market. In this section, we will review all the required parameters needed to set up the OTC market. {% .lead %}

## OTC market constructor parameters

In order to set un the Bakstag OTC market, the next parameters are needed to be provided:
- **NativeDecimals:** The number of decimals used by the native currency in the chain, where OTC market exists.
- **Treasury:** The [treasury](/accept-offer#treasury) account address.
- **Endpoint:** Layer Zero endpoint [address](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts)
- **Delegate:** The initial delegate of the OTC market

## Delegate authority
The delegate serves as an administrator of the OTC market, with the authority to modify its settings. Specifically, the delegate can:
- **Update treasury:** Change the [treasury](/accept-offer#treasury) address.
- **LayerZero configuration:** Add or remove other OTC markets with which this OTC market can exchange the **offers**. Update **EnforcedOptions**, needed for sending **cross-chain** messages.

In the future, delegate will be able to affect the **protocol fee**.