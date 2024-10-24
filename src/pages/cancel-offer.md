---
title: Cancel Offer
metaTitle: Cancel Offer | Bakstag
description: Learn how Offer is canceled.
---

The lifecycle of an offer finishes with its cancellation. In this section, we will cover the process of canceling an offer. {% .lead %}

## Monochain Cancelling Process

In a monochain scenario, offer cancellation is a straightforward procedure. Essentially, only two actions are required:

- **Unlocking source token:** The **source tokens**, that **seller** have freezed while creating the offer, must be refunded.
- **Delete the offer:** The offer must be deleted from the **offers** mapping.

{% callout title="Cancellation authority" type="note" %} Only the **seller** who created the offer has the authority to cancel it. {% /callout %}

In order to cancel the offer, **seller** has to invoke method `cancelOffer`.

{% dialect-switcher title="Cancel offer interface" %}
{% dialect title="Solidity" id="solidity" %}

```solidity
function cancelOffer(
    bytes32 _offerId,
    MessagingFee calldata _fee,
    bytes calldata _extraSendOptions
) external payable returns (MessagingReceipt memory msgReceipt);
```

{% /dialect %}
{% /dialect-switcher %}

About the parameters of this method:

- **offerId:** The ID of the offer to be canceled
- **fee:** The **Layer Zero** fee, that would be zero in the monochain offer case
- **extraSendOptions:** Options required for **Layer Zero** cross-chain transaction. In monochain case would be empty.

