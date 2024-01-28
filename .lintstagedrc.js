module.exports = {
  '{apps,libs,tools}/**/*.{js,ts,jsx,tsx}': [
    files => `npx nx affected:lint --fix --files=${files.join(',')}`,
    files => `npx nx format:write --files=${files.join(',')}`,
  ],
  '{apps,libs,tools}/**/*.{css,scss}': [
    `npx stylelint --fix`
  ],
  '{apps,libs,tools}/**/*.{css,scss,html}': [
    files => `npx nx format:write --files=${files.join(',')}`,
  ],
};
