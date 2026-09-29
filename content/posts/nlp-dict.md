---
title: Some random interesting NLP phrase 
date: 2026-09-28
description: A short note for quick check while grinding papers
# readingTime: 4 min
---

Yes, this note uses `this-website` template 🍊.

![Eleanor](/work/img/this-website.jpg)

> LARGE LANGUAGE MODEL
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

# 2 Words and Tokens
- `ELIZA` : an early natural language processing system that could carry on a limited conversation with a user by imittating the responses of a Rogerian psychotherapist
- `tokenization` : the task of separating out or tokenizing words and word parts from running text.
- `BPE` : Byte-Pair Encoding, that automatically breaks up input text into tokens.
- `regular expression` : a language for formally specifying and manipulating text strings, an important tool in all modern NLP systems.

## 2.1 Words
- `utterance` : the technical linguistic term for the spoken correlate of a sentence
- `disfluency` : the quality in speech of not being smooth and continuous
- `fragment` : the broken-off word like `main-`
- `filled pause` : words like `uh` and `um`
- `word type` : set of unique words in a corpus
- `word instance` :  similar to word tokens
- `hanzi` : words are composed of characters
- `Herdan's Law` and `Heap's Law` : law on the relationship between the number of types and bymber of instances
- `function words` : the grammatical words like English *a* and *of*, that tend not to gow indefinitely (a language tends to have a fixed number of these)
- `content words` : nouns, adjectives and verbs that tend to have meanings about people and places and events.

## 2.2 Morphemes : Parts of Words 
- `morphology` : the study of morphemes 
- `morpheme` : a minimal meaning -breaing unit in a language
- `root` : the central morpheme of the word, supplying the main meaning
- `affix` : adding additoinal meanings of various kinds.
- `inflectional morphemes` : grammatical morphemes that tend to play a syntatic role.
- `derivational morphemes` : apply only to a specific subclass of words and result in a word of a different grammatical class than the root, often with a meaning hard to predict exactly
- `clitic` : a morpheme that acts suntactically like a word but is reduced in form and attached (phonologically and sometimes orthographically) to another word.
- `morphological typology` : the study of how languages vary in their morphology, i.e., how words break up into their parts
- `isolating` : each word on average has just over one morpheme
- `synthetic` : a single word may have very many morphemes
- `polysynthetic` : a single word have VERY many morphemes
- `agglutinative` : easily segmentable, morphemes have relatively clean boundaries
- `fusion` : a single affix may conflate multiple morphemes

## 2.3 Unicode
- `Unicode` : is a method for representing text written using any character in any script of the languages of the world
- `ASCII` : American Standard Code for Information Interchange
- `Devanagari` : script for language that not based on Latin characters 

### 2.3.1 Code Points
- `code point`  : Unicode asigns a unique id for each one of 150000 characters
- `glyph` : the visual representation of a character

### 2.3.2 UTF-8 Encoding
- `encoding` : represent a character in a text string.
- `UTF-8` : Unicode Transformation Format 8, represents characters efficiently
- `variable-length encoding` : writing some chracters using fewer bytes and some using more bytes.

## 2.4 Subword Tokenization : Byte-Pair Encoding
- `tokenization` : the process of segmenting the running input text into tokens.
- `tokens` : words, morphemes and character
- `subwords` : can be arbitrary substrings, or can be meaning-bearing units like the morphemes *-est* or *-er*.
- `BPE` : byte-pair encoding

### 2.4.1 BPE training

### 2.4.2 BPE encoder

### 2.4.3 BPE in practice
- `pretokenization` : first segments the input using regular expressions.
- `SuperBPE` and `BoundlessBPE` : induce regular BPE subword tokens by enforcing pretokenization

## 2.5 Corpora
- `AAE` : African American English, the variations of English that can be used by millions of people in African American communities
- `MAE` : Mainstream Emarican English
- `code switching` : use multiple languages in a single utterance .
- `vernacular` : for family or lcoal communication
- `vehicular` : for written form
- `datasheet` : specifies properties of a dataset : motivation, situation, language variety, speaker demographics, collection process, annotation process, distribution

