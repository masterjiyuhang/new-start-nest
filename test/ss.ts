console.log(111);

const name11: string = 'cch';
console.log(name11);

const arrs = [1, 2, 3, 4, 5];

for (const i in arrs) {
  console.log('🍉 ~ i:', i);
}

for (const i of arrs) {
  console.log('🍉 ~ i:', i);
}

const asyncIterable = (async function* () {
  for (let i = 0; i < 5; i++) {
    await new Promise((resolve) => setTimeout(resolve, 10 * i));
    yield i;
  }
})();
console.log('🍉 ~ asyncIterable ~ asyncIterable:', asyncIterable);
console.log(
  Array.from(
    new Set([Promise.resolve(1), Promise.resolve(2), Promise.resolve(3)]),
  ),
);

const ssss: any[] = Array.of('foo', 'bar');
console.log('🍉 ~ ssss:', ssss);
