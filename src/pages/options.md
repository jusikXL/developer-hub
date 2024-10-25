---
title: Message Execution Options
metaTitle: Message Execution Options | Bakstag
description: What are message options.
---

Bakstag supports **4 message types**, each with configured enforced options:  {% .lead %}

## Enforced Options

| **Message**         | **Gas** | **Ordered** | **Path**              | **Description**                 |
|---------------------|---------|-------------|-----------------------|---------------------------------|
| **OfferCreated**    | 200,000 | No          | Source to Destination | Sent when an offer is created.  |
| **OfferAccepted**   | 100,000 | Yes         | Destination to Source | Sent when an offer is accepted. |
| **OfferCancelOrder**| 305,000 | No          | Source to Destination | Sent when an advertiser orders the cancelation of an offer.
| **OfferCanceled**   | 100,000 | Yes         | Destination to Source | Sent to complete cancelation. [Curious?](/cancel-offer) |

## Extra Options

Note that **OfferCancelOrder** message also requires an additional `value`, included [within the extra options](/cancel-offer#2-building-extra-send-options).

## Options Builder

{% dialect-switcher title="Options Builder" %}
{% dialect title="Solidity" id="solidity" %}
```ts
OptionsBuilder
    .newOptions()
    .addExecutorLzReceiveOption(200000, 0)

OptionsBuilder
    .newOptions()
    .addExecutorLzReceiveOption(100000, 0)
    .addExecutorOrderedExecutionOption()

OptionsBuilder
    .newOptions()
    .addExecutorLzReceiveOption(305000, 0)

OptionsBuilder
    .newOptions()
    .addExecutorLzReceiveOption(100000, 0)
    .addExecutorOrderedExecutionOption()
```

{% /dialect %}
{% /dialect-switcher %}

## Further Information

Check out LayerZero’s [Message Execution Options](https://docs.layerzero.network/v2/developers/evm/protocol-gas-settings/options).