## 2.6 Regular Expresison
- `regular expression` - `regex` : a language for specifying text strings. 
- `string` : a single line or a longer text.

### 2.6.1 Character Disjunction : The Square Bracket
- `character disjunction` : ( i - i )
- `range` : ( i - i )

### 2.6.2 Counting, Optionality, and Wildcards
- `Kleene*` : zero or more occurrences of the immediatly previous character or regular expresison
- `Kleene+` : one or more occurences of the immediately precediing character or regular expression
- `period` : a wildcard expression that mathces any single character (except a newline)

### 2.6.3 Anchors and Boundaries
- `anchors` : special characters that anchor regular expressions to particular places in a string

### 2.6.4 Disjunction, Grouping, and Precedence
- `disjunction` : ( i - i )
- `precedence` : ( i - i )
- `operator precedence` : ( i - i )
- `greedy` : match the largest string they can
- `non-greedy` : 
- `*?` : Kleene star match little text as possible
- `+?` : Kleen plus match little text as possible

### 2.6.5 A Simple Example
- `false positive` : incorrectly matched
- `false negative` : incorrectly missed

### 2.6.6 More Operators 
- `newline` : `\n` or `\t`

### 2.6.7 Substitutions and Capture Groups
- `substitution` : ( i - i )
- `capture group` : ( i - i )
- `non-capture group` : ( i - i )

### 2.6.8 Lookahead Assertions
- `lookahead` : 
- `zero-width` : 


### 2.6.9 Regular Expressions for BPE pre-tokenization

## 2.7 Simple Unix Tools for Word Tokenization

## 2.8 Rule-based Tokenization
- `clitic` : ( i - i )
- `Penn Treebank tokenization` : a tokenization standard

### 2.8.1 Sentence Segmentation
- `sentence segmentation` : a step that can be optionally applied in text processing, important when applying NLP algorithms to tasks of detecting structure, like parse structure

## 2.9 Minimum Edit Distance
- `minimum edit distance` : the minimum number of editing operations (operations like insertion, deletion, substitution) needed to transform one string into another
- `alignment` : a correspondence between substrings of the two sequences

### 2.9.1 The Minimum Edit Distance Algorithm
- `dynamic programming` : the name for a class of algorithm
- `minimum edit distance algorithm` : was named by Wagner and Fischer
- `backtrace` : start from the last cell, and follow the pointers back throught the dynamic programming matrix

# 2.10 Summary


# 3. N-gram Language Model
- `language model` : is a machine learning model that predicts upcoming words.
- `LM` : language model
- `AAC` : augmentative and alternative communication, the users are physically unable to speak or sign but can instead use eye gaze or other movements to select words from a menu
- `n-gram` : is a sequence of n words

## 3.1 N-Grams

### 3.1.1 The Markov assumption
- `bigram` : approximate the probability of a word given all the previous words by using only yhe conditional probability given the preceding word.
- `Markov` : is the assumption that the probability of a word depends only on the previous word
- `n-gram` : looks n-1 words into the past

### 3.1.2 How to estimate probabilities
- `maximum likelihood estimation` : getting counts from a corpus, and normalizing the counts so that they lie between 0 and 1
- `normalize` : dividing by some total count so that the resulting probabilities fall between 0 and 1 and sum to 1
- `relative frequency` : is by dividing the observed frequency of a particular sequence by the observed frequency of a prefix

### 3.1.3 Dealing with scale in large n-gram models
- `log probabilities` : yis log the probabilities ( i - i )
- `triagram` : condition on the previous two words, or more models
- `4-gram` : ( i - i )
- `5-gram` : ( i - i )

## 3.2 Evaluating Language Models : Training and Test Sets
- `extrinsic evalutaion` : evaluate the performance of a LM by embedding it in an application and measure how much the application improves
- `intrinsic evaluation` : measures the quality of a model independent of any application
- `training set` : the data we use to learn the parameters of our model
- `test set` : a different, held-out set of data, not overlapping with the training set, that we use to evaluate the model.
- `data contamination` : training on the test set.
- `development test set` :third dataset, do all our testing on this dataset until the very end, and then we test on the test set once to see how good our model is.

