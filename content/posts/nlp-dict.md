---
title: Some random interesting NLP phrase 
date: 2026-09-28
description: A short note for quick check while grinding papers
# readingTime: 4 min
---

Yes, this note uses `this-website` template 🍊.

![Eleanor](/work/img/this-website.jpg)

# 1. Introduction
- `NLP` : natural language processing

## 1.1 What is a Large Language Model ? 
- `language model` : is a computational system that can predict the next word from previous words.
- `token` : is a word a word-part, and the first step in language modeling is to convert a sequence of words into a sequence of tokens.
- `BPE` : an algorithm for tokenization
- `large language model` : language models built from various neral network architecture, particularly the transformer architecure
- `parameters` : a single real-valued number that is trained in a neural network and used for computation (specifically the parameters are made up two kinds of numbers called weights and baises).
- `weights` : 
- `biases` : 
- `scaling laws` : the relationships between 3 factors -- model size (the number of parameters), training dataset size (in tokens), and the amount of compute used for training -- and performance 

## 1.2 What do LLMs Learn Form Word (Token) Prediction ? 
- `pretraining` : the process of predicting words and inducing knowledge

### 1.2.1 Promting = conditional generation = token prediction!
- `prompts` : text strings that a user issues to a language model to get the model to do something useful.
- `conditional generation` : generating tokens based on how probable they are given the prior context. 

### 1.2.2 The Shannon game and the origin of the prediction engine
- `Shannon game` : "guess word from a small text" game

## 1.3 Underpinnings : Neural Networks and Embeddings
- `neural network` : machine learning systems that can be trained from data, as the basic computational mechaism
- `weights` : the set of values in all the omcputing units
- `open-weights` model : the model creator give out all the different weights, allowing anyone to run the model on their own machines
- `proprietary` - `close-weight` : the model creator does not give out the weights, and only allows people to interact with the model via a web/app or API interface.
- `embeddinng` : a vector, a list of numbers, used in the network to represent the meaning of tokens, phrases, and sentences in context.

## 1.4 A Brief History of Speech and Language Processing
- `connectionist` : a cognitive science paradigm of neural networks via improving algorithm based on error backpropagation.
- `generative AI` : new area that concentrating on generate text, code, speech, and images

## 1.5 Linguistic Structure and Interpretability
- `parsing` : a task detecting the suntactic dependency relationships.
- `Interpretability` : helps us understand how LLMs work by uncovering the model's internal linguistic structures or computation. 
- `common ground` : mutual understanding between each other
- `grounding` : linguistically signaling understanding or lack of understanding. 
- `clarification` : ( i - i )
- `computational linguistics` : an important tool for answering questions about language itself.

## 1.6 How Language Models are Trained 

### 1.6.1 Pretraining: training LMs via a Shannon game
- `common crawl` : a series of snapshots of the entire web produced by the nonprofit Common Crawl that each have billions of webpages.

### 1.6.2 Instruction Tuning
- `instruction tuning` - `instruction fine-tuning` - `instruct tuning` : a method for making an LLM better at following instructions, involves taking a base LLM that has been pretrained to predict tokens, and triing it further to follow instructions for tasks.

### 1.6.3 Preference Alignment
- `preference alignment` : improve the performance of instructed LLMs by using preference judgements.

### 1.6.4 RL for Reasoning
- `RLVR` : Reinforcement Learning with Verifiable Rewards, the model being trained receives a reward for responses that are verifiably correct.

## 1.7 Inference
- `inference` : running the model and generating text.
- `prompt engineering` : designing effective prompts for a task
- `demonstrations` : ( i - i )
- `few-shot` : promting with demonstrations
- `zero-shot` : instructions that dont include labeled examples. 
- `system prompt` : a single text prompt that is the first instruction to the language model, and which define the task or role for the LM, and sets overall tone and context.
- `test-time compute` : the amount of computational power used by an AI model when it is generating a response.
- `chain-of-thought` : each demonstration is augmented with text explaining some reasoning steps, to lead the language model to output similar kinds of reasoning steps when it answers.

### 1.7.1 Inference : Putting all the pieces together
- `temperature` : ( i - i )
- `in-context learning` : learning that takes place during prompting but does not update the weights

## 1.8 Agents 
- `agent` : is an LLM that has the power to autonomously act in the world, by calling other programs. 
- `ReAct` : popular agent architecture that using loops over three stages : Reason-Action-Observation

## 1.9 Evaluating Large Language Models

### 1.9.1 Measuring Accuracy
- `accuracy` : the correctness of a systems. 
- `test set` : is a set of data used to evaluate a system. 
- `benchmarks` : large evaluation test harnesses
- `MMLU` : Massive Multitask Language Understanding, a commonly-used dataset of 15,908 knowledge and reasonging questions in 57 areas including medicine, mathematics, computer science, law and others.
- `data contamination` : the sitation where a test dataset makes its way into our training set.

### 1.9.2 Word Prediction Accuracy : Probability and Perplexity 
- `perplexity` : ( i - i )

### 1.9.3 Subjective Tasks : People or LLMs as Judges
- `LLM-as-a-judge` : to use LLMs instead of humans to evaluate LLMs

### 1.9.4 Proxy metrics
- `proxy metric` : a formal metric that is easy to compute automatically

### 1.9.5 Other factors for evaluating language models

## 1.10 Safety and Alignment
- `AI safety` : potential harms in LLMs and related models, and how to mitigate them
- `alignment` - `value alignment` : attempts to develop methods to address safety issues
- `de-skilling` : phenomenom that users can become overreliant on language models, in which using models for a task leads people to become worse at the task.
- `sycophantic` : excessively aggreing with, flattering, or validating users.
- `existential risk` : sufficiently advanced language models may pursue their own goals that conflict with human interests altogether in a way that may cause mass harm. 
- `prompt injection` : where they insert malicious commands into a prompt or hidden in data.
- `sociotechnical` : not just the doain of computer science or the language sciences, but deeply embedded in economic, societal, and political questions
- `value sensitive design` : carefully considering the impact of LLMs and the design decisions we make on the people who are interacting with them
- `IRB` : Instituitional Review Boards
- `constituitional AI` : write a written "constituition" covering safety and harm issues, and use it both to generate training data and as part of the system prompt.
- `red teaming` : security team attempts to attack its own system.
- ` hallucinate` : generate text that is factually incorrect, especially emphasizing cases like inveting people or facts that simply dont exist
- `overconfident` : using very certain language even when they are wrong
- `calibrated` : model's actual accuracy doesnt match the score or probability they assign

# 1.11 Anthropomorphism and Terminology
- `anthropomorphism` : assigning human traits, emotions, or cognition to non-human animals or objects.
- `intentional stance` : interpreting an entity like langugage models as if it was a human rational agent.