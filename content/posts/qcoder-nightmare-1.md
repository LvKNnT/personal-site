---
title: CP in Quantum - Demo Contest
date: 2026-09-22
description: My experience on trying to learn quantum
# readingTime: 4 min
series: CP Quantum
seriesOrder: 1
---

I dont understand it at all.

![my current mental](/post/qcoder-nightmare/mental.gif)

# Yap
I think this contest is `good` enough for getting started with `qiskit`. The later contests also cover lots of amazing stuffs.

Tho there are editorial for each contest 🍊, these are some notes from my experiences.

# [A - Generate state $|1\rangle$](https://www.qcoder.jp/en/contests/demo/problems/A)
## Idea
From the base zero state $| 0 \rangle$, I use X-gate on it to convert it to $|1\rangle$


## Code
```python
from qiskit import QuantumCircuit

def solve() -> QuantumCircuit:
    qc = QuantumCircuit(1)

    qc.x(0)

    return qc
```

# [B: Generate Minus state](https://www.qcoder.jp/en/contests/demo/problems/B)
## Idea
To get Minus state ($| - \rangle$), we can use H-gate on $| 1 \rangle$. For state $| 1 \rangle$, we can reuse the code from problem `A`

## Code
```python
from qiskit import QuantumCircuit

def solve() -> QuantumCircuit:
    qc = QuantumCircuit(1)

    qc.x(0)
    qc.h(0)

    return qc
```