---
title: Lattices, LWE and Post-Quantum Cryptography - Chapter 4
date: 2026-09-15
description: Worst-case to average-case reductions for LWE.
series: Lattice Notes
seriesOrder: 4
---
# Chapter 4

## Worst-Case to Average-Case Reduction for LWE

The goal of this chapter is to justify average-case decisional LWE using worst-case lattice problems. The complete proof is assembled from several reductions:

$$
\begin{aligned}
\text{worst-case lattice problem}
& \longrightarrow
\text{BDD} \\
& \longrightarrow
\text{search LWE} \\
& \longrightarrow
\text{decision LWE}.
\end{aligned}
$$

The chapter also explains how binary secrets and modulus reduction extend the result to smaller moduli.

## Decision-to-Search Reduction for LWE

### Randomizing a Worst-Case Secret

Suppose the reduction receives samples

$$
\left(\mathbf A,\,
\mathbf b_{\mathrm{wc}}^T
=
\mathbf s_{\mathrm{wc}}^T\mathbf A+\mathbf e^T
\right)
$$

with an arbitrary secret $\mathbf s_{\mathrm{wc}}$. Choose

$$
\mathbf s_r\leftarrow\mathbb Z_q^n
$$

uniformly and set

$$
\mathbf b^T
:=
\mathbf b_{\mathrm{wc}}^T+\mathbf s_r^T\mathbf A.
$$

Then

$$
\mathbf b^T
=
(\mathbf s_{\mathrm{wc}}+\mathbf s_r)^T\mathbf A+\mathbf e^T.
$$

The new secret

$$
\mathbf s:=\mathbf s_{\mathrm{wc}}+\mathbf s_r
$$

is uniform regardless of the original secret. After recovering $\mathbf s$, the reduction outputs

$$
\mathbf s_{\mathrm{wc}}=\mathbf s-\mathbf s_r.
$$

Thus uniform-secret search LWE is already sufficient for solving search LWE with an adversarial secret.

### Distinguishing Advantage

A distinguisher between distributions $D_0$ and $D_1$ has advantage

$$
\operatorname{Adv}(D)
:=
\left|
\Pr_{x\leftarrow D_0}[D(x)=1]
-
\Pr_{x\leftarrow D_1}[D(x)=1]
\right|.
$$

An $\varepsilon$-distinguisher should satisfy

$$
\operatorname{Adv}(D)\ge\varepsilon.
$$

Equivalently, after possibly reversing its output labels,

$$
\Pr_{b\leftarrow\{0,1\},\,x\leftarrow D_b}[D(x)=b]
\ge
\frac12+\frac{\varepsilon}{2}.
$$

> **Correction.** The chapter prints the advantage condition with $\le\varepsilon$. The reduction and the equivalent success-probability statement require $\ge\varepsilon$.

### Theorem 15: Recovering the Secret Coordinate by Coordinate

