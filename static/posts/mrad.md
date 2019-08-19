::: title
Calculating the hit chance of dice in tabletop games
:::

::: description
Calculate the hit percentage for a single die. Now do it for several,
the maths becomes difficult surprisingly quick.
:::

In a tabletop game, should you send in a unit that rolls 5 dice that hit on a
6, or 4 dice that hit on a 5?

The chance on a single die is easy to calculate.

```
Die hits on a 4, 3/6 faces hit, that simplifies to 1/2,
so there's a 0.5 probability of a hit.
```

As soon as there's more than one, this deceptively non-simple task requires
**Binomial distribution**. Let's say you're calculating the chance of three
dice with a hit chance of 3/6 getting at least one hit. The notation for this
would be

```
X ~ B(3, 0.5)

P(X ≥ 1)
```

This notation says that X (hits) are **Binomially distributed** among 3
trials with a hit probability of 0.5 (3/6), and we want the probability (P) that
hits are greater than or equal to one.

The calculation for this is then

```
P(X ≥ 1) =
  (3C1 * 0.5^1 * 0.5^2) +
  (3C2 * 0.5^2 * 0.5^1) +
  (3C3 * 0.5^3 * 0.5^0)
```

Where nCr is "n choose r". This means, for example, if we have 3C2, how many
different ways are there to pick 2 different people from a group of 3.

The formula for this involves a fraction with factorials on both the denominator
and numerator. Factorials can very quickly lead to something too large to store
in a computer integer. Luckily, the nCr calculation can be simplified to a
sequence, meaning we can start at knowing that there's only 1 way to pick 0
items from a set of any size.

The pseudocode for this is

```
let result = 1

for (let i = 0; i < r; i++)
  result *= (n - i) / (i + 1)
```

Combining all this, the final Javascript code we end up with is:

```js
function nCr (n, r) {
  let result = 1

  for (let i = 0; i < r; i++) {
    result *= (n - i) / (i + 1)
  }

  return result
}

function binomial (trials, p, successes) {
  let probability = 0

  for (let i = successes; i <= trials; i++) {
    probability += nCr(trials, i) * Math.pow(p, i) * Math.pow(1 - p, trials - i)
  }

  return probability
}

export default binomial
```

To see this in action, try my new responsive web app [M-RAD](http://overflo.me/mrad)
which does all of this calculation for you, as well as allowing you to compare
different situations.

M-RAD is also open sourced on [GitHub](https://github.com/adamsoutar/m-rad) if you're interested in the rest of the way it works.
