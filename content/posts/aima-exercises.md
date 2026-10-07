---
title: My works on AIMA Exercises 
description: A notes for interesting quiz on AIMA T.T
# readingTime: 4 min
---

I dont think I cant do them all within the course so I will RNG the quiz

![My reaction](/post/aima/reaction.gif)

# Preview
You should read the book.

# Part I : Artificial Intelligence 
## 1. Introduction
### 1.1
```
Define in your own words : (a) intelligence, (b) artificial intelligence, (c) agent, (D) rationality, (e) logical reasoning
```

- `Intelligence` : The capacity to perceive, understand, predict, and act effectively in a world that may be much larger and more complex than the intelligent entity itself.
- `Artificial intelligence` : The field concerned with understanding intelligence and building intelligent entities that can compute how to act effectively and safely in a wide variety of novel situations.
- `Rationality` : An abstract standard of intelligence based on doing the right thing, meaning choosing actions that produce the best outcome or best expected outcome.
- `Logical reasoning` : Ability to analyze the situation based on the knowledge from the past via multiple step in-between to conclude the best method/approach to solve the task

### 1.2 
```
Read Turing's original paper on AI Turing : 1950. In the paper, he discusses several objections to his proposed enterprise and his test for intelligence. Which objections still carry weight? Are his refutations valid? Can you think of new objections arising from developements since he wrote the paper? In the paper, he predicts that, by the year 2000, a computer will have a 30% chance of passing a five-minute Turing Test with an unskilled interrogator. What chance do you think a computer would have today? In another 50 years?
```

> I haven't read the paper yet.

### 1.3
```
Every year the Loebner Prize is awarded to the program that comes closet to passing a version of the Turing Test. Research and report on the latest winner of the Loebner prize. What techniques does it use? How does it advance the state of the art in AI?
```

> The prize should be ended at 2019

The last winner is `Mitsuku` - 5 times winner is crazy tbh. He uses AIML for his chatbot. Since AIML gets more stronger the more rule it has, I think it is understandable for his record. However, AIML cant scale up large like LLMs, and around that time is the release of first versions of ChatGPT

### 1.4
```
Are reflex actions (such as flinching from a hot stove) rational? Are they intelligent?
```

Reflex are rational actions. They are intelligent. Tho reflex maybe seems too fast to be judged as a "calculated" action, but it is like a safety boundary to not harm the body that saves into the brain "cache". Thats why it is so fast.

### 1.5
```
There are well-known calsses of problems that are intractably difficult for computers, and other classes that are provably undecisable. Does this mean that AI is impossible?
```

I think if the system itself can acknowledge that if a task is unsolvable, is somekind of successful. Then, we can just inform the users the unsureness in the response. 

### 1.6
```
Suppose we extend Evans's SYSTEM program so that it can score 200 on a standard IQ test. Would we then have a program more intelligent than a human? Explain
```

More intelligent than human in a standard IQ test? Yis. But more intelligent than human in general is different field. There are many more subjects/classes that real life environment providing that human can not fully understand but human still exists until nowadays.

### 1.7
```
The neural structure of the sea slug Aplysis has been widely studied (first by Nobel Laureate Eric Kandel) because it has only about 20,000 neurons, most of them large and easily manipulated. Assuming that the cycle time for an Aplysis neuron is roughly the same as for a human neuron, how does the computational power, in terms of memory updates per second, compare with the high-end computer described in (Figure 1.3)?
```

some simple ~~magic~~ calculation that gives me that the supercomputer faster 5 million times than the Aplysia

### 1.8 
```
How could introspection - reporting on one's inner thoughts - be inaccurate? Could I be wrong about what I'm thinking? Discuss
```

I think the introspection just the surface/final inner thought. And what we are thinking also including the intermediate process, which is not eligible comparing to the final solutions. 

### 1.9
```
To what extent are the following computer systems instances of artificial intelligence: 
- Supermarket bar code scanners
- Web search engines
- Voice-activated telephone menus
- Internet routing algorithms that respond dynamically to the state of the network
```

- I dont think a scanner can be a AI instance ( i - i )
- Web search engines can be an instances of some behavior classification
- Voice-telephone is definately a product of NLP
- AI instance in the routing algorithm can be overkill but if forcefully, I think we can use some agent for judging/finding other paths ? 

### 1.10 
> Why it is duplicated from 1.9 ( i - i )

### 1.11
```
Many of the computational models of cognitive activities that have been proposed involve quite complex mathematical operations, such as convolving an image with a Gaussian or finding a minimum of the entropy function. Most humans (and certainly all animals) never learn this kind of mathematics at all, almost no one learns it before college, and almost no one can compute the convolution of a function with a Gaussian in their head. What sense does it make to say that the "vision system" is doing this kind of mathematics, whereas the actual person has no idea how to do it?
```