**Theorem 15.** If decisional $\mathrm{LWE}_{n,m,q,\chi}$ has a $(T,\varepsilon)$ distinguisher, then search $\mathrm{LWE}_{n,m',q,\chi}$ can be solved with probability $1-o(1)$ in time

$$
T'
=
\widetilde O\left(\frac{Tnq}{\varepsilon^2}\right),
$$

using

$$
m'
=
\widetilde O\left(\frac{nmq}{\varepsilon^2}\right)
$$

samples.

#### Proof

Write the secret as

$$
\mathbf s=(s_1,\ldots,s_n).
$$

To test whether $g\in\mathbb Z_q$ equals $s_i$, take a fresh block

$$
(\mathbf A_\ell,\mathbf b_\ell^T),
\qquad
\mathbf b_\ell^T
=
\mathbf s^T\mathbf A_\ell+\mathbf e_\ell^T,
$$

choose a uniform row vector $\mathbf c_\ell^T$, and construct $\mathbf C_\ell$ whose $i$th row is $\mathbf c_\ell^T$ and whose other rows are zero. Give the distinguisher

$$
\mathbf A'_\ell
:=
\mathbf A_\ell+\mathbf C_\ell,
\qquad
\mathbf b_\ell'^T
:=
\mathbf b_\ell^T+g\mathbf c_\ell^T.
$$

If $g=s_i$, then

$$
\begin{aligned}
\mathbf b_\ell'^T
&=
\mathbf s^T\mathbf A_\ell+\mathbf e_\ell^T+s_i\mathbf c_\ell^T\\
&=
\mathbf s^T(\mathbf A_\ell+\mathbf C_\ell)+\mathbf e_\ell^T\\
&=
\mathbf s^T\mathbf A'_\ell+\mathbf e_\ell^T,
\end{aligned}
$$

so the modified sample is a genuine LWE sample.

If $g\ne s_i$, then

$$
\mathbf b_\ell'^T
=
\mathbf s^T\mathbf A'_\ell+\mathbf e_\ell^T
+(g-s_i)\mathbf c_\ell^T.
$$

When $q$ is prime, $g-s_i$ is invertible. Therefore

$$
(g-s_i)\mathbf c_\ell^T
$$

is uniform and independent, making the modified right-hand side uniform. The distinguisher can consequently tell whether the guess is correct.

Repeat each test

$$
L=O\left(\frac{\log n}{\varepsilon^2}\right)
$$

times. A Chernoff bound makes the probability of misclassifying one guess at most $1/n^2$. There are $nq$ guesses, so choosing the hidden logarithmic factor appropriately and applying a union bound recovers every coordinate with probability $1-o(1)$.

> **Parameter restriction.** For composite $q$, a nonzero $g-s_i$ need not be invertible. The simple proof therefore assumes prime $q$; composite moduli require a refined argument.

### Improvements to the Simple Reduction

- **Sample preservation:** Micciancio and Mol replace full independence with pairwise-independent techniques related to Goldreich--Levin and Impagliazzo--Naor, reducing the sample requirement to approximately $m'\approx m$.
- **Runtime dependence:** trying all $q$ values costs linear time in $q$, which is unusable when $q$ is exponentially large.
- **Direct worst-case reductions:** Peikert, Regev, and Stephens-Davidowitz give approaches that bypass parts of this search-to-decision route, especially for structured variants such as Ring-LWE.

### A $\operatorname{poly}(\log q)$ Reduction for $q=2^k$

Instead of testing all $q$ possible values of one coordinate, recover each coordinate bit by bit.

Define hybrid distributions $D_0,\ldots,D_k$ that output

$$
\left(
\mathbf a,\,
\langle\mathbf a,\mathbf s\rangle+e+r2^j
\pmod q
\right),
$$

where $r$ is uniform modulo $q$. Here $D_0$ is uniform and $D_k$ is LWE. If a distinguisher separates the endpoints with advantage $\varepsilon$, a hybrid argument gives some $j$ for which it separates $D_{j-1}$ and $D_j$ with advantage at least

$$
\frac{\varepsilon}{k}.
$$

To learn the least significant bit of $s_1$, transform a sample into

$$
\mathbf a'
=
\mathbf a+r2^{j-1}\mathbf u_1,
\qquad
b'=b,
$$

where $\mathbf u_1$ is the first unit vector. Since

$$
\langle\mathbf a,\mathbf s\rangle
=
\langle\mathbf a',\mathbf s\rangle
-r2^{j-1}s_1,
$$

the new sample belongs to $D_j$ when the bit is $0$ and to $D_{j-1}$ when it is $1$, up to a harmless relabeling of uniform $r$.

After recovering a bit, subtract its contribution from $b$ and divide the remaining secret search space accordingly. This recovers successive low bits. Adding a fresh Gaussian to the hybrids makes the first many hybrids statistically close, forcing the useful transition index $j$ to be large enough. The remaining polynomial-size high-bit space can then be recovered algebraically.

### Figure 4.1: Reduction Sequence

Figure 4.1 lists the small-modulus proof chain as:

1. Worst-case hardness of BDD/GapSVP.
2. Hardness of search LWE for $q\ge2^n$.
3. Hardness of decision LWE for special moduli, such as $q=2^k$.
4. Hardness of decision binary-secret LWE for those special moduli.
5. Hardness of decision binary-secret LWE for any small modulus $q$.

## Binary Secrets and Modulus Reduction

### From Uniform Secrets to Binary Secrets

Suppose

$$
\mathbf A=\mathbf B\mathbf C
$$

with

$$
\mathbf B\in\mathbb Z_q^{n\times k},
\qquad
\mathbf C\in\mathbb Z_q^{k\times m}.
$$

For a binary secret $\mathbf s$,

$$
\mathbf s^T\mathbf A+\mathbf e^T
=
(\mathbf s^T\mathbf B)\mathbf C+\mathbf e^T.
$$

If $\mathbf s$ has enough min-entropy and $k$ is slightly below

$$
\frac{H_\infty(\mathbf s)}{\log q},
$$

the leftover hash lemma makes $\mathbf s^T\mathbf B$ statistically close to uniform.

The naive argument fails because $\mathbf B\mathbf C$ has rank at most $k$ and is distinguishable from a uniform $n\times m$ matrix. The repair is to use

$$
\mathbf A=\mathbf B\mathbf C+\mathbf N,
$$

where $\mathbf N$ is an LWE error matrix. Then

$$
\mathbf s^T\mathbf A+\mathbf e^T
=
(\mathbf s^T\mathbf B)\mathbf C
+
(\mathbf s^T\mathbf N+\mathbf e^T).
$$

The term $\mathbf s^T\mathbf N$ may leak $\mathbf s$ and distort the error distribution. Noise flooding chooses $\mathbf e$ with a much larger Gaussian width so that

$$
\mathbf s^T\mathbf N+\mathbf e^T
$$

is statistically close to a fresh Gaussian independent of $\mathbf s^T\mathbf N$. Later work improves the resulting parameters and avoids the most wasteful flooding.

### Modulus Reduction

Starting with binary-secret LWE modulo $q$, choose a smaller modulus $p$ and round:

$$
\mathbf A'
:=
\left\lfloor\frac pq\mathbf A\right\rceil,
\qquad
\mathbf b'
:=
\left\lfloor\frac pq\mathbf b\right\rceil.
$$

Writing

$$
\mathbf b^T
=
\mathbf s^T\mathbf A+\mathbf e^T+q\mathbf z^T,
$$

scaling gives

$$
\frac pq\mathbf b^T
=
\mathbf s^T\mathbf A'
+
\mathbf s^T
\left\{\frac pq\mathbf A\right\}
+
\frac pq\mathbf e^T
+
p\mathbf z^T.
$$

Modulo $p$, this is almost LWE:

- $(p/q)\mathbf e$ is Gaussian with its width scaled from approximately $\alpha q$ to $\alpha p$.
- The rounding term $\mathbf s^T\{(p/q)\mathbf A\}$ is bounded because $\mathbf s$ is binary.
- Noise flooding, or sharper randomized rounding techniques, absorbs the bounded rounding error.

This formalizes the intuition that LWE hardness depends primarily on the noise-to-modulus ratio, rather than on the absolute modulus.

## Bounded Distance Decoding and LWE

For $c\in[0,1/2)$, the $c$-BDD problem gives:

- a lattice basis $\mathbf B$ for $\mathcal L$;
- a target $\mathbf t$ satisfying

  $$
  \operatorname{dist}(\mathbf t,\mathcal L)
  \le
  c\lambda_1(\mathcal L);
  $$

- the task of recovering the unique closest lattice vector.

The restriction $c<1/2$ guarantees uniqueness. If two different lattice vectors were both within distance $c\lambda_1$ of $\mathbf t$, their difference would be a nonzero lattice vector shorter than

$$
2c\lambda_1<\lambda_1,
$$

which is impossible.

For

$$
\mathbf A\in\mathbb Z_q^{n\times m},
$$

define the LWE lattice

$$
\Lambda(\mathbf A)
:=
\left\{
\mathbf z\in\mathbb Z^m:
\mathbf z=\mathbf s^T\mathbf A\pmod q
\text{ for some }\mathbf s\in\mathbb Z_q^n
\right\}.
$$

It satisfies

$$
q\mathbb Z^m
\subseteq
\Lambda(\mathbf A)
\subseteq
\mathbb Z^m.
$$

If $\mathbf A$ has full row rank, $\Lambda(\mathbf A)/q\mathbb Z^m$ contains $q^n$ cosets. Therefore

$$
\det(\Lambda(\mathbf A))
=
\frac{\det(q\mathbb Z^m)}{q^n}
=
\frac{q^m}{q^n}
=
q^{m-n}.
$$

The determinant heuristic predicts

$$
\lambda_1(\Lambda(\mathbf A))
\approx
\det(\Lambda(\mathbf A))^{1/m}
=
q^{1-n/m},
$$

up to dimension-dependent factors. An LWE sample

$$
\mathbf b^T
=
\mathbf s^T\mathbf A+\mathbf e^T
$$

is consequently a noisy point near the lattice vector $\mathbf s^T\mathbf A$. When $\|\mathbf e\|<\lambda_1/2$, decoding $\mathbf b$ is exactly a BDD instance. LWE is therefore an average-case BDD problem on a random $q$-ary lattice.

## Discrete Gaussians

### Definitions

The continuous Gaussian density with parameter $s$ is

$$
N_s(\mathbf x)
:=
\frac{1}{s^n}\rho_s(\mathbf x)
=
\frac1{s^n}e^{-\pi\|\mathbf x\|^2/s^2}.
$$

For a lattice $\mathcal L$, the discrete Gaussian is

$$
D_{\mathcal L,s}(\mathbf x)
:=
\frac{\rho_s(\mathbf x)}{\rho_s(\mathcal L)}
\quad
\text{for }\mathbf x\in\mathcal L,
$$

where

$$
\rho_s(\mathcal L)
:=
\sum_{\mathbf v\in\mathcal L}\rho_s(\mathbf v).
$$

The same definition applies to a coset $\mathcal L+\mathbf c$. Off-centered Gaussians use

$$
\rho_{s,\mathbf c}(\mathbf x)
:=
e^{-\pi\|\mathbf x-\mathbf c\|^2/s^2}.
$$

Above the smoothing parameter, discrete Gaussians behave much like continuous Gaussians.

### Lemma 16: Nearly Equal Gaussian Mass on Every Coset

**Lemma 16.** For every $\mathbf c\in\mathbb R^n$ and

$$
s\ge\eta_\varepsilon(\mathcal L),
$$

we have

$$
\rho_s(\mathcal L+\mathbf c)
\in
[1-2\varepsilon,1+2\varepsilon]\rho_s(\mathcal L).
$$

#### Proof

Poisson summation for the shifted Gaussian gives

$$
\begin{aligned}
\rho_s(\mathcal L+\mathbf c)
&=
\rho_{s,-\mathbf c}(\mathcal L)\\
&=
\det(\mathcal L^*)
\sum_{\mathbf z\in\mathcal L^*}
e^{2\pi i\langle\mathbf c,\mathbf z\rangle}
s^n\rho_{1/s}(\mathbf z).
\end{aligned}
$$

After factoring out the common $s^n\det(\mathcal L^*)$ normalization, the zero-frequency term equals $1$. The absolute contribution from all nonzero frequencies is at most

$$
\sum_{\mathbf z\in\mathcal L^*\setminus\{\mathbf0\}}
\rho_{1/s}(\mathbf z)
\le
\varepsilon.
$$

Thus every shifted coset has mass within a factor $1\pm\varepsilon$ of the common main term. Comparing this with the corresponding $1\pm\varepsilon$ estimate for $\rho_s(\mathcal L)$ yields the looser but convenient factor $1\pm2\varepsilon$.

As a corollary, if $\mathcal L'\subseteq\mathcal L$ and $s\ge\eta_\varepsilon(\mathcal L')$, then