## 3.3 Evaluating Language Models : Perplexity
- `perplexity` : the inverse probability of the test set, normalized by the number of words (or tokens)

### 3.3.1  Perplexity as Weighted Average Branching Factor

## 3.4 Sampling sentences from a language model
- `sampling` : to choose random points according to their likelihood.

## 3.5 Generalizing vs. overfitting the training set

## 3.6 Smoothing, Interpolation, and backoff
- `zeros` : sequences that dont occur in the training set but do occur in the test set.
- `smoothing` or `discounting` : shave off a bit of probability mass from some more frequent events and give it to unseen events.

### 3.6.1 Laplace Smoothing
- `Laplace smoothing` : add one to all the n-gram counts, before we normalize them into probabilities.
- `add-one` : alternative name for add-one smoothing

### 3.6.2 Add-k smoothing
- `add-k` : k from 0 to 1

### 3.6.3 Language Model Interpolation
- `interpolation` : computing a new probability by interpolating (weighting and combining) the trigram, bigram and unigram probabilities.
- `held-out` : is an additional training corpus, so-called because we hold it out from the training data.

### 3.6.4 Stupid Backoff
- `backoff` : in a backoff model, if the n-gram we need has zero counts, we approximate it by backing off to the (n-1)-gram
- `discount` : smooth
- `stupid backoff` : gives up the idea of trying to make the language model a true probability distribution.

## 3.7 Advanced: Perplexity;s Relation to Entropy
- `Entropy` : a measure of information
- `entropy rate` - `per-word-entropy` : the nertopy of this sequence divided by the number of words.
- `stationary` : the probabilities it assigns to a sequence are invariant with respect to shifts in the time index.
- `cross-entropy` : entropy of a word in a model

# 4. Logistic Regression and Text Classification
- `text categorization` : the task of assigning a label or category to a text or document
- `sentiment analysis` : the task of classifying sentiment, the positive or negative orientation that a writer expresses toward some object.
- `spam detection`, assign an email to one of the two classes spam or not-spam
- `authorship attribution` : the task of determining a text's author, relevant to both humanistic and forensic analysis.
- `sigmoid` : ( i - i )
- `softmax` :  ( i - i )
- `logit` : ( i - i )

## 4.1 Machine learning and classification
- `observation` : input
- `supervised machine learning` : a paradign in which, in addition to the input and the set of output classes. 

## 4.2 The sigmoid function
- `bias term` - `intercept` : another real number that;s added to the weighted inputs.
- `dot product` : sum of the products of the corresponding elements of each vector
- `sigmoid` : 
- `logistic function` : 
- `logit` : 
- `y hat`
- $\hat{y}$ : 

## 4.3 Classification with Logistic Regression
- `decision boundary` : the probability that decide ?

### 4.3.1 Sentiment Classification

### 4.3.2 Other classification tasks and features
- `period disambiguation` : deciding if a period is the end of a sentence or part of a word, by classifying each period into one of two classes, EOS(end-of-sentence) and not-EOS. 
- `feature interactions` : complex features that are combinations of more primitive features.
- `feature templates` : abstract specifciation of features.
- `standardize` : centering input values to result in a zero mean 
- `z-score` : transformation of standardize
- `normalize` : 

### 4.3.3 Processing many examples at once

## 4.4 Learning in Logistic Regression
- `loss` : the distance between the system output and the gold output

## 4.5 The cross-entropy loss function
- `cross entropy loss` : a loss function that prefers the correct class labels of the training examples to be more likely

## 4.6 Gradient Descent
- `convex` : has at most one minimum; there are no local minima to get stuck in, so gradient descent starting from any point is guaranteed to find the minimum
- `gradient` : a vector pointing in the direction of the greatest increase in a function
- `learning rate` : the magnitude of the amount to move in gradient descent

