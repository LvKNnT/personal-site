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

# Chapter 2

## The Learning with Errors Problem: Algorithms

This chapter studies three families of attacks against LWE:

- **Algebraic attacks** turn bounded errors into polynomial equations.
- **Combinatorial attacks** combine samples until most secret coordinates cancel.
- **Geometric attacks** interpret the error as an unusually short lattice vector.

Each attack succeeds in a different parameter regime. Secure LWE parameters must avoid all three.

## An Algebraic Algorithm: Arora-Ge

Suppose the error distribution is supported on a small set $S\subseteq\mathbb Z_q$. An LWE sample

$$
(\mathbf a,b=\mathbf a^T\mathbf s+e),
\qquad e\in S,
$$

gives the polynomial equation

$$
f_{\mathbf a,b}(\mathbf s)
:=
\prod_{x\in S}
\left(b-\mathbf a^T\mathbf s-x\right)
=0
\pmod q.
$$

One factor is zero because $b-\mathbf a^T\mathbf s=e\in S$. Thus every LWE sample supplies a degree-$|S|$ equation whose unknown is the secret $\mathbf s$.

Solving general polynomial systems is hard, but Arora-Ge works when there are many samples. A degree-$|S|$ polynomial in $n$ variables has roughly

$$
\binom{n+|S|}{|S|}
$$

possible monomials. Linearization treats every monomial as a separate variable, turning the polynomial system into an ordinary linear system. When

$$
m\gg\binom{n+|S|}{|S|},
$$

there are enough equations to solve the linearized system and, with high probability, recover the unique consistent secret.

### Binary-Error Intuition

Take the simplest case: $n=1$ and binary errors $e\in\{0,1\}$. An LWE sample has the form

$$
b=as+e\pmod q.
$$

Introduce an unknown $u$ intended to equal $-s$. Since $b+au=e$ for the correct value of $u$, and a binary value satisfies $e(e-1)=0$, every sample gives

$$
(b+au)(b+au-1)=0\pmod q.
$$

Expanding gives

$$
b(b-1)+(2b-1)au+a^2u^2=0\pmod q.
$$

This equation is nonlinear because it contains both $u$ and $u^2$. Linearization replaces those monomials by independent variables:

$$
u\rightsquigarrow u_1,
\qquad
u^2\rightsquigarrow u_2.
$$

The sample now supplies the linear equation

$$
p(a)
:=
b(b-1)+(2b-1)au_1+a^2u_2
=0
\pmod q.
\tag{2.1}
$$

At first glance, one might say that a nonzero quadratic vanishes on a uniform $a\leftarrow\mathbb Z_q$ with probability at most $2/q$. That argument cannot be applied directly because $b=as+e$ depends on $a$, so the coefficients of $p(a)$ are not independent of $a$.

Substitute $b=as+e$ first. Equation $(2.1)$ becomes

$$
\begin{aligned}
p'(a)
&=e(e-1)
 +(2e-1)(s+u_1)a
 +(u_2+2su_1+s^2)a^2 \\
&=(2e-1)(s+u_1)a
 +(u_2+2su_1+s^2)a^2
 \pmod q,
\end{aligned}
$$

because $e(e-1)=0$. For a fixed candidate $(u_1,u_2)$, the remaining coefficients are now independent of the random $a$.

The genuine linearized solution is

$$
u_1=-s,
\qquad
u_2=s^2.
$$

Both coefficients then vanish. Any false candidate gives a nonzero polynomial of degree at most two, so it passes a random sample with probability at most $2/q$. A Chernoff bound shows that a false candidate is unlikely to pass many samples, and a union bound eliminates all false candidates simultaneously.

### Discrete Gaussian Errors

Let $\chi$ be a discrete Gaussian with standard deviation $\sigma$. The probability that an error exceeds $k\sigma$ decreases as $e^{-O(k^2)}$. Therefore:

- All $m$ samples are likely to have errors bounded by $k\sigma$ when

  $$
  m\,e^{-O(k^2)}\ll1.
  $$

- Linearization needs more samples than the number of monomials associated with that error range.

Balancing these requirements gives an attack using approximately

$$
m\sim n^{\widetilde O(\sigma^2)}
$$

samples and time. It becomes nontrivial around $\sigma=\widetilde O(\sqrt n)$, which is also near the point where known worst-case-to-average-case security reductions for LWE stop applying.

> **Open Problem 2.1.** In the case of binary LWE (that is, LWE with 0-1 errors), Arora-Ge needs $m=\Omega(n^2)$ LWE samples. Come up with a more sample-efficient attack or prove that doing so is hard. A concrete way to demonstrate the latter would be to show that solving binary error LWE with $o(m^2)$ samples is as hard as solving the lattice (approximate) shortest vector problem.