$$
\mathbf v\leftarrow D_{\mathcal L,s},
\qquad
\mathbf v\bmod\mathcal L'
$$

is close to uniform over the finite quotient $\mathcal L/\mathcal L'$.

### Proposition 18: Scaling of Gaussian Mass

If $s_1,s_2\ge\eta_\varepsilon(\mathcal L)$, then

$$
\frac{\rho_{s_1}(\mathcal L)}
{\rho_{s_2}(\mathcal L)}
\in
[1-2\varepsilon,1+2\varepsilon]
\left(\frac{s_1}{s_2}\right)^n.
$$

Indeed, Poisson summation gives

$$
\rho_s(\mathcal L)
=
s^n\det(\mathcal L^*)\rho_{1/s}(\mathcal L^*)
\in
[1-\varepsilon,1+\varepsilon]
s^n\det(\mathcal L^*).
$$

Taking the ratio for $s_1$ and $s_2$ proves the claim.

### Lemma 17: Discrete Plus Continuous Gaussian

Let

$$
\mathbf v\leftarrow D_{\mathcal L,s},
\qquad
\mathbf w\leftarrow N_r,
$$

independently, with

$$
s,r\ge\sqrt2\,\eta_\varepsilon(\mathcal L).
$$

Then

$$
\mathbf v+\mathbf w
$$

