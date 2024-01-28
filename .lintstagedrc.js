module.exports = {
  '{apps,libs,tools}/**/*.{js,ts,jsx,tsx,json}': [
    files => `npx nx affected:lint --files=${files.join(',')}`,
    files => `npx nx format:write --files=${files.join(',')}`,
  ],
  '{apps,libs,tools}/**/*.{css,scss}': files => {
    return `npx stylelint --fix`;
  },
};