### 4.6.1 The Gradient for Logistic Regression

### 4.6.2 The Stochastic Gradient Descent Algorithm
- `hyperparameter` : a special kind of parameter for any machine learning model, chosen by the algorithm designer that affect how the algorithm work

### 4.6.3 Working Through an Example

### 4.6.4 Mini-batch training
- `batch training` : compute the gradient over the entire dataset.
- `mini-batch` : train on a group of m examples (perhaps 512, or 1024) that is less than the whole dataset. 

## 4.7 Multinomial logistic regression
- `multinomial logistic regression` : label each observation with a class k from a set of K classes, under stipulation that only one of these classes is the correct one

### 4.7.1 Softmax
- `softmax` : takes a vector z of K arbitrary values and maps them to a probability distribution, with each value in the range [0, 1], and all values summing to 1.

### 4.7.2 Applying softmax in logistic regression
- `prototype` : represent for each class

### 4.7.3 Features in Multinomial Logistic Regresison

## 4.8 Learning inn Multinomial Logistic Regression
- `negative log likelihood loss` : 

## 4.9 Evaluation : Precision, Recall, F-measure
- `gold labels` : human labels
- `confusion matrix` : is a table for visualizing how an algorithm performs with respect to the human gold labels, using two dimensions, and each cell labeling a set of possible outcomes
- `precision` :  measures the percentage of the items that system detected that are in fact posistive.
- `recall` : measures the percentage of items actually present in the input that were correctly identified by the system
- `F-measure` : metric that incorparates aspects of both precision and recall

### 4.9.1 Evaluating with more than two classes
- `macroaveraging` : compute the performance for each class, and then average over classes.
- `microaveraging` : collect the decisions for all classes into a single confusion matrix, and then compute precision and recall from that table.

## 4.10 Test sets and Cross-validation
- `development test set` - `dev set` : dataset for tuning some parameters and in general decide what the best model is
- `cross-validation` : we choose a number k, and partition our data k disjoint subsets called folds. choose one of those k folds as a test set, train our classifier on the remaining k-1 folds.
- `folds` : k disjoint subsets from a dataset
- `10-fold cross-validation` : split into 10 folds

## 4.11 Statistical Significance Testing
- `effect size` : general results
- `null hypothesis` : ( i - i )
- `p-value` : the probability, assuming the null hypothesis is true
- `statistically significant` : p-value is under threshold to reject the null hypothesis
- `approximate randomization` : common non-parametric tests used in NLP
- `paired` : compare two sets of observations that are aligned : each observation in one set can be paired with an observation in another.

### 4.11.1 The Paired Bootstrap Test
- `bootstrap test` : create many virtual test sets from an observed test set by repeatedly sampling from it
- `bootstraping` : repeatedly drawing large numbers of samples with replacement

## 4.12 Avoiding Harms in Classification
- `representational harms` : caused by a system that demeans a social group.
- `toxicity detection` : detecting hate speech, abuse, harssment, or other kinds of toxic language. 
- `model card` : documents a machine learning model with information like : 
    - training algorithms and parameters, 
    - training data sources, motivation and preprocessing, 
    - evaluation data sources, motivation and preprocessing
    - intended use and users
    - model performance across different demographic or other groups and environmental situations

## 4.13 Interpreting models
- `interpretable` : is that as humans we should know why our algorithms reach the conclusions they do

## 4.14 Advanced : Regularization 
- `overfitting` : perfectly fit details of the training set, too perfectly, modeling noisy factors that just accidentally correlate with the class.
- `generalize` : 
- `regularization` : to penalize large weights. 
- `L2 regularization` : a quadratic function of the weight values named because it uses the L2 norm of the weight values. 
- `L1 regularization` : a linear function of the weight values, the sum of the absolute values of the weights.
- `lasso` ~ `L1 regularization`
- `ridge` ~ `L2 regularization`

## 4.15 Advanced : Deriving the Gradient Equation
- `chain rule` : ( i - i )