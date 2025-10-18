const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("./src/assets/js/");
  eleventyConfig.addPassthroughCopy({ "src/snippets": "snippets" });

  // Add global data for base path
  eleventyConfig.addGlobalData("basePath", "/LLM-Snippets");

  // Create a collection from snippets.json
  eleventyConfig.addCollection("snippets", function (collectionApi) {
    try {
      const snippetsData = JSON.parse(fs.readFileSync("./src/storage/snippets.json", "utf8"));
      console.log(`Loaded ${snippetsData.length} snippets from snippets.json`);
      
      const basePath = "/LLM-Snippets";
      
      return snippetsData.map(snippet => {
        snippet.url = `${basePath}/snippets/${snippet.category}/${snippet.slug}/`;
        
        // Handle preview image path
        if (snippet.previewImage && !snippet.previewImage.startsWith('http')) {
          snippet.preview = `${basePath}/snippets/${snippet.category}/${snippet.slug}/${snippet.previewImage}`;
        } else {
          snippet.preview = snippet.previewImage;
        }
        
        console.log(`Snippet: ${snippet.slug} -> URL: ${snippet.url}`);
        return snippet;
      });
    } catch (error) {
      console.error('Error loading snippets.json:', error);
      return [];
    }
  });

  // Filter to read snippet code file content
  eleventyConfig.addFilter("readFile", function(snippet) {
    const fullPath = path.join("src/snippets", snippet.category, snippet.slug, snippet.codeFile);
    try {
      const content = fs.readFileSync(fullPath, "utf8");
      console.log(`Read file: ${fullPath}`);
      return content;
    } catch (e) {
      console.error(`Error reading file: ${fullPath}`, e.message);
      return `Error: File not found at ${fullPath}`;
    }
  });

  // Filter to get unique categories
  eleventyConfig.addFilter("uniqueCategories", function(snippets) {
    if (!Array.isArray(snippets)) return [];
    const categories = snippets.map(s => s.category);
    return [...new Set(categories)];
  });

  // Add custom capitalize filter
  eleventyConfig.addFilter("capitalize", function(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  });

  // Add debugging filter
  eleventyConfig.addFilter("dump", function(obj) {
    return JSON.stringify(obj, null, 2);
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
    markdownTemplateEngine: "njk",
    pathPrefix: "/LLM-Snippets/"
  };
};