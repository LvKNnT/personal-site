---
title: Lattices, LWE and Post-Quantum Cryptography - Chapter 2
date: 2026-09-15
description: Algorithms and attacks for the Learning with Errors problem.
series: Lattice Notes
seriesOrder: 2
---
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
