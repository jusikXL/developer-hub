---
title: Protocol fee
metaTitle: Protocol fee | Bakstag
description: Learn about protocol fee
---

There are limitations on the minimum possible amount to accept an offer. In this section, we will explore the reasons behind these limitations. {% .lead %}

## Shared Decimals
First of all, all **token amounts** are stored with the precision of **Shared Decimals** in the OTC market. In the current version of Bakstag Protocol, **Shared Decimals** is set to **6**. This means that the smallest amount that **buyer** is allowed to purchase is **1e-06** **source token**.

## Protocol fee limitations
As mentioned in the [Protocol Fee](/fee) section, a **protocol fee** is charged on every accepted offer. This means that the minimum **destination token amount** needs to be large enough to cover a **1% protocol fee**. The **destination token amount** is calculated based on the **exchange rate** set by the **seller**. Therefore, the minimum **destination token amount** depends on the [token's precision](/token-precision) and the **exchange rate**. 

In the following tables, you may see, how different **exchange rates** affect the minimal **source token amount** that **buyer** can purchase for different tokens in role of **destination token**.


### ETH or ERC20 as **destination token**
|**Exchange Rate** | minimum **source token amount** |
|---|---|
| 1e-06 | 1e-06 |
| 1e-05 | 1e-06 |
| 0.0001 | 1e-06 |
| 0.001 | 1e-06 |
| 0.01 | 1e-06 |
| 0.1 | 1e-06 |
| 1.0 | 1e-06 |
| 10.0 | 1e-06 |
| 100.0 | 1e-06 |
| 1000.0 | 1e-06 |
| 10000.0 | 1e-06 |
| 100000.0 | 1e-06 |
| 1000000.0 | 1e-06 |

**ETH** or **ERC20** tokens typically have **18** decimals. This high level of precision removes any additional restrictions on the minimum **source token amount**.

### SOL or TON or JETTON as **destination token**
|**Exchange Rate** | Minimum **source token amount** |
|---|---|
| 1e-06  | 0.1 |
| 1e-05  | 0.01 |
| 0.0001  | 0.001 |
| 0.001  | 0.0001 |
| 0.01  | 1e-05 |
| 0.1  | 1e-06 |
| 1.0  | 1e-06 |
| 10.0  | 1e-06 |
| 100.0  | 1e-06 |
| 1000.0  | 1e-06 |
| 10000.0  | 1e-06 |
| 100000.0  | 1e-06 |
| 1000000.0  | 1e-06 |

**SOL**, **TON** and **JETTONs** generally have **9** decimals number, which imposes greater restrictions on smaller **exchange rates** due to the reduced level of precision.

### SPL as **destination token**
|**Exchange Rate** | Minimum **source token amount** |
|---|---|
| 1e-06  | 100 |
| 1e-05  | 10 |
| 0.0001  | 1 |
| 0.001  | 0.1 |
| 0.01  | 0.01 |
| 0.1  | 0.001 |
| 1  | 0.0001 |
| 10  | 1e-05 |
| 100  | 1e-06 |
| 1000  | 1e-06 |
| 10000  | 1e-06 |
| 100000  | 1e-06 |
| 1000000  | 1e-06 |

Solana **SPL** tokens generally have **6** decimal number, resulting in even stricter limitations on the minimum **source token amount** for low exchange rates due to the reduced precision.





