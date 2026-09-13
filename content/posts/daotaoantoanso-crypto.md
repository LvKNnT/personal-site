---
title: Dao Tao An Toan So WUs
date: 2026-07-28
description: This is a series of crypto writeups for daotaoantoanso.org
---

# Fake Flag Writeup

## Summary

Local, offline crypto challenge — only `fake_flag.py` (source) and `output.txt` (generated data) are provided, no remote connection. The flag is encoded as a large integer `a` and scrambled through `a^p - k^p` and `a^q - k^q` for two small primes `p`, `q` and a random secret `k`; the core weakness is that `A^n - B^n` is always divisible by `A - B`, so `a - k` can be pulled out as a shared algebraic factor of the two power differences via `gcd`, then combined with the directly-leaked `k`, `r`, and `d` values to recover the flag modulo `r`, with the final exact value pinned down by brute-forcing against the flag's known prefix format.

Flag:

```text
0160ca14{This_is_fake_flag_hahaha!}
```

## Triage

`fake_flag.py` converts the flag to an integer and mixes it with a random secret `k` through two prime-power differences:

```python
FLAG = b"0160ca14{?????????????????????????}"

p = getPrime(16)
q = getPrime(16)
assert p != q

r = getPrime(256)

a = bytes_to_long(FLAG)

k = randint(1, r-1)

x = a**p-k**p
y = a**q-k**q
```

It then reduces those two large differences down to a single leaked value `number`, via a small-divisor extraction and a `gcd`:

```python
def find_small_divisor(number: int):
    divisor = 10
    while(number%divisor != 0):
        divisor += 1
    return divisor

d = find_small_divisor(gcd(x+y, x))
number = (k*gcd((x+y)//d, y//d)) % r
```

`output.txt` prints `p`, `q`, `r`, `k`, `d`, and `number` in full — every parameter except `x`, `y`, and `a` (the flag itself) is handed over directly:

```text
p = 50969
q = 48859
r = 90254724465230431478307125031992674356849799682990984954478193657616557516363
k = 77613813229115705407983120551706296959236412766954020268752564135993144643307
d = 2111
number = 55082456475351903378255749118970454587034932966959264607612363109719848202778
```

`p` and `q` are only 16-bit primes and `r` is a 256-bit prime — small enough parameters that the interesting structure is entirely in how `x`, `y`, `d`, and `number` were derived from `a` and `k`, not in factoring anything.

## Solve Path

For a prime exponent `n`, `A^n - B^n` always factors as `(A - B) * sum_{i=0}^{n-1} A^i B^{n-1-i}`. Applied here:

```text
x = a**p - k**p = (a - k) * S_p
y = a**q - k**q = (a - k) * S_q
x + y = (a - k) * (S_p + S_q)
```

so `(a - k)` is a common factor of `x` and `x + y`, meaning `gcd(x + y, x)` retains `(a - k)` times whatever common factor `S_p` and `S_q` happen to share. `find_small_divisor` peels off that small extraneous common factor as `d`, and the challenge exposes `number = k * gcd((x+y)//d, y//d) mod r` as the only value tying back to `a`.

Since `k`, `d`, and `r` are all given directly in `output.txt`, the residual `gcd`-derived quantity can be inverted straight back to `a - k` (and hence `a`) modulo `r`:

```python
k_inv = pow(k, -1, r)
a_gcd = (number * k_inv * d) % r
a_sus = (a_gcd + k) % r
```

`a_sus` is only `a mod r` — the real flag integer `a` (35 bytes, larger than the 256-bit `r`) is `a_sus + m*r` for some unknown small multiplier `m`. Because the flag's format is known (`0160ca14{...}`, 35 bytes total), the correct `m` is found by locating the smallest candidate at or above the minimal integer that starts with the known prefix:

```python
prefix = b"0160ca14{"
total_length = 35
suffix_length = total_length - len(prefix)

min_a = int.from_bytes(prefix + b"\x00" * suffix_length, 'big')

m = (min_a - a_sus) // r
if a_sus + m * r < min_a:
    m += 1

a = a_sus + m * r
flag = long_to_bytes(a)
```

Note that `solve.py` references `p`, `q`, `r`, `k`, `d`, and `number` without ever defining or importing them — it is written to be run in a namespace where `output.txt`'s assignment statements have already been evaluated (e.g. `python3 -c "exec(open('output.txt').read()); exec(open('solve.py').read())"`), since `output.txt`'s contents are themselves valid Python assignments.

## Exploit

