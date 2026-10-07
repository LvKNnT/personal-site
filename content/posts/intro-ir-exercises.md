---
title: My Work on IR Exercises
description: Notes and solutions for interesting IR exercises.
# readingTime: 4 min
---

I don't think I can do them all during the course, so I will randomly pick a few exercises.

![My reaction](/post/aima/reaction.gif)

# 1. Boolean Retrieval

Throughout these exercises, terms are lowercased and each postings list is sorted by document ID.

## 1.1

> Draw the inverted index that would be built for the following document collection. (See Figure 1.3 for an example.)
>
> - Doc 1: new home sales top forecasts
> - Doc 2: home sales rise in July
> - Doc 3: increase in home sales in July
> - Doc 4: July new home sales rise

The inverted index is:

| Term | Postings list |
| --- | --- |
| forecasts | 1 |
| home | 1, 2, 3, 4 |
| in | 2, 3 |
| increase | 3 |
| july | 2, 3, 4 |
| new | 1, 4 |
| rise | 2, 4 |
| sales | 1, 2, 3, 4 |
| top | 1 |

For example, `home` occurs in all four documents, so its postings list is $\langle 1, 2, 3, 4 \rangle$.

## 1.2

> Consider these documents:
>
> - Doc 1: breakthrough drug for schizophrenia
> - Doc 2: new schizophrenia drug
> - Doc 3: new approach for treatment of schizophrenia
> - Doc 4: new hopes for schizophrenia patients
>
> a. Draw the term-document incidence matrix for this document collection.
> b. Draw the inverted index representation for this collection, as in Figure 1.3 (page 7).

### a. Term-document incidence matrix

A value of 1 means that the term occurs in the document; 0 means that it does not.

| Term | Doc 1 | Doc 2 | Doc 3 | Doc 4 |
| --- | :---: | :---: | :---: | :---: |
| approach | 0 | 0 | 1 | 0 |
| breakthrough | 1 | 0 | 0 | 0 |
| drug | 1 | 1 | 0 | 0 |
| for | 1 | 0 | 1 | 1 |
| hopes | 0 | 0 | 0 | 1 |
| new | 0 | 1 | 1 | 1 |
| of | 0 | 0 | 1 | 0 |
| patients | 0 | 0 | 0 | 1 |
| schizophrenia | 1 | 1 | 1 | 1 |
| treatment | 0 | 0 | 1 | 0 |

### b. Inverted index

Reading each row of the incidence matrix gives the corresponding postings list:

| Term | Postings list |
| --- | --- |
| approach | 3 |
| breakthrough | 1 |
| drug | 1, 2 |
| for | 1, 3, 4 |
| hopes | 4 |
| new | 2, 3, 4 |
| of | 3 |
| patients | 4 |
| schizophrenia | 1, 2, 3, 4 |
| treatment | 3 |

## 1.3

> For the document collection shown in Exercise 1.2, what are the returned results for these queries?
>
> a. `schizophrenia AND drug`
> 
> b. `for AND NOT (drug OR approach)`

### a. `schizophrenia AND drug`

Intersect the two postings lists:

$$
\langle 1,2,3,4 \rangle \cap \langle 1,2 \rangle = \langle 1,2 \rangle
$$

The query returns **Doc 1 and Doc 2**.

### b. `for AND NOT (drug OR approach)`

First evaluate the expression in parentheses:

$$
\operatorname{drug} \cup \operatorname{approach}
= \langle 1,2 \rangle \cup \langle 3 \rangle
= \langle 1,2,3 \rangle
$$

The collection contains documents $\{1,2,3,4\}$, so the complement is $\langle 4 \rangle$. Intersecting it with the postings list for `for` gives:

$$
\langle 1,3,4 \rangle \cap \langle 4 \rangle = \langle 4 \rangle
$$

The query returns **Doc 4**.
