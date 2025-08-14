// ThoughtScape Blog Application
class ThoughtScapeBlog {
    constructor() {
        this.posts = [
            {
                id: 1,
                title: "The Art of Contemplation in Modern Life",
                category: "Philosophy",
                excerpt: "In our fast-paced world, the ancient practice of contemplation offers a pathway to deeper understanding and inner peace...",
                content: "In our fast-paced world, the ancient practice of contemplation offers a pathway to deeper understanding and inner peace. The art of contemplation is not merely thinking, but a deeper form of reflection that allows us to explore the fundamental questions of existence.\n\nContemplation requires us to slow down, to create space between stimulus and response, and to engage with ideas not just intellectually but experientially. When we contemplate, we don't just think about life—we feel it, we embody it, we become present to its mysteries.\n\nThis practice has been recognized by philosophers throughout history, from the ancient Stoics to modern thinkers like Martin Heidegger, who emphasized the importance of 'being-with' our thoughts rather than simply having them.",
                readTime: "5 min read",
                date: "2025-08-10"
            },
            {
                id: 2,
                title: "Society's Digital Mirror: Reflections on Our Connected Age",
                category: "Society",
                excerpt: "How social media has become a reflection of our deepest desires for connection while paradoxically creating new forms of isolation...",
                content: "Social media platforms have become the digital mirrors of our time, reflecting not just our daily activities but our deepest desires for connection, validation, and belonging. Yet in this quest for digital connection, we often find ourselves more isolated than ever.\n\nThe paradox of our connected age is that while we have unprecedented access to information and people, we struggle with genuine intimacy and deep conversation. We've traded depth for breadth, meaningful dialogue for quick exchanges of likes and emojis.\n\nThis transformation of human interaction raises profound questions about the nature of community, authenticity, and what it means to truly know another person in the digital age.",
                readTime: "7 min read",
                date: "2025-08-08"
            },
            {
                id: 3,
                title: "The Language of Literature: Words as Windows to the Soul",
                category: "Literature",
                excerpt: "Exploring how great literature transcends mere storytelling to become a medium for understanding the human condition...",
                content: "Literature has always been more than entertainment or mere storytelling. The greatest works of literature serve as windows into the human soul, offering insights that scientific analysis alone cannot provide.\n\nWhen we read Dostoevsky's exploration of guilt and redemption, or Virginia Woolf's stream-of-consciousness revelations about the inner life, we're not just consuming content—we're engaging in a form of spiritual archaeology, uncovering truths about what it means to be human.\n\nThe language of literature operates on multiple levels simultaneously: the literal narrative, the symbolic subtext, and the emotional resonance that speaks directly to our lived experience.",
                readTime: "6 min read",
                date: "2025-08-05"
            }
        ];
        
        this.currentFilter = 'all';
        this.currentSearch = '';
        this.editingPostId = null;
        this.nextId = 4;
    }

    init() {
        this.setInitialTheme();
        this.renderPosts();
        this.bindEvents();
        this.setActiveNavLink('all');
    }

    bindEvents() {
        // Navigation and filtering - using event delegation
        document.addEventListener('click', (e) => {
            // Category navigation
            if (e.target.matches('.nav__link[data-category]')) {
                e.preventDefault();
                const category = e.target.getAttribute('data-category');
                this.filterPosts(category);
                return;
            }

            // Write button
            if (e.target.matches('#writeBtn')) {
                e.preventDefault();
                this.openWriteModal();
                return;
            }

            // Modal close buttons
            if (e.target.matches('#closeModal') || e.target.matches('#modalBackdrop')) {
                e.preventDefault();
                this.closeWriteModal();
                return;
            }

            if (e.target.matches('#closeReadModal') || e.target.matches('#readModalBackdrop')) {
                e.preventDefault();
                this.closeReadModal();
                return;
            }

            if (e.target.matches('#cancelBtn')) {
                e.preventDefault();
                this.closeWriteModal();
                return;
            }

            // Theme toggle
            if (e.target.matches('#themeToggle') || e.target.closest('#themeToggle')) {
                e.preventDefault();
                this.toggleTheme();
                return;
            }

            // Post card interactions
            if (e.target.matches('.edit-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const postId = parseInt(e.target.getAttribute('data-post-id'));
                this.editPost(postId);
                return;
            }

            if (e.target.matches('.delete-btn')) {
                e.preventDefault();
                e.stopPropagation();
                const postId = parseInt(e.target.getAttribute('data-post-id'));
                this.deletePost(postId);
                return;
            }

            // Post card click (for reading)
            const postCard = e.target.closest('.post-card');
            if (postCard && !e.target.matches('.action-btn')) {
                e.preventDefault();
                const postId = parseInt(postCard.getAttribute('data-post-id'));
                this.openReadModal(postId);
                return;
            }
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchPosts(e.target.value);
            });
        }

        // Form submission
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setInitialTheme() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const themeIcon = document.querySelector('.theme-icon');
        
        if (prefersDark) {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
            if (themeIcon) themeIcon.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-color-scheme', 'light');
            if (themeIcon) themeIcon.textContent = '🌙';
        }
    }