is statistically close to

$$
N_t,
\qquad
t:=\sqrt{r^2+s^2}.
$$

#### Proof calculation

The density of $\mathbf Y=\mathbf v+\mathbf w$ at $\mathbf x$ is

$$
\begin{aligned}
Y(\mathbf x)
&=
\frac{1}{\rho_s(\mathcal L)r^n}
\sum_{\mathbf v\in\mathcal L}
\rho_s(\mathbf v)\rho_r(\mathbf x-\mathbf v).
\end{aligned}
$$

Complete the square using $t^2=r^2+s^2$:

$$
\frac{\|\mathbf v\|^2}{s^2}
+
\frac{\|\mathbf x-\mathbf v\|^2}{r^2}
=
\frac{\|\mathbf x\|^2}{t^2}
+
\frac{
\left\|
\mathbf v-\frac{s^2}{t^2}\mathbf x
\right\|^2
}{
(rs/t)^2
}.
$$

Therefore

$$
Y(\mathbf x)
=
\frac{\rho_t(\mathbf x)}{r^n\rho_s(\mathcal L)}
\rho_{rs/t,\,(s^2/t^2)\mathbf x}(\mathcal L).
$$

Because $r,s\ge\sqrt2\,\eta_\varepsilon(\mathcal L)$,

$$
\frac{rs}{t}
\ge
\eta_\varepsilon(\mathcal L).
$$

