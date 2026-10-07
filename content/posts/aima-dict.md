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

# Chapter 2 : Intelligent Agents
## 2.1 Agents and Environments
- `Environment` : The part of the universe whose state matters when designing an agent: it affects what the agent perceives and is affected by the agent's actions.
- `Sensor` : A mechanism through which an agent receives information from its environment.
- `Actuator` : A mechanism through which an agent acts upon and changes its environment.
- `Percept` : The content that an agent's sensors are perceiving at a particular moment.
- `Percept sequence` : The complete history of everything an agent has perceived.
- `Agent function` : An abstract mathematical mapping from every possible percept sequence to an action.
- `Agent program` : The concrete implementation of an agent function running on a physical computing system.

## 2.2 Good Behavior : The Concept of Rationality
- `Rational agent` : An agent that selects actions expected to maximize its performance measure, given its percept history and built-in knowledge.

### 2.2.1 Performance measures
- `Consequentialism` : The view that behavior should be evaluated by the desirability of its consequences.
- `Performance measure` : A criterion that evaluates the sequence of environment states produced by an agent's actions.

### 2.2.2 Rationality
- `Definition of a rational agent` : For every possible percept sequence, the agent should choose the action expected to maximize its performance measure, based on the percept evidence and its built-in knowledge.

### 2.2.3 Omniscience, learning, and autonomy
- `Omniscience` : Complete knowledge of the actual outcomes of every action; unlike rationality, it is impossible for real agents.
- `Information gathering` : Taking actions to improve future percepts and reduce uncertainty before making later decisions.
- `Learning` : Modifying or extending prior knowledge from experience so the agent can improve its future behavior.
- `Autonomy` : The extent to which an agent's behavior depends on its own percepts and learning rather than only on knowledge supplied by its designer.

## 2.3 The Nature of Environments
- `Task environment` : The problem setting for a rational agent, specified by the performance measure, environment, actuators, and sensors.

### 2.3.1 Specifying the task environment
- `PEAS` : An acronym for Performance measure, Environment, Actuators, and Sensors, the four elements used to specify a task environment.
- `Software agent` : A program that perceives and acts within a virtual environment, such as by reading input, sending messages, or modifying files.
- `Softbot` : Short for software robot; another name for a software agent operating in a virtual environment.

### 2.3.2 Properties of task environments
- `Fully observable` : Describing an environment in which the sensors reveal every aspect of the current state relevant to choosing an action.
- `Partially observable` : Describing an environment in which noise, inaccurate sensors, or missing information prevents the agent from observing the complete relevant state.
- `Unobservable` : Describing an environment in which the agent has no sensors and therefore receives no state information directly.
- `Single-agent` : Describing an environment where only one agent's decisions need to be modeled as optimizing a performance measure.
- `Multiagent` : Describing an environment containing multiple agents whose actions and performance measures can affect one another.
- `Competitive` : Describing a multiagent setting in which improving one agent's performance reduces another agent's performance.
- `Cooperative` : Describing a multiagent setting in which actions can improve the performance of multiple agents together.
- `Deterministic` : Describing an environment where the current state and executed action completely determine the next state.
- `Nondeterministic` : Describing an environment where an action can lead to several possible next states without quantified probabilities.
- `Stochastic` : Describing an environment model that explicitly assigns probabilities to possible outcomes.
- `Episodic` : Describing a task divided into independent episodes in which the action for one episode does not affect later episodes.
- `Sequential` : Describing a task in which a current decision can affect future decisions and outcomes.
- `Static` : Describing an environment that does not change while the agent is deliberating.
- `Dynamic` : Describing an environment that can change while the agent is deliberating, so the passage of time itself matters.
- `Semidynamic` : Describing an environment whose state stays fixed while the agent deliberates but whose performance score changes with time.
- `Discrete` : Describing states, time steps, percepts, or actions drawn from distinct, countable alternatives.
- `Continuous` : Describing states, time, percepts, or actions that vary smoothly across a range of values.
- `Known` : Describing a setting in which the outcomes, or outcome probabilities, of all actions are given to the agent.
- `Unknown` : Describing a setting in which the agent must learn how its actions affect the environment.
- `Environment class` : A collection or distribution of related environments across which an agent's average performance is evaluated.