The person (or all animals) not do it individually, their behavior is the results of multiple chemical reactions happens in the inner-body. Thus we can seems the "complex magical math" as the cell of the system.

### 1.12 
```
Some authors have claimed that perception and motor skills are the most important part of intelligence, and that "higher level" capacities are necessarily parasitic - simple add-ons to these underlying facilities. Certainly, most of evolution and a large part of the brain have been devoted to perception and motor skills, whereas AI has found tasks such as game playing and logical inference to be easier, in many ways, than perceiving and acting in the real world. Do you think that AI's traditional focus on higher-level cognitive abilities is misplaced ? 
```

Nope, with the development of Robotics, the perception and motor skills of AI can be cover easily. Thus the focus on higher-level cognitive is necessary.

### 1.13
```
Why would evolution tend to result in systems that act rationally? What goals are such systems designed to achieve?
```

I think all systems tends to exists longer over time, thus its behavior overall become more rationally ? 

### 1.14 
```
Is AI a science, or is it engineering? Or neither or both? Explain
```

I think its both. 

It is science because we try to create better models (SOTA models) over time.

It is engineering since from the models, we con config it to suit the task we need to solve

### 1.15
```
"Surely computers cannot be intelligent - they can do only what their programmers tell them." Is the latter statement true, and does it imply the former? 
```

I think it only suits the old-generation now. With the AI models, it can surpass from the train dataset.

### 1.16
```
"Surely animals cannot be intelligent - they can do only what their genes tell them." Is the latter statement true, and does it imply the former? 
```

> I understand the idea now ( i - i )

That is not true, animals can learn after being born. Thus these knowledge not from the genes they had but from their "intelligence". The same for computers.

### 1.17
```
"Surely animals, humans, and computers cannot be intelligent - they can do only what their constituent atoms are told to do by the laws of physics." Is the latter statement true, and does it imply the former?
```

> Plot after plot. Now im no understanding the idea

The latter statement is true, definitely. But it not supports the former statement, it just tells a universal order that rule everything.

### 1.18 
```
Examine the AI literature to discover whether the following tasks can currently be solved by computers: 
- Playing a decent game of table tennis (Ping-Pong)
- Driving in the center of Cairo, Egypt
- Driving in Victorville, California
- Buying a week's worth of groceries on the Web.
- Playing a decent game of bridge at a competitive level
- Discovering and proving new mathematical theorems
- Writing an intentionally funny story 
- Giving competent legal advice in a specialized area of law
- Translating spoken English into spoken Swedish in real time.
- Performing a complex surgical operation. 
```

I think for the current state of AI, it can do all of these things under supervising.

### 1.19
```
For the currently infeasible tasks, try to find out what the difficulties are and predict when, if ever, they will overcome.
```

Since im learning Cryptography, I see that AI is not fully capable solving the EC / PQ problems. For when they overcome, it should around the time the first quantum computer fully functioned

### 1.20
```
Various subfields of AI have held contests by defining a standard task and inviting researchers to do their best. Examples include the DARPA Grande Challenge for robotic cars, the International Planning Competition, the Robocup robotic soccer league, the TREC information retrieval event, and contests in machine translation and speech recognition. Investigate five of these contests and describe the progress made over years. To what degree have the contests advanced the state of the art in AI? To what degree do they hurt the field by drawing energy away from new ideas?
```

> TLDR ( i - i )

## 2. Intelligent Agents
### 2.1 
```
Suppose that the performance measure is concerned with just hte first T time steps of the environment and ignores everything thereafter. Show that a rational agent's action may depend not just on the state of the environment but also on the time step it has reached. 
```

The performance measure will affect heavily the judgement of model when classifying if a move is "good" or "bad". Thus a rational agent's action may ddepend also on the time step it has reached.

### 2.2 (vacuum-rationality-exercise)
```
Let us examine the rationality of various vacuum-cleaner agent functions.
1. Show that the simple vacuum-cleaner agent function described in Figure 2.3 is indeed rational under the assumptions listed on page
2. Describe a rational agent function for the case in which each movement costs one point. Does the corresponding agent program require internal state? 
3. Discuss possible agent designs for the cases in which clean squares can become dirty and the geography of the environment is unknown. Does it make sense for the agent to learn from its experience in these cases  ? If so, what should it learn? If not, why not ? 
```

1. It is rational since if its place is dirty, it cleans and if not, it moves to other places. IF all the places is clean, it is still rational since moving has no penalty
2. If each move costs one point, then non-stop agent will be irrational if it has no ability to aware when to stop. 
3. 