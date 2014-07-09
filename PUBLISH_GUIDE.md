# gem build

1. modify version number(bump up) in lib/infogra/version.rb
2. $grunt build
3. $gem build infogra.gemspec
4. $gem push infogra-{version}.gem

# node package build

1. modify version number(bump up) in package.json
2. $grunt build
3. check infogra.js, infogra-min.js
4. npm publish
