---
title: Lattices, LWE and Post-Quantum Cryptography - Chapter 3
date: 2026-09-15
description: Worst-case to average-case reductions for SIS.
series: Lattice Notes
seriesOrder: 3
---
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
\lambda_1(\mathcal L)\le\sqrt4\cdot16^{1/4}=2\cdot2=4.
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
