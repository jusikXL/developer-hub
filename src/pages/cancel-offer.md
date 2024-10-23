---
title: Cancel Offer
metaTitle: Cancel Offer | Bakstag
description: Learn how Offer is canceled.
---

The lifecycle of an offer finishes with its cancellation. In this section, we will cover the process of canceling an offer. {% .lead %}

## Monochain Cancelling Process

In a monochain scenario, offer cancellation is a straightforward procedure. Essentially, only two actions are required:

- **Unlocking source token:** The source token, that seller have freezed while creating the offer, is needed to be returned back to the seller.
- **Removing the offer:** After assets were returned, the offer needs to be removed from the **offers** mapping.

{% callout title="Cancellation authority" type="note" %} Only the seller who created the offer has the authority to cancel it. {% /callout %}

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

About the parametrs of this method:

- **offerId:** The ID of the offer to be canceled. The **signer** address must be the **source seller address** of this offer.
- **fee:** The **Layer Zero** fee, that would be zero for in monochain
- **extraSendOptions:** Options required for **Layer Zero** ABA cross-chain transaction. In monochain case would be ampty.

Upon calling the `cancelOffer` method, the following actions will occur:

- **Validation:** The OTC market will verify whether the offer exists, if the cancellation is being initiated from the **sorce chain**, and if the **signer** has the authority to cancel the offer.
- **Unlocking the assets:** The locked assets from [Escrow](/create-offer#escrow) would be transferred to **seller** account
- **Deleting the offer:** OTC market will delete the offer.

## Crosschain Cancelling Process

{% callout title="Cross-Chain Offer Flow: Cancel offer" type="note" %} In the current version of the Bakstag Protocol, offers are canceled from their source chain. To ensure that the offer has been successfully canceled on the destination chain, the cancellation process is designed of type of **ABA** cross-chain transaction. {% /callout %}

Cross-chain offer cancellation is slitted into 2 cross-chain messages:

- **Cancel Offer Order:** Message from the offer **source chain** to **destination chain**, which tells the **destination** OTC to delete the offer.
- **Offer Canceled:** Message from the offer **destination chain** to **source chain** saying that the offer is already removed on **destination** OTC and now can be removed on **source** one.

Since the cancellation of a cross-chain offer involves two transactions, the `quote` method must be called twice — once on the **destination chain** and once on the **source chain**.

### **1. Quote on the destination chain**

Firstly, to send the **Offer Canceled** message form **destination** OTC to **source** one, the `quoteCancelOffer` should be invoked on the **destination** OTC.

{% dialect-switcher title="Quote cancel offer interface" %}
{% dialect title="Solidity" id="solidity" %}

```solidity
function quoteCancelOffer(bytes32 _offerId)       external returns (MessagingFee memory fee);
```

{% /dialect %}
{% /dialect-switcher %}

The quote is a view (read) function, so calling it incurs no cost. The only parameter of it requires is **offerId**, which is an ID of the offer to be canceled.
The `quoteCancelOffer` returns the **Layer Zero fee**, needed to send the **Offer Canceled** message to **source** OTC.

### **2. Building Extra Send Options**

**Extra send options** are required in order to invoke the `quoteCancelOfferOrder` method on the **source** OTC market.

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

The **returnFee** is the fee that was ruturned by [invoking `quoteCancelOffer`](/cancel-offer#1-quote-on-the-destination-chain).

### **2. Quote on the source chain**

After computing **extra send options**, the `quoteCancelOfferOrder` can be invoked.

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

- **srcSellerAddress:** address of the future **signer**, it should be the same as **source seller address**, because only **seller** can cancel the offer.
- **offerId:** ID of the offer to be canceled
- **extraSendOptions:** The extra send options [builded before](/cancel-offer#2-building-extra-send-options).
- **payInLzToken:** Decide whether to cover LayerZero fee in native or ZRO token.

The `quoteCancelOfferOrder` is a view (read) function, so calling it incurs no cost. It returns the final `fee` required for the main `cancelOffer` method.

### **3. Cancel**

Finally, we are ready to cancel the offer. On **source chain** OTC market the method `cancelOffer` should be invoked. The interface of this method can be seen [here](/cancel-offer#monochain-cancelling-process).

Since the offer is cross-chain, the **fee** parameter will not be zero. The fee from the [source chain quote](/cancel-offer#2-quote-on-the-source-chain) is required in this context. Additionally, the **extraSendOptions** parameter must include the value of the constructed [extra send options](/cancel-offer#2-building-extra-send-options).

While canceling the cross-chain offer, the OTC market will:

- **Validate:** The OTC market will verify whether the offer exists, if the cancellation is being initiated from the **source chain**, and if the **signer** has the authority to cancel the offer.
- **Send Cancel Offer Order message** Send the message to **destination** OTC market with order to cancel the offer.

Once the `Cancel Offer Order` message was delivered to **destination** OTC market, it will:

- **Cancel the offer:** Remove offer from the **offers** mapping.
- **Emit Event:** Log `OfferCanceled` event notifying offchain workers.
- **Send Offer Canceled message:** Send the message back to **source chain** OTC, saying that the offer is canceled on **destination chain** OTC market.

When the `Offer Canceled` message delivered to **source chain** OTC market, it will:

- **Cancel the offer:** Remove offer from the **offers** mapping.
- **Emit Event:** Log `OfferCanceled` event notifying offchain workers.

{% figure src="/assets/bakstag/cancel-offer.svg" alt="Offer cancellation process" caption="Offer acceptance" /%}



### **4. Problematic**


#### **Simultaneously accepting and cancelling the offer**
As previously mentioned, the Bakstag Protocol currently maintains a **duplicate** storage of offers. Therefore, to cancel an offer, it must be removed from both the source and destination OTC markets. This requires the offer to be canceled on both the source and destination chain OTC markets.

The simplest way to cacnel the offer is to:
1. **Cancel on source chain**
2. **Cancel on destination chain**
   
But this implementation has a problem:

Let’s consider a scenario where an offer has its source chain on `A` and its destination chain on `B`. The offer is being canceled on chain `A` while simultaneously being accepted on chain `B`. Here’s what would happen:

1. - **`A` OTC:** Offer is canceled
   - **`B` OTC:** Offer is accepted 
2. - **`A` OTC:** Offer is removed from mapping  and the assets are returned to the **seller**
   - **`B` OTC:** Offer is updated, **destination token** transferred from the **buyer** account to **destination seller address** and **treasury**
3. - **`A` OTC:** Cross-chain `Offer Canceled` message send to **destination chain** OTC.
   - **`B` OTC:** Cross-chain `Offer Accepted` message send to **source chain** OTC.
4. - **`A` OTC:** `Offer Accepted` message received, but **offer** no longer exist on this OTC marked, so **source token** can not be transferred to **source buyer address**
   - **`B` OTC:** Offer Canceled message received, the offer removed from the OTC.


The example above illustrates why relying on a simple cross-chain transaction is insufficient for canceling an offer.

Now, let’s consider the same scenario but using the Cancel Offer implementation currently employed in the Bakstag Protocol:

1. - **`A` OTC:** Offer is canceled
   - **`B` OTC:** Offer is accepted 
2. - **`A` OTC:** Cross-chain `Cancel Offer Order` message is sent to **destination chain** OTC market.
   - **`B` OTC:** Offer is updated, **destination token** transferred from the **buyer** account to **destination seller address** and **treasury**. Cross-chain `Offer Accepted` message send to **source chain** OTC.
3. - **`A` OTC:** `Offer Accepted` message received, **source token** transfered to **source buyer address**
   - **`B` OTC:** `Cancel Offer Order` message received, offer removed from the mapping, `Offer Canceled` message sent back to **source chain** OTC market.
4. `Offer Canceled` message received on `A` OTC market, the offer removed from the mapping, **source token** transferred to **source seller address**

This highlights why the Cancel Offer process must implement an ABA-type cross-chain transaction.

#### **Not enough gas for sending `Offer Canceled` message**

The ABA-type transaction introduces another potential issue. The **seller** specifies the amount of gas available for executing the transaction on the **destination chain** by providing the **Extra Send Options** parameter when invoking `cancelOffer`. What happens if the **seller** specifies an insufficient amount of gas on the **destination chain**, not enough to process the `Cancel Offer Order` message on the **destination** OTC market?

The answer is straightforward — nothing critically wrong would occur. If there isn't enough gas to process the `Cancel Offer Order` and send the `Offer Canceled message` back to the **source chain** OTC market, the transaction would simply revert. As a result, the **offer** would not be removed from either the **source chain** or the **destination chain** OTC markets.
