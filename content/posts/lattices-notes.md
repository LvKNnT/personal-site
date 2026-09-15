---
title: Lattices, Learning with Errors and Post-Quantum Cryptography
date: 2026-09-15
description: A notes about interesting stuffs.
# readingTime: 4 min
---

# Lattices, Learning with Errors and Post-Quantum Cryptography Notes

**Khang Lam · September 2026**

# Chapter 1
## The general problem

$$ 
\left\{
(\mathbf{a}_i,
\langle \mathbf{a}_i,\mathbf{s}\rangle + e_i)
:
\mathbf{s}\leftarrow\mathbb{Z}_{q}^{\,n},
\mathbf{a}_i\leftarrow\mathbb{Z}_{q}^{\,n},
e_i\leftarrow\chi
\right\}_{i=1}^{\,m} 
\tag{1.1}
$$ 

Where 
- $\mathbb{Z}_q$ is simply finite rings of modulo q, where $\mathbb{Z}_{q}^{\,n}$ is the vector space of dimension n over $\mathbb{Z}_q$
- $\chi$ is simply a probability distribution over $\mathbb{Z}$ for "small number". Thus for a uniform distribution over an interval $[-B,\ldots,B]$, we want $B \ll q/2$ for $B$ having meaning
- $a \leftarrow \mathcal{D}$ is simply chosen $a$ from $\mathcal{D}$, while $a \leftarrow S$ is chosen $a$ from set $S$

## Solving Systems of Linear Equations 

Consider this problem :
$$
\mathbf{A}\,\mathbf{e} = \mathbf{b} \bmod q
\tag{1.2}
$$
given $\mathbf{A} \in \mathbb{Z}_{q}^{\,n \times m}$ and $\mathbf{b} \in \mathbb{Z}_{q}^{\,n}$.

