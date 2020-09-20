# Sudoku Solver Visualizer

###### Built in VanillaJs, HTML and CSS

This application visualizes how three different algorithms solve sudoku puzzles.
[https://minakhamesi.github.io/Sudoku-Solver-Visualizer/](https://minakhamesi.github.io/Sudoku-Solver-Visualizer/)

###### Three algorithms used in this application are:
 * backtracking
 * best-first search
 * Algorithm X implemented with dancing links.

###### application demo on desktop
![](desktop.gif)

##### application demo on mobile 

<img src="mobile.gif" width="450" height="720"/>

## Algorithm X by Dancing Links

I learnt the algorithm X during this project, since I found the learning resources for self taught enthusiasts hard to find, I thought I share my experience.

The "go to" resource for learning about Dancing Links is "Dancing Link" article by Donald E. Knuth.
[https://www.ocf.berkeley.edu/~jchu/publicportal/sudoku/0011047.pdf](https://www.ocf.berkeley.edu/~jchu/publicportal/sudoku/0011047.pdf)

But after tons of research and reading through different resources, I found these two articles most helpful. After spending days on underestanding the algorithm X, dansing links and exact cover problem, I finally had my first 'eureka' moment after reading these articles:

[https://www.geeksforgeeks.org/exact-cover-problem-algorithm-x-set-1/?ref=rp](https://www.geeksforgeeks.org/exact-cover-problem-algorithm-x-set-1/?ref=rp)

[https://www.geeksforgeeks.org/exact-cover-problem-algorithm-x-set-2-implementation-dlx/](https://www.geeksforgeeks.org/exact-cover-problem-algorithm-x-set-2-implementation-dlx/)

After underestanding algorithm X and dancing links, I still felt I need more insight on how to define a sudoku problem as an exact cover problem and how to structure the matrix(aka nodes in the doubly linked list). The following resource hepled me in this phase:

[https://www.kth.se/social/files/58861771f276547fe1dbf8d1/HLaestanderMHarrysson_dkand14.pdf](https://www.kth.se/social/files/58861771f276547fe1dbf8d1/HLaestanderMHarrysson_dkand14.pdf)

