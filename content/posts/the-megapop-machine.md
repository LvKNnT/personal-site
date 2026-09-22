---
title: Beyond NISQ - The Megaquop Machine
date: 2026-09-19
description: Summary on this interesting topics
# readingTime: 4 min
---

![cover.png](/public/post/the-megapop-machine/cover.png)

> Title
```
Beyond NISQ: The Megaquop Machine
```

> Author(s)
```
John Preskill, Institute for Quantum Information and Matter,
California Institute of Technology, Pasadena, California, United States.
```

[The article appeared in `ACM Transactions on Quantum Computing`, volume 6, number 3, article 18, in April 2025.](https://doi.org/10.1145/3723153)

# About ISQ
There are a lot of more new `ISQ`. A 'base' ISQ can be simply understand as `Intermediate-scale Quantum` which comes from `NISQ` - Noise Intermediate-Scale Quantum. Welp, basically, we all know that qubit is very fragile, so that "error" in calculation is expectable. This fatal weakness make quantum machine itself can not scale big since the bigger the machine, the more unstable it is.

Some kind of `other ISQ` from NISQ that are some kind of ~~boring~~ :
| Term     | Meaning                            | Main idea                                                            |
| -------- | ---------------------------------- | -------------------------------------------------------------------- |
| **LISQ** | Logical Intermediate-Scale Quantum | Similar idea: transition to logical/error-corrected qubits           |
| **KISQ** | Kilo-Instruction Scale Quantum     | About \(10^3\) usable quantum instructions                           |
| **MISQ** | Mega-Instruction Scale Quantum     | About \(10^6\) instructions                                          |
| **GISQ** | Giga-Instruction Scale Quantum     | About \(10^9\) instructions                                          |
| **TISQ** | Tera-Instruction Scale Quantum     | About \(10^{12}\) instructions                                       |

Thus, the author want to jump into the next stage : `FASQ` - Faulty-Tolerant Application-Scale Quantum. In this term, we need to notice that we will jump into the Application-Scale, ignore the Intermediate-Scale (boring btw). 

## Faulty-Tolerant 
A scalable machine must sustain many rounds
of accurate syndrome measurement. After decoding, the logical error per cycle
should fall rapidly as the code distance grows. Logical gates must be much more
reliable than physical gates, and their reliability should improve with code
size without unacceptable costs in physical qubits, gates, or wall-clock time.

# The Road to Fault Tolerant
## Surface-code Progress
Google's Willow superconducting processor is
used as the central snapshot of the state of the art. It runs millions of
stable surface-code syndrome rounds, each lasting about one microsecond. The
reported logical error rate improves by roughly a factor of two whenever the
code distance rises from 3 to 5 and from 5 to 7. This ``below-threshold'' trend
is the essential evidence that scaling the code can suppress logical errors.
The next milestones are larger suppression factors, lower absolute logical
error rates, and fault-tolerant two-qubit gates rather than memory alone.


## Rare correlated faults
Ionizing radiation can create simultaneous
errors on many superconducting qubits, defeating codes designed for mostly
local failures. Gap engineering in Willow reduced observed error bursts from
about one every ten seconds in earlier hardware to about one per hour. The
remaining burst mechanism is not fully understood, so rare-event diagnosis and
mitigation remain necessary across hardware modalities.

# Real-time Decoding
Universal fault-tolerant circuits repeatedly
measure encoded blocks and condition later operations on the results. Slow
decoding therefore slows the logical clock. Google reports an average decoding
latency of about $63\,\mu\mathrm{s}$ for distance 5, plus roughly
$10\,\mu\mathrm{s}$ for Ethernet transmission, while a syndrome round itself
takes only about $1\,\mu\mathrm{s}$. FPGA-based decoders integrated with the
control stack can reduce this delay. Reinforcement-learned decoders and
correlated decoding across multiple code blocks may improve logical performance
or reduce circuit depth, but their computational cost and scalability are open
questions.

# Trading Simpicity for Performance
The paper surveys alternatives to
simple transmons that trade device complexity for easier error correction.
Cat qubits suppress bit flips exponentially with resonator photon number and
use a repetition code for the remaining phase errors. Dual-rail encodings turn
dominant photon loss into a detectable erasure; one reported cavity device
detects more than 99\% of such losses. GKP encodings protect finite-dimensional
systems in squeezed oscillator states. Fluxonium qubits offer stronger
anharmonicity and demonstrated two-qubit fidelities above 99.9\%. Majorana
devices aim for intrinsic topological protection, though convincing protected
qubits have not yet been demonstrated.

# Error Correction with Atomic Qubits
Trapped ions and neutral atoms can move qubits,
providing nonlocal two-qubit connectivity and allowing more efficient codes.
The cited demonstrations include 48 logical qubits on 280 physical qubits, 28
logical qubits on 256 physical qubits, and entangled states of 12 logical
qubits on 56 physical qubits. These results execute logical circuits, but so far
only with a few syndrome rounds and with error detection plus postselection.
Discarding detected-error runs does not scale to deep computation, and atom
motion must become faster to avoid a slow logical cycle.

# Toward the Megaquop Machine
The proposed path combines better hardware and
control with efficient quantum codes, cheaper logical gates, real-time
decoding, and logical-level error mitigation. Quantum chemistry generally
requires circuits that are still too deep, while materials simulation may be a
nearer target when symmetry reductions and circuit optimizations are used.
Preskill is especially interested in nonequilibrium many-body dynamics in two
spatial dimensions, while stressing that classical simulation algorithms are
also improving.

# Experiment Summary
Google's Willow processor maintained millions of approximately
$1\,\mu\mathrm{s}$ surface-code measurement cycles and obtained about a
twofold improvement in logical error per step from distance 3 to 5 and again
from 5 to 7.

Willow's gap-engineered qubits reduced correlated error bursts by
orders of magnitude, from about once per ten seconds in previous hardware to
about once per hour.

Google's distance-5 real-time decoder returned a result in about
$63\,\mu\mathrm{s}$ on average, with roughly $10\,\mu\mathrm{s}$ of additional
network delay. FPGA and control-stack integration experiments by Riverlane
and Rigetti indicate a route to lower latency.

AWS's Ocelot cat-qubit experiment showed a small logical-error
improvement when a phase-flip repetition code increased from distance 3 to
5. Dual-rail cavity experiments detected photon-loss errors more than 99\% of
the time. Yale's GKP-encoded three- and four-dimensional systems achieved a
decay rate about 1.8 times better than bare resonator photon loss. MIT's
fluxonium platform demonstrated two-qubit gate fidelity above 99.9\%.

Atomic platforms executed small logical computations with comparatively
efficient encodings: 48 logical qubits on 280 physical qubits, 28 on 256,
and a 12-logical-qubit entangled state on 56. These experiments still used
few correction rounds and relied on postselection.