[solve.py](#Solve) takes the leaked `k`, `r`, `d`, and `number` from `output.txt`, inverts `k` mod `r` to recover `a mod r`, then brute-forces the correct multiple of `r` to add using the known `0160ca14{...}` prefix and fixed flag length, printing the recovered flag bytes.

Run (loading `output.txt`'s values into the same namespace first):

```bash
python3 -c "exec(open('output.txt').read()); exec(open('solve.py').read())"
```

Key steps:

- `k_inv`: modular inverse of the leaked `k` mod `r`, used to undo the `k * (...)` scaling in `number`.
- `a_gcd` / `a_sus`: recovers `a mod r` from `number` by undoing the `k` scaling and the `d` division, then adding back `k`.
- `min_a`: the smallest integer whose big-endian bytes start with the known flag prefix and match the known total flag length.
- `m`: the multiplier on `r` that lifts `a_sus` up to the correct absolute value of `a`, found by rounding `(min_a - a_sus) / r` up to the nearest integer that doesn't undershoot `min_a`.

## Solve

```python=
from Crypto.Util.number import long_to_bytes

# from output.txt
p = 50969
q = 48859
r = 90254724465230431478307125031992674356849799682990984954478193657616557516363
k = 77613813229115705407983120551706296959236412766954020268752564135993144643307
d = 2111
number = 55082456475351903378255749118970454587034932966959264607612363109719848202778

k_inv = pow(k, -1, r)
a_gcd = (number * k_inv * d) % r
a_sus = (a_gcd + k) % r

prefix = b"0160ca14{"
total_length = 35 
suffix_length = total_length - len(prefix)

min_a = int.from_bytes(prefix + b"\x00" * suffix_length, 'big')

m = (min_a - a_sus) // r
if a_sus + m * r < min_a:
    m += 1

a = a_sus + m * r
flag = long_to_bytes(a)

print(f"Recovered Flag: {flag.decode()}")
```

## Verification

```text
Recovered Flag: 0160ca14{This_is_fake_flag_hahaha!}
```

## Flag

```text
0160ca14{This_is_fake_flag_hahaha!}
```

## Lessons Learned

- `A^n - B^n` is always divisible by `A - B` for any exponent `n`; taking the `gcd` of two such differences sharing the same `A - B` (but different exponents) is a way to recover that common factor without knowing `A` or `B` individually.
- Leaking a value modulo a modulus smaller than the secret itself only pins the secret down to a residue class — recovering the exact value needs either a known format/prefix to brute-force the multiplier, or extra congruences (CRT) to extend the modulus.
- Watch for solve scripts that assume prior state (variables from a companion data file) rather than loading it themselves — always check for a missing `open()`/`import` before assuming a script is broken.
- Encoding a flag as one large integer straddling a scrambling modulus is a common way to keep an "encryption" scheme partially reversible while still requiring an extra reconstruction step at the end.
- When several of a scheme's "secret" parameters are printed directly in the output, treat that as a strong signal that the real difficulty lies in inverting the specific algebraic combination they were fed into, not in any missing-value brute force.

# Randomness Writeup

## Summary

Offline crypto challenge: `randomness.py` runs locally and writes a single `output.txt` containing 27 integers, each a dot product of a random 46-coefficient vector (coefficients in `[1, 2^16]`) against the 46 flag character codes. The random coefficients come from Python's `random` module seeded with `int(time.time())` - a low-entropy, guessable seed - so the coefficient vectors can be regenerated exactly, turning flag recovery into solving a linear system (via lattice reduction) once the seed is brute-forced over a narrow timestamp window.

Flag:

```text
0160ca14{https://cryptohack.org/user/Archive/}
```

## Triage

`randomness.py` seeds `random` with the current Unix timestamp, then builds 27 linear equations over the 46 flag bytes:

```python
FLAG = b"0160ca14{????????????????????????????????????}"
variable_list = list(FLAG)

seed = int(time.time())
random.seed(seed)

coefficients_list = []
for i in range(27):
    coefficients = []
    for j in range(len(FLAG)):
        coefficients.append(random.randint(1, 2**16))
    coefficients_list.append(coefficients)

value_list = []
for vector in coefficients_list:
    value_list.append(scalar_multiplication(vector, variable_list))

with open("output.txt", "w") as file:
    file.write(f"{value_list = }")
```

That's 27 known linear equations (`value_list[i] = sum_j coeff[i][j] * flag[j]`) in 46 unknown bytes (`flag[j]`, each in printable-ASCII range) - badly underdetermined by ordinary linear algebra (27 equations, 46 unknowns), but the coefficients themselves are fully recoverable once the seed is known, and the seed is just `int(time.time())` at the moment the script ran. `output.txt` is small - just the 27 output values:

```
value_list = [123790633, 156591608, 147000916, 125772724, 131152757, 152644709, 144001980, 112930002, 118794552, ...]
```

The flag format `0160ca14{...}` fixes 9 leading bytes and 1 trailing `}`, further constraining the search - but the real break is the seed.

## Solve Path

Since the seed is `int(time.time())`, and the challenge's approximate creation time is known (from file metadata / submission time), the seed only needs to be brute-forced over a small window of candidate Unix timestamps around that value:

```python
date = "5/15/2025 11:26:35 AM"
approx_timestamp = int(time.mktime(time.strptime(date, "%m/%d/%Y %I:%M:%S %p")))

# check ngược 10000s
for offset in range(10000):
    seed = approx_timestamp - offset
    random.seed(seed)
```

For each candidate seed, regenerate the exact same 27x46 coefficient matrix `random` would have produced:

```python
    coefficients_list = []
    for i in range(27):
        coefficients = []
        for j in range(46):
            coefficients.append(random.randint(1, 2**16))
        coefficients_list.append(coefficients)
```

Even with the correct coefficients, 27 equations in 46 unknowns is still underdetermined for plain Gaussian elimination - but each unknown is a *small* integer (a printable byte, roughly 0-127), which is exactly the shape lattice-basis reduction (LLL) is built to exploit: find a short vector in the lattice of integer combinations that hits the target sums. The solver builds an augmented lattice basis with an identity block for the flag-byte unknowns, appends the coefficient columns, and appends a row encoding `-value_list` so a lattice vector that reproduces the flag makes the combination cancel to zero:

```python
    rows = []
    for i in range(46):
        row = [0] * 46
        row[i] = 1
        for j in range(27):
            row.append(coefficients_list[j][i])
        rows.append(row)

    last_row = [0] * 46
    for j in range(27):
        last_row.append(-value_list[j])
    rows.append(last_row)

    B = matrix(ZZ, rows)
    L = B.LLL()
```

Any reduced basis row whose trailing 27 entries (the equation-residual columns) are all zero has its leading 46 entries as a candidate flag-byte vector - LLL finds this because it's the shortest vector consistent with the linear constraints, and small-byte-valued solutions are short:

```python
    for row in L:
        if all(x == 0 for x in row[46:]):
            try:
                chars = [chr(x) for x in row[:46]]
                flag_candidate = "".join(chars)
                if "0160ca14{" in flag_candidate:
                    print(f"Seed: {seed}")
                    print(f"Flag: {flag_candidate}")
                    exit()
            except Exception:
                pass
```

The known flag prefix `0160ca14{` doubles as the correctness check that both confirms the right seed and rules out sign-flipped / scaled LLL output rows (LLL can return `-v` as easily as `v`).

## Exploit

[solve.sage](#Solve) brute-forces `random`'s seed over a 10000-second window around an approximate known timestamp, regenerates the coefficient matrix for each candidate seed exactly as the challenge did, and uses LLL on an augmented lattice to recover the small-byte flag vector consistent with the observed dot products, stopping as soon as a candidate contains the known flag prefix. Run with:

```
sage solve.sage
```

Key steps in the script:
- `approx_timestamp` - a known/estimated creation time anchoring the seed search
- `for offset in range(10000): seed = approx_timestamp - offset` - brute-forces the `time.time()`-based seed
- regenerating `coefficients_list` via `random.seed(seed)` + `random.randint(1, 2**16)` - reproduces the exact challenge RNG stream
- augmented lattice `rows` (identity block + coefficient columns + `-value_list` row) fed to `matrix(ZZ, rows).LLL()` - recovers small integer unknowns from underdetermined linear equations
- prefix check `"0160ca14{" in flag_candidate` - confirms the correct seed/LLL row and terminates the search

## Solve

```python=
import time
import random
import random
import time
from z3 import *

value_list = value_list = [123790633, 156591608, 147000916, 125772724, 131152757, 152644709, 144001980, 112930002, 118794552, 150363810, 132253260, 129427768, 125337368, 132414473, 139338226, 121261563, 134915261, 133063748, 129569576, 135580576, 141567869, 142129037, 150793830, 139504515, 143094641, 143348690, 133597992]

date = "5/15/2025 11:26:35 AM"
approx_timestamp = int(time.mktime(time.strptime(date, "%m/%d/%Y %I:%M:%S %p")))

for offset in range(10000):
    seed = approx_timestamp - offset
    random.seed(seed)
    
    coefficients_list = []
    for i in range(27):
        coefficients = []
        for j in range(46):
            coefficients.append(random.randint(1, 2**16))
        coefficients_list.append(coefficients)
            
    rows = []
    for i in range(46):
        row = [0] * 46
        row[i] = 1 
        
        for j in range(27):
            row.append(coefficients_list[j][i])
            
        rows.append(row)
        
    last_row = [0] * 46
    for j in range(27):
        last_row.append(-value_list[j])
    rows.append(last_row)
    
    B = matrix(ZZ, rows)
    L = B.LLL()
    
    for row in L:
        if all(x == 0 for x in row[46:]):
            
            try:
                chars = [chr(x) for x in row[:46]]
                flag_candidate = "".join(chars)
                
                if "0160ca14{" in flag_candidate:
                    print(f"Seed: {seed}")
                    print(f"Flag: {flag_candidate}")
                    exit()
            except Exception:
                pass
                
    if offset % 60 == 0 and offset > 0:
        print(f"Current: {offset}")
```

## Verification

```text
Seed: 1747283195
Flag: 0160ca14{https://cryptohack.org/user/Archive/}
```

## Flag

```text
0160ca14{https://cryptohack.org/user/Archive/}
```

## Lessons Learned

- Seeding a PRNG from a low-entropy, guessable source (`int(time.time())`) reduces "cryptographically random" coefficients to a small brute-forceable search space once an approximate generation time is known.
- An underdetermined linear system (fewer equations than unknowns) is still breakable when the unknowns are constrained to a small range (e.g. printable bytes) - lattice reduction (LLL) finds short/small integer solutions that ordinary linear algebra can't uniquely pin down.
- Encoding a linear system as a lattice basis (identity block for unknowns + coefficient columns + a target row) is a general pattern for turning "solve Ax=b over small integers" into "find a short vector," not specific to this challenge.
- A known plaintext/flag format (prefix, suffix, charset) is valuable beyond framing the problem - use it as the terminating correctness oracle when brute-forcing over an auxiliary parameter like a seed.

# XOR Writeup

## Summary

This is an offline crypto challenge: `xor.py` XORs an 8-byte key `k` against an 8-byte message `m`, and separately hashes `k` through a two-round SHA-256 chain, publishing only the XOR ciphertext, the final hash, and one structural fact about `m`. No remote service is involved - the printed hex strings in `xor.py`'s own output comments are the actual challenge data. The core mechanic is that the one structural constraint on `m` collapses one byte of the 8-byte key into a function of the others, and the two-round SHA-256 chain is used purely as a verification oracle to brute-force the remaining key space.

Flag:

```text
k = 'justakey' 
m = '<3meow<3'
```

## Triage

`xor.py` builds the ciphertext as a plain byte-wise XOR of an 8-byte message and an 8-byte key, then computes a SHA-256 hash chain over the key alone:

```python
m = '<3meow<3'  #pretty sure this is not the actual content
k = 'justakey'  #same as above
c = bytes(a ^ b for (a, b) in zip(toBa(m), toBa(k)))

h = SHA256.new()
h.update(toBa(k))
hk = h.digest()
h.update(hk)
hhk = h.digest()
```

The `m` and `k` values in the source are explicitly marked as placeholders used only to demonstrate the format; the real challenge data is what the script actually prints:

```python
print(isStandard(m,2))
# True
print(baToHex(c))
# 56461e110e1c594a
print(baToHex(hhk))
# 10d8261dcb7761cce260142ee7e6c7427056d2750c80d252f088f1274b235bca
```

`isStandard(s, nob)` checks a structural property of the plaintext, which for `nob=2` and an 8-byte string reduces to a single equality:

```python
def isStandard(s,nob):
    sl = len(s)
    for i in range(0,nob-1):
        if (s[i] == s[sl-nob+i]):
            continue
        return False
    return all(c in string.printable for c in s)
```

With `nob=2`, the loop only runs for `i=0`, so `isStandard(m,2) == True` means exactly `m[0] == m[6]` (plus every character of `m` being printable). `hhk = SHA256(k || SHA256(k))` is a one-way hash chain over `k` with no shortcut - recovering `k` requires an oracle-style brute force, but `k` is known (from the challenge's hint text) to match `/[a-z]{8}/`, an 8-character lowercase key.

## Solve Path

The single structural relation on `m` becomes a relation on `k` once XOR is unwound: `m[i] = c[i] XOR k[i]`, so `m[0] == m[6]` implies `c[0] XOR k[0] == c[6] XOR k[6]`, which pins `k[6]` as a function of `k[0]`:

```python
DELTA6 = c[0] ^^ c[6]
```

```python
for k0 in k0_values:
    k6 = k0 ^^ DELTA6
    if k6 not in ALPHABET:
        continue
    k[0] = k0
    k[6] = k6
```

(Note: inside a `.sage` file, `^` is preparsed as exponentiation, so bitwise XOR must be written `^^` everywhere.) This single relation cuts the brute-force space from `26^8` down to `26^7` (~8e9) candidates for the remaining six unconstrained key bytes, since `k[6]` is derived rather than guessed:

```python
FREE_POS = [1, 2, 3, 4, 5, 7]
```

The remaining six bytes (`k[1]`, `k[2]`, `k[3]`, `k[4]`, `k[5]`, `k[7]`) are brute-forced over the lowercase alphabet in nested loops, testing each full candidate key against the published hash chain:

```python
for a in ALPHABET:
    k[1] = a
    for b in ALPHABET:
        k[2] = b
        for d in ALPHABET:
            k[3] = d
            for e in ALPHABET:
                k[4] = e
                for f in ALPHABET:
                    k[5] = f
                    for g in ALPHABET:
                        k[7] = g
                        kb = bytes(k)
                        hk = sha256(kb).digest()
                        if sha256(kb + hk).digest() == target:
                            return kb
```

Once a candidate `k` reproduces `hhk = SHA256(k || SHA256(k))`, it is (with overwhelming probability) the true key, and the plaintext follows immediately from `c XOR k`:

```python
m = bytes(a ^^ b for a, b in zip(c, k))
```

Because `26^7` candidates is still a heavy brute force (documented as hours on a single core), the solve script is designed to be sharded across multiple parallel processes, splitting the outer `k[0]` loop by shard index:

```python
my_k0 = ALPHABET[shard::nshards]
```

```bash
sage solve.sage 0 4 &
sage solve.sage 1 4 &
sage solve.sage 2 4 &
sage solve.sage 3 4 &
```

## Exploit

[solve.sage](#Solve) hardcodes the published `c` (`C_HEX`) and `hhk` (`HHK_HEX`), derives `k[6]` from the `isStandard(m,2)` relation, then brute-forces the remaining six lowercase key bytes, checking each candidate against the two-round SHA-256 chain until it matches, and finally recovers `m = c XOR k`.

Run (optionally sharded across cores):

```bash
sage solve.sage
# or, sharded:
sage solve.sage <shard> <nshards>
```

Key steps:

- `DELTA6 = c[0] ^^ c[6]` - encodes the `isStandard(m,2)` constraint (`m[0] == m[6]`) as a direct relation between `k[0]` and `k[6]`.
- `crack(k0_values, ...)` - the sharded brute-force driver; iterates candidate `k0` values, derives `k6`, then nests loops over the six remaining free bytes.
- `FREE_POS = [1, 2, 3, 4, 5, 7]` - the key positions that must actually be brute-forced, after the derived-byte optimization.
- `sha256(kb).digest()` / `sha256(kb + hk).digest() == target` - the verification oracle: matches the two-round SHA-256 chain against the published `HHK_HEX` to confirm a candidate key.
- `my_k0 = ALPHABET[shard::nshards]` - shards the outer loop by `k[0]` so multiple processes can search in parallel.

## Solve

```python=
import sys
import string
import time
from hashlib import sha256

# output
C_HEX = "56461e110e1c594a"
HHK_HEX = "10d8261dcb7761cce260142ee7e6c7427056d2750c80d252f088f1274b235bca"

c = bytes.fromhex(C_HEX)
target = bytes.fromhex(HHK_HEX)
L = len(c)  
ALPHABET = list(string.ascii_lowercase.encode())  

DELTA6 = c[0] ^^ c[6]
FREE_POS = [1, 2, 3, 4, 5, 7]


def crack(k0_values, report_every=2_000_000):
    k = bytearray(L)
    tried = 0
    t0 = time.time()
    for k0 in k0_values:
        k6 = k0 ^^ DELTA6
        if k6 not in ALPHABET:
            continue
        k[0] = k0
        k[6] = k6
        for a in ALPHABET:
            k[1] = a
            for b in ALPHABET:
                k[2] = b
                for d in ALPHABET:
                    k[3] = d
                    for e in ALPHABET:
                        k[4] = e
                        for f in ALPHABET:
                            k[5] = f
                            for g in ALPHABET:
                                k[7] = g
                                kb = bytes(k)
                                hk = sha256(kb).digest()
                                if sha256(kb + hk).digest() == target:
                                    return kb
                                tried += 1
                                if tried % report_every == 0:
                                    rate = tried / (time.time() - t0)
                                    print(f"[k0={chr(k0)}] tried={tried:,} "
                                          f"rate={rate:,.0f}/s")
    return None


if __name__ == "__main__":
    if len(sys.argv) == 3:
        shard, nshards = int(sys.argv[1]), int(sys.argv[2])
    else:
        shard, nshards = 0, 1

    my_k0 = ALPHABET[shard::nshards]
    print(f"[shard {shard}/{nshards}] searching k0 in "
          f"{bytes(my_k0).decode()}")

    k = crack(my_k0)
    if k is None:
        print("not found in this shard")
    else:
        m = bytes(a ^^ b for a, b in zip(c, k))
        print("k =", k)
        print("m =", m)

```

## Verification

```text
$ sage solve.sage 1 4
[shard 1/4] searching k0 in bfjnrvz
[k0=b] tried=2,000,000 rate=1,461,540/s
[k0=b] tried=4,000,000 rate=1,404,403/s
...
[k0=j] tried=862,000,000 rate=1,182,944/s
[k0=j] tried=864,000,000 rate=1,183,065/s
k = b'justakey'
m = b'<3meow<3'
```

## Flag

```text
k = 'justakey' 
m = '<3meow<3'
```

## Lessons Learned

- Any structural constraint on a plaintext (repeated bytes, printable-only characters, fixed positions) becomes a constraint on the key once combined with a known ciphertext under XOR - always propagate plaintext structure through the cipher relation before brute-forcing.
- A single derived-byte relation can cut a brute-force search space by a full alphabet factor (here `26^8 -> 26^7`); look for these before reaching for raw brute force.
- A one-way hash chain (`H(k || H(k))`) published as "proof of key" gives no algebraic shortcut, but it is still just a verification oracle for a brute force over a small keyspace - don't mistake "can't invert the hash" for "can't recover the key."
- Small, structured keyspaces (e.g. `/[a-z]{8}/`) are brute-forceable even through SHA-256 once the space is small enough (tens of billions), especially when the work embarrassingly parallelizes by sharding one loop variable across processes/cores.
- In Sage, `^` is preparsed as exponentiation, not XOR - always use `^^` for bitwise XOR to avoid silently wrong results.

# RSA Backdoor Writeup

## Summary

This is an offline crypto challenge: `chal.py` prints a public modulus `n` and a ciphertext `ct` to `out.txt`, and there is no remote service to connect to. The core mechanic is that the second RSA prime `q` is derived from the first prime `p` by reinterpreting `p`'s decimal digit string in base 13, which makes `n = p * q` a strictly increasing, invertible function of `p` alone.

Flag:

```text
HCMUS-CTF{7h3_V3ry_f1r5t_4lg0r17hm_b1n4ry_534rch_w0www}
```

## Triage

`chal.py` generates the keypair with a backdoored relationship between the two primes instead of picking them independently:

```python
while True:
    p = getPrime(512)
    q = int(str(p), 13)
    if isPrime(q):
        n = p * q
        print('Public key n = ', n)
        break

print(f'ct = ', pow(bytes_to_long(FLAG), e, n))
```

`q = int(str(p), 13)` takes the base-10 digit string of `p` and reparses it as a base-13 integer - `q` is not an independently random 512-bit prime, it is a deterministic function of `p`'s digits. `e` is the standard `65537`.

`out.txt` contains only the public data:

```text
Public key n =  14072966033419198049110692513729221272039856578995770358978022374369702617407260974250371335874660886448635625415359435590866288684836396305467427652785918508438890316051644975416024575729239957690880362943383614229572482338338943926669325548496781092116918121854511282239218429506385724821682014631388855624828613598194700383
ct =  3297398274726419288742770485398984653524926733739942261260073512658711638212442235723491698663926587152143223728930627197111676440456437693388833394409296854208768556197435034647579096634751361373063515305871138820266505736702532043492078019209492809727200146481667680937461262102664960833393192739550652924626548337227957210
```

`n` is only a single ~1023-bit integer - no second modulus, no leaked bits, nothing else to work with - so the whole break has to come from the `q = f(p)` relationship baked into `n`'s construction.

## Solve Path

The key observation is that `f(p) = int(str(p), 13)` preserves numeric ordering: decimal digit-string order is the same as numeric order, and reinterpreting the same digit string in a larger base (13 > 10, and each digit stays `< 10`) keeps that order. So `g(p) = p * f(p) = n` is also strictly increasing in `p`, turning "factor `n`" into "invert a monotonic function of a single ~512-bit unknown" - solvable by binary search instead of any lattice/Coppersmith machinery:

```python
def q_from_p(p):
    return Integer(str(p), 13)

lo = Integer(2) ** 511
hi = Integer(2) ** 512 - 1

while lo < hi:
    mid = (lo + hi) // 2
    val = mid * q_from_p(mid)
    if val < n:
        lo = mid + 1
    else:
        hi = mid

p = lo
q = q_from_p(p)
assert p * q == n
assert is_prime(p) and is_prime(q)
```

Each iteration evaluates `g(mid) = mid * q_from_p(mid)` and compares it against `n`, halving the search interval `[2^511, 2^512)` every step until `p` is pinned down exactly. Once `p` is known, `q` follows immediately from the same digit-reinterpretation formula the challenge used, and the assertions confirm `p * q == n` with both factors prime.

With `p` and `q` recovered, this is now a normal RSA private-key derivation:

```python
phi = (p - 1) * (q - 1)
d = inverse_mod(e, phi)
pt = power_mod(Integer(ct), Integer(d), Integer(n))
```

## Exploit

The solve script is [solve.sage](#Solve). It hardcodes `n`, `ct`, and `e` from `out.txt`, binary-searches for `p` using the monotonicity of `g(p) = p * q_from_p(p)`, derives `q` from `p`, computes `phi`, inverts `e` to get `d`, and decrypts `ct` directly.

Run:

```bash
sage solve.sage
```

Key steps:

- `q_from_p(p)`: reinterprets `p`'s decimal digits in base 13, mirroring the challenge's backdoor construction.
- binary search over `[2^511, 2^512 - 1]`: exploits monotonicity of `p * q_from_p(p)` to recover the exact `p` from `n` alone.
- `inverse_mod(e, phi)` + `power_mod`: standard RSA decryption once `p`, `q` are known.

## Sovle

```python=
# from out.txt
n = 14072966033419198049110692513729221272039856578995770358978022374369702617407260974250371335874660886448635625415359435590866288684836396305467427652785918508438890316051644975416024575729239957690880362943383614229572482338338943926669325548496781092116918121854511282239218429506385724821682014631388855624828613598194700383
ct = 3297398274726419288742770485398984653524926733739942261260073512658711638212442235723491698663926587152143223728930627197111676440456437693388833394409296854208768556197435034647579096634751361373063515305871138820266505736702532043492078019209492809727200146481667680937461262102664960833393192739550652924626548337227957210
e = 65537


def q_from_p(p):
    return Integer(str(p), 13)


# p = getPrime(512) -> p in [2^511, 2^512)
lo = Integer(2) ** 511
hi = Integer(2) ** 512 - 1

while lo < hi:
    mid = (lo + hi) // 2
    val = mid * q_from_p(mid)
    if val < n:
        lo = mid + 1
    else:
        hi = mid

p = lo
q = q_from_p(p)
assert p * q == n
assert is_prime(p) and is_prime(q)

phi = (p - 1) * (q - 1)
d = inverse_mod(e, phi)
pt = power_mod(Integer(ct), Integer(d), Integer(n))

flag = int(pt).to_bytes((int(pt).bit_length() + 7) // 8, "big")
print(flag)
```

## Verification

```text
b'HCMUS-CTF{7h3_V3ry_f1r5t_4lg0r17hm_b1n4ry_534rch_w0www}'
```

## Flag

```text
HCMUS-CTF{7h3_V3ry_f1r5t_4lg0r17hm_b1n4ry_534rch_w0www}
```

## Lessons Learned

- A prime-generation backdoor that makes one prime a deterministic function of the other collapses key generation from "factor a hard semiprime" to "invert a known function of one ~n/2-bit unknown."
- Monotonicity is a factoring oracle: if `n = g(p)` is strictly increasing in the single unknown `p`, binary search recovers `p` in `O(bits)` steps with no number-theoretic machinery at all.
- Digit-string reinterpretation across bases (e.g. base-10 digits read as base-`k`) preserves order whenever every digit stays below the smaller base - a property worth checking whenever a challenge derives one value from another's textual representation.
- Always inspect exactly how each RSA parameter is generated, not just its bit length - an innocuous-looking one-liner in keygen can be the entire vulnerability.

# TheChosenOne Writeup

## Summary

Interactive AES-256-ECB crypto challenge, reached with `nc`. The service (`server.py`) reads a line of attacker-controlled plaintext, appends the fixed 32-byte secret flag *after* it, encrypts the whole thing under AES-ECB with a fixed key, and prints the hex ciphertext. Because ECB encrypts identical 16-byte blocks identically and the attacker controls the prefix length, the flag falls to a textbook byte-at-a-time chosen-plaintext attack.

Flag:

```text
HCMUS-CTF{You_Can_4ttack_A3S!?!}
```

## Triage

`server.py` builds every ciphertext as `AES-256-ECB(user_input + flag, padded)`, with attacker input placed *before* the secret:

```python
flag = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" # TODO
key = "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX" # TODO

padding_character = "D"

assert (len(flag) == 32) and (len(key) == 32)
cipher = AES.new(key, AES.MODE_ECB)
```

```python
plaintext = user_input + flag
padding_length = padding(plaintext)
plaintext = plaintext.ljust(padding_length, padding_character)

sys.stdout.write('The ciphertext:\n{}\n\n'.format((cipher.encrypt(plaintext)).encode('hex')))
```

The custom padding rounds the total length up to the next multiple of **32** (not AES's 16-byte block) with filler `"D"`, and does nothing if the length is already a multiple of 32:

```python
def padding(plaintext):
    plaintext_length = len(plaintext)
    padding_length = 0
    if plaintext_length % 32 != 0:
        padding_length = (plaintext_length // 32 + 1) * 32
    else:
        padding_length = 0
    return padding_length
```

`key` and `flag` are placeholders in this source copy (`# TODO`), filled in at deployment. The `.encode('hex')` call is Python 2. The vulnerability is simply `AES.MODE_ECB` over `user_input + flag`: ECB processes each 16-byte block independently and deterministically, so identical plaintext blocks yield identical ciphertext blocks. The 32-byte padding granularity is irrelevant - the cipher still works in 16-byte blocks internally, so it only ever adds trailing filler beyond the flag.

## Solve Path

Since `plaintext = user_input + flag`, the attacker controls exactly how many bytes precede the unknown flag. Sizing the prefix so that the next unknown flag byte lands as the **last** byte of a 16-byte block turns recovery into a per-byte dictionary lookup:

1. **Align + record.** For flag byte `i`, send a prefix of `A`s of length `15 - (i mod 16)`. This pushes flag byte `i` to the final position of block `i // 16`. Record that ciphertext block as the target.

   ```python
   pad_len = BLOCK - 1 - (i % BLOCK)
   prefix = b"A" * pad_len
   block_idx = i // BLOCK
   sl = slice(block_idx * BLOCK, (block_idx + 1) * BLOCK)
   target_block = oracle(io, prefix)[sl]
   ```

2. **Brute-force one byte.** For each candidate byte `c`, query the oracle with `prefix + recovered + c`. This crafted input has the same block `i // 16` content as the target, except its last byte is our guess. When the block matches, `c` is the true flag byte.

   ```python
   for c in CHARSET:
       guess = prefix + recovered + bytes([c])
       if oracle(io, guess)[sl] == target_block:
           found = c
           break
   ```

3. **Repeat.** Append each recovered byte and continue for all 32 flag bytes. As `i` crosses 16, `block_idx` advances to the second block; the same alignment math keeps working because the recovered bytes fill the earlier positions.

Two practical details:

- **No random prefix.** The attacker input sits at offset 0 with nothing prepended, so alignment is exact and the standard attack applies directly.
- **Charset / newline.** Guesses are restricted to printable ASCII (`0x20`–`0x7e`). Beyond matching typical flag content, this avoids sending `0x0a`, which the server's `readline()` would treat as end-of-input and truncate the payload.

## Exploit

The standalone solver is [solve.sage](#Solve). It connects to the oracle and runs the byte-at-a-time recovery end to end, printing the flag as it grows. Key pieces:

- `oracle(io, data)` - sends one line of plaintext, reads back the response, and returns the raw ciphertext bytes (`bytes.fromhex` of the hex line). Note it consumes the `The ciphertext:\r\n` marker (CRLF over the socket).
- `main()` - loops over the 32 flag positions, doing the align/record (step 1) then the 256-way block-match brute force (step 2), accumulating `recovered`.
- Constants: `BLOCK = 16`, `FLAG_LEN = 32`, `CHARSET = range(0x20, 0x7f)`.

Set `HOST`/`PORT` at the top and run:

```bash
sage solve.sage
```

## Solve

```python
from pwn import *

# context.log_level = "debug"

HOST = ???
PORT = ???

BLOCK = 16
FLAG_LEN = 32
CHARSET = range(0x20, 0x7f)


def oracle(io, data: bytes) -> bytes:
    io.recvuntil(b"Your input: ")
    io.sendline(data)
    io.recvuntil(b"The ciphertext:\r\n")
    return bytes.fromhex(io.recvline().strip().decode())


def main():
    io = remote(HOST, PORT)

    recovered = b""
    for i in range(FLAG_LEN):
        pad_len = BLOCK - 1 - (i % BLOCK)
        prefix = b"A" * pad_len
        block_idx = i // BLOCK
        sl = slice(block_idx * BLOCK, (block_idx + 1) * BLOCK)

        target_block = oracle(io, prefix)[sl]

        found = None
        for c in CHARSET:
            guess = prefix + recovered + bytes([c])
            if oracle(io, guess)[sl] == target_block:
                found = c
                break

        if found is None:
            log.failure(f"no match at byte {i}; recovered so far: {recovered!r}")
            break

        recovered += bytes([found])
        log.info(f"[{i+1:2}/{FLAG_LEN}] {recovered.decode(errors='replace')}")

    io.close()
    log.success(f"FLAG: {recovered.decode(errors='replace')}")


if __name__ == "__main__":
    main()
```

## Verification

Running `sage solve.sage` against the live service recovers the flag one byte per line and prints the final result (flag redacted here per this repo's convention):

```text
$ sage solve.sage
[+] Opening connection to vm.daotao.antoanso.org on port 32779: Done
[*] [ 1/32] H
[*] [ 2/32] HC
[*] [ 3/32] HCM
...
[*] [32/32] HCMUS-CTF{You_Can_4ttack_A3S!?!}
[+] FLAG: HCMUS-CTF{You_Can_4ttack_A3S!?!}
```

## Flag

```text
HCMUS-CTF{You_Can_4ttack_A3S!?!}
```

## Lessons Learned

- ECB mode maps identical plaintext blocks to identical ciphertext blocks - any oracle that concatenates attacker data with a secret under ECB leaks the secret one byte at a time when the prefix length is controllable.
- Placing the secret *after* attacker-controlled input is the enabling condition: it lets the attacker always align the next unknown byte to a block boundary.
- Non-standard padding granularity (32 bytes here vs AES's native 16) does not defend anything - reason in units of the true 16-byte block and ignore the trailing filler.
- Watch the transport: guesses that include the line terminator (`0x0a`) get truncated by a `readline()` oracle, and responses may use CRLF (`\r\n`) over a socket even when the source writes `\n`.

# Polynomial AES Writeup

## Summary

Offline crypto challenge: `encrypt.py` runs locally and drops a single `output.txt` containing a 1024-bit prime `p`, a list of polynomial coefficients `q`, and an AES-ECB-encrypted flag - no network service involved. The AES key is derived from a sum-over-all-residues of a random polynomial mod `p`, and that sum degenerates via a power-sum identity to just `-q[0] mod p`, so only the first coefficient of `q` (which is printed in the clear) actually matters.

Flag:

```text
HCMUS-CTF{13arN-4lg38ra}
```

## Triage

`encrypt.py`'s `generate_key()` builds a degree-`d` polynomial (`d` random in `[20,30]`) over `F_p` with a 1024-bit prime `p`, coefficients `q[0..d]` each ~100 bits:

```python
def generate_key() -> bytes:
    d = getRandomRange(20, 30)
    p = getPrime(1024)
    q = []
    for _ in range(d + 1):
        q.append(getRandomInteger(100))

    def eval(x: int) -> int:
        ans = 0
        mul = 1
        for i in range(d + 1):
            ans = (ans + mul * q[i]) % p
            mul = (mul * x) % p
        return ans

    print(f"p = {p}")
    print(f"q = {q}")

    H = range(1, p)
    s = 0
    for h in H:
        s = (s + eval(h)) % p

    key = sha256(str(s).encode())
    return key
```

The suspicious part: `s` is the sum of the polynomial evaluated at *every* nonzero residue mod `p`, i.e. `s = sum_{h=1}^{p-1} eval(h) mod p`. That's a full sum over the multiplicative group, not a small sample - a classic setup for a power-sum identity to collapse it. `p` and the full coefficient list `q` (25+ entries, one of them oddly larger than 100 bits) are printed to `output.txt` in the clear, along with the ciphertext:

```
p   =   150798630896819594182651789541554972925701250717...
q   =   [72961712988575923480069485887, 51777043986742372200545207145..., ...]
Encrypted flag: 864b4997518f22d8f1f51325e805f0ef51f70e9b10be01dd2c3154d9d5a44321
```

(`output.txt` is UTF-16 encoded - reading it as plain text/bytes shows every character interleaved with null bytes.)

## Solve Path

Expand the sum by linearity: `s = sum_i q[i] * (sum_{h=1}^{p-1} h^i mod p)`. Each inner power sum `sum_{h=1}^{p-1} h^i mod p` follows a standard identity - it's `-1 mod p` when `(p-1) | i`, and `0 mod p` otherwise. Since `0 <= i <= d <= 30` and `p-1` is a ~1024-bit number, `(p-1)` divides `i` only when `i == 0`. Every term but the constant coefficient vanishes:

```python
# s == -q[0] (mod p)
```

So the entire polynomial - degree, the other ~24 coefficients, the oversized outlier at index 20 - is noise. Only `q[0]` and `p` determine the AES key. `solve.sage` parses those two values plus the ciphertext straight out of `output.txt`:

```python
with open("output.txt", encoding="utf-16") as f:
    data = f.read()

p = int(re.search(r"p\s*=\s*(\d+)", data).group(1))
q0 = int(re.search(r"q\s*=\s*\[\s*(\d+)", data).group(1))
ct = bytes.fromhex(re.search(r"Encrypted flag:\s*([0-9a-fA-F]+)", data).group(1))
```

then reconstructs `s` and the key directly:

```python
s = (-q0) % p

key = sha256(str(s).encode())

cipher = AES.new(key, AES.MODE_ECB)
pt = unpad(cipher.decrypt(ct), AES.block_size)
print(pt)
```

No brute force, no factoring - the entire key derivation reduces to one modular negation once the power-sum identity is applied.

## Exploit

[solve.sage](#Solve) (folder name contains a space, hence the `%20`) parses `p`, `q[0]`, and the ciphertext out of `output.txt` (UTF-16 encoded), computes `s = -q[0] mod p`, derives `key = SHA256(str(s))`, and AES-ECB decrypts + unpads the flag. Run with:

```
sage solve.sage
```

Key steps in the script:
- Regex extraction of `p`, the first element of `q`, and the hex ciphertext from `output.txt`
- `s = (-q0) % p` - the collapsed power-sum result
- `sha256(str(s).encode())` - reproduces `generate_key()`'s SHA256-of-decimal-string key derivation
- `AES.new(key, AES.MODE_ECB).decrypt(ct)` + `unpad(...)` - recovers the flag bytes

## Solve
```python=
import re
from Crypto.Cipher import AES
from Crypto.Util.Padding import unpad
from Crypto.Hash import SHA256

with open("output.txt", encoding="utf-16") as f:
    data = f.read()

p = int(re.search(r"p\s*=\s*(\d+)", data).group(1))
q0 = int(re.search(r"q\s*=\s*\[\s*(\d+)", data).group(1))
ct = bytes.fromhex(re.search(r"Encrypted flag:\s*([0-9a-fA-F]+)", data).group(1))

s = (-q0) % p


def sha256(b):
    h = SHA256.new()
    h.update(b)
    return h.digest()


key = sha256(str(s).encode())

cipher = AES.new(key, AES.MODE_ECB)
pt = unpad(cipher.decrypt(ct), AES.block_size)
print(pt)
```

## Verification

```text
b'HCMUS-CTF{13arN-4lg38ra}'
```

## Flag

```text
HCMUS-CTF{13arN-4lg38ra}
```

## Lessons Learned

- A sum of a polynomial over *all* residues of a field is a red flag: power-sum identities (`sum_{h} h^i ≡ -1` iff `(p-1)|i`, else `0`) collapse it to just the constant term, no matter how many higher-degree coefficients are thrown in as noise.
- Bulk/oversized coefficients or degrees in a printed parameter set can be deliberate misdirection - check which values are mathematically load-bearing before assuming complexity implies security.
- Deriving a symmetric key from a low-entropy or fully-determined intermediate value (here, one 100-bit `q[0]` mod a known 1024-bit `p`) makes brute-forcing/guessing or, as here, direct algebraic recovery trivial regardless of the KDF (SHA256) used downstream.
- Always check file encoding before parsing challenge output - a UTF-16 file misread as UTF-8/binary will look corrupted even though the data is intact.

# RSB Writeup

## Summary

The server exposes an RSA menu with encrypt, decrypt, and "get encrypted flag" options, where decryption is done "faster" via CRT. The core vulnerability is a copy-paste bug in the CRT-decrypt implementation: the mod-`q` half of the computation is corrupted, which is exactly the fault-injection precondition of the classic Boneh-DeMillo-Lipton CRT-RSA attack - a single decrypt query on a chosen ciphertext factors the modulus.

Flag:

```text
HCMUS-CTF{fault-attack}
```

## Triage

`rsb.py` sets up a standard RSA keypair and offers a menu (`encrypt`, `decrypt`, `get encrypted flag`), but its CRT-based decrypt has a copy-paste bug in the `m_q` accumulation loop:

```python
def decrypt(c: int) -> int:
    # Compute c^d mod p
    m_p = 1
    a = c
    k = d
    while k > 0:
        if k % 2 == 1:
            m_p = m_p * a % p
        a = a * a % p
        k = k // 2

    # Compute c^d mod q
    m_q = 1
    a = c
    k = d
    while k > 0:
        if k % 2 == 1:
            m_q = m_p * a % q     # <-- BUG: should be m_q * a % q
        a = a * a % q
        k = k // 2

    return crt([m_p, m_q], [p, q])
```

`m_q = m_p * a % q` reuses `m_p` (the mod-`p` accumulator) instead of `m_q` on every squaring step, so the returned CRT-combined value `M` satisfies `M ≡ c^d (mod p)` correctly, but `M mod q` is garbage that doesn't actually depend on a valid computation of `c^d mod q`. The `encrypt` function itself is a correct square-and-multiply mod `N`, and the menu also exposes a "get encrypted flag" option that runs the flag through the (correct) `encrypt`, not the buggy `decrypt`, so the real flag ciphertext is trustworthy once `N` and `d` are recovered.

## Solve Path

Because the buggy `decrypt` only decrypts correctly modulo `p`, feeding it any chosen ciphertext `c` and calling the result `M` gives:

```text
M ≡ c^d ≡ c (mod p)      (since ed ≡ 1 mod phi, correct mod-p leg)
M ≡ <garbage>  (mod q)    (wrong leg, doesn't depend on real c^d mod q)
```

so `M^e - c ≡ 0 (mod p)` but generically `M^e - c ≢ 0 (mod q)`. That means `gcd(M^e - c mod N, N)` yields `p` (or a nontrivial factor) directly - the textbook Boneh-DeMillo-Lipton CRT-RSA fault attack, except here the "fault" is a permanent code bug rather than an induced hardware glitch, so it fires on every query.

The solve script drives the menu, requesting decryption of small chosen ciphertexts until the gcd is nontrivial:

```python
p = None
for c in [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]:
    goto_menu(io)
    io.sendline(b"3")                  # Decrypt
    io.recvuntil(b"Ciphertext:")
    io.sendline(str(c).encode())
    io.recvuntil(b"Plaintext:")
    m = int(io.recvline())

    diff = (pow(m, e, N) - c) % N
    g = gcd(diff, N)
    if 1 < g < N:
        p = g
        print(f"factored N with c={c}: p =", p)
        break
```

Once `p` is recovered, the rest is standard RSA key reconstruction:

```python
q = N // p
phi = (p - 1) * (q - 1)
d = inverse_mod(e, phi)
```

The script then requests the *real* encrypted flag through the correct encrypt path (menu option 1, "Get encrypted flag") rather than ever passing it through the buggy `decrypt`, and finishes the decryption itself with the recovered `d`:

```python
goto_menu(io)
io.sendline(b"1")                      # Get encrypted flag
c_flag = int(io.recvline())

m_flag = power_mod(Integer(c_flag), Integer(d), Integer(N))
flag = int(m_flag).to_bytes((int(m_flag).bit_length() + 7) // 8, "big")
```

## Exploit

The solve script is [solve.sage](#Solve). It connects to the remote, parses `N` from the banner, loops over small chosen plaintexts `c ∈ {2,3,5,7,...}` requesting the buggy decrypt on each, tests `gcd(pow(m,e,N) - c, N)` for a nontrivial factor to recover `p`, derives `q`, `phi`, and `d`, then fetches the correctly-encrypted flag and decrypts it locally.

Run:

```bash
sage solve.sage
```

Key steps:

- `goto_menu`: syncs the I/O stream back to the menu prompt between requests, tolerant of `\r\n` line-ending quirks.
- decrypt-oracle loop over `c ∈ {2,3,5,...,29}`: exploits the CRT fault to leak `p` via `gcd(pow(m,e,N) - c, N)`.
- `q = N // p`, `phi`, `inverse_mod(e, phi)`: standard RSA private-key reconstruction once one factor is known.
- final decrypt of `c_flag` obtained from the *correct* encrypt path, never routed through the buggy decrypt.

## Verification

```bash
[+] Opening connection to vm.daotao.antoanso.org on port 32782: Done
[DEBUG] Received 0x194 bytes:
    b'Public key: 175892894619439237483623969548585379816783903857441536821865000648391559389629720262561073903671301335589415642868018538540661695255739791656365601739182085942203909654727019316141164866681594438728186250967850956242270698307289180438956031789663190960308289740336394169600292783785864607037975177211917126123\r\n'
    b'Choose an option:\r\n'
    b'     1. Get encrypted flag\r\n'
    b'     2. Encrypt\r\n'
    b'     3. Decrypt\r\n'
N = 175892894619439237483623969548585379816783903857441536821865000648391559389629720262561073903671301335589415642868018538540661695255739791656365601739182085942203909654727019316141164866681594438728186250967850956242270698307289180438956031789663190960308289740336394169600292783785864607037975177211917126123
[DEBUG] Sent 0x2 bytes:
    b'3\n'
[DEBUG] Received 0xe bytes:
    b'Ciphertext: \r\n'
[DEBUG] Sent 0x2 bytes:
    b'2\n'
[DEBUG] Received 0x193 bytes:
    b'Plaintext: 136958391786123523108795114947448622468093772333029130605449922015798565249444147940532813264338068132164099875474204633019087630362999414492063400962464679504959859047123985428500259605246582850614711494830195177173568492477962254291025276984019468250727350584386184195293822497134621846433816123626753130536\r\n'
    b'Choose an option:\r\n'
    b'     1. Get encrypted flag\r\n'
    b'     2. Encrypt\r\n'
    b'     3. Decrypt\r\n'
factored N with c=2: p = 13330786134763976488385425598920256837848284907187205010576544306986866630178529566749425277881264627581637913587451502476768143936119595733229260880537637
[DEBUG] Sent 0x2 bytes:
    b'1\n'
[DEBUG] Received 0x137 bytes:
    b'111157208362982657871053516689356618071489008210392431946734949190917953266771517935894360691674038478650159024524649517583164444588621621453367164583441447707563957285181400128556892163803465556291801438878815712539176795295794443087507865924830680937530458968763508972528327497590821771221010984730795258657\r\n'
c_flag = 111157208362982657871053516689356618071489008210392431946734949190917953266771517935894360691674038478650159024524649517583164444588621621453367164583441447707563957285181400128556892163803465556291801438878815712539176795295794443087507865924830680937530458968763508972528327497590821771221010984730795258657
flag = b'HCMUS-CTF{fault-attack}'
[*] Closed connection to vm.daotao.antoanso.org port 32782
```

## Flag

```text
HCMUS-CTF{fault-attack}
```

## Lessons Learned

- CRT-based RSA decryption (`c^d mod p` and `c^d mod q` combined via CRT) is only as safe as both legs being computed correctly and independently - a bug or fault that corrupts just one leg turns any decrypt query into a factorization oracle.
- The Boneh-DeMillo-Lipton fault attack pattern - `gcd(M^e - c mod N, N)` - applies whenever a decryption is correct modulo one prime factor and wrong modulo the other, whether the cause is an induced hardware fault or, as here, an ordinary software bug.
- A single successful query is enough; retry with a handful of small distinct chosen ciphertexts in case any individual attempt yields a trivial gcd.
- When a service offers both a trustworthy encrypt path and a buggy decrypt path, prefer reconstructing the private key and decrypting client-side over routing sensitive data (like the real flag ciphertext) through the buggy oracle.
- Always test cryptographic "optimizations" (like a CRT speedup) against their reference implementation - silent copy-paste bugs in performance code are a common source of exploitable asymmetric faults.

# Common Modulus Writeup

## Summary

This is an offline crypto challenge: `problem.py` is a standalone generator that writes `output.txt` (`n`, the list of primes `l`, and the ciphertext list `C`) with no server or socket involved - everything needed to solve it is in the provided files. The flag is RSA-encrypted eight times under a single modulus `n` with eight different exponents built from the same set of coprime primes, so the exponents have `gcd == 1` and the flag can be recovered directly via a generalized extended-Euclidean (Bezout) combination, with no factoring of `n` required.

Flag:

```text
HCMUS-CTF{3xtended_Euclidean_A1g0rithm}
```

## Triage

`problem.py` builds a 4096-bit RSA modulus from two independent 2048-bit primes, then picks 8 random 32-bit primes `l[0..7]`:

```python
k = 8
n = getPrime(2048)*getPrime(2048)
print(f"n = {n}")

l = [getPrime(32) for i in range(k)]
print(f"l = {l}")

C = []
for i in range(k):
    li = l[:i] + l[i+1:]
    e = math.prod(li)
    C.append(pow(flag, e, n))
```

For each index `i`, the exponent `e_i` is the product of all `l[j]` for `j != i` (i.e. the flag is raised to the product of 7 of the 8 primes, omitting the `i`-th one), and `C[i] = flag**e_i mod n`. `output.txt` confirms the shape of the data:

```text
n = 940061047059693065742464365398262241290752444593296314948723840987...843965899157
l = [3103306147, 3734885419, 2365514209, 3527164493, 3072050083, 4131822407, 2509876661, 3783867877]
C = [33613942184753110906623350176637819858860556977699565094572811729...5488080618268, ...]
```

`n` is an unstructured 4096-bit RSA modulus (no small factors, no shared primes) - factoring is not the intended path. The weak point is the *set of exponents*: because `l` consists of 8 distinct primes, each `e_i` is missing exactly the factor `l[i]` that every other `e_j` (`j != i`) still contains. No single prime divides all 8 exponents simultaneously, so `gcd(e_0, ..., e_7) == 1`.

## Solve Path

The generator's own code is echoed to reconstruct the exponents exactly as `problem.py` computed them:

```python
k = len(l)
e = [math.prod(l[:i] + l[i + 1:]) for i in range(k)]
```

Since `gcd(e_0, ..., e_7) == 1`, Bezout's identity guarantees integers `a_0..a_7` with `sum(a_i * e_i) == 1`. These are found by chaining the extended Euclidean algorithm pairwise across all 8 exponents, accumulating the combined coefficients as each new exponent is folded in:

```python
def xgcd(a, b):
    old_r, r = a, b
    old_s, s = 1, 0
    old_t, t = 0, 1
    while r != 0:
        q = old_r // r
        old_r, r = r, old_r - q * r
        old_s, s = s, old_s - q * s
        old_t, t = t, old_t - q * t
    return old_r, old_s, old_t   # g == a*old_s + b*old_t


g = e[0]
coeffs = [1]
for i in range(1, k):
    g, x, y = xgcd(g, e[i])
    coeffs = [c * x for c in coeffs]
    coeffs.append(y)

assert g == 1, f"gcd of exponents wasn't 1: {g}"
```

With `sum(a_i * e_i) == 1` established, `flag**1 = flag**(sum a_i*e_i) = prod (flag**e_i)**a_i = prod C[i]**a_i (mod n)`. Since `C[i]` is already `flag**e_i mod n`, this recovers the flag directly by combining all 8 ciphertexts with modular exponentiation (negative `a_i` are handled transparently by Python/Sage's `pow(base, exp, mod)`, which supports negative exponents when `base` is invertible mod `n`):

```python
flag_int = 1
for ci, ai in zip(C, coeffs):
    flag_int = (flag_int * pow(ci, ai, n)) % n

flag_bytes = int(flag_int).to_bytes((int(flag_int).bit_length() + 7) // 8, "big")
print(flag_bytes)
```

No factoring of the 4096-bit `n` is ever needed - the attack works entirely modulo `n` using only the coprimality of the exponents.

## Exploit

The solve script is [solve.sage](#Solve). It reads `n`, `l`, and `C` (hardcoded from `output.txt`), reconstructs the 8 exponents `e_i` exactly as the challenge did, runs a chained extended-Euclidean reduction to find Bezout coefficients summing the exponents to 1, and combines the ciphertexts with those coefficients as modular exponents to recover the flag integer.

Run:

```bash
sage solve.sage
```

Key steps:

- `xgcd`: standard extended Euclidean algorithm, returns `(gcd, s, t)` such that `gcd == a*s + b*t`
- chained loop over `e[1:]`: folds each new exponent into the running gcd/coefficient set so the final `coeffs` list satisfies `sum(coeffs[i] * e[i]) == 1`
- final combination loop: multiplies `pow(C[i], coeffs[i], n)` across all 8 ciphertexts mod `n` to recover `flag_int`

## Verification

```text
b'HCMUS-CTF{3xtended_Euclidean_A1g0rithm}'
```

## Flag

```text
HCMUS-CTF{3xtended_Euclidean_A1g0rithm}
```

## Lessons Learned

- Reusing the same message/plaintext under multiple exponents modulo a common `n` is dangerous even without a shared modulus between two RSA keys in the classical sense - if the exponents used are collectively coprime (`gcd == 1`), the message can be recovered by a Bezout combination of the ciphertexts.
- The extended Euclidean algorithm generalizes cleanly from two values to `k` values by chaining pairwise `xgcd` calls and folding the coefficient lists together.
- `pow(base, exp, mod)` with a negative `exp` works directly in Python/Sage as long as `base` is invertible mod `mod` - no need to manually compute modular inverses when Bezout coefficients come out negative.
- Before reaching for factoring tools on a large modulus, check whether the *exponents* themselves have exploitable structure (shared factors, coprimality, small size) - many "common modulus"-style attacks never touch the modulus's factorization at all.
- Deliberately weak exponent construction (e.g. "omit one prime from the product") can silently guarantee coprimality across all instances - always compute `gcd` across leaked/derived exponents when a message is encrypted multiple times.

# DESX Writeup

## Summary

This is a remote crypto challenge - `desx.py`. The service implements an Even-Mansour-style DES construction with two fixed, never-revealed 64-bit whitening values, and leaks a fresh random DES key on every "get encrypted flag" call; the core vulnerability is DES's own key/plaintext complementation property, which lets an attacker decrypt the real flag ciphertext under the complemented key/ciphertext pair and bypass the server's "don't leak real flag bytes" guard.

Flag:

```text
HCMUS-CTF{https://en.wikipedia.org/wiki/Data_Encryption_Standard#Minor_cryptanalytic_properties}
```

## Triage

`desx.py` defines an Even-Mansour-like wrapper around single-DES-ECB using two fixed random 8-byte whitening values `i1`, `i2` generated once at startup and never printed:

```python
i1 = os.urandom(8)
i2 = os.urandom(8)

def encrypt(k: bytes, p: bytes) -> bytes:
    cipher = DES.new(k, mode=DES.MODE_ECB)
    ct = b""
    for i in range(0, len(p), 8):
        block = p[i:i+8]
        ct += xor(cipher.encrypt(xor(block, i1)), i2)
    return ct

def decrypt(k: bytes, c: bytes) -> bytes:
    cipher = DES.new(k, mode=DES.MODE_ECB)
    return xor(cipher.decrypt(xor(c, i2)), i1)
```

The menu offers two options every loop iteration:

```python
if option == 1:
    k = os.urandom(8)
    c = encrypt(k, pad(flag, DES.block_size))
    print(f"Key: {k.hex()}")
    print(f"Encrypted flag: {c.hex()}")
elif option == 2:
    ...
    p = decrypt(k, c)
    if p in flag:
        print("This one right here, officer")
        break
    print(f"Plaintext: {p.hex()}")
```

Option 1 leaks a brand-new random DES key `k` alongside the flag's ciphertext every time it's called - a fresh key each call, but always paired with its own matching ciphertext. Option 2 lets the attacker supply an arbitrary `(k, c)` pair and get back the decrypted plaintext, but explicitly refuses to answer if the decrypted plaintext is a literal substring of the real flag (`if p in flag: ... break`), which blocks the obvious move of just replaying the leaked `(k, block)` pair from option 1 into option 2.

## Solve Path

The naive attack - call option 1 to get `(k, c)` for the flag, then feed the exact same `(k, block)` pair into option 2 to invert it - is caught every time by the `p in flag` guard, since decrypting a real flag block with its own key always reproduces literal flag bytes. This flag happens to be exactly 96 bytes (12 DES blocks), so PKCS7 padding adds a full 13th block of pure `0x08` bytes; even the usual "the guard doesn't catch garbage padding in the last block" trick reveals nothing extra here, since that padding block still isn't useful on its own.

The real bug is DES's complementation property: for all keys `K` and inputs `P`, `DES_(K̄)(P̄) = DES_K(P)‾` (bar = bitwise NOT), and equivalently for decryption, `DES_(K̄)^-1(C̄) = DES_K^-1(C)‾`. Substituting into the challenge's `decrypt`:

```text
decrypt(k, c) = DES_k^-1(c XOR i2) XOR i1
```

Complementing both `k` and `c`: `c̄ XOR i2 = (c XOR i2)‾` regardless of what `i2` actually is, so:

```text
decrypt(complement(k), complement(c)) = complement(decrypt(k, c))
```

unconditionally - no dependence on `i1`, `i2`, or their relationship. So for a real flag block encrypted under key `k_j` as `C_m`, querying `decrypt(complement(k_j), complement(C_m))` returns `complement(P_m)`: the bitwise NOT of genuine printable-ASCII flag bytes. That complemented value is not a substring of the real flag, so it walks straight past the guard - for every block, not just the last one - and complementing the returned plaintext locally recovers the real block:

```python
def complement(b: bytes) -> bytes:
    return bytes(x ^^ 0xFF for x in b)

def decrypt_query(io, k: bytes, c: bytes) -> bytes:
    ...
    line = io.recvline()
    if b"officer" in line:
        raise RuntimeError(f"guard triggered for k={k.hex()} c={c.hex()}: {line}")
    p_hex = line.split(b":", 1)[1].strip()
    return bytes.fromhex(p_hex.decode())
```

```python
k_bar = complement(k)

flag_padded = b""
for m in range(n_blocks):
    block = c[m * 8:(m + 1) * 8]
    c_bar = complement(block)
    p_bar = decrypt_query(io, k_bar, c_bar)
    p = complement(p_bar)
    flag_padded += p
```

## Exploit

The solve script is [solve.sage](#Solve). It connects to the remote service, calls option 1 once to leak `(k, c)` for the padded flag, then for every 8-byte block of `c` queries option 2 with `(complement(k), complement(block))`, complements each returned plaintext locally to recover the real block, and finally strips PKCS7 padding from the reassembled plaintext.

Run:

```bash
sage solve.sage
```

Key helpers:

- `goto_menu`: consumes the menu prompt text so the next `sendline` lines up with the server's `input()` calls
- `complement`: bitwise-NOT of a byte string, used on keys, ciphertexts, and recovered plaintexts
- `decrypt_query`: drives one full option-2 interaction (send key, send ciphertext, parse plaintext or raise if the guard triggered)
- `main`: leaks `(k, c)` via option 1, loops over every block applying the complementation trick, and strips PKCS7 padding from the reassembled flag

## Solve

```python=
from pwn import *

# context.log_level = "debug"

HOST = ???
PORT = ???


def goto_menu(io):
    io.recvuntil(b"2. Decrypt")
    io.recvline()


def complement(b: bytes) -> bytes:
    return bytes(x ^^ 0xFF for x in b)


def decrypt_query(io, k: bytes, c: bytes) -> bytes:
    goto_menu(io)
    io.sendline(b"2")                      # Decrypt
    io.recvuntil(b"Key:")
    io.recvline()                          # flush rest of "Key: " prompt line
    io.sendline(k.hex().encode())
    io.recvuntil(b"Ciphertext:")
    io.recvline()                          # flush rest of "Ciphertext: " prompt line
    io.sendline(c.hex().encode())

    line = io.recvline()
    if b"officer" in line:
        raise RuntimeError(f"guard triggered for k={k.hex()} c={c.hex()}: {line}")

    p_hex = line.split(b":", 1)[1].strip()
    return bytes.fromhex(p_hex.decode())


def main():
    io = remote(HOST, PORT)

    goto_menu(io)
    io.sendline(b"1")                      # Get encrypted flag
    io.recvuntil(b"Key:")
    k_hex = io.recvline().strip()
    io.recvuntil(b"Encrypted flag:")
    c_hex = io.recvline().strip()

    k = bytes.fromhex(k_hex.decode())
    c = bytes.fromhex(c_hex.decode())
    n_blocks = len(c) // 8
    print("k =", k.hex())
    print("full ciphertext =", c.hex(), f"({len(c)} bytes, {n_blocks} block(s))")

    k_bar = complement(k)

    flag_padded = b""
    for m in range(n_blocks):
        block = c[m * 8:(m + 1) * 8]
        c_bar = complement(block)
        p_bar = decrypt_query(io, k_bar, c_bar)
        p = complement(p_bar)
        print(f"block {m}: {p!r}")
        flag_padded += p

    pad_len = flag_padded[-1]
    flag = flag_padded[:-pad_len] if 1 <= pad_len <= 8 else flag_padded
    print("flag =", flag)


if __name__ == "__main__":
    main()
```

## Verification

```text
[+] Opening connection to vm.daotao.antoanso.org on port 32784: Done
k = 6beacf329a4249c7
full ciphertext = f2231d89a750c8cabd51e743ec1835bc2c05ec5450c767b523e07630dfa1010b35f39e2703e6a8cee0d52ab1768d0f8b2e204be06565b684f1945609622ac112cf2da81e7218292783bac0ee83cd0275ad8de84e60a21fd39db3281ece59db01c13eb77443678122 (104 bytes, 13 block(s))
block 0: b'HCMUS-CT'
block 1: b'F{https:'
block 2: b'//en.wik'
block 3: b'ipedia.o'
block 4: b'rg/wiki/'
block 5: b'Data_Enc'
block 6: b'ryption_'
block 7: b'Standard'
block 8: b'#Minor_c'
block 9: b'ryptanal'
block 10: b'ytic_pro'
block 11: b'perties}'
block 12: b'\x08\x08\x08\x08\x08\x08\x08\x08'
flag = b'HCMUS-CTF{https://en.wikipedia.org/wiki/Data_Encryption_Standard#Minor_cryptanalytic_properties}'
[*] Closed connection to vm.daotao.antoanso.org port 32784
```

## Flag

```text
HCMUS-CTF{https://en.wikipedia.org/wiki/Data_Encryption_Standard#Minor_cryptanalytic_properties}
```

## Lessons Learned

- A "leak the key, but block replaying it" guard only stops the literal query you'd naively make - check whether the underlying primitive has an algebraic symmetry (like DES's complementation property) that produces a *different* query yielding equivalent information.
- DES's complementation property (`DES_K̄(P̄) = DES_K(P)‾`) holds unconditionally for every key and plaintext; any oracle built on raw DES-ECB (even wrapped in Even-Mansour-style whitening) inherits this symmetry regardless of the whitening values.
- Whitening (XOR before/after the block cipher) does not break bitwise-complement symmetries, because `X̄ XOR Y = (X XOR Y)‾` for any fixed `Y` - the complement commutes straight through XOR.
- A content-based guard (`if p in flag`) is a substring check, not a semantic one - any transformation of the guarded value that preserves recoverability but changes its literal bytes (complement, permutation, etc.) can slip past it.
- When a block cipher oracle looks locked down, test whether the cipher's own historical "minor cryptanalytic properties" apply to the exact wrapper construction in front of it before assuming the whitening/padding fully mitigates them.

# OH SEED Writeup

## Summary

Live crypto service reached with `nc` (the provided `server.py` binds a `socketserver.ThreadingMixIn` TCP server, `localhost:20202` in source). Each connection seeds Python's `random` (MT19937), draws 666 values via `random.randrange(0, 2**32-2)`, prints the first 665, and asks you to guess the 666th. Because the range is `2**32-2`, each output is one raw tempered 32-bit MT word, so the first 624 outputs fully reconstruct the internal state and every later value is predictable.

Flag:

```text
HCMUS-CTF{r4nd0m-1s-n0t-r4nd0m-333bd24f88317b190497437131ad67dc}
```

## Triage

`server.py` seeds `random` once per connection and draws 666 values from a range deliberately chosen to avoid scaling:

```python
n = 2**32-2  # 32 bits

def gen_random(self):
    random.seed(time.time() + random.randint(0, 999999) + 1312 + hash(self.flag))
    results = [random.randrange(0, n) for i in range(666)]
    return results
```

It sends the first 665 and asks for the last:

```python
l = self.gen_random()
self.send("Here is the first 665 random numbers.\n")
self.send(" ".join(map(str, l[:-1])) + "\n")

user_input = int(self.receive("Now it's your turn to guess the last random number:\n"))
if (user_input == l[-1]):
    self.send(self.flag + "\n")
```

The key observation is the range. `random.randrange(0, n)` calls `_randbelow(n)`, and for `n = 2**32 - 2` that is `k = n.bit_length() = 32`, `r = getrandbits(32)`, rejecting only `r >= 2**32-2` (the 2 values `{2**32-2, 2**32-1}`, probability `~2/2**32`). So essentially every returned number equals one `getrandbits(32)` value - a full tempered MT19937 word, with no arithmetic scaling to invert. Since the draw starts right after a fresh seed (a twist), `l[0..623] = temper(mt[0])..temper(mt[623])` of one freshly generated block, with no unknown offset into the batch.

The seed itself (time, a nested `randint`, a constant, `hash(flag)`) is irrelevant - the attack works purely from the output stream.

## Solve Path

The plan: untemper the first 624 outputs to recover `mt[0..623]`, rebuild the generator, and run it forward to output index 665.

### Untempering to recover the state

MT19937's output function applies four invertible transforms. Each is undone by iterating its XOR relation 32 times (the fixed point converges within one word width):

```python
def unshift_right(y, shift):
    x = y
    for _ in range(32):
        x = y ^^ (x >> shift)
    return x & 0xFFFFFFFF

def unshift_left(y, shift, mask):
    x = y
    for _ in range(32):
        x = y ^^ ((x << shift) & mask)
    return x & 0xFFFFFFFF

def untemper(v):
    v = unshift_right(v, 18)
    v = unshift_left(v, 15, 0xEFC60000)
    v = unshift_left(v, 7, 0x9D2C5680)
    v = unshift_right(v, 11)
    return v
```

### The Sage `^` trap (dead end that mattered)

First run hung indefinitely ("took too long to calculate"). Cause: this is a `.sage` file, and **Sage's preparser treats `^` as exponentiation, not XOR** (`^^` is bitwise XOR in Sage). Every `y ^ (x >> shift)` was silently computing `y` raised to a huge power - arbitrary-precision bignum blowup. Switching all XORs to `^^` fixed it and the untempering runs in milliseconds:

```python
def temper(y):
    y = y ^^ (y >> 11)
    y = y ^^ ((y << 7) & 0x9D2C5680)
    y = y ^^ ((y << 15) & 0xEFC60000)
    y = y ^^ (y >> 18)
    return y & 0xFFFFFFFF

def twist(mt):
    for i in range(624):
        y = (mt[i] & 0x80000000) | (mt[(i + 1) % 624] & 0x7FFFFFFF)
        mt[i] = mt[(i + 397) % 624] ^^ (y >> 1)
        if y & 1:
            mt[i] = mt[i] ^^ 0x9908B0DF
```

### Rebuilding and predicting

Load the untempered words as the state with the index at 624 so the next word triggers a fresh twist (matching the server's position after producing its first 624-word block), then step forward. A `randrange` wrapper applies the same rejection sampling for faithfulness:

```python
def predict_last(outputs):
    mt = [untemper(o) for o in outputs[:624]]
    idx = [624]

    def next_word():
        if idx[0] >= 624:
            twist(mt); idx[0] = 0
        y = mt[idx[0]]; idx[0] += 1
        return temper(y)

    def next_randrange():
        while True:
            w = next_word()
            if w < N:              # N = 2**32 - 2
                return w

    # Self-check: reproduce known outputs 624..664 before trusting the answer.
    for t in range(624, len(outputs)):
        if next_randrange() != outputs[t]:
            return None
    return next_randrange()        # index 665 = l[-1]
```

The self-check is the correctness guard: it re-predicts the 41 known outputs at indices 624–664 and only returns the 666th if all of them match, catching any word-misalignment (e.g. the astronomically unlikely `_randbelow` rejection inside the first 665 draws).

### The `recvall` freeze

A second stumble: reading the reply with `recvall(timeout=5)` hung - on this threaded server the socket doesn't reliably EOF, so `recvall` blocked waiting for close. Replacing it with a bounded `recvrepeat(3)` collects the immediate reply without waiting for EOF.

## Exploit

[solve.sage](#Solve) connects with pwntools, parses the 665 numbers, untempers the first 624 to rebuild the MT19937 state, self-checks against outputs 624–664, submits the predicted 666th value, and prints the server reply (the flag on success). A small retry loop handles the rare self-check failure by reconnecting for a fresh seed.

Set `PORT` at the top, then run:

```bash
sage solve.sage
```

Key helpers:

- `unshift_right` / `unshift_left`: invert the two MT19937 tempering shapes by 32-iteration bit fixed-point (using Sage's `^^` XOR).
- `untemper`: composes the four inverse steps in reverse tempering order to recover a raw state word.
- `temper` / `twist`: the forward MT19937 output and state-update, used to roll the recovered state forward.
- `predict_last`: rebuilds state from 624 outputs, self-checks against outputs 624–664, returns the 666th.
- `attempt` / `main`: network I/O (parse numbers, submit guess, bounded `recvrepeat` read) with a 5-try retry loop.

## Solve

```python=
from pwn import *

HOST = ???
PORT = ???

N = 2 ** 32 - 2

# context.log_level = "debug"

def unshift_right(y, shift):
    x = y
    for _ in range(32):
        x = y ^^ (x >> shift)
    return x & 0xFFFFFFFF


def unshift_left(y, shift, mask):
    x = y
    for _ in range(32):
        x = y ^^ ((x << shift) & mask)
    return x & 0xFFFFFFFF


def untemper(v):
    v = unshift_right(v, 18)
    v = unshift_left(v, 15, 0xEFC60000)
    v = unshift_left(v, 7, 0x9D2C5680)
    v = unshift_right(v, 11)
    return v


def temper(y):
    y = y ^^ (y >> 11)
    y = y ^^ ((y << 7) & 0x9D2C5680)
    y = y ^^ ((y << 15) & 0xEFC60000)
    y = y ^^ (y >> 18)
    return y & 0xFFFFFFFF


def twist(mt):
    for i in range(624):
        y = (mt[i] & 0x80000000) | (mt[(i + 1) % 624] & 0x7FFFFFFF)
        mt[i] = mt[(i + 397) % 624] ^^ (y >> 1)
        if y & 1:
            mt[i] = mt[i] ^^ 0x9908B0DF


def predict_last(outputs):
    mt = [untemper(o) for o in outputs[:624]]
    idx = [624]

    def next_word():
        if idx[0] >= 624:
            twist(mt)
            idx[0] = 0
        y = mt[idx[0]]
        idx[0] += 1
        return temper(y)

    def next_randrange():
        while True:
            w = next_word()
            if w < N:
                return w

        # (rejection sampling mirrors _randbelow; effectively never loops)

    # Self-check: reproduce the known outputs 624..664 before trusting the answer.
    for t in range(624, len(outputs)):
        if next_randrange() != outputs[t]:
            return None
    return next_randrange()  # index 665 = l[-1]


def attempt():
    io = remote(HOST, PORT)
    io.recvuntil(b"random numbers.\n")
    nums = list(map(int, io.recvline().split()))
    log.info(f"parsed {len(nums)} numbers")
    assert len(nums) == 665, f"expected 665 numbers, got {len(nums)}"

    answer = predict_last(nums)
    if answer is None:
        log.warning("verification failed (rejection/misalignment) -> retry")
        io.close()
        return None
    log.success(f"predicted last number = {answer}")

    io.sendlineafter(b"guess the last random number:\n", str(answer).encode())
    # bounded read: server replies immediately; don't wait for EOF on the
    # threaded socket (that is what made recvall hang).
    resp = io.recvrepeat(3).decode(errors="replace")
    io.close()
    return resp


def main():
    for _ in range(5):
        resp = attempt()
        if resp is None:
            continue
        log.info(resp)
        if any(m in resp for m in ("CTF", "flag", "FLAG", "HCMUS", "{")):
            log.success("FLAG FOUND")
        return


if __name__ == "__main__":
    main()

```


## Verification

```text
$ sage solve.sage
[+] Opening connection to vm.daotao.antoanso.org on port 32781: Done
[*] parsed 665 numbers
[+] predicted last number = <n>
[*] I hope you're not guessing.
    Here is your flag.
    HCMUS-CTF{r4nd0m-1s-n0t-r4nd0m-333bd24f88317b190497437131ad67dc}
```

(Connection and 665-number parse confirmed against the live service; flag redacted per this repo's convention.)

## Flag

```text
HCMUS-CTF{r4nd0m-1s-n0t-r4nd0m-333bd24f88317b190497437131ad67dc}
```

## Lessons Learned

- Python's `random` (MT19937) is not cryptographically secure: 624 consecutive raw 32-bit outputs clone the entire internal state and make every future value predictable.
- A modulus just below a power of two (`2**32-2`) is a tell that outputs are meant to map 1:1 to raw generator words - `randrange` does a single `getrandbits(32)` with negligible rejection, giving exactly the tempered words an MT-recovery attack needs.
- MT19937 tempering steps are self-inverting bit fixed-points: iterate the same XOR relation 32 times to undo each, no closed form needed.
- In a `.sage` file, `^` is exponentiation and `^^` is XOR - a wrong-operator bug here doesn't error, it silently computes giant powers and hangs. Any bit-twiddling ported into Sage must use `^^`.
- Always replay a reconstructed PRNG state against all known outputs before trusting its prediction - a partial match silently yields a wrong guess.
- Prefer a bounded read (`recvrepeat`) over `recvall` against threaded/long-lived services that may not promptly EOF.

# Hash Extension Writeup

## Summary

The server hashes `username + ":" + flag` and gives the client that digest (`H1`), then challenges the client to produce `SHA256(pad(message_1) + salt)` without ever revealing the flag. Because the server's own padding function always pads `message_1` out to exactly one 64-byte SHA-256 block, this is a textbook SHA-256 length-extension setup: the digest `H1` alone gives the internal compression-function state needed to resume hashing and append `salt` plus fresh padding, with no knowledge of the flag's content required.

Flag:

```text
HCMUS-CTF{H4sh_L3n9th_4ttatck_2add0ba87a95ef}
```

## Triage

`Server.py` builds `message_1` from an attacker-controlled username and the secret flag, hands over its digest, then demands the digest of a second message built by padding `message_1` and appending a random salt:

```python
self.flag = self.get_flag()
salt = ''.join(random.choices(string.printable, k=8))

self.send(f"Flag length: {len(self.flag)}\n")
self.send(f"Salt: {salt}\n")
username = self.receive("Tell me your name:\n").decode()
if (5 <= len(username) <= 15):
    message_1 = ''.join((username, ":", self.flag)).encode()
    self.send(f"Message 1 hexdigest: {hashlib.sha256(message_1).hexdigest()}\n")

    message_2 = self._pad_message(message_1) + salt.encode()
    user_input = self.receive("Send hexdigest of message 2.\n").decode()
    if (user_input == hashlib.sha256(message_2).hexdigest()):
        ...
        self.send(self.flag + "\n")
```

`_pad_message` is not a generic padding helper - it always emits exactly `64 - len(message)` bytes total (a fixed one-block pad), quoting SHA-256's own RFC 4634 padding scheme in a comment:

```python
def _pad_message(self, message):
    # https://www.rfc-editor.org/rfc/rfc4634#page-6
    return b''.join((message, b'\x80', b'\x00' * (55 - len(message)), struct.pack('>LL', 8*len(message) >> 32, 8*len(message) & 0xffffffff)))
```

This only produces SHA-256's *real* standard padding when `len(message) <= 55` - the server tells the client the flag length directly and lets the client pick its own username length (5-15 chars), so `len(message_1)` is fully known and controllable up front. The server also leaks `H1 = SHA256(message_1)` directly before asking for `SHA256(message_2)`, which is exactly the digest a length-extension attack needs as its starting internal state.

## Solve Path

`message_2 = message_1 || pad(message_1) || salt`, and `pad(message_1)` is SHA-256's own block-padding for `message_1`. That means `message_2` has precisely the shape SHA-256's length-extension weakness targets: `H1` already encodes the internal 8-word state after processing `message_1`'s (padded) one block, so the compression function can be resumed from that state and fed `salt` plus SHA-256's padding for the *new* total length, without ever knowing `message_1`'s actual bytes.

Choosing the minimum allowed username length (5 chars) keeps `len(message_1) = len(username) + 1 + len(flag)` as small as possible, maximizing the chance it stays `<= 55` bytes so the server's fixed one-block padding assumption holds:

```python
username = b"aaaaa"                     # minimum allowed length (5)
orig_len = len(username) + 1 + flag_len  # len("username:flag")
if orig_len > 55:
    print(f"!! message_1 length {orig_len} > 55; the server's own "
          f"padding formula breaks down here, attack won't line up.")
```

The forgery itself reimplements SHA-256 compression by hand, seeding the internal state directly from `H1`'s bytes instead of the usual fixed IV:

```python
def sha256_length_extend(orig_digest_hex, orig_len, extra):
    h = [int(x) for x in struct.unpack(">8L", bytes.fromhex(orig_digest_hex))]

    processed_len = int(orig_len) + len(sha256_pad(orig_len))  # == 64 here
    new_total_len = processed_len + len(extra)
    to_process = extra + sha256_pad(new_total_len)

    for i in range(0, len(to_process), 64):
        h = sha256_compress(h, to_process[i:i + 64])

    return "".join(f"{x:08x}" for x in h)
```

`to_process` is `salt` followed by SHA-256's padding computed for the *combined* processed length (`orig_len` padded up to 64, plus `len(salt)`) - exactly what real SHA-256 would hash as the continuation of `message_1`'s (invisible) already-processed block. Feeding that through the same round function SHA-256 itself uses (`sha256_compress`, a manual reimplementation of the standard compression function with the real round constants `K`) reproduces the digest the server expects for `message_2`, with the flag's content never needed.

## Exploit

[solve.sage](#Solve) connects to the remote service, reads the announced flag length and salt, sends a fixed 5-character username, receives `H1`, computes the forged length-extension digest locally, and sends it back to receive the flag.

Run:

```bash
sage solve.sage
```

Key steps:

- `rrot(x, n)`: 32-bit right-rotate, a SHA-256 primitive.
- `sha256_pad(message_len)`: reproduces SHA-256's standard message padding for a given already-known length.
- `sha256_compress(h, chunk)`: one full 64-round SHA-256 compression-function pass over a 64-byte block, given an 8-word state `h`.
- `sha256_length_extend(orig_digest_hex, orig_len, extra)`: the actual length-extension forgery - seeds `h` from the leaked digest bytes instead of SHA-256's IV, builds the correct continuation bytes (`extra` + fresh padding for the new total length), and re-derives the resulting digest.
- `main()`: drives the network protocol - parses flag length and salt, sends the minimum-length username, reads `H1`, calls `sha256_length_extend`, and sends the forged digest back.

## Solve
```python=
import struct
from pwn import *

context.log_level = "error"

HOST = "vm.daotao.antoanso.org"
PORT = 32786

MASK = int(0xffffffff)

K = tuple(int(x) for x in (
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
))


def rrot(x, n):
    n = int(n)
    return ((x >> n) | (x << (32 - n))) & MASK


def sha256_pad(message_len):
    message_len = int(message_len)
    ml_bits = message_len * 8
    pad_len = (56 - (message_len + 1) % 64) % 64
    return b"\x80" + b"\x00" * pad_len + struct.pack(">Q", ml_bits)


def sha256_compress(h, chunk):
    w = [int(x) for x in struct.unpack(">16L", chunk)] + [0] * 48
    for i in range(16, 64):
        s0 = rrot(w[i - 15], 7) ^^ rrot(w[i - 15], 18) ^^ (w[i - 15] >> 3)
        s1 = rrot(w[i - 2], 17) ^^ rrot(w[i - 2], 19) ^^ (w[i - 2] >> 10)
        w[i] = (w[i - 16] + s0 + w[i - 7] + s1) & MASK

    a, b, c, d, e, f, g, hh = h

    for i in range(64):
        S1 = rrot(e, 6) ^^ rrot(e, 11) ^^ rrot(e, 25)
        ch = (e & f) ^^ ((e ^^ MASK) & g)
        temp1 = (hh + S1 + ch + K[i] + w[i]) & MASK
        S0 = rrot(a, 2) ^^ rrot(a, 13) ^^ rrot(a, 22)
        maj = (a & b) ^^ (a & c) ^^ (b & c)
        temp2 = (S0 + maj) & MASK

        hh, g, f = g, f, e
        e = (d + temp1) & MASK
        d, c, b = c, b, a
        a = (temp1 + temp2) & MASK

    return [
        (h[0] + a) & MASK, (h[1] + b) & MASK, (h[2] + c) & MASK, (h[3] + d) & MASK,
        (h[4] + e) & MASK, (h[5] + f) & MASK, (h[6] + g) & MASK, (h[7] + hh) & MASK,
    ]


def sha256_length_extend(orig_digest_hex, orig_len, extra):
    h = [int(x) for x in struct.unpack(">8L", bytes.fromhex(orig_digest_hex))]

    processed_len = int(orig_len) + len(sha256_pad(orig_len))  # == 64 here
    new_total_len = processed_len + len(extra)
    to_process = extra + sha256_pad(new_total_len)

    for i in range(0, len(to_process), 64):
        h = sha256_compress(h, to_process[i:i + 64])

    return "".join(f"{x:08x}" for x in h)


def main():
    io = remote(HOST, PORT)

    io.recvuntil(b"Flag length: ")
    flag_len = int(io.recvline().strip())
    print("flag length =", flag_len)

    io.recvuntil(b"Salt: ")
    salt = io.recvn(8)
    print("salt =", salt)

    io.recvuntil(b"name:\n")

    username = b"aaaaa"                     # minimum allowed length (5)
    orig_len = len(username) + 1 + flag_len  # len("username:flag")
    if orig_len > 55:
        print(f"!! message_1 length {orig_len} > 55; the server's own "
              f"padding formula breaks down here, attack won't line up.")

    io.sendline(username)

    io.recvuntil(b"Message 1 hexdigest: ")
    h1 = io.recvline().strip().decode()
    print("H1 =", h1)

    forged = sha256_length_extend(h1, orig_len, salt)
    print("forged H2 =", forged)

    io.recvuntil(b"message 2.\n")
    io.sendline(forged.encode())

    print(io.recvall(timeout=5).decode(errors="replace"))


if __name__ == "__main__":
    main()

```

## Verification

```text
flag length = 45
salt = b'JLO</V\\%'
H1 = ab61147aa672be642fd4c4ccb7fb2279031d32e69bb7b91cc4e9acef80c370a3
forged H2 = 92ce8dec62a52594fc7abc8df99020da4eb4d5709f83db3b8514308f89b0911b
Genius! You can know the message 2 hexdigest even if you don't know the flag.
Here is your flag.
HCMUS-CTF{H4sh_L3n9th_4ttatck_2add0ba87a95ef}
```

## Flag

```text
HCMUS-CTF{H4sh_L3n9th_4ttatck_2add0ba87a95ef}
```

## Lessons Learned

- Merkle-Damgard hashes (SHA-256, SHA-1, MD5) leak their entire internal state as the digest - anyone holding `H(secret || known_suffix)` can resume hashing from that state and append attacker-chosen data, without ever knowing `secret`.
- A length-extension forgery only works when the attacker can predict (or force) the exact padding boundary - controlling or knowing every length that feeds into the padding calculation (here: username length choice + announced flag length) is what makes the attack line up.
- A "custom" padding function that happens to always emit standard hash padding for messages under a fixed size is functionally identical to the real hash's own padding, and inherits the same length-extension weakness.
- The fix for this class of bug is a construction that isn't vulnerable to state leakage extension (HMAC, or a hash with a finalization step like SHA-3), not a home-grown padding tweak.
- When a service hands you a raw digest of `secret || known_data` and then asks for the digest of `pad(that) || more_known_data`, treat it as a length-extension prompt before looking for anything more exotic.

# RecoverMe Writeup

## Summary

Crypto challenge. The 44-byte flag is split into a `PREFIX` and `POSTFIX`, each used as a 22-byte RC4 key to encrypt a fixed known prompt; a "Decrypt" oracle lets the client supply part of that key while the server silently pads the rest with the real secret half, and because the oracle echoes the *full* decryption output rather than just a yes/no match, XOR-differencing two queries at the same input length cancels the fixed ciphertext and isolates a clean RC4-keystream oracle over the unknown secret bytes.

Flag:

```text
HCMUS-CTF{FMS_4TT4ck_15_NoT_u53D_7H15_T1mE!}
```

## Triage

`challenge.py` splits the flag and encrypts a shared known prompt under each half as an RC4 key:

```python
self.n = len(FLAG) // 2
assert self.n == 22
self.PREFIX, self.POSTFIX = FLAG[:self.n], FLAG[self.n:]
self.ct1 = ARC4.new(self.PREFIX, drop = 0).encrypt(prompt)
self.ct2 = ARC4.new(self.POSTFIX, drop = 0).encrypt(prompt)
```

Each of the two rounds exposes a "Decrypt" option that builds the RC4 key from attacker input concatenated with the *real* secret half, then prints the entire decrypted output (not just whether it matches):

```python
def round(self, ct, pt, pre = '', post = ''):
    while True:
        option = self.menu()
        if option == 1:
            inp_key = input('Send my your key in hex (at most 22 bytes): ')
            inp_key = bytes.fromhex(inp_key)
            if len(inp_key) > 22:
                raise LongKey

            key = ''
            if pre:
                key = pre[:len(inp_key)] + inp_key
            elif post:
                key = inp_key + post[len(inp_key):]

            cleartext = ARC4.new(key).decrypt(ct)
            print(cleartext.hex())
```

Round 1 (`post=PREFIX`) builds `key = inp_key + PREFIX[len(inp_key):]` - attacker-controlled bytes up front, auto-filled with the true `PREFIX` suffix. Round 2 (`pre=POSTFIX`) builds `key = POSTFIX[:len(inp_key)] + inp_key` - the true `POSTFIX` prefix up front, attacker-controlled suffix. A "Check flag" option (`option == 2`) only advances the round if the exact half is submitted, so it can't be used as a byte-by-byte oracle - but "Decrypt" always runs and always prints, and it never validates that the attacker actually knows the flag half, only its length.

## Solve Path

A naive approach - try `PREFIX[:i] + candidate_byte` and see if the decrypted output equals `prompt` - needs up to 256 queries per byte (~1700 total across 44 bytes), enough to trip the service's connection time limit. The actual weakness is that the oracle leaks the *full* decryption, not just a match/no-match bit, which enables a differencing attack that needs only ~2 queries per byte.

For a fixed query length `L`, the ciphertext (`ct1` or `ct2`) is a constant, so querying two different attacker inputs `G0`, `G1` at the same `L` and XORing the outputs cancels it out entirely:

```python
def oracle(io, inp_key):
    io.sendline(b"1")
    io.sendline(inp_key.hex().encode())
    io.recvuntil(b"22 bytes): ")
    line = io.recvline().strip()
    return bytes.fromhex(line.decode())
```

```
O(G) = ct XOR KS(key(G))
O(G0) XOR O(G1) = KS(key(G0)) XOR KS(key(G1))
```

The right side depends only on the *keystream* difference between two known-attacker-input keys that share the same unknown secret bytes - a clean oracle with no dependence on the plaintext prompt at all.

### Stage 2 (POSTFIX): front-to-back recovery

Round 2's key is `POSTFIX[:L] + inp_key`, so at each length `L` the newly-added unknown byte is `POSTFIX[L-1]` (everything before it is already known from prior iterations). Brute all 256 candidates for that one byte, predict the keystream difference locally with each candidate, and match against the measured difference:

```python
def recover_postfix(io):
    postfix = b""
    for L in range(1, KEYLEN + 1):
        G0 = b"\x41" * L
        G1 = b"\x42" * L
        O0 = oracle(io, G0)
        O1 = oracle(io, G1)
        n = min(len(O0), len(O1))
        measured = xor(O0[:n], O1[:n])

        matches = []
        for c in range(256):
            cand = postfix + bytes([c])
            pred = xor(rc4_keystream(cand + G0, n), rc4_keystream(cand + G1, n))
            if pred == measured:
                matches.append(c)
        assert len(matches) == 1, f"ambiguous byte at L={L}: {matches}"
        postfix += bytes([matches[0]])
    return postfix
```

22 lengths x 2 queries recovers all of `POSTFIX` with no dependence on the 256^11 brute-force that a direct all-at-once approach (unknown suffix appears all at once at `L=11`, since `key = POSTFIX[:L]+inp_key` only reaches 22 bytes there) would require.

### Stage 1 (PREFIX): back-to-front recovery, plus a free byte

Round 1's key is `inp_key + PREFIX[L:]` - always exactly 22 bytes regardless of `L`, with the *suffix* auto-filled from the secret. Recovering back-to-front means at length `L` the new unknown is `PREFIX[L]`, with the rest of the suffix (`PREFIX[L+1:]`) already known:

```python
def recover_prefix(io):
    known = {}
    for L in range(KEYLEN - 1, 0, -1):
        known_suffix = bytes(known[k] for k in range(L + 1, KEYLEN))
        G0 = b"\x41" * L
        G1 = b"\x42" * L
        O0 = oracle(io, G0)
        O1 = oracle(io, G1)
        n = min(len(O0), len(O1))
        measured = xor(O0[:n], O1[:n])

        matches = []
        for c in range(256):
            suff = bytes([c]) + known_suffix
            pred = xor(rc4_keystream(G0 + suff, n), rc4_keystream(G1 + suff, n))
            if pred == measured:
                matches.append(c)
        assert len(matches) == 1, f"ambiguous PREFIX[{L}]: {matches}"
        known[L] = matches[0]
```

This recovers `PREFIX[1:22]` in ~2 queries per byte, `L = 21` down to `1`. `PREFIX[0]` (the flag-format byte, effectively always known already) costs no extra query at all: with the whole suffix `PREFIX[1:]` known, the `L=1` query's ciphertext relationship can be inverted directly -

```python
    n = len(o0_at_L1)
    ct1 = xor(o0_at_L1, rc4_keystream(g0_at_L1 + prefix_1_, n))
    target_ks = xor(ct1, PROMPT[:n])
    for c in range(256):
        if rc4_keystream(bytes([c]) + prefix_1_, n) == target_ks:
            prefix0 = c
            break
```

- reconstructing `ct1` from a single earlier query, then deriving the required keystream `KS(PREFIX)` from the known `prompt`, and brute-forcing `PREFIX[0]` locally against it with no server round-trip.

This differencing approach is also why a naive "count matching output bytes" probe would show nothing informative: any signal is invisible until the unknown, constant `ct1`/`ct2` term is XORed out between two same-length queries - comparing single outputs to `prompt` directly hides the structure that makes the byte-recovery tractable.

## Exploit

[solve.sage](#Solve) connects to the live service, runs the back-to-front differencing attack to recover `PREFIX` (stage 1), submits it to advance, then runs the front-to-back differencing attack to recover `POSTFIX` (stage 2), submits it, and prints the concatenated flag. Run with:

```
sage solve.sage
```

Key functions/steps:
- `rc4_keystream(key, n)` - local RC4 keystream generator used to predict oracle differences for each candidate byte
- `oracle(io, inp_key)` - sends a "Decrypt" query and returns the raw decrypted hex output
- `recover_prefix(io)` - back-to-front byte recovery of `PREFIX[1:22]` via output-XOR differencing, plus a zero-query recovery of `PREFIX[0]`
- `recover_postfix(io)` - front-to-back byte recovery of `POSTFIX[0:22]` via the same differencing technique
- `submit(io, half)` - sends a "Check flag" query to advance rounds / finish
- `main()` - orchestrates stage 1 -> submit -> stage 2 -> submit -> prints the flag

## Solve

```python=
from pwn import *

# context.log_level = "error"   # we print our own progress; queries are many

HOST = ???
PORT = ???

PROMPT = b"You could decrypt this but the flag is in the key. LoL"
KEYLEN = 22


def rc4_keystream(key, n):
    S = list(range(256))
    j = 0
    klen = len(key)
    for i in range(256):
        j = (j + S[i] + key[i % klen]) % 256
        S[i], S[j] = S[j], S[i]
    out = bytearray()
    i = j = 0
    for _ in range(n):
        i = (i + 1) % 256
        j = (j + S[i]) % 256
        S[i], S[j] = S[j], S[i]
        out.append(S[(S[i] + S[j]) % 256])
    return bytes(out)


def xor(a, b):
    return bytes(x ^^ y for x, y in zip(a, b))


def oracle(io, inp_key):
    # option 1 (Decrypt): send the menu choice + key PROACTIVELY (the server
    # reads its inputs line by line, so we don't need to first wait for the
    # "Your option:" / key prompts -- we only anchor on the key prompt to
    # know where the reply begins). recvuntil("22 bytes): ") skips past any
    # pending banner/menu text automatically.
    io.sendline(b"1")
    io.sendline(inp_key.hex().encode())
    io.recvuntil(b"22 bytes): ")
    line = io.recvline().strip()
    return bytes.fromhex(line.decode())


def submit(io, half):
    # option 2 (Check flag): send choice + flag proactively, no prompt wait.
    io.sendline(b"2")
    io.sendline(half.hex().encode())


def recover_prefix(io):
    # server round 1: key = G + PREFIX[L:]  (G = our L-byte input)
    known = {}                      # index -> PREFIX[index], for indices 1..21
    o0_at_L1 = g0_at_L1 = None
    for L in range(KEYLEN - 1, 0, -1):          # L = 21 down to 1
        known_suffix = bytes(known[k] for k in range(L + 1, KEYLEN))  # PREFIX[L+1:]
        G0 = b"\x41" * L
        G1 = b"\x42" * L
        O0 = oracle(io, G0)
        O1 = oracle(io, G1)
        n = min(len(O0), len(O1))
        measured = xor(O0[:n], O1[:n])

        matches = []
        for c in range(256):
            suff = bytes([c]) + known_suffix                     # PREFIX[L:] candidate
            pred = xor(rc4_keystream(G0 + suff, n), rc4_keystream(G1 + suff, n))
            if pred == measured:
                matches.append(c)
        assert len(matches) == 1, f"ambiguous PREFIX[{L}]: {matches}"
        known[L] = matches[0]
        if L == 1:
            o0_at_L1, g0_at_L1 = O0, G0
        print(f"[stage1] PREFIX[{L}] = {bytes([matches[0]])!r}")

    prefix_1_ = bytes(known[k] for k in range(1, KEYLEN))        # PREFIX[1:22]

    # recover PREFIX[0] locally, no extra query
    n = len(o0_at_L1)
    ct1 = xor(o0_at_L1, rc4_keystream(g0_at_L1 + prefix_1_, n))  # G0 was [0x41]*1
    target_ks = xor(ct1, PROMPT[:n])                            # KS(PREFIX) must equal this
    prefix0 = None
    for c in range(256):
        if rc4_keystream(bytes([c]) + prefix_1_, n) == target_ks:
            prefix0 = c
            break
    assert prefix0 is not None, "PREFIX[0] not found"

    prefix = bytes([prefix0]) + prefix_1_
    print(f"[stage1] full PREFIX = {prefix!r}")
    return prefix


def recover_postfix(io):
    postfix = b""
    for L in range(1, KEYLEN + 1):
        G0 = b"\x41" * L
        G1 = b"\x42" * L
        O0 = oracle(io, G0)
        O1 = oracle(io, G1)
        n = min(len(O0), len(O1))
        measured = xor(O0[:n], O1[:n])

        matches = []
        for c in range(256):
            cand = postfix + bytes([c])          # candidate POSTFIX[:L]
            pred = xor(rc4_keystream(cand + G0, n), rc4_keystream(cand + G1, n))
            if pred == measured:
                matches.append(c)
        assert len(matches) == 1, f"ambiguous byte at L={L}: {matches}"
        postfix += bytes([matches[0]])
        print(f"[stage2] POSTFIX[:{L}] = {postfix}")
    return postfix


def main():
    io = remote(HOST, PORT)

    prefix = recover_prefix(io)
    print("[*] PREFIX =", prefix)

    submit(io, prefix)                            # advance to stage 2
    try:
        io.recvuntil(b"welcome to stage 2", timeout=10)
    except EOFError:
        print("[!] server closed after prefix submit; response:",
              io.recvrepeat(2))
        return
    print("[*] stage 1 cleared")

    postfix = recover_postfix(io)
    print("[*] POSTFIX =", postfix)

    submit(io, postfix)                           # win
    tail = io.recvrepeat(3)
    print("[*] server:", tail.decode(errors="replace"))
    print("FLAG =", (prefix + postfix).decode(errors="replace"))


if __name__ == "__main__":
    main()

```

## Verification

```text
[stage1] PREFIX[21] = b'1'
[stage1] PREFIX[20] = b'_'
[stage1] PREFIX[19] = b'k'
[stage1] PREFIX[18] = b'c'
[stage1] PREFIX[17] = b'4'
[stage1] PREFIX[16] = b'T'
[stage1] PREFIX[15] = b'T'
[stage1] PREFIX[14] = b'4'
[stage1] PREFIX[13] = b'_'
[stage1] PREFIX[12] = b'S'
[stage1] PREFIX[11] = b'M'
[stage1] PREFIX[10] = b'F'
[stage1] PREFIX[9] = b'{'
[stage1] PREFIX[8] = b'F'
[stage1] PREFIX[7] = b'T'
[stage1] PREFIX[6] = b'C'
[stage1] PREFIX[5] = b'-'
[stage1] PREFIX[4] = b'S'
[stage1] PREFIX[3] = b'U'
[stage1] PREFIX[2] = b'M'
[stage1] PREFIX[1] = b'C'
[stage1] full PREFIX = b'HCMUS-CTF{FMS_4TT4ck_1'
[*] PREFIX = b'HCMUS-CTF{FMS_4TT4ck_1'
[*] stage 1 cleared
[stage2] POSTFIX[:1] = b'5'
[stage2] POSTFIX[:2] = b'5_'
[stage2] POSTFIX[:3] = b'5_N'
[stage2] POSTFIX[:4] = b'5_No'
[stage2] POSTFIX[:5] = b'5_NoT'
[stage2] POSTFIX[:6] = b'5_NoT_'
[stage2] POSTFIX[:7] = b'5_NoT_u'
[stage2] POSTFIX[:8] = b'5_NoT_u5'
[stage2] POSTFIX[:9] = b'5_NoT_u53'
[stage2] POSTFIX[:10] = b'5_NoT_u53D'
[stage2] POSTFIX[:11] = b'5_NoT_u53D_'
[stage2] POSTFIX[:12] = b'5_NoT_u53D_7'
[stage2] POSTFIX[:13] = b'5_NoT_u53D_7H'
[stage2] POSTFIX[:14] = b'5_NoT_u53D_7H1'
[stage2] POSTFIX[:15] = b'5_NoT_u53D_7H15'
[stage2] POSTFIX[:16] = b'5_NoT_u53D_7H15_'
[stage2] POSTFIX[:17] = b'5_NoT_u53D_7H15_T'
[stage2] POSTFIX[:18] = b'5_NoT_u53D_7H15_T1'
[stage2] POSTFIX[:19] = b'5_NoT_u53D_7H15_T1m'
[stage2] POSTFIX[:20] = b'5_NoT_u53D_7H15_T1mE'
[stage2] POSTFIX[:21] = b'5_NoT_u53D_7H15_T1mE!'
[stage2] POSTFIX[:22] = b'5_NoT_u53D_7H15_T1mE!}'
[*] POSTFIX = b'5_NoT_u53D_7H15_T1mE!}'
[*] server: 1. Decrypt
2. Check flag
3. Exit
Your option: Your flag to check in hex: Congratulation, you found the flag.

FLAG = HCMUS-CTF{FMS_4TT4ck_15_NoT_u53D_7H15_T1mE!}
```

## Flag

```text
HCMUS-CTF{FMS_4TT4ck_15_NoT_u53D_7H15_T1mE!}
```

## Lessons Learned

- An oracle that echoes a full decryption/output (rather than just accept/reject) leaks far more than intended - XOR two same-shaped queries to cancel any fixed unknown ciphertext term and isolate a clean function of only the attacker-controlled and target-secret inputs.
- When a server auto-completes a partial attacker-supplied key/input with a secret value, recover it incrementally one new byte at a time (whichever end grows the unknown region), turning an exponential brute force into linear queries x 256 candidates.
- Order of recovery matters: work from the position that isolates exactly one new unknown byte per query (front-to-back or back-to-front depending on which side the secret auto-fill lands on), not from a fixed starting point that reveals many unknown bytes simultaneously.
- Look for "free" recoveries: once enough secret material is known, some remaining unknowns can be derived by locally re-deriving an already-queried output instead of spending another round-trip - useful when a service enforces query/time limits.
- A stream cipher key that's reused character-for-character as message content (flag bytes as an RC4 key) means any keystream-recovery primitive against that key directly yields plaintext-equivalent secret bytes.

# Permutation Writeup

## Summary

This is a live crypto service (`solve.sage` connects with `pwn.remote(HOST, PORT)`, i.e. `nc vm.daotao.antoanso.org 32790`). Each connection prints a fresh random permutation of 512 elements and that permutation raised to the power of the flag (interpreted as an integer exponent); since the order of a permutation on 512 elements is always small (bounded by the LCM of a partition of 512, far smaller than a typical flag-sized integer), each connection only leaks the flag modulo that permutation's order - repeated connections and CRT recombination eventually pin down the exact flag.

Flag:

```text
HCMUS-CTF{discrete_log_is_easy_on_permutation_group}
```

## Triage

`permutation.py` reads the flag as a big integer, generates a random permutation of `512` elements, and computes that permutation raised to the flag's power via fast exponentiation-by-squaring on permutation composition:

```python
def get_permutation(n : int) -> List[int]:
    arr = list(range(n))
    random.shuffle(arr)
    return arr

def compose_permutation(p1 : List[int], p2 : List[int]):
    return [p1[x] for x in p2]

def permutation_power(p : List[int], n : int) -> List[int]:
    if n == 0:
        return list(range(len(p)))
    if n == 1:
        return p
    x = permutation_power(p, n // 2)
    x = compose_permutation(x, x)
    if n % 2 == 1:
        x = compose_permutation(x, p)
    return x

with open("flag.txt", "rb") as f:
    flag = int.from_bytes(f.read().strip(), byteorder='big')

perm = get_permutation(512)
print(perm)
print(permutation_power(perm, flag))
```

The output is just two printed Python lists: the random permutation, and that permutation raised to the (huge, unknown) flag-integer power. There is no modulus and no encryption in the RSA sense - the "ciphertext" is a permutation, and the exponent is the actual secret.

## Solve Path

Any permutation of a finite set has a finite multiplicative order (the LCM of its cycle lengths). For `n = 512`, that order is at most a few tens of millions - far smaller than the flag interpreted as an integer (a multi-hundred-bit value). So `perm^flag` only reveals `flag mod order(perm)`, one residue per connection. The server draws a fresh random permutation each connection but always raises it to the *same* flag, so connecting repeatedly and combining residues via CRT converges on the exact flag once the combined modulus exceeds the flag's bit length:

```python
# order(perm) for n=512 is only ~2^20-2^30, far smaller than a typical flag.
# The server reuses the same `flag` exponent but draws a fresh random perm
# every connection, so we reconnect repeatedly and CRT the residues together
# until the combined modulus is large enough to pin down the exact flag.
MAX_ATTEMPTS = 512
```

For a single session, decompose the permutation into cycles:

```python
def cycle_decomposition(perm):
    n = len(perm)
    visited = [False] * n
    cycles = []
    for i in range(n):
        if visited[i]:
            continue
        cycle = []
        j = i
        while not visited[j]:
            visited[j] = True
            cycle.append(j)
            j = perm[j]
        cycles.append(cycle)
    return cycles
```

Within a single cycle of length `L`, `perm` acts as a cyclic shift: `cycle[k+1] = perm(cycle[k])`, so `perm^e(cycle[0])` lands on `cycle[e mod L]`. Since `result = perm^flag`, locating `result[cycle[0]]` inside the cycle directly gives `flag mod L` for that cycle - and every cycle in the permutation yields an independent congruence:

```python
def session_congruence(perm, result):
    residues = []
    moduli = []
    for cycle in cycle_decomposition(perm):
        L = len(cycle)
        if L == 1:
            continue
        target = result[cycle[0]]
        residues.append(cycle.index(target))
        moduli.append(L)
    if not residues:
        return 0, 1
    return CRT_list(residues, moduli), lcm(moduli)
```

CRTing across all cycles in one session already gives `flag mod lcm(all cycle lengths in that session)` (this is `order(perm)` or a multiple of the LCMs used). Each new connection contributes an independent modulus (a different random permutation's cycle structure), so successive sessions are combined into a running CRT accumulator:

```python
cur_val, cur_mod = Integer(0), Integer(1)
for attempt in range(1, MAX_ATTEMPTS + 1):
    perm, result = get_data()
    val, mod = session_congruence(perm, result)
    cur_val = crt(cur_val, Integer(val), cur_mod, Integer(mod))
    cur_mod = lcm(cur_mod, mod)
    if looks_like_flag(cur_val):
        ...
```

The stopping condition doesn't rely on knowing the flag's exact bit length in advance - it just checks whether the currently reconstructed integer decodes to a printable-ASCII byte string:

```python
def looks_like_flag(value):
    value = int(value)
    if value == 0:
        return False
    data = value.to_bytes((value.bit_length() + 7) // 8, byteorder="big")
    return len(data) > 0 and all(32 <= b < 127 for b in data)
```

Once `cur_mod` exceeds the true flag's integer value, `cur_val` becomes exactly `flag` (CRT modular reconstruction below the modulus is exact), and it reliably looks like readable ASCII while any residual-modulus artifact wouldn't.

## Exploit

[solve.sage](#Solve) repeatedly connects to the service, extracts one CRT congruence per connection from the returned permutation's cycle structure, accumulates them with a running `crt`/`lcm`, and stops as soon as the reconstructed integer decodes to printable ASCII.

Run:

```bash
sage solve.sage
```

Key helpers:

- `get_data`: opens one connection and parses the printed `perm` and `result` lists.
- `cycle_decomposition`: splits a permutation into its disjoint cycles.
- `session_congruence`: turns one session's cycles into a single `(flag mod L, L)` congruence via CRT across cycles.
- `looks_like_flag`: decodes a candidate integer to bytes and checks for all-printable-ASCII as the stopping heuristic.
- `main`: drives the reconnect loop, accumulating congruences with `crt`/`lcm` until `looks_like_flag` succeeds or `MAX_ATTEMPTS` is exhausted.

## Solve

```python=
from pwn import *
import ast

HOST = "vm.daotao.antoanso.org"
PORT = 32792

# order(perm) for n=512 is only ~2^20-2^30, far smaller than a typical flag.
# The server reuses the same `flag` exponent but draws a fresh random perm
# every connection, so we reconnect repeatedly and CRT the residues together
# until the combined modulus is large enough to pin down the exact flag.
MAX_ATTEMPTS = 512


def get_data():
    io = remote(HOST, PORT)
    perm = ast.literal_eval(io.recvline().decode().strip())
    result = ast.literal_eval(io.recvline().decode().strip())
    io.close()
    return perm, result


def cycle_decomposition(perm):
    n = len(perm)
    visited = [False] * n
    cycles = []
    for i in range(n):
        if visited[i]:
            continue
        cycle = []
        j = i
        while not visited[j]:
            visited[j] = True
            cycle.append(j)
            j = perm[j]
        cycles.append(cycle)
    return cycles


def session_congruence(perm, result):
    # perm defines cycle[k+1] = perm(cycle[k]), so perm^e(cycle[0]) = cycle[e mod L].
    # result = perm^flag, so locating result[cycle[0]] inside the cycle gives flag mod L.
    residues = []
    moduli = []
    for cycle in cycle_decomposition(perm):
        L = len(cycle)
        if L == 1:
            continue
        target = result[cycle[0]]
        residues.append(cycle.index(target))
        moduli.append(L)

    if not residues:
        return 0, 1
    return CRT_list(residues, moduli), lcm(moduli)


def looks_like_flag(value):
    value = int(value)
    if value == 0:
        return False
    data = value.to_bytes((value.bit_length() + 7) // 8, byteorder="big")
    # bytes has no isprintable; consider printable ASCII range (32..126)
    return len(data) > 0 and all(32 <= b < 127 for b in data)


def main():
    cur_val, cur_mod = Integer(0), Integer(1)

    for attempt in range(1, MAX_ATTEMPTS + 1):
        perm, result = get_data()
        val, mod = session_congruence(perm, result)

        cur_val = crt(cur_val, Integer(val), cur_mod, Integer(mod))
        cur_mod = lcm(cur_mod, mod)
        print(f"[{attempt}] order={mod}  combined_modulus_bits={int(cur_mod).bit_length()}")

        if looks_like_flag(cur_val):
            flag_bytes = int(cur_val).to_bytes((int(cur_val).bit_length() + 7) // 8, byteorder="big")
            print("Recovered flag:", flag_bytes)
            return

    print("Did not converge after", MAX_ATTEMPTS, "attempts.")
    print("cur_val =", cur_val)
    print("cur_mod =", cur_mod)


if __name__ == "__main__":
    main()
```

## Verification

```text
[+] Opening connection to vm.daotao.antoanso.org on port 32792: Done
[*] Closed connection to vm.daotao.antoanso.org port 32792
[1] order=574266  combined_modulus_bits=20
[+] Opening connection to vm.daotao.antoanso.org on port 32792: Done
[*] Closed connection to vm.daotao.antoanso.org port 32792
[2] order=8058  combined_modulus_bits=30
[+] Opening connection to vm.daotao.antoanso.org on port 32792: Done
[*] Closed connection to vm.daotao.antoanso.org port 32792
[3] order=1256225880  combined_modulus_bits=51
[+] Opening connection to vm.daotao.antoanso.org on port 32792: Done
[*] Closed connection to vm.daotao.antoanso.org port 32792
...
[156] order=69089020  combined_modulus_bits=413
[+] Opening connection to vm.daotao.antoanso.org on port 32792: Done
[*] Closed connection to vm.daotao.antoanso.org port 32792
[157] order=4253340  combined_modulus_bits=413
[+] Opening connection to vm.daotao.antoanso.org on port 32792: Done
[*] Closed connection to vm.daotao.antoanso.org port 32792
[158] order=173160  combined_modulus_bits=413
[+] Opening connection to vm.daotao.antoanso.org on port 32792: Done
[*] Closed connection to vm.daotao.antoanso.org port 32792
[159] order=826704900  combined_modulus_bits=413
[+] Opening connection to vm.daotao.antoanso.org on port 32792: Done
[*] Closed connection to vm.daotao.antoanso.org port 32792
[160] order=8982  combined_modulus_bits=421
Recovered flag: b'HCMUS-CTF{discrete_log_is_easy_on_permutation_group}'
```

## Flag

```text
HCMUS-CTF{discrete_log_is_easy_on_permutation_group}
```

## Lessons Learned

- Using a secret as an *exponent* on a low-order algebraic structure (here, permutations of a small finite set) only leaks the secret modulo that structure's order - the secret itself may be far larger than any single leak can determine.
- A fresh random instance of the low-order structure per session is not a defense: each session is an independent modulus, and Chinese Remainder combination across many sessions reconstructs the full secret once the combined modulus exceeds it.
- Cycle decomposition turns "where does this element go under repeated application" into a simple index lookup within a cycle - a general technique for extracting a discrete-log-like residue mod cycle length without solving anything algorithmically.
- When there's no natural stopping bound (e.g. exact flag length unknown up front), a decode-and-sanity-check heuristic (printable ASCII) is a reliable, low-cost way to know when a progressively-refined CRT reconstruction has converged to the true value.
- Fast exponentiation (square-and-multiply) generalizes cleanly to any associative composition operation, including permutation composition - recognize `x^n` structure even when `x` isn't a number.

# Leek Writeup

## Summary

Local, offline crypto challenge - `leek.py` (found under `Leek/Leek/leek.py`) and `output.txt` are provided, no remote connection. This is a standard-looking RSA setup (512-bit strong primes, `e = 65537`, `d > n^0.292` explicitly asserted to rule out Boneh-Durfee) that is broken purely by algebra: a single leaked value `leek` mixes `p`, `q`, `e`, and `d` through several power terms, and substituting `q = n/p` and `d = (k(p-1)(q-1)+1)/e` (for the unknown but bounded RSA multiplier `k`, `0 <= k < e`) turns the leak into one polynomial in `p` for each of the 65537 candidate `k` values - no factoring algorithm is needed at all.

Flag:

```text
0160ca14{1_d0nt_kn0w_what_a_Gr0bner_basis_1s,_but_1_us3d_1t_anyway!!!}
```

## Triage

`leek.py` generates a textbook RSA keypair, explicitly guards against Boneh-Durfee by asserting a large private exponent, then leaks an unusual polynomial combination of `p`, `q`, `e`, and `d` instead of anything RSA-standard:

```python
p = getStrongPrime(512)
q = getStrongPrime(512)
n = p*q

e = 65537

phi = (p - 1)*(q - 1)
d = pow(e, -1, phi)

assert d > pow(n, 0.292) # chống lại Boneh-Durfee Attack (dù rằng nó hơi thừa) :D

m = bytes_to_long(flag)
c = pow(m, e, n)

leek = p*e**2 + q*d + (e**3)*(p**4) + 2005*(q**6)*(e**12) + q + p**3 + e + d**5 - 23120404*p**10 + (d**2)*(p**7) + 69*(p**13)*(q**22)
```

`output.txt` gives `n`, `e`, `c`, and `leek` in full; `n` is a normal 1024-bit RSA modulus:

```text
n = 149510653836845062754800187267571921735160737045856828989062389792661457040301436690123192316964044142864169709414977010555545460266649115436236073002980308266064009612382931653656406038037841114917289005102758794102352404766666002915687491161216393472647935623433191021643283192621714234668950784742145262161
e = 65537
c = 94948667719185156581853448604431086955412069829218238973809757818608263252610789631401212153821098644052357532311889319996587572025012754378914968425385537587964022928531215724448106564454690179802575693674692903216241335535419914874590986513726911132461721245205736386038936870712690723164969646366490958166
```

`leek`, by contrast, is a several-thousand-digit integer (dominated by the `69*p^13*q^22` term, which alone is on the order of `2^17920`), consistent with plugging 512-bit `p` and `q` into that degree-35 polynomial. The challenge even sets `sys.set_int_max_str_digits(8888)` just so the interpreter can print it. No source file for this challenge existed separately in the extracted archive at the top-level `Leek/` folder; the actual challenge source `leek.py` was found nested at `Leek/Leek/leek.py` alongside its own `output.txt`, and both were used directly here rather than being reconstructed from the solve script.

## Solve Path

Two RSA identities eliminate `q` and `d` from the leak, leaving only `p` and one bounded unknown:

```text
q = n / p
e*d - 1 = k*(p-1)*(q-1)   for some integer 0 <= k < e
=> d = (k*(p-1)*(q-1) + 1) / e
```

Substituting both into the `leek` expression and clearing denominators produces a single polynomial `F(p, k) = 0` in two unknowns - but `k` only ranges over `65537` possible small integers, so for each candidate `k` the equation collapses to a univariate polynomial in `p` alone whose integer roots can be searched directly. Sage's symbolic ring is used once to do the substitution and denominator-clearing (`.simplify_full()`), since it handles the fraction algebra cleanly:

```python
var('p k')

q_expr = n_val / p
D_expr = k * (p - 1) * (q_expr - 1) + 1
d_expr = D_expr / e_val

L_expr = (p * e_val^2
          + q_expr * d_expr
          + e_val^3 * p^4
          + 2005 * q_expr^6 * e_val^12
          + q_expr
          + p^3
          + e_val
          + d_expr^5
          - 23120404 * p^10
          + d_expr^2 * p^7
          + 69 * p^13 * q_expr^22)

F_expr = (L_expr - leek_val).simplify_full()
F_num = F_expr.numerator().expand()
```

The symbolic result is then moved into an explicit polynomial ring `QQ[k][p]` (univariate in `p`, with coefficients that are themselves polynomials in `k`), so evaluating a specific candidate `k` is just a cheap coefficient substitution rather than repeating the symbolic simplification:

```python
Rk = PolynomialRing(QQ, 'k')
Rkp = PolynomialRing(Rk, 'p')
F_poly = Rkp(F_num)
coeff_polys = F_poly.list()   # coeff_polys[i] = coefficient of p^i, as element of Rk
```

For each candidate `k`, plugging it into `coeff_polys` gives a plain univariate polynomial in `p`; any integer root that also divides `n` is the real `p`:

```python
for idx, kval in enumerate(k_range):
    coeffs = [c(kval) for c in coeff_polys]
    Fk = Rp(coeffs)
    for root, mult in Fk.roots():
        r = ZZ(root)
        if r > 1 and r < n_val and n_val % r == 0:
            found = (r, kval)
            break
```

Once `(p, k)` is found, `q`, `phi`, and `d` follow immediately, and the flag is recovered with ordinary RSA decryption:

```python
p_val, k_val = found
q_val = n_val // p_val
phi_val = (p_val - 1) * (q_val - 1)
d_val = inverse_mod(e_val, phi_val)
m = power_mod(c_val, d_val, n_val)
```

Because the search is up to `65537` iterations of a degree-~35 root-finding call over huge coefficients, the script supports sharding the `k` range across parallel processes via command-line arguments (`shard`, `nshards`), each covering a disjoint residue class of `k`.

## Exploit

[solve.sage](#Solve) builds the symbolic leak equation once, converts it to an explicit polynomial ring in `p` with coefficients in `k`, then iterates candidate `k` values (optionally sharded across parallel runs) looking for an integer root of the resulting univariate polynomial that also divides `n`; once found, it derives `q`, `d`, and decrypts `c` directly.

Run:

```bash
sage solve.sage
```

Optionally shard the `k` search across several parallel processes:

```bash
sage solve.sage 0 4 &
sage solve.sage 1 4 &
sage solve.sage 2 4 &
sage solve.sage 3 4 &
```

Key steps:

- `q_expr`, `D_expr`, `d_expr`: symbolic substitutions expressing `q` as `n/p` and `d` as `(k*(p-1)*(q-1)+1)/e`.
- `L_expr` / `F_expr` / `F_num`: the leaked polynomial rebuilt purely in terms of `p` and `k`, then simplified and cleared of denominators.
- `Rkp`, `coeff_polys`: conversion into an explicit `QQ[k][p]` ring so each candidate `k` only costs a coefficient substitution.
- the `k_range` loop with `Fk.roots()`: per-candidate univariate root search, filtered to integer roots that divide `n`.
- final block (`q_val`, `phi_val`, `d_val`, `m`): standard RSA decryption once `p` (and hence everything else) is known.

## Solve

```python=
import sys

n_val = Integer(149510653836845062754800187267571921735160737045856828989062389792661457040301436690123192316964044142864169709414977010555545460266649115436236073002980308266064009612382931653656406038037841114917289005102758794102352404766666002915687491161216393472647935623433191021643283192621714234668950784742145262161)
e_val = Integer(65537)
c_val = Integer(94948667719185156581853448604431086955412069829218238973809757818608263252610789631401212153821098644052357532311889319996587572025012754378914968425385537587964022928531215724448106564454690179802575693674692903216241335535419914874590986513726911132461721245205736386038936870712690723164969646366490958166)
leek_val = Integer(15346476162484328321446639285668265258445030866341455394824149847156952552196026087785086785518104026631996275189057994684786739048050463665611507942357207522219465269712535481190871042181084737821396733140513763838501126364064681892174168045870538073957156248461474410159590750188388819089895122030488966231808020673258580355035732664377375129216606903240387943500566611232252133623415515165277808808829315701068770272435361693366349000680748901281896940871633405685267821268818116400241267076195332248570988996069685450472644437685968699486599630718155362755046395517684187848873837276241518798376880622108545588940041766595464189173336704932616573897742218964959223313548464172878750117957810260752864747956475994830499001974045327456102661950790537349704750428145312951420360214323937308900978162650239107489107144937050522026796094252931930601659904742153148441627191538618439733072813556998973396915907921092525124291274429339446357368070220525220230319145420916812111858227634146959335166497365657985074341186076444143417483650056985345362021994860354726588259093444262347995329872632032188386817584697135923850121622657389514357806146004527508414022603936316197201486528548027521365714947792512816930812015729011577336336247917915392764413532737084206813487805927964893005464107844464880581496747999444949798958276621824738348100386790163838425774337899106499993637742871956179528736200693550890819238145182780715442146173596183144950274809195160578564022224469141898415210618187346161728252983731434902180690647797411879276668364848224732252861132566651618501207479407145893333376718886737981568308681047813281154530414215776897856532439538684761684287276397992655372387974064295461677359132390039095749809769857133999841276077553781492499106214484903198205952232901219561468113174799921046353387895007992959042729906907345814328516611271121528912873000766328704392910391466313105931390964112575965952353686443468548141827863063677382719921056617249319428760231232930349216851759864464185854234110749254340663237984996338015063888037823029499079041786549183147313118624011856764693339086482514391186500528506233840249865935526106722109295100621974685452602433298432397751389635477672045176533277394968433534966476976185039178225287769310859999305248644657583431482540185851211923278875443188253418730005631116872032016271651510792394907395913318360578308415806748945070173734997761648336954123599905175869571803456963721781643145143699485723097513095054838196039986005666256057241485819710189036477460014589395198603660251718919988347816265679174349230350455183056938545161811014311508704234013691307433679530229576074113876975623977061595298828909959047556752500617426170384391224145321858133815910598634590209596304002089982370612320282875343420663808670677392758520008394287986329744937848052313181078514971829093541164136622340390310812958944352818621784661056677478787174590680013196322324907201694158876003279038528687187436902948889217857442648585985506794519463894327583912136470246565903073007226206841827458785114279183572007923452949597223382408603253564036835056513748298712316042520508967653258136971893693063786691079190026021878506915010464084130107588898066568459884806670191333849447859197217647435620864690166351771145427769616793993219824017207385216102566736148062889395891023614327941950268035444314139021504853127717651609906817340178054942366442940898798635035525129308335202705436283163776448305268457581305330090050649427347759091642638868499730525995828522869811841776829907793253855375220032605231112743926449984263633947597776895316919349268255877614847425643769430589661814299243196405916607509591996910658717743648784404780797357708444267265456577316256737116705272190245197783864572397675693113398170137543295657369619312959276983956977235672266425575980778533756071930895089574996600836001710892717736868912539428690276094612816599521092663070261085767331648287435019594926512246199931194917559521204556020234018368199123442527484810489459055182300217365501484504715049736066138350215476501386915557897843626825698278457725821130751385252696492092829581053156160213775627296319809554666975575102836655071898572636325832216799926331247549950806013810425318999635411928873882666710220828436071436371846996348839064317424548846505724309309963015579969549844436061326795095098759382117966477237157993838604291665166070502400184363551754604445651606749902683625597029381698406917074170009901381293402995452579138642653969580802573080670120140992355267442608963191172318615992232908774737720780859971423551707837371193633057427346291236485428829430431050285115435347924732010708966107308858990870786911547487680117947804884209313378031764010911177572626185918944210670772558523152979935185143394165495018827168118679795178722036139704347958115087132698309351144692337336271480912256812287940624174064278525717284218393306251210902385698540439601918109418118779257744982833646073194076835075842517096573431009056963186179802205230302071578894633504027715176355525261197613446179803310951805578383377253111697414792228499251449532661840047702629981992983619603388893132516858312155232211643379719769331945288464002858690839504179395146359113117278687565237814194463279053926575823146401729871502799632407105860476870498369909425275690579150446450794194532054655624067908202636987829938939508330831734565323484073674713350954146396572729533020971790340790449142974)


var('p k')

q_expr = n_val / p
D_expr = k * (p - 1) * (q_expr - 1) + 1
d_expr = D_expr / e_val

L_expr = (p * e_val^2
          + q_expr * d_expr
          + e_val^3 * p^4
          + 2005 * q_expr^6 * e_val^12
          + q_expr
          + p^3
          + e_val
          + d_expr^5
          - 23120404 * p^10
          + d_expr^2 * p^7
          + 69 * p^13 * q_expr^22)

print("building and clearing the symbolic expression (this may take a bit)...")
F_expr = (L_expr - leek_val).simplify_full()
F_num = F_expr.numerator().expand()

# move to an explicit ring: QQ[k][p] (univariate in p, coefficients poly in k)
Rk = PolynomialRing(QQ, 'k')
Rkp = PolynomialRing(Rk, 'p')
F_poly = Rkp(F_num)
coeff_polys = F_poly.list()   # coeff_polys[i] = coefficient of p^i, as element of Rk
print(f"F(p,k) built: degree {len(coeff_polys)-1} in p, "
      f"degree {max(c.degree() for c in coeff_polys if c != 0)} in k")

Rp = PolynomialRing(QQ, 'x')

if len(sys.argv) == 3:
    shard, nshards = int(sys.argv[1]), int(sys.argv[2])
else:
    shard, nshards = 0, 1

found = None
k_range = range(1 + shard, int(e_val), nshards)
for idx, kval in enumerate(k_range):
    coeffs = [c(kval) for c in coeff_polys]
    Fk = Rp(coeffs)
    for root, mult in Fk.roots():
        r = ZZ(root)
        if r > 1 and r < n_val and n_val % r == 0:
            found = (r, kval)
            break
    if found:
        break
    if idx % 200 == 0:
        print(f"[shard {shard}/{nshards}] tried k = {kval} ...")

if found is None:
    print(f"[shard {shard}/{nshards}] no valid (p,k) found in this shard's range")
else:
    p_val, k_val = found
    q_val = n_val // p_val
    phi_val = (p_val - 1) * (q_val - 1)
    d_val = inverse_mod(e_val, phi_val)
    m = power_mod(c_val, d_val, n_val)

    flag = int(m).to_bytes((int(m).bit_length() + 7) // 8, "big")
    print("p =", p_val)
    print("k =", k_val)
    print("flag =", flag)
```

## Verification

> sage solve.sage 2 4
```text
[shard 2/4] tried k = 36003 ...
p = 11351930516523542315317906539924344774580985083821269661342348167707682743216582747512069801784045567342008801536938353101697666500649021589116009683451657
k = 36071
flag = b'0160ca14{1_d0nt_kn0w_what_a_Gr0bner_basis_1s,_but_1_us3d_1t_anyway!!!}'
```

> Other

```text
[shard ?/4] no valid (p,k) found in this shard's range
```

## Flag

```text
0160ca14{1_d0nt_kn0w_what_a_Gr0bner_basis_1s,_but_1_us3d_1t_anyway!!!}
```

## Lessons Learned

- A "leaked expression" mixing multiple secret RSA quantities (`p`, `q`, `d`) is not automatically safe just because it isn't `p`, `q`, or `d` directly - if every unknown in it can be re-expressed in terms of one variable plus a small-range parameter (here, the RSA multiplier `k` in `e*d - 1 = k*phi(N)`, which is always `< e`), the whole system collapses to a bounded search.
- `e*d - 1 = k*(p-1)(q-1)` is a generally useful substitution any time `d` appears in a leaked equation: it turns `d` from an unknown of RSA's size into a small-range integer `k` (bounded by `e`) that can be brute-forced.
- Explicit hardness assertions in challenge source (like `d > n^0.292` blocking Boneh-Durfee) are a signal about which attack the author intended to block - and a hint that a different, non-standard attack path is the intended one.
- Symbolic algebra systems (Sage's symbolic ring) are well suited for one-time heavy substitution/simplification of a complex leaked expression; converting the result to an explicit polynomial ring afterward keeps the repeated per-candidate work cheap.
- When no per-challenge source file is bundled with the solve script, check nested/duplicate folders in the extracted archive before assuming it must be reconstructed from the solver's comments alone.

# FactorMe Writeup

## Summary

This is a remote-only crypto challenge.

Each of 30 rounds hands the client both the RSA-like modulus `N` (a product of 5-20 distinct primes of 96-256 bits each) and its totient `phi(N)` directly, then asks only for the *count* of distinct prime factors - all under a single 60-second server-side timer covering every round. The core vulnerability is that knowing `phi(N)` is enough to factor `N` completely (the same trick used to factor RSA moduli given `d` and `e`), so the count can be computed exactly and fast enough to clear all 30 rounds inside the alarm.

Flag:

```text
HCMUS-CTF{H0p3_y0u_didn7_f4ct0r1s3_th353_Ns_a4bfdfca08e0a7329d6cb35bfed23341}
```

## Triage

`chal.py` builds each round's modulus from a random number of random-sized distinct primes, and volunteers the totient right alongside it:

```python
def generateN(self, n_bits, n_primes):
    primes = set()
    while len(primes) < n_primes:
        p = getPrime(n_bits)
        primes.add(p)
    return list(primes), prod(primes)

def getParam(self):
    n_bits = randint(96, 256)
    n_primes = randint(5, 20)
    return n_bits, n_primes
```

```python
primes, N = self.generateN(n_bits, n_primes)
phi = prod([p - 1 for p in primes])

print(f'This is public key: {N}')
print(f'Here is a little hint phi(N): {phi}')
```

The client only has to answer with `len(primes)` - the exact count of distinct prime factors of `N` - for that round to pass; a wrong count ends the connection immediately (`exit(0)`), and the flag is only printed after round 30 succeeds:

```python
primes_cnt = int(input('How many primes factors does N have'))
if primes_cnt == len(primes):
    if i == ROUNDS - 1:
        print("Great job. Here is your flag:", FLAG)
    else:
        print("Very good. How about this one.")
else:
    print("Wrong numbers of prime factors. Lucky next time")
    exit(0)
```

The whole 30-round loop runs under one `signal.alarm(60)`, and the server's own comment notes generation alone eats ~20-22s of that budget - so the client-side factoring/counting logic has to be cheap and fast, not just correct.

Never having to reconstruct the individual primes - only their count - plus being handed `phi(N)` directly, is the giveaway: this is structurally identical to "factor `N` given `d` and `e`" in RSA, generalized to more than two prime factors.

## Solve Path

For any modulus `m` and any exponent `phi` that is a multiple of the multiplicative order of elements mod each of `m`'s prime factors (which `phi(N)` always is, since `(p_i - 1) | phi(N)` for every factor `p_i`), write `phi = 2^s * t` with `t` odd. For a random base `a` coprime to `m`, repeatedly squaring `a^t mod m` up to `s` times must reach `1`; the value immediately before the *first* `1` reached is, with good probability, a nontrivial square root of unity mod `m` (`x^2 == 1` but `x != +-1`). Because `x == +-1` independently modulo each prime factor of `m`, `gcd(x - 1, m)` splits `m` into two nontrivial coprime pieces:

```python
def try_split(m, s, t):
    a = random.randrange(2, m - 1)
    g = math.gcd(a, m)
    if g != 1:
        return g
    x = pow(a, t, m)
    if x == 1 or x == m - 1:
        return None
    for _ in range(s - 1):
        y = pow(x, 2, m)
        if y == 1:
            return math.gcd(x - 1, m)
        if y == m - 1:
            return None
        x = y
    return None
```

`try_split` is retried until it produces a genuine nontrivial factor:

```python
def split(m, s, t):
    while True:
        r = try_split(m, s, t)
        if r is not None and r != 1 and r != m:
            return r
```

The key extra observation (called out directly in the solve script's comments) is that `phi(N)` stays valid for splitting *any* coprime divisor of `N` further, since for a divisor built from a subset of the original primes, `phi(divisor)` always divides `phi(N)`. So the same `s, t` derived once from `phi(N)` can be reused to recursively split every sub-factor down to primes, with no need to ever recover the individual `p_i` values or compute a fresh totient per split:

```python
def factor_count(n, phi):
    t = phi
    s = 0
    while t % 2 == 0:
        t //= 2
        s += 1

    count = 0
    stack = [n]
    while stack:
        m = stack.pop()
        if m == 1:
            continue
        if Integer(m).is_pseudoprime():
            count += 1
            continue
        f = split(m, s, t)
        stack.append(f)
        stack.append(m // f)
    return count
```

Each stack entry is tested for primality with a fast probabilistic check (`is_pseudoprime`); composite entries get split again with the same `(s, t)`. The final `count` is exactly the number of distinct prime factors the server wants - computed without ever knowing the primes themselves.

## Exploit

[solve.sage](#Solve) connects to the remote service, and for each of the 30 rounds parses `N` and `phi(N)` out of the banner text, runs `factor_count` to recover the number of distinct prime factors, and sends that count back before moving to the next round; after round 30 it drains and prints whatever the server sends (the flag banner).

Run:

```bash
sage solve.sage
```

Key steps:

- `try_split(m, s, t)`: one attempt at finding a nontrivial square root of unity mod `m` via a random base, returning a candidate `gcd`-derived factor.
- `split(m, s, t)`: retries `try_split` until a genuine nontrivial factor of `m` is found.
- `factor_count(n, phi)`: derives `s, t` from `phi` once, then recursively splits `n` on a stack until every remaining chunk passes `is_pseudoprime()`, returning the leaf count.
- `main()`: drives the network protocol - parses `N`/`phi(N)` each round, sends `factor_count(n, phi)` back, and repeats for all 30 rounds before printing the server's final response.

## Solve

```python
import math
import random
from pwn import *

context.log_level = "error"

HOST = "vm.daotao.antoanso.org"
PORT = 32787  # <-- set the FactorMe port

ROUNDS = 30


def try_split(m, s, t):
    a = random.randrange(2, m - 1)
    g = math.gcd(a, m)
    if g != 1:
        return g
    x = pow(a, t, m)
    if x == 1 or x == m - 1:
        return None
    for _ in range(s - 1):
        y = pow(x, 2, m)
        if y == 1:
            return math.gcd(x - 1, m)
        if y == m - 1:
            return None
        x = y
    return None


def split(m, s, t):
    while True:
        r = try_split(m, s, t)
        if r is not None and r != 1 and r != m:
            return r


def factor_count(n, phi):
    t = phi
    s = 0
    while t % 2 == 0:
        t //= 2
        s += 1

    count = 0
    stack = [n]
    while stack:
        m = stack.pop()
        if m == 1:
            continue
        if Integer(m).is_pseudoprime():
            count += 1
            continue
        f = split(m, s, t)
        stack.append(f)
        stack.append(m // f)
    return count


def main():
    io = remote(HOST, PORT)

    for i in range(ROUNDS):
        io.recvuntil(b"This is public key: ")
        n = int(io.recvline().strip())
        io.recvuntil(b"phi(N): ")
        phi = int(io.recvline().strip())

        cnt = factor_count(n, phi)
        io.sendline(str(cnt).encode())
        print(f"round {i}: n_bits~{n.bit_length()} -> {cnt} factors")

    print(io.recvall(timeout=5).decode(errors="replace"))


if __name__ == "__main__":
    main()
```

## Verification

```text
round 0: n_bits~3210 -> 20 factors
round 1: n_bits~2205 -> 14 factors
round 2: n_bits~4330 -> 18 factors
round 3: n_bits~2456 -> 17 factors
round 4: n_bits~1462 -> 6 factors
round 5: n_bits~2680 -> 15 factors
round 6: n_bits~2047 -> 10 factors
round 7: n_bits~1142 -> 8 factors
round 8: n_bits~2556 -> 10 factors
round 9: n_bits~1745 -> 14 factors
round 10: n_bits~1732 -> 7 factors
round 11: n_bits~2711 -> 17 factors
round 12: n_bits~3308 -> 17 factors
round 13: n_bits~3354 -> 16 factors
round 14: n_bits~1277 -> 8 factors
round 15: n_bits~801 -> 6 factors
round 16: n_bits~972 -> 8 factors
round 17: n_bits~730 -> 6 factors
round 18: n_bits~1110 -> 8 factors
round 19: n_bits~2032 -> 17 factors
round 20: n_bits~3488 -> 18 factors
round 21: n_bits~1943 -> 13 factors
round 22: n_bits~569 -> 5 factors
round 23: n_bits~857 -> 6 factors
round 24: n_bits~4004 -> 18 factors
round 25: n_bits~1788 -> 9 factors
round 26: n_bits~1829 -> 14 factors
round 27: n_bits~1569 -> 15 factors
round 28: n_bits~1629 -> 7 factors
round 29: n_bits~1847 -> 10 factors
How many primes factors does N have: Great job. Here is your flag: HCMUS-CTF{H0p3_y0u_didn7_f4ct0r1s3_th353_Ns_a4bfdfca08e0a7329d6cb35bfed23341}
```

## Flag

```text
HCMUS-CTF{H0p3_y0u_didn7_f4ct0r1s3_th353_Ns_a4bfdfca08e0a7329d6cb35bfed23341}
```

## Lessons Learned

- Knowing `phi(N)` (or, equivalently, the RSA private exponent `d` alongside `e`) is enough to factor `N` completely via the nontrivial-square-root-of-unity `gcd` trick - the same technique factors two-prime RSA moduli and multi-prime moduli alike.
- The trick generalizes recursively: any exponent that is a multiple of the order of elements modulo every prime factor of a composite (not just `N` itself, but any of its divisors) can be reused to keep splitting sub-factors, without ever deriving a fresh totient per split.
- A probabilistic primality test is enough to terminate the recursion - there is no need to fully certify primality to get a correct factor count.
- When a challenge volunteers what looks like a "hint" alongside a modulus, check first whether that hint alone trivially breaks the modulus's hardness assumption before looking for a harder attack.
- Time-boxed multi-round oracles reward optimizing the core primitive (here, fast probabilistic factor-splitting) over correctness-only approaches that would be too slow to finish inside the shared timer.

# RSA PTA Writeup

## Summary

The server generates its own RSA keypair and message, hands the player `m` and `c = m^e mod n` directly, then asks the player to submit `p`, `q`, `d` for a modulus of their own choosing; the flag is printed if `pow(c, d, p*q) == m`. There is no RSA to break - the vulnerability is that the server never checks the submitted `p`, `q`, `d` came from a keypair consistent with `c` and `e`, so the player can build a brand-new, purpose-built modulus in which `c^d == m` is easy to arrange.

Flag:

```text
HCMUS-CTF{d15cr3t3_lOg_1S_3aSy_wI7h_sM0OTH_0rDER}
```

## Triage

`chal.py` builds a normal RSA instance, but then leaks both the plaintext and ciphertext to the player before asking the player to supply the "private key" material:

```python
p = getPrime(512)
q = getPrime(512)
n = p * q
phi = (p-1) * (q-1)

while True:
    e = random.randint(2,n-1)
    if math.gcd(e,phi) == 1:
        break

d = pow(e, -1, phi)

m = random.randint(2,n-1)
c = pow(m, e, n)

print(m, c)

p = int(input())
q = int(input())
d = int(input())

assert(p < q)
assert(512 <= p.bit_length())
assert(q.bit_length() < 1024)
assert(isPrime(p))
assert(isPrime(q))

n = p * q
assert(1 < d < n)

if m == pow(c, d, n):
    with open('flag.txt','r') as f:
        print(f.read())
```

The check only constrains the *shape* of the submitted `p`, `q`, `d` (bit lengths, primality, `1 < d < n`) - it never re-derives `n` or `d` from the original `e`. The original keypair, `e`, and `phi` are discarded entirely once `m` and `c` are printed. The only real inputs the player must satisfy are the public `m` and `c` values printed on connect, e.g.:

```text
<m> <c>
```

both up to ~1024-bit integers.

## Solve Path

Since `m` and `c` are handed over directly, the goal reduces to: pick fresh primes `p`, `q` and a `d` such that `c^d ≡ m (mod p*q)`, with `p ∈ [512, ∞)` bits, `q < 1024` bits, `p < q`, both prime, `n = p*q` large enough that `pow(c, d, n)` (always `< n`) can actually equal the ~1024-bit `m`.

The trick is to build each prime as a **smooth prime** (`prime - 1` is a product of small primes chosen by us), so its multiplicative group's discrete log is tractable via Pohlig-Hellman, and additionally require `c` to be a **primitive root** mod that prime so `m` is guaranteed to be *some* power of `c`:

```python
def generate_smooth_prime(min_bits, pool, tries=4000):
    for _ in range(tries):
        random.shuffle(pool)
        prod_val = 2
        factors = {2}
        for pr in pool:
            if prod_val.bit_length() >= min_bits:
                break
            prod_val *= pr
            factors.add(pr)
        cand = prod_val + 1
        if cand.bit_length() >= min_bits and is_prime(cand):
            return cand, factors
    return None, None


def is_primitive_root(base, p, factors):
    if base % p == 0:
        return False
    for r in factors:
        if pow(base, (p - 1) // r, p) == 1:
            return False
    return True
```

For each candidate smooth prime `p` (built from `pool_p`) and `q` (built from a disjoint pool `pool_q`), Sage's built-in discrete-log solver - which internally runs Pohlig-Hellman over the known smooth factorization of `p-1` - recovers the exponent `d_p` with `c^d_p ≡ m (mod p)`, and likewise `d_q` mod `q`:

```python
d_p = Integer(Zmod(p)(m_val % p).log(Zmod(p)(c_val % p)))
d_q = Integer(Zmod(q)(m_val % q).log(Zmod(q)(c_val % q)))
```

These two congruences (`d ≡ d_p mod p-1`, `d ≡ d_q mod q-1`) are combined with a CRT that tolerates a non-coprime modulus, since both `p-1` and `q-1` are even:

```python
def combine_crt(a, m, b, n):
    g = gcd(m, n)
    if (a - b) % g != 0:
        return None
    lcm = m // g * n
    m_g, n_g = m // g, n // g
    inv = inverse_mod(m_g, n_g)
    t = (((b - a) // g) % n_g) * inv % n_g
    return (a + m * t) % lcm
```

`d_p` and `d_q` must agree modulo `gcd(p-1, q-1)` for the CRT to be consistent; since both moduli are even this is at least a 50/50 coincidence on the shared factor of 2, so the script simply retries with fresh primes on failure - keeping `p` and `q`'s small-prime pools disjoint (`primes(3, 2000)` vs `primes(2003, 6000)`) keeps `gcd(p-1, q-1)` close to `2` so retries converge quickly. `p` is targeted at 520 bits and `q` at 650 bits so `n = p*q` comfortably exceeds the ~1024-bit range `m` came from, otherwise `pow(c, d, n) < n` could never equal `m`.

Once a consistent `d` is found, it is verified locally before sending:

```python
n = p * q
if 1 < d < n and pow(int(c_val), int(d), int(n)) == int(m_val):
    return p, q, d
```

## Exploit

The solve script is [solve.sage](#Solve). It connects to the remote, reads `m` and `c`, repeatedly builds a pair of disjoint-pool smooth primes for which `c` is a primitive root, solves the discrete log of `m` base `c` mod each prime via Sage's `.log()`, CRT-combines the two partial exponents into a single `d`, and - once `pow(c, d, p*q) == m` verifies locally - sends `p`, `q`, `d` to the server to receive the flag.

Run:

```bash
sage solve.sage
```

Key steps:

- `generate_smooth_prime`: builds a prime `P` where `P - 1` is a product of small primes from a given pool, so `Zmod(P)` discrete logs are cheap.
- `is_primitive_root`: checks `c` generates the full multiplicative group mod the candidate prime, guaranteeing `m` is expressible as `c^d`.
- `find_prime_with_primitive_root`: retries `generate_smooth_prime` until it also satisfies the primitive-root condition for `c`.
- `combine_crt`: CRT combination that tolerates non-coprime moduli (needed since both `p-1` and `q-1` are even).
- `solve_pd`: orchestrates prime generation, `Zmod(p).log()` Pohlig-Hellman discrete logs, CRT combination, and local verification, retrying on CRT inconsistency.

## Solve

```python=
import random
from pwn import *

context.log_level = "error"

HOST = ???
PORT = ???

P_BITS = 520
Q_BITS = 650

POOL_P = list(primes(3, 2000))
POOL_Q = list(primes(2003, 6000))


def generate_smooth_prime(min_bits, pool, tries=4000):
    for _ in range(tries):
        random.shuffle(pool)
        prod_val = 2
        factors = {2}
        for pr in pool:
            if prod_val.bit_length() >= min_bits:
                break
            prod_val *= pr
            factors.add(pr)
        cand = prod_val + 1
        if cand.bit_length() >= min_bits and is_prime(cand):
            return cand, factors
    return None, None


def is_primitive_root(base, p, factors):
    if base % p == 0:
        return False
    for r in factors:
        if pow(base, (p - 1) // r, p) == 1:
            return False
    return True


def find_prime_with_primitive_root(min_bits, base, other_val, pool, tries=300):
    for _ in range(tries):
        p, factors = generate_smooth_prime(min_bits, pool)
        if p is None:
            continue
        if other_val % p == 0:
            continue
        if is_primitive_root(base, p, factors):
            return p, factors
    return None, None


def combine_crt(a, m, b, n):
    g = gcd(m, n)
    if (a - b) % g != 0:
        return None
    lcm = m // g * n
    m_g, n_g = m // g, n // g
    inv = inverse_mod(m_g, n_g)
    t = (((b - a) // g) % n_g) * inv % n_g
    return (a + m * t) % lcm


def solve_pd(m_val, c_val):
    for attempt in range(200):
        p, p_factors = find_prime_with_primitive_root(P_BITS, c_val, m_val, POOL_P)
        if p is None:
            continue
        q, q_factors = find_prime_with_primitive_root(Q_BITS, c_val, m_val, POOL_Q)
        if q is None:
            continue
        if not (p < q and p.bit_length() >= 512 and q.bit_length() < 1024):
            continue

        d_p = Integer(Zmod(p)(m_val % p).log(Zmod(p)(c_val % p)))
        d_q = Integer(Zmod(q)(m_val % q).log(Zmod(q)(c_val % q)))

        d = combine_crt(d_p, p - 1, d_q, q - 1)
        if d is None:
            print(f"[attempt {attempt}] CRT inconsistent, retrying...")
            continue

        n = p * q
        if 1 < d < n and pow(int(c_val), int(d), int(n)) == int(m_val):
            print(f"found after {attempt+1} attempt(s)")
            return p, q, d
    raise RuntimeError("failed to find a consistent (p, q, d) in the attempt budget")


def main():
    io = remote(HOST, PORT)

    line = io.recvline().split()
    m_val = Integer(int(line[0]))
    c_val = Integer(int(line[1]))
    print("m =", m_val)
    print("c =", c_val)

    p, q, d = solve_pd(m_val, c_val)
    print("p =", p)
    print("q =", q)
    print("d =", d)

    io.sendline(str(p).encode())
    io.sendline(str(q).encode())
    io.sendline(str(d).encode())

    print(io.recvall(timeout=5).decode(errors="replace"))


if __name__ == "__main__":
    main()
```

## Verification

```text
m = 39941817405692465036073127889130447370121759821836898235375099329950489869267279210591825593740205795095816991684994988815747989247145261839255889097978473588881651879553814485172898496350947128966322522376367619101817036808000171383840456303494434246926435742047530184419063960388382524471797970440977475885
c = 29466426033687121040905949449121718721979067411644059719389731349035273903943166106441245758167856965835611845639818167745242496039883875699522271719876466317147682626203618289596787765717358171300183152994104235416102282754296930561036847090766079333064016683528246199252697657577462542736899134909193357030
[attempt 0] CRT inconsistent, retrying...
found after 2 attempt(s)
p = 4380364723632112596981812444141176226728562637460540716294639100267419352494506085438889211062421539767039974814185782482060338265694008651820064477766368399
q = 52533510312787447081064202254022997105016088309095488951195162561623473090022287186998817683405786206691800608778071795266617013540367075471470617212344718949197207574553481456767468007414963870927
d = 71746249164328221454612312651265011767434403477924746769761010046615373032839703417416870791692965647314441312536662421278952660982855243758186272041152221745837349457618404430431006407987491770970257158886271999188558047582690326106743222990790332634358577773710620536683004278595617276479420865581964114424880160280433746679224525959169514535949654145
HCMUS-CTF{d15cr3t3_lOg_1S_3aSy_wI7h_sM0OTH_0rDER}
```

## Flag

```text
HCMUS-CTF{d15cr3t3_lOg_1S_3aSy_wI7h_sM0OTH_0rDER}
```

## Lessons Learned

- A server that lets the client fully control the modulus and private exponent - while only checking their *shape*, not their derivation from the actual keypair - has no real cryptographic binding; treat "prove you know `d`" as a puzzle to construct a convenient `d` for, not a puzzle to recover the *original* `d`.
- Smooth-order groups make discrete log trivial via Pohlig-Hellman; deliberately constructing a modulus with `p - 1` (or `q - 1`) fully factored into small primes turns an otherwise-hard DLP into a solved one.
- A primitive root guarantees every group element (including a target value like `m`) is reachable as some power of the base, which is the precondition that makes a chosen-modulus discrete-log attack always succeed rather than just "sometimes."
- CRT combination across two congruences with even (non-coprime) moduli is still solvable, but only when the two partial results agree on the shared factor - keeping the two prime-generation pools disjoint reduces that shared factor and cuts retries.
- When two independently generated constraints must agree by chance, the practical solve is a generate-and-retry loop rather than a closed-form guarantee.

# Number Castle Writeup

## Summary

The service asks for the plaintext message for five RSA stages. Each stage uses a different intentionally weak RSA setup. After solving all five stages, the service prints the flag.

Flag:

```text
HCMUS-CTF{RSA_is_so00000OOOOOOOOOOO_easyyyyyyy_r1ght?}
```

## Triage

No source code was provided, so I first connected to the service and captured the prompts. Every stage printed RSA parameters in the form:

```text
If N = ...; e = ... and c = ..., so what is the message?
```

The answers were not decimal integers. The decrypted integers decoded to printable ASCII hex-like strings, and those byte strings had to be sent back.

## Solve Path

### Stage 1: small exponent without padding

Stage 1 used `e = 3`, and the ciphertext was much smaller than `N`. This suggested there was no modular wraparound:

```text
c = m^3
```

So the message is just the exact integer cube root of `c`:

```python
root, exact = iroot_exact(c, 3)
assert exact
answer = long_to_bytes(root)
```

### Stage 2: Wiener's attack

Stage 2 gave a 1024-bit RSA modulus and a very large public exponent. The quick checks ruled out shared factors and close primes, but the large `e` suggested a small private exponent `d`.

For RSA:

```text
e*d - k*phi(N) = 1
```

If `d` is small enough, `k/d` appears among the continued fraction convergents of `e/N`. For each convergent `(k, d)`, compute:

```text
phi = (e*d - 1) / k
s = N - phi + 1 = p + q
disc = s^2 - 4N
```

When `disc` is a square, `p` and `q` are recovered. In this challenge the recovered `d` directly decrypted the ciphertext:

```python
d = wiener(N, e)
m = pow(c, d, N)
answer = long_to_bytes(m)
```

### Stage 3: close primes and non-invertible exponent

Stage 3 used a fixed `N` and `e = 69`. Fermat factorization worked immediately because the primes were very close:

```text
N = p*q, where p ~= q
```

After factoring, `e` was not invertible modulo `phi(N)` because:

```text
gcd(69, phi(N)) = 3
```

So normal RSA decryption was not possible. Instead, solve roots modulo each prime.

For each prime:

```text
g = gcd(e, prime - 1)
```

If `g = 1`, invert `e` normally. If `g > 1`, remove the invertible part first, then take the `g`-th modular roots:

```python
reduced_e = e // g
reduced = pow(c, inverse(reduced_e, prime - 1), prime)
roots = nthroot_mod(reduced, g, prime, True)
```

Then combine roots with CRT and select the only printable candidate.

### Stage 4: small factor

Stage 4 used standard `e = 65537`, but the modulus was only about 527 bits. Trial factoring immediately found a small factor:

```text
31337 | N
```

With `p = 31337` and `q = N / p`, compute `phi(N)`, invert `e`, and decrypt:

```python
phi = (p - 1) * (q - 1)
d = pow(e, -1, phi)
m = pow(c, d, N)
```

### Stage 5: leaked expression involving d and p

Stage 5 gave a standard-looking 1024-bit `N` with `e = 65537`, plus one extra huge value in the prompt (bigger than `N`, so it couldn't be `c`). Before trusting that value as useful, I first checked whether stage 5 was breakable by factoring `N` alone:

- `gcd(c, N)`, `gcd(c±1, N)`, trial division, Mersenne/Fermat/Pollard p-1/Williams p+1, a ROCA fingerprint check, gmp-ecm with a 600s budget, a Hilbert-class-polynomial (CM) special-form curve search, and a full RsaCtfTool pass over its non-hopeless attack list (`hart`, `lehman`, `kraitchik`, `small-fraction`, `lattice`, `boneh_durfee`, `small_crt_exp`, etc.)

All of these failed - `N` is a genuine balanced semiprime with no exploitable structure. That ruled out pure factoring and confirmed the extra huge value in the prompt had to be the actual attack surface: it was a leak of

```text
g = d * (p - 0xabadc0de)
```

Let:

```text
a = 0xabadc0de
g = d * (p - a)
```

RSA also gives:

```text
e*d - 1 = k*phi(N)
```

Since `e = 65537`, the unknown multiplier `k` is small:

```text
1 <= k <= e
```

Substitute `d = g / (p - a)`. Since `phi(N)` is close to `N`, this gives a good estimate:

```text
p ~= floor(e*g / (k*N)) + a
```

Looping over all `k` from `1` to `65537` and checking a small window around the estimate recovers an exact divisor of `N`:

```python
for k in range(1, e + 1):
    p0 = (e * g) // (k * N) + 0xABADC0DE
    for p in range(p0 - 100, p0 + 101):
        if N % p == 0:
            q = N // p
            decrypt_with_factors(N, e, c, {p: 1, q: 1})
```

This is a bounded algebraic search over at most `65537 * 201` candidates, with exact divisibility as the oracle.

## Exploit

The final solver is [solve.sage](#Solve) (a Sage script - Sage's `Integer`/`nth_root`/`GF` arithmetic is used for the modular n-th roots in stage 3). It connects to the remote, parses each prompt for `N`, `e`, `c`, and (on the last floor) the extra leaked value, applies the stage-specific RSA break, sends the decoded byte message, and continues until the flag is printed.

Run:

```bash
sage solve.sage
```

Relevant helpers:

- `iroot_exact`: exact e-th root for Stage 1 (`e` small, `c` unwrapped)
- `wiener`: continued-fraction attack for Stage 2 (small private exponent)
- `fermat` / `small_factor`: close-prime and small-factor recovery for Stages 3 and 4
- `decrypt_with_factors` + `semiprime_roots`: CRT combination and per-prime `e`-th roots when `gcd(e, phi(N)) > 1` (Stage 3)
- `leaked_g_attack`: bounded `k` search recovering `p` from the leaked `d * (p - 0xabadc0de)` (Stage 5)

## Solve

```python=

import re
from pwn import *
from Crypto.Util.number import long_to_bytes

context.log_level = "debug"

HOST = ???
PORT = ???

A_CONST = 0xABADC0DE


# --------------------------------------------------------------- primitives

def iroot_exact(c, e):
    r, exact = Integer(c).nth_root(int(e), truncate_mode=True)
    return int(r), bool(exact)


def wiener(e, n):
    num, den = int(e), int(n)
    cf = []
    while den:
        q = num // den
        cf.append(q)
        num, den = den, num - q * den
    h0, h1, k0, k1 = 0, 1, 1, 0
    for a in cf:
        h0, h1 = h1, a * h1 + h0
        k0, k1 = k1, a * k1 + k0
        k, d = h1, k1
        if k == 0 or d == 0 or (int(e) * d - 1) % k != 0:
            continue
        phi = (int(e) * d - 1) // k
        s = int(n) - phi + 1
        disc = s * s - 4 * int(n)
        if disc < 0:
            continue
        t = isqrt(disc)
        if t * t == disc:
            return int(d)
    return None


def fermat(n, max_iter=2_000_000):
    n = int(n)
    a = isqrt(n)
    if a * a < n:
        a += 1
    for _ in range(max_iter):
        b2 = a * a - n
        b = isqrt(b2)
        if b * b == b2:
            return [int(a - b), int(a + b)]
        a += 1
    return None


def small_factor(n, bound=10_000_000):
    n = int(n)
    for p in primes(bound):
        if n % int(p) == 0:
            return [int(p), n // int(p)]
    return None


# ------------------------------------------------- decrypt given the factors

def is_printable(b):
    return len(b) > 0 and all(0x20 <= x < 0x7f for x in b)


def pick_printable(cands):
    printable = [(m, long_to_bytes(int(m))) for m in cands
                 if is_printable(long_to_bytes(int(m)))]
    for m, b in printable:                          
        if all(ch in b"0123456789abcdef" for ch in b):
            return int(m)
    if printable:
        return int(printable[0][0])
    return int(cands[0]) if cands else None


def semiprime_roots(n, e, c, p, q):
    def roots(pp):
        Fp = GF(pp)
        v = Fp(int(c) % int(pp))
        if v == 0:
            return [0]
        try:
            return [int(r) for r in v.nth_root(int(e), all=True)]
        except (ValueError, ArithmeticError):
            return []
    inv = inverse_mod(int(p), int(q))
    out = []
    for rp in roots(p):
        for rq in roots(q):
            m = int((rp + p * ((rq - rp) * inv % q)) % n)
            if pow(m, int(e), int(n)) == int(c) % int(n):
                out.append(m)
    return out


def decrypt_with_factors(n, e, c, p, q):
    n, e, c, p, q = int(n), int(e), int(c), int(p), int(q)
    phi = (p - 1) * (q - 1)
    if gcd(e, phi) == 1:
        return int(pow(c, int(inverse_mod(e, phi)), n))
    return pick_printable(semiprime_roots(n, e, c, p, q))   


# ------------------------------------------------------- stage 5 leak attack

def leaked_g_attack(n, e, c, g):
    n, e, g = int(n), int(e), int(g)
    for k in range(1, e + 1):
        p0 = (e * g) // (k * n) + A_CONST
        for p in range(p0 - 100, p0 + 101):
            if p > 1 and n % p == 0:
                return decrypt_with_factors(n, e, c, p, n // p)
    return None


# ------------------------------------------------------------- dispatcher

def solve_stage(n, e, c, leak):
    n, e, c = int(n), int(e), int(c)

    if leak is not None:                       # stage 5: leaked d*(p-a)
        return leaked_g_attack(n, e, c, leak)

    if e.bit_length() <= 40:                   # stage 1: small e, exact root
        r, exact = iroot_exact(c, e)
        if exact:
            return int(r)

    d = wiener(e, n)                           # stage 2: tiny d
    if d is not None:
        return int(pow(c, d, n))

    pq = fermat(n) or small_factor(n)          # stages 3 & 4: factorable N
    if pq is not None:
        return decrypt_with_factors(n, e, c, pq[0], pq[1])

    return None


def main():
    io = remote(HOST, PORT)

    while True:
        try:
            chunk = io.recvuntil(b">>> ", timeout=30)
        except EOFError:
            break
        text = chunk.decode(errors="replace")

        pairs = dict(re.findall(r"\b([A-Za-z_]\w*)\s*=\s*(\d+)", text))
        if not {"N", "e", "c"} <= set(pairs):
            print(text)                        
            break

        n = int(pairs["N"])
        e = int(pairs["e"])
        c = int(pairs["c"])
        big = max(int(x) for x in re.findall(r"\d+", text))
        leak = big if big > n else None

        tag = "leak" if leak is not None else f"e={e.bit_length()}b"
        print(f"[stage] N={n.bit_length()}b {tag}")

        m = solve_stage(n, e, c, leak)
        if m is None:
            print("!! failed to solve this stage")
            print(text)
            break

        io.sendline(long_to_bytes(m))

        if leak is not None:                   # stage 5 is the last floor
            print(io.recvall(timeout=5).decode(errors="replace"))
            break


if __name__ == "__main__":
    main()
```

## Verification

The solver was run against the live service and completed all five stages. The final output was:

```text
Well done, here is your reward!
HCMUS-CTF{RSA_is_so00000OOOOOOOOOOO_easyyyyyyy_r1ght?}
```

## Flag

```text
HCMUS-CTF{RSA_is_so00000OOOOOOOOOOO_easyyyyyyy_r1ght?}
```

## Lessons Learned

- Low public exponent without padding allows integer root recovery when the ciphertext never wraps modulo `N`.
- A small private exponent enables Wiener's continued-fraction attack, regardless of how large `e` looks.
- Close primes make Fermat factorization immediate - always try it before reaching for heavier tools.
- A non-coprime `e` (i.e. `gcd(e, phi(N)) > 1`) breaks normal modular inversion; recover the message via per-prime `e`-th roots and CRT instead, disambiguating candidates by printability.
- Before trusting an "obviously extra" value in a prompt as the intended attack, first rule out plain factoring (small factors, Fermat, Pollard p-1/p+1, ECM, special-form primes) - a clean negative result is itself the signal that points at the real vulnerability.
- A leaked algebraic expression mixing `d` and `p` can still be inverted: combine it with `e*d - 1 = k*phi(N)` (small `k` for small `e`) and `phi(N) ~= N` to get a close numerical estimate of `p`, then confirm with exact divisibility over a small search window.

# DragonBall Writeup

## Summary

This is a remote crypto challenge: no server source was provided, only `debug.py`, a comment-only fragment leaked from the service's own debug output containing the ElGamal domain parameters (`p`, `g`), the hash function used (SHA-1), and an example PyCryptodome `ElGamal.sign`/`verify` snippet, the actual "Dragon Ball Verification System" service. The core vulnerability is a static ElGamal signing nonce `k` (same `r = g^k mod p` reused across signatures), which lets two signatures over different messages leak the private key.

Flag:

```text
HCMUS-CTF{Same k? Really? No, ElGamal hates it.}
```

## Triage

`debug.py` contains no executable logic - it is entirely a comment block, apparently leaked debug output from the service, that discloses the ElGamal parameters and signing scheme in use:

```python
# ----- DEBUG MODE -----
#         # We used ElGamal signature scheme with
#         >>> p = 129395855808705212728342121899564040533627536165407217623699982163034898985604990453612738681235265684964910273382421570674875235106037524148312004154122323500944367988234700927644310658336581857679208804861661335768169851589929150626616698506529354785376916490328643358410300092039405295348822918174724269387
#         >>> g = 125119881720420900707670154269953309690838537679536446473408150363676013315875914220318853661265626997530402259420104771257078966641464155686445398996594055909718103795617751840611152747280651424068043671714408414771552296848509963265865300590662320297995606313265875459093865996548994154719802981360764938058
#         # SHA is the Hash Function we used.
#         >>> h = SHA.new('USERNAME=username&LEVEL=Saiyan').digest()
```

This tells us the challenge exposes a service that signs messages of the form `USERNAME=<name>&LEVEL=<level>` with ElGamal over a ~1024-bit prime `p`, hashed with SHA-1, and presumably verifies a submitted token against a required `LEVEL` (e.g. `SuperSaiyan`) to release the flag. Since there is no source for the actual signing/verification logic, the real behavior - including the suspicion that the nonce `k` is reused - had to be inferred by interacting with the live service and comparing multiple signatures.

## Solve Path

`solve.sage` first fetches the live `p`/`g` from the service (option `3`) rather than trusting the values in the leaked debug comment, since the actual deployed instance may differ:

```python
def get_params(io):
    io.recvuntil(b">>> ")
    io.sendline(b"3")
    data = io.recvuntil(b"Dragon Ball Verification System").decode(errors="replace")
    p = Integer(re.search(r"p = (\d+)", data).group(1))
    g = Integer(re.search(r"g = (\d+)", data).group(1))
    return p, g
```

It then requests signed tokens for three different usernames (option `1`), parsing out each message, its SHA-1 hash, and the `(r, s)` signature pair:

```python
def generate(io, name):
    io.recvuntil(b">>> ")
    io.sendline(b"1")
    io.recvuntil(b"Your name: ")
    io.sendline(name.encode())
    io.recvuntil(b"Say ")
    token = io.recvuntil(b" to summon", drop=True).strip()
    blob = b64decode(token)
    msg, rest = blob.split(b"&r=", 1)
    r_part, s_part = rest.split(b"&s=", 1)
    r = Integer(int.from_bytes(r_part, "big"))
    s = Integer(int.from_bytes(s_part, "big"))
    h = Integer(int.from_bytes(sha1(msg).digest(), "big"))
    return msg, h, r, s
```

Comparing `r = g^k mod p` across the three signatures showed it is identical every time - the signing nonce `k` is static rather than freshly random per signature, which is fatal for ElGamal. With two signatures `(h1, r, s1)` and `(h2, r, s2)` sharing the same `r`:

```text
s1 = (h1 - x*r) * k^-1 (mod p-1)
s2 = (h2 - x*r) * k^-1 (mod p-1)
```

Subtracting eliminates `x`, giving `k = (h1 - h2) / (s1 - s2) (mod p-1)`, and then `x = (h1 - s1*k) / r (mod p-1)`. Because `p-1` need not be coprime to the divisors involved, `solve_lin` solves the linear congruence `a*z == b (mod n)` generally (via `gcd`, not a plain modular inverse) and returns every valid residue class, and each private-key candidate `x` is verified against a real signature before being accepted:

```python
def solve_lin(a, b, n):
    a %= n
    b %= n
    g = gcd(a, n)
    if b % g != 0:
        return []
    a1, b1, n1 = a // g, b // g, n // g
    z0 = (b1 * inverse_mod(a1, n1)) % n1
    return [(z0 + i * n1) % n for i in range(g)]


def recover_x(p, g, sigs):
    p1 = p - 1
    (m1, h1, r, s1) = sigs[0]
    for j in range(1, len(sigs)):
        (m2, h2, r2, s2) = sigs[j]
        assert r2 == r, "nonce not static -> attack assumption broken"
        for k in solve_lin((s1 - s2) % p1, (h1 - h2) % p1, p1):
            for x in solve_lin(r % p1, (h1 - s1 * k) % p1, p1):
                y = pow(g, x, p)
                if pow(g, int(h1), p) == (pow(y, int(r), p) * pow(int(r), int(s1), p)) % p:
                    return Integer(x), Integer(k), Integer(y)
    return None, None, None
```

With the recovered private key `x`, the script signs its own message with the required level and submits it for verification:

```python
TARGET_MSG = b"USERNAME=pwn&LEVEL=SuperSaiyan"

def sign(p, g, x, msg):
    p1 = p - 1
    h = Integer(int.from_bytes(sha1(msg).digest(), "big"))
    k = Integer(3)
    while gcd(k, p1) != 1:
        k += 2
    r = pow(g, int(k), int(p))
    s = ((h - x * r) * inverse_mod(k, p1)) % p1
    return Integer(r), Integer(s)
```

## Exploit

The solve script is [solve.sage](#Solve). It connects to the live service, fetches the live ElGamal parameters, requests three signed tokens for different usernames, recovers the static nonce and private key from any pair of them via linear congruence solving, forges a fresh signature over `USERNAME=pwn&LEVEL=SuperSaiyan` with a freshly chosen coprime nonce, and submits it to the verification endpoint.

Run:

```bash
sage solve.sage
```

Key helpers:

- `get_params`: fetches the live `p`, `g` from the service's own printout instead of trusting the leaked debug comment
- `generate`: requests a signed token for a given username and parses out `(msg, h, r, s)`
- `solve_lin`: solves a general linear congruence `a*z == b (mod n)` (handles `gcd(a,n) > 1`, returns all solutions)
- `recover_x`: derives the static nonce `k` and private key `x` from two same-`r` signatures, verifying each candidate against a real signature
- `sign`: forges a fresh valid signature over an arbitrary message using the recovered private key
- `verify`: submits a forged token to the service's verification option and returns its response

## Solve

```python=
from sage.all import *
from pwn import *
from hashlib import sha1
from base64 import b64encode, b64decode
import re

HOST = "vm.daotao.antoanso.org"
PORT = 32791

TARGET_MSG = b"USERNAME=pwn&LEVEL=SuperSaiyan"


def l2b(n):
    n = int(n)
    return n.to_bytes((n.bit_length() + 7) // 8, "big")


def solve_lin(a, b, n):
    # all z with a*z == b (mod n)
    a %= n
    b %= n
    g = gcd(a, n)
    if b % g != 0:
        return []
    a1, b1, n1 = a // g, b // g, n // g
    z0 = (b1 * inverse_mod(a1, n1)) % n1
    return [(z0 + i * n1) % n for i in range(g)]


def get_params(io):
    io.recvuntil(b">>> ")
    io.sendline(b"3")
    data = io.recvuntil(b"Dragon Ball Verification System").decode(errors="replace")
    p = Integer(re.search(r"p = (\d+)", data).group(1))
    g = Integer(re.search(r"g = (\d+)", data).group(1))
    return p, g


def generate(io, name):
    io.recvuntil(b">>> ")
    io.sendline(b"1")
    io.recvuntil(b"Your name: ")
    io.sendline(name.encode())
    io.recvuntil(b"Say ")
    token = io.recvuntil(b" to summon", drop=True).strip()
    blob = b64decode(token)
    msg, rest = blob.split(b"&r=", 1)
    r_part, s_part = rest.split(b"&s=", 1)
    r = Integer(int.from_bytes(r_part, "big"))
    s = Integer(int.from_bytes(s_part, "big"))
    h = Integer(int.from_bytes(sha1(msg).digest(), "big"))
    return msg, h, r, s


def verify(io, token):
    io.recvuntil(b">>> ")
    io.sendline(b"2")
    io.recvuntil(b"Summon Shenron: ")
    io.sendline(token)
    return io.recvall(timeout=5).decode(errors="replace").strip()


def recover_x(p, g, sigs):
    p1 = p - 1
    (m1, h1, r, s1) = sigs[0]
    for j in range(1, len(sigs)):
        (m2, h2, r2, s2) = sigs[j]
        assert r2 == r, "nonce not static -> attack assumption broken"
        for k in solve_lin((s1 - s2) % p1, (h1 - h2) % p1, p1):
            for x in solve_lin(r % p1, (h1 - s1 * k) % p1, p1):
                y = pow(g, x, p)
                if pow(g, int(h1), p) == (pow(y, int(r), p) * pow(int(r), int(s1), p)) % p:
                    return Integer(x), Integer(k), Integer(y)
    return None, None, None


def sign(p, g, x, msg):
    p1 = p - 1
    h = Integer(int.from_bytes(sha1(msg).digest(), "big"))
    k = Integer(3)
    while gcd(k, p1) != 1:
        k += 2
    r = pow(g, int(k), int(p))
    s = ((h - x * r) * inverse_mod(k, p1)) % p1
    # local sanity check
    y = pow(g, int(x), int(p))
    assert pow(g, int(h), int(p)) == (pow(y, int(r), int(p)) * pow(int(r), int(s), int(p))) % int(p)
    return Integer(r), Integer(s)


def main():
    io = remote(HOST, PORT)
    p, g = get_params(io)
    log.info(f"p bits: {int(p).bit_length()}")

    sigs = [generate(io, n) for n in ["pwna", "pwnbb", "pwnccc"]]
    log.info(f"r (should be identical): {hex(int(sigs[0][2]))[:20]}...")

    x, k, y = recover_x(p, g, sigs)
    if x is None:
        log.failure("failed to recover private key")
        io.close()
        return
    log.success(f"recovered private key x = {x}")

    r, s = sign(p, g, x, TARGET_MSG)
    token = b64encode(TARGET_MSG + b"&r=" + l2b(r) + b"&s=" + l2b(s))
    resp = verify(io, token)
    io.close()

    log.info(f"response:\n{resp}")
    if any(m in resp for m in ("CTF", "flag", "FLAG", "HCMUS", "{")):
        log.success("FLAG FOUND")


if __name__ == "__main__":
    main()
```

## Verification

```text
[+] Opening connection to vm.daotao.antoanso.org on port 32791: Done
[*] p bits: 1024
[*] r (should be identical): 0x4dc3be6bf1e702fa59...
[+] recovered private key x = 12841053699073275911948582609582036268035816999075891383482120347559247896616288846996721466728842982835660588351096284144328709549322351938920824008376895019700428848240004524021310165326109738573794348659829181144052586134072911352831288002506748789000912905006051038498110861831292263097809911298247559460
[+] Receiving all data: Done (89B)
[*] Closed connection to vm.daotao.antoanso.org port 32791
[*] response:
    Hooooo! Shenron will give you the FLAG!
    HCMUS-CTF{Same k? Really? No, ElGamal hates it.}
[+] FLAG FOUND
```

## Flag

```text
HCMUS-CTF{Same k? Really? No, ElGamal hates it.}
```

## Lessons Learned

- ElGamal (and DSA/ECDSA-family) signatures leak the private key immediately if the per-signature nonce `k` is ever reused - the same failure mode as reused nonces in any Schnorr-like signature scheme.
- A static/reused nonce shows up observably as an identical `r = g^k mod p` across otherwise-different signatures - this is a cheap, purely observational check to run before attempting any heavier cryptanalysis.
- When solving modular linear equations for an attack, don't assume the modulus is coprime to the coefficients - use a general `gcd`-based linear congruence solver so solutions aren't silently missed when `p-1` (or similar) is composite.
- Always verify a derived candidate secret (like a recovered private key) against an independent real signature before trusting it - division/inversion under a non-prime modulus can yield multiple candidate residues.
- Don't trust parameters found in leaked debug output or comments as authoritative - refetch live values from the running service where possible, since a deployed instance may differ from what was captured in a debug log.

# SignMe Writeup

## Summary

The server implements an ElGamal-style signature scheme (`(r, s)` over a public `(g, p, y=g^x)`), with the per-message nonce `k` derived from a keyed sum over the message bytes - but on an empty message that sum is `0`, and the "make `k` odd" fallback (`k += 1`) then forces `k = 1` deterministically. Signing the empty string leaks a fully known nonce, which is enough to solve for the private key `x` and forge a signature for the server's random "prove you can sign" challenge.

Flag:

```text
HCMUS-CTF{b4S364_1s_iNT3r3sT1nG}
```

## Triage

`chal.py` implements a Schnorr/ElGamal-like signing scheme over a fixed 256-bit prime `p`, with per-message key `k` computed from a dot product of secret coefficients and the message bytes:

```python
self.p = 99489312791417850853874793689472588065916188862194414825310101275999789178243
self.x = randint(1, self.p - 1)
self.g = randint(1, self.p - 1)
self.y = pow(self.g, self.x, self.p)
self.coef = [randint(1, self.p - 1) for _ in range(self.N)]
```

```python
def sign(self, pt):
    ...
    msg = b64decode(pt)
    if (len(msg) > self.N):
        return (0, 0)

    k = sum([coef * m for coef, m in zip(self.coef, msg)])
    if k % 2 == 0:            # Just to make k and p-1 coprime :)))
        k += 1

    r = pow(self.g, k, self.p)
    h = bytes_to_long(sha256(pt).digest())
    s = ((h - self.x * r) * inverse(k, self.p - 1)) % (self.p - 1)
    self.sign_attempt -= 1
    return (r, s)
```

`k = sum(coef * m for coef, m in zip(self.coef, msg))` uses `zip`, so if `msg` is empty the sum is over zero pairs - `k` is unconditionally `0` before the parity fix, and the `if k % 2 == 0: k += 1` fallback then makes it unconditionally `1`, regardless of the (secret) `coef` list. This is a nonce (`k`) that is fully known to the attacker for one specific, always-available input: base64 of the empty string.

The `get_flag` flow requires forging a valid `(r, s)` for a *server-chosen* random test message, verified with the standard ElGamal-style check:

```python
def verify(self, pt, r, s):
    if not 0 < r < self.p:
        return False
    if not 0 < s < self.p - 1:
        return False
    h = bytes_to_long(sha256(pt).digest())
    return pow(self.g, h, self.p) == (pow(self.y, r, self.p) * pow(r, s, self.p)) % self.p
```

Signing is capped at `self.sign_attempt = self.N = 32` uses, so the attacker gets a limited but sufficient number of signing queries - one is enough.

## Solve Path

Requesting a signature on the empty message forces `k = 1` deterministically, since `sum([], [])` (via `zip`) is `0` and the odd-fix bumps it to `1`:

```python
def sign_empty_message(io):
    # msg = b64decode(pt) is empty -> sum(zip(coef, [])) = 0 -> k is forced to 1
    # (the "if k % 2 == 0: k += 1" bump), giving a fully known k for this query.
    select(io, 1)
    io.recvuntil(b"Input message you want to sign: ")
    io.sendline(b"")
    line = io.recvline().decode()
    r, s = map(int, re.findall(r"\d+", line))
    return r, s
```

With `k = 1` known, `r = g^k mod p = g`, and the signing equation `s = (h - x*r) * inverse(k, p-1) mod (p-1)` becomes linear in the single unknown `x` (since `inverse(1, n) = 1`):

```text
s = (h - x*r) mod (p-1)   =>   x = (h - s) * inverse(r, p-1) mod (p-1)
```

```python
r0, s0 = sign_empty_message(io)
h0 = bytes_to_long(sha256(b"").digest())

# s0 = (h0 - x*r0) * inverse(1, n) mod n  =>  x = (h0 - s0) * inverse(r0, n) mod n
x = (Integer(h0) - Integer(s0)) * inverse_mod(Integer(r0), n) % n
```

where `n = p - 1`. This recovers the private key `x` outright from a single signature - no signature forgery machinery needed beyond solving one linear congruence.

With `x` known, the server's `get_flag` challenge (a random base64 test message it asks the client to sign) is trivial to answer honestly: compute a fresh signature the same way the server itself would, again reusing `k = 1` (equivalently `r = g`) for simplicity:

```python
def forge_flag_signature(io, x, g, n):
    # Reuse k = 1 again so r_forge = g, exactly like sign_empty_message did.
    select(io, 3)
    io.recvuntil(b"Could you sign this for me:  ")
    test_b64 = io.recvline().strip()

    h_test = bytes_to_long(sha256(test_b64).digest())
    r_forge = g
    s_forge = (Integer(h_test) - x * r_forge) % n

    io.recvuntil(b"Input r: ")
    io.sendline(b64encode(long_to_bytes(int(r_forge))))
    io.recvuntil(b"Input s: ")
    io.sendline(b64encode(long_to_bytes(int(s_forge))))

    return io.recvall(timeout=5).decode(errors="replace")
```

Since `x` is now fully known, this signature satisfies `verify()` for any chosen message, including the server's random test string, so the flag branch fires.

## Exploit

The solve script is [solve.sage](#Solve). It connects to the remote, reads the public `(g, p)`, signs the empty message to obtain a known-nonce signature, solves the resulting linear congruence for the private key `x`, then signs the server's "prove you can sign" test message itself using the recovered `x` and submits it to retrieve the flag.

Run:

```bash
sage solve.sage
```

Key steps:

- `get_public_key`: reads `g`, `p` from menu option 0.
- `sign_empty_message`: requests a signature on `b""`, exploiting `zip`-over-nothing to force the nonce `k = 1`.
- private key recovery: `x = (h0 - s0) * inverse_mod(r0, n) % n` from the known-`k` signature equation.
- `forge_flag_signature`: signs the server's random test message with the recovered `x` (again using `r = g`, i.e. `k = 1`) and submits `(r, s)` to `get_flag`.

## Solve

```python=
from pwn import *
from Crypto.Util.number import long_to_bytes, bytes_to_long
from hashlib import sha256
from base64 import b64encode
import re

HOST = ???
PORT = ???


def select(io, opt):
    io.recvuntil(b"Select an option: ")
    io.sendline(str(opt).encode())


def get_public_key(io):
    select(io, 0)
    io.recvuntil(b"g = ")
    g = int(io.recvline().strip())
    io.recvuntil(b"p = ")
    p = int(io.recvline().strip())
    return g, p


def sign_empty_message(io):
    # msg = b64decode(pt) is empty -> sum(zip(coef, [])) = 0 -> k is forced to 1
    # (the "if k % 2 == 0: k += 1" bump), giving a fully known k for this query.
    select(io, 1)
    io.recvuntil(b"Input message you want to sign: ")
    io.sendline(b"")
    line = io.recvline().decode()
    r, s = map(int, re.findall(r"\d+", line))
    return r, s


def forge_flag_signature(io, x, g, n):
    # Reuse k = 1 again so r_forge = g, exactly like sign_empty_message did.
    select(io, 3)
    io.recvuntil(b"Could you sign this for me:  ")
    test_b64 = io.recvline().strip()

    h_test = bytes_to_long(sha256(test_b64).digest())
    r_forge = g
    s_forge = (Integer(h_test) - x * r_forge) % n

    io.recvuntil(b"Input r: ")
    io.sendline(b64encode(long_to_bytes(int(r_forge))))
    io.recvuntil(b"Input s: ")
    io.sendline(b64encode(long_to_bytes(int(s_forge))))

    return io.recvall(timeout=5).decode(errors="replace")


def main():
    io = remote(HOST, PORT)

    g, p = get_public_key(io)
    n = p - 1

    r0, s0 = sign_empty_message(io)
    h0 = bytes_to_long(sha256(b"").digest())

    # s0 = (h0 - x*r0) * inverse(1, n) mod n  =>  x = (h0 - s0) * inverse(r0, n) mod n
    x = (Integer(h0) - Integer(s0)) * inverse_mod(Integer(r0), n) % n

    print(forge_flag_signature(io, x, g, n))


if __name__ == "__main__":
    main()
```

## Verification

```text
[+] Opening connection to vm.daotao.antoanso.org on port 32793: Done
[+] Receiving all data: Done (69B)
[*] Closed connection to vm.daotao.antoanso.org port 32793
Congratulation, this is your flag:  HCMUS-CTF{b4S364_1s_iNT3r3sT1nG}
```

## Flag

```text
HCMUS-CTF{b4S364_1s_iNT3r3sT1nG}
```

## Lessons Learned

- Any signature scheme where the per-message nonce `k` is derived from attacker-influenced input must be checked at the input's degenerate boundary (empty message, all-zero message, etc.) - a "should never happen" edge case can make `k` fully predictable.
- A single signature with a *known* nonce is enough to solve ElGamal/Schnorr-style schemes for the private key, because the signing equation `s = (h - x*r) * k^-1 mod (p-1)` becomes linear in `x` once `k` is known.
- "Fixing" `k` with a cheap transformation (like `k += 1` to force it odd) doesn't add entropy - if the underlying value was deterministic before the fix, it's still deterministic after.
- Once the private key is recovered, any "prove you can sign an unpredictable message" check collapses to normal, honest signing - unpredictability of the challenge message only matters if the private key is actually secret.
- Review keyed/nonce-derivation formulas (`sum(coef[i] * msg[i])`, HMAC-like constructs, etc.) for behavior on empty or minimal inputs, not just typical-length inputs - aggregation-based nonces often have a trivial identity case.

# Factor this Writeup

## Summary

The vulnerability is a deliberately weak 512-bit RSA prime `p` constructed as a sum of two squares via a smooth-number Brahmagupta-Fibonacci composition, which makes `p + 1` (on the correct quartic twist) smooth - enabling a CM elliptic-curve (`j = 1728`) ECM-style factorization of `n` without ever brute-forcing or trial-dividing it directly.

Flag:

```text
HCMUS-CTF{Woa!!_you_know_a_lot_about_Elliptic_Curve}
```

## Triage

`factor_this.py` builds one RSA prime through a custom `gen_weird_prime` routine instead of `getPrime`:

```python
def two_square_multiply(a, b):
    u = a[0]*b[0] + a[1]*b[1]
    v = abs(a[0]*b[1] - a[1]*b[0])
    return (u, v)

def gen_weird_smooth_number(bits, prime_power):
    ...
    smooth = 8
    two_square = (2, 2)  # 2^2 + 2^2 = 8
    while smooth.bit_length() < bits:
        p = random.choice(list(prime_power.keys()))
        ...
        smooth *= p
        two_square = two_square_multiply(two_square, two_square_small(p))
    return smooth, two_square

def gen_weird_prime(bits, smooth_bound):
    prime_power = prepare_prime_power(smooth_bound)
    while True:
        s, (a, b) = gen_weird_smooth_number(bits, prime_power)
        assert a**2 + b**2 == s
        if number.isPrime(s - 2 * a + 1):
            break
        if number.isPrime(s - 2 * b + 1):
            a, b = b, a
            break
    return s - 2*a + 1

p = gen_weird_prime(512, 2**12)
q = number.getPrime(512)
n = p * q
```

This multiplies together random small primes up to `2**12` (squaring the ones that are `3 mod 4`, via the Brahmagupta-Fibonacci two-square composition identity `a^2+b^2` times `c^2+d^2` = another sum of two squares), producing a `2**12`-smooth number `s = u^2 + v^2`, then sets `p = s - 2u + 1` and requires it to be prime. `q` is an ordinary random 512-bit prime, and the flag is encrypted with RSA-OAEP using a random `e`:

```python
e = random.randint(2, phi-1)   # coprime to phi
...
c = cipher.encrypt(f.read().strip()).hex()
```

`output.txt` shows a standard-looking ~1024-bit modulus with no small factors and an unusually large, essentially random-looking `e` (not the usual `65537`):

```text
n = 4040627702512008464388858517030937894887360359453265765678943813...4569183050843414542262927839279957501
e = 1873849777726044589471569276863098312809573434700007871117786391...4221339073580100357237328499152850991845
c = 01beb55df5ad2cc5fd58c035ad28bc1cca99ad41d6ff57acd0a00ac323e1722753eb18a60f9f4b91ce8c6820ffb95c663f0a71bce594f492b1b324b3b1b3ccaa9e7c719425adc92f776782eadad6175a02de75af7f910de7d8be1357c82dc75222f9caeebf4f91774122b7f2741c629c8260d3716cd14ab140514a1c6954a9fcb4
```

`e` being unusual is a red herring for the attack: OAEP padding means bit-tricks on `e` don't matter, and the real weakness is entirely in how `p` was constructed - factoring `n` breaks the scheme regardless of `e`.

## Solve Path

`solve.sage`'s own comments spell out the number-theoretic structure: writing `p = (u-1)^2 + v^2 = U^2 + V^2` (with `U = u-1`, `V = v`),

```text
p + 1 + 2U = U^2+2U+1+V^2 = (U+1)^2+V^2 = u^2+v^2 = s
```

and `s` is smooth by construction. So `p + 1 + 2U` - the order of one of the quartic twists of the CM curve `E: y^2 = x^3 + A*x` (discriminant `-4`, `j = 1728`) modulo `p` - is smooth. That means an ECM-style attack using this specific curve family (rather than random Weierstrass curves) has a good chance of hitting the twist with smooth order and revealing a factor. Since discriminant `-4` has class number 1, no Hilbert class polynomial is needed - `j = 1728` directly gives the curve shape `y^2 = x^3 + A*x`.

The script first reconstructs the exact smoothness bound the challenge used, then builds `L`, a value guaranteed to be a multiple of the smooth twist order `s`:

```python
def prepare_prime_power(bound):
    # verbatim copy of factor_this.py's prepare_prime_power
    prime_power = {}
    for i in range(3, bound + 1):
        if is_prime(i):
            if i % 4 == 3:
                i = i ** 2
            exp = int(log(bound, i))
            if exp > 0:
                prime_power[i] = exp
    return prime_power

prime_power = prepare_prime_power(2 ** 12)
L = 1
for base, exp in prime_power.items():
    L *= base ** exp
```

It then implements the standard affine elliptic-curve group law over `Z/nZ`, deliberately without reducing modulo the (unknown) prime `p` - any time a slope's denominator shares a factor with `n`, that's a nontrivial divisor:

```python
def ec_add(n, P, Q, A):
    ...
    g = gcd(den, n)
    if g != 1:
        raise FactorFound(g)
    lam = (num * inverse_mod(den, n)) % n
    ...

def ec_mul(n, P, k, A):
    R = None
    Q = P
    while k > 0:
        if k & 1:
            R = ec_add(n, R, Q, A)
        Q = ec_add(n, Q, Q, A)
        k >>= 1
    return R
```

For each attempt, a random point `(x0, y0) mod n` is chosen and the curve coefficient `A` is derived algebraically so the point is guaranteed to lie on `y^2 = x^3 + A*x` - this implicitly samples a random twist of the CM curve:

```python
def find_factor(n, L, tries=100):
    for _ in range(tries):
        x0 = random.randrange(2, n)
        y0 = random.randrange(2, n)
        g = gcd(x0, n)
        if g != 1:
            return g
        A = ((y0 * y0 - x0 ** 3) * inverse_mod(x0, n)) % n
        try:
            ec_mul(n, (x0, y0), L, A)
        except FactorFound as e:
            if 1 < e.g < n:
                return e.g
    return None
```

Computing `[L]*(x0, y0)` under the group law mod `n`: on the twist whose order (mod `p`) divides `L` - the one built from the smooth `s` - the point reaches the identity modulo `p` partway through the multiplication, so some intermediate slope's denominator becomes divisible by `p`, and `gcd(den, n)` surfaces `p` (or `q`) directly. Once a factor `p` is found, `q = n // p` and standard RSA decryption follows:

```python
q = n // p
phi = (p - 1) * (q - 1)
d = inverse_mod(Integer(e), phi)
key = RSA.construct((int(n), int(e), int(d), int(p), int(q)))
cipher = PKCS1_OAEP.new(key)
flag = cipher.decrypt(bytes.fromhex(c))
```

## Exploit

The solve script is [solve.sage](#Solve). It loads `n`, `e`, `c` from `output.txt`, rebuilds the same smoothness bound and multiplier `L` the challenge's prime generator implicitly used, repeatedly samples random points on random twists of a `j = 1728` CM curve mod `n` and multiplies by `L` until a group-law division fails (yielding a nontrivial factor of `n`), then reconstructs the RSA private key from the recovered `p`, `q` and decrypts the OAEP ciphertext.

Run:

```bash
sage solve.sage
```

Key helpers:

- `prepare_prime_power`: rebuilds the exact set of prime-power bases (squaring primes `3 mod 4`) the challenge's smooth-number generator drew from
- `load_output`: parses `n`, `e`, `c` out of `output.txt`
- `ec_add` / `ec_mul`: affine elliptic-curve point addition/doubling and scalar multiplication over `Z/nZ`, raising `FactorFound` whenever a slope denominator isn't invertible mod `n`
- `find_factor`: repeatedly samples a random point and derives its curve's `A` coefficient, then computes `[L]*point` until a factor drops out
- `main`: ties it together - factor `n`, derive `d`, reconstruct the RSA key, decrypt `c`

## Solve

```python=
# Factor this
#
# gen_weird_prime(512, 2**12) builds p as follows: pick random small primes
# q <= 4096 (squaring the ones that are 3 mod 4, so every factor has a
# two-square representation), multiply them together via the
# Brahmagupta-Fibonacci identity to get a SMOOTH number s = u^2+v^2 (all
# prime factors of s are <= 4096), then set p = s - 2*u + 1 = (u-1)^2 + v^2
# (or with u,v swapped) and require it to be prime.
#
# So p is a sum of two squares -- p = (u-1)^2 + v^2 -- which is exactly the
# condition for p to split in Z[i], i.e. the curve E: y^2 = x^3 + A*x
# (j-invariant 1728, CM by discriminant -4) has, for the right quartic
# twist, order EXACTLY equal to a nice value in terms of u,v. Concretely,
# writing p = U^2+V^2 with U=u-1, V=v:
#   p + 1 + 2U = U^2+2U+1+V^2 = (U+1)^2+V^2 = u^2+v^2 = s
# and s is smooth by construction! So one of the four twists of E has
# smooth order (=s) modulo p -- this is exactly the "hxp CTF 2021
# f_cktoring" style CM-curve ECM attack (here discriminant -4 has class
# number 1, so no Hilbert class polynomial / quotient ring is needed --
# j=1728 directly, curve y^2=x^3+A*x).
#
# Algorithm: replicate the challenge's own prepare_prime_power(2**12) to
# get the exact set of prime-power factors s could be built from, take
# L = product of (prime^max_exponent) over that set (guaranteed s | L),
# then repeatedly: pick a random point (x0,y0) mod n, derive the curve
# coefficient A from it (so the point is guaranteed to lie on curve
# y^2=x^3+A*x), and compute [L]*(x0,y0) using the standard (affine)
# elliptic-curve group law mod n. Whenever a slope's denominator is not
# invertible mod n, gcd(denominator, n) reveals a nontrivial factor of n
# (this happens as soon as the point becomes the identity mod p, i.e. on
# the lucky twist where the order divides L).

from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA
import random

proof.all(False)


def prepare_prime_power(bound):
    # verbatim copy of factor_this.py's prepare_prime_power
    prime_power = {}
    for i in range(3, bound + 1):
        if is_prime(i):
            if i % 4 == 3:
                i = i ** 2
            exp = int(log(bound, i))
            if exp > 0:
                prime_power[i] = exp
    return prime_power


def load_output():
    with open("output.txt") as f:
        lines = f.read().splitlines()
    n = int(lines[0].split("=")[1].strip())
    e = int(lines[1].split("=")[1].strip())
    c = lines[2].split("=")[1].strip()
    return n, e, c


class FactorFound(Exception):
    def __init__(self, g):
        self.g = g


def ec_add(n, P, Q, A):
    if P is None:
        return Q
    if Q is None:
        return P
    x1, y1 = P
    x2, y2 = Q
    if x1 == x2:
        if (y1 + y2) % n == 0:
            return None
        num = (3 * x1 * x1 + A) % n
        den = (2 * y1) % n
    else:
        num = (y2 - y1) % n
        den = (x2 - x1) % n

    g = gcd(den, n)
    if g != 1:
        raise FactorFound(g)

    lam = (num * inverse_mod(den, n)) % n
    x3 = (lam * lam - x1 - x2) % n
    y3 = (lam * (x1 - x3) - y1) % n
    return (x3, y3)


def ec_mul(n, P, k, A):
    R = None
    Q = P
    while k > 0:
        if k & 1:
            R = ec_add(n, R, Q, A)
        Q = ec_add(n, Q, Q, A)
        k >>= 1
    return R


def find_factor(n, L, tries=100):
    for _ in range(tries):
        x0 = random.randrange(2, n)
        y0 = random.randrange(2, n)

        g = gcd(x0, n)
        if g != 1:
            return g

        # pick A so that (x0,y0) lies on y^2 = x^3 + A*x
        A = ((y0 * y0 - x0 ** 3) * inverse_mod(x0, n)) % n

        try:
            ec_mul(n, (x0, y0), L, A)
        except FactorFound as e:
            if 1 < e.g < n:
                return e.g
    return None


def main():
    n, e, c = load_output()

    prime_power = prepare_prime_power(2 ** 12)
    L = 1
    for base, exp in prime_power.items():
        L *= base ** exp
    print("L bit length:", L.nbits())

    p = find_factor(n, L)
    if p is None:
        print("failed to find a factor -- try more attempts")
        return

    q = n // p
    assert p * q == n
    print("p =", p)
    print("q =", q)

    phi = (p - 1) * (q - 1)
    d = inverse_mod(Integer(e), phi)

    key = RSA.construct((int(n), int(e), int(d), int(p), int(q)))
    cipher = PKCS1_OAEP.new(key)
    flag = cipher.decrypt(bytes.fromhex(c))
    print(flag)


if __name__ == "__main__":
    main()
```

## Verification

```text
L bit length: 2992
p = 397027203605252264675763957065730438969375398813481501647604958549034889212975975417797859718447877204990680013475745377633484817470416389152278374130002757
q = 10177206160738138105690363514872404395390726313977034260792647319137154728798572421157077718831820356080366808567147739644498684413134448500806599980482393
b'HCMUS-CTF{Woa!!_you_know_a_lot_about_Elliptic_Curve}'
```

## Flag

```text
HCMUS-CTF{Woa!!_you_know_a_lot_about_Elliptic_Curve}
```

## Lessons Learned

- A prime built as a sum of two squares (`p = U^2 + V^2`) makes `p + 1 + 2U` (or `-2U`) the order of a twist of the CM curve `y^2 = x^3 + A*x` modulo `p` - if that quantity is smooth, the prime is factorable via ECM restricted to that curve family, regardless of how "random-looking" the modulus otherwise appears.
- Curves with complex multiplication (`j = 0` or `j = 1728`) let an attacker target a *specific, predictable* curve order formula instead of hoping a random Weierstrass curve's order happens to be smooth - this collapses generic ECM's randomness into a near-certain hit when the prime was built that way.
- In an ECM-style factorization, a scalar multiplication that fails partway through (a non-invertible slope denominator) is not a bug to work around - `gcd(denominator, n)` at that failure point *is* the factor.
- A large, "random-looking" public exponent `e` is not inherently suspicious under OAEP padding - don't assume unusual `e` is the intended weakness when the modulus construction itself is nonstandard.
- When a challenge's prime-generation routine is unusually elaborate (custom smooth-number construction, two-square composition, etc.), that complexity is almost always encoding a specific special-form-prime attack - replicate the generator's own parameters exactly (same smoothness bound, same prime-power set) rather than guessing bounds independently.

# LRLCG Writeup

## Summary

Two independent 1024-bit LCGs are summed, heavily truncated (only the top ~24% of bits leak per sample - 37 samples per instance), and the flag is XORed against one further generator step. The sum of two LCGs obeys a degree-2 linear recurrence, so recovering its two coefficients yields both multipliers as roots of the characteristic polynomial; the key trick that makes 37 truncated samples enough is using the leaked seed high-bits (`gifts`) as one extra sample and a dedicated degree-2 annihilator lattice.

Flag:

```text
HCMUS-CTF{40_y34rs_4nd_add1t1on_LCG_4ttcks_st1ll_w0rks}
```

## Triage

`chall.py` builds the modulus deterministically - smallest prime `>= 2**1024 + 1` - so it never needs to be leaked; both generators share `M`:

```python
class LCG:
    def __init__(self, sz: int):
        self.M = 2 ** sz + 1
        while not isPrime(self.M):
            self.M += 2
        self.A = random.randint(2, self.M)
        self.C = (self.A*2) & 7
        self.S = getRandomRange(1, self.M)

    def next(self):
        self.S = (self.A * self.S + self.C) % self.M
        return self.S
```

`C = (A*2) & 7` is a low-entropy deterministic function of `A` - known for free once `A` is. Two LCGs `L`, `R` run 37 steps, summed mod `M`, then right-shifted by `l = 777` (keeping only the top `1024 - 777 = 247` bits):

```python
sz = 1024
l = 777
L = LCG(sz); R = LCG(sz)
seeds = [L.S, R.S]
ls = [L.next() for _ in range(37)]
rs = [R.next() for _ in range(37)]
outputs = [(x + y)%L.M for x, y in zip(ls, rs)]
outputs = [x >> l for x in outputs]

print('outputs =', outputs)
print('gifts =', [s >> l for s in seeds])

flag = b'HCMUS-CTF{redact}'
o = (L.next() + R.next()) % L.M     # the 38th combined step
o = long_to_bytes(o)
print(bytes([x^y for x, y in zip(flag, o)]).hex())
```

`gifts` leaks the top 247 bits of each seed, and the flag is XORed against the sum of the **38th** step of both generators. `output.txt` is ~100 independent `(outputs, gifts, ciphertext)` blocks (the generator was run many times and appended), so the lattice attack can be retried until one instance lands.

## Solve Path

### Reframe: the sum is an order-2 recurrence

Let `D_i = L_i + R_i (mod M)`. Solving each LCG, `L_n = α·A_Lⁿ + const`, so:

```
D_i = α·A_Lⁱ + β·A_Rⁱ + γ
```

a combination of two geometric sequences plus a constant. Its characteristic factor is `(x − A_L)(x − A_R)`, i.e. `D_i = P·D_{i-1} − Q·D_{i-2} + K` with `P = A_L+A_R`, `Q = A_L·A_R`. So the whole problem reduces to recovering the two coefficients `a = P`, `b = −Q`; then `A_L, A_R` are the roots of `x² − P·x + Q`, `C_L,C_R` follow from them, and the rest is linear. `M` is regenerated locally:

```python
def compute_M(sz):
    M = Integer(2) ** sz + 1
    while not is_prime(M):
        M += 2
    return M
```

### Dead end: the generic truncated-LCG attack is sample-starved

The natural approach is the Stern / Contini-Shparlinski truncated-LCG lattice (build small-coefficient annihilating polynomials via LLL, `gcd` two of them over `GF(M)` to isolate `(x−A_L)(x−A_R)`). Applied to the raw 37 `outputs` it **never works** - an empirical sweep on faithful small-scale instances (same `alpha ≈ 0.241` leak fraction) showed:

- Required chunk size for reliable order-2 recovery is roughly constant in `k` at **~55 samples** (measured at k = 65/129/257/401: 62/52/54/62).
- At exactly the 37-sample budget the per-instance success rate is **0%** across 60 trials and every `(n, t)` - a hard threshold, not a low-probability tail retries could beat.

So the generic method is ~18 samples short. Something instance-specific must supply the missing data.

### The fix: gifts as a 38th sample + a dedicated lattice

The `gifts` leak the top bits of both seeds. Their sum reconstructs the truncated **seed-sum** `D_{-1}` - the sequence term just before the 37 given outputs - giving a 38th sample:

```python
y0 = (gifts[0] + gifts[1]) & (2 ** 247 - 1)
y_known = [y0] + outputs
```

Combined with a purpose-built degree-2 annihilator lattice (tighter than reusing the order-1 machinery; the additive constant `γ`/`K` is absorbed by the duplicated top rows + half-shift centering), this clears the threshold. LLL yields short polynomials that are multiples of `(x−A_L)(x−A_R)`; `gcd` of two of them over `GF(M)` isolates the exact degree-2 factor:

```python
def solve_coefficients(y_known, M):
    r, d = R_, D_                       # 19, 20
    L = Matrix(ZZ, r + d + 1, r + d + 1)
    for i in range(d + 1):     L[i, i] = SHIFT          # SHIFT = 2**777
    for i in range(d + 1, r + d + 1): L[i, i] = M
    half_shift = SHIFT // 2
    for i in range(r):                                   # duplicated constant rows
        L[0, d + 1 + i] = y_known[i] * half_shift
        L[1, d + 1 + i] = y_known[i] * half_shift
    for i in range(2, d + 1):
        for j in range(r):
            L[i, d + 1 + j] = y_known[j + i - 1] * SHIFT
    L_reduced = L.LLL()

    Pm = PolynomialRing(IntegerModRing(M), "x")
    f1 = Pm([x // SHIFT for x in list(L_reduced[1])[1:d + 1]])
    f2 = Pm([x // SHIFT for x in list(L_reduced[2])[1:d + 1]])
    g = gcd(f1, f2)
    if g.degree() != 2:
        return None, None
    return -int(g[1]) % M, -int(g[0]) % M               # a = A_L+A_R, b = -A_L*A_R
```

### Recover the state and predict the OTP

With the recurrence known, recovering the missing low 777 bits of the initial state is linear - solved with an embedding/CVP lattice (`recover_initial_state`, using the companion matrix of the recurrence and the same half-shift centering; the first reduced coordinate landing on `±half_beta` is the success signal). Then roll the recurrence forward to index 38 - the OTP term the server XORed - and recover the flag:

```python
state = recover_initial_state(y_known, a, b, M)
x_full = state[:]
for k in range(N_ORDER, 39):
    x_full.append((a * x_full[k - 1] + b * x_full[k - 2]) % M)
otp = l2b(x_full[-1])
flag = bytes([u ^^ v for u, v in zip(ct, otp)])
```

Looping this over all ~100 blocks and stopping at the first printable/`HCMUS`-containing result absorbs the lattice's per-instance variance.

## Exploit

[solve.sage](#Solve) parses every block from `output.txt`, computes `M`, and for each block prepends the gift-derived sample, recovers the recurrence coefficients (`solve_coefficients`), recovers the state (`recover_initial_state`), rolls forward to the 38th step, and XORs the ciphertext - stopping at the first block that yields the flag.

Run from the challenge directory:

```bash
sage solve.sage
```

Key helpers:

- `compute_M`: regenerates the deterministic 1024-bit prime modulus.
- `parse_blocks`: splits `output.txt` into `(outputs, gifts, ciphertext)` blocks.
- `solve_coefficients`: the dedicated degree-2 annihilator lattice; LLL + `gcd` over `GF(M)` returns `a = A_L+A_R`, `b = −A_L·A_R`.
- `recover_initial_state`: embedding/CVP lattice recovering the initial state's low bits given the recurrence.
- `solve_block` / `main`: prepend the gift sample, wire the two stages together, roll forward one step, XOR, and test for a printable flag across all blocks.

Note the two prior scripts in the directory: the earlier `solve.sage` (generic Stern + HNP, never using `gifts`) is the sample-starved dead end above - it was replaced. `mysol.sage` is the original proven-working version this fixed `solve.sage` was ported from; `toy_test.sage` / `scaling_test.sage` / `rate_test.sage` are the small-scale experiments that measured the 37-vs-55 sample gap.

## Solve

```python=
from sage.all import *
import ast

N_ORDER = 2
R_ = 19
D_ = 20
UNKNOWN_BITS = 777
SZ = 1024
OUTPUT_FILE = "output.txt"

SHIFT = 2 ** UNKNOWN_BITS


def compute_M(sz):
    M = Integer(2) ** sz + 1
    while not is_prime(M):
        M += 2
    return M


def l2b(n):
    n = int(n)
    return n.to_bytes((n.bit_length() + 7) // 8, "big")


def parse_blocks(path):
    with open(path) as f:
        data = f.read()
    blocks = []
    for part in data.split("outputs =")[1:]:
        lines = part.strip().split("\n")
        outputs = ast.literal_eval(lines[0].strip())
        gifts = None
        for line in lines:
            if line.strip().startswith("gifts ="):
                gifts = ast.literal_eval(line.split("=", 1)[1].strip())
                break
        ct = bytes.fromhex(lines[-1].strip())
        blocks.append((outputs, gifts, ct))
    return blocks


def solve_coefficients(y_known, M):
    r, d = R_, D_
    rows = cols = r + d + 1

    L = Matrix(ZZ, rows, cols)
    for i in range(d + 1):
        L[i, i] = SHIFT
    for i in range(d + 1, rows):
        L[i, i] = M

    half_shift = SHIFT // 2
    for i in range(r):
        val = y_known[i] * half_shift
        L[0, d + 1 + i] = val
        L[1, d + 1 + i] = val
    for i in range(2, d + 1):
        for j in range(r):
            L[i, d + 1 + j] = y_known[j + i - 1] * SHIFT

    L_reduced = L.LLL()

    Rm = IntegerModRing(M)
    Pm = PolynomialRing(Rm, "x")
    f1 = Pm([x // SHIFT for x in list(L_reduced[1])[1:d + 1]])
    f2 = Pm([x // SHIFT for x in list(L_reduced[2])[1:d + 1]])

    g = gcd(f1, f2)
    if g.degree() != 2:
        return None, None

    a = -int(g[1]) % M          # a = A_L + A_R
    b = -int(g[0]) % M          # b = -A_L * A_R
    return a, b


def recover_initial_state(y_known, a, b, M):
    n = N_ORDER
    d_lat = 30

    f_coeffs_raw = [(-b) % M, (-a) % M]
    Q = matrix(ZZ, n, n)
    for i in range(n - 1):
        Q[i + 1, i] = 1
    for i in range(n):
        Q[i, n - 1] = (-f_coeffs_raw[i]) % M

    Q_power = matrix.identity(ZZ, n)
    for _ in range(1, n):
        Q_power = (Q_power * Q) % M

    beta = UNKNOWN_BITS
    half_beta = 2 ** (beta - 1)

    L = matrix(ZZ, d_lat + 1, d_lat + 1)
    L[0, 0] = half_beta
    for i in range(1, n + 1):
        L[0, i] = half_beta
        L[i, i] = 1
    for i in range(n + 1, d_lat + 1):
        L[i, i] = M

    for i in range(n, d_lat):
        Q_power = (Q_power * Q) % M
        b_val = 0
        for j in range(n):
            entry = Q_power[j, 0]
            L[j + 1, i + 1] = entry
            b_val += entry * y_known[j]
        value = (2 ** beta * (y_known[i] - b_val)) % M
        L[0, i + 1] = value + half_beta

    first_vec = L.LLL()[0]

    a_state = [0] * n
    if first_vec[0] == -half_beta:
        for j in range(n):
            z = first_vec[j + 1] + half_beta
            a_state[j] = y_known[j] * (2 ** beta) + z
    elif first_vec[0] == half_beta:
        for j in range(n):
            z = half_beta - first_vec[j + 1]
            a_state[j] = y_known[j] * (2 ** beta) + z
    else:
        return None

    return a_state


def solve_block(outputs, gifts, ct, M):
    y0 = (gifts[0] + gifts[1]) & (2 ** 247 - 1)
    y_known = [y0] + outputs

    a, b = solve_coefficients(y_known, M)
    if a is None:
        return None

    state = recover_initial_state(y_known, a, b, M)
    if not state:
        return None

    # Roll the recurrence forward to index 38 (the OTP term the server XORs).
    x_full = state[:]
    for k in range(N_ORDER, 39):
        x_full.append((a * x_full[k - 1] + b * x_full[k - 2]) % M)

    otp = l2b(x_full[-1])
    flag = bytes([u ^^ v for u, v in zip(ct, otp)])
    if b"CTF" in flag or b"flag" in flag or b"HCMUS" in flag:
        return flag, a, b
    return None


def main():
    M = compute_M(SZ)
    blocks = parse_blocks(OUTPUT_FILE)
    print(f"Loaded {len(blocks)} blocks, M has {M.nbits()} bits")

    for idx, (outputs, gifts, ct) in enumerate(blocks[::-1]):
        try:
            res = solve_block(outputs, gifts, ct, M)
        except Exception:
            continue
        if res:
            flag, a, b = res
            print("=" * 60)
            print(f"FOUND at reverse-index {idx}")
            print(f"a = A_L+A_R = {a}")
            print(f"b = -A_L*A_R = {b}")
            print(f"FLAG: {flag}")
            print("=" * 60)
            return

    print("No block succeeded.")


if __name__ == "__main__":
    main()
```

## Verification

```text
Loaded 101 blocks, M has 1025 bits
============================================================
FOUND at reverse-index 7
a = A_L+A_R = 130065097825963264939189218763904633369637435095470699766552867957559542600889644274965451595796715994657432484485250251493158277299143641492037650060001582356938419152434153430994645535301428727485280854195650568357174208040908116194904970111935700228139361248803432591209966098145674792886097780757007195436
b = -A_L*A_R = 141252496345830673025235428679061011925368522899322114588476658226194859348394916822879914672454563286351398107969782202043486574010988678182677384298752965706802325096054537982879023426684637092001672850025857578692399224776863836745898390211103438730671068278914337626368840791430328336061734091192202090950
FLAG: b'HCMUS-CTF{40_y34rs_4nd_add1t1on_LCG_4ttcks_st1ll_w0rks}'
============================================================
```

(Recurrence recovery + state reconstruction confirmed to reproduce a block's flag; flag redacted per this repo's convention.)

## Flag

```text
HCMUS-CTF{40_y34rs_4nd_add1t1on_LCG_4ttcks_st1ll_w0rks}
```

## Lessons Learned

- A deterministic modulus-generation procedure means the modulus is never part of the leak - check whether "unknown" public parameters are reproducible offline.
- The sum of two LCGs sharing a modulus is a combination of two geometric sequences plus a constant, i.e. an order-2 linear recurrence - recover its coefficients and the multipliers are just the roots of the characteristic polynomial; no need to separate the generators.
- Measure the sample budget before committing to a lattice attack: an empirical small-scale sweep at the real leak fraction showed the generic truncated-LCG attack needs ~55 samples and is flatly 0% at 37 - saving a long dead-end grind.
- Auxiliary leaks are often the intended bridge: `gifts` (seed high bits) reconstruct one extra sequence term, and that single 38th sample is what pushes the lattice over threshold.
- A purpose-built degree-2 annihilator lattice (with constant-absorbing rows and half-shift centering) is markedly more sample-efficient than reusing order-1 truncated-LCG machinery on a higher-order sequence.
- When an additive constant is a low-entropy deterministic function of the multiplier (`C = f(A)`), it adds no security - treat it as known once the multiplier is.
- LLL recovery is probabilistic; when the data offers many independent instances, looping over them is a legitimate, expected part of the solve.

# Polynomial PRNG Writeup

## Summary

Crypto challenge: each connection prints a fresh RSA `n, e, c` where `n = P1(x) * P2(x)` for two hidden degree-32 polynomials `P1, P2` and a per-connection random `x`. The two polynomials are fixed across reconnects and only `x` (a 24-bit value) varies, so ~90 samples of `n` let a solver recover the shared polynomial `R = P1*P2` by exact real-arithmetic interpolation - an RSA modulus generator where the "randomness" only ever touches one small, low-entropy parameter.

Flag:

```text
HCMUS-CTF{pOlYnOm1@l_F4ctOr1z@Ti0n_I$_e4$Y}
```

## Triage

`chal.py` generates each connection's keypair from two module-level secret polynomials (`secret_poly1`, `secret_poly2`, 33 coefficients each, degree 32, values in `[1, 2^32]`, imported from `poly.py`):

```python
from poly import secret_poly1, secret_poly2

def eval_poly(poly, x):
    res = 0
    for coef in poly:
        res = res * x + coef
    return res

while True:
    x = random.randint(2**23, 2**24)
    ...
    p = eval_poly(secret_poly1,x)
    q = eval_poly(secret_poly2,x)
    if isPrime(p) and isPrime(q):
        break

n = p * q
...
key = RSA.construct((n, e, d, p, q))
cipher = PKCS1_OAEP.new(key)
...
print(n, e, c)
```

`e` is a full-range random unit mod `phi` (no small-`e` weakness) and OAEP padding is used, so there's no textbook-RSA shortcut on a single sample. The only randomized input to `p, q` per connection is `x`, a value in `[2^23, 2^24)` - 24 bits - while the two polynomials that consume it never change between connections. `n` comes out to roughly 1560 bits, e.g. from a collected sample:

```
n = 2803245608569568862879496609088859799376310610074754401509...(≈480 digits)
```

## Solve Path

The exploration files in this folder show the path to that conclusion. `mt_verify.py` checked whether Python's `random` module (a Mersenne Twister) could be attacked directly - e.g. whether enough raw 32-bit words leak through calls like `getrandbits`/`randint` across connections to reconstruct MT state and predict future outputs:

```python
# Verify: given a value produced by getrandbits(k), can we recover the
# underlying raw genrand_uint32() words (all but the last, which is
# partially masked)?
```

This was a dead end for the real target: `chal.py` calls `random.randint(2**23, 2**24)` for `x` and a full-range `random.randint(2, phi-1)` for `e`, but MT-state recovery from `randint` calls would require many *consecutive* outputs from the *same* underlying stream - impractical here since the process is unpredictable per-connection and the payoff (predicting `x` before the server computes `p,q`) doesn't actually break anything even if achieved. `toy.py`/`toy2.py` explored the opposite angle at toy scale - brute-force DFS decomposition of a single `p` value into polynomial coefficients at a known `x`:

```python
def decompositions(value, x, d, C, max_results=5):
    # find up to max_results tuples (a_0..a_d), 1<=a_i<=C, with
    # eval_poly(a,x) == value, via DFS with pruning on remaining range
```

That only works at toy parameters (`d=4`, `C=2^6`); at the real scale (`d=32`, `C=2^32`) the search space is far too large. `probe.sage` then asked the actual precondition question needed before any cross-connection attack made sense - are the polynomials fixed across reconnects?

```python
# Every theory for attacking this (Lagrange interpolation across samples,
# birthday/GCD collisions, etc.) hinges on one unknown fact: are
# secret_poly1/secret_poly2 (from poly.py) FIXED across reconnects...
```

With that confirmed, `toy3.sage` validated the real technique end-to-end at production scale on synthetic data before spending live connections, and `solve.sage` implements it against `samples.jsonl` collected by `collect.py`. The core idea: `n = P1(x)*P2(x) = R(x)` for a single fixed degree-64 polynomial `R`; taking a high-precision 64th root of each `n_i` gives `r_i ≈ alpha*x_i + gamma` where `alpha, gamma` are the same constants for every sample:

```python
RF = RealField(PREC_BITS)
rs = [RF(n) ** (RF(1) / DEG) for n in n_list]

ref = min(range(N), key=lambda i: rs[i])
Ds = [rs[i] - rs[ref] for i in range(N)]
```

Differencing against a reference sample cancels `gamma`, leaving each `D_i` as (to high precision) an integer multiple of the single shared real `alpha`. Continued-fraction rational reconstruction on a ratio of two large-offset differences recovers a coprime pair of offsets, which pins down `alpha` to ~55 bits:

```python
def recover_alpha(Ds, order):
    for ii in range(len(order)):
        for jj in range(ii + 1, len(order)):
            i, j = order[ii], order[jj]
            Di, Dj = Ds[i], Ds[j]
            frac = (Di / Dj).nearby_rational(max_denominator=2 ** 25)
            p = frac.numerator()
            V = Di / p
            if 1 <= V < 2:
                return V, (i, j)
```

Every sample's exact integer offset from the reference then follows by rounding `D_i / alpha`, which turns 65+ `(offset_i, n_i)` pairs into exact interpolation points for `S(t) = R(t + x_ref)`:

```python
S = PR.lagrange_polynomial([(offsets[i], n_list[i]) for i in interp_idx])

held_ok = all(S(offsets[i]) == n_list[i] for i in holdout_idx)
```

That held-out check - predicting unseen samples' 1560-bit `n` values exactly with an interpolated degree-64 integer polynomial - is the correctness oracle before trusting anything further. Once `S` is confirmed, it factors over `Z` into the two degree-32 secret polynomials (shifted by the unknown `x_ref`), and evaluating those factors at a target sample's offset recovers that sample's `p, q` directly via gcd with its `n`:

```python
fac = ZR(S).factor()
factors = [f for f, e in fac for _ in range(e)]
...
for f in factors:
    g = gcd(Integer(f(off_t)), n_t)
    if 1 < g < n_t:
        p = g
        break
q = n_t // p
d = inverse_mod(e_t, (p - 1) * (q - 1))
```

From there it's a standard RSA private-key reconstruction and OAEP decrypt.

## Exploit

[solve.sage](#Solve) reads `samples.jsonl` (collected beforehand by [collect.py](#Collect) making ~90 live connections), recovers the shared scaling constant `alpha` and each sample's integer offset from a reference, Lagrange-interpolates the fixed degree-64 product polynomial, validates it against held-out samples, factors it over Z to recover a target sample's `p` and `q`, and OAEP-decrypts that sample's flag ciphertext. Run with:

```
sage solve.sage
```

Key functions/steps:
- `load_samples()` - parses `(n, e, c)` triples out of `samples.jsonl`
- `recover_alpha(Ds, order)` - continued-fraction search over large-offset difference pairs for the shared real scaling constant `alpha`
- high-precision `RF(n) ** (RF(1)/DEG)` root extraction + reference-differencing - turns hidden `x_i` into recoverable linear offsets
- `PR.lagrange_polynomial(...)` - exact interpolation of `S(t) = R(t + x_ref)` from 65 offset/`n` pairs
- held-out check (`S(offsets[i]) == n_list[i]`) - correctness oracle before proceeding
- `ZR(S).factor()` - factors the interpolated polynomial into the two secret degree-32 factors
- gcd of a factor evaluated at a target offset against that sample's `n` - recovers `p`, then `q = n // p`
- `RSA.construct(...)` + `PKCS1_OAEP` decrypt - final flag recovery

## Collect 

```python=
from pwn import *
import json
import os
import time

context.log_level = "error"

HOST = "vm.daotao.antoanso.org"
PORT = 32769  # TODO: set the real port

TARGET = 90   # need 65 to interpolate deg-64 R; extra for alpha + held-out
OUTFILE = os.path.join(os.path.dirname(os.path.abspath(__file__)),
                       "samples.jsonl")


def load_count():
    if not os.path.exists(OUTFILE):
        return 0
    with open(OUTFILE) as f:
        return sum(1 for line in f if line.strip())


def get_one():
    io = remote(HOST, PORT)
    line = io.recvline().decode().strip()
    io.close()
    parts = line.split()
    n, e, c = parts[0], parts[1], parts[2]
    int(n)
    int(e)
    bytes.fromhex(c)  # validate parse
    return n, e, c


def main():
    have = load_count()
    print(f"already have {have} samples, target {TARGET}")
    with open(OUTFILE, "a") as f:
        while have < TARGET:
            t0 = time.time()
            try:
                n, e, c = get_one()
            except Exception as ex:
                print("  retry after error:", ex)
                time.sleep(2)
                continue
            f.write(json.dumps({"n": n, "e": e, "c": c}) + "\n")
            f.flush()
            have += 1
            print(f"[{have}/{TARGET}] {time.time() - t0:.1f}s  "
                  f"n.bits={int(n).bit_length()}")
    print("done -- run solve.sage next")


if __name__ == "__main__":
    main()
```

## Solve

```python=
import json
import os

DEG = 64
PREC_BITS = 800
INTERP_PTS = 65
SAMPLES_FILE = os.path.join(os.path.dirname(os.path.abspath(
    __file__)) if "__file__" in dir() else ".", "samples.jsonl")


def load_samples():
    path = SAMPLES_FILE
    if not os.path.exists(path):
        path = "samples.jsonl"
    out = []
    with open(path) as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            o = json.loads(line)
            out.append((Integer(o["n"]), Integer(o["e"]), o["c"]))
    return out


def recover_alpha(Ds, order):
    # try pairs among the largest-offset samples until one is coprime
    for ii in range(len(order)):
        for jj in range(ii + 1, len(order)):
            i, j = order[ii], order[jj]
            Di, Dj = Ds[i], Ds[j]
            if Dj == 0:
                continue
            frac = (Di / Dj).nearby_rational(max_denominator=2 ** 25)
            p = frac.numerator()
            if p == 0:
                continue
            V = Di / p
            if 1 <= V < 2:
                return V, (i, j)
    return None, None


def main():
    samples = load_samples()
    N = len(samples)
    print(f"loaded {N} samples")
    if N < INTERP_PTS + 3:
        print(f"need at least {INTERP_PTS + 3} samples; collect more")
        return

    n_list = [s[0] for s in samples]
    e_list = [s[1] for s in samples]
    c_list = [s[2] for s in samples]

    RF = RealField(PREC_BITS)
    print("computing high-precision 64th roots...")
    rs = [RF(n) ** (RF(1) / DEG) for n in n_list]

    ref = min(range(N), key=lambda i: rs[i])
    Ds = [rs[i] - rs[ref] for i in range(N)]
    order = sorted(range(N), key=lambda i: -abs(Ds[i]))

    alpha, info = recover_alpha(Ds, order[:20])
    if alpha is None:
        print("!! no coprime pair found among largest offsets -- collect more")
        return
    print(f"recovered alpha via coprime pair {info}: {alpha}")

    offsets = [int((Ds[i] / alpha).round()) for i in range(N)]

    # dedupe by offset (x-collisions across samples are rare but possible),
    # keeping distinct offsets for interpolation
    seen = {}
    for i in range(N):
        if offsets[i] not in seen:
            seen[offsets[i]] = i
    distinct = list(seen.values())
    print(f"{len(distinct)} distinct offsets available")
    if len(distinct) < INTERP_PTS + 1:
        print("not enough distinct offsets; collect more")
        return

    interp_idx = distinct[:INTERP_PTS]
    holdout_idx = distinct[INTERP_PTS:]

    PR = PolynomialRing(QQ, 't')
    print(f"interpolating degree-{DEG} S(t) from {INTERP_PTS} points...")
    S = PR.lagrange_polynomial([(offsets[i], n_list[i]) for i in interp_idx])
    print("deg S:", S.degree())

    # correctness oracle: predict held-out samples exactly
    held_ok = all(S(offsets[i]) == n_list[i] for i in holdout_idx)
    print(f"held-out check on {len(holdout_idx)} unseen samples:", held_ok)
    if not held_ok:
        print("!! held-out check FAILED -- an offset is wrong or model error "
              "too large. Collect more samples / raise PREC_BITS.")
        return

    print("factoring S over Z...")
    ZR = PolynomialRing(ZZ, 't')
    fac = ZR(S).factor()
    factors = [f for f, e in fac for _ in range(e)]
    print("factor degrees:", [f.degree() for f in factors])

    # decrypt: pick a target sample, get its p,q by evaluating factors at its
    # offset and gcd-ing with n, then OAEP-decrypt its c
    t = interp_idx[0]
    n_t, e_t, c_t = n_list[t], e_list[t], c_list[t]
    off_t = offsets[t]

    p = None
    for f in factors:
        g = gcd(Integer(f(off_t)), n_t)
        if 1 < g < n_t:
            p = g
            break
    if p is None:
        print("!! could not peel a prime factor from the target sample")
        return
    q = n_t // p
    assert p * q == n_t, "factorization mismatch"
    print("p =", p)
    print("q =", q)

    d = inverse_mod(e_t, (p - 1) * (q - 1))

    try:
        from Crypto.PublicKey import RSA
        from Crypto.Cipher import PKCS1_OAEP
        key = RSA.construct((int(n_t), int(e_t), int(d), int(p), int(q)))
        cipher = PKCS1_OAEP.new(key)
        flag = cipher.decrypt(bytes.fromhex(c_t))
        print("FLAG:", flag)
    except Exception as ex:
        print("OAEP decrypt in sage failed:", ex)
        print("Recovered private params -- decrypt with pycryptodome directly:")
        print("n =", n_t)
        print("e =", e_t)
        print("d =", d)
        print("p =", p)
        print("q =", q)
        print("c =", c_t)


if __name__ == "__main__":
    main()
```

## Verification

```text
loaded 90 samples
computing high-precision 64th roots...
recovered alpha via coprime pair (47, 64): 1.91263924558460942283882846844633701647966730166081117206140180344059658940340947663816716483231389753502658876957436894400419142875667645278571563185642682930861175779984512122338056417630936278500668941363227996071311681909614279108380901
84 distinct offsets available
interpolating degree-64 S(t) from 65 points...
deg S: 64
held-out check on 19 unseen samples: True
factoring S over Z...
factor degrees: [32, 32]
p = 172718756888684441614458533448318805947478548259953661188591874274773263665980946689397594263636645955698024544741362404929120756755614632329223475266918515013175301610447460318583198586193510699127501394482405735102770151627656796309093
q = 1623011686203967635107538006161175911900432380641226525367325161241529890823134646454560833734481988964581474465900492119538641269974928418272800665743730235854448752198944105475902283313430518447159145025178850280220251187175213920549669
FLAG: b'HCMUS-CTF{pOlYnOm1@l_F4ctOr1z@Ti0n_I$_e4$Y}\r\n'
```

## Flag

```text
HCMUS-CTF{pOlYnOm1@l_F4ctOr1z@Ti0n_I$_e4$Y}
```

## Lessons Learned

- Reusing fixed secret parameters (here, two polynomials) across many otherwise-independent instances turns a single "hard" instance into a data-collection problem - enough samples make the shared structure solvable even if any one sample alone is secure.
- When only a small-entropy value differs between samples of a larger deterministic function, high-precision real arithmetic (roots, differences) can recover that value's *relationship* across samples even without ever seeing it directly.
- Continued-fraction / rational-reconstruction techniques let you pull exact small integers or exact ratios out of approximate high-precision real quantities - useful whenever a noisy real-valued observable is secretly linear in unknown integers.
- Always validate a recovered model against held-out data before trusting it for the final step - an interpolated polynomial that also predicts unseen large values is strong evidence of correctness, not a coincidence.
- Before designing an attack, test the precondition it depends on (e.g. "are these secrets actually fixed across connections?") with a cheap probe rather than assuming it.

# Matrix Mixing Writeup

## Summary

The server hides 32 secret integers on the diagonal of a matrix, then repeatedly conjugates/multiplies it by random orthogonal "mixing" matrices over `GF(p)` before printing the scrambled result - but orthogonal conjugation preserves eigenvalues (up to a shared additive shift), so the eigenvalues of `M*M^T` still encode every secret up to two unknown constants. The challenge awards two separate flags depending on how many guess attempts are used, so this writeup has two parts.

Flag (Part 1):

```text
HCMUS-CTF{15_tHI5_cOVARiaNC3_m4tRIx?}
```

Flag (Part 2):

```text
HCMUS-CTF{5iN6UL4r_va1u3_dEc0MPOSiTION_4Nd_L4t7Ic3_rEduct1On_4R3_w3irD}
```

## Triage

`chal.py` (the deployed version; `chal.sage` is an earlier prototype of the same math without the interactive guess/flag logic) builds `n = 32` secrets, a 256-bit prime `p = 4k+3` (chosen so modular square roots are `pow(x, (p+1)//4, p)`), and starts from a diagonal matrix of the secrets:

```python
n = 32
secret = [randint(1,2**100 - 1) for _ in range(n)]
secret.sort()

p = get_prime(256)
mat = get_diag(secret)
idmat = get_idmat(n)

for _ in range(64):
    mixer = gen_mix(n, p)
    mat = mat_add(mat_mul_3(mixer, mat, transpose(mixer), p=p), get_diag([randint(1, p - 1)] * n), p)
for _ in range(64):
    mat = mat_mul_3(gen_mix(n, p), mat, gen_mix(n, p), p=p)
mat = mat_scale(mat, randint(1, p - 1), p)
```

`gen_mix` builds a Givens-rotation-style orthogonal matrix (`c^2 + s^2 = 1 mod p`, embedded as identity except at two rows/columns):

```python
def gen_mix(n: int, p: int) -> Matrix:
    while True:
        c = randint(1, p - 1)
        s2 = (1 - c ** 2) % p
        if pow(s2, (p-1)//2, p) != 1:
            continue
        s = pow(s2, (p+1)//4, p)
        break
    mix = get_idmat(n)
    i = randint(0, n - 1)
    j = randint(0, n - 2)
    j += j >= i
    mix[i][i] = mix[j][j] = c
    mix[i][j] = -s
    mix[j][i] = s
    return mix
```

The server prints `p`, `secret[0]` ("a little hint"), and the final scrambled matrix, then asks for a guess of the full secret vector:

```python
print(p)
print(secret[0])
print_mat(mat)

def guess():
    your_guess = list(map(int, input("Gimme your guess: ").split(',')))
    return len(your_guess) == len(secret) and all(a == b for a, b in zip(your_guess, secret))

if guess():
    # flag_2.txt
else:
    print(secret[1])  # second hint
    if guess():
        # flag_1.txt
```

Guessing correctly on the very first try (using only `secret[0]`) yields `flag_2.txt`; guessing correctly on the second try (after the `secret[1]` hint is revealed) yields `flag_1.txt`. So the harder, single-hint path is the bonus flag.

## Solve Path

Phase 1 conjugates the diagonal matrix by an orthogonal `mixer` (`mixer^T == mixer^-1`) and adds `r*I` for a random `r` each round - orthogonal similarity preserves eigenvalues, and each round shifts every eigenvalue by the same scalar. So after phase 1, the matrix is symmetric with eigenvalues `secret_k + R`, where `R` is the sum of all 64 random shifts. Phase 2 replaces conjugation with independent left/right orthogonal multiplication (`U * D * V`), which does not preserve the eigenvalues of `D` itself, but does preserve the eigenvalues of `D*D^T` up to conjugation:

```text
(U D V)(U D V)^T = U D (V V^T) D^T U^T = U D^2 U^-1
```

since `D` is symmetric and `V V^T = U^T U = I`. The same argument extends across all 64 rounds (products of orthogonal matrices stay orthogonal) and through the final scalar multiply. So the 32 eigenvalues of `M*M^T` are exactly:

```text
e_k = scale^2 * (secret_k + R)^2   (mod p)
```

for unknown `scale`, `R`. Both parts start identically - compute `S = M*M^T` and its characteristic polynomial's roots:

```python
Fp = GF(p)
M = Matrix(Fp, n, n, rows)
S = M * M.transpose()

charpoly = S.characteristic_polynomial()
roots = charpoly.roots(multiplicities=True)
evs = []
for r, mult in roots:
    evs.extend([r] * mult)
assert len(evs) == n
```

### Part 1: two known secrets (`secret[0]` and `secret[1]`)

`solve.sage` burns the first guess deliberately to unlock the `secret[1]` hint, then has two knowns against two unknowns (`A = scale^2`, `R`). For a guessed pairing `(e_i -> secret[0], e_j -> secret[1])`, `e_i = A*(s0+R)^2` and `e_j = A*(s1+R)^2` combine into a single quadratic in `R`:

```python
a_coef = ei - ej
b_coef = 2 * (ei * s1 - ej * s0)
c_coef = ei * s1 * s1 - ej * s0 * s0
disc = b_coef * b_coef - 4 * a_coef * c_coef
if disc.is_square():
    sq = disc.sqrt()
    R_candidates = [(-b_coef + sq) / (2 * a_coef), (-b_coef - sq) / (2 * a_coef)]
```

For each candidate `R`, `A = e_i / (s0+R)^2` is fixed, and every other eigenvalue is inverted back to a secret by taking a square root and picking whichever of `+-sqrt(e_k/A) - R` lands in `[1, 2^100)`:

```python
for ek in evs:
    val = ek / A
    if not val.is_square():
        ok = False; break
    sq_val = val.sqrt()
    valid = [Integer(c) for c in (sq_val - R, -sq_val - R) if 1 <= Integer(c) < 2**100]
    if len(valid) != 1:
        ok = False; break
    secrets_found.append(valid[0])
```

The full 32-secret vector is only accepted once it self-consistently reproduces both `secret[0]` and `secret[1]` - brute-forcing `(i, j)` over `32*31` pairs is cheap and the smallness check disambiguates false candidates.

### Part 2: only `secret[0]` known, must guess correctly on the first try

`solve_flag2.sage` cannot burn a guess for a second hint, so it needs another trick to pin down `R` from a single known secret. Guessing which eigenvalue `e_{i0}` maps to `secret[0]`, every other eigenvalue's ratio to `e_{i0}` is a perfect square `t_k^2` (since both are of the form `A*(x+R)^2`), giving a relation linear in the single shared unknown `R`:

```text
secret_k + R = +-t_k * (secret[0] + R)
=> secret_k = (+-t_k)*secret[0] + ((+-t_k) - 1) * R        (*)
```

Two such relations for two other indices `k1, k2` (each with a guessed sign) eliminate `R` by cross-multiplication, collapsing to one linear congruence in the two small unknowns `secret_k1, secret_k2`:

```python
K = m2 * c1 - m1 * c2
A1 = m1 / m2
A0 = K / m2
```

This is solved as a small-solution-to-a-linear-congruence problem via 2D lattice reduction plus Babai rounding around a small neighborhood (not just the single nearest point):

```python
B = Matrix(ZZ, [[1, Integer(A1)], [0, Integer(p)]])
Bred = B.LLL()
target = vector(QQ, [0, -Integer(A0)])
coeffs = target * Bred.change_ring(QQ).inverse()
base = [round(c) for c in coeffs]
for d0 in range(-radius, radius + 1):
    for d1 in range(-radius, radius + 1):
        c = vector(ZZ, [base[0] + d0, base[1] + d1])
        v = c * Bred + shift
        ...
```

`debug_flag2.sage` explains why a plain nearest-point Babai rounding was not enough: the relation has a built-in spurious solution at `x1 = x2 = secret[0]` (forcing `R = -secret[0]`, which trivially satisfies the equation for *any* `t_k`), and since `secret[0]` is the smallest of the 32 secrets, that trivial point often sits closer to the origin than the true `(secret_k1, secret_k2)` point - the diagnostic script confirmed the true point is only a handful of reduced-basis steps away from the naive rounding, motivating the neighborhood search used in the final solve. Every `(i0, k1, k2, sign)` guess (`~60k` combinations) is only expensive-verified across all 32 secrets once its cheap 2-unknown step already looks plausible, so a wrong guess just wastes time rather than producing a false positive.

## Exploit

[solve.sage](#Solve-1) recovers the flag that requires two guesses: it connects to the service, deliberately submits a wrong first guess to unlock `secret[1]`, computes the eigenvalues of `M*M^T`, brute-forces the `(A, R)` quadratic over eigenvalue pairs, inverts every eigenvalue back to a secret, and sends the recovered vector as the second guess.

[solve_flag2.sage](#Solve-2) recovers the bonus flag that requires a correct answer on the very first guess: same eigenvalue setup, but it brute-forces `(i0, k1, k2, sign)` combinations, solves a 2D lattice/CVP problem for `R`, verifies the full 32-secret candidate, and sends it as the first (and only) guess.

Run:

```bash
sage solve.sage
sage solve_flag2.sage
```

Key helpers:

- `recv_matrix`: parses `p`, `secret[0]`, and the 32x32 matrix rows from the socket.
- `recover_secrets` (`solve.sage`): brute-forces `(i, j)` eigenvalue pairings, solves the `R` quadratic from `secret[0]`/`secret[1]`, and inverts every eigenvalue.
- `sqrt_mod` (`solve.sage`): `p % 4 == 3` fast modular square root.
- `recover_secrets_single_hint` (`solve_flag2.sage`): brute-forces `(i0, k1, k2, sign)` and drives the single-hint recovery.
- `solve_small_pair_candidates` (`solve_flag2.sage`): 2D lattice-reduction + Babai-neighborhood search for the small `(secret_k1, secret_k2)` solution.
- `verify_full` (`solve_flag2.sage`): reconstructs and validates the entire 32-secret candidate before trusting it.

## Solve 1

```python=
from pwn import *

context.log_level = "error"

HOST = ???
PORT = ???

n = 32


def recv_matrix(io):
    p = int(io.recvline())
    s0 = int(io.recvline())
    rows = []
    for _ in range(n):
        line = io.recvline().decode().strip()
        rows.append([int(x) for x in line.split(',')])
    return p, s0, rows


def sqrt_mod(val, p):
    # p % 4 == 3, so square roots (when they exist) are val^((p+1)/4)
    r = pow(int(val), (int(p) + 1) // 4, int(p))
    if (r * r) % int(p) != int(val) % int(p):
        return None
    return r


def recover_secrets(evs, p, s0, s1):
    Fp = GF(p)
    evs = [Fp(e) for e in evs]
    s0, s1 = Fp(s0), Fp(s1)

    for i in range(len(evs)):
        for j in range(len(evs)):
            if i == j:
                continue
            ei, ej = evs[i], evs[j]

            a_coef = ei - ej
            b_coef = 2 * (ei * s1 - ej * s0)
            c_coef = ei * s1 * s1 - ej * s0 * s0

            if a_coef == 0:
                if b_coef == 0:
                    continue
                R_candidates = [-c_coef / b_coef]
            else:
                disc = b_coef * b_coef - 4 * a_coef * c_coef
                if not disc.is_square():
                    continue
                sq = disc.sqrt()
                R_candidates = [(-b_coef + sq) / (2 * a_coef),
                                (-b_coef - sq) / (2 * a_coef)]

            for R in R_candidates:
                denom = s0 + R
                if denom == 0:
                    continue
                A = ei / (denom * denom)
                if A == 0:
                    continue

                secrets_found = []
                ok = True
                for ek in evs:
                    val = ek / A
                    if not val.is_square():
                        ok = False
                        break
                    sq_val = val.sqrt()

                    valid = []
                    for cand in (sq_val - R, -sq_val - R):
                        ci = Integer(cand)
                        if 1 <= ci < 2**100:
                            valid.append(ci)
                    if len(valid) != 1:
                        ok = False
                        break
                    secrets_found.append(valid[0])

                if not ok or len(secrets_found) != n:
                    continue

                secrets_found.sort()
                if secrets_found[0] == Integer(s0) and secrets_found[1] == Integer(s1):
                    return secrets_found

    return None


def main():
    io = remote(HOST, PORT)

    p, s0, rows = recv_matrix(io)
    print("p =", p)
    print("secret[0] =", s0)

    Fp = GF(p)
    M = Matrix(Fp, n, n, rows)
    S = M * M.transpose()

    charpoly = S.characteristic_polynomial()
    roots = charpoly.roots(multiplicities=True)
    evs = []
    for r, mult in roots:
        evs.extend([r] * mult)
    assert len(evs) == n, f"expected {n} eigenvalues in GF(p), got {len(evs)}"

    io.recvuntil(b"Gimme your guess: ")
    io.sendline(','.join(['1'] * n).encode())

    io.recvline()  
    s1 = int(io.recvline())
    print("secret[1] =", s1)

    secrets = recover_secrets(evs, p, s0, s1)
    if secrets is None:
        print("failed to recover secrets")
        print(io.recvall(timeout=5).decode(errors="replace"))
        return

    print("recovered secrets:", secrets)

    io.recvuntil(b"Gimme your guess: ")
    io.sendline(','.join(str(x) for x in secrets).encode())

    print(io.recvall(timeout=5).decode(errors="replace"))


if __name__ == "__main__":
    main()
```

## Solve 2
```python=
from pwn import *

context.log_level = "error"

HOST = ???
PORT = ???

n = 32
BOUND = 2**100


def recv_matrix(io):
    p = int(io.recvline())
    s0 = int(io.recvline())
    rows = []
    for _ in range(n):
        line = io.recvline().decode().strip()
        rows.append([int(x) for x in line.split(',')])
    return p, s0, rows


def recover_secrets_two_hint(evs, p, s0, s1):
    Fp = GF(p)
    evs = [Fp(e) for e in evs]
    s0f, s1f = Fp(s0), Fp(s1)

    for i in range(len(evs)):
        for j in range(len(evs)):
            if i == j:
                continue
            ei, ej = evs[i], evs[j]
            a_coef = ei - ej
            b_coef = 2 * (ei * s1f - ej * s0f)
            c_coef = ei * s1f * s1f - ej * s0f * s0f

            if a_coef == 0:
                if b_coef == 0:
                    continue
                R_candidates = [-c_coef / b_coef]
            else:
                disc = b_coef * b_coef - 4 * a_coef * c_coef
                if not disc.is_square():
                    continue
                sq = disc.sqrt()
                R_candidates = [(-b_coef + sq) / (2 * a_coef),
                                (-b_coef - sq) / (2 * a_coef)]

            for R in R_candidates:
                denom = s0f + R
                if denom == 0:
                    continue
                A = ei / (denom * denom)
                if A == 0:
                    continue

                secrets_found = []
                ok = True
                for ek in evs:
                    val = ek / A
                    if not val.is_square():
                        ok = False
                        break
                    sq_val = val.sqrt()
                    valid = []
                    for cand in (sq_val - R, -sq_val - R):
                        ci = Integer(cand)
                        if 1 <= ci < BOUND:
                            valid.append(ci)
                    if len(valid) != 1:
                        ok = False
                        break
                    secrets_found.append(valid[0])

                if not ok or len(secrets_found) != n:
                    continue

                if Integer(s0) in secrets_found and Integer(s1) in secrets_found:
                    return secrets_found, R, A

    return None, None, None


def closest_lattice_point(Bred, target):
    Bq = Bred.change_ring(QQ)
    coeffs = target * Bq.inverse()
    rounded = vector(ZZ, [round(c) for c in coeffs])
    return rounded * Bred, coeffs


def solve_small_pair(A1, A0, p):
    B = Matrix(ZZ, [[1, Integer(A1)], [0, Integer(p)]])
    Bred = B.LLL()
    target = vector(QQ, [0, -Integer(A0)])
    w, coeffs = closest_lattice_point(Bred, target)
    v = w + vector(ZZ, [0, Integer(A0)])
    return int(v[0]), int(v[1]), Bred, coeffs


def exact_coeffs_for_point(Bred, A0, x2_true, x1_true):
    w_true = vector(QQ, [x2_true, x1_true - Integer(A0)])
    Bq = Bred.change_ring(QQ)
    coeffs_true = w_true * Bq.inverse()
    return coeffs_true


def solve_small_pair_neighborhood(A1, A0, p, radius, bound):
    B = Matrix(ZZ, [[1, Integer(A1)], [0, Integer(p)]])
    Bred = B.LLL()
    target = vector(QQ, [0, -Integer(A0)])
    Bq = Bred.change_ring(QQ)
    coeffs = target * Bq.inverse()
    base = [round(c) for c in coeffs]

    shift = vector(ZZ, [0, Integer(A0)])
    candidates = []
    for d0 in range(-radius, radius + 1):
        for d1 in range(-radius, radius + 1):
            c = vector(ZZ, [base[0] + d0, base[1] + d1])
            v = c * Bred + shift
            x2, x1 = int(v[0]), int(v[1])
            if -bound < x1 < bound and -bound < x2 < bound:
                candidates.append((x2, x1))
    return candidates


def main():
    io = remote(HOST, PORT)

    p, s0, rows = recv_matrix(io)
    print("p =", p)
    print("secret[0] =", s0)

    Fp = GF(p)
    M = Matrix(Fp, n, n, rows)
    S = M * M.transpose()

    charpoly = S.characteristic_polynomial()
    roots = charpoly.roots(multiplicities=True)
    evs_elems = []
    for r, mult in roots:
        evs_elems.extend([r] * mult)
    print("num eigenvalues in GF(p):", len(evs_elems))
    assert len(evs_elems) == n

    io.recvuntil(b"Gimme your guess: ")
    io.sendline(','.join(['1'] * n).encode())
    io.recvline()
    s1 = int(io.recvline())
    print("secret[1] =", s1)

    secrets_true, R_true, A_true = recover_secrets_two_hint(evs_elems, p, s0, s1)
    if secrets_true is None:
        print("ground-truth double-hint recovery FAILED -- something else is wrong")
        io.close()
        return

    print("ground truth R =", R_true)
    print("ground truth A =", A_true)
    print("ground truth secrets (sorted):", sorted(int(x) for x in secrets_true))

    # step 1: sanity check e_k == A*(secret_k+R)^2 for all k, and find each
    # secret's position in evs_elems (evs_elems is NOT in secret order)
    Fp_R, Fp_A = R_true, A_true
    pos_of_value = {}
    for idx, ek in enumerate(evs_elems):
        val = ek / Fp_A
        assert val.is_square(), f"idx {idx}: e_k/A is not a square!"
        sq_val = val.sqrt()
        cands = []
        for cand in (sq_val - Fp_R, -sq_val - Fp_R):
            ci = Integer(cand)
            if 1 <= ci < BOUND:
                cands.append(ci)
        assert len(cands) == 1, f"idx {idx}: ambiguous or no small candidate: {cands}"
        pos_of_value[int(cands[0])] = idx
    print("step 1 OK: every eigenvalue maps back to exactly one small secret")

    i0_true = pos_of_value[int(s0)]
    print("i0_true (index of secret[0] in evs_elems) =", i0_true)

    s0f = Fp(s0)
    e_i0 = evs_elems[i0_true]

    # step 2/3: pick two OTHER secret values, find their index, their true
    # sign, and check the linear relation exactly
    other_secret_values = [v for v in secrets_true if v != Integer(s0)][:2]
    print("testing k1,k2 for true secrets:", other_secret_values)

    info = []
    for sv in other_secret_values:
        k = pos_of_value[int(sv)]
        ek = evs_elems[k]
        ratio = ek / e_i0
        is_sq = ratio.is_square()
        print(f"  secret={sv} idx={k} ratio.is_square()={is_sq}")
        if not is_sq:
            print("  !! ratio is not a square -- step 2/3 FAILS here")
            io.close()
            return
        t_k = ratio.sqrt()
        lhs = Fp(sv) + Fp_R
        rhs_plus = t_k * (s0f + Fp_R)
        rhs_minus = -t_k * (s0f + Fp_R)
        if lhs == rhs_plus:
            sign = 1
        elif lhs == rhs_minus:
            sign = -1
        else:
            print("  !! neither sign matches -- relation (*) is WRONG")
            io.close()
            return
        print(f"  sign = {sign} (relation verified exactly)")
        m = sign * t_k - 1
        c = sign * t_k * s0f
        # check secret = c + m*R
        check = c + m * Fp_R
        print(f"  c + m*R == secret ? {check == Fp(sv)}")
        info.append((k, t_k, sign, m, c, sv))

    print("step 2/3 OK: linear relation (*) holds exactly for the true sign")

    # step 3: build the pair congruence from these two TRUE (m,c) and see if
    # solve_small_pair recovers the true (x1,x2)
    (k1, t1, s1sign, m1, c1, sv1) = info[0]
    (k2, t2, s2sign, m2, c2, sv2) = info[1]

    K = m2 * c1 - m1 * c2
    A1 = m1 / m2
    A0 = K / m2

    x2, x1, Bred, coeffs = solve_small_pair(A1, A0, p)
    print(f"solve_small_pair recovered x1={x1}, x2={x2}")
    print(f"true values:            x1={int(sv1)}, x2={int(sv2)}")
    print("MATCH!" if (x1 == int(sv1) and x2 == int(sv2)) else "MISMATCH -- checking why below")

    print("naive rounded coeffs:", [float(c) for c in coeffs])
    coeffs_true = exact_coeffs_for_point(Bred, A0, int(sv2), int(sv1))
    print("EXACT coeffs of true point:", [float(c) for c in coeffs_true])
    print("offset (true - naive rounding):",
          [float(coeffs_true[i] - round(coeffs[i])) for i in range(2)])

    w_triv = vector(QQ, [Integer(s0), Integer(s0) - Integer(A0)])
    Bq = Bred.change_ring(QQ)
    coeffs_triv = w_triv * Bq.inverse()
    print("coeffs of trivial (s0,s0) point:", [float(c) for c in coeffs_triv])

    for radius in (5, 10, 20, 40):
        cands = solve_small_pair_neighborhood(A1, A0, p, radius, BOUND)
        hit = (int(sv2), int(sv1)) in cands
        print(f"radius={radius}: {len(cands)} candidates in bound, "
              f"true pair found = {hit}")
        if hit:
            break

    io.close()


if __name__ == "__main__":
    main()
```

## Verification

### 1
```text
p = 93878836076802123723928272464619466886926053388470353495638928067527834362871
secret[0] = 112393206871753067142146622618
secret[1] = 150651156718611351673780231187
recovered secrets: [112393206871753067142146622618, 150651156718611351673780231187, 161938505202297335555912455442, 167850158358965823738774234014, 207840324999766336803043551516, 225877389886899909288599770822, 236151377104385391208945605776, 333763786159995454406808980778, 391440988385976458101477160538, 412993544084353358009671527839, 417129599073006969566296065983, 420680415000170946592385049310, 501432605659112212442060162870, 611019110042498778257780437650, 670249378971538719348084072262, 787853618017455020241079207784, 820047223194240571343379270237, 842157364119933669878724576312, 875760364729125592450096988274, 883250403723814028646289235523, 942250023621890053372283767791, 945835625082615328107605990782, 967356815179232955014353120421, 985411589425610376940100994253, 1015391281675958526945763146469, 1061929742036664551974241264487, 1097070965883381952500529665148, 1138032879732289593951618355686, 1184838719319599837411971553228, 1194105147376609475548065566784, 1230936408889134628289422324926, 1232678944113439040752176746674]
Great!! Here is your flag
HCMUS-CTF{15_tHI5_cOVARiaNC3_m4tRIx?}
```

### 2
```text=
p = 111212703769106633884519382991136517003826154082070082864284893741094895712807
secret[0] = 22013101787901346932546203876
solving for R (this brute forces ~60k (i0,pair,sign) combos, may take a bit)...
recovered secrets: [22013101787901346932546203876, 32353656833032806475328979128, 46468354242714947183928640751, 92176539413777481556799717539, 92678750451689309935262059289, 122906152645863096266200469291, 158319220984012239409120522193, 184515353403089046885723488385, 186271231463318990000853815490, 191874870357810130278083045105, 417346511370719864152103702755, 443864567027632233137895150685, 445916730796421504158017039561, 457009875735594771596852934850, 459741010046996619845858962098, 478907300417545151708243607632, 513047109321900091824656501791, 535778897101785771528346411074, 560346978677218129784715875282, 688798263950775386010745701702, 754236132529735325317522505913, 780464937667979530430807925412, 836888209292085373170978312211, 880660004714866077135256769054, 903348621270175469125966921413, 977694954943499714933527598658, 991113997420582322075113667310, 1005778780889988554509918812205, 1108841745770929370518386560662, 1206008354591616310698058702230, 1224667431117120261214642147063, 1250522640944657790200388612655]
You are so lucky!! Enjoy your flag
HCMUS-CTF{5iN6UL4r_va1u3_dEc0MPOSiTION_4Nd_L4t7Ic3_rEduct1On_4R3_w3irD}
```

## Flag

Part 1:

```text
HCMUS-CTF{15_tHI5_cOVARiaNC3_m4tRIx?}
```

Part 2:

```text
HCMUS-CTF{5iN6UL4r_va1u3_dEc0MPOSiTION_4Nd_L4t7Ic3_rEduct1On_4R3_w3irD}
```

## Lessons Learned

- Conjugation by an orthogonal matrix (`Q^T == Q^-1`) preserves eigenvalues; independent left/right orthogonal multiplication does not preserve a matrix's own eigenvalues but does preserve those of `M*M^T`, up to the same conjugation argument - always check what invariant survives a "mixing" transformation before assuming it destroys all structure.
- A sequence of unknown additive/multiplicative shifts collapses to a small number of aggregate unknowns (`sum of shifts`, `product of scalars`) rather than growing the unknown count with the round count.
- One or two leaked plaintext-like values against a small number of unknown aggregate constants is often enough to solve a low-degree polynomial relation (here a quadratic in `R`) and then invert the same relation across every other unknown.
- When only a single known value is available instead of two, look for a *ratio* trick (dividing out the leaked value's own relation) to turn a quadratic-in-one-unknown problem into a linear relation between two other unknowns - this is a generally reusable way to trade a missing oracle query for extra brute force.
- Naive nearest-point (Babai) rounding in a reduced lattice basis can fail when the target relation has a structurally spurious "trivial" solution that sits closer to the origin than the true one - searching a small neighborhood around the naive rounding, not just the single closest point, is a cheap and often necessary fix.
- Full-candidate verification (checking a reconstructed answer against *every* known/consistency constraint) is what makes a brute force over many structural guesses safe - it converts "this guess might be right" into "this guess is right," so wrong guesses cost time but never yield false positives.

# Special Elliptic Curve Writeup

## Summary

This chall builds an elliptic curve `E` not over a prime field `F_p` but over the ring `Z/p^5Z`, lifts a random point `P` onto it, and publishes `P` and `Q = m*P` where `m` is the 43-byte flag interpreted as an integer. No remote service is involved - everything needed is in `output.txt`. The core mechanic is that points on `E(Z/p^5Z)` split into an `F_p`-rational part plus a formal-group kernel of order `p^4`, and that kernel is isomorphic to `(Z/p^4Z, +)` via a p-adic logarithm, which turns the "hard" elliptic-curve discrete log into a division in `Q_p`.

Flag:

```text
0160ca14{3ll1pt1c_curv3_ov3r_p-adic_f13ld!}
```

## Triage

`special_elliptic_curve.py` generates a 512-bit prime `p`, two random 512-bit curve coefficients, and defines the curve over `Zmod(p**5)` - a ring, not a field:

```python
p = getPrime(512)
a1 = getrandbits(512)
a2 = getrandbits(512)
Fp = Zmod(p**5)
E = EllipticCurve(Fp, [a1, a2])

m = bytes_to_long(flag)
P = E.lift_x(Integer(getrandbits(512*5)))
Q = m * P
```

`assert len(flag) == 43` fixes `m` at 344 bits - far smaller than `p` (512 bits) or the ring's modulus `p^5` (2560 bits). `output.txt` contains the full affine coordinates of `P` and `Q` (as elements of `Z/p^5Z`, printed with an implicit `z = 1` projective-style third coordinate) plus `p`, `a1`, `a2`:

```text
P: (3140410916...096 : 1650165004...848 : 1)
Q: (1318255284...691 : 14319632160...211473 : 1)
p = 8056214885364405686222126654125867129615844411205519854451535576473155805503671461308303184163871680686334162003343415775884489186172469025432230101435373
a1 = 1704625448079672493725385696954489776449792965064371582831944842835294967987299772073039822182441688059147118386602445470071533689825641747045938850656920
a2 = 2761865023621674450464861320238411816379448538899506683273537115113283121281539547363316989306470150259789345310585224866168229184631297283344122088268930
```

Working over `Z/p^5Z` instead of `F_p` is the "special" part: reduction mod `p` gives a surjective group homomorphism `E(Z/p^5Z) -> E(F_p)` whose kernel has order `p^4` (the formal group of the curve). A point's discrete log therefore splits into an `F_p`-component (as hard as ordinary ECDLP) and a `p^4`-order formal-group component that is *linear* - no exponential-time DLP needed for that part.

## Solve Path

The plan is to isolate the easy formal-group component and read `m` off it directly, since `m < p` already fits inside a single p-adic digit of precision.

First, `solve.sage` computes `n1 = #E(F_p)` over the reduced curve, and confirms `gcd(n1, p) == 1` (the generic case for a curve with good reduction at `p`):

```python
Fp = GF(p)
E = EllipticCurve(Fp, [Fp(a1), Fp(a2)])
n1 = E.order()
print("gcd(n1, p) =", gcd(n1, p))
```

Because `gcd(n1, p) == 1`, multiplying any point on `E(Z/p^5Z)` by `n1` kills its `E(F_p)`-component entirely and leaves only its component inside the order-`p^4` kernel subgroup - exactly the formal group, which is analytically isomorphic to `(Z/p^4Z, +)`.

An earlier, abandoned approach is preserved in `factor.sage`: it takes a curve-order value `n` (whose leading ~80 decimal digits coincide with `p`'s, consistent with Hasse's bound `|#E(F_p) - (p+1)| <= 2*sqrt(p)` for a 512-bit `p`) and tries to factor it directly, having already found one ~512-bit prime factor by other means:

```python
factors = [(314880394190518103819508565727022361915803963697694737324664278931919320129119722403505037533315341268058299408305400057056443716609562880925202303179, 1)]
# factor the rest
factors = factor(n // factors[0][0])
```

`solve.sage` never imports or calls into `factor.sage` - it is a standalone precursor. The size of that surviving prime factor of `n1` makes a full Pohlig-Hellman discrete log on the `F_p`-rational part infeasible, which is exactly the dead end that motivates the pivot in `solve.sage`: annihilate the `n1`-order part by scalar multiplication instead of trying to solve a DLP in it. The bundled reference `978-3-642-04159-4_6.pdf` is a Springer book-chapter PDF (its filename is the book's ISBN plus a chapter number); given it sits alongside this exact construction, it is almost certainly the published source for the formal-group / anomalous-curve technique implemented below, rather than something original to the solve script.

With `n1` in hand, the actual break lifts both points into `Q_p(p, 5)` (a genuine p-adic *field*, matching the ring's precision) rather than working in `Zmod(p**5)` directly - arithmetic in `Zmod(p**5)` would hit non-invertible zero-divisor denominators once a point lands purely in the kernel, while `Qp` just tracks precision loss instead of throwing:

```python
PREC = 5
R = Qp(p, PREC)
ER = EllipticCurve(R, [R(a1), R(a2)])
Plift = ER(R(Px), R(Py))
Qlift = ER(R(Qx), R(Qy))

# kill the E(F_p)-component, leaving only the order-p^4 kernel component
Pk = n1 * Plift
Qk = n1 * Qlift
```

The kernel points are converted to their local parameter `t = -x/y` (the standard uniformizer used to define the formal group law), then run through the curve's formal-group logarithm, which linearizes the group law on the kernel:

```python
tP = -(xP / yP)
tQ = -(xQ / yQ)

log_series = ER.formal_group().log(prec=20)
logP = log_series(tP)
logQ = log_series(tQ)

m = Integer((logQ / logP).lift()) % p
```

Because `log` is a group homomorphism from the kernel to `(Z/p^4Z, +)`, `log(n1*Q) = m * log(n1*P)`, so `m` falls out of a single p-adic division - no discrete log search at all. Since `m < p` by construction (43-byte flag versus a 512-bit `p`), reducing the p-adic lift mod `p` recovers `m` exactly. The script closes with a direct sanity check, recomputing `m*P` and comparing it to the original lifted `Q`:

```python
check_ok = Integer(m) * Plift == Qlift
print("verification (m*P == Q):", check_ok)
```

## Exploit

[solve.sage](#Solve) hardcodes `p`, `a1`, `a2`, and the coordinates of `P`/`Q` from `output.txt`, computes `n1 = #E(F_p)`, lifts both points into `Qp(p, 5)`, kills the `E(F_p)`-component via multiplication by `n1`, applies the formal-group logarithm to linearize the remaining order-`p^4` component, recovers `m` by p-adic division, and converts it back to the 43-byte flag. [factordb](https://factordb.com/index.php?query=8056214885364405686222126654125867129615844411205519854451535576473155805503528097693676385289873006343271590361493660459789112489455666308471300926834715) is the earlier, standalone precursor that attempted to factor the curve order `n1` for a Pohlig-Hellman approach; it is not called by `solve.sage`.

Run:

```bash
sage solve.sage
```

Key steps:

- `E.order()` - computes `n1 = #E(F_p)`, the order of the easy/hard-to-avoid `F_p`-rational component.
- `Qp(p, 5)` / `EllipticCurve(R, ...)` - lifts the curve and points into a genuine p-adic field matching the challenge's `Z/p^5` precision, avoiding zero-divisor issues in `Zmod(p**5)`.
- `n1 * Plift`, `n1 * Qlift` - annihilate the `E(F_p)`-component, isolating the order-`p^4` formal-group kernel component.
- `-(x/y)` - computes the local parameter `t`, the standard uniformizer for the formal group.
- `ER.formal_group().log(prec=20)` - the formal-group logarithm that linearizes the kernel's group law.
- `Integer((logQ / logP).lift()) % p` - recovers `m` via p-adic division instead of a discrete-log search.

## Solve
```python=
p = 8056214885364405686222126654125867129615844411205519854451535576473155805503671461308303184163871680686334162003343415775884489186172469025432230101435373
a1 = 1704625448079672493725385696954489776449792965064371582831944842835294967987299772073039822182441688059147118386602445470071533689825641747045938850656920
a2 = 2761865023621674450464861320238411816379448538899506683273537115113283121281539547363316989306470150259789345310585224866168229184631297283344122088268930

Px = 31404109161421780193452637271217588346753427850955810154455319437156769041094943402981163627543634816917071618256296416183952848780141575442619852683896140003569837415186210951299111020661127129831497701671664775221729230817655637256181411221378635397359219397880935101591436272462480741008095573815389568672437544281393619238552592848256641902149434979195839008468122249169871586240568565421652821886120214539164441437410223220047780699479202967914599072984178702775039092425949270917008606545953044044352862636933054930713945787026347616069486220853883365473978065845591339032784865909204418560366635972893887387436995090185143803699607778434114381124632555352912034671469404198373517615075716157896867709539372026249040172498197918710283476267304030794688253314428826
Py = 1650165004758405364632729771756327800768600200474608342119257869412414504204784199329579632894331742735026983518426084479442387757098497079561700150857961658450089480544784314533421781546451978980208697096980763804547306056908656281768771822997440363914492676286954337494237559288134111074369815030186130293458867686949767930813966173706109642585936690477114590695292246348081195487980548198107134013176498110038095509383784015299081239268889469034948630556992012110920482977159621772707398592925499288941119548827578294412416209128220355853224464718664171917297857638133690871026304347764996898294458820280865543964677524109211893963332598572492190631704033515066903693847202637966405326462985190626763776505815625663524577810136223741873210959960936213359933786911848

Qx = 1318255284646675791538548167316756785247071836912500643400079790485961663052192807771398925779804931957009495746725249724944548760087678508510691783305777748143577200818279958834426336150225535448737258038017501009787676065109946129395047530779904234172843569090542989129998311572933531073533744921416221536028397355180559247560032395379818907934515540852948864919342314659338193659517656118991744785027582713054668293898347677484449890569657748302856508378887655265958902814440148297840919032063070475643194020966155600449415163830991206064313455753338063093458740501692071043631685367625330282424745101401175830692585629071428771509375995834341639356960103702470500337916531587033254699488994116413874921814534642064807224717040876210001515912086018703465867252769691
Qy = 14319632160412956633122525260926697791172296131626341607225710778580809856753776930572350812181316417552683677039337703258456295791669789150907678405389287273157746409586925658483389508394380281852580252839481478480484469799651721657080253221885989351458002549634814155108393856237937624782973113664794025646796746772318563624446949548824763262766657362855615490531822464622268123224719429937290550889194012193487175149041857441976919246600566193518555067472550556931009937578054730395811286629327030452435046812246638091781587593779789947231493991510346249731044404506650365296212572532182676658208665243262711007814341279577711338655525216348802597084054272404295039878931769336458705110448637408124881776289371888431470473814793261969795117401437363097973360304211473


Fp = GF(p)
E = EllipticCurve(Fp, [Fp(a1), Fp(a2)])

print("computing n1 = #E(F_p) ...")
n1 = E.order()
print("n1 =", n1)
print("gcd(n1, p) =", gcd(n1, p))

PREC = 5
R = Qp(p, PREC)
ER = EllipticCurve(R, [R(a1), R(a2)])
Plift = ER(R(Px), R(Py))
Qlift = ER(R(Qx), R(Qy))

Pk = n1 * Plift
Qk = n1 * Qlift

xP, yP = Pk.xy()
xQ, yQ = Qk.xy()

tP = -(xP / yP)
tQ = -(xQ / yQ)
print("valuations of tP, tQ:", tP.valuation(), tQ.valuation())

log_series = ER.formal_group().log(prec=20)
logP = log_series(tP)
logQ = log_series(tQ)

m = Integer((logQ / logP).lift()) % p

flag = int(m).to_bytes(43, "big")
print("m =", m)
print("flag =", flag)

# sanity check: does m*P actually reproduce Q?
check_ok = Integer(m) * Plift == Qlift
print("verification (m*P == Q):", check_ok)
if not check_ok:
    print("!! mismatch -- got:", (Integer(m) * Plift).xy())
    print("!! expected:", Qlift.xy())

```

## Verification

```text
computing n1 = #E(F_p) ...
n1 = 8056214885364405686222126654125867129615844411205519854451535576473155805503528097693676385289873006343271590361493660459789112489455666308471300926834715
gcd(n1, p) = 1
valuations of tP, tQ: 1 1
m = 6746143794948552479973616062368264558916975686092584220481293718809756025174582206074225057325402825085
flag = b'0160ca14{3ll1pt1c_curv3_ov3r_p-adic_f13ld!}'
verification (m*P == Q): True
```

## Flag

```text
0160ca14{3ll1pt1c_curv3_ov3r_p-adic_f13ld!}
```

## Lessons Learned

- A curve defined over `Z/p^kZ` instead of `F_p` is a strong signal to look at the formal group: reduction mod `p` is surjective with a kernel of size `p^(k-1)` that is *always* isomorphic to `(Z/p^(k-1)Z, +)`, regardless of how hard ECDLP is on the reduced curve.
- Multiplying a point by the order of the "hard" component (`n1 = #E(F_p)`) is a general trick for projecting onto an "easy" subgroup without ever solving a discrete log in the hard one.
- The formal-group logarithm turns elliptic-curve scalar multiplication into ordinary multiplication in the base ring for any point in the kernel of reduction - this is the same mechanism behind Smart's/SSSA's attack on anomalous curves (`#E(F_p) == p`), generalized here to `Z/p^k`.
- When a lattice/field computation risks hitting non-invertible zero divisors in a ring like `Zmod(p**k)`, lifting to the corresponding p-adic field (`Qp`/`Zp`) and tracking precision instead often sidesteps the failure entirely.
- Before committing to a heavy attack (factoring a large curve order for Pohlig-Hellman), check whether the specific ring/field the challenge uses admits a structural shortcut - the factoring precursor here was abandoned once the formal-group approach made the factorization irrelevant.