## 2.4 The Structure of Agents
- `Agent program` : The program that implements the agent function by receiving percepts and returning actions.
- `Agent architecture` : The computing device, sensors, and actuators on which an agent program runs and through which it interacts with the environment.

### 2.4.1 Agent programs

### 2.4.2 Simple reflex agents
- `Simple reflex agent` : An agent that selects an action solely from the current percept, ignoring the rest of its percept history.
- `Condition-action rule` : A rule that connects a recognized condition directly to an action, commonly written in if-then form.
- `Randomization` : The deliberate use of chance to choose among actions, which can avoid predictable behavior or help a simple agent escape loops.

### 2.4.3 Model-based reflex agents
- `Internal state` : The agent's stored conception of aspects of the current world that are not directly visible in the latest percept.
- `Transition model` : Knowledge of how the world changes over time, including the effects of the agent's actions and independent environmental changes.
- `Sensor model` : Knowledge of how states of the world produce the percepts received by the agent.
- `Model-based agent` : An agent that uses transition and sensor models to maintain an estimate of the world's current state.

### 2.4.4 Goal-based agents
- `Goal` : An explicit description of one or more desirable situations that an agent tries to achieve.

### 2.4.5 Utility-based agents
- `Utility` : A numerical measure of how desirable a state or outcome is to an agent.
- `Utility function` : An internal representation of the performance measure that assigns utility values to states or outcomes.
- `Expected Utility` : The probability-weighted average utility of an action's possible outcomes.
- `Model-free agent` : An agent that learns which actions are best in particular situations without learning exactly how those actions change the environment.

### 2.4.6 Learning agents 
- `Learning element` : The component that uses feedback to improve the agent by modifying its performance element or knowledge.
- `Performance element` : The component that receives percepts and selects the agent's external actions.
- `Critic` : The component that evaluates how well the agent is doing against a fixed performance standard and supplies feedback to the learning element.
- `Problem generator` : The component that proposes exploratory actions likely to produce new and informative experiences.
- `Reward` : Positive feedback from the performance standard indicating that behavior contributed favorably to the agent's performance.
- `Penalty` : Negative feedback from the performance standard indicating that behavior reduced the agent's performance.

### 2.4.7 How the components of agent programs work
- `Atomic representation` : A representation in which each world state is an indivisible black box with no internal structure.
- `Factorized representation` : A representation that describes each state using a fixed set of variables or attributes and their values.
- `Variable` : A named component of a factored state whose value may differ from one state to another.
- `Attribute` : A property used to describe some aspect of a state or object in a representation.
- `Value` : The particular Boolean, numeric, symbolic, or other setting assigned to a variable or attribute.
- `Structured representation` : A representation that explicitly describes objects, their attributes, and relationships among objects.
- `Expressiveness` : The range and conciseness of facts or distinctions that a representation language can capture.
- `Localist representation` : A representation with a one-to-one mapping between concepts and physical memory locations.
- `Distributed representation` : A representation in which each concept is spread across many memory locations and each location participates in representing many concepts.

## Bibliographical and Historial Notes
- `Controller` : In control theory, the component that selects actions from observations; its role is equivalent to an agent in AI.
- `Autonomic computing` : The design of computer systems and networks that monitor and control themselves through a perceive-act loop and learning methods.

# Chapter 3 : Solving problems by Searching
- `Problem-solving agent` : An agent that plans ahead by considering action sequences that form paths to a goal state.
- `Search` : The computational process of exploring possible action sequences to find a path that reaches a goal.

