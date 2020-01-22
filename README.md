# That-GUI

A fresh graphical user interface for manipulating JavaScript objects.

## Installation

npm:
`npm install that-gui`

yarn:
`yarn add that-gui`

## Basic Usage

```js
import 'that-gui'

window.addEventListener('load', event => {
  const settings = {
    number: 9,
    string: 'hello world',
    checkbox: false,
    menu: 'default',
    _menu: { options: ['default', 'option2'] },
    button: () => {alert('hello world')}
  }
  const gui = new ThatGui()
  gui.add({ settings })
})
```
