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