Lemma 16 removes the shift in the last lattice mass, and Proposition 18 gives

$$
\frac{\rho_{rs/t}(\mathcal L)}
{\rho_s(\mathcal L)}
\approx
\left(\frac rt\right)^n.
$$

Substitution yields

$$
Y(\mathbf x)
\in
[1-3\varepsilon,1+3\varepsilon]N_t(\mathbf x),
$$

so the statistical distance is at most $3\varepsilon$.

### A Simple Discrete-Gaussian Sampler

The GPV/Klein sampler works for widths approximately

$$
s
\ge
\omega(\sqrt{\log n})
\max_i\|\mathbf b_i\|.
$$

The chapter gives a weaker but simpler sampler for

$$
s
\ge
2^n\max_i\|\mathbf b_i\|.
$$

Sample a continuous Gaussian vector, express it in basis coordinates, round those coordinates to integers, and map back through $\mathbf B$. In precise coefficient notation:

$$
\mathbf v\leftarrow N_s,
\qquad
\mathbf v'
:=
\mathbf B
\left\lfloor
\mathbf B^{-1}\mathbf v
\right\rceil
\in\mathcal L(\mathbf B).
$$

For a lattice point $\mathbf w$ and rounding displacement $\mathbf x\in\mathcal P(\mathbf B)$,

