# Artic-Circle

## Link
This project has been deployed through Github Pages and is available at
https://xianacarrera.github.io/Artic-Circle/

The following image shows a preview of the page:

![imagen](https://user-images.githubusercontent.com/71279558/217004887-8a600ef0-2aa2-43a9-b619-7fce7d254313.png)

## Acknowledgements
Inspired by Mathologer's Artic Circle Theorem [video](https://youtu.be/Yy7Q8IWNfHM). Based on the paper [Random Domino Tilings and the Arctic Circle Theorem](https://arxiv.org/abs/math/9801068) by William Jockusch, James Propp and Peter Shor.

## Explanation
The purpose of this interactive demo was to show the behaviour of the [Aztec Diamond](https://en.wikipedia.org/wiki/Aztec_diamond), both for mathematical interest and as a way for me to learn more about JavaScript, as this was my first project using the language.

This combinatorial problem presents a grid in the shape of a diamond, divided into squared tiles. To be precise, an Aztec Diamond of dimension $n$ consists of all the tiles whose centers $(x, y)$ satisfy $|x| + |y| \leq n$.


![imagen](https://user-images.githubusercontent.com/71279558/216983683-9da1c640-0694-467b-a159-81f99c5a3626.png)

This grid is iteravely filled with vertical or horizontal dominoes of size $2 \times 1$ or $1 \times 2$, respectively. At each iteration, several steps take place:

1. All $2 \times 2$ squares that are currently empty are filled with an orange square, which represents that this space will be filled.
2. The orange squares are transformed into two horizontal or two vertical dominoes (with a default probability of 50% for each option). 
    * If they are horizontal, the top one will be blue, and the bottom one will be green. 
    * If they are vertical, the left one will be yellow, and the red one will be red.
3. The size of the grid, $n$, is incremented: $n = n + 1$.
4. All dominoes (both the ones that were genereated at this iteration and the ones that were already present) move following these rules:
    * Blue dominoes move one space up.
    * Green dominoes move one space down.
    * Yellow dominoes move one space left.
    * Red dominoes move one space right.
    
This ''dance'' can be repeated for an unlimited number of iterations. 

## Interpretation
Interestingly, the top, bottom, left and right parts of the grid will end up being filled up with blue, red, yellow and red dominoes, respectively. These are called ''frozen regions''.

On the other hand, the central region has a chaotic behaviour. The limit between this region and the frozen ones receives the name ''Artic Circle''. 

The Artic Circle Theorem states that, when the number of iterations tends to infinity, the Artic Circle will be a perfect circle inscribed in a perfect diamond.

![imagen](https://user-images.githubusercontent.com/71279558/216986868-83eb53ca-6f5a-42b6-8113-8aa589a0aecd.png)

![imagen](https://user-images.githubusercontent.com/71279558/216988181-11b8922c-7508-4cd2-bfc1-1a6c1f4dbe8e.png)






