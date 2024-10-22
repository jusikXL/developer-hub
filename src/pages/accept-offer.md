---
title: Accept Offer
metaTitle: Accept Offer | Bakstag
description: Learn how Offer is accepted.
---

After the offer is created, it can be accepted by the buyer. On this page, we'll go over the process of accepting the offer. {% .lead %}

{% callout title="Cross-Chain Offer Flow: Source and Destination Chains" type="note" %} The offer is initiated on what is referred to as the "source chain" and, in the case of a cross-chain offer, is accepted on the "destination chain." In this process, the buyer purchases the source chain's token, making payment with the token of the destination chain. {% /callout %}

## Accepting Process

### **1. Accept Offer Parameters.**

First, the buyer must specify which offer to accept by providing the corresponding offer ID.

Additionally, the acceptance amount must be defined, as the Bakstag Protocol allows offers to be accepted in fractional amounts. Therefore, the buyer must indicate the amount of the source token they wish to receive, expressed in shared decimals.

Finally, the buyer needs to provide their address on the source chain where the offer was created.

Namely, buyer must provide:

- **Offer ID:** The unique identifier of the offer
- **Source Amount:** The amount of source token for which the offer will be accepted.
- **Source Buyer Address:** The address where the buyer will receive the purchased assets.

{% diagram %}
{% node %}
{% node label="Accept Offer Parameters" /%}
{% node label="Offer ID" theme="red" /%}
{% node label="Source Amount" theme="green" /%}
{% node label="Source Buyer Address" theme="blue" /%}
{% /node %}
{% /diagram %}

The destination buyer address, from which the **destination token** will be deducted, is automatically determined by the OTC market as the signer of the transaction.

### **2. Quote.**

The next step is to call quote that provides:

- **LayerZero Messaging Fee** - the fee required by LayerZero.
- **Accept Offer Receipt** - includes protocol fee and the **destination token** amount.
  {% diagram %}
  {% node %}
  {% node label="Accept Offer Receipt" /%}
  {% node label="Destination token amount" /%}
  {% node label="Protocol Fee" theme="purple" /%}
  {% /node %}
  {% /diagram %}

The quote is a view (read) function, so calling it incurs no cost. The **Destination token** amount is the total amount the buyer would spend, by accepting the offer. This amount is calculated automaticly using the **exchange rate** stored in the offer. The **Protocol fee** would be taken from **destination token** amount and transferred to the [**treasury**](/accept-offer#treasury), while the remaining part would be transferred to the **destination seller address**.

{% dialect-switcher title="Quote accept offer interface" %}
{% dialect title="Solidity" id="solidity" %}

```solidity
function quoteAcceptOffer(
    bytes32 _dstBuyerAddress,
    AcceptOfferParams calldata _params,
    bool _payInLzToken
) external returns (MessagingFee memory fee, AcceptOfferReceipt memory acceptOfferReceipt);
```

{% /dialect %}
{% /dialect-switcher %}

- **Pay in LayerZero Token:** Decide whether to cover LayerZero fee in native or ZRO token.

The transaction will revert if the buyer attempts to accept the offer from the wrong chain—i.e., from the source chain instead of the destination chain. Similarly, it will revert in cases of ExcessiveAmount (when the specified acceptance amount exceeds the available amount in the offer) or NonexistentOffer (if an invalid offer ID is provided).

### **3. Approve.**

If the **destination token** is not native, e.g., USDC (Base), buyer has to **approve** the OTC Market to transfer the destination tokens. The approval amount is taken form the **Accept Offer Receipt**.

### **4. Accept.**

Finally, invoke `acceptOffer`.

{% dialect-switcher title="Accept offer interface" %}
{% dialect title="Solidity" id="solidity" %}

```solidity
function acceptOffer(
    AcceptOfferParams calldata _params,
    MessagingFee calldata _fee
) external payable returns (MessagingReceipt memory msgReceipt, AcceptOfferReceipt memory acceptOfferReceipt);
```

{% /dialect %}
{% /dialect-switcher %}

Calling `acceptOffer` will return **LayerZero Messaging Receipt** and **Create Offer Receipt**.

#### 1. Accepting cross-chain offer

While accepting the **cross-chain** offer, OTC market will:

- **Validate Accept Offer:** Verify the existence of the offer. Ensure that the offer is being accepted from the correct chain, specifically the destination chain (not the source chain), validate that the acceptance amount does not exceed the available amount.
- **Update Offer source amount:** Update the **source token amount** avaliable to accept for next buyers.
- **Emit event:** Log `OfferAccepted` event notifying offchain workers.
- **Transfer destination token:** Transfer **protocol fee** to **treasury** and remaining amount to **destination seller address**
- **Send cross-chain message:** Build and send `OfferAccepted` message to the **source chain** OTC Market.

After the **cross-chain message** is delivered, based on **source chain**, the **source chain** OTC market will:

- **Update Offer source amount:** Update the **source token amount** available to accept.
- **Emit event:** Log `OfferAccepted` event notifying offchain workers.
- **Transfer source tokens:** Transfer the proper source token amount to **source buyer address**

#### 2. Accepting monochain offer

In case of accepting **monochain** offer, the **destination** OTC market would be also the **source** OTC market. So it will:

- **Validate Accept Offer:** Verify the existence of the offer, validate that the acceptance amount does not exceed the available amount.
- **Update Offer source amount:** Update the **source token amount** available to accept for next buyers.
- **Emit event:** Log `OfferAccepted` event notifying offchain workers.
- **Transfer destination token:** Transfer **protocol fee** to **treasury** and remainings to **destination seller address**
- **Transfer source token:** Transfer **protocol fee** to **treasury** and remaining amount to **destination seller address**

{% figure src="/assets/bakstag/accept-offer.svg" alt="Offer acceptance process" caption="Offer acceptance" /%}

Bakstag currently maintains a **duplicate** storage of offers, so the **source token amount** should be decreased on both **source** and **destination** chains.

## Treasury

The Treasury is a multi signature account used to store all collected fees, managed by DAO in the future.
