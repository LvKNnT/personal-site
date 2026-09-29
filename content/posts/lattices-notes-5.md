---
title: Lattices, LWE and Post-Quantum Cryptography - Chapter 5
date: 2026-09-28
description: Direct pseudorandom functions from LWE and collision-resistant hashing from SIS.
series: Lattice Notes
seriesOrder: 5
---
# Chapter 5

## Pseudorandom Functions from Lattices

This chapter builds pseudorandom functions (PRFs) from LWE and ends with a collision-resistant hash function from SIS. A generic route already exists:

$$
\text{LWE/SIS}
\Longrightarrow
\text{one-way function}
\Longrightarrow
\text{PRG}
\Longrightarrow
\text{GGM PRF}.
$$

The direct lattice constructions are more interesting because they expose extra structure:

- parallel evaluation;
- approximate key homomorphism;
- compatibility with constrained evaluation in later chapters;
- a concrete connection among gadget decompositions, LWE, and learning with rounding.

## Pseudorandom Generator from LWE

For a public matrix

$$
\mathbf A\in\mathbb Z_q^{n\times m},
$$

consider

$$
G_{\mathbf A}(\mathbf s;\mathbf e)
:=
\mathbf s^T\mathbf A+\mathbf e^T
\pmod q.
$$

Under decisional LWE, this output is computationally indistinguishable from uniform.

There are two qualifications:

1. This is an indexed family of PRGs: a random public matrix $\mathbf A$ selects one function.
2. If the error $\mathbf e$ is treated as a full element of $\mathbb Z_q^m$, the apparent input has at least as many symbols as the output and there is no stretch.

The second point is resolved by counting the random bits actually needed to sample a narrow error. If the error width is approximately $\alpha q$, its entropy is roughly

$$
m\log(\alpha q)
$$

bits rather than $m\log q$. The input length is approximately

$$
n\log q+m\log(\alpha q),
$$

while the output contains

$$
m\log q
$$

bits. Positive stretch requires

$$
m\log q
>
n\log q+m\log(\alpha q),
$$

or equivalently

$$
m\log(1/\alpha)>n\log q.
$$

For sufficiently many samples $m$ and sufficiently narrow LWE noise, the map is therefore an expanding pseudorandom generator.

## The Generic GGM Construction

The Goldreich--Goldwasser--Micali construction converts any length-doubling PRG

$$
G(k)=G_0(k)\,\|\,G_1(k)
$$

into a PRF. For an input

$$
x=x_1\cdots x_\ell,
$$

it follows one branch of a binary tree:

$$
F_k(x)
:=
G_{x_\ell}\bigl(
\cdots G_{x_2}(G_{x_1}(k))\cdots
\bigr).
$$

A hybrid argument replaces one tree level at a time with independent uniform values. If an adversary distinguished the final function from random, some hybrid transition would distinguish the underlying PRG from uniform.

Applying GGM to an LWE-derived PRG gives an LWE-based PRF, but the construction is sequential and hides the algebraic properties of LWE. The rest of the chapter develops more direct alternatives.

## The BLMR13 Construction

### Gadget Matrix

Let

$$
d:=\lceil\log_2q\rceil
$$

and define the gadget vector

$$
\mathbf g=(1,2,4,\ldots,2^{d-1})\in\mathbb Z_q^{1\times d}.
$$

The gadget matrix is the block-diagonal matrix

$$
\mathbf G
:=
\mathbf I_n\otimes\mathbf g
\in
\mathbb Z_q^{n\times nd}.
$$

It satisfies

$$
\mathbf G\{0,1\}^{nd}
=
\mathbb Z_q^n:
$$

every vector modulo $q$ has a binary gadget decomposition.

For example, when $n=2$ and $q=7$,

$$
\mathbf G
=
\begin{pmatrix}
1&2&4&0&0&0\\
0&0&0&1&2&4
\end{pmatrix}.
$$

Writing

$$
v_1=v_{10}+2v_{11}+4v_{12},
\qquad
v_2=v_{20}+2v_{21}+4v_{22},
$$