## 3.1 Problem-Solving Agents
- `Goal formulation` : The process of adopting a goal that organizes behavior by limiting the objectives and actions the agent needs to consider.
- `Problem formulation` : The construction of an abstract model describing the states and actions relevant to reaching a goal.
- `Search` : Simulating action sequences in the problem model until a sequence reaching a goal is found or failure is established.
- `Solution` : A sequence of actions, or path, that leads from the initial state to a goal state.
- `Execution` : Performing the actions in a chosen solution, one at a time, in the real environment.
- `Open-loop` : A control approach that executes a fixed solution without monitoring new percepts, breaking the feedback loop between agent and environment.
- `Closed-loop` : A control approach that monitors percepts during execution and adjusts future actions when the model or environment may differ from expectations.

### 3.1.1 Search problems and solutions
- `Problem` : A formal search specification consisting of states, an initial state, goal states, available actions, a transition model, and action costs.
- `States` : The possible configurations that the environment can occupy in the problem model.
- `State space` : The complete set of possible states together with the actions that connect them.
- `Initial state` : The state in which the problem-solving agent begins.
- `Goal states` : One or more states, or states satisfying a stated property, that count as successful outcomes.
- `Action` : An operation available to the agent that can transform one state into another.
- `Applicable` : Describing an action that can legally be executed in a particular state.
- `Transition model` : A model that returns the state resulting from applying an action in a given state.
- `Action cost function` : A function that assigns a numeric cost to applying an action in one state to reach another state.
- `Path` : A sequence of actions and the corresponding sequence of states through the state space.
- `Optimal solution` : A solution with the lowest path cost among all possible solutions.
- `Graph` : A representation of a state space whose vertices are states and whose directed edges are actions.

### 3.1.2 Formulating problems
- `Abstraction` : The deliberate removal of details from a problem representation so search can focus on distinctions relevant to finding a solution.
- `Level of abstraction` : The chosen degree of detail in a problem model; it should omit irrelevant complexity while retaining actions that can be carried out in the real world.

## 3.2 Example Problems
- `Standardized problem` : A simplified problem with a concise, agreed-upon formulation that is useful for comparing search algorithms.
- `Real-world problem` : A practical problem whose solutions are actually used and whose formulation is usually specific to its application.

### 3.2.1 Standardized problems
- `Grid world` : A rectangular array of cells in which an agent moves between obstacle-free adjacent cells and may interact with objects in the cells.
- `Sokoban puzzle` : A grid-world puzzle in which an agent pushes boxes through free cells into designated storage locations.
- `Sliding-tile puzzle` : A puzzle in which tiles arranged on a grid slide into one or more blank spaces to reach a specified arrangement.
- `8-puzzle` : A sliding-tile puzzle on a 3 by 3 grid containing eight numbered tiles and one blank space.
- `15-puzzle` : A sliding-tile puzzle on a 4 by 4 grid containing fifteen numbered tiles and one blank space.

### 3.2.2 Real-world problems
- `Touring problem` : A problem that requires visiting a specified set of locations rather than reaching only one destination.
- `Traveling salesperson problem (TSP)` : A touring problem that seeks a lowest-cost tour visiting every city, or a tour below a specified cost.
- `VLSI layout` : The problem of positioning components and routing their connections on a chip while optimizing area, delay, capacitance, and manufacturing yield.
- `Robot navigation` : A route-finding problem in a continuous or high-dimensional space where a robot must plan collision-free motion despite physical and sensing constraints.
- `Automatic assembly sequencing` : The task of finding a feasible and efficient order in which a robot can assemble an object's parts.
- `Protein design` : The search for an amino-acid sequence that folds into a three-dimensional protein with desired properties.

## 3.3 Search Algorithms
- `Search algorithm` : An algorithm that takes a search problem as input and returns a solution or an indication of failure.
- `Node` : A search-tree record corresponding to a state and usually storing its parent, generating action, and path cost.
- `Expand` : To apply the available actions at a node's state and create nodes for the resulting states.
- `Generating` : The process of creating a new search node for a state produced by an applicable action.
- `Child node` : A node generated by expanding another node, linked to that node as its parent.
- `Successor node` : Another name for a child node produced by applying an action during expansion.
- `Parent node` : The node from which a child or successor node was generated.
- `Frontier` : The set of generated search-tree nodes that have not yet been expanded.
- `Reached` : Describing a state for which at least one node has already been generated, whether or not that node has been expanded.
- `Separator` : The frontier's role as the boundary between the expanded interior of the state-space graph and the unreached exterior.

