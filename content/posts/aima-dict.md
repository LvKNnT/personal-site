---
title: Some random interesting AIMA phrase 
description: A short note for quick check while grinding papers
# readingTime: 4 min
---

Yes, this note uses `this-website` template 🍊.

![Eleanor](/work/img/this-website.jpg)

# Chapter 1 : Introduction
- `Intelligence` : The capacity to perceive, understand, predict, and act effectively in a world that may be much larger and more complex than the intelligent entity itself.
- `Artificial intelligence` : The field concerned with understanding intelligence and building intelligent entities that can compute how to act effectively and safely in a wide variety of novel situations.

## 1.1 What is AI ? 
- `Rationality` : An abstract standard of intelligence based on doing the right thing, meaning choosing actions that produce the best outcome or best expected outcome.

### 1.1.1 Acting humanly : The Turing test approach
- `Turing test` : A thought experiment in which a computer passes if a human interrogator, communicating through written questions, cannot reliably distinguish its responses from a person's.
- `Natural language processing` : The ability to understand and generate human language well enough to communicate successfully.
- `Knowledge representation` : The use of internal structures to store what an intelligent system knows or is told.
- `Automated reasoning` : The computational process of answering questions and deriving new conclusions from represented knowledge.
- `Total Turing Test` : An extension of the Turing test that requires interaction with objects and people in the physical world, adding perception and physical action.
- `Computer vision` : The computational ability to perceive and interpret visual information from the world.
- `Robotics` : The study and construction of machines that can sense, manipulate objects, and move through the physical world.

### 1.1.2 Thinking humanly : The cognitive modeling approach
- `Introspection` : The attempt to observe and examine one's own thoughts as they occur.
- `Psychological experiment` : A controlled observation of people performing tasks, used to study human thought and behavior.
- `Brain imaging` : The observation of brain activity to investigate how physical neural processes relate to cognition.
- `Cognitive science` : An interdisciplinary field that combines computational models from AI with experimental methods from psychology to build precise, testable theories of the mind.

### 1.1.3 Thinking rationally : The "laws of thought" approach
- `Syllogism` : A pattern of argument that guarantees a correct conclusion when its premises are correct.
- `Logicist` : Describing the AI tradition that aims to create intelligent systems through formal logic and programs that derive valid conclusions.
- `Probability` : A mathematical framework for rigorous reasoning when information is uncertain rather than known with certainty.

### 1.1.4 Acting rationally : The rational agent approach
- `Agent` : Something that acts; a computer agent is generally expected to operate autonomously, perceive its environment, persist, adapt, and pursue goals.
- `Rational agent` : An agent that acts to achieve the best outcome or, under uncertainty, the best expected outcome.
- `Do the right thing` : Choose the action that best satisfies the objective supplied to the agent, given the available information and uncertainty.
- `Standard model` : The dominant AI paradigm in which a machine is given an objective and is designed to choose actions that optimize that objective.
- `Limited rationality` : Acting appropriately when time, information, or computational resources are insufficient to calculate the perfectly optimal action.

### 1.1.5 Beneficial machines
- `Value alignment problem` : The problem of making the values or objectives placed in a machine agree with the true preferences of the humans it is meant to serve.
- `Provably beneficial` : Describing an agent whose design provides formal reasons to expect that its behavior will benefit humans, despite uncertainty about their exact objectives.

## 1.2 The Foundations of Artificial Intelligence

### 1.2.1 Philosophy
- `Dualism` : The view that part of the human mind or soul exists outside nature and is not governed by physical laws.
- `Empiricism` : The view that knowledge originates in sensory experience rather than being present independently of experience.
- `Induction` : The process of acquiring general rules from repeated observations or associations among their elements.
- `Logical positivism` : The doctrine that all knowledge can be expressed as logical theories ultimately connected to sensory observations.
- `Observation sentences` : Statements tied directly to sensory inputs, providing the empirical foundation to which logical theories are connected.
- `Confirmation theory` : The study of how evidence should increase or decrease the degree of belief assigned to a statement.
- `Utility` : A numerical representation of the internal, subjective value of an outcome to a decision maker.
- `Utilitarianism` : The ethical view that rational choices, including public policy, should maximize overall utility across affected individuals.
- `Deontological ethics` : Rule-based ethics in which whether an action is right depends on universal duties or laws, not solely on its consequences.

### 1.2.2 Mathematics
- `Formal logic` : A mathematically precise language and set of inference rules for representing statements and deriving valid conclusions.
- `Probability` : A mathematical theory that generalizes logical reasoning to uncertain information and supports updating beliefs when new evidence arrives.
- `Statistics` : The field that combines probability, experimental design, data analysis, and computation to draw conclusions from observed data.
- `Algorithm` : A finite, effective procedure that specifies a sequence of steps for solving a problem or performing a computation.
- `Incompleteness theorem` : Godel's result that any consistent formal theory strong enough to express elementary arithmetic contains true statements that cannot be proved within that theory.
- `Computability` : The study of which functions and problems can be solved by an effective procedure, commonly formalized by what a Turing machine can compute.
- `Tractability` : The practical feasibility of solving a problem with available computational resources; problems requiring exponentially growing time are generally considered intractable.
- `NP-completeness` : A classification for problems to which every problem in NP can be efficiently reduced; such problems are widely believed to be intractable in the general case.

