const prettyhtml = require('./../packages/prettyhtml')

// example with angular template
const result = prettyhtml(
  `<template>
    <v-select>
      <template slot="selection" scope="data">
        <v-chip>{{getChipString(data.item)}}</v-chip>
        <span>{{data.item.name}}</span>
      </template>
      <template slot="item" scope="data">
        <v-chip>{{getChipString(data.item)}}</v-chip> {{data.item.name}}
      </template>
    </v-select>
  </template>`
)

console.log(result.contents)