### 3.3.1 Best-first search
- `Best-first search` : A strategy that expands the frontier node with the minimum value of an evaluation function.
- `Evaluation function` : A function `f(n)` that scores search nodes and determines which frontier node best-first search expands next.

### 3.3.2 Search data structures
- `Queue` : A data structure that stores frontier nodes and defines the order in which they are removed for expansion.
- `Priority queue` : A queue that removes the node with the minimum value under an evaluation function.
- `FIFO queue` : A first-in, first-out queue that removes the node that has been waiting the longest.
- `LIFO queue` : A last-in, first-out queue that removes the most recently added node first.
- `Stack` : Another name for a LIFO queue.

### 3.3.3 Redundant path
- `Repeated state` : A state represented by more than one node or encountered again along a path in the search tree.
- `Cycle` : A path that returns to a state already visited on that same path.
- `Loopy path` : Another name for a cyclic path that revisits an earlier state.
- `Redundant path` : A path that reaches a state already reachable by a cheaper or otherwise preferable path and need not be explored for an optimal solution.
- `Graph search` : Search that records reached states and checks for redundant paths.
- `Tree-like search` : Search that does not maintain a reached-state table and therefore does not generally detect redundant paths.

### 3.3.4 Measuring problem-solving performance
- `Completeness` : The property of being guaranteed to find a solution when one exists and correctly report failure otherwise.
- `Cost optimality` : The property of returning a solution with the lowest path cost among all solutions.
- `Space complexity` : The amount of memory an algorithm requires during search.
- `Systematic` : Describing a search that is capable of exploring every state reachable from the initial state rather than becoming trapped in one region or infinite path.
- `Depth` : The number of actions along a path; `d` commonly denotes the depth of an optimal solution and `m` the maximum path depth.
- `Branching factor` : The number of successor nodes per node that a search algorithm must consider, commonly denoted `b`.

### 3.4 Uninformed Search Strategies

### 3.4.1 Breadth-first search
- `Breadth-first search` : A strategy that expands the root first and then expands nodes in order of increasing depth, normally using a FIFO frontier.
- `Early goal test` : Checking whether a newly generated node is a solution before adding it to the frontier.
- `Late goal test` : Checking whether a node is a solution only when it is removed from the frontier for expansion.

### 3.4.2 Dijkstra's algorithm or uniform-cost search
- `Uniform-cost search` : A best-first strategy that expands the node with the lowest path cost `g(n)`, equivalent to Dijkstra's algorithm for graph search.

### 3.4.3 Depth-first search and the problem of memory
- `Depth-first search` : A strategy that always expands the deepest frontier node first, usually using a LIFO frontier and tree-like search.
- `Backtracking search` : A memory-efficient depth-first variant that generates one successor at a time and modifies, then undoes, a single current state description.

### 3.4.4 Depth-limited and iterative deepening search
- `Depth-limited search` : Depth-first search with a fixed limit that treats nodes at the limiting depth as having no successors.
- `Diameter` : The greatest, over all pairs of states in a state-space graph, of the shortest-path depth between the pair.
- `Iterative deepening search` : Repeated depth-limited search with limits 0, 1, 2, and so on until a solution is found or failure is established.

### 3.4.5 Bidirectional search
- `Bidirectional search` : Search that proceeds forward from the initial state and backward from the goal state or states until the two frontiers meet.

### 3.4.6 Comparing uninformed search algorithms 

## 3.5 Informed (Heuristic) Search Strategies
- `Informed search` : Search that uses domain-specific hints about the location or cost of reaching goals.
- `Heuristic function` : A function `h(n)` that estimates the cost of the cheapest path from node `n` to a goal state.

