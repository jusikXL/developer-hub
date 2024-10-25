---
title: Protocol fee
metaTitle: Protocol fee | Bakstag
description: Learn about protocol fee
---

A protocol fee is applied to each accepted offer. This section outlines the details of how the fee is collected. {% .lead %}

## Protocol fee amount
In the current version of the Bakstag OTC market, a **1%** fee is applied to the destination token amount and is collected when the offer is accepted. The **protocol fee** is paid from amount that **seller** would receive. In future updates, the fee may be reduced to **0%**; further details are available in the [Next Steps section](/nxext-steps#protocol-fee)

{% callout title="When fee is not collected" type="note" %} 
The **protocol fee** is collected only when the offer is accepted. If **seller** decides to cancel the offer before it was accepted by anyone, no **fee** will be paid.
{% /callout %}

## Examples
To better understand the fee mechanism in the Bakstag Protocol, let’s consider some examples. When a **seller** creates an offer, no **protocol fee** is charged immediately. After the offer is created, the following actions may occur:
- **Partial Offer Acceptance:** The **buyer** purchases a portion of the **source token amount** and pays with the **destination token amount**. In this case, a **protocol fee** of **1%** of the **destination token amount** is transferred to the [treasury](/accept-offer#treasury), while the remaining **99%** goes to the **seller's** account.
- **Offer Cancellation:**  If the **seller** cancels the offer, **no** additional **protocol fee** is incurred.

{% callout title="Minimum amount to accept the offer" type="note" %}
The Bakstag Protocol charges a **protocol fee** on every accepted offer. Therefore, transaction with a **target token amount** where **1%** would amount to **0** cannot be accepted. For more details, refer to the [limitations](/limitations) section.
{% /callout %}

