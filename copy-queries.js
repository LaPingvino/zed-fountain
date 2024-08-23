const { execSync } = require("child_process");
const fs = require("fs");
const toml = require("toml");

const extension = toml.parse(fs.readFileSync("./extension.toml", "utf8"));

execSync(`
  git clone ${extension.grammars.fountain.repository} &&
  cd tree-sitter-fountain &&
  git checkout ${extension.grammars.fountain.commit}
`);
fs.cpSync(
  `tree-sitter-fountain/queries/highlights.scm`,
  `languages/fountain/highlights.scm`,
);
fs.rmSync("tree-sitter-fountain", { recursive: true, force: true });