### 3.5.1 Greedy best-first search
- `Greedy best-first search` : Best-first search using `f(n) = h(n)`, expanding the node estimated to be closest to a goal.
- `Straight-line distance` : The direct geometric distance between two locations, often used as a route-finding heuristic.

### 3.5.2 A* search
- `A* search` : Best-first search using `f(n) = g(n) + h(n)`, combining the path cost so far with the estimated remaining cost.
- `Admissible heuristic` : A heuristic that never overestimates the true cost of reaching a goal.
- `Consistency` : The property that for every successor `n'` reached from `n`, `h(n)` is no greater than the action cost plus `h(n')`.
- `Triangle inequality` : The principle that one side of a triangle cannot exceed the sum of the other two, expressed for a consistent heuristic as `h(n) <= c(n,a,n') + h(n')`.

### 3.5.3 Search contours
- `Contour` : A boundary in state space containing nodes whose evaluation values are at or below a given threshold.
- `Monotonic` : Describing a value that never decreases along a path; with positive action costs, path cost is strictly increasing.
- `Surely expanded nodes` : Nodes reachable on paths whose every node has `f(n) < C*`; A* must expand them before returning an optimal solution of cost `C*`.
- `Optimally efficient` : Describing A* with a consistent heuristic when no comparable optimal algorithm using the same heuristic can avoid expanding its surely expanded nodes.
- `Pruning` : Eliminating possibilities from consideration without explicitly examining all of them.

### 3.5.4 Satisficing search : Inadmissible heuristic and weighted A*
- `Inadmissible heuristic` : A heuristic that may overestimate the true remaining cost, potentially sacrificing optimality for faster search.
- `Detour index` : A multiplier applied to straight-line distance to estimate the extra distance introduced by the curvature and layout of actual routes.
- `Weighted A* search` : A* using `f(n) = g(n) + W * h(n)` for `W > 1`, emphasizing the heuristic to reduce search effort at the risk of higher solution cost.
- `Bounded suboptimal search` : Search guaranteed to return a solution whose cost is within a fixed factor of the optimal cost.
- `Bounded-cost search` : Search for any solution whose cost is below a specified constant bound.
- `Unbounded-cost search` : Search that accepts a solution of any cost in exchange for finding one quickly.
- `Speedy search` : A greedy best-first method whose heuristic estimates the number of actions to a goal while ignoring their individual costs.

### 3.5.5 Memory-bounded search
- `Reference count` : A count of how many remaining paths can reach a state, allowing its reached-table entry to be removed when no paths still refer to it.
- `Beam search` : A memory-limited strategy that keeps only a fixed number of the best frontier nodes and discards the rest.
- `Iterative-deepening A* search` : A memory-efficient A* variant that repeatedly performs depth-first searches bounded by increasing `f = g + h` thresholds.
- `Recursive best-first search` : A linear-space best-first method that recursively follows the best path while retaining the evaluation value of the best alternative.
- `Backed-up value` : A value propagated from the best child or forgotten subtree to its ancestor so the search remembers that subtree's promise.
- `MA*` : Memory-bounded A*, an A* variant designed to use all available memory and forget less promising nodes when memory is full.
- `SMA*` : Simplified memory-bounded A*, which drops the worst leaf when memory is full and backs its value up to its parent for possible regeneration.
- `Thrashing` : Repeatedly discarding and regenerating competing search paths because too few of them fit in memory, causing severe time overhead.

### 3.5.6 Bidirectional heuristic search
- `Front-to-end` : A bidirectional heuristic approach in which each direction estimates distance to the opposite endpoint.
- `Front-to-front` : A bidirectional heuristic approach in which a search estimates distance from a node to the opposite search frontier.

## 3.6 Heuristic Functions
- `Manhattan distance` : The sum of horizontal and vertical distances between positions, also called city-block distance.