with binary digits gives

$$
\mathbf G
\begin{pmatrix}
v_{10}\\v_{11}\\v_{12}\\
v_{20}\\v_{21}\\v_{22}
\end{pmatrix}
=
\begin{pmatrix}v_1\\v_2\end{pmatrix}
\pmod7.
$$

Denote a chosen binary decomposition by

$$
\mathbf G^{-}(\mathbf v)=\mathbf w,
\qquad
\mathbf G\mathbf w=\mathbf v\pmod q.
$$

The symbol $\mathbf G^{-}$ is not a matrix inverse. It is a decomposition map and may be multivalued when a residue has more than one valid binary representation. Applied column-wise, it decomposes a matrix.

### Flipped LWE

Normal LWE uses a uniform public matrix and a small or arbitrary secret, depending on the normal form. Flipped LWE reverses the relevant roles:

$$
\mathbf C\leftarrow\{0,1\}^{N\times m},
\qquad
\mathbf r\leftarrow\mathbb Z_q^N,
\qquad
\mathbf y^T=\mathbf r^T\mathbf C+\mathbf e^T.
$$

The matrix is small and the secret is uniform.

**Lemma 21.** Flipped

$$
\mathrm{LWE}(N=n\log q,m,q,\chi)
$$

is at least as hard as

$$
\mathrm{LWE}(n,m,q,\chi).
$$

#### Proof

Given a standard LWE instance

$$
\left(
\mathbf A,\,
\mathbf b^T=\mathbf s^T\mathbf A+\mathbf e^T
\right),
$$

use the gadget identity

$$
\mathbf A=\mathbf G\mathbf G^{-}(\mathbf A)
$$

to rewrite

$$
\mathbf b^T
=
(\mathbf G^T\mathbf s)^T\mathbf G^{-}(\mathbf A)+\mathbf e^T.
$$

Choose

$$
\mathbf s'\leftarrow\mathbb Z_q^N
$$

uniformly and set

$$
\mathbf b'^T
:=
\mathbf b^T+\mathbf s'^T\mathbf G^{-}(\mathbf A).
$$

Then