    toggleTheme() {
        const currentScheme = document.documentElement.getAttribute('data-color-scheme');
        const themeIcon = document.querySelector('.theme-icon');
        
        if (currentScheme === 'dark') {
            document.documentElement.setAttribute('data-color-scheme', 'light');
            if (themeIcon) themeIcon.textContent = '🌙';
        } else {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
            if (themeIcon) themeIcon.textContent = '☀️';
        }
    }

    setActiveNavLink(category) {
        document.querySelectorAll('.nav__link[data-category]').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-category="${category}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    filterPosts(category) {
        this.currentFilter = category;
        this.setActiveNavLink(category);
        this.renderPosts();
    }

    searchPosts(query) {
        this.currentSearch = query.toLowerCase().trim();
        this.renderPosts();
    }

    getFilteredPosts() {
        let filteredPosts = [...this.posts];

        // Apply category filter
        if (this.currentFilter && this.currentFilter !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === this.currentFilter);
        }

        // Apply search filter
        if (this.currentSearch) {
            filteredPosts = filteredPosts.filter(post => 
                post.title.toLowerCase().includes(this.currentSearch) ||
                post.content.toLowerCase().includes(this.currentSearch) ||
                post.excerpt.toLowerCase().includes(this.currentSearch) ||
                post.category.toLowerCase().includes(this.currentSearch)
            );
        }

        return filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    renderPosts() {
        const postsGrid = document.getElementById('postsGrid');
        const emptyState = document.getElementById('emptyState');
        
        if (!postsGrid || !emptyState) return;

        const filteredPosts = this.getFilteredPosts();

        if (filteredPosts.length === 0) {
            postsGrid.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        postsGrid.innerHTML = filteredPosts.map(post => this.createPostCard(post)).join('');
    }

    createPostCard(post) {
        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        return `
            <article class="post-card" data-post-id="${post.id}">
                <div class="post-card__header">
                    <span class="post-card__category">${post.category}</span>
                    <h3 class="post-card__title">${post.title}</h3>
                    <p class="post-card__excerpt">${post.excerpt}</p>
                </div>
                <div class="post-card__footer">
                    <div class="post-card__meta">
                        <span>${formattedDate}</span>
                        <span>${post.readTime}</span>
                    </div>
                    <div class="post-card__actions">
                        <button class="action-btn edit-btn" data-post-id="${post.id}">Edit</button>
                        <button class="action-btn delete-btn" data-post-id="${post.id}">Delete</button>
                    </div>
                </div>
            </article>
        `;
    }

    openWriteModal() {
        const writeModal = document.getElementById('writeModal');
        if (!writeModal) return;
        
        this.editingPostId = null;
        const modalTitle = document.getElementById('modalTitle');
        const saveBtn = document.getElementById('saveBtn');
        
        if (modalTitle) modalTitle.textContent = 'Write New Post';
        if (saveBtn) saveBtn.textContent = 'Publish';
        
        this.clearForm();
        writeModal.classList.remove('hidden');
        
        // Focus on title input
        setTimeout(() => {
            const titleInput = document.getElementById('postTitle');
            if (titleInput) titleInput.focus();
        }, 100);
    }

    editPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const writeModal = document.getElementById('writeModal');
        if (!writeModal) return;

        this.editingPostId = postId;
        const modalTitle = document.getElementById('modalTitle');
        const saveBtn = document.getElementById('saveBtn');
        
        if (modalTitle) modalTitle.textContent = 'Edit Post';
        if (saveBtn) saveBtn.textContent = 'Update';
        
        // Fill form with post data
        const titleInput = document.getElementById('postTitle');
        const categorySelect = document.getElementById('postCategory');
        const excerptTextarea = document.getElementById('postExcerpt');
        const contentTextarea = document.getElementById('postContent');
        
        if (titleInput) titleInput.value = post.title;
        if (categorySelect) categorySelect.value = post.category;
        if (excerptTextarea) excerptTextarea.value = post.excerpt;
        if (contentTextarea) contentTextarea.value = post.content;
        
        writeModal.classList.remove('hidden');
    }