### 3.6.1 The effect of heuristic accuracy on performance
- `Effective branching factor` : The branching factor `b*` a uniform tree of solution depth `d` would need to contain the same number of nodes generated by a search.
- `Effective depth` : A model of heuristic benefit in which pruning reduces the exponent of search cost from the true depth `d` to `d - k_h`.
- `Domination` : The relation where one admissible heuristic is at least as large as another for every node and therefore generally expands no more nodes under A*.

### 3.6.2 Generating heuristics from relaxed problems
- `Relaxed problem` : A simplified problem formed by removing constraints; its optimal solution cost is a lower bound and thus an admissible heuristic for the original problem.

### 3.6.3 Generating heuristics from subproblems : Pattern databases
- `Subproblem` : A smaller portion of the original problem whose solution cost can help estimate the cost of solving the whole problem.
- `Pattern database` : A table of exact solution costs for every instance of a chosen subproblem, used as a lookup-based admissible heuristic.
- `Disjoint pattern databases` : Pattern databases for nonoverlapping subproblems whose individual cost estimates can be added without overestimating the full solution cost.

### 3.6.4 Generating heuristics with landmarks
- `Precomputation` : Computing and storing reusable optimal path information once so later search requests can be answered much faster.
- `Landmark point` : A selected graph vertex for which exact costs to and from other vertices are precomputed to support heuristic estimates.
- `Shortcuts` : Artificial graph edges that represent optimal multi-action paths and allow search to traverse large portions of a route in one step.
- `Differential heuristic` : An admissible landmark heuristic based on the absolute difference between a node-to-landmark cost and a goal-to-landmark cost.

### 3.6.5 Learning to search better
- `Metalevel state space` : A space whose states describe the internal computational state of a search program and whose actions are computation steps.
- `Object-level state space` : The ordinary problem state space, such as locations on a map, over which the agent seeks an action path.
- `Metalevel learning` : Learning from prior searches which computational actions to take so unpromising subtrees can be avoided and total problem-solving cost reduced.

### 3.6.6 Learning heuristics from experience
- `Feature` : A measurable property of a state that helps a learned model predict the state's heuristic value.

## Bibliographical and Historical Notes
- `Coarse-to-fine search` : Hierarchical search that first reasons at broad levels of abstraction and then progressively refines the promising route or solution.
- `Branch-and-bound` : An optimization technique that branches into subproblems and discards any branch whose bound shows it cannot beat the best known solution.
- `Iterative expansion` : A memory-bounded heuristic search closely related to RBFS that repeatedly expands nodes within a changing evaluation bound.

# Chapter 4 : Search in Complex Environments
## 4.1 Local Search and Optimization Problems
- `Local search` : Search that moves from a current state to neighboring states while keeping little or no path history, usually because only the final state matters.
- `Optimization problem` : A problem whose goal is to find the best state according to a numerical objective.
- `Objective function` : A function that assigns a value or cost to each candidate state so solutions can be compared.
- `State-space landscape` : A view of states as points whose elevation is given by the objective function, revealing peaks, valleys, ridges, and plateaus.
- `Global maximum` : A state whose objective value is at least as high as every other state in the entire state space.
- `Global minimum` : A state whose objective value is at most as low as every other state in the entire state space.

### 4.1.1 Hill-climbing search
- `Hill-climbing` : A local search method that repeatedly replaces the current state with a higher-valued neighbor and stops when no neighbor is better.
- `Steepest ascent` : Choosing the neighboring state that produces the greatest immediate increase in the objective value.
- `Complete-state formulation` : A formulation in which every state contains all components of a solution, although some components may be incorrectly arranged.
- `Greedy local search` : Another name for hill climbing, emphasizing that it selects a good immediate neighbor without looking ahead.
- `Local maximum` : A state better than all its neighbors but worse than the global maximum.
- `Ridge` : A sequence of local maxima that is difficult for a greedy algorithm to follow because useful progress may require coordinated or non-uphill moves.
- `Plateau` : A flat region of the state-space landscape where many neighboring states have the same value.
- `Shoulder` : A plateau from which an uphill path eventually continues, unlike a flat local maximum.
- `Sideways move` : A move to a neighboring state with the same objective value, used to cross a plateau in search of further progress.
- `Stochastic hill climbing` : Hill climbing that randomly selects among uphill moves, often with probabilities related to their steepness.
- `First-choice hill climbing` : A stochastic variant that generates successors randomly until it finds one better than the current state.
- `Random-restart hill climbing` : Repeated hill-climbing searches from independently generated initial states until a satisfactory solution is found.

