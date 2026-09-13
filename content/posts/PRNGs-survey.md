---
title: PRNGs survey in Cryptography
date: 2026-09-13
description: A short surveys about interesting stuffs.
# readingTime: 4 min
---

# A Survey of Pseudorandom Number Generators in Cryptography

**Khang Lam · September 2026**

## Abstract

Cryptography needs randomness for keys, nonces, salts, challenges, padding, blinding, and randomized protocols. Physical noise is slow, biased, and platform-dependent, whereas applications demand many uniformly distributed bits. A cryptographic pseudorandom number generator (CSPRNG), usually called a deterministic random bit generator (DRBG) in standards, bridges this gap by expanding a short secret seed into a long stream that is computationally indistinguishable from uniform. This survey connects the complexity-theoretic definition of pseudorandomness to deployed constructions, entropy acquisition, state compromise, reseeding, standards, testing, and recurring implementation failures. The central conclusion is that a secure primitive is necessary but not sufficient: the complete random-bit generator is a stateful system whose security depends equally on entropy accounting, state management, interfaces, and recovery after compromise.

## Why Cryptography Needs a Different PRNG

A conventional simulation generator aims for speed, reproducibility, a long period, and good empirical distribution. A cryptographic generator has an adversarial requirement: after seeing output and influencing the surrounding system, an efficient attacker should still be unable to distinguish future output from fresh uniform bits. Linear congruential generators, linear feedback shift registers, MT19937, and PCG may be excellent tools in their intended domains, but their state can be reconstructed or their future output predicted; they must not generate secrets.

The vocabulary is inconsistent across papers and standards. This survey uses the following distinctions.


**Definition 1**. A *noise source* is a physical or non-physical process whose samples are not completely determined from the attacker's point of view. An *entropy source* includes the noise source, digitization, optional conditioning, and health tests. A *DRBG* is a deterministic state machine that expands seed material. A complete *random bit generator* (RBG) combines one or more entropy sources with a DRBG and the logic that instantiates and reseeds it.

