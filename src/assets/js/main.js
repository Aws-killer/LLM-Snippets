document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const snippetGrid = document.getElementById('snippet-grid');
    const noResults = document.getElementById('no-results');
    const categoryFilters = document.getElementById('category-filters');

    if (!snippetGrid) return;

    const cards = Array.from(snippetGrid.getElementsByClassName('card-wrapper'));
    let activeCategory = 'all';

    function filterAndSearch() {
        const query = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;

        cards.forEach(cardWrapper => {
            const card = cardWrapper.querySelector('.card');
            const title = card.dataset.title.toLowerCase();
            const description = card.dataset.description.toLowerCase();
            const tags = card.dataset.tags.toLowerCase();
            const category = cardWrapper.dataset.category.toLowerCase();

            const matchesCategory = activeCategory === 'all' || category === activeCategory;
            const matchesSearch = title.includes(query) || description.includes(query) || tags.includes(query);

            const isVisible = matchesCategory && matchesSearch;

            cardWrapper.style.display = isVisible ? 'block' : 'none';
            if (isVisible) visibleCount++;
        });

        if (noResults) {
            noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        }
    }

    // Event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', filterAndSearch);
    }

    // Event listener for category filters
    if (categoryFilters) {
        categoryFilters.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                // Update active button styles
                const currentActive = categoryFilters.querySelector('.active');
                if (currentActive) {
                    currentActive.classList.remove('active', 'bg-cyan-400/80', 'text-black');
                    currentActive.classList.add('bg-white/10', 'text-gray-300');
                }

                e.target.classList.add('active', 'bg-cyan-400/80', 'text-black');
                e.target.classList.remove('bg-white/10', 'text-gray-300');

                // Set active category and filter
                activeCategory = e.target.dataset.category;
                filterAndSearch();
            }
        });
    }

    // --- Copy to Clipboard Functionality ---
    const copyButton = document.getElementById('copy-button');
    const codeBlock = document.getElementById('code-block');

    if (copyButton && codeBlock) {
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
                copyButton.textContent = 'Copied!';
                setTimeout(() => { copyButton.textContent = 'Copy Code'; }, 2000);
            }, () => {
                copyButton.textContent = 'Failed!';
            });
        });
    }
});