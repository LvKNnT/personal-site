---
title: CP in Quantum - QCoder Programming Contest 001
date: 2026-09-22
description: My experience on trying to learn quantum
# readingTime: 4 min
series: CP Quantum
seriesOrder: 2
---

I still dont understand it at all.

![my current mental](/post/qcoder-nightmare/mental.gif)

# [A1: Generate Plus state](https://www.qcoder.jp/en/contests/QPC001/problems/A1)
## Idea
Similar to the previous contest, but now I just need to use H-gate on the base state $|0 \rangle$

## Code
```python
from qiskit import QuantumCircuit

def solve() -> QuantumCircuit:
    qc = QuantumCircuit(1)

    qc.h(0)

    return qc
```

# [A2: Generate Uniform Superposition State](https://www.qcoder.jp/en/contests/QPC001/problems/A2)
## Idea 
Introduction to Parallel gates. In this test, they decide to demo H-gate for its usage in the next problem. To understand better, you can check out this [wiki](https://en.wikipedia.org/wiki/Quantum_logic_gate#Parallel_gates)

## Code
```python
from qiskit import QuantumCircuit

def solve(n: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)

    qc.h(range(n))

    return qc
```

# [A3: Generate state $\frac{1}{\sqrt{2}}(|0\rangle + |3\rangle)$](https://www.qcoder.jp/en/contests/QPC001/editorials/A3)
## Idea
We know that :
$$
\begin{align}
\frac{1}{\sqrt{2}}(|0\rangle + |3\rangle)
&= \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)
\end{align}
$$

and 
$$
\lvert 00 \rangle
\xrightarrow{H(0)}
\frac{1}{\sqrt{2}}
\left(
\lvert 00 \rangle + \lvert 10 \rangle
\right)
$$

What a similar pattern, right ? Now, we might need to think that how can we use x-gate on the second qubit of the $|10\rangle$ to transform it to our little $|11\rangle$ while keep our cute child $|00\rangle$ unchange.

