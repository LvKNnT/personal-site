---
title: Some random interesting NLP summries 
date: 2026-09-28
description: A short summaries for NLP
# readingTime: 4 min
---

Yes, this note uses `this-website` template 🍊.

# LARGE LANGUAGE MODEL
## 1. Introduction

## 2. Words and Tokens
This chapter introduced the fundamental concepts of tokens and tokenization in language processing. We discussed the linguistic levels of words, morphemes, and characters, introduced Unicode code points and the UTF-8 encoding, morphemes, and characters, introduced the **BPE** algorithm for tokenization, and introduced the **regular expression** and the **minimum edit distance** algorithm for comparing strings. Here;s a summary of the main points we covered about these ideas :
- Words and morphemes are useful units of representation, but difficult to define formally.
- **Unicode** is a system for representing characters in the many scripts used to write the languages of the world
- Each character is represented internally with a unique id called a **code point**, and can be encoded in a file via encoding methods like **UTF-8**, which is a variable-length encoding.
- **Byte-Pair Encoding** or **BPE** is the standard way to induce tokens in a data-driven way. It is the first step in most large language models.
- **BPE** tokens are often roughly word or morpheme-sized. although they can be as small as single characters.
- the **regular expresison** language is a powerful tool for pattern-matching
- Basic operations in regular expressions include **disjunction** of symbols ([, ], |), **counters** (*, +, and {n, m}), **anchors** (^, $), capture groups ((, )), and substitutions
The **minimum edit distance** between two strings is the minimum number of operations it takes to edit one into the other. Minimum edit distance can be computed by **dynamic programming**, which also results in an **alignment** of the two strings.

## 3. N-gram Language Model
This chapter introduced language modeling bia the n-gram model, a classic model that allows us to introduce many of the basic concepts in language modeling. 
- Language models offer a way to assign a probability to a sentence or other sequence of words or tokens, and to predict a word or token from preceding words or tokens. 
- **N-gram** are perhaps the simplest kind of language model. Tehy are Markov models that estimate words from a fixed window of previous words. N-gram models can be trained by counting in a **training corpus** and normalizaing the counts (the **maximum likelihood estimate**)
- N-gram **language models** can be evaluated on a **test set** using **perplexity**.
- The **perplexity** of a test set according to a language model is a function of the probability of the test set: the inverse test set probability according to the model, normalized by the length.
- **Sampling** from a language model means to generate some sentences, choosing each sentence according to its likelihood as defined by the model
- **Smoothing** algorithms provide a way to estimate progabilities for events that were unseen in training. Commonly used smoothing algorithm for n-grams include add-1 smoothing, or rely on lower-order n-gram counts through **interpolation**

## 4. Logistic Regression
This chapter introduced the **logistic regression** model of **classification**
- Logistic regression is a supervised machine learning classifier that extracts real-values features from the iput, multiples each by a weight, sums then, and passes the sum through a **sigmoid** function to generate a probability. A threshold is used to make a decision
- Logistic regression can be used with two classes (positive and negative sentiment) or with multiple classes (**multinomial logistic regression**, for example for n-ary text classification, part-of-speech labeling, etc.).
- The weights (vector $w$ and and bias $b$) are learned from a labeled training set via a loss function, such as the **cross-entropy loss**, that must be minimized
- Minimiaing this loss function is a **convex optimization** problem, and iterative algorithms like **gradient descent** are used to find the optimal weights.
- **Regularization** is used to avoid overfitting.
- Logistic regression is also one of the most useful analytic tools, because of its ability to transparently study the importance of individual features. 