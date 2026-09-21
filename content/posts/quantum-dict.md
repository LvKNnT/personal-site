---
title: Some random interesting quantum phrase 
date: 2026-09-21
description: A short note for quick check while grinding papers
# readingTime: 4 min
---

Yes, this note uses `this-website` template 🍊.

![Eleanor](/work/img/this-website.jpg)

# [NISQ - Noisy Intermediate-Scale Quantum](https://doi.org/10.22331/q-2018-08-06-79)
## Noisy 
Quantum operations are imperfect.

Qubits suffer from : 
- gate errors 
- decoherence
- measurement errors
- noise from the environment

This long quantum computations gonna accumulate errors.

## Intermediate-Scale
The machine has more than just a few qubits, but not enough reliable qubits for large fault-tolerant quantum computing

# Deutsch-Jozsa Algorithm
## Goal
Determine whether a Boolean function f(x) is constant or balanced
- Constant : all inputs give the same output
- Balanced : half outputs are 0, half are 1

## Complexity
- Classical deterministic worst case : $2^{n-1} + 1$ queries
- Quantum : O(1) oracle query

## Steps 
Start with $|0\rangle^{\otimes n}|1\rangle$.

Apply Hadamard gates -> superposition of all inputs.

Apply oracle $U_f$.

Oracle changes phase:
$$ 
|x\rangle\rightarrow (-1)^{f(x)}|x\rangle. 
$$

Apply Hadamards again.

Measure:
$$ 
00\cdots0 \Rightarrow \text{constant} 
$$
$$ 
\text{anything else} \Rightarrow \text{balanced}. 
$$

## Main idea
`Quantum inference` : Constant phases reinforce, balanced phases cancel.

# Grover's Algorithm
## Goal
Search an unsorted set of $N$ items for a desired item.

## Complexity
- Classical search:$ O(N) $
- Grover search: $ O(\sqrt N) $

# Steps 
Start with equal superposition:
$$ 
\frac1{\sqrt N}\sum_x |x\rangle. 
$$

Oracle marks the correct state by flipping its phase:
$$ 
|x_{\text{target}}\rangle \rightarrow -|x_{\text{target}}\rangle.
$$

Then use the diffusion operator to increase the target's amplitude.

Repeat oracle + diffusion about
$$
\boxed{\frac{\pi}{4}\sqrt N} 
$$
times.

Measure -> high probability of getting the target.

## Main idea 
`Amplitude amplification` : repeating `oracle` and `diffusion`

# Satisfiability Modulo Theories (SMT)
## I/O
- Input : local constraint 
- Output : 
    - `sat` : solution exists
    - `unsat` : no solution
    - sometimes `unknown`
- Can return a satisfying assignment/model

