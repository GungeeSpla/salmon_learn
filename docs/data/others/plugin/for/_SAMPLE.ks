
[plugin name=for]

[for name=f.i from=1 to=5]
  [emb exp=f.i]、
[nextfor]

。[p]

[for name=f.i from=3 len=3]
  [emb exp=f.i]、
[nextfor]

・[p]


[iscript]
f.array = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
[endscript]

[foreach name=f.item array=f.array]
  [emb exp=f.item]、
[nextfor]
。[p]

[foreach name=f.item array=f.array from=2 to=4]
  [emb exp=f.item]、
[nextfor]

。[p]

[foreach name=f.item array=f.array from=3 len=5]
  [emb exp=f.item]、
[nextfor]

。[p]

[foreach name=f.item array=f.array from=7 len=5]
  [emb exp=f.item]、
[nextfor]

。[p]

[foreach name=f.item array=f.array from=999]
  [emb exp=f.item]、
[nextfor]

。[p]

[for name=f.i from=1 to=5]
  [emb exp=f.i]、
  [breakfor cond=f.i>2]
[nextfor]

。[p]

[for name=f.i from=1 to=9]
  [for name=f.j from=1 to=3 deep=1]
    [emb exp=f.i*f.j]、
  [nextfor deep=1]
[nextfor]