This separation is more than terminology. A DRBG cannot manufacture entropy. If a 256-bit output is determined by an 8-bit seed, exhaustive search has only $2^8$ candidates, regardless of how random the output looks [[13]](#ref-13). Conversely, raw physical samples need not be uniform; careful conditioning and a secure DRBG can turn adequately estimated entropy into a high-rate interface.

### Where random values appear

Long-term symmetric and private keys require unpredictability at creation. Public-key generation also consumes randomness, for example when selecting the primes of an RSA modulus. Protocols use random nonces, initialization vectors, salts, challenges, ephemeral Diffie–Hellman exponents, padding coins, and blinding factors. These objects have different requirements: a nonce may need uniqueness rather than secrecy, while a key needs both; an IV may be public but still must satisfy a mode-specific distribution rule.

The application must therefore specify the property it needs rather than ask vaguely for a "random number." Replacing a uniqueness requirement with probability creates birthday-bound failures; replacing unpredictability with uniqueness creates guessable secrets.

## Mathematical Foundations

### Statistical and computational randomness

Let $U_m$ denote the uniform distribution on $\{0,1\}^m$. For distributions $X,Y$ on the same finite set, their statistical distance is

$$
\Delta(X,Y)=\frac12\sum_z\left|\Pr[X=z]-\Pr[Y=z]\right|.
$$

Information-theoretic closeness is too strong for deterministic expansion: the support of a function from $n$ bits to $m>n$ bits has size at most $2^n$, so its output is far from uniform in statistical distance. Cryptography instead asks that no feasible test notice the difference.


**Definition 2** (Cryptographic pseudorandom generator). A polynomial-time deterministic function

$$
G:\{0,1\}^n\longrightarrow\{0,1\}^{\ell(n)},\qquad \ell(n)>n,
$$

is a PRG if, for every probabilistic polynomial-time distinguisher $D$,

$$
\operatorname{Adv}_G(D)=\left|\Pr[D(G(U_n))=1]-\Pr[D(U_{\ell(n)})=1]\right|
$$

is negligible in $n$.

The stretch can be iterated, with care, to generate polynomially many bits. Yao connected indistinguishability with unpredictability [[1]](#ref-1).


**Theorem 1** (Next-bit characterization). *A polynomial-stretch generator is pseudorandom if and only if no probabilistic polynomial-time algorithm, given any prefix of its output, predicts the next bit with non-negligible advantage over $1/2$.*

The theorem explains why frequency tests are not security tests. Encrypting a counter with a publicly known fixed key can look statistically excellent yet be perfectly predictable. A CSPRNG is justified by reduction or sustained public cryptanalysis of its primitive, not by histograms alone.

### One-wayness and provable constructions

Blum and Micali gave the first general complexity-theoretic construction, turning a hard inversion problem and a hard-core predicate into unpredictable bits [[2]](#ref-2). Blum, Blum, and Shub (BBS) made this concrete. Choose Blum primes $p\equiv q\equiv3\pmod4$, set $N=pq$, choose $x_0\in QR_N$, and iterate

$$
x_{i+1}=x_i^2\bmod N,\qquad b_i=\operatorname{lsb}(x_i).
$$

Under the quadratic residuosity/factoring assumptions, the output is unpredictable in a precise sense [[3]](#ref-3). BBS is historically and theoretically important but far slower than symmetric-primitive designs.

At the existence level, pseudorandom generators exist if and only if one-way functions exist; the difficult direction constructs a PRG from any one-way function [[4]](#ref-4). This result establishes PRGs as a foundational primitive, but its generic constructions are not deployment recipes.

### Entropy and extraction

For a discrete random variable $X$, the relevant conservative measure is often min-entropy,

$$
H_{\infty}(X)=-\log_2\max_x\Pr[X=x].
$$

It measures the difficulty of the best single guess. Shannon entropy can be large while a most-likely outcome remains dangerously probable, so it does not directly bound an attacker's guessing success.

Conditioning compresses biased samples into a representation suitable for seeding. A cryptographic hash can be a robust conditioner, but deterministic processing cannot increase information-theoretic entropy. If $X$ contains at most $k$ bits of min-entropy, hashing it to 256 bits does not create 256 bits of entropy. The estimate must account for dependencies, environmental changes, and adversarial influence, not merely sample bias.


**Warning 1**. Do not estimate entropy by compressing samples or by passing a statistical test suite. NIST SP 800-90B requires a model of the noise process, conservative min-entropy estimation, and continuous health tests; these roles are distinct from cryptanalysis of the DRBG [[9]](#ref-9).

## A Stateful Security Model

A deployed DRBG is better modeled by four operations:

$$
\begin{aligned}
(S,h)&\gets\mathsf{Instantiate}(E,N,P),\\
S'&\gets\mathsf{Reseed}(S,E,A),\\
(S',R)&\gets\mathsf{Generate}(S,\ell,A),\\
\varnothing&\gets\mathsf{Uninstantiate}(S).
\end{aligned}
$$

They respectively create state, mix fresh entropy, return bits while evolving state, and erase state. Here $E$ is entropy input, $N$ a nonce, $P$ personalization, $A$ additional input, and $h$ an instance handle. Labels and lengths must be encoded unambiguously when inputs are combined.

### State-compromise properties

Two informal goals organize most designs.


**Definition 3**. *Backtracking resistance* means that disclosure of the current state does not reveal outputs generated before the most recent secure state update and erasure. *Prediction resistance* means that compromise does not allow prediction indefinitely: after sufficient unknown entropy is incorporated, the generator recovers and later output is again secure.

These are also called forward and backward security, unfortunately with both directions used by different authors. Explicit terms avoid ambiguity. Backtracking resistance is achieved by one-way state evolution and secure erasure. Recovery requires fresh entropy; deterministic evolution alone cannot hide a fully exposed state. Formal "PRNG with input" models additionally consider adversarially chosen inputs, partial state compromise, and when entropy is accumulated [[7]](#ref-7).

### Forks, snapshots, and concurrency

Copying a process copies its DRBG state. Both children can then emit the same stream unless the implementation detects the fork and reseeds. VM snapshots create the same reset problem on a larger scale; experiments have converted repeated state into repeated TLS randomness and DSA-key exposure [[18]](#ref-18). Containers, suspend/resume, crash restoration, and cloned embedded images deserve the same treatment.

Concurrent access must make state update and output extraction atomic. Merely placing a lock around the primitive may not solve rollback or duplicate-state problems. Robust designs combine per-instance personalization, monotonic or fork-detection data, periodic reseeding, and an operating-system RBG that is itself snapshot-aware.

## Construction Families

Practical DRBGs usually build on a block cipher, hash function, HMAC, or stream cipher. Their security is bounded by the seed entropy, state size, primitive strength, output exposed between reseeds, and correctness of the state-update logic.

### Hash and HMAC designs

NIST Hash_DRBG maintains internal values $V$ and $C$ and uses repeated hashing plus modular state updates. HMAC_DRBG maintains a key $K$ and value $V$; its update function repeatedly applies HMAC with domain-separating control bytes. Both accept reseed and additional input. HMAC_DRBG is conceptually attractive where a constant-time, well-tested HMAC already exists, while Hash_DRBG can avoid the HMAC wrapper. Security still depends on using an approved parameter set and following every update step exactly.

### Counter-mode designs

CTR_DRBG uses a block cipher under an evolving key to generate encrypted counter blocks. In simplified form,

$$
R=E_K(V+1)\,\|\,E_K(V+2)\,\|\cdots,
$$

followed by an update of both $K$ and $V$. The actual SP 800-90A algorithm also specifies derivation-function variants, limits, and exact update ordering. AES acceleration makes this family fast on many processors. Correctness requires unique counter inputs under a key, strict request/reseed limits, and protection against side channels in the block-cipher implementation.

### Stream-cipher designs

A stream cipher naturally expands a secret key and nonce/counter into blocks. ChaCha uses a 512-bit state and ARX operations—addition, rotation, and XOR—to obtain fast software performance and avoid table lookups [[6]](#ref-6). A generator can produce ChaCha blocks, reserve some secret output to rekey, advance the counter, and erase old key material. Such "fast key erasure" makes compromise of the new state insufficient to recover already returned blocks.

This family underlies several operating-system and library generators, but a stream cipher is not automatically a complete DRBG specification. The design must define nonce allocation, rekeying, maximum output, reseeding, fork safety, and error behavior. Reusing a key–nonce pair repeats the stream.

### Pool-based designs

Yarrow separates entropy collection, estimation, reseeding, and generation. It uses slow and fast pools so that a single overestimated source does not immediately force a reseed [[5]](#ref-5). Fortuna removes explicit per-source entropy estimates from the reseed schedule and distributes events over 32 pools; pool $i$ participates every $2^i$ reseeds. The hierarchy lets frequent reseed opportunities coexist with eventual accumulation from slow sources.

Pool designs are architectures, not excuses to credit every event with entropy. They still require source identifiers, event-size limits, defensive mixing, startup rules, and health monitoring. Overly complex accounting can itself become a vulnerability.

### Comparison
| Family | Core assumption | Main strengths | Main cautions | Typical role |
|:---|:---|:---|:---|:---|
| Blum–Micali/BBS | Discrete log or quadratic residuosity/factoring | Direct link to number-theoretic hardness; historically foundational | Too slow for ordinary bulk generation; parameters and output-bit rules matter | Theory, specialized settings |
| Hash_DRBG | Hash behaves as required by the security analysis | No block cipher; standardized; portable | Intricate state/update procedure; performance depends on hash | Validated general-purpose DRBG |
| HMAC_DRBG | HMAC is a secure PRF/MAC | Reuses common constant-time primitive; standardized | Exact update protocol and entropy interface remain essential | Validated applications and libraries |
| CTR_DRBG | Block cipher behaves as a PRP | High throughput with AES hardware; standardized | Counter/key discipline, derivation-function choices, side channels | High-performance validated modules |
| ChaCha-based | ChaCha keystream is pseudorandom | Fast in software; simple constant-time operations; easy rekeying | Not by itself a full RBG specification; nonce, fork, and reseed policy required | OS and library CSPRNGs |
| Yarrow/Fortuna-style pools | Hash/cipher plus conservative entropy accumulation | Multiple sources; compromise recovery; operational architecture | Complex collection and startup behavior; estimates can be wrong | System-wide entropy subsystem |

## Standards and System Interfaces

### The NIST SP 800-90 series

The current series assigns a separate job to each document.

- SP 800-90A Rev. 1 specifies Hash_DRBG, HMAC_DRBG, and CTR_DRBG, including instantiate, reseed, generate, state-update procedures, security strengths, and request limits [[8]](#ref-8).

- SP 800-90B specifies entropy-source design, validation, conditioning, min-entropy estimation, and startup/continuous health tests [[9]](#ref-9).

- SP 800-90C, finalized in 2025, composes these pieces into RBG1, RBG2, RBG3, and chained RBGC constructions [[10]](#ref-10). RBG3 is designed for full-entropy output and continuously accesses physical entropy; the other classes make different availability and assurance tradeoffs.

The German BSI AIS 20/31 framework uses different functionality classes for deterministic, physical, and non-physical generators. NIST IR 8446 compares the two systems and is useful when evaluation or certification crosses their terminology [[11]](#ref-11). Compliance with one profile should not be silently asserted from compliance with another.

### Operating-system APIs

Applications should normally request bytes from the operating system rather than instantiate their own entropy collector. The OS can aggregate hardware and event sources, serialize access, handle boot readiness, and evolve its implementation without changing applications. On contemporary Unix-like systems this generally means a blocking-at-startup system call such as `getrandom()`, or a high-level library API backed by it. Linux feeds hardware RNG data into its entropy pool and exports the initialized generator through its random interfaces [[15]](#ref-15).

The safe rule is semantic rather than device-name folklore: use the platform's documented cryptographic random API, check errors, and ensure it does not return before secure initialization. Do not fall back to a timestamp, process ID, MAC address, or simulation PRNG when the call fails. A fail-closed application is preferable to silently creating recoverable keys.

## Failure Modes and Case Studies

Randomness failures often leave valid-looking keys and transcripts, so they can remain invisible until an attacker compares many devices or executions.

### Insufficient or repeated seeds

In 2008, Debian disclosed that a local change to OpenSSL had made generated values predictable; keys created by affected packages had to be regenerated, not merely protected by upgrading the software [[16]](#ref-16). The lesson is that entropy-path changes require cryptographic review and regression tests, and that fixing a generator does not repair secrets already produced.

A 2012 Internet-wide study computed private keys for measurable populations of TLS and SSH hosts by finding shared RSA factors and repeated DSA nonces. The affected population was concentrated in headless and embedded devices with weak first-boot entropy [[17]](#ref-17). Fleet diversity, manufacturing personalization, secure provisioning, and delayed key generation are therefore part of RBG engineering.

### State exposure, rollback, and cloning

Reading a DRBG state may expose all future output until reseeding. If the update is reversible, it may also reveal the past. Crash dumps, swap, debugging interfaces, speculative-execution leakage, and memory-safety bugs expand the attack surface. State should be kept in the smallest feasible trusted region, updated after bounded output, erased on replacement, and excluded from logs and serialization.

Rollback defeats monotonic state evolution. A VM restored twice may reuse TLS randoms, nonces, or ephemeral signature values even though each original run was correctly seeded [[18]](#ref-18). Snapshot-aware platforms should inject fresh host entropy or a generation identifier after restore, while guests should reseed on resume and fork.

### Subverted parameters: Dual_EC_DRBG

Dual_EC_DRBG used elliptic-curve points $P$ and $Q$. If someone knew a scalar relationship $Q=dP$, truncated output could permit recovery of internal state. The unexplained provenance of the standardized points therefore created a credible trapdoor concern. NIST advised against the construction in 2013 and removed it from SP 800-90A Rev. 1; the remaining approved mechanisms are Hash_DRBG, HMAC_DRBG, and CTR_DRBG [[19]](#ref-19).

The episode established enduring design requirements: parameter generation must be transparent and reproducible, optional choices must be genuinely easy to replace, standards need diverse review, and a proof under an assumption does not eliminate malicious-parameter risk.

### Nonce failures and deterministic hedging

For DSA and ECDSA,

$$
s=k^{-1}(H(m)+xr)\pmod q.
$$

Reusing the ephemeral $k$ in two signatures gives two linear equations from which $k$ and then the private key $x$ can be recovered. Even partial bias can enable lattice attacks. RFC 6979 derives $k$ deterministically from the private key and message using an HMAC_DRBG-style process, removing the live-RNG dependency during signing while preserving ordinary verification [[14]](#ref-14). Key generation still needs strong randomness, and deterministic signatures require side-channel protection; deterministic behavior is a hedge, not a universal substitute for an RBG.

## Testing and Assurance

### Three different questions

Evaluation should separate three layers.

1.  *Primitive and construction security:* Is there a credible assumption, reduction, and public cryptanalysis? Are the state size, output bound, and security strength adequate?

2.  *Entropy-source validation:* Does a stochastic model justify a conservative min-entropy claim under normal and adversarial conditions? Do startup and continuous tests detect failures without pretending to measure security from a short window?

3.  *Implementation verification:* Does code match the specification, pass known-answer tests, handle errors and concurrency, and erase state? Are reseed, fork, boot, rollback, and fault paths exercised?

NIST SP 800-22 supplies statistical tests that may reveal gross defects, but it explicitly states that no test suite can certify cryptographic suitability or replace cryptanalysis [[12]](#ref-12). Test-vector success likewise establishes conformance for particular paths, not entropy quality or side-channel safety.

### Health tests are not randomness certificates

Online health tests should detect catastrophic changes in a noise source, such as a stuck oscillator or an implausibly long repetition. They need controlled false-positive behavior and must fail safely. Applying the same tests to DRBG output is usually low-value: a competent deterministic construction will mask a dead source until the internal state is exhausted or compromised. Health tests belong as close as possible to raw noise, before conditioning hides evidence of failure.

## Engineering Guidance

### A robust design checklist

- *Use an established interface.* Prefer the OS CSPRNG or a maintained cryptographic library; do not design an application-specific generator from hashes and clocks.

- *Wait for initialization.* Early boot, first-use embedded devices, and freshly cloned images are special states. Block or fail rather than return low-entropy output.

- *Seed to the claimed strength.* Account with min-entropy and assume the attacker knows all public context. More output length does not repair a weak seed.

- *Separate domains and instances.* Personalization and explicit labels prevent accidental cross-protocol reuse; they do not replace entropy.

- *Evolve and erase state.* Rekey after bounded output, keep state secret, and erase superseded material to obtain backtracking resistance.

- *Reseed for recovery.* Incorporate fresh, independently sourced entropy after compromise, fork, restore, and according to a conservative output/time policy.

- *Handle concurrency and cloning.* Make updates atomic; use per-process or per-thread derivation only from a secure master design; detect fork/snapshot events where the platform permits.

- *Sample ranges without bias.* To sample uniformly from $\{0,\ldots,n-1\}$, use rejection sampling. Reducing a fixed-width word modulo $n$ is biased unless $n$ divides the word-space size.

- *Propagate failures.* Check return values and never substitute a weaker generator. Treat entropy-source failure as a security event.

- *Test the whole lifecycle.* Include deterministic known-answer tests, source-failure injection, long-run concurrency, boot, fork, snapshot, crash recovery, request limits, and zeroization inspection.

### Uniform integer sampling

Suppose the RBG yields uniform $k$-bit integers $X$ and $n\leq2^k$. Let

$$
t=\left\lfloor\frac{2^k}{n}\right\rfloor n.
$$

Draw $X$ until $X<t$, then return $X\bmod n$. Every residue has exactly $t/n$ preimages, so the result is uniform. The expected number of iterations is $2^k/t<2$ when $k=\lceil\log_2 n\rceil$ and improves when wider words are used. Secret-dependent rejection loops may need additional side-channel analysis in constrained threat models.

## Post-Quantum Perspective

General quantum search gives a square-root attack on an ideal $s$-bit seed or key space, suggesting $2^{s/2}$ rather than $2^s$ generic work. This does not make symmetric DRBGs obsolete: using a 256-bit internal secret targets roughly 128-bit generic quantum security. Hash-, HMAC-, AES-, and ChaCha-based designs remain natural candidates when their parameters and usage bounds are chosen for the desired post-quantum strength.

Number-theoretic historical generators based on factoring or discrete logarithms do not enjoy the same outlook because Shor's algorithm attacks their core assumptions. The distinction reinforces the value of separating the abstract existence theory from practical recommendations. Quantum random sources may improve entropy acquisition, but they do not remove the need for device modeling, health tests, conditioning, authentication of the entropy path, and a robust DRBG.

## Open Problems and Research Directions

#### Entropy under hostile observation

Entropy estimates commonly assume a boundary around the source. Remote timing, power analysis, shared microarchitecture, active voltage/clock manipulation, and learned predictors weaken that boundary. Models that remain testable while capturing such auxiliary information are still difficult.

#### Composable recovery

A system contains firmware RNGs, hardware instructions, hypervisors, kernels, libraries, language runtimes, and applications. Each may condition, cache, or expand the preceding layer. Establishing when the composition recovers after partial compromise—without double-counting the same entropy—needs clearer interfaces and proofs.

#### Rollback-resistant state

Cloud snapshots and migration make state duplication routine. Solutions based on trusted counters, host-injected secrets, and fork-safe derivation trade availability, privacy, and hardware trust. Portable guarantees are limited.

#### Verified implementations

Machine-checked proofs can connect source code to a formal DRBG model, but the proof boundary must include entropy calls, compiler behavior, concurrency, zeroization, and side channels. Verified primitive code with an unmodeled lifecycle leaves the dominant risks untouched.

#### Transparent, agile standards

The Dual_EC_DRBG history shows that provenance and governance are security properties. Reproducible parameters, public change histories, multiple interoperable constructions, and clear deprecation mechanisms reduce both technical and institutional single points of failure.

## Takeaways

- Cryptographic pseudorandomness is computational indistinguishability, equivalently next-bit unpredictability, not merely a long period or success on statistical tests.

- A DRBG expands entropy but cannot create it. The security ceiling is set by conservative min-entropy, internal-state size, and primitive strength.

- Hash/HMAC, counter-mode, and ChaCha-based generators are efficient modern families; BBS and Blum–Micali supply important theoretical roots.

- State compromise divides security into protection of earlier output and recovery of later output. One-way updates help the first; only fresh unknown entropy can provide the second.

- Boot, fork, VM restore, cloning, concurrency, and error handling are part of the cryptographic design, not peripheral systems issues.

- Standards deliberately separate DRBG mechanisms, entropy sources, and complete RBG constructions. Validation must examine all three layers.

- Applications should use the operating system's documented cryptographic interface, check errors, sample ranges without modulo bias, and avoid consuming randomness where a sound deterministic construction removes the requirement.


## References

<a id="ref-1"></a>

1. A. C.-C. Yao, "Theory and Applications of Trapdoor Functions," *23rd Annual Symposium on Foundations of Computer Science*, pp. 80–91, 1982. doi:[10.1109/SFCS.1982.45](https://doi.org/10.1109/SFCS.1982.45).

<a id="ref-2"></a>

2. M. Blum and S. Micali, "How to Generate Cryptographically Strong Sequences of Pseudorandom Bits," *SIAM Journal on Computing*, vol. 13, no. 4, pp. 850–864, 1984. doi:[10.1137/0213053](https://doi.org/10.1137/0213053).

<a id="ref-3"></a>

3. L. Blum, M. Blum, and M. Shub, "A Simple Unpredictable Pseudo-Random Number Generator," *SIAM Journal on Computing*, vol. 15, no. 2, pp. 364–383, 1986. doi:[10.1137/0215025](https://doi.org/10.1137/0215025).

<a id="ref-4"></a>

4. O. Goldreich, H. Krawczyk, and M. Luby, "On the Existence of Pseudorandom Generators," *SIAM Journal on Computing*, vol. 22, no. 6, pp. 1163–1175, 1993. doi:[10.1137/0222069](https://doi.org/10.1137/0222069).

<a id="ref-5"></a>

5. J. Kelsey, B. Schneier, and N. Ferguson, "Yarrow-160: Notes on the Design and Analysis of the Yarrow Cryptographic Pseudorandom Number Generator," in *Selected Areas in Cryptography*, LNCS 1758, pp. 13–33, 1999. <https://www.schneier.com/academic/archives/2000/01/yarrow-160.html>.

<a id="ref-6"></a>

6. D. J. Bernstein, "ChaCha, a Variant of Salsa20," 2008. <https://cr.yp.to/chacha/chacha-20080120.pdf>.

<a id="ref-7"></a>

7. Y. Dodis, D. Pointcheval, S. Ruhault, D. Vergnaud, and D. Wichs, "Security Analysis of Pseudo-Random Number Generators with Input: /dev/random is not Robust," in *ACM CCS*, 2013. <https://eprint.iacr.org/2013/338>.

<a id="ref-8"></a>

8. E. Barker and J. Kelsey, *Recommendation for Random Number Generation Using Deterministic Random Bit Generators*, NIST SP 800-90A Rev. 1, 2015. doi:[10.6028/NIST.SP.800-90Ar1](https://doi.org/10.6028/NIST.SP.800-90Ar1).

<a id="ref-9"></a>

9. M. S. Turan, E. Barker, J. Kelsey, K. McKay, M. Baish, and M. Boyle, *Recommendation for the Entropy Sources Used for Random Bit Generation*, NIST SP 800-90B, 2018. doi:[10.6028/NIST.SP.800-90B](https://doi.org/10.6028/NIST.SP.800-90B).

<a id="ref-10"></a>

10. E. Barker, J. Kelsey, K. McKay, A. Roginsky, and M. S. Turan, *Recommendation for Random Bit Generator Constructions*, NIST SP 800-90C, 2025. doi:[10.6028/NIST.SP.800-90C](https://doi.org/10.6028/NIST.SP.800-90C).

<a id="ref-11"></a>

11. E. Barker et al., *Bridging the Gap Between Standards on Random Number Generation: Comparison of SP 800-90 Series and AIS 20/31*, NIST IR 8446, 2026. doi:[10.6028/NIST.IR.8446](https://doi.org/10.6028/NIST.IR.8446).

<a id="ref-12"></a>

12. A. Rukhin et al., *A Statistical Test Suite for Random and Pseudorandom Number Generators for Cryptographic Applications*, NIST SP 800-22 Rev. 1a, 2010. doi:[10.6028/NIST.SP.800-22r1a](https://doi.org/10.6028/NIST.SP.800-22r1a).

<a id="ref-13"></a>

13. D. Eastlake, J. Schiller, and S. Crocker, *Randomness Requirements for Security*, RFC 4086, BCP 106, 2005. <https://www.rfc-editor.org/rfc/rfc4086.html>.

<a id="ref-14"></a>

14. T. Pornin, *Deterministic Usage of the Digital Signature Algorithm (DSA) and Elliptic Curve Digital Signature Algorithm (ECDSA)*, RFC 6979, 2013. <https://www.rfc-editor.org/rfc/rfc6979.html>.

<a id="ref-15"></a>

15. The Linux Kernel Documentation, "Hardware Random Number Generators," accessed September 2026. <https://docs.kernel.org/admin-guide/hw_random.html>.

<a id="ref-16"></a>

16. Debian Security Team, "DSA-1571-1: New OpenSSL Packages Fix Predictable Random Number Generator," 2008. <https://www.debian.org/security/2008/dsa-1571>.

<a id="ref-17"></a>

17. N. Heninger, Z. Durumeric, E. Wustrow, and J. A. Halderman, "Mining Your Ps and Qs: Detection of Widespread Weak Keys in Network Devices," in *21st USENIX Security Symposium*, pp. 205–220, 2012. <https://www.usenix.org/conference/usenixsecurity12/technical-sessions/presentation/heninger>.

<a id="ref-18"></a>

18. T. Ristenpart and S. Yilek, "When Good Randomness Goes Bad: Virtual Machine Reset Vulnerabilities and Hedging Deployed Cryptography," in *NDSS*, 2010. <https://www.ndss-symposium.org/ndss2010/when-good-randomness-goes-bad-virtual-machine-reset-vulnerabilities-and-hedging-deployed/>.

<a id="ref-19"></a>

19. National Institute of Standards and Technology, "NIST Removes Cryptography Algorithm from Random Number Generator Recommendations," 2014. <https://www.nist.gov/news-events/news/2014/04/nist-removes-cryptography-algorithm-random-number-generator-recommendations>.
