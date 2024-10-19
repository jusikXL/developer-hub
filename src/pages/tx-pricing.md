---
title: Transaction Pricing
metaTitle: Transaction Pricing | Bakstag
description: Learn transaction cost components.
---

Every transaction using Bakstag has **3** main cost elements: {% .lead %}

1. The **source transaction gas**
2. The [LayerZero fee](https://docs.layerzero.network/v2/developers/evm/technical-reference/tx-pricing) paid to the Security Stack, Executor, and for covering destination transaction gas.
3. The [Bakstag fee](/) paid in offer destination token.

{% callout title="Source Amount" type="note" %}
Note that [createOffer](/create-offer) will also transfer the **source amount** to the [Escrow](/create-offer#escrow). It remains your funds, and you can **cancel the offer** whenever you wish. This allows users to trade assets across chains in a **non-custodial** manner. See [how to cancel offers](/cancel-offer).
{% /callout %}

## Destination Gas Abstraction
The **destination gas costs** are included in the [LayerZero fee](https://docs.layerzero.network/v2/developers/evm/technical-reference/tx-pricing). Users pay this fee in the **source native** or **ZRO token**, which means there’s no need to hold any destination native currency.