Upon calling the `cancelOffer` method, the OTC marker will:
- **Validate data:** The OTC market will verify whether the offer exists, if the cancellation is being initiated from the **source chain**, and if the **signer** has the authority to cancel the offer.
- **Unlock the assets:** The **source token** from [Escrow](/create-offer#escrow) well be transferred to **seller** account
- **Delete the offer:** Offer will be deleted from the **offers** mapping.

## Cross-chain Cancelling Process

{% callout title="Cross-Chain Offer Flow: Cancel offer" type="note" %} In the current version of the Bakstag Protocol, the cancellation process starts in the **source chain** OTC market. To ensure that the offer has been successfully canceled on the **destination chain**, the cancellation process is designed in type of **ABA** cross-chain transaction. [Here](/cancel-offer#4-problematic) is the reason why **ABA** type transaction is required for the cancellation. {% /callout %}

Cross-chain offer cancellation is slitted into 2 cross-chain messages:

- **Cancel Offer Order:** Message from the offer **source chain** to **destination chain**, ordering **destination** OTC to delete the offer.
- **Offer Canceled:** Message from the  **destination chain** OTC to **source chain** informing that the offer is successfully deleted in **destination chain** OTC and now can be deleted on **source chain** one.

Since the cancellation of a cross-chain offer involves two transactions, the `quote` method must be called twice — once on the **destination chain** and once on the **source chain**.

### **1. Quote on the destination chain**

Firstly, `quoteCancelOffer` should be invoked on the **destination chain** OTC, in order to quote sending the **Offer Canceled** message.

{% dialect-switcher title="Quote cancel offer interface" %}
{% dialect title="Solidity" id="solidity" %}

```solidity
function quoteCancelOffer(bytes32 _offerId) external returns (MessagingFee memory fee);
```

{% /dialect %}
{% /dialect-switcher %}

The quote is a view (read) function, so calling it incurs no cost.

The only required parameter is **offerId** — ID of the offer to be canceled.

The `quoteCancelOffer` returns the `returnFee` — **Layer Zero fee**, required to send the **Offer Canceled** message. `returnFee` will be useful in the following step.

### **2. Building Extra Send Options**

**Extra send options** are required in order to invoke the `quoteCancelOfferOrder` method on the **source chain** OTC market.

{% dialect-switcher title="Building extra send options" %}
{% dialect title="Solidity" id="solidity" %}

```solidity
import { OptionsBuilder } from "@layerzerolabs/lz-evm-oapp-v2/contracts/oapp/libs/OptionsBuilder.sol";

extraSendOptions = OptionsBuilder.newOptions().addExecutorLzReceiveOption(0, uint128(returnFee.nativeFee));
```

{% /dialect %}

{% dialect title="TypeScript" id="sypescript" %}

```typescript
import { Options } from '@layerzerolabs/lz-v2-utilities'

const extraOptions = Options.newOptions()
  .addExecutorLzReceiveOption(0, returnFee.nativeFee)
  .toBytes()
```

{% /dialect %}
{% /dialect-switcher %}

To build `extraSendOptions` the `returnFee` form the [previous step](/cancel-offer#1-quote-on-the-destination-chain) is required.

### **2. Quote on the source chain**

After computing the `extraSendOptions`, the `quoteCancelOfferOrder` can be invoked.

{% dialect-switcher title="Quote cancel offer order interface" %}
{% dialect title="Solidity" id="solidity" %}

```solidity
function quoteCancelOfferOrder(
    bytes32 _srcSellerAddress,
    bytes32 _offerId,
    bytes calldata _extraSendOptions,
    bool _payInLzToken
) external returns (MessagingFee memory fee);
```

{% /dialect %}
{% /dialect-switcher %}

The required parameters are:
- **srcSellerAddress:** address of the **signer** of future `cancelOffer` transaction. 
- **offerId:** ID of the offer to be canceled
- **extraSendOptions:** The built [earlier](/cancel-offer#2-building-extra-send-options) `extraSendOptions`.
- **payInLzToken:** Decide whether to cover LayerZero fee in native or ZRO token.

The `quoteCancelOfferOrder` is a view (read) function, so calling it incurs no cost. 

`quoteCancelOfferOrder` returns the `fee` required for the main `cancelOffer` method.

### **3. Cancel**

On **source chain** OTC market the method `cancelOffer` should be invoked. The interface of this method can be seen [here](/cancel-offer#monochain-cancelling-process).

The `fee` from the [source chain quote](/cancel-offer#2-quote-on-the-source-chain) is required in this context, as well as `extraSendOptions` parameter built [earlier](/cancel-offer#2-building-extra-send-options).

While canceling the cross-chain offer, the OTC market will:

- **Validate data:** The OTC market will verify whether the offer exists, if the cancellation is being initiated from the **source chain**, and if the **signer** has the authority to cancel the offer.
- **Send Cancel Offer Order message** Send the `CancelOfferOrder` cross-chain message to the **destination chain** OTC market.

Once the `Cancel Offer Order` message was delivered to the **destination chain** OTC market, it will:

- **Cancel the offer:** Delete offer from the **offers** mapping.
- **Emit Event:** Log `OfferCanceled` event notifying offchain workers.
- **Send Offer Canceled message:** Send the `OfferCanceled` cross-chain message to the **source chain** OTC market.

When the `Offer Canceled` message, the OTC market will:

- **Cancel the offer:** Delete offer from the **offers** mapping.
- **Emit Event:** Log `OfferCanceled` event notifying offchain workers.

{% figure src="/assets/bakstag/cancel-offer.svg" alt="Offer cancellation process" caption="Offer acceptance" /%}

### **4. Problematic**
#### **Offer is Accepted and Canaled simultaneously**
As previously mentioned, the Bakstag Protocol currently maintains a **duplicate** storage of offers. Therefore, to cancel an offer, it must be removed in both the **source** and **destination chains** OTC markets. Likewise the `cancelOffer` request should come from **source chain** OTC market

The simplest way to cancel the offer is:
1. **Cancel on source chain**
2. **Cancel on destination chain**
   
But this implementation has a problem:

Let’s consider a scenario where an offer **source chain** is `A` and **destination chain** is `B`. The offer is being canceled on chain `A` while simultaneously being accepted on chain `B`. Here’s what would happen:

1. - **`A` OTC market:** Offer is canceled
   - **`B` OTC market:** Offer is accepted 
---
2. - **`A` OTC market:** Offer is deleted from the mapping and the assets are returned to the **seller**
   - **`B` OTC market:** Offer is updated, **destination token** transferred from the **buyer** account to **destination seller address** and **treasury**
---
3. - **`A` OTC market:** `OfferCanceled` cross-chain message send to **destination chain** OTC market.
   - **`B` OTC market:** `OfferAccepted` cross-chain message send to **source chain** OTC market.
---
4. - **`A` OTC market:** `OfferAccepted` message received, but **offer** no longer exist on this OTC marked, so **source token** can not be transferred to **source buyer address**
   - **`B` OTC market:** Offer Canceled message received, the offer deleted from mapping.


The example above illustrates a simple cross-chain transaction is insufficient for canceling an offer.

Now, let’s consider the same scenario but using the Cancel Offer implementation currently employed in the Bakstag Protocol:

1. - **`A` OTC market:** Offer is canceled
   - **`B` OTC market:** Offer is accepted 
---
2. - **`A` OTC market:** `CancelOfferOrder` cross-chain message is sent to **destination chain** OTC market.
   - **`B` OTC market:** Offer is updated, **destination token** transferred from the **buyer** account to **destination seller address** and **treasury**. `OfferAccepted` cross-chain  message send to **source chain** OTC market.
---
3. - **`A` OTC market:** `OfferAccepted` message received, **source token** transferred to **source buyer address**
   - **`B` OTC market:** `CancelOfferOrder` message received, offer deleted from the mapping, `OfferCanceled` cross-chain message sent back to **source chain** OTC market.
---
4. - **`A` OTC market:** `OfferCanceled` message received the offer deleted from the mapping, **source token** transferred to **source seller address**

#### **Not enough gas for sending `OfferCanceled` message**

The ABA-type transaction introduces another potential issue. The **seller** specifies the amount of gas available for executing the transaction on the **destination chain** by providing the `extraSendOptions` parameter. What happens if the **seller** specifies an insufficient amount of gas to process the `CancelOfferOrder` message on the **destination** OTC market?

The answer is straightforward — nothing critically wrong would occur. If there isn't enough gas to process the `CancelOfferOrder` and send the `OfferCanceled` message back to the **source chain** OTC market, the transaction would revert on **destination chian**. As a result, the **offer** would not be removed from either the **source chain** or the **destination chain** OTC markets.
