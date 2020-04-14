#!/usr/bin/env node

// const [, , ...args] = process.argv
// console.log(`Aquaria called with arguments: ${args}`)

let exec = require('child_process').exec

exec('./node_modules/forever/bin/forever stop ./app.js')
console.log(`Stopping process...`)

exec('npm run build')
console.log(`Build process...`)

exec('./node_modules/forever/bin/forever start ./app.js')
console.log(`Starting process...`)