### 1.2.3 Economics
- `Decision theory` : A framework combining probability and utility theory to choose among actions when their outcomes are uncertain.
- `Operations research` : The field that applies mathematical optimization to complex decisions, especially sequences of actions whose rewards occur over time.
- `Satisficing` : Choosing an option that is good enough instead of spending the effort required to calculate the optimal choice.

### 1.2.4 Neuroscience
- `Neuroscience` : The study of the nervous system, particularly the brain and how it processes information.
- `Neuron` : A nerve cell whose electrochemical activity and connections with other neurons contribute to perception, thought, and action.
- `Optogenetics` : A technique that makes selected neurons light-sensitive so their activity can be measured and controlled with light.
- `Brain-machine interface` : A direct communication link between neural activity and an external device for sensing, control, or restoring function.
- `Singularity` : A hypothesized point at which computers reach superhuman performance and then rapidly improve themselves further.

### 1.2.5 Psychology
- `Behaviorism` : An approach that rejects unobservable mental processes as evidence and studies only objective stimuli and the behavioral responses they produce.
- `Cognitive psychology` : The study of the mind that treats the brain as an information-processing device and explains behavior using internal processes such as beliefs and goals.
- `Intelligence augmentation` : The use of computers to extend human abilities and collective work rather than simply automate human tasks away.

### 1.2.6 Computer engineering
- `Moore's law` : The historical trend that computer performance and component density roughly doubled about every 18 months, while cost per unit of computation fell.
- `Quantum computing` : Computation using quantum-mechanical effects, which may provide very large speedups for certain important classes of AI algorithms.

### 1.2.7 Control Theory and cybernetics
- `Control theory` : The mathematical study of systems that use feedback to choose actions and maintain or optimize behavior over time.
- `Cybernetics` : The study of communication, feedback, and self-regulation in machines and living systems.
- `Homeostatic` : Describing a system that uses feedback loops to maintain a stable state while adapting to changes.
- `Cost function` : A numerical objective that measures the quality or penalty of a system's behavior and is optimized over time by a controller.

### 1.2.8 Linguistic
- `Computational linguistics` : The interdisciplinary field at the intersection of linguistics and AI that builds computational models for analyzing and using human language.

## 1.3 The History of Artificial Intelligence
### 1.3.1 The inception of artificial intelligence (1943 - 1956)
- `Hebbian learning` : A learning rule that changes the strength of connections between neurons according to their activity, often summarized as strengthening connections between units that activate together.

### 1.3.2 Earyly enthusisam, great expectations (1952 - 1969)
- `Physical symbol system` : A system that represents information as symbol structures and produces intelligent action by manipulating those structures.
- `Lisp` : A high-level programming language defined by John McCarthy in 1958 that became the dominant language for AI research for roughly three decades.
- `Microworld` : A small, deliberately limited problem domain used to study an aspect of intelligence under simplified conditions.
- `Blocks world` : A classic AI microworld consisting of solid blocks on a tabletop, used to study language, perception, planning, and manipulation.

### 1.3.3 A dose of reality (1966 - 1973)
- `Machine evolution` : An early form of what is now called genetic programming, in which programs are mutated and selected according to their performance.

### 1.3.4 Expert systems (1969 - 1986)
- `Weak method` : A general-purpose search or reasoning method that uses little domain knowledge and therefore tends not to scale to large or difficult problems.
- `Expert systems` : AI programs that encode specialized human knowledge and rules to solve problems in a narrow domain of expertise.
- `Certainty factor` : A numerical measure used by early expert systems such as MYCIN to represent how strongly uncertain evidence supports or opposes a conclusion.
- `Frames` : Structured knowledge representations that group facts about object or event types and organize those types into a taxonomic hierarchy.

### 1.3.5 The return of neural networks (1986 - present)
- `Connectionist` : Describing models, especially neural networks, in which knowledge and computation emerge from many interconnected simple units rather than explicit symbolic rules.

### 1.3.6 Probilistic reasoning and machine learning (1987 - present)
- `Hidden Markov models` : Probabilistic sequence models with unobserved states that generate observable data, trained from examples and historically important in speech recognition.
- `Bayesian network` : A graphical probabilistic model that represents uncertain knowledge and conditional dependencies, supporting efficient probabilistic reasoning.

### 1.3.7 Big data (2001 - present)
- `Big data` : Extremely large data sets, such as collections containing trillions of words or billions of images, that enable learning methods designed to exploit data at massive scale.

### 1.3.8 Deep learning (2011 - present)
- `Deep learning` : Machine learning using multiple layers of simple, adjustable computing elements to learn increasingly useful representations from data.

## 1.4 The State of the Art
- `AI Index` : An AI100 initiative and recurring report that tracks measurable progress, activity, and trends in artificial intelligence.

## 1.5 Risks and Benefits of AI
- `Human-level AI` : A machine intelligence capable of learning to perform anything a human can do.
- `Artificial general intelligence (AGI)` : The goal of creating broadly capable intelligence that can learn and reason across many domains rather than only perform a narrow task.
- `Artificial superintelligence (ASI)` : Intelligence that far surpasses human ability.
- `Gorilla problem` : The risk that humans could lose control of their future after creating a more intelligent species, as gorillas lost control relative to humans.
- `King Midas problem` : The danger that a machine will satisfy the literal objective it was given while producing disastrous results that violate the user's real intent.
- `Assistance game` : A mathematical game in which a human has an objective and a machine tries to help achieve it while initially being uncertain about what that objective is.
- `Inverse reinforcement learning` : A method for inferring human preferences or reward objectives by observing the choices and behavior humans demonstrate.