The statement above is transcribed verbatim. Its final $o(m^2)$ is likely a notation slip for $o(n^2)$: throughout the chapter, $m$ already denotes the number of samples, while $n^2$ is the quadratic sample threshold under discussion.

### Status of Open Problem 2.1

This open problem does not currently have a complete solution. In particular, no known result simultaneously provides either:

- a polynomial-time attack on uniform binary-error LWE using $o(n^2)$ samples, or
- a worst-case lattice reduction proving hardness throughout the full subquadratic-sample regime.

There is, however, substantial partial progress:

- [Sun, Tibouchi, and Abe (2020)](https://eprint.iacr.org/2020/666) give a smooth time-sample tradeoff under a semi-regularity heuristic. With $\varepsilon n^2$ samples for constant $\varepsilon>0$, their algebraic attack runs in polynomial time $n^{O(1/\varepsilon)}$. With $n^{1+\alpha}$ samples, where $0<\alpha<1$, it runs in subexponential time

  $$
  2^{\widetilde O(n^{1-\alpha})}.
  $$

- At the low-sample end, binary-error LWE is reducible from standard hard lattice problems when only about

  $$
  n+O(n/\log n)
  $$

  samples are available.

- [Steiner (2024)](https://arxiv.org/abs/2402.07852) proves additional structural facts about the Arora-Ge polynomial system and gives rigorous ways to estimate Groebner-basis complexity from its degree of regularity. These results improve the analysis of algebraic attacks, but do not close the sample-complexity gap.

So the best honest "solution" is a boundary map: near-linear samples have worst-case lattice evidence for hardness, quadratic samples admit polynomial-time algebraic attacks, and intermediate $n^{1+\alpha}$ samples admit heuristic subexponential attacks. Closing the remaining gap is still an open research problem.

## A Combinatorial Algorithm: Blum-Kalai-Wasserman

The BKW attack tries to construct low-weight linear combinations of LWE samples that isolate coordinates of the secret.

Suppose $\mathbf x_{i,j}$ satisfies

$$
\mathbf A\mathbf x_{i,j}=\mathbf u_i\pmod q,
$$

where $\mathbf u_i$ is the $i$-th unit vector. Multiplying the LWE vector $\mathbf b^T=\mathbf s^T\mathbf A+\mathbf e^T$ by $\mathbf x_{i,j}$ gives

$$
\mathbf b^T\mathbf x_{i,j}
=s_i+\mathbf e^T\mathbf x_{i,j}
\pmod q.
$$

If $\mathbf x_{i,j}$ has small weight, its accumulated error remains small. Repeating and averaging estimates $s_i$, and doing this for every $i$ recovers $\mathbf s$.

Another variant targets

$$
\mathbf A\mathbf x_{i,j}=2^j\mathbf u_i\pmod q.
$$

The result reveals noisy multiples $2^js_i$. These allow the bits of $s_i$ to be decoded iteratively: recover the least significant bit, subtract it, divide by two, and repeat. Only $O(\log q)$ target multiples are needed.

### Bucketing and Cancellation

Split the $n$ rows of $\mathbf A$ into $\alpha$ blocks of size

$$
\beta:=n/\alpha.
$$

Write a column as blocks

$$
\mathbf a_i
=
\bigl(
\mathbf a_i^{(1)},
\mathbf a_i^{(2)},
\ldots,
\mathbf a_i^{(\alpha)}
\bigr),
\qquad
\mathbf a_i^{(j)}\in\mathbb Z_q^\beta.
$$

In the first round, place each column into one of $q^\beta$ buckets labeled by its first block $\mathbf a_i^{(1)}$.

#### Cancelling a block

If two columns $\mathbf a_i$ and $\mathbf a_j$ fall into the same bucket, then

$$
\mathbf a_i^{(1)}-\mathbf a_j^{(1)}=\mathbf0.
$$

Their difference therefore has its first $\beta$ coordinates equal to zero. The corresponding combination vector is

$$
\mathbf x=\mathbf e_i-\mathbf e_j,
$$

which has Hamming weight $2$.

Apply the same procedure to the second block of the newly created vectors. Subtracting two vectors whose second blocks agree zeros that block while preserving the blocks already zeroed. After round $r$, the first $r\beta$ coordinates are zero and each vector is a signed combination of at most $2^r$ original columns.

#### Matching a nonzero target

To obtain a target block $\mathbf v\in\mathbb Z_q^\beta$ instead of zero, pair a vector from the bucket labeled $\mathbf w$ with one from the bucket labeled $\mathbf w-\mathbf v$. Their difference begins with

$$
\mathbf w-(\mathbf w-\mathbf v)=\mathbf v.
$$

For a target such as the unit vector $\mathbf u_i$, process the block containing coordinate $i$ last. Cancel every other block using equal-label buckets, then use the offset-bucket rule in the final block to produce the required $1$. This yields a low-weight vector $\mathbf x_{i,j}$ satisfying

$$
\mathbf A\mathbf x_{i,j}=\mathbf u_i\pmod q.
$$

#### Why the complexity grows

Every round combines pairs, so the Hamming weight doubles:

$$
1,2,4,\ldots,2^\alpha.
$$

The error term is combined in exactly the same way. If every original error has magnitude at most $B$, then

$$
|\mathbf e^T\mathbf x_{i,j}|
\le
2^\alpha B.
$$

After $\alpha$ rounds, the resulting combination has Hamming weight about $2^\alpha$. If each original error is bounded by $B$, the combined error is about $2^\alpha B$, so correctness requires

$$
2^\alpha B\ll q,
\qquad\text{or equivalently}\qquad
\alpha\ll\log(q/B).
$$

There are $q^\beta$ possible bucket labels. A balls-and-bins argument therefore requires roughly $q^\beta$ starting samples to obtain enough useful pairs at each stage. Substituting $\beta=n/\alpha$ and choosing the largest noise-safe value $\alpha\approx\log(q/B)$ gives sample and time complexity

$$
q^\beta
\gg
q^{\,n/\log(q/B)}.
$$

For example, when $B=n$ and $q=n^2$, BKW runs in $2^{O(n)}$ time, improving on the $n^{O(n)}$ complexity of direct enumeration.

More refined variants reduce the sample count by generating new LWE samples from old ones, at the cost of increasing the noise. The same bucketing idea also appears in algorithms for the dihedral hidden subgroup problem.

### Figure 2.1: Summary of Asymptotic Parameter Settings Where Attacks Against LWE Work

| Algorithm | (Some) broken parameter settings |
| --- | --- |
| Arora-Ge | $m=\Omega(n^B)$ samples and time, where $\lvert \operatorname{Supp}(\chi) \rvert \le B<q$ |
| Blum-Kalai-Wasserman | $m>q^{\,n/\log(q/B)}$ samples and time |
| Lattice reduction | $m=\operatorname{poly}(n,\log q)$, $q/B=\Omega(2^n)$, and $\operatorname{poly}(n,\log q)$ time |

## A Geometric Suite of Algorithms: Lattice Reduction

The geometric attack uses LLL or BKZ to search for the LWE error as a short vector. Given

$$
\mathbf y^T=\mathbf s^T\mathbf A+\mathbf e^T,
$$

consider the $m$-dimensional $q$-ary lattice

$$
\mathcal L
:=
\left\{
\mathbf t^T\mathbf A+q\mathbf z^T:
\mathbf t\in\mathbb Z_q^n,
\mathbf z\in\mathbb Z^m
\right\}
$$

and the lattice $\mathcal L_{\mathbf y}$ generated by $\mathcal L$ together with $\mathbf y$. Since

$$
\mathbf y^T-\mathbf s^T\mathbf A=\mathbf e^T,
$$

the error vector belongs to $\mathcal L_{\mathbf y}$.

When $\chi$ is $B$-bounded:

- $\mathcal L_{\mathbf y}$ contains the unusually short vector $\mathbf e$, whose Euclidean norm is $\widetilde O(B)$ when polynomial factors in $m$ are hidden.
- A random $\mathcal L$ is unlikely to contain vectors shorter than roughly

  $$
  q^{(m-n)/m}=q\,q^{-n/m}.
  $$

  This also estimates the length of the second independent short vector in $\mathcal L_{\mathbf y}$.

The error is therefore separated from the other lattice vectors by a large gap. LLL finds a vector of length at most approximately

$$
\widetilde O\!\left(2^{m/\log m}B\right)
$$

in polynomial time. It recovers $\mathbf e$ when this is smaller than the next-shortest scale, which yields the condition

$$
\frac qB
\gg
q^{n/m}2^{m/\log m}.
$$

Optimizing the chosen sample dimension gives

$$
m\sim\sqrt{n\log q}
$$

and the approximate attack condition

$$
\frac qB\gg2^{\sqrt{n\log q}}.
$$

Thus lattice reduction is especially damaging when the modulus is exponentially large relative to the error. For polynomially bounded $B$, the notes summarize the clearly broken regime as roughly $q/B=\Omega(2^n)$ with polynomially many samples and polynomial running time.

The main lesson is that LWE hardness depends on a balance between dimension, modulus, noise magnitude, error support, and number of samples. Making the error support too small helps algebraic attacks; allowing too many samples helps algebraic and combinatorial attacks; and making $q/B$ too large creates a lattice gap that reduction algorithms can exploit.

# Chapter 3

## Worst-Case to Average-Case Reduction for SIS

This chapter explains why solving random SIS instances would have a much stronger consequence: it would give an algorithm for approximate short-vector problems on every lattice. The reduction combines lattice geometry, Gaussian smoothing, Fourier analysis, and an iterative basis-improvement procedure.

## Lattices and Minkowski's Theorem

For a full-rank basis matrix $\mathbf B\in\mathbb R^{n\times n}$, define

$$
\mathcal L(\mathbf B):=\mathbf B\mathbb Z^n
$$

and its fundamental parallelepiped

$$
\mathcal P(\mathbf B):=\mathbf B[0,1)^n.
$$

The parallelepiped contains one representative of each coset in $\mathbb R^n/\mathcal L$. Its shape depends on the chosen basis, but its volume does not. This invariant is the lattice determinant:

$$
\det(\mathcal L)=|\det(\mathbf B)|.
$$

### Successive Minima

The first minimum $\lambda_1(\mathcal L)$ is the length of a shortest nonzero lattice vector. More generally,

$$
\lambda_i(\mathcal L)
:=
\inf\left\{
r:
\dim\operatorname{Span}
\bigl(\mathcal L\cap\operatorname{Ball}(0,r)\bigr)
\ge i
\right\}.
$$

Thus $\lambda_i$ is the smallest radius containing $i$ linearly independent lattice vectors.

**Lemma 5 (Minkowski).** For every rank-$n$ lattice $\mathcal L$,

$$
\lambda_1(\mathcal L)
\le
\sqrt n\,\det(\mathcal L)^{1/n},
$$

and, more strongly,

$$
\det(\mathcal L)
\le
\prod_{i=1}^{n}\lambda_i(\mathcal L)
\le
n^{n/2}\det(\mathcal L).
$$

These inequalities formalize the intuition that a lattice with smaller determinant is denser and must contain shorter vectors.

#### Proof and calculation for Lemma 5

For the first inequality, apply Minkowski's convex-body theorem to the cube $K=[-r,r]^n$. Its volume is $(2r)^n$. If $r>\det(\mathcal L)^{1/n}$, then

$$
\operatorname{vol}(K)=(2r)^n>2^n\det(\mathcal L),
$$

so $K$ contains a nonzero lattice point $\mathbf v$. Since

$$
\|\mathbf v\|_\infty\le r
\quad\Longrightarrow\quad
\|\mathbf v\|_2\le\sqrt n\,r,
$$

letting $r\downarrow\det(\mathcal L)^{1/n}$ gives

$$
\lambda_1(\mathcal L)
\le
\sqrt n\,\det(\mathcal L)^{1/n}.
$$

For the product lower bound, choose independent lattice vectors $\mathbf v_i$ with lengths arbitrarily close to $\lambda_i(\mathcal L)$. They generate a sublattice, so its determinant is an integer multiple of $\det(\mathcal L)$. Hadamard's inequality gives

$$
\det(\mathcal L)
\le
|\det(\mathbf v_1,\ldots,\mathbf v_n)|
\le
\prod_{i=1}^n\|\mathbf v_i\|.
$$

Taking $\|\mathbf v_i\|\downarrow\lambda_i$ proves the lower product bound. The upper product bound is Minkowski's second theorem applied to the Euclidean unit ball; bounding the ball-volume constant yields

$$
\prod_{i=1}^n\lambda_i(\mathcal L)
\le n^{n/2}\det(\mathcal L).
$$

For example, if $n=4$ and $\det(\mathcal L)=16$, then

$$
\lambda_1(\mathcal L)le\sqrt4\cdot16^{1/4}=2\cdot2=4.
$$

### SVP and SIVP

- In $\gamma$-approximate **SVP**, the goal is to find a nonzero $\mathbf v\in\mathcal L$ satisfying

  $$
  \|\mathbf v\|\le\gamma\lambda_1(\mathcal L).
  $$

- In $\gamma$-approximate **SIVP**, the goal is to find $n$ linearly independent vectors $\mathbf v_1,\ldots,\mathbf v_n$ satisfying

  $$
  \|\mathbf v_i\|\le\gamma\lambda_n(\mathcal L)
  $$

  for every $i$.

The SIS reduction in this chapter starts from SIVP rather than SVP.

## Lattice Smoothing

### Lattice Duality

The dual of a rank-$n$ lattice is

$$
\mathcal L^*
:=
\left\{
\mathbf x\in\mathbb R^n:
\langle\mathbf x,\mathbf y\rangle\in\mathbb Z
\text{ for every }\mathbf y\in\mathcal L
\right\}.
$$

Some basic examples and properties are:

- $(k\mathbb Z)^*=(1/k)\mathbb Z$.
- $(\mathbb Z^n)^*=\mathbb Z^n$.
- If $\mathcal L=\mathcal L(\mathbf B)$, then $\mathcal L^*$ has basis $\mathbf B^{-T}$.
- The determinants satisfy

  $$
  \det(\mathcal L^*)=\det(\mathcal L)^{-1}.
  $$

This means that making a lattice sparser makes its dual denser.

**Lemma 6.** Minkowski's theorem applied to $\mathcal L$ and $\mathcal L^*$ gives

$$
\lambda_1(\mathcal L^*)\lambda_1(\mathcal L)\le n.
$$

A stronger transference inequality is

$$
\lambda_1(\mathcal L^*)\lambda_n(\mathcal L)\le n.
$$

#### Proof of Lemma 6

Apply Lemma 5 to both lattices:

$$
\lambda_1(\mathcal L)
\le
\sqrt n\det(\mathcal L)^{1/n},
$$

and

$$
\lambda_1(\mathcal L^*)
\le
\sqrt n\det(\mathcal L^*)^{1/n}
=
\sqrt n\det(\mathcal L)^{-1/n}.
$$

Multiplication cancels the determinant and proves

$$
\lambda_1(\mathcal L^*)\lambda_1(\mathcal L)le n.
$$

The stronger inequality with $\lambda_n(\mathcal L)$ is a transference theorem; it does not follow merely by replacing $\lambda_1$ with the larger $\lambda_n$ in this calculation.

**Lemma 7.** In the other direction,

$$
\lambda_n(\mathcal L^*)\lambda_1(\mathcal L)\ge1.
$$

The reason is that among $n$ independent dual vectors, at least one has a nonzero inner product with a shortest primal vector. That inner product is an integer, so its absolute value is at least $1$.

#### Proof of Lemma 7

Let $\mathbf x\in\mathcal L$ be a shortest nonzero vector, so $\|\mathbf x\|=\lambda_1(\mathcal L)$. Choose independent $\mathbf y_1,\ldots,\mathbf y_n\in\mathcal L^*$ whose maximum length is arbitrarily close to $\lambda_n(\mathcal L^*)$.

They span $\mathbb R^n$, so not all $\langle\mathbf x,\mathbf y_i\rangle$ vanish. For some $i$,

$$
\langle\mathbf x,\mathbf y_i\rangle\in\mathbb Z\setminus\{0\}.
$$

By integrality and Cauchy--Schwarz,

$$
1
\le
|\langle\mathbf x,\mathbf y_i\rangle|
\le
\|\mathbf x\|\,\|\mathbf y_i\|
\le
\lambda_1(\mathcal L)
\bigl(\lambda_n(\mathcal L^*)+\delta\bigr).
$$

Letting $\delta\to0$ proves

$$
\lambda_n(\mathcal L^*)\lambda_1(\mathcal L)\ge1.
$$

### Gaussians and Fourier Analysis

The Gaussian function with parameter $s$ is

$$
\rho_s(\mathbf x)
:=
e^{-\pi\|\mathbf x\|^2/s^2}.
$$

Its integral over $\mathbb R^n$ is $s^n$, so $\rho_s/s^n$ is a probability density. A crucial property is that the Fourier transform of a Gaussian is another Gaussian:

$$
\widehat{\rho_s}(\mathbf y)
=
s^n\rho_{1/s}(\mathbf y).
$$

This can be calculated coordinate by coordinate. In one dimension,

$$
\int_{\mathbb R}
e^{-\pi x^2/s^2}e^{-2\pi ixy}\,dx
=
s e^{-\pi s^2y^2}.
$$

Taking the product of the $n$ one-dimensional integrals gives

$$
\widehat{\rho_s}(\mathbf y)
=s^n e^{-\pi s^2\|\mathbf y\|^2}
=s^n\rho_{1/s}(\mathbf y).
$$

For an $\mathcal L$-periodic function, the Fourier frequencies lie in $\mathcal L^*$. Fourier inversion and periodization yield the Poisson summation formula:

$$
\sum_{\mathbf x\in\mathcal L}f(\mathbf x)
=
\frac{1}{\det(\mathcal L)}
\sum_{\mathbf y\in\mathcal L^*}\widehat f(\mathbf y).
$$

This formula is the bridge between a Gaussian modulo the primal lattice and Gaussian mass on the dual lattice.

### The Smoothing Principle

Sample $\mathbf x$ from the continuous Gaussian $\rho_s/s^n$ and reduce it modulo $\mathcal P(\mathbf B)$. The resulting density is

$$
\phi_s(\mathbf v)
=
\frac{1}{s^n}
\sum_{\mathbf y\in\mathcal L}
\rho_s(\mathbf v+\mathbf y).
$$

Poisson summation gives the Fourier expansion

$$
\phi_s(\mathbf v)
=
\frac{1}{\det(\mathcal L)}
\sum_{\mathbf y\in\mathcal L^*}
\rho_{1/s}(\mathbf y)e^{2\pi i\langle\mathbf y,\mathbf v\rangle}.
$$

The $\mathbf y=\mathbf0$ term is exactly the uniform density $1/\det(\mathcal L)$. Applying the triangle inequality to the remaining Fourier coefficients and integrating over one fundamental region bounds the statistical distance by

$$
\Delta(\phi_s,U_{\mathcal P(\mathbf B)})
\le
\sum_{\mathbf y\in\mathcal L^*\setminus\{\mathbf0\}}
\rho_{1/s}(\mathbf y)
=:
\rho_{1/s}(\mathcal L^*\setminus\{\mathbf0\}).
\tag{3.1}
$$

The smoothing parameter $\eta_\varepsilon(\mathcal L)$ is the scale at which this nonzero dual Gaussian mass is at most $\varepsilon$. Above this scale, reducing the Gaussian modulo the lattice nearly erases all information about where the sample originated.

### Bounding the Nonzero Gaussian Mass

**Lemma 13.** A packing argument bounds the number of lattice vectors of length at most $r$:

$$
\left|
\left\{\mathbf y\in\mathcal L:\|\mathbf y\|\le r\right\}
\right|
\le
\left(1+\frac{2r}{\lambda_1(\mathcal L)}\right)^n.
$$

Place disjoint balls of radius $\lambda_1/2$ around the relevant lattice points. They all fit inside a ball of radius $r+\lambda_1/2$, so comparing volumes gives the bound.

More explicitly, write $\lambda=\lambda_1(\mathcal L)$ and let $N(r)$ be the number of lattice points in the radius-$r$ ball. Then

$$
N(r)\operatorname{vol}(B_{\lambda/2})
\le
\operatorname{vol}(B_{r+\lambda/2}).
$$

Since $n$-dimensional ball volume scales as the $n$th power of its radius,

$$
N(r)
\le
\left(\frac{r+\lambda/2}{\lambda/2}\right)^n
=
\left(1+\frac{2r}{\lambda}\right)^n.
$$

**Lemma 14.** Combining this counting bound with the decay of the Gaussian shows that, for an absolute constant $C\approx3$,

$$
\sum_{\mathbf y\in\mathcal L}\rho_s(\mathbf y)
=1+2^{-O(n)}
$$

whenever

$$
\lambda_1(\mathcal L)
>
Cs\sqrt{\frac{n}{2\pi e}}.
$$

#### Proof calculation for Lemma 14

Use the layer-cake identity $a=\int_0^1\mathbf1[a\ge t]dt$ for $0\le a\le1$:

$$
\sum_{\mathbf y\in\mathcal L}\rho_s(\mathbf y)
=
\int_0^1
\left|
\left\{\mathbf y\in\mathcal L:\rho_s(\mathbf y)\ge t\right\}
\right|dt.
$$

The condition $\rho_s(\mathbf y)\ge t$ is equivalent to

$$
\|\mathbf y\|
\le
s\sqrt{\frac{\log(1/t)}{\pi}}.
$$

All nonzero lattice vectors have length at least $\lambda:=\lambda_1(\mathcal L)$. Substitute $t=e^{-\pi r^2/s^2}$, so $|dt|=(2\pi r/s^2)e^{-\pi r^2/s^2}dr$, and apply Lemma 13:

$$
\sum_{\mathbf y\in\mathcal L}\rho_s(\mathbf y)
\le
1+
\frac{2\pi}{s^2}
\int_\lambda^\infty
\left(\frac{3r}{\lambda}\right)^n
r e^{-\pi r^2/s^2}\,dr.
$$

With $w=\pi r^2/s^2$, the remaining integral is an incomplete gamma tail. Standard gamma bounds make it exponentially small in $n$ when

$$
\frac{Cs}{\lambda}
\sqrt{\frac{n}{2\pi e}}<1
$$

for an absolute constant $C$ (the notes take $C\approx3$). This gives the claimed $1+2^{-O(n)}$ bound.

Applying the lemma to $\mathcal L^*$ with Gaussian parameter $1/s$, then using Lemma 7, gives the sufficient smoothing bound

$$
s
\ge
C\lambda_n(\mathcal L)
\sqrt{\frac{n}{2\pi e}}.
$$

To check the substitution, Lemma 7 with the primal and dual interchanged gives

$$
\lambda_1(\mathcal L^*)
\ge
\frac{1}{\lambda_n(\mathcal L)}.
$$

Lemma 14 for $\mathcal L^*$ at parameter $1/s$ requires

$$
\lambda_1(\mathcal L^*)
>
\frac Cs\sqrt{\frac{n}{2\pi e}},
$$

which is ensured by the displayed lower bound on $s$.

At such a scale, the Gaussian reduced modulo $\mathcal L$ is exponentially close to uniform.

## Worst-Case to Average-Case Reduction for SIS

The original reduction is due to Ajtai; this presentation follows later formulations by Micciancio and Regev. It first explains the idea using SIS over the torus and then discretizes it to ordinary modular SIS.

### Step 1: SIS Over the Torus

Let $\mathbb T:=\mathbb R/\mathbb Z$. In $\mathrm{SIS}_{\mathbb T}$, the input is a matrix

$$
\mathbf A\in\mathbb T^{n\times m},
$$

and the goal is to find a small nonzero $\mathbf z\in\mathbb Z^m$ such that

$$
\mathbf A\mathbf z=\mathbf0\pmod1.
$$

Given a worst-case lattice basis $\mathbf B$, the reduction independently samples Gaussian columns

$$
\mathbf x_i\leftarrow\rho_s/s^n,
\qquad
s\ge\eta_\varepsilon(\mathcal L),
$$

and reduces them modulo the fundamental parallelepiped:

$$
\mathbf v_i
=
\mathbf x_i\pmod{\mathcal P(\mathbf B)}.
$$

Smoothing makes each $\mathbf v_i$ statistically close to uniform over $\mathcal P(\mathbf B)$. Therefore

$$
\mathbf a_i:=\mathbf B^{-1}\mathbf v_i\in\mathbb T^n
$$

is close to uniform over $[0,1)^n$. Repeating this produces a nearly uniform matrix

$$
\mathbf A=\mathbf B^{-1}\mathbf V.
$$

The reduction gives $\mathbf A$ to the average-case SIS solver but privately retains the unreduced Gaussian matrix $\mathbf X$.

### Step 2: Turn an SIS Solution Into a Lattice Vector

Suppose the solver returns a nonzero short vector $\mathbf z$ satisfying $\mathbf A\mathbf z\in\mathbb Z^n$. Then

$$
\mathbf V\mathbf z\in\mathcal L(\mathbf B).
$$

Because every column of $\mathbf X$ and $\mathbf V$ differs by a lattice vector,

$$
\mathbf X\mathbf z\in\mathcal L(\mathbf B)
$$

as well. It is short with high probability:

$$
\|\mathbf X\mathbf z\|
\approx
s\|\mathbf z\|\sqrt n.
$$

For a fixed $\mathbf z$, every coordinate of $\mathbf X\mathbf z$ is Gaussian with variance

$$
\frac{s^2}{2\pi}\|\mathbf z\|_2^2.
$$

Therefore

$$
\mathbb E\bigl[\|\mathbf X\mathbf z\|_2^2\bigr]
=
\frac{ns^2}{2\pi}\|\mathbf z\|_2^2,
$$

and its root-mean-square length is

$$
s\|\mathbf z\|_2\sqrt{\frac{n}{2\pi}}.
$$

Thus $s\|\mathbf z\|\sqrt n$ suppresses only the constant $1/\sqrt{2\pi}$ and a concentration slack factor.

For a binary $\mathbf z$, $\|\mathbf z\|\le\sqrt m$, and taking $s$ near the smoothing bound gives a lattice vector of length roughly

$$
\lambda_n(\mathcal L)\sqrt{mn}
$$

up to logarithmic factors.

### Step 3: Discretize to Ordinary SIS

Real torus coordinates are replaced by multiples of $1/q$:

$$
\mathbf A
=
\mathbf Q+\mathbf E
\pmod1,
$$

where

$$
q\mathbf Q\in\mathbb Z^{n\times m},
\qquad
\|\mathbf E\|_\infty\le\frac{1}{2q}.
$$

The matrix $q\mathbf Q$ is uniform modulo $q$ and can be given to an ordinary SIS solver. If the solver returns $\mathbf z$ such that

$$
q\mathbf Q\mathbf z=\mathbf0\pmod q,
$$

then

$$
(\mathbf X-\mathbf B\mathbf E)\mathbf z
\in
\mathcal L(\mathbf B).
$$

Its norm satisfies

$$
\|(\mathbf X-\mathbf B\mathbf E)\mathbf z\|
\le
s\|\mathbf z\|\sqrt n
+
\frac{\|\mathbf z\|_1}{q}
\max_i\|\mathbf b_i\|_2,
$$

where $\mathbf b_i$ are the basis vectors. The first term is controlled by smoothing, while the second is the rounding error.

For binary $\mathbf z$,

$$
\|\mathbf z\|_2\le\sqrt m,
\qquad
\|\mathbf z\|_1\le m.
$$

The complete estimate is therefore

$$
\|(\mathbf X-\mathbf B\mathbf E)\mathbf z\|_2
\lesssim
s\sqrt{mn}
+
\frac mq\max_i\|\mathbf b_i\|_2.
$$

The first term is a geometry-dependent floor; the second is the part that contracts when $q/m$ is large.

### Step 4: Iterative Basis Improvement

The discretized reduction does not immediately output an optimally short vector. Instead, it reduces the longest basis-vector length by a factor of approximately

$$
\frac{q}{\|\mathbf z\|_1}
\ge
\frac qm.
$$

When $q\gg m$ and typically $m\approx n\log q$, this is a genuine improvement. Repeating the reduction produces progressively shorter independent lattice vectors until their lengths are approximately

$$
\lambda_n(\mathcal L)\,\widetilde O(n).
$$

Thus an average-case SIS solver yields an algorithm for roughly $\widetilde O(n)$-approximate worst-case SIVP.

#### Worked parameter calculation

Take the illustrative values

$$
n=256,
\qquad
q=2^{16}=65{,}536,
\qquad
m\approx n\log_2q=4096.
$$

For a binary solution, $\|\mathbf z\|_1\le4096$, so

$$
\frac{\|\mathbf z\|_1}{q}
\le
\frac{4096}{65536}
=
\frac1{16}.
$$

One iteration therefore reduces the contribution inherited from the longest old basis vector by about a factor of $16$. Iteration cannot shrink indefinitely because the Gaussian term $s\sqrt{mn}$ remains as an additive floor; with $s$ near the smoothing parameter, that floor is governed by $\lambda_n(\mathcal L)$.

### Why the Output Is Nonzero

The SIS solver sees only the reduced matrix $\mathbf V=\mathbf X\bmod\mathcal P(\mathbf B)$, not the hidden Gaussian matrix $\mathbf X$. Smoothing guarantees that many possible values of $\mathbf X$ are compatible with the same $\mathbf V$.

Therefore, even if the solver chooses $\mathbf z$ adversarially after seeing $\mathbf V$, it lacks enough information to force

$$
(\mathbf X-\mathbf B\mathbf E)\mathbf z=\mathbf0.
$$

The same information-theoretic idea is used to obtain $n$ linearly independent output vectors for the iterative SIVP reduction.

## Open Problems

The statements below retain the wording of the chapter; the findings are separate status notes rather than changes to the problems.

**Open Problem 3.1.** Show a reduction from $\sqrt n$-SIVP (or better) to average-case SIS.

**Finding.** This remains open for polynomial-time reductions in the standard parameter regime. Aggarwal, Bennett, Brakerski, Golovnev, Kumar, Li, Peters, Stephens-Davidowitz, and Vaikuntanathan obtained a related advance in the $2^{\varepsilon n}$-time regime: their reduction supports cryptography from roughly $\widetilde O(\sqrt n)$-approximate decision-SVP hardness. This does not settle the polynomial-time problem as stated. See [Lattice Problems Beyond Polynomial Time](https://arxiv.org/abs/2211.11693).

**Open Problem 3.2.** Show a reduction from approximate SIVP to SIS with modulus $q = O(1)$.

**Finding.** No standard worst-case lattice reduction with constant SIS modulus is known. The GPV framework improved the modulus needed by earlier reductions from roughly quadratic to nearly linear in the dimension, but not to a constant; see [Trapdoors for Hard Lattices and New Cryptographic Constructions](https://www.mit.edu/~vinodv/papers/trapcvp.pdf). At $q=2$, the equation $\mathbf A\mathbf z=\mathbf0\bmod2$ is closely related to finding a short codeword in a random binary linear code. That coding-theoretic connection provides intuition, but not the missing SIVP-to-SIS reduction.

**Open Problem 3.3.** Show a reduction from worst-case SVP to (average-case) SIS.

**Finding.** Search SVP and decision GapSVP must be distinguished here. Standard SIS hardness results may be based on decision GapSVP or on SIVP, but this problem asks for a reduction that produces a vector controlled by $\lambda_1$. The Gaussian basis-improvement argument naturally controls $\lambda_n$ and produces independent vectors, so it does not directly solve search SVP. The exponential-time result cited above concerns decision SVP and does not close this formulation.

**Open Problem 3.4.** Show a reduction from worst-case SIS to average-case SIS without going through lattices.

**Finding.** A direct random self-reduction for standard modular SIS is still not known. Random invertible transformations can hide the presentation of a worst-case matrix, but they do not obviously turn its structured kernel into the kernel distribution of a uniformly random matrix while preserving a short nonzero witness. A 2026 preprint proves a worst-case-to-average-case result for the different, non-modular problem $\mathrm{SIS}_{\mathbb Z}$, using exact equations $\mathbf A\mathbf x=\mathbf0$ over the integers and an $\widetilde O(n^{3/2})$ SIVP factor. Because it changes the problem and still starts from SIVP, it does not solve Open Problem 3.4; see [Worst--Case to Average--Case Reductions for SIS over integers](https://arxiv.org/abs/2603.07274).

The chapter's central insight is that Gaussian smoothing lets the reduction hide an arbitrary worst-case lattice inside a statistically uniform SIS instance, while privately retained Gaussian information converts an SIS solution back into short lattice vectors.
