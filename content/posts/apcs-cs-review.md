---
title: CVM Computer Science & C++ Revision
date: 2025-12-21
description: Notes about the CS course for APCS juniors.
---
    
## Question 1s in previous exam
### K22 Midterm:
* What is the differences between the **prefix** and **postfix** form of the increment/decrement operator?
* What is the main difference between a **while** loop and a **do...while** loop?

### K23 Final:
* In C/C++, how to read and write data from and to a text file? Give an example to illustrate

### K23 Midterm:
* What are the differencecs between call by value and call by referene for functions?
* How a string of characters is defined in C++? Can we use the extraction operator, such as `cin >> str` to input a string? How to input a string properly?

### K24 Final:
* What are the differences between a **Stack** and a **Queue**?
* What are the advantages and disadvantages of a **singly linked list** comparing to an **array**?
* What are the advantages of storing data in a **binary file** comparing to a **text file**?

### K24 Midterm:
* What is a **variable** in programming? How to declare and input an integer?
* In C++, what are the differences between a **string** and an **array** of integers? How to input a string and an array of integers?
* What is a **struct**? Give an example of a struct and input data to that struct from the keyboard in C++?

## Week 1: Introduction to Computer Science & Algorithms

### Computer Systems & Hardware
**1. What are the main components of a computer system?**

The main components are:
* **Input Devices:** Devices used to send data to the computer (e.g., keyboard, mouse).
* **Output Devices:** Devices used to display results (e.g., monitor, printer).
* **Memory:** Stores data and instructions (e.g., RAM, Hard Drive).
* **CPU (Central Processing Unit):** The "brain" that processes instructions.

**2. What is the difference between RAM and ROM?**
* **RAM (Random Access Memory):** Volatile memory (data is lost when power is off). It is used for reading and writing data while programs are running.
* **ROM (Read-Only Memory):** Non-volatile memory (data remains without power). It is typically used to store firmware/boot instructions and is read-only.

**3. What are examples of input and output devices?**
* **Input:** Keyboard, Mouse, Microphone, Scanner, Webcam.
* **Output:** Monitor, Projector, Printer, Speakers, Headphones.

**4. What is a bit and what is a byte?**
* **Bit:** The smallest unit of data in a computer, represented as a 0 or 1.
* **Byte:** A group of 8 bits. It is the standard unit for storage (e.g., storing a single character).

### Programming Concepts
**5. What is an algorithm?**
An algorithm is a step-by-step set of instructions or rules designed to solve a specific problem or perform a computation.

**6. What are the steps to solve a problem using a computer?**
Typically:
1.  **Analyze the problem:** Understand inputs, outputs, and requirements.
2.  **Design an algorithm:** Create a flowchart or pseudo-code.
3.  **Implement (Coding):** Write the solution in a programming language (e.g., C++).
4.  **Test and Debug:** Fix errors and verify results.
5.  **Maintain:** Update and optimize.

**7. What is the difference between machine code, pseudo-code, and source code?**
* **Source Code:** High-level code written by humans (e.g., `int main() { ... }`).
* **Pseudo-code:** A plain-language description of an algorithm, not executable by a machine.
* **Machine Code:** Binary instructions (0s and 1s) directly executed by the CPU.

**8. What is the software life cycle?**
The software development life cycle (SDLC) includes: Requirement Analysis, Design, Implementation (Coding), Testing, Deployment, and Maintenance.

**9. What is a compiler and what does it do?**
A compiler is a program that translates the entire high-level source code into machine code (executable file) so the computer can run it.

---

## Week 2: C++ Overview, Input & Output

### C++ Basics
**1. What is the basic structure of a C++ program?**
It generally consists of:
* **Preprocessor Directives:** e.g., `#include <iostream>`
* **Main Function:** `int main() { ... }` where execution begins.
* **Statements:** Instructions ending with semicolons `;`.

**2. How do you declare variables in C++?**
Syntax: `DataType VariableName;` or `DataType VariableName = Value;`
Example: `int score = 100;`

**3. What are the rules for naming variables?**
* Must start with a letter or underscore (`_`).
* Can contain letters, digits, and underscores.
* Cannot be a reserved keyword (e.g., `if`, `class`).
* Case-sensitive (e.g., `Score` and `score` are different).

**4. What are the basic data types in C++?**
* `int` (Integer)
* `float` / `double` (Floating-point numbers)
* `char` (Character)
* `bool` (Boolean - true/false)
* `void` (Empty/No type)

### Input/Output (I/O)
**5. How do you use std::cin and std::cout?**
* `std::cout << variable;` prints to the screen (Insertion operator `<<`).
* `std::cin >> variable;` takes input from the user (Extraction operator `>>`).

**6. How do you format the output (e.g., setting precision)?**
Use the `<iomanip>` library.
* `std::fixed`: Use fixed-point notation.
* `std::setprecision(n)`: Set the number of digits after the decimal point.

**7. How do you read from and write to text files in C++?**
Use the `<fstream>` library.
* `std::ifstream file("input.txt");` for reading.
* `std::ofstream file("output.txt");` for writing.

---

## Week 3: Conditional Statements & Repetition

### Conditionals
**1. How does the if-else statement work?**
It evaluates a boolean condition. If `true`, the code block inside `if` executes. If `false`, the code block inside `else` (if provided) executes.

**2. What is the syntax for a switch-case statement?**
```cpp
switch (expression) {
    case value1:
        // code
        break;
    default:
        // code
}