### 4.1.2 Simulated annealing
- `Simulated annealing` : A stochastic local search that sometimes accepts worse moves, with their probability gradually reduced by a cooling schedule so exploration gives way to hill climbing.

### 4.1.3 Local beam search
- `Local beam search` : Search that maintains `k` current states, generates all their successors, and retains the `k` best successors for the next iteration.
- `Stochastic beam search` : A beam-search variant that selects successors with probability proportional to their value, helping maintain diversity.

### 4.1.4 Evolutionary algorithms
- `Evolutionary algorithms` : Population-based stochastic search methods inspired by biological evolution, in which fitter individuals produce the next generation.
- `Recombination` : Producing offspring by combining parts of one or more parent representations.
- `Genetic algorithm` : An evolutionary algorithm whose individuals are strings over a finite alphabet and whose offspring are created through selection, crossover, and mutation.
- `Evolution strategies` : Evolutionary methods in which each individual is represented as a sequence of real-valued parameters.
- `Genetic programming` : Evolutionary search in which the individuals being selected and recombined are computer programs.
- `Selection` : The process of choosing individuals to become parents, commonly giving fitter candidates a greater probability of being selected.
- `Crossover point` : A chosen position at which parent strings are split so their parts can be recombined into offspring.
- `Mutation rate` : The probability that each component of a newly generated offspring is randomly changed.
- `Elitism` : Preserving some top-scoring parents in the next generation so the population's best fitness cannot decrease.
- `Schema` : A partially specified string pattern representing a set of candidate individuals with some positions left unrestricted.
- `Instance` : A fully specified individual that matches a particular schema.

## 4.2 Local Search in Continuous Spaces
- `Variable` : One component of the `n`-dimensional vector used to describe a state in a continuous state space.
- `Discretization` : Replacing a continuous range with a finite grid or sampled set of values so discrete search methods can be applied.
- `Empirical gradient` : An estimate of progress obtained by comparing objective values at nearby points rather than differentiating a formula.
- `Gradient` : The vector of partial derivatives that gives the direction and magnitude of the steepest increase in an objective function.
- `Step size` : The scalar amount by which a gradient method moves in the selected direction on each update.
- `Line search` : A method that searches along the current gradient direction to choose an effective step size.
- `Newton-Raphson` : An iterative root-finding method that can optimize a function by seeking a point where its gradient is zero, using derivative information.
- `Hessian` : The matrix of second partial derivatives of a function, describing its local curvature.
- `Constrained optimization` : Optimization in which valid solutions must satisfy hard restrictions on the variables.
- `Linear programming` : Constrained optimization with a linear objective and linear-inequality constraints forming a convex feasible region.
- `Convex set` : A set containing the entire line segment between any two of its points.
- `Convex optimization` : Optimization over a convex feasible region with an objective that is convex within that region.

## 4.3 Search with Nondeterministic Actions 
- `Belief state` : The set of physical states that an agent currently considers possible.
- `Conditional plan` : A branching strategy that specifies future actions according to the percepts and action outcomes observed during execution.

### 4.3.1 The erratic vacuum world

### 4.3.2 AND-OR search trees
- `Or node` : A node where the agent chooses one of several available actions, so finding a solution through any one choice is sufficient.
- `And node` : A node representing nondeterministic outcomes, all of which must have successful continuation plans.
- `And-or tree` : A search tree alternating OR nodes for agent choices with AND nodes for all possible environmental outcomes.

### 4.3.3 Try, try again
- `Cyclic solution` : A conditional solution that may revisit a state and repeat an action until a favorable nondeterministic outcome occurs.