## Applications
- Z3, [Yices](https://doi.org/10.1007/978-3-319-08867-9_49) and [dReal](https://doi.org/10.1007/978-3-642-38574-2_14).
- program verification, symbolic execution, reverse engineering, CTFs, scheduling, hardware verification.

# Temporal Logics
## [LTL - Linear Temporal Logic](https://doi.org/10.1109/SFCS.1977.32)
LTL looks at one possible execution path at a time.

Think:
$$
s_0 \to s_1 \to s_2 \to s_3 \to \cdots 
$$

## [CTL - Computation Tree Logic](https://doi.org/10.1007/BFb0025774)
CTL considers that the system may have many possible futures.

For example:
```
        s0
       /  \
     s1    s2
    / \     \
   s3 s4     s5
```

## [$\mu$-calculus](https://doi.org/10.1016/0304-3975(82)90125-6)
The modal $\mu$-calculus is a more general and powerful temporal logic.

Its special feature is fixed points.

Two important operators are:
$$ 
\mu X.\phi(X) 
$$
= least fixed point

and
$$
\nu X.\phi(X)
$$
= greatest fixed point.

Intuitively:
- $\mu$ is useful for properties like eventually/reachability.
- $\nu$ is useful for properties like always/invariants.

## Comparison 
| Logic            | Main idea                              | Think of                   |
| ---------------- | -------------------------------------- | -------------------------- |
| LTL              | temporal properties on executions      | one timeline               |
| CTL              | quantify over possible execution paths | branching tree             |
| $\mu$-calculus | temporal properties using fixed points | recursive state properties |

# BMC - Bounded Model Checking
- BMC checks bugs only up to $k$ steps
- BMC converts system behavior into SAT/SMT constraints
    - `SAT` : counter-example found
    - `UNSAT` : no bug within the bound

## Pros/Cons
- Advantage : very good at finding short counterexamples quickly.
- Drawbak : a finite bound may miss deeper bugs.

# [CEGAR - CounterExample-Guided Abstraction Refinement](https://doi.org/10.1145/186025.186051)
It is a formal verification technique that starts with a `simplified model` of a system and improves it only when needed.
- Spurious counterexample : false bug caused by abstraction
- Real counterexample : actual system bugs

## Pros/Cons
- Advantage : avoids exploring the full state space from the beginning

# [QHL - Quantum Hoare Logic](https://doi.org/10.1145/2049706.2049708)
It is a formal logic for proving that a quantum program is correct :
$$
\{P\} \ S \ \{Q\}
$$
with :
- $P$ : quantum precondition
- $S$ : quantum program
- $Q$ : quantum postcondition

It extends classical Hoare Logic and handles quantum states, gates, measurements, and probabilities

# [PCTL - Probabilistic CTL](https://doi.org/10.1016/j.jcss.2013.04.002)
yes, it is CTL but with probability, what r u expecting ( i - i )

# QCTL - Quantum Computation Tree Logic
It  is a temporal logic used to reason about the behaviour of a quantum Kripke structure.

Technically, it is combination of dEQPL and CTL

# [dEQPL - decidable fragment of the Exogenous Quantum Propositional Logic](https://doi.org/10.1016/B978-0-444-52869-8.50011-6)

dEQPL = deciable quantum propositional logic
- describes `properties of quantum states`
- reason about the amplitudes and measurement probabilities
- can express a state logic in quantum verification
- restricted version of EQPL
- restriction makes satisfiability/model reasoning deciable

In other words, dEQPL describes a quantum state.

# Pauli gates
The path sum representation of the Pauli gates are listed below :
$$
\begin{aligned}
X &: \lvert x \rangle \to \lvert 1-x \rangle, 
\\
Y &: \lvert x \rangle \to e^{2\pi i \frac{2x+1}{4}} \lvert 1-x \rangle, 
\\
Z &: \lvert x \rangle \to e^{2\pi i \frac{x}{2}} \lvert x \rangle.
\end{aligned}
$$

# [AFP - Archive of Formal Proofs]( https://isa-afp.org/entries/QHLProver.html)
It is a large onlinne collection of machine-checked mathematical proofs, mainly written for the `Isabelle theorem prover`.

- repository for formally verified proofs
- mainly uses `Isabelle/HOL`
- proofs are `machine-checked`
- contains mathematics, algorithms, security, verification, ...
- proofs can be reused in later formalizations

# [IMD - Isabelle Marries Dirac]
IMD = Isabelle/HOL + quantum

# HQHL - Hybrid Quantum Hoare Logic 
- Hoare-style logic for quantum
- supports both classical and quantum structure
- used in `QBricks`

# [QPMC - Quantum Program/Protocol Model Checker](https://doi.org/10.1007/978-3-319-19249-9_17)
It is a tool for `automatically verying` quantum programs and quantum communication protocols.
- extension of `IscasMC`
- uses `Quantum Markov Chains`
- uses `density matrices`
- can check properties expressed in `QCTL`
- can verify more general quantum operations, not just Clifford gates

# BDDs - Binary Decision Diagrams
BDD is just a compact graph for representing a Boolean function
- BDD nodes represent Boolean choices

# [QMDD - Quantum Multiple-Valued Decision Diagram](https://doi.org/10.1007/978-3-319-63724-2_4)
It is a decision-diagram structure adapted for `quantum states` and `quantum operations`
- QMDD nodes represent quantum-variable/qubit decomposition
- QMDD edges carry amplitude information
- also some stats that are useful : 
    - quantum state vectors
    - quantum gates
    - unitary matrices
    - entire quantum circuits

# Harrow-Hassidim-Lloyd (HHL)
It is a quantum algorithm for solving certain `system of linear equations`:
$$
A \mathbf{x} = \mathbf{b}
$$
to get 
$$
\mathbf{x} = A^{-1} \mathbf{b}
$$

![HHL code](/post/quantum-dict/HHL-code.png)

The entire sequence can be understood as
$$ 
|0\rangle_{\rm anc} |0\rangle_{\rm eigen} |0\rangle
$$

Prepare \(b\)
$$ 
\downarrow B 
$$
$$ 
|0\rangle |0\rangle \sum_j\beta_j|u_j\rangle
$$

QPE
$$
\downarrow 
$$
$$
|0\rangle \sum_j \beta_j |\lambda_j\rangle |u_j\rangle 
$$

Controlled rotation
$$ 
\downarrow 
$$
$$ 
\sum_j \left( \sqrt{1-\frac{C^2}{\lambda_j^2}}|0\rangle + \frac{C}{\lambda_j}|1\rangle \right) |\lambda_j\rangle |u_j\rangle 
$$

$ QPE^\dagger $
$$ 
\downarrow 
$$
$$ 
\sum_j \beta_j \left( \sqrt{1-\frac{C^2}{\lambda_j^2}}|0\rangle + \frac{C}{\lambda_j}|1\rangle \right) |0\rangle |u_j\rangle 
$$

Measure ancilla and obtain $1$
$$ 
\downarrow
$$
$$ 
|1\rangle |0\rangle \underbrace{ \frac{1}{\sqrt N} \sum_j \frac{\beta_j}{\lambda_j}|u_j\rangle }_{|x\rangle}. 
$$

# [BWT - Binary Welded Tree](https://doi.org/10.1145/780542.780552)
It is a quantum-walk problem designed to show a strong quantum speedup over dclassical algorithms

- two binary trees joined at their leaves
- start at `Entrance`
- goal : find `Exit`
- graph accessed through an oracle
- classical search : exponential queries
- quantum : popolynomianl using a `quantum walk`