At these situation, we need to use [control gate](https://en.wikipedia.org/wiki/Quantum_logic_gate#Controlled_gates_2) to specifically control qubit based on some conditions. For our condition, obviously it is : use X-gate when the first qubit is $|1 \rangle$. 

## Code
```python
from qiskit import QuantumCircuit

def solve() -> QuantumCircuit:
    qc = QuantumCircuit(2)

    qc.h(0)
    qc.cx(0,1)

    return qc
```

# [A4: Generate state $\frac{1}{\sqrt{3}}(|0\rangle + |1\rangle + |2\rangle)$ I](https://www.qcoder.jp/en/contests/QPC001/problems/A4)
## Idea
This problem looks like A5, but there is one very important difference: **the amplitudes do not need to be equal yet**. We only need $|0\rangle$, $|1\rangle$, and $|2\rangle$ to have some non-zero amplitudes, while $|3\rangle$ should disappear.

First, same old friend H-gate:
$$
|00\rangle
\xrightarrow{H(0)}
\frac{1}{\sqrt{2}}\left(|00\rangle + |10\rangle\right).
$$

Now I want to split only the $|10\rangle$ branch into two branches. A controlled-H does exactly that:
$$
\frac{1}{\sqrt{2}}|00\rangle
+
\frac{1}{\sqrt{2}}|10\rangle
\xrightarrow{CH(0,1)}
\frac{1}{\sqrt{2}}|00\rangle
+
\frac{1}{2}|10\rangle
+
\frac{1}{2}|11\rangle.
$$

Nice, three states. Wrong three states.

We need $|01\rangle$ instead of $|11\rangle$. Since $|11\rangle$ is the only branch where qubit $1$ is $1$, we can use it as the control and flip qubit $0$:
$$
|11\rangle \xrightarrow{CX(1,0)} |01\rangle.
$$

So the final state becomes
$$
\frac{1}{\sqrt{2}}|00\rangle
+
\frac{1}{2}|10\rangle
+
\frac{1}{2}|01\rangle,
$$
which is enough for this problem because all three required amplitudes are non-zero.

## Code
```python
from qiskit import QuantumCircuit

def solve() -> QuantumCircuit:
    qc = QuantumCircuit(2)

    qc.h(0)
    qc.ch(0, 1)
    qc.cx(1, 0)

    return qc
```

# [A5: Generate state $\frac{1}{\sqrt{3}}(|0\rangle + |1\rangle + |2\rangle)$ II](https://www.qcoder.jp/en/contests/QPC001/problems/A5)
## Idea
Now they want the same three states as `A4`, except this time the amplitudes really need to be equal:
$$
|\psi\rangle
=
\frac{1}{\sqrt{3}}
\left(
|00\rangle + |10\rangle + |01\rangle
\right).
$$

The structure from `A4` is still useful. The only problem is that H-gate forces the first split to be $1/\sqrt{2}$ and $1/\sqrt{2}$, which does not give us three equal branches afterward.

So instead of H, we need a rotation where we can choose the amplitudes ourselves. For an $R_y(\theta)$ gate,
$$
R_y(\theta)|0\rangle
=
\cos\left(\frac{\theta}{2}\right)|0\rangle
+
\sin\left(\frac{\theta}{2}\right)|1\rangle.
$$

After applying it on qubit $0$:
$$
|00\rangle
\to
\cos\left(\frac{\theta}{2}\right)|00\rangle
+
\sin\left(\frac{\theta}{2}\right)|10\rangle.
$$

Then the same `CH` and `CX` trick from `A4` transforms it to
$$
\cos\left(\frac{\theta}{2}\right)|00\rangle
+
\frac{\sin(\theta/2)}{\sqrt{2}}|10\rangle
+
\frac{\sin(\theta/2)}{\sqrt{2}}|01\rangle.
$$

Now we just force every amplitude to become $1/\sqrt{3}$:
$$
\cos\left(\frac{\theta}{2}\right)=\frac{1}{\sqrt{3}},
\qquad
\frac{\sin(\theta/2)}{\sqrt{2}}=\frac{1}{\sqrt{3}}.
$$

Therefore,
$$
\sin\left(\frac{\theta}{2}\right)=\sqrt{\frac{2}{3}}
$$
and one possible expression is
$$
\theta
=2\arccos\left(\frac{1}{\sqrt{3}}\right)
=4\arctan\left(\frac{\sqrt{6}}{3+\sqrt{3}}\right).
$$

So `A5` is basically `A4`, but we replace the first H-gate with the exact $R_y$ rotation needed to balance all three children equally. Quantum parenting.

## Code
```python
from qiskit import QuantumCircuit
import math

def solve() -> QuantumCircuit:
    qc = QuantumCircuit(2)

    theta = 4 * math.atan(math.sqrt(6) / (3 + math.sqrt(3)))
    qc.ry(theta, 0)
    qc.ch(0, 1)
    qc.cx(1, 0)

    return qc
```

# [B1: Copy Oracle](https://www.qcoder.jp/en/contests/QPC001/problems/B1)
## Idea
Welcome to oracle land.

The oracle should do
$$
|x\rangle|y\rangle
\longrightarrow
|x\rangle|y\oplus x\rangle.
$$

This looks fancy until realizing that this is literally the definition of a CNOT gate.

- $x$ is the control.
- $y$ is the target.
- If $x=0$, nothing happens.
- If $x=1$, $y$ is flipped.

Or, in normal computer language,
$$
y \leftarrow y\oplus x.
$$

The important quantum thing is that we do not "copy a qubit" in the normal sense. The CNOT just implements this reversible XOR operation, which also works when $x$ is in superposition.

## Code
```python
from qiskit import QuantumCircuit, QuantumRegister

def solve() -> QuantumCircuit:
    x, y = QuantumRegister(1), QuantumRegister(1)
    qc = QuantumCircuit(x, y)

    qc.cx(x, y)

    return qc
```

# [B2: XOR Oracle](https://www.qcoder.jp/en/contests/QPC001/problems/B2)
## Idea
`B1` but now there are $n$ control bits:
$$
|\mathbf{x}\rangle|y\rangle
\longrightarrow
|\mathbf{x}\rangle
|y\oplus x_1\oplus x_2\oplus\cdots\oplus x_n\rangle.
$$

Since one CNOT gives
$$
y\leftarrow y\oplus x_i,
$$
we can just do one CNOT from every $x_i$ into $y$.

After all of them,
$$
y
\to y\oplus x_1
\to y\oplus x_1\oplus x_2
\to \cdots
\to y\oplus x_1\oplus\cdots\oplus x_n.
$$

This looks suspiciously normal for a quantum problem. I will enjoy it while it lasts.

## Code
```python
from qiskit import QuantumCircuit, QuantumRegister

def solve(n: int) -> QuantumCircuit:
    x, y = QuantumRegister(n), QuantumRegister(1)
    qc = QuantumCircuit(x, y)

    for i in range(n):
        qc.cx(x[i], y)

    return qc
```

# [B3: Less Than Oracle I](https://www.qcoder.jp/en/contests/QPC001/problems/B3)
## Idea
Now we need an oracle that multiplies the amplitudes of
$$
|0\rangle, |1\rangle, \ldots, |L-1\rangle
$$
by $-1$.

In other words, for every integer $i<L$,
$$
|i\rangle \to -|i\rangle.
$$

A Z-gate gives a phase $-1$ to $|1\rangle$. Its multi-controlled version can therefore give a phase $-1$ only when **all qubits are $1$**:
$$
|11\cdots1\rangle \to -|11\cdots1\rangle.
$$

But our target might be something random like $|0101\rangle$, not $|1111\rangle$. So the trick is:

1. Look at the binary representation of $i$.
2. For every bit of $i$ that is $0$, apply X to that qubit.
3. Now the target state $|i\rangle$ has temporarily become $|11\cdots1\rangle$.
4. Apply the multi-controlled Z.
5. Undo all X-gates.

For example, if the target is $i=2$, then its bits tell us exactly which qubits need X before and after the controlled-Z.

The bit check
```python
(i >> j) & 1
```
just asks: "is bit $j$ of integer $i$ equal to $1$?" Because the problem uses little-endian, bit $j$ corresponds directly to qubit $j$.

Finally, repeat this for every $i=0,1,\ldots,L-1$.

This is absolutely the brute-force solution. Luckily $n\leq5$ here, so violence is acceptable.

## Code
```python
from qiskit import QuantumCircuit
from qiskit.circuit.library import ZGate

def solve(n: int, L: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)

    for i in range(L):
        for j in range(n):
            if not ((i >> j) & 1):
                qc.x(j)

        if n == 1:
            qc.z(0)
        else:
            qc.append(ZGate().control(n - 1), range(n))

        for j in range(n):
            if not ((i >> j) & 1):
                qc.x(j)

    return qc
```

# [B4: Less Than Oracle II](https://www.qcoder.jp/en/contests/QPC001/problems/B4)
## Idea
Same oracle as `B3`.

Except now $n$ can go up to $10$ and the circuit depth must not exceed $50$, so enumerating every $i<L$ and individually phase-flipping it is no longer cute.

We need to use the binary structure of the condition
$$
x<L.
$$

Suppose, for example,
$$
L=5=(101)_2.
$$

Which numbers are smaller than $5$?

We can split them based on the **first more-significant bit where $x$ becomes smaller than $L$**:

- At the highest `1` bit of $L$, choose $x_i=0$. Then all lower bits can be literally anything.
- Or match the higher bits of $L$, then at the next `1` bit choose $x_i=0$.
- Continue for every bit where $L_i=1$.

So for every set bit $i$ of $L$, my code creates one phase-flip condition:

1. All bits more significant than $i$ must match $L$.
2. Bit $i$ itself must be $0$, because $L_i=1$.
3. Bits below $i$ do not matter anymore. The number is already guaranteed to be smaller than $L$.

That explains this part:
```python
for i in range(n):
    if not (L >> i) & 1:
        continue
```
We only care about positions where $L_i=1$.

For every higher bit $j>i$, if $L_j=0$, I X-flip that qubit so that "matching $L$" becomes the all-$1$ condition expected by a multi-controlled gate:
```python
for j in range(i + 1, n):
    if not (L >> j) & 1:
        qc.x(j)
```

Then this
```python
qc.x(i)
```
turns the condition "original bit $x_i=0$" into "temporary qubit is $1$".

Now the multi-controlled Z over qubits $i,i+1,\ldots,n-1$ adds the $-1$ phase exactly to that entire block of values. Notice that qubits below $i$ are not controls, because once the number is already smaller, those lower bits can be anything.

Afterward, undo the X-gates and continue to the next set bit of $L$.

So `B3` says:
> flip every number below $L$ one by one.

`B4` says:
> flip whole binary ranges below $L$ at once.

Much more aura.

## Code
```python
from qiskit import QuantumCircuit
from qiskit.circuit.library import ZGate

def solve(n: int, L: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)

    for i in range(n):
        if not (L >> i) & 1:
            continue

        for j in range(i + 1, n):
            if not (L >> j) & 1:
                qc.x(j)

        qc.x(i)

        if i == n - 1:
            qc.z(i)
        else:
            qc.append(ZGate().control(n - i - 1), range(i, n))

        qc.x(i)

        for j in range(i + 1, n):
            if not (L >> j) & 1:
                qc.x(j)

    return qc
```

# [C1: Generate Uniform Amplitude Superposition State I](https://www.qcoder.jp/en/contests/QPC001/problems/C1)
## Idea
We want the states
$$
|0\rangle,|1\rangle,\ldots,|L-1\rangle
$$
to have equal amplitudes, and their total probability only needs to be greater than $0.5$.

We do **not** need to remove every state outside the range yet. That makes this problem much easier.

Let
$$
k=\left\lceil\log_2 L\right\rceil.
$$

This is the smallest number of qubits whose full superposition can contain all $L$ desired states, because
$$
2^{k-1}<L\leq2^k.
$$

If we apply H to the first $k$ qubits, we get a uniform superposition over exactly $2^k$ states:
$$
\frac{1}{\sqrt{2^k}}
\sum_{i=0}^{2^k-1}|i\rangle.
$$

Therefore every desired state $0\leq i<L$ automatically has the same amplitude
$$
\frac{1}{\sqrt{2^k}}.
$$

Their total probability is
$$
L\left(\frac{1}{\sqrt{2^k}}\right)^2
=
\frac{L}{2^k}.
$$

Since $2^{k-1}<L$,
$$
\frac{L}{2^k}>\frac{1}{2}.
$$

And that is literally enough to pass.

For $L=1$, no H-gate is needed because $|0\rangle$ is already the whole answer.

Waits until you see `C2`.

## Code
```python
from qiskit import QuantumCircuit
import math

def solve(n: int, L: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)

    if L == 1:
        return qc

    k = math.ceil(math.log2(L))
    qc.h(range(k))

    return qc
```

# [C2: Generate Uniform Amplitude Superposition State II](https://www.qcoder.jp/en/contests/QPC001/problems/C2)
## Idea
And now they want basically the same thing as `C1`, except the total probability inside
$$
|0\rangle,|1\rangle,\ldots,|L-1\rangle
$$
must be almost $1$ instead of merely above $0.5$.

My `C1` state is already a pretty good starting point. If
$$
k=\left\lceil\log_2L\right\rceil,
$$
then H on the first $k$ qubits gives all $2^k$ states equal amplitudes, and more than half of the probability is already inside the desired range.

Now we need to amplify that good part without destroying the fact that all desired states have equal amplitudes.

This is where the problem suddenly decides we are doing **fixed-point amplitude amplification** with a $\pi/3$ phase shift.

Sure.

The construction uses two selective phase operators:

- $R_t$: add a phase $e^{i\pi/3}$ to every **target** state $|0\rangle,\ldots,|L-1\rangle$.
- $R_s$: add the same phase to the **starting** state $|0\cdots0\rangle$.

## $R_t$: B4 returns, but purple

`Rt()` is basically my B4 less-than oracle again. The structure deciding whether $x<L$ is exactly the same.

The only difference is that B4 used Z to multiply the target amplitudes by
$$
-1=e^{i\pi},
$$
while here we use
$$
e^{i\pi/3}.
$$

So `ZGate()` becomes `PhaseGate(math.pi / 3)`.

## $R_s$: phase only the zero state

A multi-controlled phase naturally triggers on
$$
|11\cdots1\rangle,
$$
so to target
$$
|00\cdots0\rangle
$$
I just X every qubit first:
$$
|00\cdots0\rangle
\xrightarrow{X^{\otimes n}}
|11\cdots1\rangle.
$$

Then apply the controlled $\pi/3$ phase and undo the X-gates.

Basically the same "turn my weird condition into all ones, do controlled gate, undo" trick again. Apparently this is only my understand now.

## Recursive amplification

Let $U_0$ be the C1-style preparation:
$$
U_0=H^{\otimes k}.
$$

Then the fixed-point construction recursively combines the previous circuit, the two phase operators, and the inverse circuit. Conceptually,
$$
U_{m+1}
=
U_m R_s U_m^{\dagger} R_t U_m.
$$

That is why the code does
```python
u = U(m - 1, n, L)

qc.compose(u, inplace=True)
qc.compose(Rt(n, L), inplace=True)
qc.compose(u.inverse(), inplace=True)
qc.compose(Rs(n), inplace=True)
qc.compose(u, inplace=True)
```

The written circuit order and matrix multiplication order look reversed because gates act on the state from right to left when written as matrices. Very normal quantum notation moment.

The nice part is the error. If the initial unwanted probability is $\epsilon_0$, each recursive level cubes the error. After depth $m$,
$$
\epsilon_m=\epsilon_0^{3^m}.
$$

From `C1` we already know
$$
\epsilon_0<0.5.
$$

So with $m=2$,
$$
\epsilon_2
<
(0.5)^{3^2}
=
(0.5)^9
\approx0.001953125
<0.005.
$$

Which satisfies the allowed error.

That is the reason for the extremely confident-looking line
```python
m = 2
```
It is not a magic number. Well, it looked like one before reading the editorial.

Also notice that I only run this amplification on the first
$$
k=\left\lceil\log_2L\right\rceil
$$
qubits, not all $n$ qubits. Those are already enough to represent every integer below $L$, and using extra qubits would just create more useless states that later need to be removed.

So the whole contest somehow went from
```python
qc.h(0)
```
to recursive inverse circuits and fixed-point amplitude amplification.

I would like my H-gate back.

## Code
```python
from qiskit import QuantumCircuit
from qiskit.circuit.library import PhaseGate
import math

def Rt(n: int, L: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)

    for i in range(n):
        if not (L >> i) & 1:
            continue

        for j in range(i + 1, n):
            if not (L >> j) & 1:
                qc.x(j)

        qc.x(i)

        if i == n - 1:
            qc.p(math.pi / 3, i)
        else:
            qc.append(PhaseGate(math.pi / 3).control(n - i - 1), range(i, n))

        qc.x(i)

        for j in range(i + 1, n):
            if not (L >> j) & 1:
                qc.x(j)

    return qc

def Rs(n: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)

    qc.x(range(n))

    if n == 1:
        qc.p(math.pi / 3, 0)
    else:
        qc.append(PhaseGate(math.pi / 3).control(n - 1), range(n))

    qc.x(range(n))

    return qc

def U(m: int, n: int, L: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)

    if m == 0:
        qc.h(range(n))
        return qc

    u = U(m - 1, n, L)

    qc.compose(u, inplace=True)
    qc.compose(Rt(n, L), inplace=True)
    qc.compose(u.inverse(), inplace=True)
    qc.compose(Rs(n), inplace=True)
    qc.compose(u, inplace=True)

    return qc

def solve(n: int, L: int) -> QuantumCircuit:
    qc = QuantumCircuit(n)

    k = math.ceil(math.log2(L))
    if k == 0:
        return qc

    m = 2
    qc.compose(U(m, k, L), inplace=True)

    return qc
```
