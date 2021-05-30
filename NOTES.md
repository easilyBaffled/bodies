/
Inversion of Control
We normally we try restrict "work" to the furthest leaf, meaning to have the smallest most specific functions
IoC instead suggets that there can be a single higher up function that does a lot of the preparation to reduce the depth of functions
a(x, y)
|_ b(x, y)
|_ c(x, y)
|_ d(x, y) => x + y
|_ e(x) => x 2
|\_ f(dres, eres) => dres - eres
a(x, y) => f(d(x, y), e(x))

so what is the hightest level function I can raise all of the smaller parts

if `tickBody` is the start and `applyAffectToBody` is the end,
how do I reduce the depth between the steps

I can use composition to create more purposeful functions like I did with `byType`
But I should still focus on compounding at higher levels

when you compound components like

```jsx
const SimplePlayer = (src) => (
  <MediaPlayer video={src}>
    <TimeBar />
    <div className="layout-row">
      <Skip amount={-percentOf(src, 10)} />
      <PlayPause />
      <Skip amount={percentOf(src, 10)} />
    </div>
  </MediaPlayer>
);
```

TimeBar, Skip, PlayPause are completed components (mostly) so it is more like:

```javascript
const SimplePlayer = (src) => {
  const controls = [
    skip({ amount: -percentOf(src, 10) }),
    PlayPause(),
    skip({ amount: percentOf(src, 10) }),
  ];
  return mediaPlayer({ video: src }, layout.row(...controls));
};
```

/
