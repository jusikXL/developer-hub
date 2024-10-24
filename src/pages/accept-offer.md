---
title: Accept Offer
metaTitle: Accept Offer | Bakstag
description: Learn how Offer is accepted.
---

After the offer is created, it can be accepted by the buyer. On this page, we'll go over the process of accepting the offer. {% .lead %}

{% callout title="Cross-Chain Offer Flow: Source and Destination Chains" type="note" %} 
The offer is initiated on what is referred to as the **source chain** and, in the case of a cross-chain offer, is accepted on the **destination chain**. In this process, the buyer purchases the **source chain** token, making payment with the token of the **destination chain**. 
{% /callout %}

## Accepting Process

### **1. Accept Offer Parameters.**

First, the buyer must specify which offer to accept by providing the offer ID.

Additionally, the **buyer** must specify the **source token** amount to be purchased, as the Bakstag Protocol supports fractional offer acceptance. The amount should be expressed in [shared decimals](/token-precision#shared-decimal-system).

Finally, the buyer needs to provide the address of his account in **source chain**. The **source tokens** will be transferred into this account.

Namely, buyer must provide:

- **Offer ID:** The unique identifier of the offer
- **Source Amount:** The amount of **source token** to be purchased.
- **Source Buyer Address:** The address for receiving the purchased tokens.

{% diagram %}
{% node %}
{% node label="Accept Offer Parameters" /%}
{% node label="Offer ID" /%}
{% node label="Source Amount" theme="purple" /%}
{% node label="Source Buyer Address" theme="red" /%}
{% /node %}
{% /diagram %}

The **destination token** will be transferred from the **signer** of the transaction.

### **2. Quote.**

The next step is to call `quote` that provides:

- **LayerZero Messaging Fee** - the fee required by LayerZero.
- **Accept Offer Receipt** - includes protocol fee and the **destination token** amount.
  {% diagram %}
  {% node %}
  {% node label="Accept Offer Receipt" /%}
  {% node label="Destination token amount" /%}
  {% node label="Protocol Fee" theme="purple" /%}
  {% /node %}
  {% /diagram %}

The quote is a view (read) function, so calling it incurs no cost. The **Destination token amount** is the total amount the buyer would spend, by accepting the offer. This amount is calculated automatically using the **exchange rate** stored in the offer. The **Protocol fee** would be taken from **destination token amount** and transferred to the [**treasury**](/accept-offer#treasury), while the remaining part would be transferred to the **destination seller address**.

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

### **3. Validation of Offer Accept Transaction**

The `quoteAcceptOffer` validates the transaction.If the transaction is invalid, it will be reverted.
Transaction is invalid in case of:
- **InvalidEid:** Buyer attempts to accept the offer from the wrong chain—i.e., from the **source chain** instead of the **destination chain**.
- **ExcessiveAmount:** Available **Source token amount** is exceeded
- **NonexistentOffer:**  Invalid **offerId** is provided

### **4. Approve.**

If the **destination token** is not native, e.g., USDC (Base), buyer has to **approve** the OTC Market to transfer the **destination tokens**. The approval amount is taken form the **Accept Offer Receipt**.

### **5. Accept.**

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

#### **Accepting monochain offer**

In case of accepting **monochain** offer, the **destination** OTC market would be also the **source** OTC market. So it will:

- **Validate Accept Offer:** Verify if the transaction is [valid](/accept-offer#3-validation-of-offer-accept-transaction)
- **Update Offer source amount:** Update the **source token amount** available to accept for next buyers.
- **Emit event:** Log `OfferAccepted` event notifying offchain workers.
- **Transfer destination token:** Transfer **protocol fee** to **treasury** and remainings to **destination seller address**
- **Transfer source token:** Transfer **protocol fee** to **treasury** and remaining amount to **destination seller address**

#### **Accepting cross-chain offer**


While accepting the **cross-chain** offer, OTC market will:

- **Validate Accept Offer:** Verify if the transaction is [valid](/accept-offer#3-validation-of-offer-accept-transaction)
- **Update Offer source amount:** Update the **source token amount** available to accept for next buyers.
- **Emit event:** Log `OfferAccepted` event notifying offchain workers.
- **Transfer destination token:** Transfer **protocol fee** to **treasury** and remaining amount to **destination seller address**
- **Send cross-chain message:** Build and send `OfferAccepted` message to the **source chain** OTC Market.

After the **cross-chain message** is delivered, based on **source chain**, the **source chain** OTC market will:

- **Update Offer source amount:** Update the **source token amount** available to accept.
- **Emit event:** Log `OfferAccepted` event notifying offchain workers.
- **Transfer source tokens:** Transfer the proper source token amount to **source buyer address**

{% figure src="/assets/bakstag/accept-offer.svg" alt="Offer acceptance process" caption="Offer acceptance" /%}

Bakstag currently maintains a **duplicate** storage of offers, so the **source token amount** should be decreased on both **source** and **destination** chains.

## Treasury

The Treasury is a multi signature account used to store all collected fees, managed by DAO in the future.
