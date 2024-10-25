---
title: Protocol fee
metaTitle: Protocol fee | Bakstag
description: Learn about protocol fee
---

There are limitations on the minimum possible amount to accept an offer. In this section, we will explore the reasons behind these limitations. {% .lead %}

## Shared Decimals
First of all, all **token amounts** are stored with the precision of **Shared Decimals** in the OTC market. In the current version of Bakstag Protocol, **Shared Decimals** is set to **6**. This means that the smallest amount that **buyer** is allowed to purchase is **10<sup>-6</sup>** **source token**.

## Protocol fee limitations
As mentioned in the [Protocol Fee](/fee) section, a **protocol fee** is charged on every accepted offer. This means that the minimum **destination token amount** needs to be large enough to cover a **1% protocol fee**. The **destination token amount** is calculated based on the **exchange rate** set by the **seller**. Therefore, the minimum **destination token amount** depends on the [token's precision](/token-precision) and the **exchange rate**. 

In the following tables, you may see, how different **exchange rates** affect the minimal **source token amount** that **buyer** can purchase for different tokens in role of **destination token**.


### ETH as **destination token**
|**Exchange Rate** | minimum **source token amount** |
|---|---|
| 1e-06 **ETH/SRC**| 1e-06 |
| 1e-05 **ETH/SRC**| 1e-06 |
| 0.0001 **ETH/SRC**| 1e-06 |
| 0.001 **ETH/SRC**| 1e-06 |
| 0.01 **ETH/SRC**| 1e-06 |
| 0.1 **ETH/SRC**| 1e-06 |
| 1.0 **ETH/SRC**| 1e-06 |
| 10.0 **ETH/SRC**| 1e-06 |
| 100.0 **ETH/SRC**| 1e-06 |
| 1000.0 **ETH/SRC**| 1e-06 |
| 10000.0 **ETH/SRC**| 1e-06 |
| 100000.0 **ETH/SRC**| 1e-06 |
| 1000000.0 **ETH/SRC**| 1e-06 |

### ERC20 as **destination token**

|**Exchange Rate** | minimum **source token amount** |
|---|---|
| 1e-06 **ERC20/SRC** | 1e-06 |
| 1e-05 **ERC20/SRC** | 1e-06 |
| 0.0001 **ERC20/SRC** | 1e-06 |
| 0.001 **ERC20/SRC** | 1e-06 |
| 0.01 **ERC20/SRC** | 1e-06 |
| 0.1 **ERC20/SRC** | 1e-06 |
| 1.0 **ERC20/SRC** | 1e-06 |
| 10.0 **ERC20/SRC** | 1e-06 |
| 100.0 **ERC20/SRC** | 1e-06 |
| 1000.0 **ERC20/SRC** | 1e-06 |
| 10000.0 **ERC20/SRC** | 1e-06 |
| 100000.0 **ERC20/SRC** | 1e-06 |
| 1000000.0 **ERC20/SRC** | 1e-06 |

### SOL as **destination token**
|**Exchange Rate** | Minimum **source token amount** |
|---|---|
| 1e-06 **SOL/SRC** | 0.1 |
| 1e-05 **SOL/SRC** | 0.01 |
| 0.0001 **SOL/SRC** | 0.001 |
| 0.001 **SOL/SRC** | 0.0001 |
| 0.01 **SOL/SRC** | 1e-05 |
| 0.1 **SOL/SRC** | 1e-06 |
| 1.0 **SOL/SRC** | 1e-06 |
| 10.0 **SOL/SRC** | 1e-06 |
| 100.0 **SOL/SRC** | 1e-06 |
| 1000.0 **SOL/SRC** | 1e-06 |
| 10000.0 **SOL/SRC** | 1e-06 |
| 100000.0 **SOL/SRC** | 1e-06 |
| 1000000.0 **SOL/SRC** | 1e-06 |

### SPL as **destination token**
|**Exchange Rate** | Minimum **source token amount** |
|---|---|
| 1e-06 **SPL/SRC** | 100 |
| 1e-05 **SPL/SRC** | 10 |
| 0.0001 **SPL/SRC** | 1 |
| 0.001 **SPL/SRC** | 0.1 |
| 0.01 **SPL/SRC** | 0.01 |
| 0.1 **SPL/SRC** | 0.001 |
| 1 **SPL/SRC** | 0.0001 |
| 10 **SPL/SRC** | 1e-05 |
| 100 **SPL/SRC** | 1e-06 |
| 1000 **SPL/SRC** | 1e-06 |
| 10000 **SPL/SRC** | 1e-06 |
| 100000 **SPL/SRC** | 1e-06 |
| 1000000 **SPL/SRC** | 1e-06 |

### TON as **destination token**
|**Exchange Rate** | Minimum **source token amount** |
|---|---|
| 1e-06 **TON/SRC** | 0.1 |
| 1e-05 **TON/SRC** | 0.01 |
| 0.0001 **TON/SRC** | 0.001 |
| 0.001 **TON/SRC** | 0.0001 |
| 0.01 **TON/SRC** | 1e-05 |
| 0.1 **TON/SRC** | 1e-06 |
| 1 **TON/SRC** | 1e-06 |
| 10 **TON/SRC** | 1e-06 |
| 100 **TON/SRC** | 1e-06 |
| 1000 **TON/SRC** | 1e-06 |
| 10000 **TON/SRC** | 1e-06 |
| 100000 **TON/SRC** | 1e-06 |
| 1000000 **TON/SRC** | 1e-06 |

### Jetton as **destination token**

|**Exchange Rate** | Minimum **source token amount** |
|---|---|
| 1e-06 **JETTON/SRC** | 0.1 |
| 1e-05 **JETTON/SRC** | 0.01 |
| 0.0001 **JETTON/SRC** | 0.001 |
| 0.001 **JETTON/SRC** | 0.0001 |
| 0.01 **JETTON/SRC** | 1e-05 |
| 0.1 **JETTON/SRC** | 1e-06 |
| 1 **JETTON/SRC** | 1e-06 |
| 10 **JETTON/SRC** | 1e-06 |
| 100 **JETTON/SRC** | 1e-06 |
| 1000 **JETTON/SRC** | 1e-06 |
| 10000 **JETTON/SRC** | 1e-06 |
| 100000 **JETTON/SRC** | 1e-06 |
| 1000000 **JETTON/SRC** | 1e-06 |




