---
title: Formal Verification of Quantum Programs - Theory, Tools, and Challenges
date: 2026-09-21
description: Summarize on this interesting topic.
# readingTime: 4 min
---

![cover.png](/public/post/formal-verification-of-quantum-programs/cover.png)

> Title
```
Formal Verification of Quantum Programs: 
Theory, Tools, and Challenges
```

> Author(s)
``` 
MARCO LEWIS, SADEGH SOUDJANI, and PAOLO ZULIANI, Newcastle University, UK
```

[The article appeared in `ACM Transactions on Quantum Computing`, volume 5, number 1, article 1, in December 2023](https://doi.org/10.1145/3624483)

# Some notes
This is the work after I have read this 2-3 times before so if its too simplified, Im sorry

# Introduction 
The paper begins from a practical separation of errors in quantum computation. A measured answer may be wrong because quantum algorithms are probabilistic, because physical hardware is noisy, or teh software does not implement the intended algorithm. Repeated execution can suppress ordinary statistical uncertainty, and quantum error-correcting codes address physical faults. Neither method detects a wrong oracle, an incorrect sequence of gates, a broken loop, or a compiler transformation that changes program meaning. Formal verification is aimed at this third class of error. 

The need is unusually strong in quantum programming. Quantum states cannot be inspected freely, measurement changes the state, and useful programs mix unitaries, measurements, classical control, ancillas, and approximations. At the same time, NISQ hardware supplies few qubits and limited circuit depth, so trial and error is expensive and may conceal rather than expose a defect. A prooft that a program satisfies a mathematical specification is therefore more informative than observing correct outputs on a finite test set.

# Background
## Quantum Computing Notation
Really ? ( i - i )

## Model Checking and Verification
`Model Checking` represents a program by a transition structure and expresses its required behavior in temporal logic. 
- A `Kripke structure` is a tuple $M = (S, S_0, R, L)$ containing a finite state set, initial states, a total transition relation, and a labeling of each state by the proposition true there. 
- A path is a sequence $s_0, s_1, \cdots$ following $R$

Some definitions on CTR - Computation Tree Logic

The atraction is complete automation over the finite model. The principal weakness is state explosion: a modest increase in program components can cause an exponential increase in global states. 
- Bounded model checking limits the search depth. 
- Counterexample-guided abstraction refinement begins with a coarse over-approximation, checks it, and refines only when a reported counterexample is spurious in the concrete system.

## Deductive Verification
Deductive verification reasons symbolically rather than enumerate states. A Hoare triple : 
$$
\{P\} \ S \ \{Q\}
$$
asserts that executing statement $S$ from a state satisfying precondition $P$ establishes postcondition $Q$. Rules for assignment, sequential composition, conditionals, loops, and logical consequence build a proof of the compete program from proofs of its parts.

The resulting proof obligations are handled by therem provers or `SMT provers`. Interativev provers such as `Coq`, and `Isabelle` provide a small trusted kernel and rich mathematical libraries, but the user normally guides the proofs.  SMT sovlers such as `Z3` and `Alt-Ergo` decide formulas over supported theories more automatically and may return counterexamples when a claim fails.

Model checking is attractive when a finite model and temporal property are available; deductive verification is attractive when one needs a general, human-readable theorem about all inputs. Both encounter scalability problems, but in different forms : state-space size for the former, and difficult invariants or proof obligations for the latter.

# Formal Quantum Verification Methods
## Quantum Weakest Precondition
Classically, $\operatorname{wp}(S)(Q)$ is the weakest assertion that guarantees
postcondition $Q$ after statement $S$. Verifying $\{P\}S\{Q\}$ then reduces to
proving $P\Rightarrow\operatorname{wp}(S)(Q)$.

D'Hondt and Panangaden extend this idea to density matrices. A quantum predicate
$P$ is a positive Hermitian operator bounded by the identity. If a program $S$
maps input density matrix $\rho$ to $S(\rho)$, then the triple is valid when
$$
\operatorname{tr}(P\rho)\leq \operatorname{tr}\bigl(QS(\rho)\bigr)
$$
for every $\rho$. The trace terms are quantitative: they express the expected
degree to which a predicate holds. The weakest precondition is the most general
operator that satisfies the inequality for the chosen program and
postcondition. This changes program verification into a backwards calculation
on operators.

## Quantum Hoare Logic
Ying's Qunatum Hoare Logic (QHL) applies weakest preconditionreasoning to the quantum : while language. Its statements include skip, qubit initialisation, unitary transformation of a register, sequential composition. measurement with one branch per outcome, and a loop guared by repeated measurement. Unlike a raw circuit notation, it presents quantum computation as an imperative program.

The rules give partial and total correctness judgements for quantum predicates. Tho, it has limitations : the core grammar has no ordinary classical variables, so it cannot express all of Shor's hubrid classical-quantum control. Later work extends quantum-while with classical variables; others Hoare logics target languages such as Selinger's QPL.

## Quantum Computation Tree Logic
definitions

## Path Sums
definitions

## The ZX-Calculus
definitions

# Design of Verification Frameworks and QUantum Programming Languages
## Environment and Automation
Embedding a language in Coq, Isabelle, or another theorem prover gives a trusted
kernel, mature tactics, libraries, and an existing community. It also inherits
the host's learning curve and representational limitations. Building a dedicated
verifier offers control over syntax and automation but requires recreating
parsers, semantics, proof infrastructure, diagnostics, and libraries. A third
option extends an executable quantum language; Entang $\lambda e$, for example,
translates Quipper programs into quantum Markov chains for QPMC.

The interaction spectrum runs from manual proof construction to push-button
model checking. Interactive proof exposes why a theorem is true and supports
rich mathematics, but can demand many expert hours. Automation scales human
effort better and can produce counterexamples, though the user may learn little
from a successful opaque run. Practical systems often combine user-supplied
invariants or specifications with automated algebra and SMT discharge.

## Executability and Separation
The executable program and its proof-oriented specification may be interleaved,
stored together, or separated. Separation is important when the same program
will run on quantum hardware: proof objects and specifications execute
classically and must not become physical gates. Simulation changes the tradeoff,
because a simulator can replay a counterexample or validate a small concrete
instance. The survey treats the ability to connect proof-level code to executable
code as a central design requirement rather than a cosmetic feature.

## Quantum-Specific Language Constraints
### No-cloning
Arbitrary unknown quantum states cannot be copied. A language can enfore this through linear types, a restricted gate grammar, or a formal theorem within the framework. A verifier must not silently assume classical aliasing rules for quantum data.

### Clasical Functionalty
A realistic architecture places a quantum processor under classical control. Oracles oftern encode classical functions, and measurement results makes algorithms awkard or impossible to expree; unrestricted classical features make the combined semantics and proof system harder. A tool may use separate classical and quantum or one logic for both domains.

### Parameters and dynamic lifting
Parameters describe families of
circuits, such as Grover search over $n$ qubits and an oracle $f$. Proving the
family is much stronger than checking one expanded circuit, but requires
induction and symbolic reasoning. Dynamic lifting uses measurement results as
classical data during execution: it may select wires, choose a continuation, or
trigger a repeat-until-success loop. This crosses the quantum-classical boundary
and must be represented explicitly.

### Ancilla cleaning
Temporary qubits are often entangled with the main
register. They cannot simply be discarded like classical garbage, because doing
so may change the remaining state. They must be uncomputed or measured under a
justified protocol. Silq performs safe automatic uncomputation; a verifier can
instead require and prove that every ancilla returns to its initial state.

### Types, purity, and entanglement
Measurement may change the usable type
of a variable, and entanglement destroys local descriptions of individual
qubits. Twist tracks whether values are pure or entangled and performs dynamic
checks where static reasoning is insufficient. A future verification language
would ideally move more of this checking before execution.

## Algorithmic Milestone
should read the paper. 

# Verifiable Quantum Programming Languages
## SQIR and QWire
definitions

## QHLProver and CoqQ
definitions

## Isabelle Marries Dirac
definitions

## QBricks
definitions

## Related Tools and Their Layer
QPMC model-checks quantum Markov chains against a quantum PCTL variant.
Entang $\lambda e$ supplies a front end from Quipper, reducing the burden of
manually writing a Markov chain. Feynman uses path sums for simulation and
equivalence. QMDD-based systems and SliQEC use decision diagrams to represent
unitaries compactly. PyZX automates ZX-calculus conversion and rewriting.

CertiQ verifies that Qiskit compiler transformations preserve circuit meaning,
using SMT automation. QSharpCheck generates and runs random tests from stated
preconditions and postconditions. The latter is valuable for debugging but is
not formal verification: passing finitely many generated tests does not prove a
universal property.

The comparison reveals a layered ecosystem. Program provers reason about
algorithmic semantics; model checkers reason about temporal models; equivalence
tools protect circuit transformations; testing tools find concrete failures.
Reliable quantum software will likely need all of these layers, with verified
translations between them.

# Challenges in Verifying Complex Quantum Algorithms
## The Harrow-Hassidim-Lloyd Algorithm
definitions

## Walking on Binary Welded Trees
definitions

Notes that the verification difficulties are structurally different from HHL :
- Nested classical loops
- High-level quantum objects
- Oracle constracts
- Ancilla cleanliness and approximation

## Lessons from the Case Studies
The two algorithms show why verifying more gates is not enough. HHL requires
measurement-driven repetition and numerical approximation; welded trees require
symbolic loops, structured oracles, and graph-level reasoning. Both require
modular proofs, explicit resource and input assumptions, and controlled
composition of approximation errors. A useful framework must allow proofs at
the algorithm's conceptual level and connect those proofs to a lower-level
executable representation.

# Conclusion
## Open Problems
- Combine essential language features
- Connect to widely used languages
- Scale beyond textbook algorithms
- Verify quantum-specific approximations
- Handle hybrid loops and feedback

# Some my own thoughts (dont expect much)
This paper/survey (i dont know, look like both to me), shows that formalism, programming language, and automation strategy annot be selected independently. Restricting a language makes soundness and automation easier but may remove the features that define a realistic algorithm; adding those features raises the cost of invariants, semantic models, and trusted translation.