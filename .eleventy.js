const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("./src/assets/js/");
  eleventyConfig.addPassthroughCopy({ "src/snippets": "snippets" });
  
  // IMPORTANT: Don't copy CSS here - it's already built to _site by Tailwind

  // Create a collection from snippets.json
  eleventyConfig.addCollection("snippets", function (collectionApi) {
    const snippetsData = JSON.parse(fs.readFileSync("./src/storage/snippets.json", "utf8"));
    return snippetsData.map(snippet => {
      snippet.url = `/snippets/${snippet.category}/${snippet.slug}/`;
      if (snippet.previewImage && !snippet.previewImage.startsWith('http')) {
        snippet.preview = `/snippets/${snippet.category}/${snippet.slug}/${snippet.previewImage}`;
      } else {
        snippet.preview = snippet.previewImage;
      }
      return snippet;
    });
  });

  // Filter to read snippet code file content
  eleventyConfig.addFilter("readFile", function(snippet) {
    const fullPath = path.join("src/snippets", snippet.category, snippet.slug, snippet.codeFile);
    try {
      return fs.readFileSync(fullPath, "utf8");
    } catch (e) {
      console.error(`Error reading file: ${fullPath}`, e);
      return "Error: File not found.";
    }
  });

  // Filter to get a unique list of categories for the homepage
  eleventyConfig.addFilter("uniqueCategories", function(snippets) {
      const categories = snippets.map(s => s.category);
      return [...new Set(categories)];
  });

  // Add custom capitalize filter
  eleventyConfig.addFilter("capitalize", function(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["html", "njk", "md"],
    htmlTemplateEngine: "njk",
  };
};