$$
\rho_s(\mathbf w+\mathbf x)
=
\rho_s(\mathbf w)
\exp\left(
-\pi
\frac{
2\langle\mathbf w,\mathbf x\rangle+\|\mathbf x\|^2
}{s^2}
\right).
$$

For a typical Gaussian vector, $\|\mathbf w\|=O(s\sqrt n)$. Also,

$$
\|\mathbf x\|
\le
\sum_i\|\mathbf b_i\|
\le
n\max_i\|\mathbf b_i\|.
$$

Hence

$$
\frac{
|2\langle\mathbf w,\mathbf x\rangle+\|\mathbf x\|^2|
}{s^2}
\le
\frac{
2\|\mathbf w\|\|\mathbf x\|+\|\mathbf x\|^2
}{s^2},
$$

The exponentially large condition

$$
s\gg2^n\max_i\|\mathbf b_i\|
$$

makes this ratio negligible. The Gaussian is then nearly constant across each rounding cell, making the rounded distribution close to $D_{\mathcal L,s}$.

> **Notation clarification.** The source writes the output informally as $\mathbf B\lfloor\mathbf v\rfloor$. The dimensionally explicit form above rounds $\mathbf B^{-1}\mathbf v$ in coefficient space.

## From Worst-Case BDD to Average-Case LWE

Let

$$
\mathbf t
=
\mathbf B\mathbf u+\mathbf e
$$

be a BDD target, where $\mathbf B\mathbf u$ is the unknown closest lattice vector. The reduction uses the dual lattice

$$
\mathcal L^*=\mathcal L(\mathbf B^{-T}).
$$

Choose parameters satisfying, up to the constants used in the chapter,

$$
q\ge2^{2n},
\qquad
\sigma\ge q\sqrt2\,\eta_\varepsilon(\mathcal L^*),
\qquad
r\ge\sqrt2\,\|\mathbf e\|\eta_\varepsilon(\mathcal L^*).
$$

For each LWE sample:

1. Sample

   $$
   \mathbf v_i\leftarrow D_{\mathcal L^*,\sigma}.
   $$

2. Compute its coefficient vector modulo $q$:

   $$
   \mathbf a_i
   :=
   (\mathbf B^*)^{-1}\mathbf v_i
   =
   \mathbf B^T\mathbf v_i
   \pmod q.
   $$

3. Output

   $$
   b_i
   :=
   \langle\mathbf t,\mathbf v_i\rangle+e_i'
   \pmod q,
   \qquad
   e_i'\leftarrow N_r.
   $$

Run the search-LWE solver on the resulting matrix $\mathbf A$ and vector $\mathbf b$. Its recovered secret is the coefficient vector $\mathbf u\bmod q$, which identifies the closest lattice vector.

### Claim 19: The Public Vectors Are Uniform

Fix $\mathbf a\in\mathbb Z_q^n$. The event $\mathbf a_i=\mathbf a$ means that $\mathbf v_i$ lies in one coset of $q\mathcal L^*$:

$$
q\mathcal L^*+\mathbf B^*\mathbf a.
$$

Therefore

$$
\Pr[\mathbf a_i=\mathbf a]
=
\frac{
\rho_\sigma(q\mathcal L^*+\mathbf B^*\mathbf a)
}{
\sum_{\mathbf c\in\mathbb Z_q^n}
\rho_\sigma(q\mathcal L^*+\mathbf B^*\mathbf c)
}.
$$

Since

$$
\eta_\varepsilon(q\mathcal L^*)
=
q\eta_\varepsilon(\mathcal L^*)
$$