$$
\mathbf b'^T
=
(\mathbf G^T\mathbf s+\mathbf s')^T
\mathbf G^{-}(\mathbf A)
+
\mathbf e^T.
$$

Because $\mathbf s'$ is uniform,

$$
\mathbf G^T\mathbf s+\mathbf s'
$$

is uniform. With a gadget decomposition chosen so that $\mathbf G^{-}(\mathbf A)$ is uniform binary for uniform $\mathbf A$ - directly when $q$ is near a power of two, or using a slightly extended gadget - this is a flipped-LWE sample. If $\mathbf b$ was uniform, then $\mathbf b'$ remains uniform. A flipped-LWE distinguisher would therefore distinguish standard LWE.

### Learning With Rounding

The intended template is

$$
F_{\mathbf s,\mathcal A}(x)
=
\mathbf s^T\mathbf A_x+\mathbf e_x^T
\pmod q,
$$

but a deterministic PRF cannot sample a fresh independent error $\mathbf e_x$ for every input. Learning with rounding replaces explicit error by deterministic information loss.

Define coordinate-wise rounding

$$
[z]_p
:=
\left\lfloor\frac pqz\right\rceil
\pmod p.
$$

The PRF output becomes

$$
F_{\mathbf s,\mathcal A}(x)
:=
[\mathbf s^T\mathbf A_x]_p.
$$

Rounding hides small perturbations:

- if $p=q$, there is no information loss and the function exposes too much linear structure;
- smaller $p$ improves the security margin;
- larger $p$ produces more output bits per evaluation.

### Flat Subset Product

Let the public parameters be two compatible random matrices

$$
\mathbf A_0,\mathbf A_1.
$$

For

$$
x=x_1\cdots x_\ell\in\{0,1\}^{\ell},
$$

define

$$
\mathbf A_x
:=
\prod_{i=1}^{\ell}
\mathbf G^{-}(\mathbf A_{x_i})
$$

and

$$
F_{\mathbf s,\mathbf A_0,\mathbf A_1}(x)
:=
[\mathbf s^T\mathbf A_x]_p.
$$

> **Dimension convention.** The chapter overloads $n$, $m$, and $N$ in this subsection. The matrices must be padded or dimensioned so that each gadget decomposition in the product is square and all displayed products are compatible.

### Parallel Evaluation

The $\ell$ matrices can be multiplied using a balanced binary tree:

$$
\ell
\longrightarrow
\frac\ell2
\longrightarrow
\frac\ell4
\longrightarrow\cdots\longrightarrow1.
$$

This uses $O(\log\ell)$ multiplication levels. With standard parallel arithmetic, the construction lies in $\mathrm{NC}^2$; the sharper circuit analysis cited by the chapter gives related low-depth variants.

### Approximate Key Homomorphism

Before rounding, evaluation is exactly linear in the secret:

$$
(\mathbf s+\mathbf s')^T\mathbf A_x
=
\mathbf s^T\mathbf A_x+\mathbf s'^T\mathbf A_x.
$$

After rounding,

$$
F_{\mathbf s}(x)+F_{\mathbf s'}(x)
\approx
F_{\mathbf s+\mathbf s'}(x).
$$

For scalar rounding, if

$$
R(z):=\left\lfloor\frac pqz\right\rceil,
$$

then

$$
R(a)+R(b)-R(a+b)
$$

has magnitude at most $1$. Thus the homomorphism error is small coordinate-wise. This enables distributed evaluation and related-key applications.

### Security Proof

The chapter proves that the entire truth table is indistinguishable from independent random strings. This simplified proof takes time exponential in the input length $\ell$; a more refined GGM-style argument can handle ordinary oracle security more efficiently.

For $i=0,\ldots,\ell$, define

$$
F^{(i)}_{\mathbf s_0,\ldots,\mathbf s_{2^i-1}}
(x'\|x'')
:=
[\mathbf s_{x'}^T\mathbf A_{x''}]_p,
$$

where $x'$ is the $i$-bit prefix and $x''$ is the remaining suffix.

- $F^{(0)}$ is the real construction with one secret $\mathbf s$.
- $F^{(\ell)}$ assigns an independent secret to every input and is statistically close to a random function after rounding.

It suffices to show that adjacent hybrids are indistinguishable. Consider the first transition. Write

$$
\mathbf M_{x_2\ldots x_\ell}
:=
\prod_{j=2}^{\ell}\mathbf G^{-}(\mathbf A_{x_j}).
$$

Then

$$
F^{(0)}_{\mathbf s}(x)
=
\left[
\mathbf s^T\mathbf G^{-}(\mathbf A_{x_1})
\mathbf M_{x_2\ldots x_\ell}
\right]_p.
$$

First insert a fresh flipped-LWE error:

$$
\left[
\left(
\mathbf s^T\mathbf G^{-}(\mathbf A_{x_1})
+
\mathbf e_{x_1}^T
\right)
\mathbf M_{x_2\ldots x_\ell}
\right]_p.
$$

The two rounded values differ only if the perturbation

$$
\boldsymbol\delta^T
:=
\mathbf e_{x_1}^T\mathbf M_{x_2\ldots x_\ell}
$$

crosses a rounding boundary. Rounding boundaries are spaced approximately $q/p$ apart. If the unperturbed coordinate is uniform modulo $q$, then one coordinate changes with probability at most approximately

$$
\frac{|\delta_j|}{q/p}
=
\frac{p|\delta_j|}{q}.
$$

For $N$ output coordinates, a union bound gives

$$
\Pr[\text{any rounded coordinate changes}]
\lesssim
\frac{Np}{q}
\|\boldsymbol\delta\|_\infty.
$$

Each gadget decomposition is binary, so its operator norm is polynomial in $N$. A flat product of $\ell-1$ such matrices can grow roughly like

$$
\|\mathbf M_{x_2\ldots x_\ell}\|
\le
N^{O(\ell)}.
$$

Consequently, the inserted error is hidden by rounding only when the inverse noise rate is roughly $N^{O(\ell)}$ times a superlogarithmic statistical slack. This corresponds to a lattice approximation factor exponential in the PRF input length.

Next, flipped-LWE pseudorandomness replaces

$$
\mathbf s^T\mathbf G^{-}(\mathbf A_b)+\mathbf e_b^T
$$

for each first bit $b\in\{0,1\}$ by an independent uniform branch secret $\mathbf s_b^T$. This produces $F^{(1)}$. Repeating the argument for each prefix changes

$$
F^{(0)}
\approx_c
F^{(1)}
\approx_c\cdots\approx_c
F^{(\ell)},
$$

which proves pseudorandomness under the stated, relatively strong LWE parameters.

> **Ratio clarification.** The required quantity that grows like $N^\ell$ is the modulus-to-noise ratio, or inverse noise rate. Calling $N^\ell$ the noise-to-modulus ratio would reverse the fraction.

## The BP14 Construction

The BP construction changes only how $\mathbf A_x$ is assembled. Let

$$
\mathbf A_\varepsilon=\mathbf I
$$

for the empty string and define recursively

$$
\mathbf A_{b x}
:=
\mathbf G^{-}(\mathbf A_b\mathbf A_x).
$$

Thus

$$
\mathbf A_x
=
\mathbf G^{-}\!\left(
\mathbf A_{x_1}
\mathbf G^{-}\!\left(
\mathbf A_{x_2}
\cdots
\mathbf G^{-}(\mathbf A_{x_\ell})
\right)
\right).
$$

Using

$$
\mathbf G\mathbf G^{-}(\mathbf Y)=\mathbf Y,
$$

the evaluation can be viewed as

$$
\begin{aligned}
F_{\mathbf s}(x)
&=
[\mathbf s^T\mathbf G\mathbf A_x]_p\\
&=
[\mathbf s^T\mathbf A_{x_1}\mathbf A_{x_2\ldots x_\ell}]_p.
\end{aligned}
$$

The hybrid inserts noise after the first multiplication:

$$
[\mathbf s^T\mathbf A_{x_1}\mathbf A_{x_2\ldots x_\ell}]_p
\quad\leadsto\quad
[
(\mathbf s^T\mathbf A_{x_1}+\mathbf e_{x_1}^T)
\mathbf A_{x_2\ldots x_\ell}
]_p.
$$

The improvement is that the recursively decomposed suffix remains a small binary matrix with norm polynomial in $N$, independent of $\ell$. The amplified error is therefore polynomial rather than $N^{O(\ell)}$. Security can be based on LWE with only a slightly superpolynomial modulus-to-noise ratio.

The cost is sequentiality:

$$
\mathbf A_{x_\ell}
\longrightarrow
\mathbf A_{x_{\ell-1}x_\ell}
\longrightarrow
\cdots
\longrightarrow
\mathbf A_x.
$$

Each stage depends on the completed next stage, so the balanced-tree parallelism of BLMR is lost.

## BLMR13 Versus BP14

| Property | BLMR13 | BP14 |
|---|---|---|
| Matrix structure | Flat product | Nested gadget decomposition |
| Evaluation | Parallel product tree | Sequential recursion |
| Depth | Polylogarithmic; presented as $\mathrm{NC}^2$ | Grows with input length |
| Suffix norm | $N^{O(\ell)}$ | $\operatorname{poly}(N)$ |
| LWE parameters | Exponential inverse noise rate in $\ell$ | Slightly superpolynomial inverse noise rate |
| Key homomorphism | Approximate | Same rounding-based principle |

The constructions expose the central tradeoff: flat products are parallel but magnify noise; nested decompositions control noise but impose dependencies between levels.

## Open Problems and Findings

The problem statements are reproduced without paraphrasing.

**Open Problem 5.1.** Construct an LWE-based pseudorandom function that can be computed in $\mathsf{NC}^1$ and is based on LWE with polynomial modulus.

**Finding.** A new August 2026 preprint by Ding, Jain, and Komargodski claims the first $\mathsf{NC}^1$ PRF from standard LWE with a polynomial modulus-to-noise ratio, using a generic transformation that tapers the internal state across a GGM-like tree. Subject to peer review and the paper's precise parameter interpretation, this resolves the problem as stated. See [Pseudorandom Functions in $\mathsf{NC}^1$ from LWE/LPN/CDH](https://arxiv.org/abs/2608.25213).

**Open Problem 5.2.** Come up with a “direct” construction of a SIS-based PRG and PRF.

**Finding.** SIS already yields a PRF through the generic chain

$$
\mathrm{SIS}
\Longrightarrow
\mathrm{OWF}
\xRightarrow{\mathrm{HILL}}
\mathrm{PRG}
\xRightarrow{\mathrm{GGM}}
\mathrm{PRF}.
$$

That does not answer the word “direct”: the construction is complicated, sequential, and does not expose an SIS-specific parallel evaluation rule. No direct, parallel SIS-based PRG and PRF matching the requested form was identified in the literature reviewed for these notes, so this remains open in the chapter's intended sense.

## Collision-Resistant Hashing from SIS

A collision-resistant hash family compresses its input but makes collisions computationally difficult to find. Choose

$$
\mathbf A\leftarrow\mathbb Z_q^{n\times m}
$$

and define

$$
h_{\mathbf A}:
\{0,\ldots,B\}^m
\longrightarrow
\mathbb Z_q^n,
\qquad
h_{\mathbf A}(\mathbf e)
:=
\mathbf A\mathbf e
\pmod q.
$$

### Compression Calculation

The domain has size

$$
(B+1)^m,
$$

while the range has size

$$
q^n.
$$

The function is compressing when

$$
(B+1)^m>q^n,
$$

equivalently,

$$
m\log(B+1)>n\log q.
$$

> **Correction.** The PDF prints $n\log q>m\log(B+1)$. That inequality makes the range larger than the domain and does not establish compression. The inequality must be reversed for the stated hash-domain and range.

For example, let

$$
n=256,\qquad q=2^{12},\qquad B=1.
$$

Then the range contains

$$
n\log_2q=256\cdot12=3072
$$

bits. Choosing $m=4096$ gives a $4096$-bit binary domain, so the hash compresses by

$$
4096-3072=1024
$$

bits.

### Collision-Resistance Proof

Suppose an adversary finds distinct inputs

$$
\mathbf e,\mathbf e'\in\{0,\ldots,B\}^m
$$

such that

$$
h_{\mathbf A}(\mathbf e)
=
h_{\mathbf A}(\mathbf e').
$$

Then

$$
\mathbf A(\mathbf e-\mathbf e')
=
\mathbf0
\pmod q.
$$

Let

$$
\mathbf z:=\mathbf e-\mathbf e'.
$$

Because $\mathbf e\ne\mathbf e'$,

$$
\mathbf z\ne\mathbf0.
$$

Every coordinate lies in $[-B,B]$, so

$$
\|\mathbf z\|_\infty\le B.
$$

Therefore $\mathbf z$ is a valid solution to

$$
\mathrm{SIS}(n,m,q,B).
$$

An efficient collision finder would give an efficient SIS solver. Assuming SIS is hard, the hash family is collision resistant.

## Chapter 5 Takeaway

The gadget matrix converts modular vectors into small binary representations. That single mechanism enables flipped LWE and lets the PRF repeatedly compose public matrices while keeping individual factors small.

BLMR uses a flat product, gaining parallelism and approximate key homomorphism but suffering exponential noise amplification in the input length. BP uses nested gadget decomposition, keeping the relevant norm polynomial at the price of sequential evaluation. Finally, SIS gives an especially clean collision-resistant hash: subtracting any collision immediately produces a short nonzero kernel vector.
