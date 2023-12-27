# LeapTracer
### Source code for a beginner tutorial series for using LeapMotion in a clinical simulation


## Introduction
Leap Motion is a relatively low-cost consumer device that provides infrared tracking of a user's hands and fingers in space. The product debuted as an interface for desktop/laptop applications, but its focus has shifted to providing hand data for virtual reality systems.

Leap offers software developer kits, or code libraries that developers can use to interface with their own software, for a variety of programming languages. In this tutorial set, you will use Leap Motion to re-create a clinical test for measuring hand tremor.   Please refer to the full tutorial articles [here](https://medium.com/physiatry/build-a-web-app-to-test-fine-motor-coordination-with-leap-motion-part-1-programming-tutorial-94423d20f8b7). 

## Setup
For the first two parts of the tutorial, you will only need: 

1. Web browser (Chrome, Safari, or Firefox)
2. Text editor (recommend [SublimeText3](https://www.sublimetext.com/3) or [Atom.io](https://atom.io/).
3. Software Libraries
    1. jQuery ([documentation](https://learn.jquery.com/))
    2. jCanvas ([documentation](https://projects.calebevans.me/jcanvas/docs/))

Part 3 introduces the [LeapMotion controller](https://www.leapmotion.com/), an infrared device that tracks hand and finger position in 3D space. You can purchase it [here](https://store-us.leapmotion.com/products/leap-motion-controller).

## Part 1 Tutorial
In this tutorial, you will:

 1. setup an HTML5 canvas
 2. track mouse cursor position with javascript
 3. analyze user performance drawing a straight line

 
## Part 2 Tutorial
This tutorial expands on Part 1. Instead of tracing a straight line,  the user will trace an Archimedes spiral. Spiral tracing has been shown to be a valid method for quantifying essential tremors and Parkinsonian tremor ([Memedi et al 2015](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4610483/), [Saunders-Pullman et al 2008](https://www.ncbi.nlm.nih.gov/pubmed/18074362/)). 

 1. setup an HTML5 canvas and track mouse cursor position
 2. create the Archimedes spiral guide tracing
 3. analyze tracing speed and accuracy

## Part 3 Tutorial
In this third part, we will use LeapMotion, to draw lines and spirals in the air. 

 1. setup LeapMotion controller in Javascript
 2. monitor finger position instead of mouse cursor
 3. analyze tracing speed and accuracy
	