and $\sigma$ exceeds this value, Lemma 16 says that every numerator is within $1\pm2\varepsilon$ of the same mass. There are $q^n$ cosets, so

$$
\Pr[\mathbf a_i=\mathbf a]
\in
\frac1{q^n}[1-4\varepsilon,1+4\varepsilon].
$$

Thus the $\mathbf a_i$ are independently and statistically close to uniform.

### Claim 20: The Right-Hand Side Is an LWE Sample

Using

$$
\mathbf t=\mathbf B\mathbf u+\mathbf e
$$

and

$$
\mathbf v_i=\mathbf B^{-T}\mathbf a_i
$$

modulo the appropriate dual-lattice coset,

$$
\begin{aligned}
b_i
&=
\langle\mathbf t,\mathbf v_i\rangle+e_i'\\
&=
\langle\mathbf B\mathbf u+\mathbf e,\mathbf v_i\rangle+e_i'\\
&=
\langle\mathbf u,\mathbf a_i\rangle
+
\underbrace{\langle\mathbf e,\mathbf v_i\rangle+e_i'}_{e_i}
\pmod q.
\end{aligned}
$$

This is exactly the LWE equation with secret $\mathbf u$ and effective error

$$
e_i
=
\langle\mathbf e,\mathbf v_i\rangle+e_i'.
$$

Represent the added one-dimensional Gaussian as

$$
e_i'=\langle\mathbf e,\mathbf w_i\rangle
$$

for a suitable continuous Gaussian $\mathbf w_i$. Lemma 17 says that

$$
\mathbf v_i+\mathbf w_i
$$

is close to a continuous Gaussian. Projecting it onto $\mathbf e$ gives a one-dimensional Gaussian whose width is approximately

$$
\sigma\|\mathbf e\|
\approx
q\|\mathbf e\|\eta_\varepsilon(\mathcal L^*).
$$

If the BDD promise is

$$
\|\mathbf e\|\le c\lambda_1(\mathcal L),
$$

then transference and smoothing estimates give

$$
\frac{\text{error width}}q
\lesssim
c\lambda_1(\mathcal L)\eta_\varepsilon(\mathcal L^*)
\lesssim
c\sqrt n
$$

up to logarithmic factors. Taking

$$
c\ll\frac1{\sqrt n}
$$

therefore produces LWE with a meaningfully bounded, constant-scale noise-to-modulus ratio. In summary:

$$
\frac1{\sqrt n}\text{-BDD}
\quad\Longrightarrow\quad
\text{average-case LWE}.
$$

## From Worst-Case Lattice Problems to BDD

### Peikert's Classical GapSVP-to-BDD Reduction

Suppose the GapSVP instance promises either

$$
\lambda_1(\mathcal L)\le1
$$

or

$$
\lambda_1(\mathcal L)>\gamma.
$$

Assume access to a $c$-BDD solver.

1. Choose a lattice point $\mathbf z\in\mathcal L$.
2. Choose $\mathbf e$ uniformly from a ball of radius $c\gamma$.
3. Set

   $$
   \mathbf t:=\mathbf z+\mathbf e
   $$

   and run the BDD solver.
4. If it returns $\mathbf z$, answer “large $\lambda_1$”; otherwise answer “small $\lambda_1$.”

If $\lambda_1(\mathcal L)>\gamma$, then

$$
\|\mathbf e\|\le c\gamma<c\lambda_1(\mathcal L),
$$

so the BDD promise holds and the solver must return $\mathbf z$.

If $\lambda_1(\mathcal L)\le1$, take a shortest vector $\mathbf u$. The radius-$c\gamma$ balls centered at $\mathbf z$ and $\mathbf z+\mathbf u$ have substantial overlap when

$$
c\gamma\gtrsim\sqrt n\,\|\mathbf u\|.
$$

The target distribution is then almost unchanged when its hidden center is shifted by $\mathbf u$. A BDD solver cannot consistently identify the originally chosen center, so it returns a different lattice vector with noticeable probability. Repetition amplifies this gap.

The necessary scale is

$$
\gamma=O\left(\frac{\sqrt n}{c}\right).
$$

Combining $c\approx1/\sqrt n$ from BDD-to-LWE gives

$$
\gamma=O(n),
$$

and hence the classical chain

$$
O(n)\text{-GapSVP}
\longrightarrow
\frac1{\sqrt n}\text{-BDD}
\longrightarrow
\text{LWE}.
$$

> **Correction.** The source says “output NO” in both branches of the reduction. The second branch must output the opposite answer: equality means the large-$\lambda_1$ case, while a changed output signals the small-$\lambda_1$ case.

### Classical Versus Quantum Starting Assumptions

- Peikert's reduction is classical but starts from the decision problem GapSVP.
- Regev's reduction starts from the search problem SIVP but uses a quantum step.
- This difference matters for structured lattices, where decision GapSVP may be easier than the corresponding search problem.

## Open Problems and Findings

The problem statements below reproduce the chapter's wording. The chapter accidentally labels two different questions “Open Problem 4.1”; that numbering is retained and identified explicitly.

**Open Problem 4.1.** For which distributions of the secret $\mathbf s$ does the LWE assumption hold (assuming LWE with uniform secrets holds)?

**Finding.** Brakerski and Döttling subsequently proved hardness for broad classes of arbitrary entropic secrets once the distribution satisfies an explicit entropy threshold, and showed limitations demonstrating that such a threshold is necessary in general. This substantially answers the high-entropy part of the question, but it is not a complete classification of every low-entropy or highly structured secret distribution. See [Hardness of LWE on General Entropic Distributions](https://eprint.iacr.org/2020/119).

**Open Problem 4.2.** Does LWE remain hard if the secret vector is a random 0-1 vector with at most $\log n$ ones?

**Finding and calculation.** A uniformly random binary vector of weight $h$ has min-entropy

$$
H_\infty(\mathbf s)
=
\log_2\binom nh.
$$

For $h=\log_2n$, Stirling's approximation gives

$$
\log_2\binom n{\log_2n}
\approx
(\log_2n)
\log_2\left(\frac{en}{\log_2n}\right)
=
\Theta((\log n)^2).
$$

This is far below the entropy of a uniform $n$-coordinate secret, so general entropic-LWE theorems do not automatically settle the problem. No general reduction establishing hardness for this logarithmic-weight regime is known. Modern cryptanalysis specifically exploits sparse secrets, providing evidence that the regime needs separate analysis rather than an automatic appeal to ordinary LWE; see [The Cool and the Cruel: Separating Hard Parts of LWE Secrets](https://arxiv.org/abs/2403.10328) and [SALSA VERDE](https://arxiv.org/abs/2306.11641).

**Open Problem 4.1.** Show a (worst-case) reduction from SIVP (or SVP or CVP) to BDD.

**Finding.** Regev's SIVP-to-BDD route is quantum, while the standard polynomial-time classical result begins with decision GapSVP. A general polynomial-time classical reduction from the listed search problems to BDD remains open. Work beyond polynomial time obtains stronger classical worst-case foundations in other parameter regimes, but it does not provide the requested polynomial-time search-to-BDD reduction; see [Lattice Problems Beyond Polynomial Time](https://arxiv.org/abs/2211.11693).

## Chapter 4 Takeaway

The proof separates into two conceptual halves:

1. **Algebraic reductions** turn search LWE into decisional, binary-secret, and small-modulus variants.
2. **Geometric reductions** use discrete Gaussians to turn a worst-case BDD target into statistically uniform public LWE samples whose hidden secret identifies the closest lattice point.

The resulting classical foundation is approximately $O(n)$-GapSVP hardness, whereas the stronger search-SIVP foundation is obtained through Regev's quantum reduction. Smoothing is the common mechanism: it makes dual-lattice residue classes uniform while preserving enough hidden Gaussian structure to translate an LWE solution back into a worst-case lattice solution.
