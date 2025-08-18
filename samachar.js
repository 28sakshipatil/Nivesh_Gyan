document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '57baba8cb8e64e9fb311946425eea886'; // <-- PASTE YOUR API KEY HERE
    const newsContainer = document.getElementById('news-container');
    const filterContainer = document.querySelector('.filter-container');
    const loadMoreBtn = document.getElementById('load-more-btn');

    // State variables
    let allArticles = [];
    let articlesDisplayedCount = 0;
    let activeFilter = 'finance'; // UPDATED: Default filter is now 'finance'
    const articlesPerLoad = 5;

    // Static news for fallback (you can add more static examples if you like)
    const staticNews = [
        { title: "SEBI Mandates Additional Disclosures for High-Risk FPIs", description: "The Securities and Exchange Board of India has tightened norms...", url: "#", source: { name: "Nivesh Gyan Archives" }, category: "guidelines" },
        { title: "Understanding the New Tax Regime", description: "A simple guide to the changes in the income tax slabs and deductions for the current financial year.", url: "#", source: { name: "Nivesh Gyan Archives" }, category: "taxation" },
        { title: "Major Bank Announces Quarterly Results", description: "India's leading private sector bank reported a 15% increase in net profit for the quarter.", url: "#", source: { name: "Nivesh Gyan Archives" }, category: "banks" },
        { title: "Tech IPO sees massive oversubscription on day one", description: "The initial public offering for the new-age tech company was oversubscribed 10 times within hours of opening.", url: "#", source: { name: "Nivesh Gyan Archives" }, category: "ipo" }
    ];

    async function fetchAndDisplayNews() {
        // ... (fetch logic remains the same) ...
        newsContainer.innerHTML = '<p>Loading latest financial news...</p>';
        const query = '(SEBI OR NISM OR "stock exchange" OR BSE OR NSE OR "stock market" OR finance OR investment OR crypto OR "mutual fund" OR tax OR ipo) AND (india)';
        const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${apiKey}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();
            allArticles = data.articles.map(categorizeArticle).filter(a => a.title && a.description);
            resetAndRender();
        } catch (error) {
            console.error('Failed to fetch live news, showing static content:', error);
            allArticles = staticNews.map(categorizeArticle); // Also categorize static news
            resetAndRender();
        }
    }

    function resetAndRender() {
        articlesDisplayedCount = 0;
        newsContainer.innerHTML = '';
        loadMoreArticles();
    }

    function loadMoreArticles() {
        // This logic now filters based on the activeFilter state
        const filteredArticles = allArticles.filter(article => {
            // A special check for the 'finance' category to include general news too
            if (activeFilter === 'finance') {
                return article.category === 'finance' || article.category === 'general';
            }
            return article.category === activeFilter;
        });
        
        const nextArticleIndex = articlesDisplayedCount;
        const articlesToLoad = filteredArticles.slice(nextArticleIndex, nextArticleIndex + articlesPerLoad);

        articlesToLoad.forEach(article => {
            const articleEl = document.createElement('article');
            articleEl.innerHTML = `
                <h3><a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a></h3>
                <p class="source">Source: ${article.source.name} | Category: ${article.category}</p>
                <p>${article.description}</p>
            `;
            newsContainer.appendChild(articleEl);
        });

        articlesDisplayedCount += articlesToLoad.length;

        if (articlesDisplayedCount < filteredArticles.length) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
        }

        if (articlesDisplayedCount === 0 && newsContainer.innerHTML === '') {
            newsContainer.innerHTML = `<p>No news found for the category: ${activeFilter}.</p>`;
        }
    }

    // UPDATED: The full categorization function
    function categorizeArticle(article) {
        const content = (article.title + (article.description || "")).toLowerCase();
        
        if (content.includes('sebi') || content.includes('guideline')) article.category = 'guidelines';
        else if (content.includes('rbi') || content.includes('bank')) article.category = 'banks';
        else if (content.includes('stock') || content.includes('sensex') || content.includes('nifty')) article.category = 'stocks';
        else if (content.includes('alert') || content.includes('warning')) article.category = 'alert';
        else if (content.includes('investment') || content.includes('portfolio')) article.category = 'investment';
        else if (content.includes('crypto') || content.includes('bitcoin')) article.category = 'crypto';
        else if (content.includes('mutual fund') || content.includes('mf')) article.category = 'mutual-funds';
        else if (content.includes('ipo') || content.includes('initial public offering')) article.category = 'ipo';
        else if (content.includes('tax') || content.includes('gst')) article.category = 'taxation';
        else if (content.includes('finance') || content.includes('economy') || content.includes('budget')) article.category = 'finance';
        else article.category = 'general'; // Fallback for uncategorized news
        
        return article;
    }

    // Event listener for filter buttons
    filterContainer.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            
            activeFilter = e.target.getAttribute('data-filter');
            resetAndRender();
        }
    });

    loadMoreBtn.addEventListener('click', loadMoreArticles);

    fetchAndDisplayNews();
});