This can be accomplished in polynomial time with [Gaussian elimination](https://en.wikipedia.org/wiki/Gaussian_elimination).

## The "Total" Regime and SIS
Lets think about the solution for $\mathbf{e} \in S \subseteq \mathbb{Z}_{q}^{\,m}$.

### $S = \{0,1\}$ : binary solutions, subset sum.
For example, suppose the problem has the form :

$$
e_1a_1+\cdots+e_ma_m=b\pmod q. 
$$

If

$$ 
(e_1,e_2,e_3,e_4)=(1,0,1,0), 
$$

then this becomes

$$
a_1+a_3=b\pmod q.
$$

So finding $\mathbf{e}$ is equivalent to asking:

Which subset of $a_1,\dots,a_m$ sums to $b\pmod q$?

### $S=[-B,\ldots,B]^m$ : bounded-coordinate solutions

Now instead of restricting each coordinate to only $0$ or $1$, we allow
$$
e_i\in\{-B,-B+1,\dots,B-1,B\}. 
$$

Therefore
$$ 
S=[-B,B]^m 
$$

means
$$ 
|e_i|\le B \qquad\text{for every }i. 
$$

### $S=\operatorname{Ball}_{R}^{\,m}$ : small Euclidean norm
This uses a different definition of “small.”

Instead of requiring each individual coordinate to satisfy a bound, we require the whole vector to have small Euclidean length:
$$ 
\|\mathbf e\|_2\le R. 
$$

Recall
$$ 
\|\mathbf e\|_2 = \sqrt{e_{1}^{\,2}+e_{2}^{\,2}+\cdots+e_{m}^{\,2}}. 
$$

So
$$ 
\operatorname{Ball}_{R}^{\,m} = \left\{ \mathbf e\in\mathbb Z^m: e_{1}^{\,2}+\cdots+e_{m}^{\,2}\le R^2 \right\}. 
$$

In all cases, we are asking for *short* solutions to systems of linear equations and hence this is SIS (short integer solutions) problem. 

```
Short is Small
- LvK
```

The SIS problem $\mathbf{SIS}(n, m, q, B)$ as we will study is parameterized by the number of variables $m$, the number of equations $n$, the finite field $\mathbb{Z}_q$, and the bound of on the absolute value of the solution $B$.

### Totality of SIS on the Average
From the setup above, using a simple probabilistic argument, we can show that ($B$-bounded) solutions are very likely to exists if $ (2B+1)^m \gg q^n $, or $m=\Omega\left(\frac{n\log q}{\log B}\right)$.

```
We call this regime of parameters the total regime or the SIS regime
```

Thus, roughly speaking, in the SIS regime, the problem then is to actually find a solution.

### A Variant: homogenous SIS
The homogenous version of SIS asks for a non-zero solution to equation 1.1 with the right hand side being 0, that is, $A\mathbf e=0\pmod q$.

This variant is worst-case total as long as $(B+1)^m>q^n$. 
```
Worst-case : For every instance A is guaranteed to have a solution
Average-case : For most A, solution exists with high probability.
```

### The Planted Regime and LWE
When $ m \ll \frac{n\log q}{\log B}$, one can show that there is likely no $B$-bounded solutions for a uniformly random $\mathbf{b}$.

We first pick a $B$-bounded vector $\mathbf{e}$ and compute $\mathbf{b}$ as $\mathbf{A}\,\mathbf{e} \pmod q$. In a sense, we *plant* solution $\mathbf{e}$ inside $\mathbf{b}$. The goal now is to recover $\mathbf{e}$ (which is very likely to be unique) given $\mathbf{A}$ and $\mathbf{b}$. 

```
We call this the planted regime or the LWE regime
```

*Why is this LWE when it looks so different from Equation $(1.1)$ ?*

Because SIS problem in the planted regime is simply LWE in disguise. For, given an LWE instance $(\mathbf{A}, \mathbf{y}^{T} = \mathbf{s}^{T}\,\mathbf{A} + \mathbf{e}^{T})$, let $\mathbf{A}^{\perp} \in \mathbb{Z}_q^{(m-n)\times m}$ be a full-rank set of vectors in the right-kernel of $\mathbf{A}$. That is
$$
\mathbf{A}^{\perp} \cdot \mathbf{A}^{T} = 0 \bmod q
$$

Then,
$$
\mathbf{b}
:= \mathbf{A}^{\perp}\cdot\mathbf{y}
= \mathbf{A}^{\perp}\cdot(\mathbf{A}^{T}\,\mathbf{s}+\mathbf{e})
= \mathbf{A}^{\perp}\cdot\mathbf{e}
\bmod q
$$

so $(\mathbf{A}^{\perp}, \mathbf{b})$ is an SIS instance $\mathbf{SIS}(m - n, m, q, B)$ whose solution is the LWE error vector. Further more, this is in the planted regime since one can show with an easy probabilistic argument that the LWE error vector $\mathbf{e}$ is unique given $(\mathbf{A}, \mathbf{y})$.

### Decision and Search for LWE. 
In the decision version of LWE< the problem is to distinguish between $(\mathbf{A}, \mathbf{y}^{T} = \mathbf{s}^{T}\,\mathbf{A} + \mathbf{e}^{T} \pmod q)$ and a uniformly random distribution. 

### Reductions Between SIS and LWE
**SIS is at least as hard as LWE**.

**LWE is (quantumly) at least as hard as SIS**

### SIS, LWE and Lattice Problems
SIS and LWE are closely related to lattices and lattice problems. We will have much to say about this connection.

## Basic Theorems
### Normal Form SIS and Short-Secret LWE
The normal form for SIS is where the matrix $\mathbf{A}$ is systematic, that is of the form $\mathbf{A} = [\mathbf{A}' \| \mathbf{I}]$ where $\mathbf{A}' \in \mathbb{Z}_q^{n \times (m-n)}$

**Lemma 1.** *Normal-form SIS is as hard as SIS*

**Lemma 2.** *There is a polynomial-time reduction from $\mathbf{ssLWE}(n, m, q, \chi)$ to $\mathbf{LWE}(n, m, q, \chi)$ and one from $\mathbf{LWE}(n, m, q, \chi)$ to $\mathbf{ssLWE}(n, m=n,q,\chi)$* 

## Basic Cryptographic Applications
### Collision-Resistant Hashing
A collision resistant hashing scheme $\mathcal{H}$ consists of an ensemble of hash functions $\{\mathcal{H}_n\}_{n \in \mathbb{N}}$ where each $\mathcal{H}_n$ consists of a collection of functions that map $n$ bits to $m \lt n$ bits. So, each hash function compresses its input, and by pigeonhole principle, it has collisions. That is inputs $x \neq y$ such that $h(x) = h(y)$. Collision-resistance requires that every p.p.t adversary who gets a hash function $h \leftarrow \mathcal{H}_n$ chosen at random fails to find a collision except with negligible probability.

### Collision-Resistancec Hashing from SIS.
With output :

$$
h_{\mathbf{A}}(\mathbf{e}) = \mathbf{A}\mathbf{e} \bmod q
$$

A collision gives us $\mathbf{e},\mathbf{e}' \in [0,\ldots,B]^m$ where $\mathbf{A}\mathbf{e} = \mathbf{A}\mathbf{e}' \bmod q$ which in turn says that $\mathbf{A}(\mathbf{e}-\mathbf{e}') = 0 \bmod q$. Since each entry of $\mathbf{e} - \mathbf{e}'$ is in $[-B,\ldots,B]$, this gives us a solution to $\mathbf{SIS}(n, m, q, B)$

### Private-Key Encryption

A private-key encryption scheme consists of three algorithms:

- $\operatorname{Gen}(1^\lambda)$ probabilistically generates a secret key $\operatorname{sk}$.
- $\operatorname{Enc}(\operatorname{sk},m)$ probabilistically encrypts a message $m\in\mathcal M$ as a ciphertext $c$.
- $\operatorname{Dec}(\operatorname{sk},c)$ deterministically recovers a message $m'$.

Correctness requires that every honestly generated key decrypts every honestly generated ciphertext:

$$
\operatorname{Dec}(\operatorname{sk},
\operatorname{Enc}(\operatorname{sk},m))=m.
$$

The desired security notion is semantic security, equivalently CPA security. An adversary may repeatedly submit pairs $(m_L,m_R)$ to an oracle. The left oracle always encrypts $m_L$, while the right oracle always encrypts $m_R$. The scheme is secure if no probabilistic polynomial-time adversary can determine which oracle it received, except with negligible advantage.

### Private-Key Encryption from LWE

The LWE sample itself can be used as a ciphertext, with the message encoded by shifting its noisy inner product by approximately $q/2$.

- **Key generation.** Choose a uniformly random secret

  $$
  \operatorname{sk}:=\mathbf s\leftarrow\mathbb Z_q^n.
  $$

- **Encryption.** For a bit $\mu\in\{0,1\}$, choose $\mathbf a\leftarrow\mathbb Z_q^n$ and $e\leftarrow\chi$, then output

  $$
  c:=(\mathbf a,b)
  :=
  \left(\mathbf a,
  \mathbf s^T\mathbf a+e+\mu\lfloor q/2\rfloor\right)
  \pmod q.
  $$

  Longer messages can be encrypted one bit at a time.

- **Decryption.** Compute the centered representative of

  $$
  b-\mathbf s^T\mathbf a\pmod q.
  $$

  Output $0$ if its absolute value is less than $q/4$, and output $1$ otherwise.

**Lemma 3.** The scheme is correct when

$$
\operatorname{Supp}(\chi)\subseteq(-q/4,q/4),
$$

and is CPA-secure under the decisional $\mathbf{LWE}(n,m=\operatorname{poly}(n),q,\chi)$ assumption.

For correctness, decryption leaves

$$
b-\mathbf s^T\mathbf a
=e+\mu\lfloor q/2\rfloor
\pmod q.
$$

When $\mu=0$, this value is within $q/4$ of $0$. When $\mu=1$, it is within $q/4$ of $q/2$. The threshold therefore distinguishes the two cases.

For security, the pair $(\mathbf a,\mathbf s^T\mathbf a+e)$ is an LWE sample and is computationally indistinguishable from uniform. Adding either message offset to a uniform value still produces a uniform value, so the ciphertext hides which bit was encrypted.

Correctness and the LWE assumption constrain $n$, $q$, and $\chi$, but do not completely determine them. Concrete parameters must also resist the best known LWE attacks for roughly $2^\lambda$ work.

**Open Problem 1.1.** Construct a natural private-key encryption scheme directly from the hardness of SIS.

SIS already gives a one-way function, so generic transformations provide the chain

$$
\begin{aligned}
\text{one-way function}
&\Longrightarrow \text{pseudorandom generator} \\
&\Longrightarrow \text{pseudorandom function} \\
&\Longrightarrow \text{private-key encryption}.
\end{aligned}
$$

The open problem is not whether SIS can imply private-key encryption, but whether it can do so through a clean, direct construction instead of this cumbersome sequence of generic transformations.

### Public-Key Encryption

Public-key encryption changes the private-key syntax in two ways:

- Key generation outputs both a public key $\operatorname{pk}$ and a secret key $\operatorname{sk}$.
- Encryption uses only $\operatorname{pk}$, while decryption still uses $\operatorname{sk}$.

Because the public key lets anyone encrypt messages, security must hold even when the adversary knows $\operatorname{pk}$ and can create as many ciphertexts as it wants. CPA security requires that it still cannot distinguish an encryption of one chosen message from an encryption of another.

### Public-Key Encryption from LWE (the LPR Scheme)

The Lyubashevsky-Peikert-Regev scheme uses short-secret LWE and a square public matrix.

- **Key generation.** Choose

  $$
  \mathbf A\leftarrow\mathbb Z_q^{n\times n},
  \qquad
  \mathbf s,\mathbf e\leftarrow\chi^n.
  $$

  Keep $\mathbf s$ secret and publish

  $$
  \operatorname{pk}
  :=
  (\mathbf A,\mathbf y^T=\mathbf s^T\mathbf A+\mathbf e^T).
  $$

- **Encryption.** For a bit $\mu\in\{0,1\}$, choose $\mathbf r,\mathbf x\leftarrow\chi^n$ and $x'\leftarrow\chi$, then output

  $$
  c:=(\mathbf a,b)
  :=
  \left(
  \mathbf A\mathbf r+\mathbf x,
  \mathbf y^T\mathbf r+x'+\mu\lfloor q/2\rfloor
  \right)
  \pmod q.
  $$

- **Decryption.** Compute the centered representative of $b-\mathbf s^T\mathbf a\pmod q$. Output $0$ if its absolute value is less than $q/4$, and output $1$ otherwise.

**Lemma 4.** The LPR scheme is correct if

$$
\operatorname{Supp}(\chi)
\subseteq
\left(
-\sqrt{\frac{q}{4(2n+1)}},
\sqrt{\frac{q}{4(2n+1)}}
\right),
$$

and is CPA-secure under $\mathbf{LWE}(n,m=2(n+1),q,\chi)$.

#### Why LPR decryption works

For a ciphertext

$$
(\mathbf a,b)
=
(\mathbf A\mathbf r+\mathbf x,
\mathbf y^T\mathbf r+x'+\mu\lfloor q/2\rfloor),
$$

decryption computes

$$
b-\mathbf s^T\mathbf a
=
\mathbf s^T\mathbf x+\mathbf e^T\mathbf r+x'
+\mu\lfloor q/2\rfloor
\pmod q.
$$

The first three terms are the total error. If every value drawn from $\chi$ is small enough, then the $2n+1$ products and terms contribute less than $q/4$ altogether. The result therefore lies near $0$ when $\mu=0$ and near $q/2$ when $\mu=1$, so the threshold test decrypts correctly.

#### Why LPR is CPA-secure

The proof uses a sequence of hybrids:

1. Start with the real public key and a real encryption of $\mu$.
2. Replace the LWE public-key component $\mathbf y$ with a uniformly random vector. Short-secret LWE, together with Lemma 2, says that an efficient adversary cannot notice this change.
3. Rewrite the ciphertext as $n+1$ short-secret LWE samples and replace it with

   $$
   (\mathbf a,b'+\mu\lfloor q/2\rfloor),
   $$

   where $\mathbf a$ and $b'$ are uniform.
4. Since adding a fixed value to a uniform value leaves it uniform, the final ciphertext is independent of $\mu$.

Thus encryptions of $0$ and $1$ are computationally indistinguishable. The scheme can also be modified to obtain ciphertext rate close to $1$ and can serve as a building block for primitives such as oblivious transfer.

### Public-Key Encryption from LWE (the Regev Scheme)

Regev's scheme uses a uniform secret rather than a short secret and a wider public matrix with $m=\Omega(n\log q)$ columns.

- **Key generation.** Choose $\mathbf s\leftarrow\mathbb Z_q^n$, $\mathbf A\leftarrow\mathbb Z_q^{n\times m}$, and $\mathbf e\leftarrow\chi^m$. Publish

  $$
  \operatorname{pk}=(\mathbf A,\mathbf y^T=\mathbf s^T\mathbf A+\mathbf e^T)
  $$

  and keep $\mathbf s$ secret.

- **Encryption.** For a bit $\mu\in\{0,1\}$, choose $\mathbf r\leftarrow\{0,1\}^m$ and output

  $$
  (\mathbf a,b)
  =
  (\mathbf A\mathbf r,
  \mathbf y^T\mathbf r+\mu\lfloor q/2\rfloor)
  \pmod q.
  $$

- **Decryption.** Compute $b-\mathbf s^T\mathbf a\pmod q$ and output $0$ if its absolute representative is less than $q/4$; otherwise output $1$.

Indeed,

$$
b-\mathbf s^T\mathbf a
=
\mathbf e^T\mathbf r+\mu\lfloor q/2\rfloor
\pmod q.
$$

Because $\mathbf r$ is binary, $|\mathbf e^T\mathbf r|$ remains below $q/4$ when the errors are sufficiently small. For security, LWE first lets us replace the public-key vector $\mathbf y$ by a uniform vector. The leftover hash lemma then shows that the ciphertext is statistically close to uniform and therefore hides $\mu$.

The main contrast with LPR is:

- Regev uses a uniform secret, a binary encryption vector, and no added error in the first ciphertext component.
- LPR uses short secrets and short encryption randomness, then relies directly on decisional LWE to make the ciphertext computationally close to random.

### Public-Key Encryption from LWE (the Dual Regev Scheme)

The dual Regev scheme of Gentry, Peikert, and Vaikuntanathan has a genuinely uniform public-key distribution, so every correctly shaped string can be a possible public key. This feature later becomes useful for identity-based encryption.

- **Key generation.** Choose $\mathbf A\leftarrow\mathbb Z_q^{n\times m}$ and $\mathbf r\leftarrow\{0,1\}^m$. Set

  $$
  \operatorname{pk}=(\mathbf A,\mathbf a=\mathbf A\mathbf r)
  $$

  and keep $\mathbf r$ secret.

- **Encryption.** For $\mu\in\{0,1\}$, choose $\mathbf s\leftarrow\mathbb Z_q^n$, $\mathbf e\leftarrow\chi^m$, and $x'\leftarrow\chi$. Output

  $$
  (\mathbf y^T,b)
  =
  (\mathbf s^T\mathbf A+\mathbf e^T,
  \mathbf s^T\mathbf a+x'+\mu\lfloor q/2\rfloor)
  \pmod q.
  $$

- **Decryption.** Compute

  $$
  b-\mathbf y^T\mathbf r
  =
  x'-\mathbf e^T\mathbf r+\mu\lfloor q/2\rfloor
  \pmod q
  $$

  and use the same $q/4$ threshold rule. As before, correctness follows when the accumulated error is smaller than $q/4$.

The construction is called *dual Regev* because its secret key $\mathbf r$ resembles the binary vector used inside a Regev ciphertext, while an LWE sample appears directly in its ciphertext.

### Large-Error LWE

**Open Problem 1.2.** Construct public-key encryption from LWE when the error distribution has large support, such as $[-cq,cq]$ for a constant $c$.

Large-error LWE already implies a one-way function and therefore gives private-key encryption through generic transformations. The open question asks whether public-key encryption inherently needs a smaller LWE error, or whether the apparent gap between private-key and public-key parameters can be closed.