## 4.4 Search in Partially Observable Environments

### 4.4.1 Searching with no observation
- `Sensorless` : Describing a problem in which the agent receives no perceptual information about the current physical state.
- `Conformant` : Another name for a sensorless problem or plan that must succeed without observations.
- `Coercion` : Using actions to force all possible initial states into the same desired state despite having no observations.
- `Incremental belief-state search` : Search that constructs one action sequence by checking and extending it against the physical states in a belief state one at a time.

### 4.4.2 Searching in partially observable environments

### 4.4.3 Solving partially observable problems

### 4.4.4 An agent for partially observable environments
- `Monitoring` : Maintaining and updating an agent's belief about the current state as actions and percepts arrive.
- `Filtering` : Recursively estimating the current belief state from the previous belief state, the latest action, and the latest observation.
- `State estimation` : Computing an estimate or distribution over the current physical state from actions and perceptual evidence.
- `Localization` : Determining an agent's location from a map together with a sequence of actions and percepts.

## 4.5 Online Search Agents and Unknown Environments
- `Offline search` : Search that computes a complete solution before the agent executes its first action.
- `Online search` : Search that interleaves computation, action, and observation, choosing later actions from information gained during execution.
- `Mapping problem` : An exploration task in which an agent placed in an unknown environment acts to construct a map for later navigation.

### 4.5.1 Online search problems
- `Competitive ratio` : The ratio between an online agent's incurred path cost and the optimal path cost it could achieve with advance knowledge of the environment.
- `Dead end` : A reachable state from which no goal state can be reached.
- `Adversary argument` : A proof technique that imagines an adversary revealing or constructing the environment to force any algorithm into a bad choice.
- `Irreversible action` : An action whose effects cannot be undone to return the agent to the previous state.
- `Safely explorable` : Describing a state space in which some goal is reachable from every reachable state.

### 4.5.2 Online search agents

### 4.5.3 Online local search
- `Random walk` : Exploration that randomly selects an available action from the current state, optionally preferring actions not yet tried.
- `LRTA*` : Learning Real-Time A*, an online agent that learns cost-to-go estimates from experience and chooses actions using the current estimated costs of neighboring states.
- `Optimism under uncertainty` : Treating untried actions as if they lead to an excellent outcome, thereby encouraging exploration of unknown possibilities.

### 4.5.4 Learning in online search

### Bibliographical and Historical Notes :
- `Tabu search` : A hill-climbing variant that forbids revisiting a fixed number of recently visited states, improving graph-search efficiency and helping escape local optima.
- `Heavy-tailed distribution` : A distribution whose probability of extremely long runtimes is greater than an exponential model would predict, making random restarts useful.
- `Eulerian graph` : A directed graph in which every vertex has equal numbers of incoming and outgoing edges.

# Chapter 5 : Adversarial Search and Games
- `Adversarial search` :

## 5.1 game Theory
- `Economy` :
- `Prunching` :
- `Imperfect information` :

### 5.1.1 Two-player zero-sum games
- `Perfect information` :
- `Zero-sum games` :
- `Move` :
- `Position` :
- `Transition model` :
- `Terminal test` :
- `Terminal state` :
- `State space graph` :
- `Search tree` :
- `Game tree` :

## 5.2 Optimal Decisions in Games
- `Minimax search` :
- `Ply` :
- `Minimax value` :

### 5.2.1 The minimax search algorithm

### 5.2.2 Optimal decisions in multiplayer games
- `Alliance` :

### 5.2.3 Alpha-Beta Pruning
- `Alpha-beta pruning` :

### 5.2.4 Move ordering
- `Killer moves` :
- `Transposition` :
- `Transposition table` :
- `Type A strategy` :
- `Type B strategy` :

## 5.3 Heuristic Alpha-Beta Tree Search
- `Cutoff test` :

### 5.3.1 Evaluation functions
- `Features` :
- `Expected value` :
- `Material value` :
- `Weighted linear function` :

### 5.3.2 Cutting off search
- `