    deletePost(postId) {
        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            this.posts = this.posts.filter(post => post.id !== postId);
            this.renderPosts();
            this.showNotification('Post deleted successfully');
        }
    }

    openReadModal(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const readModal = document.getElementById('readModal');
        const articleContent = document.getElementById('articleContent');
        
        if (!readModal || !articleContent) return;

        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        articleContent.innerHTML = `
            <div class="article__header">
                <span class="article__category">${post.category}</span>
                <h1 class="article__title">${post.title}</h1>
                <div class="article__meta">
                    <span>${formattedDate}</span>
                    <span>${post.readTime}</span>
                </div>
            </div>
            <div class="article__content">
                ${post.content.split('\n\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
            </div>
        `;

        readModal.classList.remove('hidden');
    }

    closeWriteModal() {
        const writeModal = document.getElementById('writeModal');
        if (writeModal) {
            writeModal.classList.add('hidden');
            this.clearForm();
        }
    }

    closeReadModal() {
        const readModal = document.getElementById('readModal');
        if (readModal) {
            readModal.classList.add('hidden');
        }
    }

    closeAllModals() {
        this.closeWriteModal();
        this.closeReadModal();
    }

    clearForm() {
        const postForm = document.getElementById('postForm');
        if (postForm) {
            postForm.reset();
        }
        this.editingPostId = null;
    }

    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.trim().split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        return `${readTime} min read`;
    }

    handleFormSubmission() {
        const titleInput = document.getElementById('postTitle');
        const categorySelect = document.getElementById('postCategory');
        const excerptTextarea = document.getElementById('postExcerpt');
        const contentTextarea = document.getElementById('postContent');

        if (!titleInput || !categorySelect || !excerptTextarea || !contentTextarea) {
            alert('Form elements not found');
            return;
        }

        const postData = {
            title: titleInput.value.trim(),
            category: categorySelect.value,
            excerpt: excerptTextarea.value.trim(),
            content: contentTextarea.value.trim()
        };

        // Validation
        if (!postData.title || !postData.category || !postData.excerpt || !postData.content) {
            alert('Please fill in all fields.');
            return;
        }

        if (postData.excerpt.length > 200) {
            alert('Please keep the excerpt under 200 characters.');
            return;
        }

        if (this.editingPostId) {
            // Update existing post
            const postIndex = this.posts.findIndex(p => p.id === this.editingPostId);
            if (postIndex !== -1) {
                this.posts[postIndex] = {
                    ...this.posts[postIndex],
                    ...postData,
                    readTime: this.calculateReadTime(postData.content)
                };
            }
        } else {
            // Create new post
            const newPost = {
                id: this.nextId++,
                ...postData,
                readTime: this.calculateReadTime(postData.content),
                date: new Date().toISOString().split('T')[0]
            };
            this.posts.unshift(newPost);
        }

        this.renderPosts();
        this.closeWriteModal();
        
        // Show success message
        this.showNotification(this.editingPostId ? 'Post updated successfully!' : 'Post published successfully!');
    }

    showNotification(message) {
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        });

        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-success);
            color: var(--color-btn-primary-text);
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            font-weight: 500;
            transition: all 0.3s ease;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ThoughtScapeBlog();
    app.init();
});